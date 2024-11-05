import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to the top whenever the location (route) changes
    window.scrollTo(0, 0);
  }, [location]);
};

export default useScrollToTop;
