
import { Router } from "express";
import { addToCart,getCart,updateCartQuantity,removeCartItem } from "../controller/cart.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, addToCart);
router.route("/").get(verifyJWT, getCart);
router.route("/:productId").patch(verifyJWT, updateCartQuantity)
router.route("/:productId").delete(verifyJWT, removeCartItem);

export default router;
