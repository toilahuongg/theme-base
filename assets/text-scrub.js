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

      if (!window.gsap || !window.ScrollTrigger) return;

      gsap.registerPlugin(ScrollTrigger);

      // Scroll-linked word pass: ScrollTrigger owns the scroll mapping;
      // --op/--sc still drive opacity/scale in CSS.
      this.trigger = ScrollTrigger.create({
        trigger: this,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const last = this.words.length - 1;
          this.words.forEach((word, i) => {
            const center = i / last;
            const distance = Math.abs(self.progress - center);
            const opacity = Math.min(Math.max(1 - distance * 3.2, 0), 1);
            const scale = 0.72 + opacity * 0.28;
            word.style.setProperty('--op', opacity.toFixed(3));
            word.style.setProperty('--sc', scale.toFixed(3));
          });
        },
      });
    }

    disconnectedCallback() {
      if (this.trigger) this.trigger.kill();
    }
  }

  customElements.define('text-scrub', TextScrub);
}
