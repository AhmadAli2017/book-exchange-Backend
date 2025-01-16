const { validationResult } = require('express-validator');
const UserModel = require('../models/user.js');
const {  errorResponse, response, responseData } = require('../utilis/response.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../middlewares/trycatch.js');

//Auth APi's

const userRegestration = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, errors.array()[0].msg);
    }

    const { username, email, password } = req.body;

    let user = await UserModel.findOne({ email });
    let uniqueName = await UserModel.findOne({ username });

    if (uniqueName) {
        return response(res, false, 409, "Username already exists");
    }

    if (user) {
        return response(res, false, 409, "Email already exists");
    } else {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user in the database
        user = await UserModel.create({
            username,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "5d" });

        return responseData(res, true, 201, { token, user }, "Successfully registered");
    }
});


//login
const userLogin = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, errors.array()[0].msg);
    }
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).select("-createdAt");

    if (user) {
        if (user.isBlock) {
            return response(res, false, 403, "Your account is blocked. Please contact support.");
        }

        const isMatch = await bcrypt.compare(password.trim(), user.password);
        if (isMatch) {
            const expiresIn = "5d";
            const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn });
            return responseData(res, true, 200, { token, user }, "Successfully Logged in");
        } else {
            return response(res, false, 401, "The provided credentials are incorrect.");
        }
    } else {
        return response(res, false, 404, "User not found. You are not a registered user.");
    }
});


//Logout
const logoutUser = asyncHandler(async (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return response(res, false, 400, "No token provided. User is already logged out.");
    }

    response(res, true, 200, "Successfully logged out.");
});



module.exports = {
    userRegestration,
    userLogin,
    logoutUser,
}
