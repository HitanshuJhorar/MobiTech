import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import ProductDetails from "../pages/ProductDetails";

export const router = createBrowserRouter([
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
    element: <div>Cart placeholder</div>,
  },
  {
    path: "/admin",
    element: <div>Admin dashboard placeholder</div>,
  },
  {
    path: "/admin/login",
    element: <div>Admin login placeholder</div>,
  },
  {
    path: "/admin/products",
    element: <div>Admin products placeholder</div>,
  },
  {
    path: "/admin/inventory",
    element: <div>Admin inventory placeholder</div>,
  },
]);
