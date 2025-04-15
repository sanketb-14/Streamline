// src/utils/toast.js
import toast from 'react-hot-toast';

export const showToast = {
  success: (message) => {
    toast.success(message, {
      className: 'toast-success',
    });
  },
  
  error: (message) => {
    toast.error(message, {
      className: 'toast-error',
    });
  },
  
  loading: (message) => {
    return toast.loading(message, {
      className: 'toast-loading',
    });
  },
  
  promise: async (promise, messages = {}) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || 'Loading...',
        success: messages.success || 'Success!',
        error: messages.error || 'An error occurred',
      },
      {
        loading: {
          className: 'toast-loading',
        },
        success: {
          className: 'toast-success',
        },
        error: {
          className: 'toast-error',
        },
      }
    );
  },
};