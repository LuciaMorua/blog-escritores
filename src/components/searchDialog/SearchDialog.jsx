import { Fragment, useContext, useState, useEffect } from "react";
import myContext from '../../context/data/myContext';
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";

export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleOpen = () => setOpen(!open);
  
  const context = useContext(myContext);
  const { mode } = context;

  // Cerrar modal con tecla ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open]);

  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Buscando:", searchTerm);
   
  };

  return (
    <Fragment>
      {/* Botón de búsqueda */}
      <button 
        onClick={handleOpen}
        className="cursor-pointer hover:opacity-80 transition-opacity p-1"
        type="button"
        aria-label="Buscar"
      >
        <AiOutlineSearch size={20} color="white" />
      </button>

      {/* Overlay del modal */}
      {open && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
          onClick={handleOpen}
        >
          {/* Fondo oscuro */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          />

          {/* Contenedor del diálogo */}
          <div 
            className="relative w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: mode === 'dark' ? 'rgb(30,41,59)' : 'white',
              }}
              className="rounded-xl shadow-2xl overflow-hidden"
            >
              {/* Header con botón cerrar */}
              <div className="flex items-center justify-between p-4 border-b"
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
                  Buscar artículos
                </h3>
                <button
                  onClick={handleOpen}
                  type="button"
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <AiOutlineClose 
                    size={20} 
                    color={mode === 'dark' ? 'rgb(226,232,240)' : 'rgb(30,41,59)'}
                  />
                </button>
              </div>

              {/* Formulario de búsqueda */}
              <form onSubmit={handleSearch} className="p-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por título, categoría o contenido..."
                    className="w-full px-4 py-3 pr-12 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    style={{
                      background: mode === 'dark' ? 'rgb(51,65,85)' : 'white',
                      color: mode === 'dark' ? 'rgb(226,232,240)' : 'rgb(30,41,59)',
                      borderColor: mode === 'dark' ? 'rgb(71,85,105)' : 'rgb(229,231,235)',
                    }}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <AiOutlineSearch 
                      size={20} 
                      color={mode === 'dark' ? 'rgb(226,232,240)' : 'rgb(30,41,59)'}
                    />
                  </button>
                </div>
              </form>

              {/* Resultados de búsqueda */}
              <div className="p-4 max-h-96 overflow-y-auto">
                {searchTerm === "" ? (
                  <div className="text-center py-8">
                    <p 
                      className="text-sm"
                      style={{
                        color: mode === 'dark' ? 'rgb(148,163,184)' : 'rgb(107,114,128)',
                      }}
                    >
                      Escribe algo para comenzar a buscar
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Ejemplo de resultados - Reemplaza esto con tus datos reales */}
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="p-4 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        style={{
                          background: mode === 'dark' ? 'rgb(51,65,85)' : 'rgb(249,250,251)',
                        }}
                      >
                        <h4 
                          className="font-semibold mb-1"
                          style={{
                            color: mode === 'dark' ? 'rgb(226,232,240)' : 'rgb(30,41,59)',
                          }}
                        >
                          Título del artículo {item}
                        </h4>
                        <p 
                          className="text-sm mb-2"
                          style={{
                            color: mode === 'dark' ? 'rgb(148,163,184)' : 'rgb(107,114,128)',
                          }}
                        >
                          Lorem ipsum dolor sit amet consectetur adipisicing elit...
                        </p>
                        <span 
                          className="text-xs px-2 py-1 rounded"
                          style={{
                            background: mode === 'dark' ? 'rgb(71,85,105)' : 'rgb(229,231,235)',
                            color: mode === 'dark' ? 'rgb(226,232,240)' : 'rgb(30,41,59)',
                          }}
                        >
                          Categoría
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer con sugerencias */}
              <div 
                className="p-4 border-t"
                style={{
                  background: mode === 'dark' ? 'rgb(15,23,42)' : 'rgb(249,250,251)',
                  borderColor: mode === 'dark' ? 'rgb(51,65,85)' : 'rgb(229,231,235)',
                }}
              >
                <p 
                  className="text-xs"
                  style={{
                    color: mode === 'dark' ? 'rgb(148,163,184)' : 'rgb(107,114,128)',
                  }}
                >
                  💡 Tip: Presiona <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">ESC</kbd> para cerrar
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}