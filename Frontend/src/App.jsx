import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./providers/AuthProvider";
import ToastProvider from "./providers/ToastProvider";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import ErrorPage from "./components/ErrorPage";
import Loader from "./components/Loader";

// Lazy-loaded components for better performance
const Home = lazy(() => import("./components/PAGES/Home"));
const Login = lazy(() => import("./components/AUTH/Login"));
const Register = lazy(() => import("./components/AUTH/Register"));
const OtherChannelPage = lazy(() => import("./components/CHANNEL/OtherChannel"));
const WatchVideo = lazy(() => import("./components/PAGES/WatchVideo"));
const DashboardLayout = lazy(() => import("./components/DASHBOARD/Layout"));
const DashboardHome = lazy(() => import("./components/DASHBOARD/pages/DashboardHome"));
const CreateChannel = lazy(() => import("./components/DASHBOARD/pages/CreateChannel"));
const EditChannel = lazy(() => import("./components/DASHBOARD/pages/EditChannel"));
const ChannelStatistics = lazy(() => import("./components/DASHBOARD/pages/ChannelStatistics"));
const EditProfileModal = lazy(() => import("./components/DASHBOARD/pages/EditProfileModal"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { 
        index: true, 
        element: (
          <Suspense fallback={<Loader fullScreen />}>
            <Home />
          </Suspense>
        ) 
      },
      { 
        path: "/login", 
        element: (
          <Suspense fallback={<Loader fullScreen />}>
            <Login />
          </Suspense>
        ) 
      },
      { 
        path: "/register", 
        element: (
          <Suspense fallback={<Loader fullScreen />}>
            <Register />
          </Suspense>
        ) 
      },
      {
        path: "/channel/:channelId",
        element: (
          <Suspense fallback={<Loader fullScreen />}>
            <OtherChannelPage />
          </Suspense>
        )
      },
      {
        path: "/watch/:videoId",
        element: (
          <Suspense fallback={<Loader fullScreen />}>
            <WatchVideo />
          </Suspense>
        )
      },
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <Suspense fallback={<Loader fullScreen />}>
              <DashboardLayout />
            </Suspense>
          </PrivateRoute>
        ),
        children: [
          { 
            index: true, 
            element: <DashboardHome /> 
          },
          { 
            path: "create", 
            element: <CreateChannel /> 
          },
          { 
            path: "edit", 
            element: <EditChannel /> 
          },
          { 
            path: "statistics", 
            element: <ChannelStatistics /> 
          },
          { 
            path: "editme", 
            element: <EditProfileModal /> 
          }
        ],
      },
    ],
  },
]);

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <ToastProvider>
          <RouterProvider 
            router={router} 
            fallbackElement={<Loader fullScreen />}
          />
        </ToastProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;