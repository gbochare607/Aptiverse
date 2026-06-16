import {
    AcademicCapIcon,
    LightBulbIcon,
    ChatBubbleBottomCenterTextIcon,
    ChartPieIcon,
} from '@heroicons/react/24/outline';

export const categoryMap = {
    quantitative: {
        name: 'Quantitative',
        gradient: 'from-blue-500/20 to-cyan-500/20',
        accent: 'text-blue-500',
        bgAccent: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
        icon: AcademicCapIcon
    },
    logical: {
        name: 'Logical',
        gradient: 'from-purple-500/20 to-pink-500/20',
        accent: 'text-purple-500',
        bgAccent: 'bg-purple-500/10',
        borderColor: 'border-purple-500/20',
        icon: LightBulbIcon
    },
    verbal: {
        name: 'Verbal',
        gradient: 'from-emerald-500/20 to-teal-500/20',
        accent: 'text-emerald-500',
        bgAccent: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/20',
        icon: ChatBubbleBottomCenterTextIcon
    },
    data: {
        name: 'Data & DI',
        gradient: 'from-orange-500/20 to-amber-500/20',
        accent: 'text-orange-500',
        bgAccent: 'bg-orange-500/10',
        borderColor: 'border-orange-500/20',
        icon: ChartPieIcon
    },
};

