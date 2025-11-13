import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css"; // CSS global

import App from "./pages/App";
import Home from "./pages/Home";
import Restaurant from "./pages/Restaurant";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Login from "./pages/Login";

import Admin from "./pages/admin/Admin";
import AdminRestaurants from "./pages/admin/AdminRestaurants";
import AdminItems from "./pages/admin/AdminItems";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

import { AuthProvider } from "./state/AuthContext";
import { CartProvider } from "./state/CartContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "restaurant/:id", element: <Restaurant /> },
      { path: "cart", element: <Cart /> },
      { path: "orders", element: <Orders /> },
      { path: "login", element: <Login /> },
      { path: "admin", element: <Admin /> },
      { path: "admin/restaurants", element: <AdminRestaurants /> },
      { path: "admin/items", element: <AdminItems /> },
      { path: "admin/orders", element: <AdminOrders /> },
      { path: "admin/analytics", element: <AdminAnalytics /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
