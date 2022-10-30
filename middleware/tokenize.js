var jwt = require("jsonwebtoken");
const JWT_SECRET = "ZerozillaNodeJSTaskByRakesh";

module.exports = function (req, res, next) {

  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized access");
  }
  let token = req.headers.authorization.split(" ")[1];
  if (token === "null") {
    return res.status(401).send("Unauthorized access");
  }
  let payload = jwt.verify(token, JWT_SECRET);
  if (!payload) {
    return res.status(401).send("Unauthorized access");
  }
  next();
};
