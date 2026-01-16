import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Map, Scroll, Sparkles } from 'lucide-react';
import logo from '../../assets/logonuevoblog.jpeg';

function HeroSection() {
  return (
    <div className="w-full bg-gradient-to-b from-green-50 via-amber-50 to-green-100">
      {/* Hero Principal */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center py-20">
        <div className="max-w-5xl mx-auto">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img 
              src={logo}
              alt="Escritores Tucumanos"
              className="w-24 h-24 rounded-full shadow-2xl border-4 border-green-200 object-cover"
            />
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-green-900 mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
            Escritores Tucumanos
          </h1>

          <p className="text-xl md:text-2xl text-green-800 mb-12 leading-relaxed max-w-3xl mx-auto">
            Un espacio dedicado a la literatura y el pensamiento tucumano. Descubre las voces que dan vida a nuestra cultura.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link 
              to="/allBlogs"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Users size={22} className="group-hover:animate-pulse" />
              <span>Conocer Escritores</span>
            </Link>

            <Link 
              to="/nosotros"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-green-700 border-2 border-green-600 hover:border-green-700 rounded-xl text-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <BookOpen size={22} />
              <span>Sobre Nosotros</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Sección de características */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-xl hover:-translate-y-2 duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-amber-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
              <Map size={28} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-green-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Escritores Locales
            </h3>
            <p className="text-green-700 leading-relaxed">
              Conoce a los talentosos escritores de Tucumán y explora su trabajo literario único.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-xl hover:-translate-y-2 duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
              <Scroll size={28} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-green-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Artículos Literarios
            </h3>
            <p className="text-green-700 leading-relaxed">
              Lee artículos, ensayos y reflexiones sobre literatura, cultura y pensamiento tucumano.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-xl hover:-translate-y-2 duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-amber-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
              <Sparkles size={28} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-green-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Comunidad Activa
            </h3>
            <p className="text-green-700 leading-relaxed">
              Forma parte de una comunidad vibrante de escritores y lectores apasionados por las letras.
            </p>
          </div>
        </div>
      </div>

      {/* Call to action final */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="bg-gradient-to-r from-green-600 to-amber-600 rounded-2xl p-12 shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            ¿Eres escritor tucumano?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Únete a nuestra comunidad y comparte tu voz con el mundo. Publica tus artículos y conecta con otros escritores.
          </p>
          <Link 
            to="/contacto"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-green-700 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span>Contactanos</span>
            <span className="text-xl">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;