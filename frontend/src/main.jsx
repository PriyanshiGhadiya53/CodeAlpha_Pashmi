
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import OrderDetails from "./pages/OrderDetails";
import AdminOrders from "./admin/AdminOrders";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminProducts from "./admin/AdminProducts.jsx";
import Profile from "./pages/Profile";
import Categories from "./pages/Categories";
import "./index.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success/:orderId" element={<OrderSuccess />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/order-details/:orderId" element={<OrderDetails />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/categories" element={<Categories />} />

    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster position="top-right" />
  </StrictMode>
);

export {};
