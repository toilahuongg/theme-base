if (!customElements.get('text-line-reveal')) {
  class TextLineReveal extends HTMLElement {
    connectedCallback() {
      const spans = [...this.querySelectorAll('.text-line-reveal__mask span')];
      if (!spans.length) return;

      // Respect the theme's reduced-motion setting: lines show immediately
      // (the media query already removes the hidden transform).
      if (window.VelouraSettings && window.VelouraSettings.motionReduced) {
        return;
      }

      if (!window.gsap || !window.ScrollTrigger) {
        // Fallback: never leave the lines hidden.
        spans.forEach((span) => (span.style.transform = 'none'));
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      // GSAP owns the transform now — neutralize the CSS transition so it
      // never fights the tween.
      spans.forEach((span) => (span.style.transition = 'none'));

      gsap.fromTo(
        spans,
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: this, start: 'top 80%', once: true },
        }
      );
    }
  }

  customElements.define('text-line-reveal', TextLineReveal);
}
