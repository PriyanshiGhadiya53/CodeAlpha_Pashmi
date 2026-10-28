
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Package,
  RefreshCw,
  Menu,
  LayoutDashboard,
  ShoppingBag,
  Store,
  ImagePlus,
} from "lucide-react";
import { toast } from "react-hot-toast";

const API_URL = "http://localhost:8000/api/v1/product";

const initialForm = {
  name: "",
  des: "",
  price: "",
  category: "Clothing",
  stock: "0",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const getProducts = async () => {
    setLoading(true);

    try {
      const res = await fetch(API_URL);
      const result = await res.json();

      if (!res.ok || result.success === false) {
        throw new Error(
          typeof result.message === "string"
            ? result.message
            : "Products load nahi hue."
        );
      }

      const list =
        (Array.isArray(result.data) && result.data) ||
        result.data?.products ||
        result.message?.products ||
        [];

      setProducts(list);
    } catch (error) {
      toast.error(error.message || "Products load nahi hue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files || []);

    if (selectedImages.length > 5) {
      toast.error("Maximum 5 images select kar sakti ho.");
      e.target.value = "";
      setImages([]);
      return;
    }

    const invalidImage = selectedImages.find(
      (file) => !file.type.startsWith("image/") ||
        file.size > 5 * 1024 * 1024
    );

    if (invalidImage) {
      toast.error("Har file image honi chahiye aur 5 MB se chhoti honi chahiye.");
      e.target.value = "";
      setImages([]);
      return;
    }

    setImages(selectedImages);
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setImages([]);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      des: product.des || "",
      price: String(product.price ?? ""),
      category: product.category || "Clothing",
      stock: String(product.stock ?? 0),
    });
    setImages([]);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length > 5) {
      toast.error("Maximum 5 images allowed.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append("des", form.des.trim());
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("stock", form.stock);

      images.forEach((image) => {
        formData.append("img", image);
      });

      const res = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? "PATCH" : "POST",
          credentials: "include",
          body: formData,
        }
      );

      const result = await res.json();

      if (!res.ok || result.success === false) {
        throw new Error(
          typeof result.message === "string"
            ? result.message
            : "Product save nahi hua."
        );
      }

      toast.success(
        editingId
          ? "Product updated successfully!"
          : "Product added successfully!"
      );

      setForm(initialForm);
      setImages([]);
      setEditingId(null);
      setShowForm(false);

      await getProducts();
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Kya tum sach mein ye product delete karna chahti ho?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`${API_URL}/${productId}`, {
        method: "POST",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok || result.success === false) {
        throw new Error(
          typeof result.message === "string"
            ? result.message
            : "Product delete nahi hua."
        );
      }

      toast.success("Product deleted successfully!");
      await getProducts();
    } catch (error) {
      toast.error(error.message || "Delete failed.");
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
    setImages([]);
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Manage Products",
      path: "/admin/products",
      icon: Package,
      active: true,
    },
    {
      label: "Manage Orders",
      path: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      label: "View Store",
      path: "/shop",
      icon: Store,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBF6F0] text-[#3B2431] md:flex">
      {/* Mobile header */}
      <div className="flex items-center justify-between bg-[#3B2431] p-4 text-white md:hidden">
        <div>
          <h1 className="font-serif text-2xl">Pashmi</h1>
          <p className="text-[10px] tracking-[3px] text-[#EFD5D0]">
            ADMIN PANEL
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle navigation"
          className="rounded-lg p-2 hover:bg-white/10"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "block" : "hidden"
        } w-full shrink-0 bg-[#3B2431] p-5 text-white md:block md:min-h-screen md:w-64`}
      >
        <Link to="/admin/dashboard" className="hidden md:block">
          <h1 className="font-serif text-3xl">Pashmi</h1>
          <p className="mt-1 text-xs tracking-[3px] text-[#EFD5D0]">
            ADMIN PANEL
          </p>
        </Link>

        <nav className="flex flex-col gap-2 md:mt-8">
          {navItems.map(({ label, path, icon: Icon, active }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                active
                  ? "bg-[#A8556A] text-white"
                  : "hover:bg-white/10"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1 p-4 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[#A8556A]">Store inventory</p>
            <h2 className="mt-1 font-serif text-3xl sm:text-4xl">
              Manage Products
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={getProducts}
              disabled={loading}
              className="flex items-center gap-2 rounded-full border border-[#EFD5D0] bg-white px-4 py-3 text-sm"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={openAddForm}
              className="flex items-center gap-2 rounded-full bg-[#A8556A] px-4 py-3 text-sm text-white hover:bg-[#8F4056]"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>
        </div>

        {/* Add/Edit form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl border border-[#EFD5D0] bg-white p-5 sm:p-7"
          >
            <div className="mb-6 flex items-center justify-between gap-3">
              <h3 className="font-serif text-2xl">
                {editingId ? "Update Product" : "Add New Product"}
              </h3>

              <button
                type="button"
                onClick={closeForm}
                aria-label="Close form"
                className="rounded-lg p-2 hover:bg-[#FBF6F0]"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Product Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-[#EFD5D0] px-4 py-3 outline-none focus:border-[#A8556A]"
                  placeholder="e.g. Floral Dress"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Price (₹)
                </label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-[#EFD5D0] px-4 py-3 outline-none focus:border-[#A8556A]"
                  placeholder="999"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#EFD5D0] bg-white px-4 py-3 outline-none focus:border-[#A8556A]"
                >
                  <option value="Clothing">Clothing</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Stock
                </label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-[#EFD5D0] px-4 py-3 outline-none focus:border-[#A8556A]"
                  placeholder="10"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>
                <textarea
                  name="des"
                  value={form.des}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full rounded-xl border border-[#EFD5D0] px-4 py-3 outline-none focus:border-[#A8556A]"
                  placeholder="Describe your product..."
                />
              </div>

              {/* Image upload */}
              <div className="sm:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <ImagePlus size={18} />
                  Product Images (Maximum 5, 5 MB each)
                </label>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full rounded-xl border border-[#EFD5D0] bg-white px-4 py-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-[#EFD5D0] file:px-4 file:py-2 file:text-[#3B2431]"
                />

                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                    {images.map((image, index) => (
                      <div key={`${image.name}-${index}`}>
                        <img
                          src={URL.createObjectURL(image)}
                          alt={image.name}
                          className="h-28 w-full rounded-xl border border-[#EFD5D0] object-cover"
                        />
                        <p className="mt-1 truncate text-xs text-[#765C68]">
                          {image.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {editingId && (
                  <p className="mt-2 text-xs text-[#765C68]">
                    New images select karogi toh existing images ke saath add hongi.
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 rounded-full bg-[#A8556A] px-7 py-3 font-medium text-white hover:bg-[#8F4056] disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Product"
                  : "Save Product"}
            </button>
          </form>
        )}

        {/* Product list */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-[#EFD5D0] bg-white">
          <div className="flex items-center gap-3 border-b border-[#EFD5D0] p-5">
            <Package className="text-[#A8556A]" size={22} />
            <div>
              <h3 className="font-serif text-xl">All Products</h3>
              <p className="text-sm text-[#765C68]">
                {products.length} products
              </p>
            </div>
          </div>

          {loading ? (
            <p className="p-6 text-sm text-[#765C68]">
              Loading products...
            </p>
          ) : products.length === 0 ? (
            <p className="p-6 text-sm text-[#765C68]">
              No products found. Click Add Product to create your first product.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-[#FBF6F0] text-[#765C68]">
                  <tr>
                    <th className="px-5 py-4 font-medium">Product</th>
                    <th className="px-5 py-4 font-medium">Category</th>
                    <th className="px-5 py-4 font-medium">Price</th>
                    <th className="px-5 py-4 font-medium">Stock</th>
                    <th className="px-5 py-4 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-t border-[#F3E7E1]"
                    >
                      <td className="px-5 py-4 font-medium">
                        <div className="flex items-center gap-3">
                          {product.img?.[0] ? (
                            <img
                              src={product.img[0]}
                              alt={product.name}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#FBF6F0]">
                              <Package size={20} />
                            </div>
                          )}
                          {product.name}
                        </div>
                      </td>

                      <td className="px-5 py-4">{product.category}</td>

                      <td className="px-5 py-4">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </td>

                      <td className="px-5 py-4">{product.stock}</td>

                      <td className="px-5 py-4">
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => openEditForm(product)}
                            className="text-[#A8556A] hover:text-[#8F4056]"
                            title="Edit product"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(product._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete product"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
