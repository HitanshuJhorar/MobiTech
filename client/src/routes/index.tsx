import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";

// Admin imports
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminProductForm from "../pages/admin/AdminProductForm";
import { ProtectedAdminRoute } from "../components/admin/ProtectedAdminRoute";
import { AdminLayout } from "../layouts/AdminLayout";

export const router = createBrowserRouter([
  // Customer Routes
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/shop",
    element: <Shop />,
  },
  {
    path: "/product/:id",
    element: <ProductDetails />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },

  // Admin Login (Unprotected)
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },

  // Protected Admin Routes
  {
    path: "/admin",
    element: <ProtectedAdminRoute />,
    children: [
      {
        path: "",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <AdminDashboard />,
          },
          {
            path: "products",
            element: <AdminProducts />,
          },
          {
            path: "products/new",
            element: <AdminProductForm />,
          },
          {
            path: "products/:id/edit",
            element: <AdminProductForm />,
          },
          // Placeholders for future routes
          {
            path: "categories",
            element: <div className="p-8 text-center text-primary-dark/50">Categories Module Coming Soon</div>,
          },
          {
            path: "inventory",
            element: <div className="p-8 text-center text-primary-dark/50">Inventory Module Coming Soon</div>,
          },
          {
            path: "orders",
            element: <div className="p-8 text-center text-primary-dark/50">Orders Module Coming Soon</div>,
          },
        ]
      }
    ]
  },
]);
