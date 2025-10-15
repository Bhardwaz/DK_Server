const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
      minLength: 3,
      maxLength: 20,
      trim: true,
      set: v => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase(),
    },
    lastName: {
      type: String,
      require: true,
      minLength: 3,
      maxLength: 20,
      trim: true,
      set: v => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase(),
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      index: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Strong Password: " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    mainPhoto: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
    },
    desiredAgeRange: {
      min: { type: Number, min: 18 },
      max: { type: Number, max: 50 },
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Non-binary", "Transgender", "other"],
        message: `{VALUE} is not a valid gender type`,
      },
    },
    photoUrl: {
      type: [String],
      default: "https://geographyandyou.com/images/user-profile.png",
      validate: {
        validator: function (values) {
          return values.every((url) => validator.isURL(url));
        },
        message: (props) => `Invalid Photo URL(s): ${props.value}`,
      },
    },
    about: {
      type: String,
      trim: true,
      default: "Hey! I am using DateKarle",
    },
    location: {
      type: String,
    },
    skills: {
      type: [String],
    },
    interestIn: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

User.methods.generateToken = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

User.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};

module.exports = mongoose.model("User", User);
