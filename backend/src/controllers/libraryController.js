const LibraryItem = require('../models/LibraryItem');

// @desc Get all library items
// @route GET /api/library
// @access Private
exports.getLibraryItems = async (req, res) => {
    try {
        const { topic, type } = req.query;
        let query = {};
        if (topic) query.topic = topic;
        if (type) query.type = type;

        const items = await LibraryItem.find(query).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Add a new library item (Admin only)
// @route POST /api/library
// @access Private/Admin
exports.addLibraryItem = async (req, res) => {
    try {
        const { title, description, type, url, thumbnail, topic, category, duration } = req.body;
        
        const newItem = new LibraryItem({
            title,
            description,
            type,
            url,
            thumbnail,
            topic,
            category,
            duration
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc Delete a library item (Admin only)
// @route DELETE /api/library/:id
// @access Private/Admin
exports.deleteLibraryItem = async (req, res) => {
    try {
        const item = await LibraryItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        await item.deleteOne();
        res.json({ message: 'Item removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
