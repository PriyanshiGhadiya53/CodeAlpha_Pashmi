
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Search,
  ShoppingBag,
  UserRound,
  Menu,
  X,
  House,
  Store,
  LayoutGrid,
  MoreHorizontal,
  LogOut,
  Package,
} from "lucide-react";

const API_URL = "https://codealpha-pashmi-backend.onrender.com/api/v1";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const navigate = useNavigate();

  const closeMenu = () => {
    setMenuOpen(false);
    setMoreOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm transition-all duration-200 ${
      isActive
        ? "bg-[#F7E5E5] font-semibold text-[#A8556A]"
        : "text-[#3B2431] hover:bg-white hover:text-[#A8556A]"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-[11px] font-medium transition-all duration-200 ${
      isActive
        ? "bg-[#F7E5E5] text-[#A8556A]"
        : "text-[#3B2431] hover:text-[#A8556A]"
    }`;

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      const response = await fetch(`${API_URL}/user/logout`, {
        method: "POST",
        credentials: "include",
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Logout failed");
      }

      closeMenu();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Could not log out");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#EFD5D0] bg-[#FBF6F0]/95 shadow-[0_3px_18px_rgba(59,36,49,0.05)] backdrop-blur-md">
        <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-12">
          {/* Pashmi Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            aria-label="Pashmi Home"
            className="shrink-0"
          >
            <span className="font-serif text-3xl font-bold tracking-wide text-[#3B2431] sm:text-4xl">
              Pashmi<span className="text-[#A8556A]">.</span>
            </span>

            <span className="mt-1 block text-[9px] font-medium uppercase tracking-[2px] text-[#C9A24B] sm:text-[10px]">
              Wear Your Grace
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-2 lg:flex xl:gap-4">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/shop" className={navLinkClass}>
              Shop
            </NavLink>

            <NavLink to="/categories" className={navLinkClass}>
              Categories
            </NavLink>

            <NavLink to="/cart" className={navLinkClass}>
              My Cart
            </NavLink>

            <a
              href="/#about"
              className="rounded-full px-3 py-2 text-sm text-[#3B2431] transition hover:bg-white hover:text-[#A8556A]"
            >
              About
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <Link
              to="/shop"
              aria-label="Search products"
              title="Search products"
              className="rounded-full p-2 text-[#3B2431] transition hover:bg-white hover:text-[#A8556A]"
            >
              <Search size={21} strokeWidth={1.7} />
            </Link>

            <Link
              to="/profile"
              aria-label="My Account"
              title="My Account"
              className="rounded-full p-2 text-[#3B2431] transition hover:bg-white hover:text-[#A8556A]"
            >
              <UserRound size={21} strokeWidth={1.7} />
            </Link>

            {/* Three-dot menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen((value) => !value)}
                aria-label="More options"
                aria-expanded={moreOpen}
                className="rounded-full p-2 text-[#3B2431] transition hover:bg-white hover:text-[#A8556A]"
              >
                <MoreHorizontal size={23} strokeWidth={1.8} />
              </button>

              {moreOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-48 rounded-xl border border-[#EFD5D0] bg-white p-2 shadow-xl">
                  <Link
                    to="/my-orders"
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#3B2431] transition hover:bg-[#FBF6F0] hover:text-[#A8556A]"
                  >
                    <Package size={17} />
                    My Orders
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-[#3B2431] transition hover:bg-[#FBF6F0] hover:text-[#A8556A] disabled:opacity-60"
                  >
                    <LogOut size={17} />
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}
            </div>

            <Link
              to="/cart"
              aria-label="Shopping cart"
              title="Shopping cart"
              className="hidden rounded-full bg-[#A8556A] p-2.5 text-white shadow-sm transition hover:bg-[#873E53] sm:inline-flex"
            >
              <ShoppingBag size={20} />
            </Link>

            {/* Mobile menu */}
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="rounded-full p-2 text-[#3B2431] transition hover:bg-white lg:hidden"
            >
              {menuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>

        {/* Mobile Expanded Menu */}
        {menuOpen && (
          <nav className="border-t border-[#EFD5D0] bg-[#FBF6F0] px-5 py-3 shadow-md lg:hidden">
            <div className="mx-auto flex max-w-xl flex-col">
              <Link
                to="/"
                onClick={closeMenu}
                className="border-b border-[#EFD5D0] py-3 text-sm text-[#3B2431]"
              >
                Home
              </Link>

              <Link
                to="/shop"
                onClick={closeMenu}
                className="border-b border-[#EFD5D0] py-3 text-sm text-[#3B2431]"
              >
                Shop
              </Link>

              <Link
                to="/shop"
                onClick={closeMenu}
                className="border-b border-[#EFD5D0] py-3 text-sm text-[#3B2431]"
              >
                Categories
              </Link>

              <Link
                to="/#about"
                onClick={closeMenu}
                className="border-b border-[#EFD5D0] py-3 text-sm text-[#3B2431]"
              >
                About
              </Link>

              <Link
                to="/my-orders"
                onClick={closeMenu}
                className="border-b border-[#EFD5D0] py-3 text-sm text-[#3B2431]"
              >
                My Orders
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="py-3 text-left text-sm text-[#3B2431] disabled:opacity-60"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#EFD5D0] bg-[#FFFCF9]/95 shadow-[0_-5px_20px_rgba(59,36,49,0.08)] backdrop-blur-lg lg:hidden">
        <div className="mx-auto flex max-w-xl items-stretch justify-around gap-1 px-2 pb-[env(safe-area-inset-bottom)] pt-1">
          <NavLink to="/" end className={mobileLinkClass}>
            <House size={21} strokeWidth={1.8} />
            <span>Home</span>
          </NavLink>

          <NavLink to="/shop" className={mobileLinkClass}>
            <Store size={21} strokeWidth={1.8} />
            <span>Shop</span>
          </NavLink>

          <NavLink to="/categories" className={mobileLinkClass}>
            <LayoutGrid size={21} strokeWidth={1.8} />
            <span>Categories</span>
          </NavLink>

          <NavLink to="/profile" className={mobileLinkClass}>
            <UserRound size={21} strokeWidth={1.8} />
            <span>Account</span>
          </NavLink>

          <NavLink to="/cart" className={mobileLinkClass}>
            <ShoppingBag size={21} strokeWidth={1.8} />
            <span>My Cart</span>
          </NavLink>
        </div>
      </nav>
    </>
  );
}
