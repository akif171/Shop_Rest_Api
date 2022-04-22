const Order = require("../models/order");
const Product = require("../models/product");

//Get all Orders
const get_All_Orders = async (req, res, next) => {
  try {
    const order = await Order.find().populate("product");

    res.status(200).json({
      count: order.length,
      orders: order.map((o) => {
        return {
          id: o._id,
          product: o.product,
          quantity: o.quantity,
          request: {
            type: "GET",
            url: `http://localhost:3000/orders/${o._id}`,
          },
        };
      }),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
    });
  }
};

//Create a Orders
const create_Order = async (req, res, next) => {
  const { quantity, productId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (product) {
      const order = new Order({
        product: productId,
        quantity: quantity,
      });
      await order.save();

      res.status(201).json({
        message: "Order Stored",
        createdOrder: {
          id: order._id,
          product: order.product,
          quantity: order.quantity,
        },
        request: {
          type: "GET",
          url: `http://localhost:3000/orders/${order._id}`,
        },
      });
    } else {
      res.status(404).json({
        message: "Product Not Found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

//Get a single Order by ID
const get_Single_Order = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("product");

    if (!order) {
      return res.status(404).json({
        message: "Order Not Found",
      });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
    });
  }
};

//Delete a Order
const delte_Order = async (req, res, next) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findByIdAndDelete(orderId);

    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
    });
  }
};

module.exports = {
  get_All_Orders,
  create_Order,
  get_Single_Order,
  delte_Order,
};
