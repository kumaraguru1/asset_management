// controllers/TransactionController.js

const { sequelize, Asset, Employee, Transaction } = require('../models');
const { Op } = require('sequelize');


class TransactionController {
  async issueForm(req, res) {
    try {
      const employees = await Employee.findAll({ where: { isActive: true } });
      const assets = await Asset.findAll({ where: { status: 'available', isActive: true } });

      res.render('transactions/issue', { employees, assets });
    } catch (error) {
      console.error('Error loading issue form:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  async issueAsset(req, res) {
    const t = await sequelize.transaction(); // Start transaction
    try {
      const { employee_id, asset_id, transactionType, issueDate, reason } = req.body;

      console.log("Form Data Received:", req.body);

      if (!employee_id || !asset_id || !transactionType) {
        return res.status(400).send('Missing required fields');
      }

      await Asset.update(
        {
          status: 'assigned',
          assigned_to: employee_id,
        },
        { where: { id: asset_id }, transaction: t }
      );

      await Transaction.create({
        employee_id,
        asset_id,
        transactionType,
        issueDate: issueDate || new Date(),
        reason: reason || '',
      }, { transaction: t });

      await t.commit(); // Commit changes
      res.redirect('/transactions');
    } catch (error) {
      await t.rollback(); // Roll back changes
      console.error('Error issuing asset:', error);
      res.status(500).send('Internal Server Error');
    }
  }



  async returnForm(req, res) {
    try {
      const transactions = await Transaction.findAll({
        where: { transactionType: 'issue' },
        include: [Asset, Employee],
      });
      console.log(transactions);
      res.render('transactions/return', { transactions });
    } catch (error) {
      console.error('Error loading return form:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  async returnAsset(req, res) {
    try {
      const { transactionId, returnDate, returnReason } = req.body;

      const transaction = await Transaction.findByPk(transactionId);
      if (!transaction) {
        return res.status(404).send('Transaction not found');
      }

      // Update asset status
      await Asset.update({ status: 'available' }, { where: { id: transaction.asset_id } });

      // Create return transaction
      await Transaction.create({
        asset_id: transaction.asset_id,
        employee_id: transaction.employee_id,
        returnDate,
        reason,
        transactionType: 'return',
      });

      res.redirect('/transactions');
    } catch (error) {
      console.error('Error returning asset:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  async scrapForm(req, res) {
    try {
      const assets = await Asset.findAll({ where: { status: { [Op.ne]: 'scrapped' }, isActive: true } });

      res.render('transactions/scrap', { assets });
    } catch (error) {
      console.error('Error loading scrap form:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  async scrapAsset(req, res) {
    try {
      const { asset_id, scrapDate, scrapReason } = req.body;

      // Update asset status
      await Asset.update({ status: 'scrapped', isActive: false }, { where: { id: asset_id } });

      // Create scrap transaction
      await Transaction.create({
        asset_id,
        scrapDate,
        scrapReason,
        transactionType: 'scrap',
      });

      res.redirect('/transactions');
    } catch (error) {
      console.error('Error scrapping asset:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  async assetHistory(req, res) {
    try {
      const { assetId } = req.params;

      const asset = await Asset.findByPk(assetId); // Fetch the asset

      if (!asset) {
        return res.status(404).send('Asset not found');
      }

      const transactions = await Transaction.findAll({
        where: { asset_id: assetId },
        include: [Employee],
        order: [['createdAt', 'ASC']],
      });

      res.render('transactions/history', {
        asset,          // Pass asset to view
        transactions,
      });
    } catch (error) {
      console.error('Error fetching asset history:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  async listTransactions(req, res) {
    try {
      const transactions = await Transaction.findAll({
        include: [Asset, Employee],
        order: [['createdAt', 'DESC']]
      });

      res.render('transactions/index', { transactions });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).send('Internal Server Error');
    }
  }


}

module.exports = new TransactionController();
