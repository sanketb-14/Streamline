"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Loader2, Video } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../Services/axios";
import toast from "react-hot-toast";

const CustomProgressBar = ({ progress }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    <div
      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
);

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

  // Predefined valid tags - replace these with your actual valid tags
  const VALID_TAGS = [
    "Technology",
    "Education",
    "Entertainment",
    "Music",
    "Gaming",
    "News",
    "Sports",
    "Comedy",
    "Film",
    "Science",
  ];

  const uploadVideoMutation = useMutation({
    mutationFn: async (data) => {
      const formDataToSend = new FormData();
      formDataToSend.append("video", data.video);
      formDataToSend.append("title", data.title);
      formDataToSend.append("description", data.description);
      data.tags.forEach((tag) => formDataToSend.append("tags", tag));

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
          newErrors.title = "Title must be at least 10 characters long";
        } else if (errorMessage.includes("at max 50 characters")) {
          newErrors.title = "Title must be at most 50 characters long";
        }
      }

      if (errorMessage.includes("Description must be at 100 characters")) {
        newErrors.description = "Description must be at most 100 characters";
      }

      if (errorMessage.includes("not a valid enum value")) {
        newErrors.tags = `Please select from valid tags: ${VALID_TAGS.join(
          ", "
        )}`;
      }

      if (errorMessage.includes("up to 5 tags")) {
        newErrors.tags = "You can only add up to 5 tags";
      }

      setErrors(newErrors);
      toast.error("Please fix the validation errors");
    },
  });

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("video/")) {
        setFormData((prev) => ({ ...prev, video: file }));
        setVideoPreview(URL.createObjectURL(file));
      } else {
        toast.error("Please select a valid video file");
      }
    }
  };

  const handleTagAdd = (e) => {
    e.preventDefault();
    const tag = tagInput.trim();

    // Check if we already have 5 tags
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

    // Validate title length
    if (formData.title.length < 10) {
      setErrors((prev) => ({
        ...prev,
        title: "Title must be at least 10 characters long",
      }));
      return;
    }

    if (!formData.video) {
      toast.error("Please select a video file");
      return;
    }

    uploadVideoMutation.mutate(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-base-100 bg-opacity-50 z-50 flex items-center justify-center "
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-base-100 rounded-xl shadow-xl w-full max-w-2xl m-4 overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-base-300 via-secondary to-base-200 px-6 py-4 ">
              <h2 className="text-xl font-bold text-base-content">
                Upload New Video
              </h2>
              <button
                onClick={onClose}
                className="absolute text-base-content/75 right-4 top-4 text- hover:text-base-content"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Upload Progress */}
            {uploadVideoMutation.isPending && (
              <div className="px-6 py-3 bg-blue-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-600">
                    Uploading video...
                  </span>
                  <span className="text-sm font-medium text-blue-600">
                    {uploadProgress}%
                  </span>
                </div>
                <CustomProgressBar progress={uploadProgress} />
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Video Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-primary">
                  Video File
                </label>
                <div className="relative">
                  {!videoPreview ? (
                    <label className="cursor-pointer flex items-center justify-center border-2 border-dashed border-base-content rounded-lg h-48 hover:border-blue-500 transition-colors">
                      <div className="text-center">
                        <Upload className="mx-auto w-12 h-12 text-base-content" />
                        <span className="mt-2 block text-sm text-base-content">
                          Click to upload video
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative h-48 bg-black rounded-lg">
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
                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-base-content"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, title: e.target.value }));
                    if (e.target.value.length >= 10) {
                      setErrors((prev) => ({ ...prev, title: undefined }));
                    }
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter video title (minimum 10 characters)"
                  required
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                  placeholder="Enter video description"
                  required
                />
              </div>

              {/* Tags section in the form */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (up to 5)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <select
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.tags ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a tag</option>
                    {VALID_TAGS.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleTagAdd}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
                {errors.tags && (
                  <p className="mt-1 text-sm text-red-500">{errors.tags}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {formData.tags.length}/5 tags used
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadVideoMutation.isPending}
                  className="px-4 py-2 bg-gradient-to-tr from-base-100 to-primary text-base-content rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 flex items-center gap-2"
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
