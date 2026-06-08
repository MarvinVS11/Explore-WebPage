import { useEffect } from 'react';

export default function useScrollReveal() {
  useEffect(() => {
    const observed = new Set();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
            io.unobserve(entry.target);
            observed.delete(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const observe = (el) => {
      if (!observed.has(el)) { observed.add(el); io.observe(el); }
    };

    document.querySelectorAll('.section-reveal').forEach(observe);

    const mo = new MutationObserver(() => {
      document.querySelectorAll('.section-reveal:not(.section-visible)').forEach(observe);
    });

    mo.observe(document.body, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
}
