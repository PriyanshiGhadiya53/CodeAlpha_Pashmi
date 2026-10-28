
import { Router } from "express";

import { createProduct,getAllProduct,getProductById,updateProduct,deleteProduct } from "../controller/product.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import verifyAdmin from "../middleware/admin.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, verifyAdmin, upload.array("img", 5),createProduct);
router.route("/").get(getAllProduct);
router.route("/:productId").get(getProductById);
router.route("/:productId").patch(verifyJWT,verifyAdmin,upload.array("img", 5),updateProduct);
router.route("/:productId").post(verifyJWT,verifyAdmin,deleteProduct)

export default router;
