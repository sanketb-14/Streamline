"use client";

import { motion } from 'framer-motion';
import { X, Save, Loader2, Tag, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

/**
 * List of valid tags that users can select for their videos
 */
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

/**
 * EditVideoModal - A modal component for editing video metadata
 * 
 * @param {Object} props - Component props
 * @param {Object} props.video - The video object containing title, description, and tags
 * @param {Function} props.onClose - Function to call when closing the modal
 * @param {Function} props.onSave - Function to call when saving changes
 * @param {boolean} props.isUpdating - Whether the save operation is in progress
 * @returns {JSX.Element} The modal component
 */
const EditVideoModal = ({ video, onClose, onSave, isUpdating }) => {
  // Set default values if video is undefined
  const safeVideo = video || { 
    title: '', 
    description: '', 
    tags: [] 
  };

  // Form state management
  const [formData, setFormData] = useState({
    title: safeVideo.title,
    description: safeVideo.description,
    tags: Array.isArray(safeVideo.tags) ? safeVideo.tags : []
  });

  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});

  // Reset errors when form data changes
  useEffect(() => {
    const newErrors = {};
    
    if (formData.title && formData.title.length < 10) {
      newErrors.title = "Title must be at least 10 characters long";
    }
    
    setErrors(prev => ({
      ...prev,
      ...newErrors
    }));
  }, [formData.title]);

  /**
   * Handles adding a tag to the video
   * @param {Event} e - The event object
   */
  const handleTagAdd = (e) => {
    e.preventDefault();
    const tag = tagInput.trim();

    if (!tag) return;

    if (formData.tags.length >= 5) {
      setErrors({ ...errors, tags: "You can only add up to 5 tags" });
      return;
    }

    if (formData.tags.includes(tag)) {
      setErrors({ ...errors, tags: "This tag already exists" });
      return;
    }

    if (VALID_TAGS.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput("");
      setErrors({ ...errors, tags: undefined });
    } else {
      setErrors({ 
        ...errors, 
        tags: `Please select from valid tags` 
      });
    }
  };

  /**
   * Removes a tag from the video
   * @param {string} tagToRemove - The tag to remove
   */
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  /**
   * Handles form submission
   * @param {Event} e - The event object
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate title length
    if (formData.title.length < 10) {
      setErrors({ ...errors, title: "Title must be at least 10 characters long" });
      return;
    }

    // Prepare data for submission
    const submissionData = {
      title: formData.title,
      description: formData.description,
      tags: formData.tags
    };

    onSave(submissionData);
  };

  // Animation variants for fade-in effect
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } }
  };

  const modalVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 25 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={backdropVariants}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={(e) => {
        // Close modal when clicking outside
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        variants={modalVariants}
        className="bg-base-100 shadow-xl rounded-lg w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-base-300 flex justify-between items-center">
          <h3 className="text-lg font-bold text-base-content">Edit Video Details</h3>
          <button 
            onClick={onClose} 
            className="btn btn-ghost btn-sm btn-circle text-base-content/70 hover:text-base-content"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
          {/* Title Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Title<span className="text-error">*</span></span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, title: e.target.value }));
              }}
              className={`input input-bordered w-full ${
                errors.title ? "input-error" : ""
              }`}
              placeholder="Enter video title (min 10 characters)"
              required
            />
            {errors.title && (
              <div className="label">
                <span className="label-text-alt text-error flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.title}
                </span>
              </div>
            )}
          </div>
          
          {/* Description Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Description</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => 
                setFormData(prev => ({ ...prev, description: e.target.value }))
              }
              className="textarea textarea-bordered w-full"
              placeholder="Add a description for your video"
              rows="3"
            />
          </div>
          
          {/* Tags Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Tags</span>
              <span className="label-text-alt">{formData.tags.length}/5</span>
            </label>
            
            {/* Tag display */}
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.length > 0 ? (
                formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="badge badge-primary badge-outline gap-1 pl-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:bg-primary/20 rounded-full p-1"
                      aria-label={`Remove ${tag} tag`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-xs text-base-content/60 italic">No tags added yet</span>
              )}
            </div>
            
            {/* Tag selector */}
            <div className="flex gap-2">
              <select
                value={tagInput}
                onChange={(e) => {
                  setTagInput(e.target.value);
                  setErrors({ ...errors, tags: undefined });
                }}
                className={`select select-bordered flex-1 ${
                  errors.tags ? "select-error" : ""
                }`}
              >
                <option value="">Select a tag</option>
                {VALID_TAGS.filter(tag => !formData.tags.includes(tag)).map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleTagAdd}
                className="btn btn-primary"
                disabled={!tagInput || formData.tags.length >= 5}
                aria-label="Add tag"
              >
                <Tag className="w-4 h-4" />
                Add
              </button>
            </div>
            
            {errors.tags && (
              <div className="label">
                <span className="label-text-alt text-error flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.tags}
                </span>
              </div>
            )}
          </div>
        </form>
        
        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-base-300 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost"
            disabled={isUpdating}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={isUpdating || formData.title.length < 10}
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditVideoModal;