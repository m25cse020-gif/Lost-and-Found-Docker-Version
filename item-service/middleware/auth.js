
const axios = require('axios');



const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:5001';

async function auth(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {

    const response = await axios.get(`${AUTH_SERVICE_URL}/api/auth/verify-token`, {
      headers: { 'x-auth-token': token }
    });


    req.user = response.data; // { id: '...', role: 'admin' }
    next();
  } catch (err) {

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