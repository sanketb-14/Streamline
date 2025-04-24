"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { ArrowRight } from 'lucide-react'
import { BsYoutube } from "react-icons/bs"
import { FcGoogle } from "react-icons/fc"

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
)

/**
 * Registration page component with email/password and Google authentication
 */
export default function Register() {
  // Authentication hooks
  const {
    register,
    isRegistering,
    registerError,
    googleLogin,
    isGoogleAuthPending,
    googleAuthError,
  } = useAuth()

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  })

  const [passwordError, setPasswordError] = useState("")

  /**
   * Handle input changes and reset errors
   * @param {React.ChangeEvent} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    // Clear password error when user starts typing
    if (passwordError) setPasswordError("")
  }

  /**
   * Handle form submission
   * @param {React.FormEvent} e - Form event
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate password match
    if (formData.password !== formData.passwordConfirm) {
      setPasswordError("Passwords do not match")
      return
    }

    register(formData)
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-base-100">
      {/* Left Panel - Decorative with sign in option */}
      <div className="relative hidden md:flex flex-col items-start justify-center p-12 bg-gradient-to-br from-primary to-primary-focus overflow-hidden">
        <FloatingShape className="w-32 h-32 rounded-full bg-primary/20 top-1/4 left-1/4" />
        <FloatingShape className="w-40 h-40 rounded-full bg-primary/20 bottom-1/4 right-1/4" delay={1} />
        <FloatingShape className="w-24 h-24 rounded-full bg-primary/20 top-1/3 right-1/3" delay={2} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-primary-content"
        >
          <div className="mb-8">
            <span className="text-3xl text-error"><BsYoutube/></span>
            <h2 className="text-4xl font-bold mb-4">Welcome!</h2>
            <p className="text-primary-content/80">
              Create an account to get started with our platform
            </p>
          </div>
          
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 rounded-full border-2 border-primary-content text-primary-content hover:bg-primary-content hover:text-primary transition-colors"
            >
              Sign In
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="flex items-center justify-center p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md space-y-6"
        >
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-base-content">Create Account</h2>
            <p className="mt-2 text-base-content/70">Sign up to get started</p>
          </div>

          {/* Google Sign Up Button */}
          <motion.button
            onClick={googleLogin}
            disabled={isGoogleAuthPending}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-accent rounded-full hover:bg-base-200 transition-colors text-base-content"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {isGoogleAuthPending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <span className="text-2xl"><FcGoogle /></span>
                <span>Sign up with Google</span>
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
          {(registerError || googleAuthError || passwordError) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg text-sm"
            >
              {passwordError || registerError || googleAuthError}
            </motion.div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full px-4 py-3 rounded-lg border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-base-200/50"
              />
            </div>

            <div className="space-y-2">
              <input
                type="email"
                name="email"
                value={formData.email}
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
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full px-4 py-3 rounded-lg border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-base-200/50"
              />
            </div>

            <div className="space-y-2">
              <input
                type="password"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                className="w-full px-4 py-3 rounded-lg border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-base-200/50"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isRegistering}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-content rounded-lg hover:bg-primary-focus transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {isRegistering ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  Sign Up
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link (Mobile) */}
          <div className="text-center md:hidden pt-4">
            <p className="text-base-content/70">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:text-primary-focus font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}