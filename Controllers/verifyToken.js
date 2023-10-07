let jwt = require("jsonwebtoken");
let { user } = require("../Models/mongooseSchema");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  let token = req.cookies.userToken;

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, async (error, decoded) => {
      if (error || !decoded) {
        req.user = null;
        req.email = null;
        next();
      } else {
        const userExist = await user.findById(decoded.id);
        req.user = userExist._id;
        req.email = userExist.email;

        next();
      }
    });
  } else {
    req.user = null;
    req.email = null;
    next();
    // res.status(403).send("Access denied. You must login first");
  }
};
module.exports = verifyToken;
