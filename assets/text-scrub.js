if (!customElements.get('text-scrub')) {
  class TextScrub extends HTMLElement {
    connectedCallback() {
      this.words = [...this.querySelectorAll('.text-scrub__word')];
      if (this.words.length < 2) return;

      // Respect the theme's reduced-motion setting: words stack as a
      // static list (see CSS), all visible.
      if (window.VelouraSettings && window.VelouraSettings.motionReduced) {
        this.words.forEach((word) => {
          word.style.setProperty('--op', '1');
          word.style.setProperty('--sc', '1');
        });
        return;
      }

      this.ticking = false;
      this.boundRequestUpdate = this.requestUpdate.bind(this);
      window.addEventListener('scroll', this.boundRequestUpdate, {
        passive: true,
      });
      window.addEventListener('resize', this.boundRequestUpdate);
      this.requestUpdate();
    }

    disconnectedCallback() {
      window.removeEventListener('scroll', this.boundRequestUpdate);
      window.removeEventListener('resize', this.boundRequestUpdate);
    }

    requestUpdate() {
      if (this.ticking) return;
      this.ticking = true;
      requestAnimationFrame(() => {
        this.ticking = false;
        this.update();
      });
    }

    update() {
      const rect = this.getBoundingClientRect();
      const progress = Math.min(
        Math.max(-rect.top / (rect.height - innerHeight || 1), 0),
        1
      );

      const last = this.words.length - 1;
      this.words.forEach((word, i) => {
        const center = i / last;
        const distance = Math.abs(progress - center);
        const opacity = Math.min(Math.max(1 - distance * 3.2, 0), 1);
        const scale = 0.72 + opacity * 0.28;
        word.style.setProperty('--op', opacity.toFixed(3));
        word.style.setProperty('--sc', scale.toFixed(3));
      });
    }
  }

  customElements.define('text-scrub', TextScrub);
}
