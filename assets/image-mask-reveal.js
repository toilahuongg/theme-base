if (!customElements.get('image-mask-reveal')) {
  class ImageMaskReveal extends HTMLElement {
    connectedCallback() {
      // Respect the theme's reduced-motion setting: show the fully open
      // image (the end state of the reveal).
      if (window.VelouraSettings && window.VelouraSettings.motionReduced) {
        this.style.setProperty('--mp', '1');
        return;
      }

      if (!window.gsap || !window.ScrollTrigger) return;

      gsap.registerPlugin(ScrollTrigger);

      // Scroll-linked reveal: ScrollTrigger owns the scroll mapping and
      // ticker; --mp still drives the clip-path in CSS.
      this.trigger = ScrollTrigger.create({
        trigger: this,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          // Slightly overshoots the reveal so the mask finishes opening
          // before the section leaves the viewport.
          const p = Math.min(Math.max(self.progress * 1.35, 0), 1);
          this.style.setProperty('--mp', p.toFixed(4));
        },
      });
    }

    disconnectedCallback() {
      if (this.trigger) this.trigger.kill();
    }
  }

  customElements.define('image-mask-reveal', ImageMaskReveal);
}
