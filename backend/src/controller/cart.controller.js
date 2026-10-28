import mongoose from "mongoose";
import { Cart } from "../model/cart.model.js";
import { Product } from "../model/product.model.js";
import { apiError } from "../util/apiError.js";
import { apiResponse } from "../util/apiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";

const addToCart = asyncHandler(async (req, res) => {

    const userId = req.user._id;
    const { productId, qnty = 1 } = req.body;

    const quantity = Number(qnty);
    if (!Number.isInteger(quantity) || quantity < 1) {
        throw new apiError(400, "Quantity must be a positive integer");
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new apiError(404, "Product not found");
    }

    if (product.stock < quantity) {
        throw new apiError(400, "Insufficient product stock");
    }


    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: [
                {
                    product: productId,
                    qnty: quantity,
                },
            ],
        });
    } else {
        const existingCart = cart.items.find((item) => item.product.toString() === productId);
        if (existingCart) {
            const newqnty = existingCart.qnty + quantity;
            if (newqnty > product.stock) {
                throw new apiError(400, "Insufficient product stock");
            }
            existingCart.qnty = newqnty;
        } else {
            cart.items.push({
                product: productId,
                qnty: quantity,
            });
        }
        await cart.save();
    };
    await cart.populate("items.product");

    return res.status(200).json(
        new apiResponse(200, "Product added to cart successfully", cart)
    );
});

//Get Cart API
const getCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
        return res.status(200)
            .json(new apiResponse(
                200,
                "Your cart is empty", {
                items: [],
                totalItems: 0,
                totalPrice: 0,
            }
            ))
    }

    const items = cart.items
        .filter((item) => item.product !== null)
        .map((item) => ({
            product: item.product,
            qnty: item.qnty,
            subtotal: item.product.price * item.qnty
        }));

    const totalItems = items.reduce((total, item) => total + item.qnty, 0);
    const totalPrice = items.reduce(
        (total, item) => total + item.subtotal,
        0
    );
    return res.status(200).json(
        new apiResponse(200, "Cart fetched successfully", {
            items,
            totalItems,
            totalPrice,
        })
    );

})

const updateCartQuantity = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;
    const { qnty } = req.body;

    const quantity = Number(qnty);

    if (!Number.isInteger(quantity) || quantity < 1) {
        throw new apiError(400, "Quantity must be a positive integer");
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new apiError(400, "product not found.");
    }

    if (quantity > product.stock) {
        throw new apiError(400, "Insufficient product stock");
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new apiError(404, "Cart not found");
    }

    const item = cart.items.find((item) => item.product.toString() === productId);
    if (!item) {
        throw new apiError(404, "Product not found in cart");
    }

    item.qnty = quantity;
    await cart.save();
    await cart.populate("items.product");

    return res.status(200).json(
        new apiResponse(200, "Cart quantity updated successfully", cart)
    );

})

const removeCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
     if (!cart) {
    throw new apiError(404, "Cart not found");
  }


    const exisitItem = cart.items.some((item) => item.product.toString() === productId);
     if (!exisitItem) {
    throw new apiError(404, "Product not found in cart");
    }

    cart.items = cart.items.filter((item) => item.product.toString() === productId);
    await cart.save();

    return res.status(200).json(
        new apiResponse(200, "Product removed from cart successfully", cart)
    );

})


export { addToCart, getCart,removeCartItem,updateCartQuantity };