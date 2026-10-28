import { Router } from "express";
import { updateAvatar,forgotPassword, resetPassword,changeCurrentPassword,getCurrentUser, login, logout, refreshAccessToken, register } from "../controller/user.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router=Router();

router.route("/register").post(register)

router.route("/login").post(login)
router.route("/me").get(verifyJWT,getCurrentUser)
router.route("/logout").post(logout)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/refresh").post(refreshAccessToken)
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/avatar").patch(
    verifyJWT,
    upload.single("avatar"),
    updateAvatar
);


export default router;