if (!customElements.get('stats-counter')) {
  class StatsCounter extends HTMLElement {
    connectedCallback() {
      this.values = this.querySelectorAll('.stats-counter__value');

      if (!this.values.length) return;

      // Respect the theme's reduced-motion setting: leave server-rendered values as-is.
      if (window.VelouraSettings && window.VelouraSettings.motionReduced) {
        return;
      }

      this.initObserver();
    }

    initObserver() {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting || entry.target.dataset.done) return;
            entry.target.dataset.done = '1';
            this.countUp(entry.target);
            this.observer.unobserve(entry.target);
          });
        },
        { threshold: 0.5 }
      );

      this.values.forEach((value) => this.observer.observe(value));
    }

    countUp(element) {
      const raw = (element.dataset.value || '').trim();
      const grouped = raw.includes(',');
      const target = parseFloat(raw.replace(/,/g, ''));
      if (Number.isNaN(target)) return;

      const decimals = (raw.split('.')[1] || '').length;
      const duration = 1300;
      const start = performance.now();

      const format = (value) => {
        const fixed = decimals
          ? value.toFixed(decimals)
          : String(Math.round(value));
        return grouped
          ? Number(fixed).toLocaleString('en-US', {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })
          : fixed;
      };

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = format(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    }
  }

  customElements.define('stats-counter', StatsCounter);
}
