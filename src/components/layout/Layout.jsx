import React, { useContext } from 'react'
import Navbar from '../navbar/Navbar'
import Footer from '../footer/Footer'
import myContext from '../../context/data/myContext'

export default function Layout({children}) {
  const { loading } = useContext(myContext);

  return (
    <div 
      className="min-h-screen flex flex-col relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1580274455191-7f9b8c826128?q=80&w=2070')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/75 z-0"></div>
      
      
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-t-4 border-green-600"></div>
            <p className="text-white font-semibold text-lg">Cargando...</p>
          </div>
        </div>
      )}
      
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-1">
          {children}
        </main>
        
        <Footer />
      </div>
    </div>
  )
}