const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

//Get All Users
const get_All_User = async (req, res, next) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
    });
  }
};

//Create a User
const create_User = async (req, res, next) => {
  let { email, password } = req.body;
  
  try {
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email: email,
      password: hashedPassword,
    });

    console.log(user);
    res.status(201).json({
      message: "User Created",
    });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email is already exist",
      });
    }

    res.status(500).json({
      error,
    });
  }
};

//User Login
const user_Login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.find({ email: email });
    if (user.length == 0) {
      return res.status(401).json({
        message: "user does not exist",
      });
    }

    const passwordComparision = await bcrypt.compare(
      password,
      user[0].password
    );
    if (!passwordComparision) {
      return res.status(401).json({
        message: "email or password is incorrect",
      });
    }

    const token = jwt.sign(
      {
        userId: user[0]._id,
        email: user[0].email,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "1h",
      }
    );
    console.log(token);

    res.status(200).json({
      message: "Auth Successful",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
    });
  }
};

//Delete User by ID
const delete_User = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "User deleted",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
    });
  }
};

module.exports = {
  get_All_User,
  create_User,
  user_Login,
  delete_User,
};
