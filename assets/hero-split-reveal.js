if (!customElements.get('hero-split-reveal')) {
  class HeroSplitReveal extends HTMLElement {
    connectedCallback() {
      // Respect the theme's reduced-motion setting: show the initial
      // composite of both halves as a static hero.
      if (window.VelouraSettings && window.VelouraSettings.motionReduced) {
        return;
      }

      if (!window.gsap || !window.ScrollTrigger) return;

      gsap.registerPlugin(ScrollTrigger);

      // Scroll-linked split: ScrollTrigger owns the scroll mapping; --split
      // still drives the clip-paths in CSS.
      this.trigger = ScrollTrigger.create({
        trigger: this,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          // Grows from 0 to half the viewport, pushing the halves apart.
          this.style.setProperty(
            '--split',
            (self.progress * innerWidth * 0.5).toFixed(1) + 'px'
          );
        },
      });
    }

    disconnectedCallback() {
      if (this.trigger) this.trigger.kill();
    }
  }

  customElements.define('hero-split-reveal', HeroSplitReveal);
}
