import { Suspense, useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Loader from "./Loader";
import Navbar from "./HEADER/Navbar";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const handleTokenFromURL = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        try {
          setIsAuthenticating(true);
          
          // Store token and remove from URL
          localStorage.setItem("token", token);
          window.history.replaceState({}, document.title, window.location.pathname);

          // Optional: Validate token with your backend
          // await validateToken(token);

          // Navigate to dashboard or intended path
          const redirectPath = location.state?.from || "/dashboard";
          navigate(redirectPath, { replace: true });

          // Show success feedback
          toast.success("Login successful!", {
            icon: <CheckCircle className="text-success" />,
          });
        } catch (error) {
          console.error("Authentication error:", error);
          toast.error("Invalid or expired token", {
            icon: <XCircle className="text-error" />,
          });
          navigate("/login", { replace: true });
        } finally {
          setIsAuthenticating(false);
        }
      }
    };

    handleTokenFromURL();
  }, [navigate, location]);

  return (
    <div className="min-h-screen bg-base-100 w-full flex flex-col items-center">
      {/* Global notification toast */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5000,
          style: {
            background: 'var(--base-200)',
            color: 'var(--base-content)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: 'var(--rounded-box, 1rem)',
          },
        }}
      />

      {/* Show full-page loader during authentication */}
      {isAuthenticating ? (
        <div className="fixed inset-0 flex items-center justify-center bg-base-100/80 z-50">
          <Loader size="lg" message="Authenticating..." />
        </div>
      ) : (
        <>
          <Navbar />
          
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-8xl p-1 sm:p-6 mt-16" // Adjusted for navbar height
          >
            <Suspense 
              fallback={
                <div className="flex justify-center py-20">
                  <Loader size="md" />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </motion.main>
        </>
      )}
    </div>
  );
};

export default Layout;