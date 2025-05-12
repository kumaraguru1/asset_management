const { Asset, AssetCategory } = require('../models');
const moment = require('moment');
const { Op, Sequelize } = require('sequelize');

class AssetController {
  // List all assets with optional search & category filter
  async index(req, res) {
    try {
      const { search, category } = req.query;

      const whereClause = {};
      if (search) {
        whereClause[Op.or] = [
          { make: { [Op.iLike]: `%${search}%` } },
          { model: { [Op.iLike]: `%${search}%` } }
        ];
      }
      if (category) {
        whereClause.category_id = category;
      }

      const assets = await Asset.findAll({
        where: whereClause,
        include: AssetCategory
      });

      const categories = await AssetCategory.findAll();
      const formattedAssets = assets.map(asset => {
        return {
          ...asset.toJSON(),
          formattedPurchaseDate: moment(asset.purchase_date).format('DD-MM-YYYY HH:mm:ss')
        };
      });

      res.render('assets/index', {
        assets: formattedAssets,
        categories,
        search,
        selectedCategory: category || ''
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }

  // Show form to create a new asset
  async new(req, res) {
    const categories = await AssetCategory.findAll();
    res.render('assets/form', {
      formTitle: 'Add Asset',
      formAction: '/assets',
      asset: {},
      categories
    });
  }

  // Store new asset
  async create(req, res) {
    try {
      const {
        serial_number,
        make,
        model,
        category_id,
        purchase_date,
        status,
        description,
        isActive,
      } = req.body;

      const parsedDate = moment(purchase_date, 'YYYY-MM-DD', true);
      if (!parsedDate.isValid()) {
        return res.status(400).json({ error: 'Invalid purchase date format. Use YYYY-MM-DD.' });
      }

      await Asset.create({
        unique_id: 'ASSET-' + Date.now(),
        serial_number,
        make,
        model,
        category_id: category_id || null,
        purchase_date: parsedDate.format('YYYY-MM-DD'),
        status,
        description,
        isActive: isActive !== undefined ? isActive : true,
      });

      res.redirect('/assets');
    } catch (error) {
      console.error('Error creating asset:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Show form to edit asset
  async edit(req, res) {
    const asset = await Asset.findByPk(req.params.id);
    const categories = await AssetCategory.findAll();

    if (!asset) return res.status(404).send('Asset not found');

    res.render('assets/form', {
      formTitle: 'Edit Asset',
      formAction: `/assets/${asset.id}?_method=PUT`,
      asset,
      categories
    });
  }

  // Update asset
  async update(req, res) {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) return res.status(404).send('Asset not found');

    await asset.update(req.body);
    res.redirect('/assets');
  }

  // Delete asset
  async delete(req, res) {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) return res.status(404).send('Asset not found');

    await asset.destroy();
    res.redirect('/assets');
  }

  // controllers/assetController.js

  async stockView(req, res) {
    try {
      const assets = await Asset.findAll({
        where: {
          status: 'in_stock',
          isActive: true,
        },
        include: [AssetCategory],
      });

      res.render('assets/stock', { assets });
    } catch (error) {
      console.error('Error fetching stock view:', error);
      res.status(500).send('Internal Server Error');
    }
  }



}

module.exports = new AssetController();
