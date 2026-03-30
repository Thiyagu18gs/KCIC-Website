import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import BlogList from "./pages/BlogList";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import DeptHeadDashboard from "./pages/DeptHeadDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";
import InitializeData from "./pages/InitializeData";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "blogs", Component: BlogList },
      { path: "about", Component: About },
      { path: "login", Component: Login },
      { path: "initialize", Component: InitializeData },
      { path: "student/dashboard", Component: StudentDashboard },
      { path: "depthead/dashboard", Component: DeptHeadDashboard },
      { path: "admin/dashboard", Component: AdminDashboard },
    ],
  },
]);