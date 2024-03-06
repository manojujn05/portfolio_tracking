const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/PortfolioController');

// route handlers
router.get('/stock', portfolioController.getStock);
router.get('/', portfolioController.getTrade);
router.post('/addTrade', portfolioController.addTrade);
router.delete('/removeTrade/:tradeId', portfolioController.deleteTrade);
router.put('/updateTrade/:tradeId', portfolioController.updateTrade);
router.get('/holdings', portfolioController.getPortfolio);
router.get('/returns', portfolioController.calculateCumulativeReturns);

module.exports = router;
