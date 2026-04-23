const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection with better error handling
// MongoDB Connection with better error handling
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

console.log('🔄 Connecting to MongoDB...');
console.log('Full connection string:', MONGODB_URI);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
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
  
  // Greeting
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
    return 'Hello! Welcome to our store. We sell electronics including laptops, smartphones, headphones, smart watches, tablets, and cameras. How can I help you today?';
  }
  
  // What do you sell / Product catalog
  if (lowerMsg.includes('what do you sell') || lowerMsg.includes('what products') || lowerMsg.includes('what items')) {
    return 'We sell a variety of electronics:\n- Laptops ($999)\n- Smartphones ($699)\n- Headphones ($199)\n- Smart Watches ($299)\n- Tablets ($449)\n- Cameras ($799)\n\nWhich product interests you?';
  }
  
  // General product inquiry
  if (lowerMsg.includes('product') || lowerMsg.includes('looking for') || lowerMsg.includes('show me')) {
    return 'We have electronics, including laptops, smartphones, headphones, smart watches, tablets, and cameras. What are you looking for?';
  }
  
  // Laptop inquiry
  if (lowerMsg.includes('laptop')) {
    if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('how much')) {
      return 'Our laptop costs $999. It is a high-performance laptop perfect for work and gaming. Would you like to know more about its features?';
    }
    return 'We have a high-performance laptop for $999. It is great for work and gaming. Would you like to add it to your cart?';
  }
  
  // Smartphone inquiry
  if (lowerMsg.includes('phone') || lowerMsg.includes('smartphone') || lowerMsg.includes('mobile')) {
    if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('how much')) {
      return 'Our smartphone costs $699. It is the latest flagship model with an amazing camera. Interested?';
    }
    return 'We have the latest flagship smartphone for $699 with an amazing camera. Would you like more details?';
  }
  
  // Headphones inquiry
  if (lowerMsg.includes('headphone') || lowerMsg.includes('headset')) {
    if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('how much')) {
      return 'Our wireless noise-canceling headphones cost $199. Great sound quality!';
    }
    return 'We have wireless noise-canceling headphones for $199. Perfect for music lovers!';
  }
  
  // Smart watch inquiry
  if (lowerMsg.includes('watch') || lowerMsg.includes('smartwatch')) {
    if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('how much')) {
      return 'Our smart watch costs $299. It has fitness tracking and GPS features.';
    }
    return 'We have a fitness tracking smartwatch with GPS for $299. Great for staying active!';
  }
  
  // Tablet inquiry
  if (lowerMsg.includes('tablet') || lowerMsg.includes('ipad')) {
    if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('how much')) {
      return 'Our tablet costs $449. Perfect for entertainment and productivity.';
    }
    return 'We have a portable tablet for $449, great for entertainment and work!';
  }
  
  // Camera inquiry
  if (lowerMsg.includes('camera')) {
    if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('how much')) {
      return 'Our professional camera costs $799. It is a high-quality mirrorless camera.';
    }
    return 'We have a professional mirrorless camera for $799. Perfect for photography enthusiasts!';
  }
  
  // General price inquiry
  if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('how much')) {
    return 'Our prices range from $199 to $999:\n- Headphones: $199\n- Smart Watch: $299\n- Tablet: $449\n- Smartphone: $699\n- Camera: $799\n- Laptop: $999\n\nWhich product would you like to know more about?';
  }
  
  // Order tracking
  if (lowerMsg.includes('order') || lowerMsg.includes('track') || lowerMsg.includes('delivery')) {
    return 'To track your order, please provide your order number (e.g., #12345). You can find it in your confirmation email.';
  }
  
  // Return/Refund
  if (lowerMsg.includes('return') || lowerMsg.includes('refund')) {
    return 'Our return policy allows returns within 30 days of purchase. The item must be in original condition. Would you like to initiate a return?';
  }
  
  // Payment methods
  if (lowerMsg.includes('payment') || lowerMsg.includes('pay') || lowerMsg.includes('card')) {
    return 'We accept all major credit cards, debit cards, and mobile payments. Your payment information is secure with us!';
  }
  
  // Shipping
  if (lowerMsg.includes('shipping') || lowerMsg.includes('delivery') || lowerMsg.includes('ship')) {
    return 'We offer free shipping on orders over $500. Standard delivery takes 3-5 business days. Express shipping is available for an additional fee.';
  }
  
  // Thank you
  if (lowerMsg.includes('thank') || lowerMsg.includes('thanks')) {
    return 'You are welcome! Is there anything else I can help you with?';
  }
  
  // Goodbye
  if (lowerMsg.includes('bye') || lowerMsg.includes('goodbye')) {
    return 'Thank you for visiting our store! Have a great day! Feel free to come back anytime.';
  }
  
  // Default response
  return 'I can help you with:\n- Product information (laptops, phones, headphones, etc.)\n- Prices and features\n- Order tracking\n- Returns and refunds\n- Shipping information\n\nWhat would you like to know?';
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});