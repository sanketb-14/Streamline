import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";

import PrivateRoute from "./components/PrivateRoute";

import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./components/AUTH/Login";
import Register from "./components/AUTH/Register";
import ErrorPage from "./components/ErrorPage";
import Loader from "./components/Loader";
import { Suspense } from "react";
import DashboardLayout from "./components/DASHBOARD/Layout";
import DashboardHome from "./components/DASHBOARD/pages/DashboardHome";
import CreateChannel from "./components/DASHBOARD/pages/CreateChannel";
import EditChannel from "./components/DASHBOARD/pages/EditChannel";
import ChannelStatistics from "./components/DASHBOARD/pages/ChannelStatistics";
import ToastProvider from "./providers/ToastProvider";
import EditProfileModal from "./components/DASHBOARD/pages/EditProfileModal";
import Home from "./components/PAGES/Home";
import OtherChannelPage from "./components/CHANNEL/OtherChannel";
import WatchVideo from "./components/PAGES/WatchVideo";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      {path:"/channel/:channelId", element:<OtherChannelPage/>},
      {path:"/watch/:videoId" , element:<WatchVideo/>} ,
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <Suspense fallback={<Loader />}>
              <DashboardLayout />
            </Suspense>
          </PrivateRoute>
        ),
        children: [
          { index: true, element: <DashboardHome /> },
          { path: "create", element: <CreateChannel /> },
          { path: "edit", element: <EditChannel /> },
          { path: "statistics", element: <ChannelStatistics /> },
          {path:"editme" , element: <EditProfileModal/>}
        ],
      },
    ],
  },
]);

function App() {
  return (
    <ToastProvider>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </GoogleOAuthProvider>
    </ToastProvider>
  );
}

export default App;
