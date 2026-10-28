import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Package, RefreshCw } from "lucide-react";

const API_URL = "http://localhost:8000/api/v1";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/order/admin/all`, {
        credentials: "include",
      });

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        toast.error("Admin access required.");
        navigate("/");
        return;
      }

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Could not load orders.");
      }

      const orderData = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.data?.orders)
          ? result.data.orders
          : [];

      setOrders(orderData);
    } catch (error) {
      toast.error(error.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchOrders();
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdatingId(orderId);

      const response = await fetch(`${API_URL}/order/${orderId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderStatus: status }),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Could not update order status.");
      }

      toast.success("Order status updated.");
      await fetchOrders();
    } catch (error) {
      toast.error(error.message || "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FBF6F0] px-4 text-[#A8556A]">
        <div className="text-center">
          <RefreshCw size={30} className="mx-auto animate-spin" />
          <p className="mt-3">Loading orders...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FBF6F0] px-3 py-6 text-[#3B2431] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-3 font-serif text-3xl sm:text-4xl">
              <Package className="shrink-0 text-[#A8556A]" size={30} />
              Admin Orders
            </h1>

            <p className="mt-2 text-sm text-[#765C68] sm:text-base">
              Manage customer orders and delivery status.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#EFD5D0] bg-white px-5 py-3 transition hover:bg-[#F7E9E8] sm:w-auto"
          >
            <RefreshCw size={17} />
            Refresh Orders
          </button>
        </div>

        {/* Empty state */}
        {orders.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-[#EFD5D0] bg-white px-4 py-10 text-center sm:rounded-3xl sm:p-10">
            <Package size={42} className="mx-auto text-[#A8556A]" />

            <h2 className="mt-4 font-serif text-2xl">
              No orders found
            </h2>

            <p className="mt-2 text-sm text-[#765C68]">
              Customer orders will appear here when available.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
            {orders.map((order) => (
              <article
                key={order._id}
                className="min-w-0 rounded-2xl border border-[#EFD5D0] bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6"
              >
                {/* Order and customer information */}
                <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="min-w-0">
                    <p className="text-sm text-[#765C68]">Order ID</p>

                    <p className="mt-1 break-all text-sm font-medium sm:text-base">
                      {order._id}
                    </p>

                    <p className="mt-4 text-sm">
                      <span className="text-[#765C68]">Customer: </span>
                      {order.user?.fullName || "Customer"}
                    </p>

                    {order.user?.email && (
                      <p className="mt-1 break-all text-sm text-[#765C68]">
                        {order.user.email}
                      </p>
                    )}

                    <p className="mt-2 text-sm text-[#765C68]">
                      Ordered on:{" "}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-IN")
                        : "Date unavailable"}
                    </p>
                  </div>

                  {/* Payment and total */}
                  <div className="rounded-xl bg-[#FBF6F0] p-4 md:text-right">
                    <p className="text-sm text-[#765C68]">Total Amount</p>

                    <p className="mt-1 text-2xl font-semibold">
                      ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                    </p>

                    <p className="mt-3 break-words text-sm">
                      <span className="text-[#765C68]">Payment: </span>
                      {order.paymentMethod || "N/A"}
                    </p>

                    <p className="mt-1 text-sm">
                      <span className="text-[#765C68]">
                        Payment status:{" "}
                      </span>
                      {order.paymentStatus || "N/A"}
                    </p>

                    <p className="mt-2 text-sm">
                      <span className="text-[#765C68]">
                        Order status:{" "}
                      </span>
                      <span className="font-medium">
                        {order.orderStatus || "Processing"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Update status */}
                <div className="mt-5 border-t border-[#EFD5D0] pt-5 sm:mt-6">
                  <p className="mb-3 font-medium">
                    Update Order Status
                  </p>

                  <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <select
                      value={order.orderStatus}
                      disabled={
                        updatingId === order._id ||
                        order.orderStatus === "Cancelled" ||
                        order.orderStatus === "Delivered"
                      }
                      onChange={(event) =>
                        handleStatusChange(order._id, event.target.value)
                      }
                      className="min-h-11 w-full min-w-0 rounded-xl border border-[#EFD5D0] bg-white px-4 py-3 outline-none focus:border-[#A8556A] disabled:cursor-not-allowed disabled:bg-gray-100 sm:max-w-xs"
                    >
                      {[
                        "Processing",
                        "Shipped",
                        "Delivered",
                        "Cancelled",
                      ].map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    {updatingId === order._id && (
                      <span className="text-sm text-[#765C68]">
                        Updating...
                      </span>
                    )}

                    <Link
                      to={`/order-details/${order._id}`}
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[#EFD5D0] px-4 py-3 text-center text-sm text-[#A8556A] transition hover:bg-[#F7E9E8] sm:ml-auto sm:w-auto"
                    >
                      View Order Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default AdminOrders;