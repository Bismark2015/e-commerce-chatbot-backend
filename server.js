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
    return 'Hello! 👋 Welcome to our electronics store. We have 50+ products including laptops, phones, smart home devices, and more. How can I help you today?';
  }
  
  // What do you sell
  if (lowerMsg.includes('what do you sell') || lowerMsg.includes('what products') || lowerMsg.includes('what product') || lowerMsg.includes('what items') || lowerMsg.includes('show me products')) {
    return 'We sell electronics and home items:\n\n💻 Computers: Laptops, Monitors, Keyboards, Mice\n📱 Mobile: Phones, Tablets, Chargers, Power Banks\n🎧 Audio: Headphones, Speakers, Microphones\n⌚ Wearables: Smart Watches, Fitness Trackers\n🏠 Smart Home: Cameras, Plugs, Bulbs, Thermostats\n🎮 Gaming: Consoles, Controllers, VR Headsets\n🏡 Home Appliances: Coffee Makers, Blenders, Microwaves\n\nWhat are you looking for?';
  }
  
  // Laptop
  if (lowerMsg.includes('laptop')) {
    return 'Our high-performance laptop costs GH₵999. Perfect for work and gaming! We also have laptop accessories like stands (GH₵130), cooling pads (GH₵75), and backpacks (GH₵200). Interested?';
  }
  
  // Phone/Smartphone
  if (lowerMsg.includes('phone') || lowerMsg.includes('smartphone') || lowerMsg.includes('mobile')) {
    return 'Our latest smartphone costs GH₵699. We also have phone cases (GH₵40), screen protectors (GH₵25), and chargers (GH₵45). Want to know more?';
  }
  
  // Headphones
  if (lowerMsg.includes('headphone') || lowerMsg.includes('headset')) {
    return 'Wireless headphones are GH₵199. Great sound quality and comfortable for long use! 🎧';
  }
  
  // Watch/Smart Watch
  if (lowerMsg.includes('watch') || lowerMsg.includes('smartwatch')) {
    return 'Smart watch costs GH₵299. We also have fitness trackers for GH₵210. Both track your health and fitness! ⌚';
  }
  
  // Tablet
  if (lowerMsg.includes('tablet')) {
    return 'We have a 10-inch Android tablet for GH₵450. Perfect for entertainment and productivity!';
  }
  
  // Monitor
  if (lowerMsg.includes('monitor') || lowerMsg.includes('screen') || lowerMsg.includes('display')) {
    return 'Our 27-inch 4K monitor costs GH₵850. Crystal clear display for work or gaming! 🖥️';
  }
  
  // Keyboard
  if (lowerMsg.includes('keyboard')) {
    return 'Mechanical gaming keyboard is GH₵120. Great for typing and gaming!';
  }
  
  // Mouse
  if (lowerMsg.includes('mouse')) {
    return 'Wireless ergonomic mouse costs GH₵60. Comfortable and precise!';
  }
  
  // Speaker
  if (lowerMsg.includes('speaker')) {
    return 'Bluetooth portable speaker is GH₵350. Take your music anywhere! 🔊';
  }
  
  // Charger/Power Bank
  if (lowerMsg.includes('charger') || lowerMsg.includes('power bank') || lowerMsg.includes('charging')) {
    return 'We have:\n- Fast USB-C charger: GH₵45\n- 20000mAh power bank: GH₵110\n- Multi-device charging dock: GH₵95\n\nWhich one do you need?';
  }
  
  // Camera/Webcam
  if (lowerMsg.includes('camera') || lowerMsg.includes('webcam')) {
    return 'We have:\n- 1080p HD webcam: GH₵280\n- Indoor security camera: GH₵310\n\nWhich one interests you? 📷';
  }
  
  // Microphone
  if (lowerMsg.includes('microphone') || lowerMsg.includes('mic')) {
    return 'USB condenser microphone costs GH₵160. Perfect for streaming, podcasts, and calls! 🎤';
  }
  
  // Router/Wi-Fi
  if (lowerMsg.includes('router') || lowerMsg.includes('wifi') || lowerMsg.includes('wi-fi') || lowerMsg.includes('internet')) {
    return 'Dual-band Wi-Fi router is GH₵220. Fast and reliable internet connection!';
  }
  
  // Storage (SSD/Hard Drive/USB)
  if (lowerMsg.includes('storage') || lowerMsg.includes('ssd') || lowerMsg.includes('hard drive') || lowerMsg.includes('usb') || lowerMsg.includes('flash')) {
    return 'Storage options:\n- 1TB external SSD: GH₵380\n- 2TB external HDD: GH₵290\n- 64GB USB flash drive: GH₵40\n\nWhich do you need?';
  }
  
  // Printer/Scanner
  if (lowerMsg.includes('printer') || lowerMsg.includes('scanner') || lowerMsg.includes('print')) {
    return 'We have:\n- All-in-one inkjet printer: GH₵520\n- Document scanner: GH₵400\n\nWhich one do you need?';
  }
  
  // Projector
  if (lowerMsg.includes('projector')) {
    return 'Portable mini projector costs GH₵1200. Great for presentations and movies! 📽️';
  }
  
  // E-reader
  if (lowerMsg.includes('e-reader') || lowerMsg.includes('ereader') || lowerMsg.includes('kindle')) {
    return '6-inch e-ink reader is GH₵550. Perfect for reading books! 📚';
  }
  
  // Gaming
  if (lowerMsg.includes('game') || lowerMsg.includes('gaming') || lowerMsg.includes('console') || lowerMsg.includes('controller')) {
    return 'Gaming products:\n- Next-gen gaming console: GH₵2000\n- Wireless gamepad: GH₵180\n- VR headset: GH₵1100\n- 4K camera drone: GH₵1500\n\nWhat are you interested in? 🎮';
  }
  
  // Smart Home
  if (lowerMsg.includes('smart home') || lowerMsg.includes('smart plug') || lowerMsg.includes('smart bulb') || lowerMsg.includes('smart light')) {
    return 'Smart home devices:\n- Wi-Fi smart plug: GH₵70\n- Smart RGB bulb: GH₵45\n- Video doorbell: GH₵420\n- Smart thermostat: GH₵380\n\nWhat would you like?';
  }
  
  // Home Appliances
  if (lowerMsg.includes('coffee') || lowerMsg.includes('kettle') || lowerMsg.includes('toaster') || lowerMsg.includes('blender') || lowerMsg.includes('microwave') || lowerMsg.includes('fridge') || lowerMsg.includes('vacuum') || lowerMsg.includes('appliance')) {
    return 'Home appliances:\n- Coffee maker: GH₵300\n- Electric kettle: GH₵120\n- Toaster: GH₵150\n- Blender: GH₵280\n- Microwave: GH₵600\n- Robot vacuum: GH₵750\n- Mini fridge: GH₵3500\n- Air purifier: GH₵550\n\nWhat do you need?';
  }
  
  // Accessories
  if (lowerMsg.includes('accessories') || lowerMsg.includes('cable') || lowerMsg.includes('adapter') || lowerMsg.includes('case') || lowerMsg.includes('stand')) {
    return 'Accessories:\n- Cable kit: GH₵55\n- USB-C adapter: GH₵30\n- Laptop stand: GH₵130\n- Laptop backpack: GH₵200\n- Phone case: GH₵40\n- Screen protector: GH₵25\n\nWhat are you looking for?';
  }
  
  // Price inquiry (general)
  if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('how much')) {
    return 'Our prices range from GH₵25 to GH₵3500. Popular items:\n\n💻 Laptop: GH₵999\n📱 Phone: GH₵699\n⌚ Smart Watch: GH₵299\n🎧 Headphones: GH₵199\n🖥️ Monitor: GH₵850\n\nWhat product are you interested in?';
  }
  
  // Cheap/Budget
  if (lowerMsg.includes('cheap') || lowerMsg.includes('budget') || lowerMsg.includes('affordable') || lowerMsg.includes('low price')) {
    return 'Budget-friendly items under GH₵100:\n- Screen protector: GH₵25\n- Adapter: GH₵30\n- USB drive: GH₵40\n- Phone case: GH₵40\n- Charger: GH₵45\n- Smart bulb: GH₵45\n- Cable kit: GH₵55\n- Mouse: GH₵60\n- Laptop sleeve: GH₵65\n- Smart plug: GH₵70\n- Cooling fan: GH₵75\n- Charging dock: GH₵95\n\nInterested in any?';
  }
  
  // Order tracking
  if (lowerMsg.includes('order') || lowerMsg.includes('track')) {
    return 'To track your order, please provide your order number (e.g., #12345). You can find it in your confirmation email. 📦';
  }
  
  // Returns
  if (lowerMsg.includes('return') || lowerMsg.includes('refund')) {
    return 'Our return policy allows returns within 30 days of purchase. The item must be in original condition with all packaging. Would you like to initiate a return?';
  }
  
  // Shipping/Delivery
  if (lowerMsg.includes('shipping') || lowerMsg.includes('delivery') || lowerMsg.includes('ship')) {
    return 'We offer FREE shipping on orders over GH₵500! Standard delivery takes 3-5 business days within Ghana. Express shipping available for GH₵50. 🚚';
  }
  
  // Payment
  if (lowerMsg.includes('payment') || lowerMsg.includes('pay')) {
    return 'We accept:\n- Mobile Money (MTN, Vodafone, AirtelTigo)\n- Credit/Debit Cards (Visa, Mastercard)\n- Bank Transfer\n\nYour payment is 100% secure! 🔒';
  }
  
  // Thanks
  if (lowerMsg.includes('thank') || lowerMsg.includes('thanks')) {
    return 'You\'re welcome! 😊 Is there anything else I can help you with?';
  }
  
  // Bye
  if (lowerMsg.includes('bye') || lowerMsg.includes('goodbye')) {
    return 'Thank you for visiting our store! Have a great day! 👋 Come back soon!';
  }
  
  // Default
  return 'I can help you with:\n\n✅ Browse our 50+ products\n✅ Check prices and features\n✅ Find budget-friendly items\n✅ Track your order\n✅ Returns & refunds\n✅ Shipping information\n\nJust ask me about any product or service! Type "what do you sell" to see all categories.';
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});