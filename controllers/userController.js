const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const ApiFeatures = require("../utils/apiFeatures");
const ApiError = require("../utils/apiError");

exports.getUsers = asyncHandler(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(User.find(), req.query);
  apiFeatures.filter().sort().limitFields().search();
  const { mongooseQuery } = apiFeatures;
  const users = await mongooseQuery;

  res.status(200).json({
    results: users.length,
    data: {users},
  });
});

exports.createUser = asyncHandler(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  let user = await User.findOne({ email });
  if (user) {
    return next(new ApiError("E-mail already exists", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  req.body.password = hashedPassword;

  user = await User.create(req.body);

  res.status(201).json({
    message: "User created successfully",
    data: {
      user,
    },
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) {
    return next(new ApiError(`No user exist with this id: ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      email: req.body.email,
      year: req.body.year
    },
    { new: true }
  );

  if (!user) {
    return next(new ApiError(`No user exist with this id: ${id}`, 404));
  }

  return res.status(200).json({
    message: "User updated successfully",
    data: {
      user,
    },
  });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return next(new ApiError(`No user exist with this id: ${id}`, 404));
  }
  res.status(204).json({
    message: "User deleted successfully",
  });
});
