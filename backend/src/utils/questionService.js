const axios = require('axios');
const Question = require('../models/Question');
const crypto = require('crypto');

/**
 * Enhanced Question Service ETL
 * Fetches questions from external APIs, transforms them, and loads into MongoDB.
 */
const fetchAndStoreQuestions = async (topic, count = 10) => {
    try {
        console.log(`[ETL] Starting Extraction for: ${topic} (count: ${count})`);

        // Comprehensive mapping for the ETL process
        const categoryMap = {
            // Quantitative
            'number-system': 19, 'percentages': 19, 'profit-loss': 19, 'ratio-proportion': 19,
            'time-work': 19, 'time-distance': 19, 'algebra': 19, 'geometry': 19,
            'probability': 19, 'si-ci': 19, 'arithmetic': 19, 'quantitative': 19,
            // Logical
            'blood-relations': 18, 'coding-decoding': 18, 'syllogism': 18, 'series': 18,
            'seating': 18, 'puzzles': 18, 'analogies': 18, 'logical': 18, 'reasoning': 18,
            // Verbal
            'synonyms-antonyms': 10, 'grammar': 10, 'cloze-test': 10, 'reading-comp': 10,
            'vocabulary': 10, 'verbal': 10, 'english': 10,
            // Data
            'data-interpretation': 19, 'charts': 19, 'tables': 19, 'data': 19
        };

        const lowerTopic = topic.toLowerCase().trim();
        let categoryId = 9; // General Knowledge fallback

        // Find the best matching category from our map
        for (const [key, id] of Object.entries(categoryMap)) {
            if (lowerTopic === key || lowerTopic.includes(key)) {
                categoryId = id;
                break;
            }
        }

        const url = `https://opentdb.com/api.php?amount=${count}&category=${categoryId}&type=multiple`;
        const response = await axios.get(url);

        if (response.data.response_code !== 0) {
            console.warn(`[ETL] API returned code ${response.data.response_code}. No questions fetched.`);
            return [];
        }

        const newQuestions = [];

        // Category Groups
        const categoryGroups = {
            'Quantitative': ['number-system', 'percentages', 'profit-loss', 'ratio-proportion', 'time-work', 'time-distance', 'algebra', 'geometry', 'probability', 'si-ci', 'arithmetic', 'quantitative'],
            'Logical': ['blood-relations', 'coding-decoding', 'syllogism', 'series', 'seating', 'puzzles', 'analogies', 'logical', 'reasoning'],
            'Verbal': ['synonyms-antonyms', 'grammar', 'cloze-test', 'reading-comp', 'vocabulary', 'verbal', 'english'],
            'Data': ['data-interpretation', 'charts', 'tables', 'data']
        };

        // Determine Category and Subtopic
        let mainCategory = 'General';
        const normalizedTopic = topic.toLowerCase().trim();

        for (const [cat, subs] of Object.entries(categoryGroups)) {
            if (subs.includes(normalizedTopic)) {
                mainCategory = cat;
                break;
            }
        }

        // Keywords for strict filtering
        const topicKeywords = {
            'geometry': ['angle', 'triangle', 'circle', 'area', 'volume', 'perimeter', 'geometry', 'shape'],
            'algebra': ['equation', 'x', 'y', 'variable', 'algebra', 'polynomial', 'quadratic'],
            'percentages': ['percent', '%', 'interest', 'rate'],
            'profit-loss': ['profit', 'loss', 'cost', 'price'],
            'number-system': ['number', 'integer', 'digit', 'prime', 'divisible', 'remainder'],
            'probability': ['probability', 'chance', 'odds', 'dice', 'card'],
            'time-work': ['work', 'day', 'hour', 'job', 'efficiency'],
            'blood-relations': ['mother', 'father', 'sister', 'brother', 'uncle', 'aunt', 'relation'],
            'coding-decoding': ['code', 'decode'],
            'syllogism': ['statement', 'conclusion', 'follow'],
            // Add more as needed, default to loose matching if not defined
        };

        for (const item of response.data.results) {
            // Transformation Layer
            const cleanedText = decodeHtml(item.question);
            const lowerText = cleanedText.toLowerCase();

            // Strict Keyword Filtering
            // Only apply if we have keywords defined for this topic
            if (topicKeywords[topic] && topicKeywords[topic].length > 0) {
                const hasKeyword = topicKeywords[topic].some(k => lowerText.includes(k));
                if (!hasKeyword) {
                    // console.log(`[ETL] Skipping irrelevant question for ${topic}: ${cleanedText.substring(0, 30)}...`);
                    continue;
                }
            }

            // Deduplication: Check if question exists by normalized text hash
            const qHash = crypto.createHash('sha256').update(cleanedText).digest('hex').substring(0, 8);
            const questionId = `api_${qHash}`;

            const existing = await Question.findOne({ $or: [{ questionId }, { text: cleanedText }] });
            if (existing) {
                console.log(`[ETL] Skipping duplicate: ${questionId}`);
                continue;
            }

            // Options Transformation
            const rawOptions = [...item.incorrect_answers, item.correct_answer];
            const shuffledOptions = rawOptions
                .sort(() => Math.random() - 0.5)
                .map((text, index) => ({
                    id: index + 1,
                    text: decodeHtml(text)
                }));

            const correctOptionId = shuffledOptions.find(o => o.text === decodeHtml(item.correct_answer)).id;

            // Difficulty Normalization (0-1 scale)
            const difficultyMap = { 'easy': 0.3, 'medium': 0.6, 'hard': 0.9 };
            const normalizedDifficulty = difficultyMap[item.difficulty] || 0.5;

            // Load into MongoDB
            const newQ = await Question.create({
                questionId,
                text: cleanedText,
                options: shuffledOptions,
                correctOption: correctOptionId,
                topics: [topic], // STRICT: Only the specific subtopic, as per user request
                category: mainCategory,
                explanation: `The correct answer is ${decodeHtml(item.correct_answer)}. Review the concept of ${topic} to understand why.`,
                difficulty: normalizedDifficulty,
                source: 'API',
                validated: true,
                version: 'v2.1' // Marking as processed by new ETL
            });

            newQuestions.push(newQ);
        }

        console.log(`[ETL] Success: Loaded ${newQuestions.length} questions into DB.`);
        return newQuestions;

    } catch (error) {
        console.error(`[ETL] Error: ${error.message}`);
        if (error.response && error.response.status === 429) {
            throw error; // Propagate rate limit error
        }
        return [];
    }
};

/**
 * Helper to decode HTML entities from API response
 */
function decodeHtml(html) {
    if (!html) return '';
    return html
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&deg;/g, "°")
        .replace(/&rsquo;/g, "'")
        .replace(/&lsquo;/g, "'")
        .replace(/&ldquo;/g, '"')
        .replace(/&rdquo;/g, '"')
        .replace(/&ndash;/g, "-")
        .replace(/&mdash;/g, "-");
}

module.exports = {
    fetchAndStoreQuestions
};
