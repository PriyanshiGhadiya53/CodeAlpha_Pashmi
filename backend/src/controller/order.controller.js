import mongoose from "mongoose";
import { Order } from "../model/order.model.js";
import { Cart } from "../model/cart.model.js";
import { Product } from "../model/product.model.js";
import { apiError } from "../util/apiError.js";
import { apiResponse } from "../util/apiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";

const placeOrder = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { deliveryAddress } = req.body;

    // 1. Validate delivery address
    const requiredFields = [
        "fullName",
        "phone",
        "address",
        "city",
        "state",

    ];

    if (
        !deliveryAddress ||
        requiredFields.some(
            (field) =>
                typeof deliveryAddress[field] !== "string" ||
                !deliveryAddress[field].trim()
        )
    ) {
        throw new apiError(400, "Please provide complete delivery address");
    }

    if (!/^\d{10}$/.test(deliveryAddress.phone.trim())) {
        throw new apiError(400, "Please provide a valid 10-digit phone number");
    }


    const session = await mongoose.startSession();
    let createdOrder;

    try {
        await session.withTransaction(async () => {
            // 2. Get logged-in user's cart
            const cart = await Cart.findOne({ user: userId }).session(session);

            if (!cart || cart.items.length === 0) {
                throw new apiError(400, "Your cart is empty");
            }

            const orderItems = [];
            let totalAmount = 0;

            // 3. Check products and stock
            for (const item of cart.items) {
                const product = await Product.findById(item.product).session(session);

                if (!product) {
                    throw new apiError(404, "A product in your cart no longer exists");
                }

                if (product.stock < item.qnty) {
                    throw new apiError(
                        400,
                        `Insufficient stock for ${product.name}`
                    );
                }

                // 4. Save product details and current price in order
                orderItems.push({
                    product: product._id,
                    name: product.name,
                    img: product.img?.[0] || "",
                    price: product.price,
                    qnty: item.qnty,
                });

                totalAmount += product.price * item.qnty;
            }

            // 5. Deduct stock only when enough stock is still available
            for (const item of cart.items) {
                const stockUpdate = await Product.updateOne(
                    {
                        _id: item.product,
                        stock: { $gte: item.qnty },
                    },
                    {
                        $inc: { stock: -item.qnty },
                    },
                    { session }
                );

                if (stockUpdate.modifiedCount !== 1) {
                    throw new apiError(
                        400,
                        "Stock changed while placing order. Please try again."
                    );
                }
            }

            // 6. Create order
            const orders = await Order.create(
                [
                    {
                        user: userId,
                        items: orderItems,
                        totalAmount,
                        deliveryAddress,
                        orderStatus: "Pending",
                        paymentMethod: "COD",
                        paymentStatus: "Pending",
                    },
                ],
                { session }
            );

            createdOrder = orders[0];

            // 7. Empty cart after successful order creation
            cart.items = [];
            await cart.save({ session });
        });
    } finally {
        await session.endSession();
    }

    return res.status(201).json(
        new apiResponse(201, "Order placed successfully", createdOrder)
    );
});

const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new apiResponse(
      200,
      "Your orders fetched successfully",
      {
        totalOrders: orders.length,
        orders,
      }
    )
  );
});

const getOrderById = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { orderId } = req.params;

  if (!mongoose.isValidObjectId(orderId)) {
    throw new apiError(400, "Invalid order ID");
  }

  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw new apiError(404, "Order not found");
  }

  return res.status(200).json(
    new apiResponse(200, "Order details fetched successfully", order)
  );
});

const cancelOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { orderId } = req.params;

  if (!mongoose.isValidObjectId(orderId)) {
    throw new apiError(400, "Invalid order ID");
  }

  const session = await mongoose.startSession();

  try {
    let cancelledOrder;

    await session.withTransaction(async () => {
      const order = await Order.findOne({
        _id: orderId,
        user: userId,
      }).session(session);

      if (!order) {
        throw new apiError(404, "Order not found");
      }

      if (order.orderStatus !== "Pending") {
        throw new apiError(
          400,
          "Only pending orders can be cancelled"
        );
      }

      // Restore stock for every ordered product
      for (const item of order.items) {
        const result = await Product.updateOne(
          { _id: item.product },
          { $inc: { stock: item.qnty } },
          { session }
        );

        if (result.matchedCount !== 1) {
          throw new apiError(
            400,
            `Product not found: ${item.name}`
          );
        }
      }

      // Update order status
      order.orderStatus = "Cancelled";
      await order.save({ session });

      cancelledOrder = order;
    });

    return res.status(200).json(
      new apiResponse(
        200,
        "Order cancelled and stock restored successfully",
        cancelledOrder
      )
    );
  } finally {
    await session.endSession();
  }
});

const updateOrderStatus =asyncHandler(async(req,res)=>{
    const {orderId}=req.params;
    const {orderStatus}=req.body;
     const allowedStatuses = [
    "Processing",
    "Shipped",
    "Delivered",
  ];

  if (!allowedStatuses.includes(orderStatus)) {
    throw new apiError(400, "Invalid order status")
  }
    const order=await Order.findById(orderId)
    if (!order) {
    throw new apiError(404, "Order not found");
  }
  if (
    order.orderStatus === "Cancelled" ||
    order.orderStatus === "Delivered"
  ) {
    throw new apiError(
      400,
      "This order status cannot be changed"
    );
  }

   order.orderStatus = orderStatus;
  await order.save();

  return res.status(200).json(
    new apiResponse(200, "Order status updated successfully", order)
  );

})

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "fullName email")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new apiResponse(
      200,
      "All orders fetched successfully",
      {
        totalOrders: orders.length,
        orders,
      }
    )
  );
});



export { placeOrder,getMyOrders,getOrderById,cancelOrder,updateOrderStatus,
        getAllOrders

 };