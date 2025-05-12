const { AssetCategory } = require('../models');

class AssetCategoryController {
  // List all categories
  async index(req, res) {
    try {
      const assetCategories = await AssetCategory.findAll();
      res.render('assetCategories/index', { assetCategories });
    } catch (err) {
      res.status(500).send('Server error');
    }
  }

  // Show form to create new category
  new(req, res) {
    res.render('assetCategories/form', {
      formTitle: 'Add Asset Category',
      formAction: '/asset-categories',
      category: {},
    });
  }

  // Create new category
  async create(req, res) {
    try {
      const { name, description } = req.body;
      await AssetCategory.create({ name, description });
      res.redirect('/asset-categories');
    } catch (err) {
      res.status(500).send('Failed to create category');
    }
  }

  // Show form to edit category
  async edit(req, res) {
    try {
      const category = await AssetCategory.findByPk(req.params.id);
      if (!category) return res.status(404).send('Not found');

      res.render('assetCategories/form', {
        formTitle: 'Edit Asset Category',
        formAction: `/asset-categories/${category.id}?_method=PUT`,
        category,
      });
    } catch (err) {
      res.status(500).send('Server error');
    }
  }

  // Update category
  async update(req, res) {
    try {
      const category = await AssetCategory.findByPk(req.params.id);
      if (!category) return res.status(404).send('Not found');

      await category.update(req.body);
      res.redirect('/asset-categories');
    } catch (err) {
      res.status(500).send('Failed to update category');
    }
  }

  // Soft delete category
  async delete(req, res) {
    try {
      const category = await AssetCategory.findByPk(req.params.id);
      if (!category) return res.status(404).send('Category not found');

      await category.destroy(); // Soft delete using `paranoid`
      res.redirect('/asset-categories');
    } catch (err) {
      res.status(500).send('Error deleting category: ' + err.message);
    }
  }
}

module.exports = new AssetCategoryController();
