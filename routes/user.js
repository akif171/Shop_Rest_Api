const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const {
  get_All_User,
  create_User,
  user_Login,
  delete_User,
} = require("../controller/user");

//Get All Users
router.get("/", get_All_User);

//Create a User
router.post("/signup", create_User);

//User Login
router.post("/login", user_Login);

//Delete User by ID
router.delete("/:userId", checkAuth, delete_User);

module.exports = router;
