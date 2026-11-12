const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const header = document.querySelector('.mast');
const updateHeader = () => header.classList.toggle('scrolled', scrollY > 24);
addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// Content stays visible by default. Animation is applied only as an element enters.
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const animations = new Set();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (reducedMotion.matches) continue;
      const animation = entry.target.animate(
        [{ opacity: 0.6, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 550, easing: 'ease-out' }
      );
      animations.add(animation);
      animation.finished.finally(() => animations.delete(animation)).catch(() => {});
    }
  }, { threshold: 0.06 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  reducedMotion.addEventListener('change', () => {
    if (!reducedMotion.matches) return;
    observer.disconnect();
    for (const animation of animations) animation.cancel();
    animations.clear();
  });
}