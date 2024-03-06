const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for User collection
const userSchema = new Schema({
  email: { type: String, required: true, unique: true }, // Add email field
  name: { type: String, required: true },
  password: { type: String, required: true }
});


// Schema for Stock collection
const stockSchema = new Schema({
    name: String
});

// Schema for Trade collection
const tradeSchema = new Schema({
    userId:  { type: Schema.Types.ObjectId, ref: 'User' },
    stockId: { type: Schema.Types.ObjectId, ref: 'Stock' },
    date: Date,
    price: Number,
    quantity: Number,
    type: { type: String, enum: ['BUY', 'SELL'] }
});

// Schema for Portfolio collection
const portfolioSchema = new Schema({
    userId: String,
    trades: [tradeSchema] // Embedding Trade schema as an array within Portfolio
});

const User = mongoose.model('User', userSchema);
const Stock = mongoose.model('Stock', stockSchema);
const Trade = mongoose.model('Trade', tradeSchema);
const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = { User, Stock, Trade, Portfolio };
