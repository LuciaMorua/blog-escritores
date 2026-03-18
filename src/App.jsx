
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom"
import { Toaster } from "sonner"

import Home from "./pages/home/Home"
import Blog from "./pages/blog/Blog"
import AllBlogs from "./pages/allBlogs/AllBlogs"
import NoPage from "./pages/nopage/NoPage"
import BlogInfo from "./pages/blogInfo/BlogInfo"
import Dashboard from "./pages/admin/dashboard/Dashboard"
import MyState from "./context/data/myState"
import CreateBlog from "./pages/admin/createBlog/CreateBlog"
import EditProfile from "./pages/admin/editProfile/EditProfile"
import SendWelcomeEmail from "./pages/admin/SendWelcomeEmail"
import CreateWriter from "./pages/admin/CreateWriter"
import Register from "./pages/auth/Register"
import Login from "./pages/auth/Login"
import AboutPage from "./pages/AboutPage/AboutPage"
import ContactPage from "./pages/contact/ContactPage"
import { Navigate } from "react-router-dom"

export const ProtectedRouteForAdmin = ({ children }) => {
  const admin = JSON.parse(localStorage.getItem("admin"));
  
  if (admin?.user?.email) {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <MyState>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/allBlogs" element={<AllBlogs />} />
          <Route path="/blogInfo/:id" element={<BlogInfo />} />
          
          {/* Rutas públicas */}
          <Route path="/nosotros" element={<AboutPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          
          {/* Rutas de autenticación */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Rutas protegidas */}
          <Route path="/dashboard" element={
            <ProtectedRouteForAdmin>
              <Dashboard />
            </ProtectedRouteForAdmin>
          }/>
          <Route path="/createblog" element={
            <ProtectedRouteForAdmin>
              <CreateBlog />
            </ProtectedRouteForAdmin>
          }/>
          <Route path="/editProfile" element={
            <ProtectedRouteForAdmin>
              <EditProfile />
            </ProtectedRouteForAdmin>
          }/>
          <Route path="/send-welcome-email" element={
            <ProtectedRouteForAdmin>
              <SendWelcomeEmail />
            </ProtectedRouteForAdmin>
          }/>
          <Route path="/create-writer" element={
            <ProtectedRouteForAdmin>
              <CreateWriter />
            </ProtectedRouteForAdmin>
          }/>
          
          <Route path="/*" element={<NoPage />} />
        </Routes>

        {/* Toaster global, siempre visible */}
        <Toaster position="top-right" richColors closeButton />
      </Router>
    </MyState>
  )
}

export default App