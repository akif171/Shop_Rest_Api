const Product = require("../models/product");

// Get All Products
const get_All_Products = async (req, res, next) => {
  try {
    const product = await Product.find().select("-__v");

    const response = {
      count: product.length,
      products: product.map((p) => {
        return {
          name: p.name,
          price: p.price,
          productImage: p.productImage,
          id: p._id,
          request: {
            type: "GET",
            url: `http://localhost:3000/products/${p._id}`,
          },
        };
      }),
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
    });
  }
};

//Create a products
const create_Product = async (req, res, next) => {
  console.log(req.file);
  const { name, price } = req.body;
  const productImage = req.file.path;
  try {
    const product = await Product.create({ name, price, productImage });
    res.status(201).json({ product });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
    });
  }
};

//Get a single Product by ID
const get_Single_Product = async (req, res, next) => {
  const id = req.params.productId;

  try {
    const product = await Product.findById(id).select("-__v");
    if (product) {
      res.status(200).json({
        product,
        request: {
          type: "GET",
          url: `http://localhost:3000/products/${id}`,
        },
      });
    } else {
      res
        .status(404)
        .json({ message: "No valid entry found for provided ID." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
    });
  }
};

//Update a Product
const update_Product = async (req, res, next) => {
  const id = req.params.productId;
  const newData = req.body;

  try {
    const product = await Product.findByIdAndUpdate(id, newData, { new: true });

    res.status(200).json({
      product,
      message: "Product Updated",
      request: {
        type: "GET",
        url: `http://localhost:3000/products/${id}`,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

//Delete a Product
const delete_Product = async (req, res, next) => {
  const id = req.params.productId;

  try {
    const product = await Product.findByIdAndRemove(id);
    res.status(200).json({
      message: "Product Deleted",
      request: {
        type: "POST",
        url: `http://localhost:3000/products/${id}`,
        body: { name: "String", price: "Number" },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

module.exports = {
  get_All_Products,
  create_Product,
  get_Single_Product,
  update_Product,
  delete_Product,
};
