if (!customElements.get('hero-split-reveal')) {
  class HeroSplitReveal extends HTMLElement {
    connectedCallback() {
      // Respect the theme's reduced-motion setting: show the initial
      // composite of both halves as a static hero.
      if (window.VelouraSettings && window.VelouraSettings.motionReduced) {
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
      // Grows from 0 to half the viewport, pushing the halves apart.
      this.style.setProperty(
        '--split',
        (progress * innerWidth * 0.5).toFixed(1) + 'px'
      );
    }
  }

  customElements.define('hero-split-reveal', HeroSplitReveal);
}
