import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { ArrowRight } from "lucide-react";
import { BsYoutube } from "react-icons/bs";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

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

export default function Login() {
  const {
    login,
    isLoggingIn,
    loginError,
    googleLogin,
    isGoogleAuthPending,
    googleAuthError,
    loginMutation
  } = useAuth();


  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(credentials);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    if(loginError){
      loginMutation.reset()
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Panel */}
      <div className="relative hidden md:flex flex-col items-start justify-center p-12 bg-gradient-to-br from-emerald-500 to-teal-600 overflow-hidden">
        <FloatingShape className="w-32 h-32 rounded-full bg-teal-400/20 top-1/4 left-1/4" />
        <FloatingShape
          className="w-40 h-40 rounded-full bg-emerald-400/20 bottom-1/4 right-1/4"
          delay={1}
        />
        <FloatingShape
          className="w-24 h-24 rounded-full bg-teal-300/20 top-1/3 right-1/3"
          delay={2}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-white"
        >
          <div className="mb-8">
            <span className="text-3xl text-red-600">
              <BsYoutube />
            </span>
            <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-teal-50">
              To keep connected with us please login with your personal info
            </p>
          </div>

          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 rounded-full border-2 border-white text-white hover:bg-white hover:text-teal-600 transition-colors"
            >
              Sign Up
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-Primary">Sign In</h2>
            <p className="mt-2 text-secondary">Login to your account</p>
          </div>

          {/* Google Sign In Button */}
          <motion.button
            onClick={googleLogin}
            disabled={isGoogleAuthPending}
            className="w-full flex items-center justify-center text-secondary gap-3 px-4 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {isGoogleAuthPending ? (
              "Connecting..."
            ) : (
              <>
                <span className="text-2xl">
                  <FcGoogle />
                </span>
                <span>Sign in with Google</span>
              </>
            )}
          </motion.button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-base-100 text-accent">
                or Continue with
              </span>
            </div>
          </div>

          {/* Error Messages */}
          {/* {(loginError || googleAuthError) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
            >
              {loginError?.message || googleAuthError?.message}
            </motion.div>
          )} */}

          {(loginError || googleAuthError) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
            >
              {/* Access the error directly since it's now a string */}
              {loginError || googleAuthError}
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {isLoggingIn ? "Signing in..." : "Sign In"}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          {/* Register Link (Mobile) */}
          <div className="text-center md:hidden">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-teal-600 hover:text-teal-700 font-medium"
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
