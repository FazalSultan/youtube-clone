import { asyncHandler } from "../utils/asyncHandler.js";

 const registerUser = asyncHandler(async (req, res) => {
  try {
    await res.status(200).json({
      message: "Ok by Fazal Sultan",
    });
  } catch (err) {
    console.log("An error occured......");
  }
});

export { registerUser };
