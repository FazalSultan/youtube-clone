import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { userName, email, fullName, password } = req.body;

    // to track empty value from the frontend
    if (
      [userName, email, fullName, password].some(
        (fields) => fields.trim() == "",
      )
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

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
      throw new ApiError(400, "Avatar file is required");
    }
    const user = await User.create({
      name,
      fullName,
      email,
      password,
      avatar: avatar?.url,
      converImage: coverImage?.url || "",
    });
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user",
      );
    }

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered Successfully"));
  } catch (err) {
    console.log(err);
  }
});

export { registerUser };
