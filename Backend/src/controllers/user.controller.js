const User = require("../models/user.model.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");
const asyncHandler = require("../utils/asyncHandler.js");
const uploadOnCloudinary = require("../utils/cloudinary.js");

const registerUser = asyncHandler(async (req, res) => {
  //get data from body (username, email, password, avatar)
  //check validation for all data (username, email, password)
  //check user exists?
  //check for profile image
  //send image to cloudinary
  //create user in db
  //check for created user
  let { username, email, password } = req.body;

  if ([username, email, password].some((field) => field.trim() === "")) {
    throw new ApiError(400, "all fields are required");
  }

  username = username.toLowerCase();
  email = email.toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Given email ID is not correct");
  }
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "Given email or username already exists");
  }

  const avatarLocalPath = req.file?.path || "";
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const user = await User.create({
    username,
    email,
    password,
    avatar: avatar?.url || "",
  });

  const createdUser = await User.findById(user?._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(400, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registerd successfully"));
});

const generateRefreshAndAccessToken = async (userId) => {
  const user = await User.findById(userId);

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const loginUser = asyncHandler(async (req, res) => {
  //get data from body (email , password)
  //validation of data
  //email exist or user exist with this email
  //is password correct
  //generate refresh and access token
  //set tokens in cookies

  const { email, password } = req.body;
  if (!(email || password)) {
    throw new ApiError(400, "All fields are required");
  }
  if (email.trim() === "" || password.trim() === "") {
    throw new ApiError(400, "All fields should not be empty");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Given email ID is not correct");
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new ApiError(400, "User is not exist with this email ID");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Password is not correct");
  }

  const { accessToken, refreshToken } = await generateRefreshAndAccessToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-refreshToken -password"
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User loggedIn successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
