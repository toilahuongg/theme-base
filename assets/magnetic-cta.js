if (!customElements.get('magnetic-cta')) {
  class MagneticCta extends HTMLElement {
    connectedCallback() {
      this.button = this.querySelector('.magnetic-cta__button');

      if (!this.button) return;

      // Magnetic effect needs a precise pointer; skip touch devices and
      // reduced-motion users.
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      const reduced =
        window.VelouraSettings && window.VelouraSettings.motionReduced;
      if (coarse || reduced) return;

      this.handleMove = (event) => {
        const rect = this.button.getBoundingClientRect();
        const x = event.clientX - (rect.left + rect.width / 2);
        const y = event.clientY - (rect.top + rect.height / 2);
        this.button.style.transform = `translate(${x * 0.18}px, ${
          y * 0.18
        }px) scale(1.03)`;
      };

      this.handleLeave = () => {
        this.button.style.transform = 'translate(0, 0) scale(1)';
      };

      this.button.addEventListener('pointermove', this.handleMove);
      this.button.addEventListener('pointerleave', this.handleLeave);
    }

    disconnectedCallback() {
      if (this.button) {
        this.button.removeEventListener('pointermove', this.handleMove);
        this.button.removeEventListener('pointerleave', this.handleLeave);
      }
    }
  }

  customElements.define('magnetic-cta', MagneticCta);
}
