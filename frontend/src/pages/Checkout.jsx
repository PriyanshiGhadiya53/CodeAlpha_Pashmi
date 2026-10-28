
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ShoppingBag } from "lucide-react";

const API_URL = "http://localhost:8000/api/v1";

function Checkout() {
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(`${API_URL}/cart`, {
          credentials: "include",
        });
        const result = await response.json();

        if (response.status === 401) {
          toast.error("Please login to continue checkout.");
          navigate("/login");
          return;
        }

        if (!response.ok || result.success === false) {
          throw new Error(result.message || "Could not load cart");
        }

        if (!result.data.items.length) {
          toast.error("Your cart is empty.");
          navigate("/cart");
          return;
        }

        setCart(result.data);
      } catch (error) {
        toast.error(error.message || "Could not load cart.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(address.phone.trim())) {
      toast.error("Enter a valid 10-digit phone number.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/order`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deliveryAddress: address,
        }),
      });

      const result = await response.json();

      if (response.status === 401) {
        toast.error("Please login to place your order.");
        navigate("/login");
        return;
      }

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Could not place order.");
      }

      toast.success("Order placed successfully!");

      navigate(`/order-success/${result.data._id}`, {
        state: { order: result.data },
      });
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="bg-[#FBF6F0] py-24 text-center text-[#A8556A]">
        Loading checkout...
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="bg-[#FBF6F0] py-24 text-center text-[#3B2431]">
        <p>Unable to open checkout.</p>
        <Link to="/cart" className="mt-4 inline-block text-[#A8556A]">
          Back to Cart
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FBF6F0] px-4 py-10 text-[#3B2431] sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link to="/cart" className="text-sm text-[#A8556A] hover:underline">
          ← Back to Cart
        </Link>

        <div className="mt-6 flex items-center gap-3">
          <ShoppingBag size={28} className="text-[#A8556A]" />
          <h1 className="font-serif text-4xl">Checkout</h1>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_320px]">
          <form
            onSubmit={handlePlaceOrder}
            className="space-y-5 rounded-3xl border border-[#EFD5D0] bg-white p-5 sm:p-8"
          >
            <h2 className="font-serif text-2xl">Delivery Address</h2>

            <div>
              <label className="mb-2 block text-sm">Full Name</label>
              <input
                name="fullName"
                value={address.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-[#EFD5D0] px-4 py-3 outline-none focus:border-[#A8556A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">Phone Number</label>
              <input
                name="phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={address.phone}
                onChange={handleChange}
                required
                placeholder="10-digit mobile number"
                className="w-full rounded-xl border border-[#EFD5D0] px-4 py-3 outline-none focus:border-[#A8556A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">Full Address</label>
              <textarea
                name="address"
                value={address.address}
                onChange={handleChange}
                required
                rows={3}
                placeholder="House number, street, area"
                className="w-full rounded-xl border border-[#EFD5D0] px-4 py-3 outline-none focus:border-[#A8556A]"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm">City</label>
                <input
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  required
                  placeholder="City"
                  className="w-full rounded-xl border border-[#EFD5D0] px-4 py-3 outline-none focus:border-[#A8556A]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">State</label>
                <input
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  required
                  placeholder="State"
                  className="w-full rounded-xl border border-[#EFD5D0] px-4 py-3 outline-none focus:border-[#A8556A]"
                />
              </div>
            </div>

            <div className="rounded-xl bg-[#FBF6F0] p-4">
              <p className="font-medium">Payment Method</p>
              <p className="mt-1 text-sm text-[#765C68]">
                Cash on Delivery (COD)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#A8556A] px-6 py-4 font-medium text-white hover:bg-[#8F4055] disabled:opacity-60"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>

          <aside className="rounded-2xl border border-[#EFD5D0] bg-white p-6">
            <h2 className="font-serif text-2xl">Order Summary</h2>

            <div className="mt-5 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex justify-between gap-3 text-sm"
                >
                  <span>
                    {item.product.name} × {item.qnty}
                  </span>
                  <span>
                    ₹{Number(item.subtotal).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-between border-t border-[#EFD5D0] pt-4 font-semibold">
              <span>Total</span>
              <span>
                ₹{Number(cart.totalPrice).toLocaleString("en-IN")}
              </span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Checkout;
