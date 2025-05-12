// routes/transactionRoutes.js

const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/TransactionController');

router.get('/issue', transactionController.issueForm.bind(transactionController));
router.post('/issue', transactionController.issueAsset.bind(transactionController));
router.get('/return', transactionController.returnForm.bind(transactionController));
router.post('/return', transactionController.returnAsset.bind(transactionController));
router.get('/scrap', transactionController.scrapForm.bind(transactionController));
router.post('/scrap', transactionController.scrapAsset.bind(transactionController));
router.get('/history/:assetId', transactionController.assetHistory.bind(transactionController));
router.get('/', transactionController.listTransactions.bind(transactionController));

module.exports = router;
