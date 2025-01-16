const Jwt = require("jsonwebtoken");
const UserModel = require("../models/user.js");

const checkUserAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith("Bearer")) {
    try {
      token = authorization.split(" ")[1];
      // Verify Token
      const decoded = Jwt.verify(token, process.env.JWT_SECRET_KEY);
      // Get User from token
      req.user = await UserModel.findById(decoded.userID).select("-password");

      if (!req.user) {
        return res
          .status(404)
          .send({ status: "404", message: "User not found" });
      }
      if (req.user.isBlock) {
        return res.status(403).send({ status: "403", message: "Your account is blocked. Please contact support." });
      }
      next();
    } catch (error) {
      console.error(error);
      return res
        .status(401)
        .send({ status: "401", message: "Unauthorized User" });
    }
  } else {
    return res
      .status(401)
      .send({ status: "401", message: "Unauthorized User" });
  }
};

function restricTo(roles = []) {
  return function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .send({
          success: false,
          status: "403",
          message: `Only users with the role ${roles.join(", ")} are allowed.`,
        });
    }
    return next();
  };
}

module.exports = { checkUserAuth, restricTo };
