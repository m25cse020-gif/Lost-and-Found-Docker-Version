// --- item-service/middleware/auth.js ---
const axios = require('axios');

// Naya: auth-service ka address environment variable se padhein
// Agar nahi mila, toh default 'http://auth-service:5001' use karein
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:5001';

async function auth(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // 1. auth-service ko uske container naam (ya URL) se call karein
    const response = await axios.get(`${AUTH_SERVICE_URL}/api/auth/verify-token`, {
      headers: { 'x-auth-token': token }
    });

    // 2. Agar token sahi hai, toh 'auth-service' user ki info bhejega
    req.user = response.data; // { id: '...', role: 'admin' }
    next();
  } catch (err) {
    // Agar 'auth-service' ne error bheja
    console.error('Auth middleware error:', err.message);
    res.status(401).json({ msg: 'Token is not valid or auth service is down' });
  }
}

function admin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied. Not an admin.' });
  }
  next();
}

module.exports = { auth, admin };