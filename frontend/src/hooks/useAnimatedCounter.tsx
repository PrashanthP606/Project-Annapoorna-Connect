// src/hooks/useAnimatedCounter.ts
import { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

export const useAnimatedCounter = (end: number, duration: number = 2000, startOnView: boolean = true) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  
  // triggers 'isInView' as true once the element enters the viewport
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    // 1. Guard Clause: If data hasn't loaded (end is 0), do nothing.
    if (end === 0) return;

    // 2. Guard Clause: If we enforce view-check and it's not in view yet, do nothing.
    if (startOnView && !isInView) return;

    // 3. Animation Logic
    const startTime = Date.now();
    const endTime = startTime + duration;

    const timer = setInterval(() => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function for smooth animation (Ease Out Quart)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);
      
      setCount(currentCount);

      if (now >= endTime) {
        setCount(end);
        clearInterval(timer);
      }
    }, 16); // Run at approx 60fps

    return () => clearInterval(timer);
    
    // Rerun this effect whenever 'end' changes (e.g. from 0 to 500)
    // or when 'isInView' changes (user scrolls down)
  }, [end, duration, isInView, startOnView]);

  return { count, ref };
};