if (!customElements.get('image-mask-reveal')) {
  class ImageMaskReveal extends HTMLElement {
    connectedCallback() {
      // Respect the theme's reduced-motion setting: show the fully open
      // image (the end state of the reveal).
      if (window.VelouraSettings && window.VelouraSettings.motionReduced) {
        this.style.setProperty('--mp', '1');
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
      // Slightly overshoots the reveal so the mask finishes opening before
      // the section leaves the viewport.
      const p = Math.min(Math.max(progress * 1.35, 0), 1);
      this.style.setProperty('--mp', p.toFixed(4));
    }
  }

  customElements.define('image-mask-reveal', ImageMaskReveal);
}
