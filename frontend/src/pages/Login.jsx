
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import AuthLayout from "../components/AuthLayout.jsx";

const API_URL = "http://localhost:8000/api/v1/user";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const result = await res.json();

      if (!res.ok || result.success === false) {
        throw new Error(
          typeof result.data === "string"
            ? result.data
            : "Invalid email or password!"
        );
      }

      const user = result.message?.user;

      if (!user) {
        throw new Error("Login successful, but user details were not received.");
      }

      setEmail("");
      setPassword("");
      setShowPassword(false);

      toast.success("Login successful!");

      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      const message = err.message || "Network error! Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="w-full space-y-5"
      >
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-[#3B2431]"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            name="pashmi-login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            required
            className="w-full rounded-xl border border-[#EFD5D0] bg-white px-4 py-3 outline-none focus:border-[#A8556A]"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-[#3B2431]"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="pashmi-login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="new-password"
              required
              className="w-full rounded-xl border border-[#EFD5D0] bg-white px-4 py-3 pr-12 outline-none focus:border-[#A8556A]"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#765C68]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-[#A8556A] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#A8556A] px-5 py-3 font-medium text-white transition hover:bg-[#8F4056] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-[#765C68]">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-[#A8556A] hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}