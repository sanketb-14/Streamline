import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastProvider = ({ children }) => {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: 'font-sans',

          // Default options for all toasts
          style: {
            background: 'hsl(var(--b1))', // Default background color
            color: 'hsl(var(--bc))', // Default text color
            border: '1px solid hsl(var(--b3))', // Default border color
            padding: '1rem',
            borderRadius: 'var(--rounded-box, 1rem)', // Border radius
            fontWeight: 500,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          },

          // Success toast style
          success: {
            icon: '✅',
            style: {
              background: 'green', // Green background for success
              border: '1px solid hsl(var(--suc))', // Success border color
              color: 'white', // White text for better contrast
            },
            iconTheme: {
              primary: 'white', // White icon for better contrast
              secondary: 'green', // Green background for icon
            },
          },

          // Error toast style
          error: {
            icon: '❌',
            style: {
              background: 'red', // Red background for error
              border: '1px solid hsl(var(--erc))', // Error border color
              color: 'white', // White text for better contrast
            },
            iconTheme: {
              primary: 'white', // White icon for better contrast
              secondary: 'red', // Red background for icon
            },
          },

          // Loading toast style
          loading: {
            style: {
              background: 'hsl(var(--b2))', // Neutral background for loading
              border: '1px solid hsl(var(--b3))', // Neutral border color
              color: 'hsl(var(--bc))', // Neutral text color
            },
            iconTheme: {
              primary: 'hsl(var(--p))', // Primary color for loading icon
              secondary: 'hsl(var(--b1))', // Secondary color for loading icon
            },
          },
        }}
        gutter={8}
        containerStyle={{
          top: 20,
          right: 20,
        }}
        containerClassName="toast-container"
      />
    </>
  );
};

export default ToastProvider;