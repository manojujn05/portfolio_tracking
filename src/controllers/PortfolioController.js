const { Stock, Trade, Portfolio } = require('../PortfolioModels');

// Function to get all the stocks
exports.getStock = async (req, res) => {
  try {
    const stocks = await Stock.find({}).exec();
    console.log(stocks);
    res.json({ success: true, data: stocks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Function to get all the trades
exports.getTrade = async (req, res) => {
  try {
    const { user_id } = req.params; 
    const trades = await Trade.find({ user_id }).exec();
    res.json({ success: true, data: trades });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Add trade function
exports.addTrade = async (req, res) => {
  try {
    console.log(req.body);
    const { userId, stockId, date, price, quantity, type } = req.body;
   
    // Create a new trade document with the userId
    const newTrade = new Trade({
      userId,
      stockId,
      date,
      price,
      quantity,
      type
    });

    // Save the new trade document to the database
    const savedTrade = await newTrade.save();
    res.json({ success: true, data: savedTrade });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update trade function
exports.updateTrade = async (req, res) => {
  try {
    const { tradeId } = req.params; 
    const { userId, stockId, date, price,quantity, type } = req.body;

    let trade = await Trade.findById(tradeId);

    if (!trade) {
      return res.status(404).json({ success: false, error: 'Trade not found' });
    }

    trade.stockId = stockId;
    trade.userId = userId;
    trade.date = date;
    trade.price = price;
    trade.quantity = quantity;
    trade.type = type;

    // Save the updated trade document to the database
    const updatedTrade = await trade.save();
    res.json({ success: true, data: updatedTrade });
  } catch (err) {
    // Handle errors
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete trade function
exports.deleteTrade = async (req, res) => {
  try {
    const { tradeId } = req.params;
    const deletedTrade = await Trade.findByIdAndDelete(tradeId);

    if (!deletedTrade) {
      return res.status(404).json({ success: false, error: 'Trade not found' });
    }

    res.json({ success: true, data: deletedTrade });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

//Get Portfolio function
exports.getPortfolio = async (req, res) => {
  try {
    const trades = await Trade.find();
    const portfolioMap = {};

    // Calculate net quantities and prices for each stock
    trades.forEach(trade => {
      const { stockId, userId, quantity, price, type } = trade;
      
      if (!portfolioMap[stockId]) {
        portfolioMap[stockId] = { netQuantity: 0, totalValue: 0, userId, stockId };
      }

      const stockInfo = portfolioMap[stockId];
      
      if (type === 'BUY') {
        stockInfo.netQuantity += quantity;
        stockInfo.totalValue += price * quantity;
      } else if (type === 'SELL') {
        stockInfo.netQuantity -= quantity;
        stockInfo.totalValue -= price * quantity;
      }

      portfolioMap[stockId] = stockInfo;
    });

    const portfolio = Object.values(portfolioMap).map(stockInfo => ({
      stock_id: stockInfo.stockId,
      user_id: stockInfo.userId,
      netQuantity: stockInfo.netQuantity,
      averagePrice: stockInfo.netQuantity !== 0 ? stockInfo.totalValue / stockInfo.netQuantity : 0
    }));

    res.json({ success: true, data: portfolio });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.calculateCumulativeReturns = async (req, res) => {
  try {
    const trades = await Trade.find();
    const cumulativeReturns = {};

    // Calculate net quantities and cumulative returns for each user and stock
    trades.forEach(trade => {
      const { userId, stockId, quantity, price, type } = trade;

      const key = `${userId}-${stockId}`;

      if (!cumulativeReturns[key]) {
        cumulativeReturns[key] = { userId, stockId, netQuantity: 0, totalReturns: 0, totalBuyPrice: 0, totalSellPrice: 0 };
      }
     
      const stockReturns = cumulativeReturns[key];
      
      if (type === 'BUY') {
        stockReturns.netQuantity += quantity;
        stockReturns.totalBuyPrice += quantity * price;
      } else if (type === 'SELL') {
        stockReturns.netQuantity -= quantity;
        if (stockReturns.netQuantity < 0) {
          console.error('Invalid trade: Selling more quantity than bought');
          return; // Skip processing this trade
        }
        stockReturns.totalSellPrice += quantity * price;
      }

      // Calculate total returns using net quantity and average price
      const totalBuyCost = stockReturns.totalBuyPrice;
      const totalSellValue = stockReturns.totalSellPrice;
      const averagePrice = totalBuyCost / (stockReturns.netQuantity + 1e-10); // Add small epsilon to avoid division by zero
      stockReturns.totalReturns = totalSellValue - totalBuyCost;
      
      cumulativeReturns[key] = stockReturns;
    });

    // Convert cumulativeReturns object to array
    const cumulativeReturnsArray = Object.values(cumulativeReturns);
    res.json({ success: true, data: cumulativeReturnsArray });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};


