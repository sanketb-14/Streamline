import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Check, ArrowRight, Save, AlertCircle, Loader2, PenLine, Info } from 'lucide-react';
import { useChannel } from '../../../hooks/useChannel';
import { Card } from './dashboardHome';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const EditChannel = () => {
  // Get channel ID from URL or context if needed
  // const { id } = useParams(); // Uncomment if you're using route params

  const {user} = useAuth()
  
  
  
  const {
    channelData,
    isLoadingChannel,
    channelError,
    updateChannel,
    isUpdatingChannel,
    updateChannelError,
    isOwnChannel
  } = useChannel(user.channel._id); // Pass ID if required: useChannel(id)

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
 
  const navigate = useNavigate();
  
  // Load initial data
  useEffect(() => {
    if (channelData) {
      setFormData({
        name: channelData.name || '',
        description: channelData.description || ''
      });
    }
  }, [channelData]);

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
      // Check if updateChannel is available (user owns the channel)
      if (!updateChannel) {
        throw new Error("You don't have permission to update this channel");
      }
      
      await updateChannel(formData);
      // Success will be handled by the toast in the useChannel hook
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  if (isLoadingChannel) {
    return (
      <Card>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  if (channelError) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center h-64 text-red-500">
          <AlertCircle className="w-12 h-12 mb-4" />
          <p>{channelError.message || 'Error loading channel data'}</p>
        </div>
      </Card>
    );
  }
  
  const ExistingChannelMessage = () => (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-gradient-to-tr from-base-300 to-base-100 rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-base-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-3">No Channel Found</h2>
          <p className="mb-4">
            You have to create first channel. You can create your channel through the dashboard.
          </p>
          <button
            onClick={() => navigate('/dashboard/create')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200"
          >
            Create Channel
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  if (channelData === undefined) return <ExistingChannelMessage />;

  // Add a check to prevent editing if user doesn't own the channel
  if (!isOwnChannel) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center h-64 text-amber-500">
          <AlertCircle className="w-12 h-12 mb-4" />
          <p>You don't have permission to edit this channel</p>
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
              className="w-full px-3 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-base-100"
              placeholder="Enter channel name"
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
              className="w-full px-3 py-2 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-base-100"
              rows="4"
              placeholder="Enter channel description"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end"
          >
            <button
              type="submit"
              disabled={isUpdatingChannel}
              className="flex items-center space-x-2 bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-focus transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdatingChannel ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isUpdatingChannel ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </motion.div>

          {updateChannelError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
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

export default EditChannel;