const jwt = require("jsonwebtoken");
module.exports = (roles = []) => {
  if (typeof roles === "string") roles = [roles];
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "No token provided" });
    const parts = header.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") return res.status(401).json({ message: "Invalid auth header" });
    try {
      const payload = jwt.verify(parts[1], process.env.JWT_SECRET);
      req.user = { id: payload.id, role: payload.role };
      if (roles.length && !roles.includes(payload.role)) return res.status(403).json({ message: "Forbidden" });
      next();
    } catch (err) { return res.status(401).json({ message: "Invalid token" }); }
  };
};
