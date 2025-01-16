// userSchema.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

userSchema.options.toJSON = {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
};

const UserModel = mongoose.model("User", userSchema); // Case-sensitive model name

module.exports = UserModel;