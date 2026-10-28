import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    des: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        min: 0,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ["Clothing", "Shoes", "Accessories"],
    },
    img:[{
        type:String,
    }],
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
},
    {
        timestamps: true
    })

export const Product = mongoose.model("Product", productSchema)