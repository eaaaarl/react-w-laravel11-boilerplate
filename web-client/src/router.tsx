import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BaseApp from "@/components/base/BaseApp";
import { BaseAuth } from "./components/base/BaseAuth";
import LoginPage from "./pages/LoginPage";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import DashboardPage from "@/pages/DashboardPage";
import StudentPage from "@/pages/StudentPage";
import StudentFormPage from "@/pages/StudentFormPage";

const router = createBrowserRouter([
  {
    element: <BaseApp />,
    children: [
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/student",
        element: (
          <ProtectedRoute>
            <StudentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/form/:operation",
        element: (
          <ProtectedRoute>
            <StudentFormPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "",
    element: <BaseAuth />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
]);

const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Router;
