import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = "https://codealpha-pashmi-backend.onrender.com/api/v1/cart";

function Cart() {
  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    totalPrice: 0,
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const response = await fetch(API_URL, {
        credentials: "include",
      });

      const result = await response.json();

      if (response.status === 401) {
        setCart({ items: [], totalItems: 0, totalPrice: 0 });
        toast("Please login to view your cart.");
        return;
      }

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Unable to load cart");
      }

      setCart(result.data);
    } catch (error) {
      toast.error(error.message || "Could not load your cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, qnty) => {
    try {
      const response = await fetch(`${API_URL}/${productId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ qnty }),
      });

      const result = await response.json();

      if (response.status === 401) {
        toast.error("Please login first.");
        navigate("/login");
        return;
      }

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Quantity update failed");
      }

      toast.success("Quantity updated!");
      fetchCart();
    } catch (error) {
      toast.error(error.message);
    }
  };

  
const removeItem = async (productId) => {
  try {
    const response = await fetch(`${API_URL}/${productId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const result = await response.json();

    if (response.status === 401) {
      toast.error("Please login first.");
      navigate("/login");
      return;
    }

    if (!response.ok || result.success === false) {
      throw new Error(result.message || "Could not remove product");
    }

    // Update cart immediately after successful deletion
    setCart((prevCart) => {
      const removedItem = prevCart.items.find(
        (item) => item.product?._id === productId
      );

      if (!removedItem) return prevCart;

      const updatedItems = prevCart.items.filter(
        (item) => item.product?._id !== productId
      );

      const removedSubtotal =
        Number(removedItem.subtotal) ||
        Number(removedItem.product.price) * Number(removedItem.qnty);

      return {
        ...prevCart,
        items: updatedItems,
        totalItems: updatedItems.reduce(
          (total, item) => total + Number(item.qnty),
          0
        ),
        totalPrice: Math.max(
          0,
          Number(prevCart.totalPrice) - removedSubtotal
        ),
      };
    });

    toast.success("Product removed from cart!");
  } catch (error) {
    toast.error(error.message || "Could not remove product.");
  }
};


  if (loading) {
    return (
      <div className="bg-[#FBF6F0] py-24 text-center text-[#A8556A]">
        Loading your bag...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FBF6F0] px-4 py-10 text-[#3B2431] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-serif text-4xl sm:text-5xl">Your Bag</h1>

        <p className="mt-2 text-sm text-[#765C68]">
          Your favourites, collected in one place.
        </p>

        {cart.items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-[#EFD5D0] bg-white px-5 py-16 text-center">
            <ShoppingBag className="mx-auto mb-4 text-[#A8556A]" size={42} />

            <h2 className="font-serif text-2xl">
              Your bag is waiting
            </h2>

            <p className="mt-2 text-sm text-[#765C68]">
              { "Please login to see your cart, or explore our collection." }
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="rounded-full bg-[#A8556A] px-7 py-3 text-white"
              >
                Login
              </button>

              <Link
                to="/shop"
                className="rounded-full border border-[#EFD5D0] px-7 py-3"
              >
                Explore Collection
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_340px]">
            <div className="space-y-4">
              {cart.items.map((item) => {
                const product = item.product;

                return (
                  <article
                    key={product._id}
                    className="flex gap-4 rounded-2xl border border-[#EFD5D0] bg-white p-3 sm:gap-6 sm:p-5"
                  >
                    <Link
                      to={`/product/${product._id}`}
                      className="h-32 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F7EAE5] sm:h-40 sm:w-32"
                    >
                      {product.img?.[0] ? (
                        <img
                          src={product.img[0]}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs">
                          No image
                        </div>
                      )}
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="text-xs uppercase tracking-wider text-[#A8556A]">
                        {product.category}
                      </p>

                      <Link
                        to={`/product/${product._id}`}
                        className="mt-1 font-medium hover:text-[#A8556A]"
                      >
                        {product.name}
                      </Link>

                      <p className="mt-2 font-semibold">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </p>

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                        <div className="flex items-center rounded-full border border-[#EFD5D0]">
                          <button
                            aria-label="Decrease quantity"
                            disabled={item.qnty <= 1}
                            onClick={() =>
                              updateQuantity(product._id, item.qnty - 1)
                            }
                            className="p-2 disabled:opacity-30"
                          >
                            <Minus size={15} />
                          </button>

                          <span className="min-w-7 text-center text-sm">
                            {item.qnty}
                          </span>

                          <button
                            aria-label="Increase quantity"
                            disabled={item.qnty >= product.stock}
                            onClick={() =>
                              updateQuantity(product._id, item.qnty + 1)
                            }
                            className="p-2 disabled:opacity-30"
                          >
                            <Plus size={15} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(product._id)}
                          className="flex items-center gap-1 text-sm text-[#A8556A] hover:text-red-700"
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>

                      <p className="mt-3 text-sm text-[#765C68]">
                        Subtotal: ₹
                        {Number(item.subtotal).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="rounded-2xl border border-[#EFD5D0] bg-white p-6 lg:sticky lg:top-24">
              <h2 className="font-serif text-2xl">Order Summary</h2>

              <div className="mt-6 flex justify-between text-sm">
                <span>Total items</span>
                <span>{cart.totalItems}</span>
              </div>

              <div className="mt-4 flex justify-between border-t border-[#EFD5D0] pt-4 font-semibold">
                <span>Total</span>
                <span>
                  ₹{Number(cart.totalPrice).toLocaleString("en-IN")}
                </span>
              </div>

              <Link
                to="/checkout"
                className="mt-6 block rounded-full bg-[#A8556A] px-5 py-3 text-center font-medium text-white hover:bg-[#8F4055]"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/shop"
                className="mt-4 block text-center text-sm text-[#A8556A] hover:underline"
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

export default Cart;