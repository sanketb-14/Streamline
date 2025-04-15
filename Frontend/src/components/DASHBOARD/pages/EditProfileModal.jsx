"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Trash2, Loader2 } from 'lucide-react'
import { useUserProfile } from '../../../hooks/useUserProfile'
import { useAuth } from '../../../hooks/useAuth'
import toast from 'react-hot-toast'

const EditProfileModal = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    photo: null,
  })
  const [previewUrl, setPreviewUrl] = useState(null)
  const { updateMe, isUpdatingProfile, updateMeError } = useUserProfile()

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || '',
      }))
    }
  }, [user])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type and size if needed
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }
      
      // 5MB limit for example
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB')
        return
      }

      setFormData(prev => ({ ...prev, photo: file }))
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Create FormData object
    const formDataToSend = new FormData()
    
    // Only append fullName if it has changed
    if (formData.fullName !== user.fullName) {
      formDataToSend.append('fullName', formData.fullName)
    }
    
    // Append photo if selected - important: the field name must match your backend expectation
    if (formData.photo) {
      formDataToSend.append('photo', formData.photo)
    }
    
    try {
      updateMe(formDataToSend, {
        onSuccess: (response) => {
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
            setPreviewUrl(null)
          }
          setFormData(prev => ({
            ...prev,
            photo: null
          }))
          toast.success("Profile updated successfully")
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update profile")
        }
      })
    } catch (error) {
      toast.error("An error occurred while updating profile")
    }
  }

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, photo: null }))
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="pt-8 w-full max-w-2xl m-4 rounded-2xl shadow-2xl overflow-hidden"
      >
        <motion.div 
          className="relative h-60 bg-gradient-to-r from-purple-600 to-blue-600"
          initial={{ height: 0 }}
          animate={{ height: 80 }}
          transition={{ duration: 0.3 }}
        />

        <div className="px-6 pb-6">
          <motion.div 
            className="relative -mt-16 mb-6 flex justify-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative group">
              <motion.div
                className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={previewUrl || (user.photo === "default.webp" 
                    ? "http://localhost:4000/public/img/users/default.webp"
                    : `http://localhost:4000/public/img/users/${user.photo}`)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-8 h-8 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {(previewUrl || user.photo !== "default.webp") && (
                <motion.button
                  type="button"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={removePhoto}
                  className="absolute -bottom-2 -right-2 p-2 bg-red-500 text-white rounded-full shadow-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
            </div>

            {updateMeError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-50 border border-red-200"
              >
                <p className="text-sm text-red-600">{updateMeError}</p>
              </motion.div>
            )}

            <motion.div 
              className="flex justify-end gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                type="submit"
                disabled={isUpdatingProfile}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isUpdatingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
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

export default EditProfileModal