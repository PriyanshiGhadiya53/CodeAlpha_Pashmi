
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  UserRound,
  Mail,
  AtSign,
  Package,
  MapPin,
  LogOut,
  ArrowLeft,
  LoaderCircle,
} from "lucide-react";

const API_URL = "http://localhost:8000/api/v1";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/user/me`, {
          credentials: "include",
        });

        const result = await response.json();

        if (response.status === 401) {
          toast.error("Please login to view your profile.");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(result.message || "Could not load profile.");
        }

        setUser(result.data);
      } catch (error) {
        toast.error(error.message || "Could not load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const response = await fetch(`${API_URL}/user/logout`, {
        method: "POST",
        credentials: "include",
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Logout failed.");
      }

      toast.success("Logged out successfully.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Could not log out.");
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FBF6F0] text-[#A8556A]">
        <LoaderCircle className="mr-2 animate-spin" size={22} />
        Loading your profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FBF6F0] px-4 py-20 text-center text-[#3B2431]">
        <h1 className="font-serif text-3xl">Profile unavailable</h1>
        <Link
          to="/login"
          className="mt-5 inline-block rounded-full bg-[#A8556A] px-6 py-3 text-sm text-white"
        >
          Login
        </Link>
      </div>
    );
  }

  const details = [
    {
      label: "Full Name",
      value: user.fullName || "Not provided",
      icon: UserRound,
    },
    {
      label: "Username",
      value: user.userName || "Not provided",
      icon: AtSign,
    },
    {
      label: "Email Address",
      value: user.email || "Not provided",
      icon: Mail,
    },
  ];

  return (
    <main className="min-h-screen bg-[#FBF6F0] px-4 py-8 pb-24 text-[#3B2431] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-[#A8556A] transition hover:text-[#873E53]"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        {/* Profile Header */}
        <section className="relative mt-6 overflow-hidden rounded-3xl border border-[#EFD5D0] bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-r from-[#F5DCDD] via-[#FBECE6] to-[#EFD5D0] sm:h-36" />

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-12 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-[#FBF6F0] text-[#A8556A] shadow-sm sm:-mt-14 sm:h-28 sm:w-28">
              <UserRound size={48} strokeWidth={1.4} />
            </div>

            <h1 className="mt-4 font-serif text-3xl font-semibold sm:text-4xl">
              {user.fullName || "My Profile"}
            </h1>

            <p className="mt-2 text-sm text-[#765C68]">
              Welcome to your Pashmi account.
            </p>

            {user.role === "admin" && (
              <span className="mt-3 inline-block rounded-full bg-[#F7E5E5] px-3 py-1 text-xs font-medium text-[#A8556A]">
                Administrator
              </span>
            )}
          </div>
        </section>

        {/* Personal Information */}
        <section className="mt-6 rounded-3xl border border-[#EFD5D0] bg-white p-5 shadow-sm sm:p-7">
          <h2 className="font-serif text-2xl">Personal Information</h2>

          <div className="mt-5 space-y-3">
            {details.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex min-w-0 items-center gap-4 rounded-2xl bg-[#FBF6F0] p-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#A8556A]">
                  <Icon size={20} strokeWidth={1.7} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-[#765C68]">{label}</p>
                  <p className="mt-1 break-words text-sm font-medium">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Account Actions */}
        <section className="mt-6 rounded-3xl border border-[#EFD5D0] bg-white p-5 shadow-sm sm:p-7">
          <h2 className="font-serif text-2xl">My Account</h2>

          <div className="mt-5 space-y-3">
            <Link
              to="/my-orders"
              className="flex items-center justify-between gap-3 rounded-2xl border border-[#EFD5D0] p-4 transition hover:bg-[#FBF6F0]"
            >
              <div className="flex items-center gap-3">
                <Package className="text-[#A8556A]" size={22} />
                <div>
                  <p className="text-sm font-medium">My Orders</p>
                  <p className="mt-1 text-xs text-[#765C68]">
                    View your orders and their status
                  </p>
                </div>
              </div>

              <ArrowLeft className="rotate-180 text-[#A8556A]" size={18} />
            </Link>

            <div className="flex items-center gap-3 rounded-2xl border border-[#EFD5D0] p-4">
              <MapPin className="text-[#A8556A]" size={22} />
              <div>
                <p className="text-sm font-medium">Delivery Address</p>
                <p className="mt-1 text-xs text-[#765C68]">
                  Your saved addresses can be managed here in a future update.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-[#E7BFC0] px-5 py-3 text-sm font-medium text-[#A8556A] transition hover:bg-[#FBF0F0] disabled:opacity-60"
            >
              <LogOut size={18} />
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Profile;
