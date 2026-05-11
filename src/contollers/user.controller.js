import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { cloudinaryUploadFile } from "../utils/cloudinary.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, fullName, password } = req.body;

  // Validate empty fields
  if (
    [userName, email, fullName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are Required");
  }
  // is Email is Valid ...
  if (!email.includes("@")) {
    throw new ApiError(
      400,
      "Your email is not in valid format",
      ["Your email should include @"],
      "Invalid Email format",
    );
  }
  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // Safe file access
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // Upload avatar
  const avatar = await cloudinaryUploadFile(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Error while uploading avatar");
  }

  // Upload cover image (optional)
  let coverImage = null;

  if (coverImageLocalPath) {
    coverImage = await cloudinaryUploadFile(coverImageLocalPath);
  }

  // Create user
  const user = await User.create({
    userName,
    fullName,
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  // Remove sensitive fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  /**
   * send email/name and password from frontend
   * Validate on the backend
   * compare it with the datbase data
   * generate access and refresh Token
   * send it back to the frontend in httpOnly cookie
   * return the response as a json to frontend
   */
  const { userName, email, password } = req.body;
  if ([fullName, email, password].some((f) => f.trim() == "")) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({
    $or: [{ email }, { userName }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const ispasswordValid = await user.isPasswordCorrect(password);
  if (!ispasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // now generate access and refresh Token
  const accessToken = await user.generateAccessToken();
  const refreshTokenGen = await user.generateRefreshToken();

  // now store the refreshToken in Db;
  if (refreshTokenGen) {
    user.refreshToken = refreshTokenGen;
    await user.save({ validateBeforeSave: false });
  }

  const option = {
    httpOnly: true,
    secure: true,
  };

  const data = res
    .cookie("accessToken", acessToken, option)
    .cookie("refreshToken", refreshTokenGen, option);

  res
    .status(200)
    .json(new ApiResponse(200, data, "User loged In Successfully .."));
});

export { registerUser, loginUser };
