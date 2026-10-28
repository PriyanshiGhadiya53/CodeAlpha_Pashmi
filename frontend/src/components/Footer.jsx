
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  UserRound,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const navLinkClass = ({ isActive }) =>
    `transition-colors duration-200 hover:text-[#A8556A] ${
      isActive ? "font-semibold text-[#A8556A]" : "text-[#3B2431]"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-[#EFD5D0] bg-[#FBF6F0]">
      <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-12">
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="shrink-0 text-[#3B2431]"
          aria-label="Pashmi home"
        >
          <span className="font-serif text-3xl font-bold tracking-wide sm:text-4xl">
            Pashmi<span className="text-[#A8556A]">.</span>
          </span>

          <span className="mt-1 block text-[9px] font-medium uppercase tracking-[2px] text-[#C9A24B] sm:text-[10px]">
            Wear Your Grace
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex xl:gap-9">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/shop" className={navLinkClass}>
            Shop
          </NavLink>

          <a
            href="/#categories"
            className="text-[#3B2431] transition-colors hover:text-[#A8556A]"
          >
            Categories
          </a>

          <a
            href="/#about"
            className="text-[#3B2431] transition-colors hover:text-[#A8556A]"
          >
            About
          </a>
        </nav>

        {/* Search, Account and Cart */}
        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          <Link
            to="/shop"
            aria-label="Search products"
            title="Search products"
            className="text-[#3B2431] transition-colors hover:text-[#A8556A]"
          >
            <Search size={21} strokeWidth={1.7} />
          </Link>

          <Link
            to="/login"
            aria-label="My account"
            title="My account"
            className="text-[#3B2431] transition-colors hover:text-[#A8556A]"
          >
            <UserRound size={21} strokeWidth={1.7} />
          </Link>

          <Link
            to="/cart"
            aria-label="Shopping cart"
            title="Shopping cart"
            className="text-[#3B2431] transition-colors hover:text-[#A8556A]"
          >
            <ShoppingBag size={21} strokeWidth={1.7} />
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            className="flex items-center justify-center rounded-md p-1 text-[#3B2431] transition-colors hover:text-[#A8556A] lg:hidden"
          >
            {menuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="border-t border-[#EFD5D0] bg-[#FBF6F0] px-5 py-3 shadow-md lg:hidden">
          <div className="mx-auto flex max-w-[1440px] flex-col">
            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) =>
                `border-b border-[#EFD5D0] py-3 text-sm ${
                  isActive
                    ? "font-semibold text-[#A8556A]"
                    : "text-[#3B2431]"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/shop"
              onClick={closeMenu}
              className={({ isActive }) =>
                `border-b border-[#EFD5D0] py-3 text-sm ${
                  isActive
                    ? "font-semibold text-[#A8556A]"
                    : "text-[#3B2431]"
                }`
              }
            >
              Shop
            </NavLink>

            <a
              href="/#categories"
              onClick={closeMenu}
              className="border-b border-[#EFD5D0] py-3 text-sm text-[#3B2431]"
            >
              Categories
            </a>

            <a
              href="/#about"
              onClick={closeMenu}
              className="py-3 text-sm text-[#3B2431]"
            >
              About
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
