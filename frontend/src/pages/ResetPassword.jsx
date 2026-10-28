
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout.jsx";

const API_URL = "http://localhost:8000/api/v1/user";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetPassword = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Reset token is missing!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        toast.error(data.message || "Password reset failed!");
        return;
      }

      toast.success("Password reset successfully!");
      setPassword("");
      setConfirmPassword("");
      navigate("/login");
    } catch (error) {
      toast.error("Network error! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Create a new password for your Pashmi account."
    >
      <form
        onSubmit={resetPassword}
        className="space-y-5"
        autoComplete="off"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-[#3B2431]">
            New Password
          </label>

          <div className="flex rounded-xl border border-[#EFD5D0] focus-within:border-[#A8556A]">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              autoComplete="off"
              required
              className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3.5 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="px-4 text-[#A8556A]"
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#3B2431]">
            Confirm Password
          </label>

          <div className="flex rounded-xl border border-[#EFD5D0] focus-within:border-[#A8556A]">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              autoComplete="off"
              required
              className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3.5 outline-none"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="px-4 text-[#A8556A]"
            >
              {showConfirmPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#A8556A] px-4 py-3.5 font-semibold text-white transition hover:bg-[#8F4056] disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <p className="text-center text-sm text-[#3B2431]/70">
          Remember your password?{" "}
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

export default ResetPassword;
