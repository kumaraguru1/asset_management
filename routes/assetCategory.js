const express = require('express');
const router = express.Router();
const controller = require('../controllers/assetCategoryController');

// Show all categories
router.get('/', controller.index);

// Show create form
router.get('/new', controller.new);

// Create category
router.post('/', controller.create);

// Show edit form
router.get('/:id/edit', controller.edit);

// Update category
router.post('/:id', controller.update);

// Delete category
router.get('/:id/delete', controller.delete);

module.exports = router;
