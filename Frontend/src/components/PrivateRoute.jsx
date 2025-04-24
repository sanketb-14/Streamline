import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from './Loader';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { ShieldAlert } from 'lucide-react';

/**
 * PrivateRoute Component
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to render if authenticated
 * @param {Array} [props.allowedRoles] - Optional array of allowed user roles
 * @param {boolean} [props.requireVerified] - Whether to require verified email
 * @returns {JSX.Element} - Rendered private route component
 */
const PrivateRoute = ({ children, allowedRoles, requireVerified = false }) => {
  const { user, isLoadingUser, isError, error } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Authentication error", {
        icon: <ShieldAlert className="text-error" />,
      });
    }
  }, [isError, error]);

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" message="Verifying session..." fullScreen={false} />
      </div>
    );
  }

  // User not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user needs to verify email
  if (requireVerified && !user.isVerified) {
    toast.error("Please verify your email first", {
      icon: <ShieldAlert className="text-error" />,
    });
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    toast.error("You don't have permission to access this page", {
      icon: <ShieldAlert className="text-error" />,
    });
    return <Navigate to="/" replace />;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  requireVerified: PropTypes.bool,
};

export default PrivateRoute;