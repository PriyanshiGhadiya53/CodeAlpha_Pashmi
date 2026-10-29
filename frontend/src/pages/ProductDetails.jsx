
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = "https://codealpha-pashmi-backend.onrender.com/api/v1/product";

export default function ProductDetails() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`${API_URL}/${id}`);
                const result = await response.json();

                if (!response.ok || result.success === false) {
                    throw new Error(result.message || "Product load nahi hua.");
                }

                setProduct(result.data);
            } catch (err) {
                setError(err.message || "Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="bg-[#FBF6F0] py-24 text-center text-[#A8556A]">
                Loading product...
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-[60vh] bg-[#FBF6F0] px-5 py-20 text-center text-[#3B2431]">
                <h1 className="font-serif text-3xl">Product not found</h1>
                <p className="mt-3 text-sm">{error}</p>
                <Link
                    to="/shop"
                    className="mt-6 inline-block rounded-full bg-[#A8556A] px-6 py-3 text-white"
                >
                    Back to Shop
                </Link>
            </div>
        );
    }

    const inStock = product.stock > 0;

    const handleAddToCart = async () => {
        try {
            const response = await fetch("https://codealpha-pashmi-backend.onrender.com/api/v1/cart", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId: product._id,
                    qnty: quantity,
                }),
            });

            const result = await response.json();

            if (!response.ok || result.success === false) {
                throw new Error(result.message || "Could not add product to cart");
            }

            toast.success("Product added to cart successfully!");
        } catch (error) {
           toast.error(error.message || "Please login and try again.");
        }
    };


    return (
        <main className="min-h-screen bg-[#FBF6F0] px-4 py-8 text-[#3B2431] sm:px-6 lg:px-10">
            <div className="mx-auto max-w-7xl">
                <Link
                    to="/shop"
                    className="mb-8 inline-flex items-center gap-2 text-sm text-[#A8556A] hover:underline"
                >
                    <ArrowLeft size={18} />
                    Back to Collection
                </Link>

                <div className="grid gap-8 md:grid-cols-2 md:gap-12">
                    <div className="overflow-hidden rounded-3xl bg-[#EFD5D0]">
                        {product.img?.[0] ? (
                            <img
                                src={product.img[0]}
                                alt={product.name}
                                className="aspect-[4/5] w-full object-cover"
                            />
                        ) : (
                            <div className="flex aspect-[4/5] items-center justify-center text-[#A8556A]">
                                Image coming soon
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col justify-center py-2 sm:py-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A8556A]">
                            {product.category}
                        </p>

                        <h1 className="mt-4 font-serif text-3xl sm:text-5xl">
                            {product.name}
                        </h1>

                        <p className="mt-5 text-2xl font-semibold">
                            ₹{Number(product.price).toLocaleString("en-IN")}
                        </p>

                        <div className="my-6 h-px bg-[#EFD5D0]" />

                        <h2 className="font-medium">Product Description</h2>

                        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#765C68]">
                            {product.des}
                        </p>

                        <p
                            className={`mt-6 text-sm font-medium ${inStock ? "text-green-700" : "text-red-600"
                                }`}
                        >
                            {inStock
                                ? `${product.stock} available in stock`
                                : "Currently out of stock"}
                        </p>

                        <div className="mt-6 flex items-center gap-4">
                            <span className="text-sm">Quantity</span>

                            <div className="flex items-center rounded-full border border-[#EFD5D0] bg-white">
                                <button
                                    type="button"
                                    aria-label="Decrease quantity"
                                    disabled={quantity <= 1}
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="p-3 disabled:opacity-30"
                                >
                                    <Minus size={16} />
                                </button>

                                <span className="min-w-8 text-center">{quantity}</span>

                                <button
                                    type="button"
                                    aria-label="Increase quantity"
                                    disabled={!inStock || quantity >= product.stock}
                                    onClick={() =>
                                        setQuantity((q) => Math.min(product.stock, q + 1))
                                    }
                                    className="p-3 disabled:opacity-30"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        <p className="mt-5 text-lg font-semibold">
                            Total: ₹
                            {(Number(product.price) * quantity).toLocaleString("en-IN")}
                        </p>

                        <button
                            type="button"
                            disabled={!inStock}
                            onClick={handleAddToCart}
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#A8556A] px-6 py-4 font-medium text-white transition hover:bg-[#8F4055] disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                            <ShoppingBag size={19} />
                            {inStock ? "Add to Cart" : "Out of Stock"}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
