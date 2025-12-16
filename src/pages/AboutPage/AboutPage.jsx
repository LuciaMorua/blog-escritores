import React from "react";
import Layout from "../../components/layout/Layout";

function AboutPage() {
  return (
    <Layout>  
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-green-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">

          <h1 className="text-4xl md:text-5xl font-bold text-green-900 text-center mb-10">
            Sobre Nosotros
          </h1>

          <div className="bg-white shadow-xl rounded-2xl p-8 border border-green-200">
            <p className="text-lg text-green-900 leading-relaxed mb-6">
              <strong>Escritores Tucumanos</strong> nació como un sueño sencillo y profundo,
              compartido entre una madre escritora y su hija. Una idea que surgió de la
              necesidad de darle voz a aquellos textos que, aunque llenos de vida,
              emociones y talento, muchas veces no encuentran lugar en un libro impreso.
            </p>

            <p className="text-lg text-green-900 leading-relaxed mb-6">
              Somos una familia tucumana que ama la palabra escrita y que cree en el poder
              de compartir historias. Queríamos crear un espacio donde escritores amateurs,
              amantes de la literatura o cualquier persona que disfrute escribir pudiera
              sentirse bienvenida.
            </p>

            <p className="text-lg text-green-900 leading-relaxed mb-6">
              Este blog nació con la intención de abrir puertas: puertas a la creatividad,
              a la expresión y a una comunidad literaria que crece día a día. Celebramos
              cada texto, cada intento y cada idea, porque creemos que la escritura no es
              solo para quienes publican libros, sino para todos los que sienten que una
              frase puede cambiar un día, una vida o incluso un mundo.
            </p>

            <p className="text-lg text-green-900 leading-relaxed">
              Bienvenidos a <strong>Escritores Tucumanos</strong>, un rincón donde escribir
              también es un acto de familia.
            </p>
          </div>
        </div>
      </div>
    </Layout>  
  );
}

export default AboutPage;
