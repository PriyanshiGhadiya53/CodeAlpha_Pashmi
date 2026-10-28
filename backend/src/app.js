
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./router/user.router.js";
import productRouter from "./router/product.router.js";
import cartRouter from "./router/cart.router.js";
import orderRouter from "./router/order.router.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/user",userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);

app.get("/", (req, res) => {
  res.status(200).send("Pashmi is connected.");
});

export default app;
