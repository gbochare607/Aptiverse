const express = require('express');
const router = express.Router();
const { getLibraryItems, addLibraryItem, deleteLibraryItem } = require('../controllers/libraryController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getLibraryItems);
router.post('/', protect, addLibraryItem);
router.delete('/:id', protect, deleteLibraryItem);

module.exports = router;
