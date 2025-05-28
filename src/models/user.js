const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email format");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (
          !validator.isStrongPassword(value, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          })
        ) {
          throw new Error(
            "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one symbol."
          );
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Invalid gender");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://example.com/default-photo.jpg",
      validate(value) {
        if (!value.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/)) {
          throw new Error("Invalid photo URL");
        }
      },
    },
    about: {
      type: String,
      trim: true,
      maxLength: 500,
      default: "No information provided.",
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function (){
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "secretKey", {
    expiresIn: "7d",
  });

  return token
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
  return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);
