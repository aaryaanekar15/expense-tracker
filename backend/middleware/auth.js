const jwt = require("jsonwebtoken");

const AuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; 

    const decoded = jwt.verify(token, "secretkey");

    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = AuthMiddleware;