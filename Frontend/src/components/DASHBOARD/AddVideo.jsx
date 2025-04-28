"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Loader2, Video, Tag, FileText, AlertTriangle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../Services/axios";
import toast from "react-hot-toast";

/**
 * CustomProgressBar - Displays upload progress with animated effects
 */
const CustomProgressBar = ({ progress, isPending }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    setAnimatedProgress(progress);
    
    if (isPending && progress >= 95) {
      const interval = setInterval(() => {
        setAnimatedProgress(current => {
          if (current >= 99) return 97;
          return Math.min(99, current + 0.2);
        });
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [progress, isPending]);

  return (
    <div className="w-full bg-base-200 rounded-full h-2">
      <div
        className="bg-primary h-2 rounded-full transition-all duration-300"
        style={{ width: `${animatedProgress}%` }}
      />
    </div>
  );
};

/**
 * VideoUploadModal - Component for uploading videos with progress tracking
 * 
 * Features:
 * - Responsive design with DaisyUI styling
 * - Animated transitions with Framer Motion
 * - Progress tracking with visual feedback
 * - Form validation
 * - Tag management
 * - Video preview
 */
const VideoUploadModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [],
    video: null,
  });
  const [tagInput, setTagInput] = useState("");
  const [videoPreview, setVideoPreview] = useState(null);
  const [errors, setErrors] = useState({});

  // Predefined valid tags
  const VALID_TAGS = [
    "Technology", "Education", "Entertainment", 
    "Music", "Gaming", "News", 
    "Sports", "Comedy", "Film", "Science"
  ];

  const uploadVideoMutation = useMutation({
    mutationFn: async (data) => {
      const formDataToSend = new FormData();
      formDataToSend.append("video", data.video);
      formDataToSend.append("title", data.title);
      formDataToSend.append("description", data.description);
      data.tags.forEach((tag) => formDataToSend.append("tags", tag));

      setUploadProgress(1);

      const response = await axiosInstance.post("/videos", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      return response.data;
    },
    onSuccess: () => {
      setUploadProgress(100);
      queryClient.invalidateQueries(["channel"]);
      toast.success("Video uploaded successfully!");
      onClose();
      resetForm();
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message;
      const newErrors = {};

      if (errorMessage.includes("title")) {
        if (errorMessage.includes("at least 10 characters")) {
          newErrors.title = "Title must be at least 10 characters";
        } else if (errorMessage.includes("at max 50 characters")) {
          newErrors.title = "Title must be at most 50 characters";
        }
      }

      if (errorMessage.includes("Description must be at 100 characters")) {
        newErrors.description = "Description must be at most 100 characters";
      }

      if (errorMessage.includes("not a valid enum value")) {
        newErrors.tags = `Please select from valid tags: ${VALID_TAGS.join(", ")}`;
      }

      if (errorMessage.includes("up to 5 tags")) {
        newErrors.tags = "You can only add up to 5 tags";
      }

      if (errorMessage.includes("file size") || errorMessage.includes("duration")) {
        newErrors.video = "Video exceeds size or duration limits";
      }

      setErrors(newErrors);
      toast.error("Please fix the validation errors");
    },
  });

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("video/")) {
        // Check file size (50MB = 52428800 bytes)
        if (file.size > 52428800) {
          toast.error("Video file size exceeds 50MB limit");
          setErrors((prev) => ({ ...prev, video: "Video must be less than 50MB" }));
          return;
        }
        
        setFormData((prev) => ({ ...prev, video: file }));
        setVideoPreview(URL.createObjectURL(file));
        setErrors((prev) => ({ ...prev, video: undefined }));
      } else {
        toast.error("Please select a valid video file");
      }
    }
  };

  const handleTagAdd = (e) => {
    e.preventDefault();
    const tag = tagInput.trim();

    if (formData.tags.length >= 5) {
      setErrors((prev) => ({ ...prev, tags: "You can only add up to 5 tags" }));
      return;
    }

    if (tag && !formData.tags.includes(tag)) {
      if (VALID_TAGS.includes(tag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tag],
        }));
        setTagInput("");
        setErrors((prev) => ({ ...prev, tags: undefined }));
      } else {
        setErrors((prev) => ({
          ...prev,
          tags: `Please select from valid tags: ${VALID_TAGS.join(", ")}`,
        }));
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      tags: [],
      video: null,
    });
    setTagInput("");
    setErrors({});
    setUploadProgress(0);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    if (formData.title.length < 10) {
      setErrors((prev) => ({
        ...prev,
        title: "Title must be at least 10 characters",
      }));
      return;
    }

    if (!formData.video) {
      toast.error("Please select a video file");
      return;
    }

    uploadVideoMutation.mutate(formData);
  };

  const getUploadStatusMessage = () => {
    if (uploadProgress < 95) {
      return "Uploading video...";
    } else if (uploadProgress >= 95 && uploadProgress < 100) {
      return "Processing video...";
    } else {
      return "Upload complete!";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-base-100/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-base-100 rounded-box shadow-2xl w-full max-w-2xl border border-base-300 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 px-6 py-4 border-b border-base-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Video className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-bold text-base-content">
                    Upload New Video
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="btn btn-ghost btn-sm btn-circle"
                  disabled={uploadVideoMutation.isPending}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Warning Notice */}
            <div className="px-6 py-3 bg-warning/75 border-b border-warning/20">
              <div className="flex items-center gap-2 text-warning-content">
                <AlertTriangle className="w-5 h-5  text-warning" />
                <p className="text-sm  font-medium">
                  Please note: This is a practice project. Upload videos less than 25MB and 10 minutes in duration. Maximum 2-3 videos per user.
                </p>
              </div>
            </div>

            {/* Upload Progress */}
            {uploadVideoMutation.isPending && (
              <div className="px-6 py-3 bg-primary/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-primary">
                    {getUploadStatusMessage()}
                  </span>
                  <span className="text-sm font-medium text-primary">
                    {Math.min(Math.round(uploadProgress), 99)}%
                  </span>
                </div>
                <CustomProgressBar 
                  progress={uploadProgress} 
                  isPending={uploadVideoMutation.isPending} 
                />
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Video Upload */}
              <div className="space-y-2">
                <label className="label">
                  <span className="label-text text-base-content">
                    Video File
                    <span className="text-error">*</span>
                  </span>
                </label>
                <div className="relative">
                  {!videoPreview ? (
                    <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-base-300 rounded-box h-48 hover:border-primary transition-colors gap-2">
                      <Upload className="w-10 h-10 text-base-content/50" />
                      <span className="text-sm text-base-content/70">
                        Click to upload video
                      </span>
                      <span className="text-xs text-base-content/50">
                        MP4, WebM, or MOV (max 50MB, 10 minutes)
                      </span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="hidden"
                        required
                      />
                    </label>
                  ) : (
                    <div className="relative h-48 bg-base-300 rounded-box overflow-hidden">
                      <video
                        src={videoPreview}
                        className="w-full h-full object-contain"
                        controls
                      />
                      <button
                        type="button"
                        onClick={() => {
                          URL.revokeObjectURL(videoPreview);
                          setVideoPreview(null);
                          setFormData((prev) => ({ ...prev, video: null }));
                        }}
                        className="absolute top-2 right-2 btn btn-error btn-xs btn-circle"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                {errors.video && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.video}</span>
                  </label>
                )}
              </div>

              {/* Title */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content">
                    Title
                    <span className="text-error">*</span>
                  </span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, title: e.target.value }));
                      if (e.target.value.length >= 10) {
                        setErrors((prev) => ({ ...prev, title: undefined }));
                      }
                    }}
                    className={`input input-bordered w-full pl-10 ${
                      errors.title ? "input-error" : ""
                    }`}
                    placeholder="Enter video title (minimum 10 characters)"
                    required
                  />
                </div>
                {errors.title && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.title}</span>
                  </label>
                )}
              </div>

              {/* Description */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content">
                    Description
                    <span className="text-error">*</span>
                  </span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="textarea textarea-bordered w-full h-32"
                  placeholder="Enter video description"
                  required
                />
              </div>

              {/* Tags */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content">
                    Tags (up to 5)
                  </span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag) => (
                    <div key={tag} className="badge badge-primary gap-2">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-error"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                    <select
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      className={`select select-bordered w-full pl-10 ${
                        errors.tags ? "select-error" : ""
                      }`}
                    >
                      <option value="">Select a tag</option>
                      {VALID_TAGS.map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleTagAdd}
                    className="btn btn-primary"
                    disabled={!tagInput || formData.tags.length >= 5}
                  >
                    Add
                  </button>
                </div>
                {errors.tags && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.tags}</span>
                  </label>
                )}
                <label className="label">
                  <span className="label-text-alt text-base-content/50">
                    {formData.tags.length}/5 tags used
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-ghost"
                  disabled={uploadVideoMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadVideoMutation.isPending || !formData.video}
                  className="btn btn-primary gap-2"
                >
                  {uploadVideoMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload Video"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoUploadModal;