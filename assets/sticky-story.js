if (!customElements.get('sticky-story')) {
  class StickyStory extends HTMLElement {
    connectedCallback() {
      this.steps = [...this.querySelectorAll('[data-story-step]')];
      this.mediaItems = [...this.querySelectorAll('[data-story-media]')];

      if (!this.steps.length) return;

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            this.activate(entry.target.dataset.storyStep);
          });
        },
        { threshold: 0.55 }
      );

      this.steps.forEach((step) => this.observer.observe(step));
    }

    activate(index) {
      this.steps.forEach((step) =>
        step.classList.toggle('is-active', step.dataset.storyStep === index)
      );
      this.mediaItems.forEach((item) =>
        item.classList.toggle('is-active', item.dataset.storyMedia === index)
      );
    }
  }

  customElements.define('sticky-story', StickyStory);
}
