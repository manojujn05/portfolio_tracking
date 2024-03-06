const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/PortfolioRoutes');

const app = express();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/portfolio_tracking')
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server after connecting to the database
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Use routes defined in separate file
app.use('/portfolio', routes);

module.exports = app; // Export the app for testing purposes
