import React, { useState } from 'react';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';
import Layout from '../../components/layout/Layout';
import { Mail, User, Phone, MapPin, MessageSquare, Send } from 'lucide-react';

function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    phone: '',
    provincia: 'Tucumán',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.from_name || !formData.from_email || !formData.message) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.from_email)) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    setLoading(true);

    try {
      // Enviar email usando EmailJS
      await emailjs.send(
        'service_y2cozxk',        
        'template_hlmp9ih',                
        {
          from_name: formData.from_name,
          from_email: formData.from_email,
          phone: formData.phone,
          provincia: formData.provincia,
          message: formData.message
        },
        'oxhdHFl8-nH924hR1'       
      );

      toast.success(
        '¡Mensaje enviado exitosamente! 📧\n\nTe contactaremos pronto.',
        { duration: 5000 }
      );

      // Limpiar formulario
      setFormData({
        from_name: '',
        from_email: '',
        phone: '',
        provincia: 'Tucumán',
        message: ''
      });

    } catch (error) {
      console.error('Error al enviar email:', error);
      toast.error('Hubo un error al enviar el mensaje. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-amber-50 to-green-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
              ¿Querés ser parte?
            </h1>
            <p className="text-lg text-green-700 max-w-2xl mx-auto">
              Si sos escritor tucumano y querés publicar en nuestro blog, dejanos tus datos y te contactaremos pronto.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Formulario */}
            <div className="bg-white rounded-2xl shadow-xl border border-green-200 p-8">
              <h2 className="text-2xl font-bold text-green-900 mb-6 flex items-center gap-2">
                <MessageSquare size={28} />
                Formulario de Contacto
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-semibold text-green-900 mb-2">
                    Nombre completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" size={20} />
                    <input
                      type="text"
                      name="from_name"
                      value={formData.from_name}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="Tu nombre completo"
                      className="w-full pl-11 pr-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-green-50 text-green-900 placeholder-green-400"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-green-900 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" size={20} />
                    <input
                      type="email"
                      name="from_email"
                      value={formData.from_email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="tu@email.com"
                      className="w-full pl-11 pr-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-green-50 text-green-900 placeholder-green-400"
                    />
                  </div>
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-semibold text-green-900 mb-2">
                    Teléfono (opcional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" size={20} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Ej: +54 381 123-4567"
                      className="w-full pl-11 pr-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-green-50 text-green-900 placeholder-green-400"
                    />
                  </div>
                </div>

                {/* Provincia */}
                <div>
                  <label className="block text-sm font-semibold text-green-900 mb-2">
                    Provincia
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" size={20} />
                    <select
                      name="provincia"
                      value={formData.provincia}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full pl-11 pr-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-green-50 text-green-900 appearance-none cursor-pointer"
                    >
                      <option value="Tucumán">Tucumán</option>
                      <option value="Buenos Aires">Buenos Aires</option>
                      <option value="Catamarca">Catamarca</option>
                      <option value="Chaco">Chaco</option>
                      <option value="Chubut">Chubut</option>
                      <option value="Córdoba">Córdoba</option>
                      <option value="Corrientes">Corrientes</option>
                      <option value="Entre Ríos">Entre Ríos</option>
                      <option value="Formosa">Formosa</option>
                      <option value="Jujuy">Jujuy</option>
                      <option value="La Pampa">La Pampa</option>
                      <option value="La Rioja">La Rioja</option>
                      <option value="Mendoza">Mendoza</option>
                      <option value="Misiones">Misiones</option>
                      <option value="Neuquén">Neuquén</option>
                      <option value="Río Negro">Río Negro</option>
                      <option value="Salta">Salta</option>
                      <option value="San Juan">San Juan</option>
                      <option value="San Luis">San Luis</option>
                      <option value="Santa Cruz">Santa Cruz</option>
                      <option value="Santa Fe">Santa Fe</option>
                      <option value="Santiago del Estero">Santiago del Estero</option>
                      <option value="Tierra del Fuego">Tierra del Fuego</option>
                    </select>
                  </div>
                </div>

                {/* Mensaje */}
                <div>
                  <label className="block text-sm font-semibold text-green-900 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    rows="5"
                    placeholder="Contanos un poco sobre vos, tu experiencia como escritor y por qué querés ser parte del blog..."
                    className="w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-green-50 text-green-900 placeholder-green-400 resize-none"
                  />
                </div>

                {/* Botón Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg font-semibold transition-all bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 text-white shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Enviar Mensaje
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Información adicional */}
            <div className="space-y-6">
              
              {/* Card de información */}
              <div className="bg-white rounded-2xl shadow-xl border border-green-200 p-8">
                <h3 className="text-xl font-bold text-green-900 mb-4">
                  📚 ¿Por qué unirte?
                </h3>
                <ul className="space-y-3 text-green-800">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span>Difundí tu obra entre lectores tucumanos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span>Conectá con otros escritores locales</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span>Publicá tus textos y alcanzá más audiencia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span>Participá de una comunidad literaria activa</span>
                  </li>
                </ul>
              </div>

              {/* Card de requisitos */}
              <div className="bg-gradient-to-br from-green-100 to-amber-100 rounded-2xl border border-green-200 p-8">
                <h3 className="text-xl font-bold text-green-900 mb-4">
                  📝 Requisitos
                </h3>
                <ul className="space-y-2 text-green-800">
                  <li>• Ser escritor tucumano o residente en Tucumán</li>
                  <li>• Tener textos propios para publicar</li>
                  <li>• Compromiso con la calidad literaria</li>
                  <li>• Respetar las normas de la comunidad</li>
                </ul>
              </div>

              {/* Card de contacto directo */}
              <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-3">
                  💬 ¿Preferís contactarnos directamente?
                </h3>
                <p className="text-blue-800 text-sm">
                  También podés escribirnos a:
                  <br />
                  <a href="mailto:blogescritorestuc@gmail.com" className="font-semibold underline hover:text-blue-600">
                    blogescritorestuc@gmail.com
                  </a>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ContactPage;