export default function WhatsAppFloat() {
  const phone = "+5493812115087"
  const message = encodeURIComponent("Hola, quiero más información 👋")

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      {/* Tooltip */}
      <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
          ¿Hablamos?
        </div>
      </div>

      {/* Botón */}
      <a
        href={`https://wa.me/${phone}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] shadow-xl transition-transform hover:scale-110"
      >
        {/* Pulse */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>

       
        <svg
          className="relative w-7 h-7 fill-white"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M19.11 17.44c-.28-.14-1.64-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.09-.16.18-.32.2-.6.07-.28-.14-1.17-.43-2.23-1.38-.82-.73-1.38-1.64-1.54-1.92-.16-.28-.02-.43.12-.57.13-.13.28-.32.43-.48.14-.16.18-.28.28-.46.09-.18.05-.35-.02-.49-.07-.14-.61-1.48-.84-2.02-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.49.07-.75.35-.25.28-.98.96-.98 2.34s1 2.71 1.14 2.9c.14.18 1.97 3.01 4.78 4.22.67.29 1.19.46 1.6.59.67.21 1.28.18 1.76.11.54-.08 1.64-.67 1.87-1.31.23-.64.23-1.19.16-1.31-.07-.12-.25-.18-.53-.32z" />
          <path d="M16 2.67C8.64 2.67 2.67 8.64 2.67 16c0 2.59.75 5.01 2.05 7.05L2.67 29.33l6.46-2.02A13.27 13.27 0 0 0 16 29.33c7.36 0 13.33-5.97 13.33-13.33S23.36 2.67 16 2.67zm0 24c-2.3 0-4.43-.67-6.22-1.82l-.45-.28-3.83 1.2 1.25-3.73-.3-.48A10.6 10.6 0 1 1 16 26.67z" />
        </svg>
      </a>
    </div>
  )
}
