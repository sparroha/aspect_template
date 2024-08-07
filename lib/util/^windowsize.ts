import { useLayoutEffect, useState } from "react";

export default function useWindowSize() {
    const [size, setSize] = useState(['xs', 'xs']);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([
            window.innerWidth < 768 ? 'xs' : window.innerWidth < 992 ? 'sm' : window.innerWidth < 1200 ? 'md' : 'lg',
            window.innerHeight < 576 ? 'xs' : window.innerHeight < 768 ? 'sm' : window.innerHeight < 992 ? 'md' : window.innerHeight < 1200 ? 'lg' : 'xl'
        ]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}