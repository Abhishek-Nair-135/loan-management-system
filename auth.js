const jwt = require("jsonwebtoken");

const basicAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "This is some seriously secure key!!!");
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};

const customerAuth = (req, res, next) => {
  const role = req.userData.role;

  if (role !== "CUSTOMER") {
    res.status(401).json({
      message: "Auth failed",
    });
  }

  next();
};

const agentAuth = (req, res, next) => {
  const role = req.userData.role;

  if (role !== "AGENT") {
    res.status(401).json({
      message: "Auth failed",
    });
  }

  next();
};

const adminAuth = (req, res, next) => {
  const role = req.userData.role;

  if (role !== "ADMIN") {
    res.status(401).json({
      message: "Auth failed",
    });
  }
  next();
};

module.exports = {
  basicAuth,
  adminAuth,
  agentAuth,
  customerAuth,
};
