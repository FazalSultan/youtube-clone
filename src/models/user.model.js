import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
  {
    userName: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "Username is required"],
      trim: true,
      index: true,
    },

    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "Email is required"],
      trim: true,
      index: true,
    },

    fullName: {
      type: String,
      trim: true,
    },

    avatar: {
      type: String, // Cloudinary URL
      required: true,
    },

    coverImage: {
      type: String, // Cloudinary URL
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    refreshToken: {
      type: String,
    },

    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//Access-Token

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      userName: this.userName,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

export const User = mongoose.model("User", userSchema);
