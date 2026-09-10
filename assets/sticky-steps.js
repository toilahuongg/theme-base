if (!customElements.get('sticky-steps')) {
  class StickySteps extends HTMLElement {
    connectedCallback() {
      this.steps = [...this.querySelectorAll('[data-step]')];
      this.mediaItems = [...this.querySelectorAll('[data-media]')];
      this.media = this.querySelector('.sticky-steps__media');
      this.threshold = 0.55;
      this.isMobile = window.matchMedia('(max-width: 989px)');

      if (!this.steps.length) return;

      if (this.isMobile.matches) {
        // Mobile: the sticky media occludes the top ~55vh, so a step is
        // "current" when its box most overlaps the readable band below the
        // media — not when it crosses a viewport ratio (which can leave the
        // readable step dimmed while a hidden step above keeps is-active).
        this.onScroll = () => {
          if (this._frame) return;
          this._frame = requestAnimationFrame(() => {
            this._frame = 0;
            this.updatePastSteps();
            this.activateBestStep();
          });
        };
        window.addEventListener('scroll', this.onScroll, { passive: true });
        window.addEventListener('resize', this.onScroll, { passive: true });
        this.onScroll();
      } else {
        this.ratios = new Map();

        this.observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const prev = this.ratios.get(entry.target) || 0;
              const now = entry.intersectionRatio;
              this.ratios.set(entry.target, now);

              // Activate only on a genuine entry across the threshold (ratio
              // rising past 0.55). A step that scrolls back below the threshold
              // must NOT re-take the active state from the step that replaced it.
              if (entry.isIntersecting && prev < this.threshold && now >= this.threshold) {
                this.activate(entry.target.dataset.step);
              }
            });
          },
          { threshold: this.threshold }
        );

        this.steps.forEach((step) => this.observer.observe(step));

        this.onScroll = () => {
          if (this._frame) return;
          this._frame = requestAnimationFrame(() => {
            this._frame = 0;
            this.updatePastSteps();
          });
        };
        window.addEventListener('scroll', this.onScroll, { passive: true });
        this.updatePastSteps();
      }
    }

    disconnectedCallback() {
      if (this.observer) this.observer.disconnect();
      if (this.onScroll) {
        window.removeEventListener('scroll', this.onScroll);
        window.removeEventListener('resize', this.onScroll);
      }
      if (this._frame) cancelAnimationFrame(this._frame);
    }

    // Steps scrolled fully above the sticky media are "past": faded out
    // completely (mobile) so they never ghost through the top edge.
    updatePastSteps() {
      if (!this.media || !this.steps.length) return;
      const mediaTop = this.media.getBoundingClientRect().top;
      this.steps.forEach((step) =>
        step.classList.toggle('is-past', step.getBoundingClientRect().bottom <= mediaTop)
      );
    }

    // Mobile: pick the step whose box overlaps the readable band (below the
    // sticky media, above the viewport bottom) the most. Deterministic in both
    // scroll directions and fling-immune — recomputed from final positions.
    activateBestStep() {
      if (!this.media || !this.steps.length) return;
      const bandTop = this.media.getBoundingClientRect().bottom;
      const bandBottom = window.innerHeight;
      let bestIndex = -1;
      let bestOverlap = 0;
      this.steps.forEach((step, i) => {
        const r = step.getBoundingClientRect();
        const overlap = Math.min(r.bottom, bandBottom) - Math.max(r.top, bandTop);
        if (overlap >= bestOverlap) {
          bestOverlap = overlap;
          bestIndex = i;
        }
      });
      if (bestIndex >= 0 && bestOverlap > 0) this.activate(String(bestIndex));
    }

    activate(index) {
      this.steps.forEach((step) =>
        step.classList.toggle('is-active', step.dataset.step === index)
      );
      this.mediaItems.forEach((item) =>
        item.classList.toggle('is-active', item.dataset.media === index)
      );
    }
  }

  customElements.define('sticky-steps', StickySteps);
}
