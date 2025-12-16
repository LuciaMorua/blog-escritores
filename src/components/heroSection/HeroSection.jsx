import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, ArrowRight } from 'lucide-react';

function HeroSection() {
  return (
    <div className="w-full bg-gradient-to-b from-green-50 via-amber-50 to-green-100"> {/* Degradé suave y pastel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Publicidad Izquierda */}
        <div className="hidden lg:block lg:col-span-2">
          <div className="sticky top-16 p-4 space-y-4">
            <div className="bg-gradient-to-br from-green-100 to-amber-100 rounded-xl shadow-md h-[600px] flex items-center justify-center border border-green-200/30">
              <div className="text-center p-6">
                <p className="text-green-800 font-bold text-lg mb-2">Publicidad</p>
                <p className="text-green-600 text-sm opacity-70">160x600</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido Central */}
        <div className="lg:col-span-8">
          <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center py-20">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-green-900 mb-6 font-serif leading-tight">
                Escritores tucumanos
              </h1>

              <p className="text-xl md:text-2xl text-green-800 mb-12 leading-relaxed max-w-3xl mx-auto">
                Un espacio dedicado a la literatura y el pensamiento tucumano.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <Link 
                  to="/allBlogs"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/80 hover:bg-gradient-to-r hover:from-green-600 hover:to-amber-600 text-green-700 hover:text-white border-2 border-green-600 hover:border-transparent rounded-lg text-lg font-semibold transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105"
                >
                  <Users size={20} className="group-hover:animate-pulse" />
                  <span>Conocer Escritores</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Publicidad Horizontal */}
          <div className="px-6 py-8 space-y-8">

            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-r from-green-100 via-amber-100 to-green-100 rounded-xl shadow-md h-32 flex items-center justify-center border border-green-200/30">
                <p className="text-green-800 font-bold text-xl">Publicidad 728x90</p>
              </div>
            </div>

          </div>
        </div>

        {/* Publicidad Derecha */}
        <div className="hidden lg:block lg:col-span-2">
          <div className="sticky top-16 p-4 space-y-4">
            <div className="bg-gradient-to-br from-amber-100 to-green-100 rounded-xl shadow-md h-[600px] flex items-center justify-center border border-green-200/30">
              <div className="text-center p-6">
                <p className="text-green-800 font-bold text-lg mb-2">Publicidad</p>
                <p className="text-green-600 text-sm opacity-70">160x600</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;