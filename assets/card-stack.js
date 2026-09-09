if (!customElements.get('card-stack')) {
  class CardStack extends HTMLElement {
    connectedCallback() {
      this.cards = [...this.querySelectorAll('.card-stack__card')];

      if (this.cards.length < 2) return;

      // Respect the theme's reduced-motion setting: cards still stack via CSS sticky.
      if (window.VelouraSettings && window.VelouraSettings.motionReduced) {
        return;
      }

      this.ticking = false;
      window.addEventListener('scroll', this.requestUpdate.bind(this), {
        passive: true,
      });
      window.addEventListener('resize', this.requestUpdate.bind(this));
      this.requestUpdate();
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
      this.cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const progress = Math.min(Math.max((60 - rect.top) / 160, 0), 1);
        card.style.setProperty('--stack-progress', progress.toFixed(3));
      });
    }
  }

  customElements.define('card-stack', CardStack);
}
