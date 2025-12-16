import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom"
import { Toaster } from "sonner"

import Home from "./pages/home/Home"
import Blog from "./pages/blog/Blog"
import AllBlogs from "./pages/allBlogs/AllBlogs"
import NoPage from "./pages/nopage/NoPage"
import BlogInfo from "./pages/blogInfo/BlogInfo"
import AdminLogin from "./pages/admin/adminLogin/AdminLogin"
import Dashboard from "./pages/admin/dashboard/Dashboard"
import MyState from "./context/data/myState"
import CreateBlog from "./pages/admin/createBlog/CreateBlog"
import EditProfile from "./pages/admin/editProfile/EditProfile"
import CreateWriter from "./pages/admin/CreateWriter"
import WriterProfile from "./pages/writer/WriterProfile"
import ContactPage from "./pages/contact/ContactPage"
import AboutPage from "./pages/AboutPage/AboutPage"
import Loader from "./components/loader/Loader"
import LoaderController from "./components/loader/LoaderController"
import WhatsAppFloat from "./components/WhatsAppFloat"

export const ProtectedRouteForAdmin = ({ children }) => {
  const admin = JSON.parse(localStorage.getItem("admin"))

  if (admin?.user?.email) {
    return children
  } else {
    return <Navigate to="/adminlogin" replace />
  }
}

function App() {
  return (
    <MyState>
      <Router>
        <Loader />
        <LoaderController />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/allBlogs" element={<AllBlogs />} />
          <Route path="/blogInfo/:id" element={<BlogInfo />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/writer/:id" element={<WriterProfile />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/nosotros" element={<AboutPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRouteForAdmin>
                <Dashboard />
              </ProtectedRouteForAdmin>
            }
          />

          <Route
            path="/createblog"
            element={
              <ProtectedRouteForAdmin>
                <CreateBlog />
              </ProtectedRouteForAdmin>
            }
          />

          <Route
            path="/editProfile"
            element={
              <ProtectedRouteForAdmin>
                <EditProfile />
              </ProtectedRouteForAdmin>
            }
          />

          <Route
            path="/create-writer"
            element={
              <ProtectedRouteForAdmin>
                <CreateWriter />
              </ProtectedRouteForAdmin>
            }
          />

          <Route path="/*" element={<NoPage />} />
        </Routes>

        <WhatsAppFloat />

        <Toaster position="top-right" richColors closeButton />
      </Router>
    </MyState>
  )
}

export default App
