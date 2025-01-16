const express = require("express");
const router = express.Router();
const {
  validateLogin,
  validateSignup,
} = require("../middlewares/validations.js");
const {
  userLogin,
  userRegestration,
  logoutUser,
} = require("../controllers/authController.js");
const {
  checkUserAuth,
  restricTo,
} = require("../middlewares/auth_middleware.js");

//Auth
router.post("/register", validateSignup, userRegestration);
router.post("/login", validateLogin, userLogin);
router.post("/logout", checkUserAuth, logoutUser);

module.exports = router;
