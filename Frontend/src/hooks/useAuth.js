import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useGoogleLogin } from "@react-oauth/google";
import axiosInstance from "../Services/axios";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Get current user data
  const {
    data: user,
    isPending: isLoadingUser,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) return null;

      try {
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axiosInstance.get("/users/me");
        
        if (!response.data?.data?.user) {
          throw new Error("Invalid user data received");
        }
        
        return response.data.data.user;
      } catch (error) {
        // Handle different error scenarios
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            // Clear token if unauthorized
            localStorage.removeItem("token");
            axiosInstance.defaults.headers.common["Authorization"] = null;
            return null;
          }
          throw {
            message: error.response?.data?.message || "Failed to fetch user data",
            status: error.response?.status,
            details: error.response?.data,
          };
        }
        throw {
          message: "An unexpected error occurred while fetching user data",
          details: error,
        };
      }
    },
    retry: (failureCount, error) => {
      // Don't retry for 401 errors
      return error.status !== 401 && failureCount < 3;
    },
  });

  // Function to update user data in cache
  const updateUser = (newUserData) => {
    queryClient.setQueryData(["user"], (oldData) => 
      oldData ? { ...oldData, ...newUserData } : null
    );
    refetchUser();
  };

  // Common error handler for mutations
  const handleMutationError = (error) => {
    if (axios.isAxiosError(error)) {
      return {
        message: error.response?.data?.message || "Request failed",
        status: error.response?.status,
        details: error.response?.data,
      };
    }
    if (error instanceof Error) {
      return { message: error.message };
    }
    return { message: "An unknown error occurred" };
  };

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      try {
        const response = await axiosInstance.post("/users/register", userData);
        if (!response.data?.token) {
          throw new Error("Registration successful but no token received");
        }
        return response.data;
      } catch (error) {
        throw handleMutationError(error);
      }
    },
    onSuccess: (data) => {
      const token = data.token;
      localStorage.setItem("token", token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      queryClient.setQueryData(["user"], data.data.user);
      navigate("/login");
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      try {
        const response = await axiosInstance.post("/users/login", credentials);
        
        if (response.data.status !== "success" || !response.data.token) {
          throw new Error(response.data.message || "Login failed - invalid response");
        }
        
        return response.data;
      } catch (error) {
        throw handleMutationError(error);
      }
    },
    onSuccess: async (data) => {
      const token = data.token;
      localStorage.setItem("token", token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      // Fetch fresh user data after login
      try {
        const userResponse = await axiosInstance.get("/users/me");
        queryClient.setQueryData(["user"], userResponse.data.data.user);
        navigate("/");
      } catch (error) {
        console.error("Failed to fetch user after login:", error);
        // Even if we can't get fresh data, we can still navigate
        navigate("/");
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });

  // Google auth mutation
  const googleAuthMutation = useMutation({
    mutationFn: async (googleUserData) => {
      try {
        const response = await axiosInstance.post("/users/google", googleUserData);
        if (!response.data?.token) {
          throw new Error("Google authentication successful but no token received");
        }
        return response.data;
      } catch (error) {
        throw handleMutationError(error);
      }
    },
    onSuccess: (data) => {
      const token = data.token;
      localStorage.setItem("token", token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      queryClient.setQueryData(["user"], data.data.user);
      navigate("/");
    },
    onError: (error) => {
      console.error("Google auth error:", error);
    },
  });

  // Google Sign-In function
  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${codeResponse.access_token}`,
            },
          }
        );

        if (!userInfo.data?.email) {
          throw new Error("Failed to get user info from Google");
        }

        await googleAuthMutation.mutateAsync({
          email: userInfo.data.email,
          name: userInfo.data.name,
          picture: userInfo.data.picture,
        });
      } catch (error) {
        console.error("Google login error:", error);
        throw {
          message: "Failed to authenticate with Google",
          details: error,
        };
      }
    },
    onError: (error) => {
      console.error("Google OAuth error:", error);
      throw {
        message: "Google authentication failed",
        details: error,
      };
    },
    scope: "email profile",
  });

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    axiosInstance.defaults.headers.common["Authorization"] = null;
    queryClient.clear();
    navigate("/");
  };

  return {
    user,
    isLoadingUser,
    userError: userError?.message || null, // Return just the message
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error?.message || null, // Just the message
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error?.message || null, // Just the message
    googleLogin,
    isGoogleAuthPending: googleAuthMutation.isPending,
    googleAuthError: googleAuthMutation.error?.message || null, // Just the message
    logout,
    updateUser,
    refetchUser,
  };
};