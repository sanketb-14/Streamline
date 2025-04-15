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
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) return null;

      try {
        // Set token in headers before making the request
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axiosInstance.get("/users/me");
        return response.data.data.user;
      } catch (error) {
        // Clear token if unauthorized
        localStorage.removeItem("token");
        axiosInstance.defaults.headers.common["Authorization"] = null;
        return null;
      }
    },
  });

  // Function to update user data in cache
  const updateUser = (newUserData) => {
    queryClient.setQueryData(["user"], (oldData) => ({
      ...oldData,
      ...newUserData,
    }));
    refetchUser();
  };

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await axiosInstance.post("/users/register", userData);
      return response.data;
    },
    onSuccess: (data) => {
      const token = data.token;
      localStorage.setItem("token", token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      queryClient.setQueryData(["user"], data.data.user);
      navigate("/login");
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await axiosInstance.post("/users/login", credentials);
      if (response.data.status !== "success") {
        throw new Error(response.data.message || "Login failed");
      }
      return response.data;
    },
    onSuccess: async (data) => {
      const token = data.token;
      localStorage.setItem("token", token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      // Fetch fresh user data after login
      const userResponse = await axiosInstance.get("/users/me");
      queryClient.setQueryData(["user"], userResponse.data.data.user);
      navigate("/");
    },
  });

  // Google auth mutation
  const googleAuthMutation = useMutation({
    mutationFn: async (googleUserData) => {
      const response = await axiosInstance.post("/users/google", googleUserData);
      return response.data;
    },
    onSuccess: (data) => {
      const token = data.token;
      localStorage.setItem("token", token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      queryClient.setQueryData(["user"], data.data.user);
      navigate("/");
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

        await googleAuthMutation.mutateAsync({
          email: userInfo.data.email,
          name: userInfo.data.name,
          picture: userInfo.data.picture,
        });
      } catch (error) {
        console.error("Google login error:", error);
        throw new Error("Failed to fetch user info from Google");
      }
    },
    onError: (error) => {
      console.error("Google OAuth error:", error);
      throw new Error("Google authentication failed");
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
    register: registerMutation.mutate,
    login: loginMutation.mutate,
    googleLogin,
    logout,
    updateUser,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isGoogleAuthPending: googleAuthMutation.isPending,
    // Return error messages instead of error objects
    loginError: loginMutation.error?.message || null,
    registerError: registerMutation.error?.message || null,
    googleAuthError: googleAuthMutation.error?.message || null,
    refetchUser,
  };
};