if (!customElements.get('text-line-reveal')) {
  class TextLineReveal extends HTMLElement {
    connectedCallback() {
      // Respect the theme's reduced-motion setting: lines show immediately
      // (transitions are disabled in CSS).
      if (window.VelouraSettings && window.VelouraSettings.motionReduced) {
        this.classList.add('is-visible');
        return;
      }

      if (!('IntersectionObserver' in window)) {
        this.classList.add('is-visible');
        return;
      }

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            this.classList.add('is-visible');
            this.observer.unobserve(this);
          });
        },
        { threshold: 0.25 }
      );
      this.observer.observe(this);
    }

    disconnectedCallback() {
      if (this.observer) this.observer.disconnect();
    }
  }

  customElements.define('text-line-reveal', TextLineReveal);
}
