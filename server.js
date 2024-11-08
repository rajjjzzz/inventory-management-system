// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const InventoryItem = require('./models/InventoryItem');

// Initialize the Express app
const app = express();
app.use(bodyParser.json());

// server.js (add this to serve static files)
const path = require('path');
app.use(express.static(path.join(__dirname, 'frontend')));


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/inventory', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

// Root route to avoid "Cannot GET /" error
app.get('/', (req, res) => {
  res.send('Welcome to the Inventory Management System!');
});

// CRUD Routes

// 1. Create an inventory item
app.post('/api/inventory', async (req, res) => {
  try {
    const { name, quantity, price } = req.body;
    const newItem = new InventoryItem({ name, quantity, price });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 2. Get all inventory items
app.get('/api/inventory', async (req, res) => {
  try {
    const items = await InventoryItem.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get a single inventory item by ID
app.get('/api/inventory/:id', async (req, res) => {
  try {
    const item = await InventoryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Update an inventory item by ID
app.put('/api/inventory/:id', async (req, res) => {
  try {
    const { name, quantity, price } = req.body;
    const updatedItem = await InventoryItem.findByIdAndUpdate(
      req.params.id,
      { name, quantity, price },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5. Delete an inventory item by ID
app.delete('/api/inventory/:id', async (req, res) => {
    try {
      const deletedItem = await InventoryItem.findByIdAndDelete(req.params.id);
      if (!deletedItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
