const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role.' });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware; 