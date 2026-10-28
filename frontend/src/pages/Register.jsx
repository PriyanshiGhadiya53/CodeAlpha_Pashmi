
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "../components/AuthLayout.jsx";

const API_URL = "http://localhost:8000/api/v1/user";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          fullName: fullName.trim(),
          userName: userName.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(
          typeof data.message === "string"
            ? data.message
            : "Registration failed! Please try again."
        );
      }

      setSuccess("Account created successfully! Redirecting to login...");

      setFullName("");
      setUserName("");
      setEmail("");
      setPassword("");
      setShowPassword(false);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(err.message || "Network error! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join Pashmi and discover your signature style."
    >
      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#3B2431]">
            Full Name
          </label>

          <input
            type="text"
            name="pashmi-register-fullname"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            autoComplete="off"
            required
            className="w-full rounded-xl border border-[#EFD5D0] bg-white px-4 py-3 outline-none transition focus:border-[#A8556A] focus:ring-2 focus:ring-[#A8556A]/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#3B2431]">
            Username
          </label>

          <input
            type="text"
            name="pashmi-register-username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Choose a username"
            autoComplete="off"
            required
            className="w-full rounded-xl border border-[#EFD5D0] bg-white px-4 py-3 outline-none transition focus:border-[#A8556A] focus:ring-2 focus:ring-[#A8556A]/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#3B2431]">
            Email Address
          </label>

          <input
            type="email"
            name="pashmi-register-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            autoComplete="off"
            required
            className="w-full rounded-xl border border-[#EFD5D0] bg-white px-4 py-3 outline-none transition focus:border-[#A8556A] focus:ring-2 focus:ring-[#A8556A]/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#3B2431]">
            Password
          </label>

          <div className="flex rounded-xl border border-[#EFD5D0] focus-within:border-[#A8556A] focus-within:ring-2 focus-within:ring-[#A8556A]/10">
            <input
              type={showPassword ? "text" : "password"}
              name="pashmi-register-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              autoComplete="new-password"
              required
              className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="px-4 text-sm font-medium text-[#A8556A]"
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#A8556A] px-4 py-3.5 font-semibold text-white transition hover:bg-[#8F4056] disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-[#3B2431]/70">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#A8556A] hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
