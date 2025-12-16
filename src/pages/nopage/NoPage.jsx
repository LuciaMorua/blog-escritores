import React from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";

export default function NoPage() {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-16">

        {/* Número 404 grande y animado */}
        <h1 className="text-7xl md:text-8xl font-extrabold text-amber-400 drop-shadow-lg animate-bounce">
          404
        </h1>

        {/* Texto gracioso */}
        <p className="text-xl md:text-2xl text-white max-w-xl mt-6 leading-relaxed">
          Parece que esta página se perdió entre los <span className="font-semibold text-amber-300">poemas sin título</span>,  
          los <span className="font-semibold text-green-300">borradores olvidados </span>  
          y los <span className="font-semibold text-amber-300">cuentos incompletos</span>.
        </p>

        <p className="text-lg text-green-200 mt-4 max-w-lg">
          No te preocupes… a veces las mejores historias nacen de los errores.  
          Pero esta página… definitivamente *no* es una de ellas.
        </p>

        {/* Botón volver */}
        <Link
          to="/"
          className="mt-8 px-8 py-3 bg-gradient-to-r from-green-600 to-amber-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all"
        >
          Volver a un capítulo que sí existe 📘
        </Link>

        {/* Frase divertida final */}
        <p className="mt-6 text-green-200 italic">
          (Prometemos que ningún escritor fue lastimado en la creación de este error)
        </p>

      </div>
    </Layout>
  );
}
