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

      if (!window.gsap || !window.ScrollTrigger) return;

      gsap.registerPlugin(ScrollTrigger);

      // GSAP owns the track transform; the tween scrolls it horizontally
      // across the full section travel.
      this.tween = gsap.to(this.track, {
        x: () => -Math.max(0, this.track.scrollWidth - innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: this,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }

    disconnectedCallback() {
      if (this.tween) this.tween.kill();
    }
  }

  customElements.define('horizontal-cards', HorizontalCards);
}