export const allTopics = [
    { id: 'number-system', name: 'Number System', cat: 'quantitative', youtubeId: 'lP1-G-lJ-l0', summary: '• Prime & Composite numbers\n• Divisibility rules\n• LCM & HCF concepts\n• Unit digit calculation' },
    { id: 'percentages', name: 'Percentages', cat: 'quantitative', youtubeId: '6ZpREv-jZf8', summary: '• Fraction to Percentage conversion\n• Percentage change formula\n• Successive percentage changes\n• Application in Profit & Loss' },
    { id: 'profit-loss', name: 'Profit & Loss', cat: 'quantitative', youtubeId: 'WMT_yFvO0Y8', summary: '• Cost Price & Selling Price basics\n• Profit/Loss % calculation\n• Discount & Marked Price\n• Successive discounts' },
    { id: 'ratio-proportion', name: 'Ratio & Prop', cat: 'quantitative', youtubeId: '5gU6n4W2Z-o', summary: '• Comparison of ratios\n• Duplicate & Sub-duplicate ratios\n• Mean proportions\n• Partnership problems' },
    { id: 'time-work', name: 'Time & Work', cat: 'quantitative', youtubeId: 'qM7L2vW5A68', summary: '• Work = Rate × Time\n• Efficiency and Wages\n• Combined work logic\n• Pipes & Cisterns application' },
    { id: 'time-distance', name: 'Time & Dist', cat: 'quantitative', youtubeId: 'j6v-gXoU4N4', summary: '• Speed = Distance / Time\n• Average speed formula\n• Relative speed (Trains/Boats)\n• Unit conversions (km/h to m/s)' },
    { id: 'algebra', name: 'Algebra', cat: 'quantitative', youtubeId: 'x1W0_S_b-fU', summary: '• Linear & Quadratic equations\n• Factorization methods\n• Polynomials & Identities\n• Algebraic expressions' },
    { id: 'geometry', name: 'Geometry', cat: 'quantitative', youtubeId: '_3V8C8h9f0E', summary: '• Lines & Angles properties\n• Triangle properties (Congruence)\n• Circle theorems\n• Mensuration mapping' },
    { id: 'probability', name: 'Probability', cat: 'quantitative', youtubeId: 'skO_Hw6_l6w', summary: '• Sample space & Events\n• Independent & mutually exclusive events\n• Cards, Dice & Coin problems\n• Bayes\' Theorem basics' },
    { id: 'si-ci', name: 'SI & CI', cat: 'quantitative', youtubeId: 'u_t9P7iH-wI', summary: '• Simple Interest basics\n• Compound Interest (Annual/Half-yearly)\n• Difference between SI and CI\n• Installment calculations' },
    { id: 'arithmetic', name: 'Arithmetic', cat: 'quantitative', youtubeId: '8mI7oSTrC_A', summary: '• Basics of all arithmetic operations\n• BODMAS/PEMDAS rules\n• Square roots & Cube roots\n• Average & Alligation' },
    { id: 'blood-relations', name: 'Blood Relations', cat: 'logical', youtubeId: 'zK5WJm5Yy9I', summary: '• Family tree representation\n• Generation gaps mapping\n• Coded relations interpretation\n• Direct & Indirect relations' },
    { id: 'coding-decoding', name: 'Coding-Decoding', cat: 'logical', youtubeId: 's9YlK6l1jF8', summary: '• Letter coding (Forward/Backward)\n• Number coding patterns\n• Substitution coding\n• Matrix coding basics' },
    { id: 'syllogism', name: 'Syllogism', cat: 'logical', youtubeId: 'tF1L0d-xG-w', summary: '• Venn Diagram approach\n• Standard statements (All, Some, No)\n• Possibility cases\n• Reverse Syllogism basics' },
    { id: 'series', name: 'Series', cat: 'logical', youtubeId: '_3V8C8h9f0E', summary: '• Number series patterns\n• Alphabet series logic\n• Continuous pattern series\n• Mixed & Alternating series' },
    { id: 'seating', name: 'Seating Arrangement', cat: 'logical', youtubeId: 'qO-v5y5i3B8', summary: '• Linear and Circular arrangements\n• Facing Inside vs Facing Outside\n• Double row arrangements\n• Distribution puzzles' },
    { id: 'puzzles', name: 'Puzzles', cat: 'logical', youtubeId: 'V9p7j8j-o5w', summary: '• Floor-based puzzles\n• Box & Color puzzles\n• Scheduling (Week/Month)\n• Relationship + Direct information' },
    { id: 'analogies', name: 'Analogies', cat: 'logical', youtubeId: 'V9p7j8j-o5w', summary: '• Word based analogies\n• Number based logic\n• Symbolic & Abstract reasoning\n• Relationship identification' },
    { id: 'synonyms-antonyms', name: 'Syn/Antonyms', cat: 'verbal', youtubeId: '8e9-U_P_N_c', summary: '• Contextual meaning of words\n• Root words & Affixes\n• Eliminating distractors\n• Common GRE/TOEFL vocabulary' },
    { id: 'grammar', name: 'Grammar', cat: 'verbal', youtubeId: 'T8nL5nS-f-4', summary: '• Parts of Speech identification\n• Subject-Verb agreement\n• Tenses & Direct/Indirect speech\n• Sentence structure & Correction' },
    { id: 'cloze-test', name: 'Cloze Test', cat: 'verbal', youtubeId: 'T8nL5nS-f-4', summary: '• Contextual word selection\n• Logical flow of sentences\n• Vocabulary + Grammar application\n• Passage tone identification' },
    { id: 'reading-comp', name: 'RC Passage', cat: 'verbal', youtubeId: 'T8nL5nS-f-4', summary: '• Skimming & Scanning techniques\n• Main idea vs Supporting details\n• Inference based questions\n• Vocabulary in context' },
    { id: 'vocabulary', name: 'Vocabulary', cat: 'verbal', youtubeId: '8e9-U_P_N_c', summary: '• Word usage in sentences\n• Idioms & Phrases\n• One-word substitutions\n• Spelling & Homonyms' },
    { id: 'data-interpretation', name: 'Data Interpretation', cat: 'data', youtubeId: 'cM9j-r9-y-w', summary: '• Percentage & Ratio calculation\n• Average of data points\n• Calculating growth rates\n• Units & Measurement precision' },
    { id: 'charts', name: 'Charts & Graphs', cat: 'data', youtubeId: 'cM9j-r9-y-w', summary: '• Bar graph interpretation\n• Line graph trends\n• Pie chart degree-to-% conversion\n• Radar & Scatter plots' },
    { id: 'tables', name: 'Tabular Data', cat: 'data', youtubeId: 'cM9j-r9-y-w', summary: '• Row/Column data extraction\n• Comparative analysis (Min/Max)\n• Aggregation of data columns\n• Missing data estimation' },
];
