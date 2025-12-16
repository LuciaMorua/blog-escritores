import React, { useContext } from 'react';
import myContext from '../../context/data/myContext';

export default function Loader() {
  const { loading } = useContext(myContext);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-t-4 border-green-600"></div>
        <p className="text-white font-semibold text-lg">Cargando...</p>
      </div>
    </div>
  );
}