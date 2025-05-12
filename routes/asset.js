const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');

// List all assets
router.get('/', assetController.index);

// Show form for creating a new asset
router.get('/new', assetController.new);

// Create a new asset
router.post('/', assetController.create);

// Show form for editing an asset
router.get('/:id/edit', assetController.edit);

// Update an existing asset
router.post('/:id', assetController.update);  // Consider changing to PUT/PATCH

// Delete an asset (use DELETE method)
router.get('/:id/delete', assetController.delete); // Consider changing to DELETE

router.get('/stock', assetController.stockView.bind(assetController));

module.exports = router;
