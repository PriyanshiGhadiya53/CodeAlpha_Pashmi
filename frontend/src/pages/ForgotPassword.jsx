
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AuthLayout from "../components/AuthLayout.jsx";
import toast from "react-hot-toast";

const API_URL = "http://localhost:8000/api/v1/user";

function ForgotPassword() {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const forgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email.trim().toLowerCase() }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Request failed!");
                return;
            }

            toast.success("Reset token generated successfully!");
            const token = data.data?.resetToken;

            if (token) {
                navigate(`/reset-password/${token}`);
            } else {
                toast.error("Reset token response mein nahi mila!");
            }
            setEmail("");
            console.log("Forgot password response:", data);
        } catch (error) {
            console.log("Forgot password error:", error);
            toast.error("Network error! Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Forgot Password?"
            subtitle="Enter your registered email to reset your password."
        >
            <form onSubmit={forgotPassword} autoComplete="off" className="space-y-5">
                <div>
                    <label className="mb-2 block text-sm font-medium text-[#3B2431]">
                        Email Address
                    </label>

                    <input
                        type="email"
                        name="pashmi-forgot-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        autoComplete="off"
                        required
                        className="w-full rounded-xl border border-[#EFD5D0] bg-white px-4 py-3.5 outline-none focus:border-[#A8556A]"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-[#A8556A] py-3.5 font-semibold text-white hover:bg-[#8F4056] disabled:opacity-50"
                >
                    {loading ? "Processing..." : "Reset Password"}
                </button>

                <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 text-sm font-semibold text-[#A8556A] hover:underline"
                >
                    <ArrowLeft size={16} />
                    Back to Login
                </Link>
            </form>
        </AuthLayout>
    );
}

export default ForgotPassword;
