import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Home placeholder</div>,
  },
  {
    path: "/shop",
    element: <div>Shop placeholder</div>,
  },
  {
    path: "/product/:id",
    element: <div>Product details placeholder</div>,
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
