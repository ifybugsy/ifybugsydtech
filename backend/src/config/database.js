const mongoose = require('mongoose');
const dns = require('dns').promises;

let isConnected = false;
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

// Check if .env is loaded
console.log('[DB] Environment check:');
console.log('[DB] NODE_ENV:', process.env.NODE_ENV);
console.log('[DB] MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('[DB] MONGODB_CONNECTION_STRING exists:', !!process.env.MONGODB_CONNECTION_STRING);

const checkDNS = async (hostname) => {
  try {
    console.log(`[DB] Checking DNS resolution for ${hostname}...`);
    await dns.resolveSrv(hostname);
    console.log('[DB] DNS resolution successful');
    return true;
  } catch (error) {
    console.error('[DB] DNS resolution failed:', error.message);
    console.error('[DB] MongoDB Atlas DNS resolution failed. Check:');
    console.error('     - Internet connection');
    console.error('     - DNS settings');
    console.error('     - VPN or proxy');
    console.error('     - Firewall settings');
    console.error('     - ISP restrictions');
    return false;
  }
};

const connectDB = async () => {
  if (isConnected) {
    console.log('[DB] Using existing connection');
    return mongoose.connection;
  }

  // Get MongoDB URI - must use MONGODB_URI
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.error('[DB] ERROR: MONGODB_URI environment variable is missing!');
    console.error('[DB] Please set MONGODB_URI in your .env file');
    return null;
  }

  console.log('[DB] MONGODB_URI found in environment');
  
  // Check if it's MongoDB Atlas (not localhost)
  const isAtlas = mongoUri.includes('mongodb+srv://');
  console.log('[DB] Connection type:', isAtlas ? 'MongoDB Atlas' : 'Self-hosted/Local');

  // If Atlas, check DNS first
  if (isAtlas) {
    const hostname = '_mongodb._tcp.cluster0.vi3gjiv.mongodb.net';
    const dnsOk = await checkDNS(hostname);
    if (!dnsOk) {
      console.warn('[DB] DNS check failed, but attempting connection anyway...');
    }
  }

  // Retry logic
  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[DB] Connection attempt ${attempt}/${MAX_RETRIES}...`);
      
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        w: 'majority',
        maxPoolSize: 10,
      });

      isConnected = true;
      console.log('✅ [DB] MongoDB connected successfully');
      console.log('[DB] Connection established to:', mongoUri.substring(0, 50) + '...');
      return mongoose.connection;

    } catch (error) {
      lastError = error;
      console.error(`[DB] Connection attempt ${attempt} failed:`, error.message);
      
      if (attempt < MAX_RETRIES) {
        console.log(`[DB] Retrying in ${RETRY_DELAY / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }

  // All retries failed
  console.error('[DB] All connection attempts failed!');
  console.error('[DB] Final error:', lastError?.message);
  console.error('[DB] MongoDB connection failed after 3 retries');
  console.error('[DB] Server will continue in DEMO MODE without database persistence');
  
  isConnected = false;
  return null;
};

module.exports = { connectDB };
