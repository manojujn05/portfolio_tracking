const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/PortfolioRoutes');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Use routes defined in PortfolioRoutes.js
app.use('/portfolio', routes);

module.exports = app; 

