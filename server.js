const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'your-mongodb-connection-string')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  preferences: Object,
  chatHistory: Array
});

const User = mongoose.model('User', userSchema);

// Chatbot Logic
app.post('/api/chat', async (req, res) => {
  const { message, userId } = req.body;
  
  try {
    const response = await processChatMessage(message, userId);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ 
      response: "Sorry, I'm having trouble right now. Please try again or contact support at support@example.com" 
    });
  }
});

// Process Chat Messages
async function processChatMessage(message, userId) {
  const lowerMsg = message.toLowerCase();
  
  // Greeting
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
    return 'Hello! Welcome to our store. How can I help you today?';
  }
  
  // Product Search
  if (lowerMsg.includes('product') || lowerMsg.includes('looking for')) {
    return 'What type of product are you looking for? We have electronics, clothing, and home items.';
  }
  
  // Price Inquiry
  if (lowerMsg.includes('price') || lowerMsg.includes('cost')) {
    return 'Could you tell me which product you want to know the price for?';
  }
  
  // Order Status
  if (lowerMsg.includes('order') || lowerMsg.includes('track')) {
    return 'Please provide your order number, and I will check the status for you.';
  }
  
  // Return/Refund
  if (lowerMsg.includes('return') || lowerMsg.includes('refund')) {
    return 'Our return policy allows returns within 30 days. Would you like to initiate a return?';
  }
  
  // Default Response
  return 'I can help you with products, prices, orders, and returns. What would you like to know?';
}

// Save User Data
app.post('/api/user', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ success: true, userId: user._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save user data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});