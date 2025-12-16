import { useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import myContext from '../../context/data/myContext';

function LoaderController() {
  const location = useLocation();
  const { setLoading } = useContext(myContext);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [location.pathname, setLoading]); 

  return null;
}

export default LoaderController;