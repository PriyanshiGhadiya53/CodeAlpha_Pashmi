


import { Product } from "../model/product.model.js";
import { apiError } from "../util/apiError.js";
import { apiResponse } from "../util/apiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";
import uploadToCloudinary from "../util/cloudinaryUpload.js";

const createProduct = asyncHandler(async (req, res) => {
  const { name, des, price, category, img, stock } = req.body;

  if (
    !name?.trim() ||
    !des?.trim() ||
    price === undefined ||
    price === null ||
    category === undefined
  ) {
    throw new apiError(400, "Required product fields are missing");
  }


  const productPrice = Number(price);

  if (!Number.isFinite(productPrice) || productPrice < 0) {
    throw new apiError(400, "Price must be a valid non-negative number");
  }


  const productStock = stock === undefined ? 0 : Number(stock);

  if (
    !Number.isInteger(productStock) ||
    productStock < 0
  ) {
    throw new apiError(400, "Stock must be a non-negative integer");
  }


  const allowedCategories = [
    "Clothing",
    "Shoes",
    "Accessories",
  ];

  if (!allowedCategories.includes(category)) {
    throw new apiError(400, "Invalid product category");
  }

  const productImages = [];

if (req.files && req.files.length > 0) {
  for (const file of req.files) {
    const uploadedImage = await uploadToCloudinary(
      file.buffer,
      "pashmi/products"
    );

    productImages.push(uploadedImage.secure_url);
  }
}

  const product = await Product.create({
    name: name.trim(),
    des: des.trim(),
    price: productPrice,
    category,
    img: productImages,
    stock: productStock,
  });

  return res.status(201).json(
    new apiResponse(
      201,
      "Product created successfully",
      product
    )
  );
});


//Get All Products
const getAllProduct = asyncHandler(async (req, res) => {
  

  const { category, search } = req.query;
  const filter = {}

  if (category) {
    const allowedCategory = ["Clothing", "Shoes", "Accessories"];
    if (!allowedCategory.includes(category)) {
      throw new apiError(400, "Invalid product category");
    }
    filter.category = category;
  }

  if (search?.trim()) {
    filter.name = {
      $regex: search.trim(),
      $options: "i",
    }
  }
  const products = await Product.find(filter).sort({ createdAt: -1 });



  return res.status(200)
    .json(new apiResponse(
      200,
      "product fetched sucessfully.",
      products
    ))


})

//get single product
const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new apiError(400, "Invalid product ID");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new apiError(404, "Product not found");
  }

  return res.status(200).json(
    new apiResponse(
      200,
      "Product fetched successfully",
      product
    )
  )
})

//Update Produc
const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { name, des, price, category, img, stock } = req.body || {};
  if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new apiError(400, "Invalid product ID");
  }


  const product = await Product.findById(productId);
  if (!product) {
    throw new apiError(404, "Product not found");
  }

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      throw new apiError(400, "Name cannot be empty");
    }
    product.name = name.trim();
  }
  if (des !== undefined) {
    if (typeof des !== "string" || !des.trim()) {
      throw new apiError(400, "Description cannot be empty");
    }
    product.des = des.trim();
  }
  if (price !== undefined) {
    const productPrice = Number(price);

    if (!Number.isFinite(productPrice) || productPrice < 0) {
      throw new apiError(400, "Invalid price");
    }
    product.price = productPrice;
  }
  if (category !== undefined) {
    const allowedCategories = ["Clothing", "Shoes", "Accessories"];

    if (!allowedCategories.includes(category)) {
      throw new apiError(400, "Invalid product category");
    }
    product.category = category;
  }
  if (stock !== undefined) {
    const productStock = Number(stock);

    if (!Number.isInteger(productStock) || productStock < 0) {
      throw new apiError(400, "Invalid stock");
    }
    product.stock = productStock;
  }
// Existing image URLs ko preserve karo.
// Agar request mein img URLs aaye hain, unhe update karo.
if (img !== undefined) {
  if (
    !Array.isArray(img) ||
    !img.every((image) => typeof image === "string")
  ) {
    throw new apiError(400, "Images must be an array of strings");
  }

  product.img = img;
}

// New uploaded images ko Cloudinary par upload karo.
if (req.files && req.files.length > 0) {
  for (const file of req.files) {
    const uploadedImage = await uploadToCloudinary(
      file.buffer,
      "pashmi/products"
    );

    product.img.push(uploadedImage.secure_url);
  }
}

  await product.save();

  return res.status(200).json(
    new apiResponse(200, "Product updated successfully", product)
  );
});

//delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    throw new apiError(400, "product not found.");
  }
  return res.status(200)
    .json(new apiResponse(
      200,
      "product deleted succesfully.",
      product
    ))

})




export {
  createProduct, getAllProduct, getProductById, updateProduct,
  deleteProduct
};
