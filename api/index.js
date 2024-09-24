const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const Transaction = require('./models/transaction.js');
const mongoose = require('mongoose');

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json('test ok90');
});

app.post('/api/transaction', async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);
  const { name, description, datetime, price } = req.body;
  const transaction = await Transaction.create({ name, description, datetime, price });
  res.json(transaction);
});

app.get('/api/transactions', async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);
  const transactions = await Transaction.find();
  res.json(transactions);
});

app.delete('/api/transaction/:id', async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);
  const transactionId = req.params.id;
  console.log("Transaction ID received for deletion:", transactionId); 
  try {
    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({ message: 'Invalid transaction ID' });
    }
    const result = await Transaction.deleteOne({ _id: transactionId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(204).send(); // No content to send back
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(4040, () => {
  console.log('Server is running on http://localhost:4040');
});
