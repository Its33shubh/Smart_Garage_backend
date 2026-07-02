const jwt = require("jsonwebtoken");

const auth = (roles = []) => {
  return async (req, res, next) => {
    try {
      let token = req.header("Authorization");

      if (!token) {
        return res.status(401).json({
          error: true,
          success: false,
          message: "Access Denied. Token Missing.",
        });
      }

      if (token.startsWith("Bearer ")) {
        token = token.slice(7).trim();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;

      // Check Role
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          error: true,
          success: false,
          message: "Access Denied.",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        error: true,
        success: false,
        message: "Invalid or Expired Token.",
      });
    }
  };
};

module.exports = auth;