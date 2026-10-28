
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

export default function App() {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Navbar />}
      <Outlet />
    </>
  );
}
