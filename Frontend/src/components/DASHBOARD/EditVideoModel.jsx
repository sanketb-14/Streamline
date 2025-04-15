"use client";

import { motion } from 'framer-motion';
import { X, Save, Loader2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

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

const EditVideoModal = ({ video, onClose, onSave, isUpdating }) => {
  const safeVideo = video || { 
    title: '', 
    description: '', 
    tags: [] 
  };

  const [formData, setFormData] = useState({
    title: safeVideo.title,
    description: safeVideo.description,
    tags: Array.isArray(safeVideo.tags) ? safeVideo.tags : []
  });

  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});

  const handleTagAdd = (e) => {
    e.preventDefault();
    const tag = tagInput.trim();

    if (formData.tags.length >= 5) {
      setErrors({ ...errors, tags: "You can only add up to 5 tags" });
      return;
    }

    if (tag && !formData.tags.includes(tag)) {
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
          tags: `Please select from valid tags: ${VALID_TAGS.join(", ")}` 
        });
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate title length (same as upload modal)
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="bg-base-100 rounded-lg p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Edit Video</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title*</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, title: e.target.value }));
                if (e.target.value.length >= 10) {
                  setErrors({ ...errors, title: undefined });
                }
              }}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => 
                setFormData(prev => ({ ...prev, description: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-md"
              rows="3"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Tags (up to 5)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
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
                className={`flex-1 px-3 py-2 border rounded-md ${
                  errors.tags ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a tag</option>
                {VALID_TAGS.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleTagAdd}
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            {errors.tags && (
              <p className="text-red-500 text-xs mt-1">{errors.tags}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formData.tags.length}/5 tags used. Valid tags: {VALID_TAGS.join(', ')}
            </p>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md flex items-center"
              disabled={isUpdating || !!errors.title || !!errors.tags}
            >
              {isUpdating ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditVideoModal;