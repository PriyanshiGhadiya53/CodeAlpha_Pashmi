import { asyncHandler } from "../util/asyncHandler.js";
import { apiError } from "../util/apiError.js";
import { User } from "../model/user.model.js";
import { apiResponse } from "../util/apiResponse.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import cloudinary from "../config/cloudinary.js";


//generateToken
const generateToken = async (userId) => {

    try {
        const user = await User.findById(userId)
        if (!user) {
            console.log("Error: User not found for ID:", userId);
            throw new apiError(404, "User does not exist");
        }
        console.log("user:", user);
        const accessToken = user.generateAccessToken()

        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        console.error("Original Error:", error);
        throw error;
    }

}

//register
const register = asyncHandler(async (req, res) => {

    console.log(req.body)
    const { fullName, userName, email, password } = req.body;

    if (!fullName || !userName || !email || !password) {
        throw new apiError(400, "user details are required.")
    }

    const checkUser = await User.findOne(
        {
            $or: [{ email }, { userName }]
        }
    )
    if (checkUser) {
        throw new apiError(409, "Email or username already exists.");
    }
    const user = await User.create({
        fullName,
        userName,
        email,
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password"
    );

    return res
        .status(200)
        .json(
            new apiResponse(200, "User registered successfully", createdUser)
        )
})

//login
const login = asyncHandler(async (req, res) => {
    const { email, userName, password } = req.body;

    if ((!email && !userName) || !password) {
        throw new apiError(400, "Email or username and password are required.");
    }

    const user = await User.findOne({
        $or: [{ email }, { userName }]
    }).select("+password");
    if (!user) {
        throw new apiError(400, "user details are required.")
    }
    const ispasswordcorrect = await user.isPasswordCorrect(password)
    if (!ispasswordcorrect) {
        throw new apiError(400, "invalid password")
    }

    const { accessToken, refreshToken } = await generateToken(user.id);

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
    }

    const logginuser = await User.findById(user._id).select("-password -refreshToken")
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(200, {
                user: logginuser,
                accessToken,
                refreshToken
            }, "user logged in successfully")
        )
})

//refreshAccessToken
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!incomingRefreshToken) {
        throw new apiError(401, "unauthorized request");
    }
    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken.id);
    if (!user) {
        throw new apiError(401, "invalied refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
        throw new apiError(401, "refresh token expired or used.")
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    }

    const { accessToken, refreshToken: newrefreshToken } = await generateToken(user.id);
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newrefreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    accessToken, refreshToken: newrefreshToken
                },
                "Acess token sucessfully"
            )
        )

})

//getCurrentUser
const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new apiResponse(
            200,
            "Current user fetched successfully",
            req.user
        )
    );
});

//logout
const logout = asyncHandler(async (req, res) => {

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
    };


    if (req.user?.id) {
        await User.findByIdAndUpdate(
            req.user.id,
            {
                $unset: {
                    refreshToken: 1
                }
            }
        )
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new apiResponse(
                200,
                {},
                "User logged out successfully"
            )
        );
})

//changecurrent password
const changeCurrentPassword = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user?._id || req.user?.id).select("+password");
    if (!user) {
        throw new apiError(400, "user not found")
    }
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new apiError(400, "Invalid old password");
    }

    if (newPassword !== confirmPassword) {
        throw new apiError(400, "New password and confirm password do not match");
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res.status(200)
        .json(
            new apiResponse(200, {}, "Change the password"))

})

//forgotten password
const forgotPassword = asyncHandler(async (req, res) => {

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw new apiError(400, "user not found.")
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;


    await user.save({ validateBeforeSave: false });

    const checkUser = await User.findOne({ email }).select(
        "email resetPasswordToken resetPasswordExpiry"
    );


    return res.status(200).json(
        new apiResponse(
            200,
            "Password reset token generated successfully",
            { resetToken },

        )
    );

})

//resetToken
const resetPassword = asyncHandler(async (req, res) => {

    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
        throw new apiError(400, "Reset token is required");
    }

    if (!password) {
        throw new apiError(400, "New password is required");
    }


    const checkUser = await User.findOne({
        resetPasswordToken: token
    });


    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
        throw new apiError(400, "Invalid or expired reset token");
    }

    user.password = password;
    user.resetPasswordToken = "";
    user.resetPasswordExpiry = null;

    await user.save();

    return res.status(200).json(
        new apiResponse(
            200,
            "Password reset successfully",
            {},

        )
    );
});


//updateAvatar
const updateAvatar = asyncHandler(async (req, res) => {
    console.log("Avatar controller reached");

    if (!req.file) {
        throw new apiError(400, "Profile picture is required");
    }

    // User ko database se find karna
    const user = await User.findById(req.user._id);

    if (!user) {
        throw new apiError(404, "User not found");
    }
    console.log("File details:", {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        hasBuffer: Boolean(req.file.buffer),
        size: req.file.size
    });
    // Convert buffer to Base64 Data URI
    const fileUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    // Upload to Cloudinary
    // const result = await cloudinary.uploader.upload(fileUri, {
    //     folder: "ConnectHub/avatars",
    //     resource_type: "image"
    // });

    // if (!result || !result.secure_url) {
    //     throw new apiError(500, "Failed to upload image to Cloudinary");
    // }

    // user.avatar = result.secure_url;
    // await user.save({ validateBeforeSave: false });

    try {
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "Pashmi/avatars",
            resource_type: "image"
        });

        user.avatar = result.secure_url;
        await user.save({ validateBeforeSave: false });
    } catch (error) {
        console.log("Cloudinary error details:", error.message);
        console.log("Cloudinary HTTP code:", error.http_code);
        console.log("Cloudinary error name:", error.name);
        console.log("Cloudinary error object:", error.error);
        console.log("Full Cloudinary error:", error);
        console.log("Cloudinary response:", error.response);
        console.log("Cloudinary headers:", error.response?.headers);
        console.log("Cloudinary body:", error.response?.body);
        throw error;
    }

    return res.status(200).json(
        new apiResponse(200, "Avatar uploaded successfully", {
            avatar: user.avatar
        })
    );
});



export {
    register, login, getCurrentUser, logout, refreshAccessToken,
    changeCurrentPassword, forgotPassword, resetPassword,updateAvatar
};