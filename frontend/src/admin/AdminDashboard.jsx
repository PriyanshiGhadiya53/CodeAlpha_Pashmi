
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Clock,
  ArrowRight,
  RefreshCw,
  Store,
  Menu,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";

const API_URL = "https://codealpha-pashmi-backend.onrender.com/api/v1";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);

    try {
      const [orderRes, productRes] = await Promise.all([
        fetch(`${API_URL}/order/admin/all`, {
          credentials: "include",
        }),
        fetch(`${API_URL}/product`, {
          credentials: "include",
        }),
      ]);

      const orderData = await orderRes.json();
      const productData = await productRes.json();

      if (!orderRes.ok || orderData.success === false) {
        throw new Error(
          typeof orderData.message === "string"
            ? orderData.message
            : "Could not load orders"
        );
      }

      if (!productRes.ok || productData.success === false) {
        throw new Error("Could not load products");
      }

      const orderList =
        orderData.data?.orders ||
        (Array.isArray(orderData.data) ? orderData.data : []);

      const productList =
        productData.data?.products ||
        (Array.isArray(productData.data) ? productData.data : []);

      setOrders(orderList);
      setProducts(productList);
    } catch (error) {
      toast.error(error.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "Pending"
  ).length;

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const stats = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
    },
    {
      title: "Total Products",
      value: products.length,
      icon: Package,
    },
  ];

  const navItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
      active: true,
    },
    {
      label: "Manage Products",
      path: "/admin/products",
      icon: Package,
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
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-[#3B2431] px-4 py-3 text-white shadow-md md:hidden">
        <Link to="/admin/dashboard">
          <h1 className="font-serif text-2xl">Pashmi</h1>
          <p className="text-[10px] tracking-[3px] text-[#EFD5D0]">
            ADMIN PANEL
          </p>
        </Link>

        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          aria-expanded={sidebarOpen}
          className="rounded-xl p-2 hover:bg-white/10"
        >
          {sidebarOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 max-w-[85vw] overflow-y-auto bg-[#3B2431] p-5 text-white transition-transform duration-300 md:sticky md:top-0 md:z-20 md:h-screen md:w-64 md:max-w-none md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link
            to="/admin/dashboard"
            onClick={() => setSidebarOpen(false)}
          >
            <h1 className="font-serif text-3xl">Pashmi</h1>
            <p className="mt-1 text-xs tracking-[3px] text-[#EFD5D0]">
              ADMIN PANEL
            </p>
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-2 hover:bg-white/10 md:hidden"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="mt-8 flex flex-col gap-2">
          {navItems.map(({ label, path, icon: Icon, active }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                active
                  ? "bg-[#A8556A] text-white"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={19} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-[#A8556A]">Welcome back</p>
            <h2 className="mt-1 font-serif text-3xl sm:text-4xl">
              Admin Dashboard
            </h2>
            <p className="mt-2 text-sm text-[#765C68]">
              Manage your Pashmi store from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchDashboard}
            disabled={loading}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-full border border-[#EFD5D0] bg-white px-4 py-3 text-sm transition hover:bg-[#EFD5D0] disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 xl:grid-cols-3">
          {stats.map(({ title, value, icon: Icon }) => (
            <div
              key={title}
              className="rounded-2xl border border-[#EFD5D0] bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-[#765C68]">{title}</p>

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFD5D0] text-[#A8556A] sm:h-11 sm:w-11">
                  <Icon size={21} />
                </span>
              </div>

              <p className="mt-4 text-3xl font-semibold">
                {loading ? "..." : value}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-[#EFD5D0] bg-white sm:mt-8">
          <div className="flex items-center justify-between gap-3 border-b border-[#EFD5D0] p-4 sm:p-6">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl">
                Recent Orders
              </h3>
              <p className="mt-1 text-xs text-[#765C68] sm:text-sm">
                Latest customer orders
              </p>
            </div>

            <Link
              to="/admin/orders"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-[#A8556A] hover:underline"
            >
              All orders <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <p className="p-6 text-sm text-[#765C68]">
              Loading dashboard...
            </p>
          ) : recentOrders.length === 0 ? (
            <p className="p-6 text-sm text-[#765C68]">
              No orders found yet.
            </p>
          ) : (
            <>
              {/* Mobile Order Cards */}
              <div className="divide-y divide-[#F3E7E1] md:hidden">
                {recentOrders.map((order) => (
                  <div key={order._id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-[#765C68]">Order ID</p>
                        <p className="mt-1 font-semibold">
                          #{order._id.slice(-6).toUpperCase()}
                        </p>
                      </div>

                      <span className="max-w-[130px] rounded-full bg-[#EFD5D0] px-3 py-1 text-center text-xs text-[#8F4056]">
                        {order.orderStatus || "Pending"}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs text-[#765C68]">Customer</p>
                      <p className="mt-1 break-words text-sm">
                        {order.user?.fullName || "Customer"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs text-[#765C68]">Amount</p>
                        <p className="mt-1 font-semibold">
                          ₹
                          {Number(order.totalAmount || 0).toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>

                      <Link
                        to="/admin/orders"
                        className="rounded-full border border-[#EFD5D0] px-3 py-2 text-xs font-medium text-[#A8556A]"
                      >
                        View orders
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Orders Table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead className="bg-[#FBF6F0] text-[#765C68]">
                    <tr>
                      <th className="px-5 py-4 font-medium">Order ID</th>
                      <th className="px-5 py-4 font-medium">Customer</th>
                      <th className="px-5 py-4 font-medium">Amount</th>
                      <th className="px-5 py-4 font-medium">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-t border-[#F3E7E1]"
                      >
                        <td className="px-5 py-4 font-medium">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>

                        <td className="px-5 py-4">
                          {order.user?.fullName || "Customer"}
                        </td>

                        <td className="px-5 py-4">
                          ₹
                          {Number(order.totalAmount || 0).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-block rounded-full bg-[#EFD5D0] px-3 py-1 text-xs text-[#8F4056]">
                            {order.orderStatus || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
