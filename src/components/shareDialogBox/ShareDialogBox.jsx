import { Fragment, useContext, useState } from "react";
import myContext from "../../context/data/myContext";
import { AiOutlineShareAlt, AiFillLinkedin, AiFillInstagram, AiFillFacebook, AiOutlineClose, AiFillTwitterCircle } from "react-icons/ai";
import { FaWhatsapp, FaTelegram } from "react-icons/fa";

export default function ShareDialogBox() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  const context = useContext(myContext);
  const { mode } = context;

  
  const shareUrl = window.location.href;
  const shareTitle = "Mira este artículo interesante";

  // Funciones para compartir en redes sociales
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`, '_blank');
  };

  const shareOnTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('¡Enlace copiado al portapapeles!');
  };

  return (
    <Fragment>
      <div className="ml-auto">
        <AiOutlineShareAlt 
          onClick={handleOpen} 
          style={{
            color: mode === "dark" ? "white" : "white"
          }} 
          size={20}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        />
      </div>

      {/* Modal Dialog */}
      {open && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleOpen}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />

          {/* Dialog Box */}
          <div 
            className="relative w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: mode === 'dark' ? 'rgb(30,41,59)' : 'white',
              }}
              className="rounded-xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div 
                className="flex items-center justify-between p-4 border-b"
                style={{
                  borderColor: mode === 'dark' ? 'rgb(51,65,85)' : 'rgb(229,231,235)',
                }}
              >
                <h3 
                  className="text-lg font-semibold"
                  style={{
                    color: mode === 'dark' ? 'rgb(226,232,240)' : 'rgb(30,41,59)',
                  }}
                >
                  Compartir artículo
                </h3>
                <button
                  onClick={handleOpen}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <AiOutlineClose 
                    size={20} 
                    color={mode === 'dark' ? 'rgb(226,232,240)' : 'rgb(30,41,59)'}
                  />
                </button>
              </div>

              {/* Social Media Grid */}
              <div className="p-6">
                <p 
                  className="text-sm mb-4"
                  style={{
                    color: mode === 'dark' ? 'rgb(148,163,184)' : 'rgb(107,114,128)',
                  }}
                >
                  Comparte este artículo en tus redes sociales
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  {/* Facebook */}
                  <button
                    onClick={shareOnFacebook}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                  >
                    <AiFillFacebook 
                      size={40} 
                      className="text-blue-600 group-hover:scale-110 transition-transform"
                    />
                    <span 
                      className="text-xs font-medium"
                      style={{
                        color: mode === 'dark' ? 'rgb(226,232,240)' : 'rgb(30,41,59)',
                      }}
                    >
                      Facebook
                    </span>
                  </button>

                  {/* Twitter */}
                  <button
                    onClick={shareOnTwitter}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors group"
                  >
                    <AiFillTwitterCircle 
                      size={40} 
                      className="text-sky-500 group-hover:scale-110 transition-transform"
                    />
                    <span 
                      className="text-xs font-medium"
                      style={{
                        color: mode === 'dark' ? 'rgb(226,232,240)' : 'rgb(30,41,59)',
                      }}
                    >
                      Twitter
                    </span>
                  </button>

                  {/* LinkedIn */}
                  <button
                    onClick={shareOnLinkedIn}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                  >
                    <AiFillLinkedin 
                      size={40} 
                      className="text-blue-700 group-hover:scale-110 transition-transform"
                    />
                    <span 
                      className="text-xs font-medium"
                      style={{
                        color: mode === 'dark' ? 'rgb(226,232,240)' : 'rgb(30,41,59)',
                      }}
                    >
                      LinkedIn
                    </span>
                  </button>

                  {/* WhatsApp */}
                  <button
                    onClick={shareOnWhatsApp}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors group"
                  >
                    <FaWhatsapp 
                      size={40} 
                      className="text-green-600 group-hover:scale-110 transition-transform"
                    />
                    <span 
                      className="text-xs font-medium"
                      style={{
                        color: mode === 'dark' ? 'rgb(226,232,240)' : 'rgb(30,41,59)',
                      }}
                    >
                      WhatsApp
                    </span>
                  </button>

                  {/* Telegram */}
                  <button
                    onClick={shareOnTelegram}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors group"
                  >
                    <FaTelegram 
                      size={40} 
                      className="text-sky-400 group-hover:scale-110 transition-transform"
                    />
                    <span 
                      className="text-xs font-medium"
                      style={{
                        color: mode === 'dark' ? 'rgb(226,232,240)' : 'rgb(30,41,59)',
                      }}
                    >
                      Telegram
                    </span>
                  </button>

                  {/* Instagram */}
                  <button
                    className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors group"
                    onClick={() => alert('Instagram no permite compartir enlaces directamente desde web')}
                  >
                    <AiFillInstagram 
                      size={40} 
                      className="text-pink-600 group-hover:scale-110 transition-transform"
                    />
                    <span 
                      className="text-xs font-medium"
                      style={{
                        color: mode === 'dark' ? 'rgb(226,232,240)' : 'rgb(30,41,59)',
                      }}
                    >
                      Instagram
                    </span>
                  </button>
                </div>

                {/* Copy Link */}
                <div 
                  className="p-3 rounded-lg border"
                  style={{
                    background: mode === 'dark' ? 'rgb(51,65,85)' : 'rgb(249,250,251)',
                    borderColor: mode === 'dark' ? 'rgb(71,85,105)' : 'rgb(229,231,235)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 bg-transparent border-none outline-none text-sm"
                      style={{
                        color: mode === 'dark' ? 'rgb(148,163,184)' : 'rgb(107,114,128)',
                      }}
                    />
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
                      style={{
                        background: mode === 'dark' ? 'rgb(226,232,240)' : 'rgb(30,41,59)',
                        color: mode === 'dark' ? 'rgb(30,41,59)' : 'rgb(226,232,240)',
                      }}
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}