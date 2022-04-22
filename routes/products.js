const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middlewares/checkAuth");
const {
  get_All_Products,
  create_Product,
  get_Single_Product,
  update_Product,
  delete_Product,
} = require("../controller/products");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  //reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

// Get All Products
router.get("/", get_All_Products);

//Create a products
router.post("/", upload.single("productImage"), checkAuth, create_Product);

//Get a single Product by ID
router.get("/:productId", get_Single_Product);

//Update a Product
router.patch("/:productId", checkAuth, update_Product);

//Delete a Product
router.delete("/:productId", checkAuth, delete_Product);

module.exports = router;
