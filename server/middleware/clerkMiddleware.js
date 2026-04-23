const { Clerk } = require('@clerk/clerk-sdk-node');

const ClerkMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'Token format is invalid' });
  }

  try {
    const clerk = Clerk({
      secretKey: process.env.CLERK_SECRET_KEY
    });

    clerk.verifyToken(token)
      .then((payload) => {
        req.user = payload; 
        next();
      })
      .catch((err) => {
        console.error('Token verification failed:', err);
        return res.status(401).json({ msg: 'Token is not valid' });
      });
  } catch (err) {
    console.error('Middleware error:', err);
    res.status(500).send('Server error');
  }
};

module.exports = ClerkMiddleware;
