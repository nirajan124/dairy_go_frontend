import React, { lazy, Suspense } from "react";
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";

// Lazy Imports
const Home = lazy(() => import("./components/public/Home"));
const Login = lazy(() => import("./components/public/Login"));
const Register = lazy(() => import("./components/public/Register"));
const Layout = lazy(() => import("./components/private/Layout"));
const Checkout = lazy(() => import("./components/public/Checkout"));
const Faq = lazy(() => import("./components/public/Faq"));
const Terms = lazy(() => import("./components/public/Terms"));
const Privacy = lazy(() => import("./components/public/Privacy"));
const Aboutus = lazy(() => import("./components/public/Aboutus"));
const Contact = lazy(() => import("./components/public/Contact"));
const Review = lazy(() => import("./components/public/Review"));

const Favorite = lazy(() => import("./components/public/Favorite"));
const Myprofile = lazy(() => import("./components/public/Myprofile"));
const Mybooking = lazy(() => import("./components/public/Mybooking"));
const EditProfile = lazy(() => import("./components/public/Editprofile"));
const ProductDetail = lazy(() => import("./components/public/ProductDetail"));
const Products = lazy(() => import("./components/public/Products"));

const Dashboard = lazy(() => import("./components/private/dashboard/Dashboard"));
const AddProduct = lazy(() => import("./components/private/products/AddProduct"));
const ManageProducts = lazy(() => import("./components/private/products/ManageProducts"));
const PendingOrders = lazy(() => import("./components/private/orders/PendingOrders"));
const ConfirmedOrders = lazy(() => import("./components/private/orders/ConfirmedOrders"));
const Payments = lazy(() => import("./components/private/payments/Payments"));
const Customers = lazy(() => import("./components/private/users/Users"));
const CustomerReviews = lazy(() => import("./components/private/reviews/Reviews"));
const Profile = lazy(() => import("./components/private/profile/profile"));
const Settings = lazy(() => import("./components/private/setting/settings"));

function App() {
  // Retrieve role from localStorage
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin"; // Assuming 'admin' is the role for admin users

  const publicRoutes = [
    {
      path: "/",
      element: <Suspense><Home /></Suspense>,
      errorElement: <>Error</>,
    },
    {
      path: "/login",
      element: <Suspense><Login /></Suspense>,
      errorElement: <>Error</>,
    },
    {
      path: "/register",
      element: <Suspense><Register /></Suspense>,
      errorElement: <>Error</>,
    },
   
    {
      path: "/checkout/:id",
      element: <Suspense><Checkout /></Suspense>,
      errorElement: <>Error</>,
    },
    {
      path: "/faq",
      element: <Suspense><Faq /></Suspense>,
      errorElement: <>Error</>,
    },
    {
      path: "/terms",
      element: <Suspense><Terms /></Suspense>,
      errorElement: <>Error</>,
    },
    {
      path: "/privacy",
      element: <Suspense><Privacy /></Suspense>,
      errorElement: <>Error</>,
    },
    {
      path: "/aboutus",
      element: <Suspense><Aboutus /></Suspense>,
      errorElement: <>Error</>,
    },
    {
      path: "/contact",
      element: <Suspense><Contact /></Suspense>,
      errorElement: <>Error</>,
    },
    {
      path: "/review",
      element: <Suspense><Review /></Suspense>,
      errorElement: <>Error</>,
    },
   
    {
      path: "/favorite",
      element: <Suspense><Favorite /></Suspense>,
      errorElement: <>Error</>,
    },
    {
      path: "/myprofile",
      element: <Suspense><Myprofile /></Suspense>,
      errorElement: <>Error</>,
    },
    {
      path: "/mybooking",
      element: <Suspense><Mybooking /></Suspense>,
      errorElement: <>Error</>,
    },
    {
      path: "/editprofile",
      element: <Suspense><EditProfile /></Suspense>,
      errorElement: <>Error</>,
    },
    {
      path: "/products",
      element: <Suspense><Products /></Suspense>,
      errorElement: <>Error</>,
    },
    {
      path: "/products/:id",
      element: <Suspense><ProductDetail /></Suspense>,
      errorElement: <>Error</>,
    },
    { path: "*", element: <div>404: Page not found</div> },
  ];

  const privateRoutes = [
    {
      path: "/admin",
      element: <Suspense><Layout /></Suspense>,
      errorElement: <>Error</>,
      children: [
        { path: "dashboard", element: <Suspense><Dashboard /></Suspense>, errorElement: <>Error</> },
        { path: "addproducts", element: <Suspense><AddProduct /></Suspense>, errorElement: <>Error</> },
        { path: "manageproducts", element: <Suspense><ManageProducts /></Suspense>, errorElement: <>Error</> },
        { path: "pending", element: <Suspense><PendingOrders /></Suspense>, errorElement: <>Error</> },
        { path: "confirmed", element: <Suspense><ConfirmedOrders /></Suspense>, errorElement: <>Error</> },
        { path: "payments", element: <Suspense><Payments /></Suspense>, errorElement: <>Error</> },
        { path: "customers", element: <Suspense><Customers /></Suspense>, errorElement: <>Error</> },
        { path: "reviews", element: <Suspense><CustomerReviews /></Suspense>, errorElement: <>Error</> },
        { path: "profile", element: <Suspense><Profile /></Suspense>, errorElement: <>Error</> },
        { path: "settings", element: <Suspense><Settings /></Suspense>, errorElement: <>Error</> },
      ],
    },
    { path: "*", element: <>Page not found</>, errorElement: <>Error</> },
  ];

  const routes = isAdmin ? privateRoutes : publicRoutes;

  // Redirect to login if user is not authenticated
  const checkAuth = () => {
    if (!localStorage.getItem("token")) {
      return redirect("/login");
    }
  };

  return <RouterProvider router={createBrowserRouter(routes)} />;
}

export default App;
