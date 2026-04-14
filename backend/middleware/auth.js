const jwt = require("jsonwebtoken");

const AuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ✅ Check if header exists and is correct
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    // ✅ Extract token
    const token = authHeader.split(" ")[1];

    // ✅ Verify token
    const decoded = jwt.verify(token, "secretkey");

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = AuthMiddleware;