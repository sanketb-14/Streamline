import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Check, ArrowRight, Save, AlertCircle, Loader2, PenLine, Info } from 'lucide-react';
import { useChannel } from '../../../hooks/useChannel';
import { Card } from './dashboardHome';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const EditChannel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    channelData,
    isLoadingChannel,
    channelError,
    updateChannel,
    isUpdatingChannel,
    updateChannelError,
    isOwnChannel
  } = useChannel(user?.channel?._id);

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const hasNoChannel = !user?.channel?._id;

  // Memoized to prevent unnecessary recalculations
  const channelId = useMemo(() => user?.channel?._id, [user?.channel?._id]);

  useEffect(() => {
    if (channelData && !hasNoChannel) {
      setFormData({
        name: channelData.name || '',
        description: channelData.description || ''
      });
    }
  }, [channelData, hasNoChannel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!updateChannel || hasNoChannel) {
        throw new Error("You don't have permission to update this channel");
      }
      
      await updateChannel(formData);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  // Loading state
  if (isLoadingChannel && !hasNoChannel) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="mt-4 text-content">Loading channel data...</p>
        </div>
      </Card>
    );
  }

  // Error state
  if (channelError && !hasNoChannel) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
          <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
          <h3 className="text-lg font-medium text-content mb-2">Error Loading Channel</h3>
          <p className="text-red-500 mb-4">
            {channelError.message || 'Failed to load channel data'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-focus transition-colors"
          >
            Try Again
          </button>
        </div>
      </Card>
    );
  }
  
  // No channel state
  if (hasNoChannel) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-6">
        <motion.div 
          className="max-w-md w-full bg-gradient-to-tr from-base-300 to-base-100 rounded-xl shadow-lg overflow-hidden"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-8 text-center">
            <motion.div 
              className="w-16 h-16 bg-base-100 rounded-full mx-auto mb-6 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Info className="w-8 h-8 text-blue-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-primary mb-3">No Channel Found</h2>
            <p className="mb-4 text-content">
              You don't have a channel yet. Create your first channel to get started.
            </p>
            <motion.button
              onClick={() => navigate('/dashboard/create')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-focus text-white rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Channel
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Permission check
  if (!isOwnChannel) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
          <AlertCircle className="w-12 h-12 mb-4 text-amber-500" />
          <h3 className="text-lg font-medium text-content mb-2">Access Denied</h3>
          <p className="text-amber-500 mb-4">
            You don't have permission to edit this channel
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-focus transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-2 mb-6">
          <PenLine className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold text-accent">Edit Channel</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-content mb-1">
              <div className="flex items-center space-x-2">
                <Edit2 className="w-4 h-4 text-secondary" />
                <span>Channel Name</span>
              </div>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-base-100 transition-all"
              placeholder="Enter channel name"
              required
              minLength={3}
              maxLength={50}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-content mb-1">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-secondary" />
                <span>Description</span>
              </div>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-base-100 transition-all"
              rows="4"
              placeholder="Enter channel description"
              required
              minLength={10}
              maxLength={500}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end gap-3"
          >
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border border-base-300 rounded-md hover:bg-base-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdatingChannel}
              className="flex items-center space-x-2 bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-focus transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdatingChannel ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </motion.div>

          {updateChannelError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center space-x-2"
            >
              <AlertCircle className="w-5 h-5" />
              <span>{updateChannelError.message || 'Error updating channel'}</span>
            </motion.div>
          )}
        </form>
      </motion.div>
    </Card>
  );
};

export default React.memo(EditChannel);