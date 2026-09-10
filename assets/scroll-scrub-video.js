if (!customElements.get('scroll-scrub-video')) {
  class ScrollScrubVideo extends HTMLElement {
    connectedCallback() {
      this.video = this.querySelector('video');
      if (!this.video) return;

      // Respect the theme's reduced-motion setting: the video stays on its
      // first frame as a static visual.
      if (window.VelouraSettings && window.VelouraSettings.motionReduced) {
        return;
      }

      if (!window.gsap || !window.ScrollTrigger) return;

      gsap.registerPlugin(ScrollTrigger);

      this.trigger = ScrollTrigger.create({
        trigger: this,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: () => this.update(),
      });

      this.boundMetadata = () => this.update();
      this.video.addEventListener('loadedmetadata', this.boundMetadata);
      this.update();
    }

    disconnectedCallback() {
      if (this.trigger) this.trigger.kill();
      if (this.boundMetadata && this.video) {
        this.video.removeEventListener('loadedmetadata', this.boundMetadata);
      }
    }

    update() {
      if (!this.video || !this.trigger) return;

      if (!this.video.duration || !Number.isFinite(this.video.duration)) {
        return;
      }

      const target = (this.trigger.progress || 0) * Math.max(0, this.video.duration - 0.05);
      if (Math.abs(this.video.currentTime - target) > 0.03) {
        this.video.currentTime = target;
      }
    }
  }

  customElements.define('scroll-scrub-video', ScrollScrubVideo);
}
