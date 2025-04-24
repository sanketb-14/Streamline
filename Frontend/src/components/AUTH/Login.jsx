import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { ArrowRight } from "lucide-react";
import { BsYoutube } from "react-icons/bs";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

/**
 * Floating animated shape component for decorative background elements
 * @param {string} className - Additional CSS classes
 * @param {number} delay - Animation delay in seconds
 */
const FloatingShape = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute ${className}`}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 10, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      delay,
    }}
  />
);

/**
 * Login page component with email/password and Google authentication
 */
export default function Login() {
  // Authentication hooks and state
  const {
    login,
    isLoggingIn,
    loginError,
    googleLogin,
    isGoogleAuthPending,
    googleAuthError,
    loginMutation,
  } = useAuth();

  // Form state
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  /**
   * Handle form submission
   * @param {React.FormEvent} e - Form event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    login(credentials);
  };

  /**
   * Handle input changes and reset errors
   * @param {React.ChangeEvent} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Reset errors when user starts typing
    if (loginError) loginMutation.reset();
    if (googleAuthError) googleAuthMutation.reset();
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-base-100">
      {/* Left Panel - Decorative with sign up option */}
      <div className="relative hidden md:flex flex-col items-start justify-center p-12 bg-gradient-to-br from-primary to-primary-focus overflow-hidden">
        {/* Animated background elements */}
        <FloatingShape className="w-32 h-32 rounded-full bg-primary/20 top-1/4 left-1/4" />
        <FloatingShape
          className="w-40 h-40 rounded-full bg-primary/20 bottom-1/4 right-1/4"
          delay={1}
        />
        <FloatingShape
          className="w-24 h-24 rounded-full bg-primary/20 top-1/3 right-1/3"
          delay={2}
        />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-primary-content"
        >
          <div className="mb-8">
            <span className="text-3xl text-error">
              <BsYoutube />
            </span>
            <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-primary-content/80">
              To keep connected with us please login with your personal info
            </p>
          </div>

          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 rounded-full border-2 border-primary-content text-primary-content hover:bg-primary-content hover:text-primary transition-colors"
            >
              Sign Up
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex items-center justify-center p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md space-y-6"
        >
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-base-content">Sign In</h2>
            <p className="mt-2 text-base-content/70">Login to your account</p>
          </div>

          {/* Google Sign In Button */}
          <motion.button
            onClick={googleLogin}
            disabled={isGoogleAuthPending}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-accent rounded-full hover:bg-base-300 transition-colors text-base-content"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {isGoogleAuthPending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <span className="text-2xl">
                  <FcGoogle />
                </span>
                <span>Sign in with Google</span>
              </>
            )}
          </motion.button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-base-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-base-100 text-base-content/70">
                or continue with
              </span>
            </div>
          </div>

          {/* Error Messages */}
          {(loginError || googleAuthError) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg text-sm"
            >
              {loginError || googleAuthError}
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 rounded-lg border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-base-200/50"
              />
            </div>

            <div className="space-y-2">
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full px-4 py-3 rounded-lg border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-base-200/50"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-content rounded-lg hover:bg-primary-focus transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {isLoggingIn ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Register Link (Mobile) */}
          <div className="text-center md:hidden pt-4">
            <p className="text-base-content/70">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary hover:text-primary-focus font-medium"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}