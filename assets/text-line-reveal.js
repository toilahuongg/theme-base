if (!customElements.get('text-line-reveal')) {
  class TextLineReveal extends HTMLElement {
    connectedCallback() {
      const spans = [...this.querySelectorAll('.text-line-reveal__mask span')];
      if (!spans.length) return;

      const settings = window.VelouraSettings || {};

      // Theme editor: render the final state so the section never shows as
      // empty boxes while configuring. Reduced motion: lines show
      // immediately (lines are visible by default).
      if (settings.designMode || settings.motionReduced) return;

      if (!window.gsap || !window.ScrollTrigger) return;

      gsap.registerPlugin(ScrollTrigger);

      // GSAP owns the whole transform — the from state (yPercent 115)
      // hides the lines, so no CSS transform may be involved. Neutralize
      // the CSS transition so it never fights the tween.
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
