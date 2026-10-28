
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Package, MapPin } from "lucide-react";

const API_URL = "http://localhost:8000/api/v1";

function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`${API_URL}/order/${orderId}`, {
        credentials: "include",
      });

      const result = await response.json();

      if (response.status === 401) {
        toast.error("Please login to view this order.");
        navigate("/login");
        return;
      }

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Failed to load order.");
      }

      setOrder(result.data);
    } catch (error) {
      toast.error(error.message || "Could not load order.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      setCancelling(true);

      const response = await fetch(
        `${API_URL}/order/${orderId}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        toast.error("Please login again.");
        navigate("/login");
        return;
      }

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Could not cancel order.");
      }

      toast.success("Order cancelled successfully.");
      await fetchOrder();
    } catch (error) {
      toast.error(error.message || "Could not cancel order.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF6F0] py-24 text-center text-[#A8556A]">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FBF6F0] px-4 py-24 text-center text-[#3B2431]">
        <h2 className="font-serif text-3xl">Order not found</h2>
        <Link
          to="/my-orders"
          className="mt-5 inline-block text-[#A8556A] hover:underline"
        >
          Back to My Orders
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FBF6F0] px-4 py-10 text-[#3B2431] sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/my-orders"
          className="inline-flex items-center gap-2 text-sm text-[#A8556A] hover:underline"
        >
          <ArrowLeft size={17} />
          Back to My Orders
        </Link>

        <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-serif text-4xl">Order Details</h1>
            <p className="mt-2 break-all text-sm text-[#765C68]">
              Order ID: {order._id}
            </p>
          </div>

          <span className="w-fit rounded-full bg-[#F7E9E8] px-4 py-2 text-sm font-medium text-[#A8556A]">
            {order.orderStatus}
          </span>
        </div>

        <section className="mt-8 rounded-3xl border border-[#EFD5D0] bg-white p-5 sm:p-7">
          <h2 className="flex items-center gap-2 font-serif text-2xl">
            <Package className="text-[#A8556A]" />
            Ordered Items
          </h2>

          <div className="mt-5 divide-y divide-[#EFD5D0]">
            {order.items?.map((item, index) => (
              <div
                key={item.product || index}
                className="flex items-center gap-4 py-4"
              >
                {item.img ? (
                  <img
                    src={item.img}
                    alt={item.name}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-[#FBF6F0]">
                    <Package className="text-[#A8556A]" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="mt-1 text-sm text-[#765C68]">
                    Quantity: {item.qnty}
                  </p>
                  <p className="mt-1 text-sm text-[#765C68]">
                    ₹{Number(item.price).toLocaleString("en-IN")} each
                  </p>
                </div>

                <p className="shrink-0 font-semibold">
                  ₹{(
                    Number(item.price) * Number(item.qnty)
                  ).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between border-t border-[#EFD5D0] pt-5 text-lg font-semibold">
            <span>Total Amount</span>
            <span>
              ₹{Number(order.totalAmount).toLocaleString("en-IN")}
            </span>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-[#EFD5D0] bg-white p-5 sm:p-7">
          <h2 className="flex items-center gap-2 font-serif text-2xl">
            <MapPin className="text-[#A8556A]" />
            Delivery Address
          </h2>

          <div className="mt-4 space-y-2 text-sm text-[#765C68]">
            <p className="font-semibold text-[#3B2431]">
              {order.deliveryAddress?.fullName}
            </p>
            <p>{order.deliveryAddress?.phone}</p>
            <p>{order.deliveryAddress?.address}</p>
            <p>
              {order.deliveryAddress?.city},{" "}
              {order.deliveryAddress?.state}
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-[#EFD5D0] bg-white p-5 sm:p-7">
          <h2 className="font-serif text-2xl">Payment Information</h2>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-[#765C68]">Payment Method</span>
              <span className="font-medium">
                {order.paymentMethod}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-[#765C68]">Payment Status</span>
              <span className="font-medium">
                {order.paymentStatus}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-[#765C68]">Order Date</span>
              <span>
                {new Date(order.createdAt).toLocaleDateString("en-IN")}
              </span>
            </div>
          </div>
        </section>

        {order.orderStatus === "Pending" && (
          <button
            onClick={handleCancelOrder}
            disabled={cancelling}
            className="mt-6 rounded-full border border-red-300 px-6 py-3 text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            {cancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        )}
      </div>
    </main>
  );
}

export default OrderDetails;
