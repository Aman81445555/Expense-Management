// middleware/auth.js

const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  // 1. Get the token from the request header
  const token = req.header('x-auth-token');

  // 2. Check if a token was provided
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // 3. Verify the token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach the user's info to the request object
    req.user = decoded.user;

    // 5. Call the next function in the chain
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Token is not valid' });
  }
}

module.exports = auth;