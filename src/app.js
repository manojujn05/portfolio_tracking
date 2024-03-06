const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/PortfolioRoutes');

const app = express();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
// mongoose.connect('mongodb://127.0.0.1:27017/portfolio_tracking')
//   .then(() => {
//     console.log('Connected to MongoDB');
//     // Start the server after connecting to the database
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   })
//   .catch(err => console.error('Error connecting to MongoDB:', err));





const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://codeadventures05:<kLRkS1R7W8QoogOi>@cluster0.2f06lyi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
// Use routes defined in separate file
app.use('/portfolio', routes);

module.exports = app; // Export the app for testing purposes

