
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-[#FBF6F0] lg:grid lg:grid-cols-2">
      {/* Left-side fashion panel */}
      <div className="relative hidden min-h-screen items-center justify-center overflow-hidden lg:flex">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85"
          alt="Pashmi fashion collection"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-[#3B2431]/55" />

        <div className="relative z-10 max-w-md px-10 text-center text-white">
          <Sparkles className="mx-auto mb-5 h-8 w-8 text-[#EFD5D0]" />

          <h1 className="font-serif text-6xl tracking-wide">Pashmi</h1>

          <p className="mt-5 text-lg tracking-widest">Wear Your Grace</p>

          <p className="mt-8 text-sm leading-7 text-white/80">
            Discover timeless styles and express your unique elegance with Pashmi.
          </p>
        </div>
      </div>

      {/* Right-side form panel */}
      <div className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-[#3B2431]/70 hover:text-[#A8556A]"
          >
            <ArrowLeft size={17} />
            Back to home
          </Link>

          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#A8556A]">
              PASHMI · WEAR YOUR GRACE
            </p>

            <h2 className="font-serif text-4xl text-[#3B2431] sm:text-5xl">
              {title}
            </h2>

            <p className="mt-3 text-sm text-[#3B2431]/65">{subtitle}</p>
          </div>

          {/* Login and Register navigation */}
          <div className="mb-7 grid grid-cols-2 rounded-xl bg-[#EFD5D0]/50 p-1">
            <Link
              to="/login"
              className={`rounded-lg py-3 text-center text-sm font-semibold transition ${
                title === "Welcome Back"
                  ? "bg-white text-[#A8556A] shadow-sm"
                  : "text-[#3B2431]/65 hover:text-[#A8556A]"
              }`}
            >
              Login
            </Link>

            <Link
              to="/register"
              className={`rounded-lg py-3 text-center text-sm font-semibold transition ${
                title === "Create Account"
                  ? "bg-white text-[#A8556A] shadow-sm"
                  : "text-[#3B2431]/65 hover:text-[#A8556A]"
              }`}
            >
              Register
            </Link>
          </div>

          {children}

          <p className="mt-8 text-center text-xs text-[#3B2431]/45">
            © Pashmi · Wear Your Grace
          </p>
        </div>
      </div>
    </div>
  );
}
