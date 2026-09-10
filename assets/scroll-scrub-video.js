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

      this.ticking = false;
      this.boundRequestUpdate = this.requestUpdate.bind(this);
      this.boundMetadata = () => this.requestUpdate();
      window.addEventListener('scroll', this.boundRequestUpdate, {
        passive: true,
      });
      window.addEventListener('resize', this.boundRequestUpdate);
      this.video.addEventListener('loadedmetadata', this.boundMetadata);
      this.requestUpdate();
    }

    disconnectedCallback() {
      window.removeEventListener('scroll', this.boundRequestUpdate);
      window.removeEventListener('resize', this.boundRequestUpdate);
      if (this.video) {
        this.video.removeEventListener('loadedmetadata', this.boundMetadata);
      }
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

      if (!this.video.duration || !Number.isFinite(this.video.duration)) {
        return;
      }

      const target = progress * Math.max(0, this.video.duration - 0.05);
      if (Math.abs(this.video.currentTime - target) > 0.03) {
        this.video.currentTime = target;
      }
    }
  }

  customElements.define('scroll-scrub-video', ScrollScrubVideo);
}
