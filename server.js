const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection with better error handling
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

console.log('🔄 Connecting to MongoDB...');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Full error:', err);
  });

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  preferences: Object,
  chatHistory: Array
});

const User = mongoose.model('User', userSchema);

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Chatbot API is running',
    mongoStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Chatbot endpoint
app.post('/api/chat', async (req, res) => {
  const { message, userId } = req.body;
  
  try {
    const response = await processChatMessage(message, userId);
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      response: "Sorry, I'm having trouble right now. Please try again or contact support." 
    });
  }
});

// Process Chat Messages
async function processChatMessage(message, userId) {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
    return 'Hello! Welcome to our store. How can I help you today?';
  }
  
  if (lowerMsg.includes('product') || lowerMsg.includes('looking for')) {
    return 'What type of product are you looking for? We have electronics, clothing, and home items.';
  }
  
  if (lowerMsg.includes('price') || lowerMsg.includes('cost')) {
    return 'Could you tell me which product you want to know the price for?';
  }
  
  if (lowerMsg.includes('order') || lowerMsg.includes('track')) {
    return 'Please provide your order number, and I will check the status for you.';
  }
  
  if (lowerMsg.includes('return') || lowerMsg.includes('refund')) {
    return 'Our return policy allows returns within 30 days. Would you like to initiate a return?';
  }
  
  return 'I can help you with products, prices, orders, and returns. What would you like to know?';
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});