
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, ShoppingBag } from "lucide-react";

const API_URL = "https://codealpha-pashmi-backend.onrender.com/api/v1/product";

function Shop() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  // URL se category sync karo
  useEffect(() => {
    setCategory(searchParams.get("category") || "");
  }, [searchParams]);

  // Products fetch karo
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (category) params.set("category", category);
        if (search.trim()) params.set("search", search.trim());

        const url = params.toString()
          ? `${API_URL}?${params.toString()}`
          : API_URL;

        const response = await fetch(url);
        const result = await response.json();

        if (!response.ok || result.success === false) {
          throw new Error(result.message || "Products load nahi hue.");
        }

        setProducts(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        setError(err.message || "Server se connect nahi ho paya.");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchProducts, 300);

    return () => clearTimeout(timer);
  }, [category, search]);

  // Category change aur URL update
  const handleCategoryChange = (item) => {
    setCategory(item);

    if (item) {
      setSearchParams({ category: item });
    } else {
      setSearchParams({});
    }
  };

  return (
    <main className="min-h-screen bg-[#FBF6F0] px-4 py-8 text-[#3B2431] sm:px-6 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#A8556A]">
            Curated for you
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl">
            The Pashmi Collection
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#765C68] sm:text-base">
            Discover pieces that bring comfort, beauty and grace to your style.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8556A]"
            />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your favourites..."
              className="w-full rounded-full border border-[#EFD5D0] bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#A8556A]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["", "Clothing", "Shoes", "Accessories"].map((item) => (
              <button
                key={item || "All"}
                onClick={() => handleCategoryChange(item)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  category === item
                    ? "border-[#A8556A] bg-[#A8556A] text-white"
                    : "border-[#EFD5D0] bg-white text-[#3B2431] hover:border-[#A8556A]"
                }`}
              >
                {item || "All"}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-[#A8556A]">
            Loading your collection...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-[#EFD5D0] bg-white p-8 text-center">
            <p className="font-medium">{error}</p>
            <p className="mt-2 text-sm text-[#765C68]">
              Backend server aur product API check karo.
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-[#EFD5D0] bg-white px-5 py-16 text-center">
            <ShoppingBag
              className="mx-auto mb-4 text-[#A8556A]"
              size={36}
            />

            <h2 className="font-serif text-2xl">
              Nothing here just yet
            </h2>

            <p className="mt-2 text-sm text-[#765C68]">
              {search || category
                ? "Try another search or category."
                : "Our collection is waiting for its first products."}
            </p>

            {(search || category) && (
              <button
                onClick={() => {
                  setSearch("");
                  handleCategoryChange("");
                }}
                className="mt-5 rounded-full bg-[#A8556A] px-6 py-3 text-sm text-white transition hover:bg-[#8F4056]"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-[#765C68]">
                {products.length}{" "}
                {products.length === 1 ? "product" : "products"}
                {category && ` in ${category}`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <article
                  key={product._id}
                  className="group overflow-hidden rounded-2xl border border-[#EFD5D0] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link
                    to={`/product/${product._id}`}
                    className="block"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#F7EAE5]">
                      {product.img?.[0] ? (
                        <img
                          src={product.img[0]}
                          alt={product.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-[#A8556A]">
                          Image coming soon
                        </div>
                      )}

                      {product.stock === 0 && (
                        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-3 py-1 text-xs">
                          Out of stock
                        </span>
                      )}
                    </div>

                    <div className="p-3 sm:p-4">
                      <p className="mb-1 text-xs uppercase tracking-wider text-[#A8556A]">
                        {product.category}
                      </p>

                      <h2 className="line-clamp-2 font-medium">
                        {product.name}
                      </h2>

                      <p className="mt-2 font-semibold">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </p>

                      <p className="mt-1 text-xs text-[#765C68]">
                        {product.stock > 0
                          ? "In stock"
                          : "Currently unavailable"}
                      </p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default Shop;
