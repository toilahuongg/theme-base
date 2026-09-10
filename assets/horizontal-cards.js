if (!customElements.get('horizontal-cards')) {
  class HorizontalCards extends HTMLElement {
    connectedCallback() {
      // Respect the theme's reduced-motion setting: cards stay as a
      // static (first) column via CSS.
      if (window.VelouraSettings && window.VelouraSettings.motionReduced) {
        return;
      }

      this.track = this.querySelector('.horizontal-cards__track');
      if (!this.track) return;

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
      const maxX = Math.max(0, this.track.scrollWidth - innerWidth);
      this.style.setProperty('--hp', (progress * maxX).toFixed(1));
    }
  }

  customElements.define('horizontal-cards', HorizontalCards);
}
