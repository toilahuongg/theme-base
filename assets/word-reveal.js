if (!customElements.get('word-reveal')) {
  class WordReveal extends HTMLElement {
    connectedCallback() {
      this.text = this.querySelector('.word-reveal__text');
      if (!this.text) return;

      const sourceText = this.text.textContent.trim();
      if (!sourceText) return;

      this.text.innerHTML = sourceText
        .split(/\s+/)
        .map(
          (word, i) =>
            `<span class="word-reveal__word" style="transition-delay:${i * 45}ms">${word}&nbsp;</span>`
        )
        .join('');

      // Respect the theme's reduced-motion setting: words show immediately
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

  customElements.define('word-reveal', WordReveal);
}
