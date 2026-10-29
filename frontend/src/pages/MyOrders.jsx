
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Package, ShoppingBag } from "lucide-react";

const API_URL = "https://codealpha-pashmi-backend.onrender.com/api/v1";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/order/my-order`, {
          credentials: "include",
        });

        const result = await response.json();
        console.log("Order API status:", response.status);
console.log("Order API response:", result);

        if (response.status === 401) {
          toast.error("Please login to view your orders.");
          navigate("/login");
          return;
        }

        if (!response.ok || result.success === false) {
          throw new Error(result.message || "Failed to fetch orders.");
        }

        setOrders(result.data.orders || []);
      } catch (error) {
        toast.error(error.message || "Could not load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const getStatusStyle = (status) => {
    if (status === "Delivered") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Cancelled") {
      return "bg-red-100 text-red-700";
    }

    return "bg-[#F7E9E8] text-[#A8556A]";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF6F0] py-24 text-center text-[#A8556A]">
        Loading your orders...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FBF6F0] px-4 py-12 text-[#3B2431] sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link to="/shop" className="text-sm text-[#A8556A] hover:underline">
          ← Continue Shopping
        </Link>

        <div className="mt-6 flex items-center gap-3">
          <Package size={30} className="text-[#A8556A]" />
          <h1 className="font-serif text-4xl">My Orders</h1>
        </div>

        <p className="mt-2 text-[#765C68]">
          Track and manage your Pashmi orders.
        </p>

        {orders.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-[#EFD5D0] bg-white px-6 py-14 text-center">
            <ShoppingBag size={44} className="mx-auto text-[#A8556A]" />

            <h2 className="mt-4 font-serif text-2xl">No orders yet</h2>

            <p className="mt-2 text-[#765C68]">
              Your orders will appear here after you place an order.
            </p>

            <Link
              to="/shop"
              className="mt-6 inline-block rounded-full bg-[#A8556A] px-7 py-3 text-white hover:bg-[#8F4055]"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-3xl border border-[#EFD5D0] bg-white p-5 sm:p-6"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm text-[#765C68]">Order ID</p>
                    <p className="mt-1 break-all font-medium">{order._id}</p>
                    <p className="mt-2 text-sm text-[#765C68]">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-4 py-2 text-sm font-medium ${getStatusStyle(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <div className="mt-5 flex flex-col justify-between gap-4 border-t border-[#EFD5D0] pt-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm text-[#765C68]">
                      {order.items?.length || 0} item(s)
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                    </p>
                    <p className="mt-1 text-sm text-[#765C68]">
                      Payment: {order.paymentMethod || "COD"}
                    </p>
                  </div>

                  <Link
                    to={`/order-details/${order._id}`}
                    className="rounded-full border border-[#A8556A] px-6 py-3 text-center text-[#A8556A] hover:bg-[#A8556A] hover:text-white"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyOrders;
