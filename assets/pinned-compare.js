if (!customElements.get('pinned-compare')) {
  class PinnedCompare extends HTMLElement {
    connectedCallback() {
      this.steps = [...this.querySelectorAll('[data-compare-step]')];
      this.states = [...this.querySelectorAll('[data-compare-state]')];

      if (!this.steps.length) return;

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            this.activate(entry.target.dataset.compareStep);
          });
        },
        { threshold: 0.55 }
      );

      this.steps.forEach((step) => this.observer.observe(step));
    }

    activate(index) {
      this.steps.forEach((step) =>
        step.classList.toggle('is-active', step.dataset.compareStep === index)
      );
      this.states.forEach((state) =>
        state.classList.toggle('is-active', state.dataset.compareState === index)
      );
    }
  }

  customElements.define('pinned-compare', PinnedCompare);
}
