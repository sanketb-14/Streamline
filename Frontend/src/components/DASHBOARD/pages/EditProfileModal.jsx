"use client"

import React, { useState, useEffect, useCallback ,useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Trash2, Loader2 } from 'lucide-react'
import { useUserProfile } from '../../../hooks/useUserProfile'
import { useAuth } from '../../../hooks/useAuth'
import toast from 'react-hot-toast'

const EditProfileModal = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    photo: null
  })
  const [previewUrl, setPreviewUrl] = useState(null)
  const { updateMe, isUpdatingProfile, updateMeError } = useUserProfile()

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || ''
      }))
    }
  }, [user])

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPEG, PNG, etc.)')
      return
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB')
      return
    }

    // Create preview URL and update state
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    setFormData(prev => ({ ...prev, photo: file }))
  }, [])

  const removePhoto = useCallback(() => {
    setFormData(prev => ({ ...prev, photo: null }))
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }, [previewUrl])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check if there are any changes
    const hasNameChanged = formData.fullName !== user.fullName
    const hasPhotoChanged = !!formData.photo
    
    if (!hasNameChanged && !hasPhotoChanged) {
      toast('No changes to save', { icon: 'ℹ️' })
      return
    }

    const formDataToSend = new FormData()
    
    if (hasNameChanged) {
      formDataToSend.append('fullName', formData.fullName)
    }
    
    if (hasPhotoChanged) {
      formDataToSend.append('photo', formData.photo)
    }
    
    try {
      await updateMe(formDataToSend)
      toast.success("Profile updated successfully")
      removePhoto() // Clean up preview after successful update
    } catch (error) {
      toast.error(error.message || "Failed to update profile")
    }
  }

  // Memoized profile image source
  const profileImageSrc = useMemo(() => {
    if (previewUrl) return previewUrl
    return user?.photo === "default.webp" 
      ? "https://www.clipartkey.com/mpngs/m/152-1520367_user-profile-default-image-png-clipart-png-download.png"
      : user?.photo
  }, [previewUrl, user?.photo])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="pt-8 w-full max-w-2xl mx-4 rounded-2xl shadow-xl overflow-hidden bg-base-200"
      >
        {/* Header with gradient background */}
        <motion.div 
          className="relative h-20 bg-gradient-to-tr from-primary to-accent"
          initial={{ height: 0 }}
          animate={{ height: 80 }}
          transition={{ duration: 0.3 }}
        />

        {/* Profile content */}
        <div className="px-6 pb-8">
          {/* Profile picture with upload controls */}
          <motion.div 
            className="relative -mt-16 mb-6 flex justify-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative group">
              <motion.div
                className="w-32 h-32 rounded-full border-4 border-secondary overflow-hidden shadow-lg bg-gray-100"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <img
                  src={profileImageSrc}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
              
              {/* File upload overlay */}
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                <Camera className="w-8 h-8 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* Remove photo button */}
              {(previewUrl || user?.photo !== "default.webp") && (
                <motion.button
                  type="button"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={removePhoto}
                  className="absolute -bottom-2 -right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                  aria-label="Remove profile photo"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Edit form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-base-content/80 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-base-content focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
                minLength={2}
                maxLength={50}
                required
              />
            </motion.div>

            {/* Error message */}
            {updateMeError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm"
              >
                {updateMeError}
              </motion.div>
            )}

            {/* Action buttons */}
            <motion.div 
              className="flex justify-end gap-3 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                type="submit"
                disabled={isUpdatingProfile}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-70 transition-all flex items-center gap-2 min-w-[120px] justify-center"
              >
                {isUpdatingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  'Save Changes'
                )}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default React.memo(EditProfileModal)