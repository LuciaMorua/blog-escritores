import { Facebook, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logonuevoblog.jpeg";

export default function Footer() {
  return (
    <footer className="border-t border-green-200/40 bg-gradient-to-r from-amber-50 via-white to-green-50 shadow-inner">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">

          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Escritores Tucumanos"
              className="h-12 w-12 rounded-full shadow-md border border-green-200"
            />
            <span className="text-xl font-semibold text-green-900 tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
              Escritores Tucumanos
            </span>
          </Link>

          <div className="flex gap-6">
            <a 
              href="#" 
              className="p-2 rounded-full hover:bg-green-100 transition-all duration-300 border border-transparent hover:border-green-200"
            >
              <Facebook className="text-green-700" size={22} />
            </a>
            <a 
              href="#" 
              className="p-2 rounded-full hover:bg-green-100 transition-all duration-300 border border-transparent hover:border-green-200"
            >
              <Instagram className="text-green-700" size={22} />
            </a>
            <a 
              href="#" 
              className="p-2 rounded-full hover:bg-green-100 transition-all duration-300 border border-transparent hover:border-green-200"
            >
              <Youtube className="text-green-700" size={22} />
            </a>
          </div>
        </div>

        <div className="border-t border-green-200/40 mt-10 pt-6 text-center">
          <p className="text-sm text-green-800">
            © {new Date().getFullYear()} Escritores Tucumanos. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}