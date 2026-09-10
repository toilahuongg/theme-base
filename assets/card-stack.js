if (!customElements.get('card-stack')) {
  class CardStack extends HTMLElement {
    connectedCallback() {
      this.cards = [...this.querySelectorAll('.card-stack__card')];

      if (this.cards.length < 2) return;

      // Respect the theme's reduced-motion setting: cards still stack via CSS sticky.
      if (window.VelouraSettings && window.VelouraSettings.motionReduced) {
        return;
      }

      if (!window.gsap || !window.ScrollTrigger) return;

      gsap.registerPlugin(ScrollTrigger);

      this.triggers = this.cards.map((card) => {
        const trigger = ScrollTrigger.create({
          trigger: card,
          start: 'top 60',
          end: 'top -100',
          onUpdate: () => this.updateCard(card),
        });
        this.updateCard(card);
        return trigger;
      });
    }

    disconnectedCallback() {
      if (this.triggers) this.triggers.forEach((trigger) => trigger.kill());
    }

    updateCard(card) {
      const rect = card.getBoundingClientRect();
      const progress = Math.min(Math.max((60 - rect.top) / 160, 0), 1);
      card.style.setProperty('--stack-progress', progress.toFixed(3));
    }
  }

  customElements.define('card-stack', CardStack);
}
