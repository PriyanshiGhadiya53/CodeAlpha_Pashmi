
import { Link, useLocation, useParams } from "react-router-dom";
import { CheckCircle, Package, ShoppingBag } from "lucide-react";

function OrderSuccess() {
  const { orderId } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FBF6F0] px-4 py-12 text-[#3B2431]">
      <div className="w-full max-w-xl rounded-3xl border border-[#EFD5D0] bg-white p-6 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F7E9E8]">
          <CheckCircle size={42} className="text-[#A8556A]" />
        </div>

        <h1 className="mt-6 font-serif text-4xl">
          Order Placed!
        </h1>

        <p className="mt-3 leading-7 text-[#765C68]">
          Thank you for shopping with Pashmi. Your order has been placed
          successfully, and we’ll take care of the rest.
        </p>

        <div className="mt-7 rounded-2xl bg-[#FBF6F0] p-5 text-left">
          <div className="flex items-center gap-3">
            <Package className="text-[#A8556A]" size={24} />
            <div>
              <p className="text-sm text-[#765C68]">Order ID</p>
              <p className="break-all font-medium">{orderId}</p>
            </div>
          </div>

          {order && (
            <>
              <div className="mt-5 flex justify-between gap-3 border-t border-[#EFD5D0] pt-4">
                <span className="text-[#765C68]">Total Amount</span>
                <span className="font-semibold">
                  ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="mt-3 flex justify-between gap-3">
                <span className="text-[#765C68]">Payment</span>
                <span>{order.paymentMethod || "COD"}</span>
              </div>

              <div className="mt-3 flex justify-between gap-3">
                <span className="text-[#765C68]">Status</span>
                <span>{order.orderStatus || "Pending"}</span>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/my-orders"
            className="rounded-full bg-[#A8556A] px-7 py-3 font-medium text-white hover:bg-[#8F4055]"
          >
            View My Orders
          </Link>

          <Link
            to="/shop"
            className="flex items-center justify-center gap-2 rounded-full border border-[#EFD5D0] px-7 py-3 hover:bg-[#FBF6F0]"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default OrderSuccess;
