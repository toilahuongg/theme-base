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
          (word) => `<span class="word-reveal__word">${word}&nbsp;</span>`
        )
        .join('');
      this.words = [...this.text.querySelectorAll('.word-reveal__word')];

      // Respect the theme's reduced-motion setting: words show immediately
      // (the media query overrides the hidden state).
      if (window.VelouraSettings && window.VelouraSettings.motionReduced) {
        return;
      }

      if (!window.gsap || !window.ScrollTrigger) {
        // Fallback: never leave the words hidden.
        this.words.forEach((word) => {
          word.style.opacity = '1';
          word.style.transform = 'none';
        });
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      // GSAP owns opacity/transform now — neutralize the CSS transition so
      // it never fights the tween.
      this.words.forEach((word) => (word.style.transition = 'none'));

      gsap.fromTo(
        this.words,
        { y: 18, opacity: 0.12 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          ease: 'power2.out',
          stagger: 0.045,
          scrollTrigger: { trigger: this, start: 'top 80%', once: true },
        }
      );
    }
  }

  customElements.define('word-reveal', WordReveal);
}
