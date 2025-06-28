import jwt from 'jsonwebtoken';

// ✅ Middleware to verify JWT token and attach user info
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // user: { id, role }
    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// ✅ Middleware to allow access only to certain roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
    }
    next();
  };
};

// ✅ Optional: Middleware to restrict to only one specific role
export const restrictTo = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};
