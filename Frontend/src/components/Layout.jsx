import { Suspense, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import Navbar from "./HEADER/Navbar";

const Layout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard", { replace: true }); // Use `replace` to avoid adding to history
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-base-100 w-full flex flex-col items-center">
      <Suspense fallback={<Loader />}>
        <Navbar />
        <main className="w-full max-w-8xl p-2 sm:p-4 mt-14">
          <Outlet />
        </main>
      </Suspense>
    </div>
  );
};

export default Layout;