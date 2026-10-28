import { Router } from "express";
import { placeOrder,getMyOrders,getOrderById,cancelOrder,updateOrderStatus,
    getAllOrders
  } from "../controller/order.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import verifyAdmin from "../middleware/admin.middleware.js";

const router = Router();

router.post("/", verifyJWT, placeOrder);
router.get("/my-order", verifyJWT, getMyOrders);
router.get("/admin/all", verifyJWT, verifyAdmin, getAllOrders);
router.get("/:orderId", verifyJWT, getOrderById);
router.patch("/:orderId/cancel", verifyJWT, cancelOrder);
router.patch("/:orderId/status",verifyJWT,verifyAdmin,updateOrderStatus);


export default router;