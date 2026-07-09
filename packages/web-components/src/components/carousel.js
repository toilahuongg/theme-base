export class SoCarousel extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.track = this.querySelector('[data-carousel-track]');
    this.prevButton = this.querySelector('[data-carousel-prev]');
    this.nextButton = this.querySelector('[data-carousel-next]');
    this.dotsContainer = this.querySelector('[data-carousel-dots]');

    // Bind handlers so we can remove them later
    this.onPrevClick = () => this.goTo(this.currentIndex - 1);
    this.onNextClick = () => this.goTo(this.currentIndex + 1);
    this.onScroll = () => this.syncUI();
    this.onKeydown = (e) => this.handleKeydown(e);
    this.onPointerDown = (e) => this.handlePointerDown(e);
    this.onPointerMove = (e) => this.handlePointerMove(e);
    this.onPointerUp = () => this.handlePointerUp();

    // Attach listeners
    this.prevButton?.addEventListener('click', this.onPrevClick);
    this.nextButton?.addEventListener('click', this.onNextClick);
    if (this.track) {
      this.track.addEventListener('scroll', this.onScroll);
      this.track.addEventListener('keydown', this.onKeydown);
      this.track.addEventListener('pointerdown', this.onPointerDown);
    }

    this.generateDots();
    this.syncUI();
    this._connected = true;
  }

  disconnectedCallback() {
    if (!this._connected) return;
    this.prevButton?.removeEventListener('click', this.onPrevClick);
    this.nextButton?.removeEventListener('click', this.onNextClick);
    if (this.track) {
      this.track.removeEventListener('scroll', this.onScroll);
      this.track.removeEventListener('keydown', this.onKeydown);
      this.track.removeEventListener('pointerdown', this.onPointerDown);
      this.track.removeEventListener('pointermove', this.onPointerMove);
      this.track.removeEventListener('pointerup', this.onPointerUp);
    }
    this.dotsContainer?.removeEventListener('click', this.onDotClick);
    this._connected = false;
  }

  get currentIndex() {
    if (!this.track || !this.track.children.length) return 0;
    const itemWidth = this.track.children[0]?.clientWidth || 1;
    return Math.round(this.track.scrollLeft / itemWidth);
  }

  get pageCount() {
    return this.track?.children.length || 0;
  }

  goTo(index) {
    if (!this.track) return;
    const clamped = Math.max(0, Math.min(index, this.pageCount - 1));
    const target = this.track.children[clamped];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }
  }

  syncUI() {
    this.updateButtons();
    this.updateDots();
  }

  updateButtons() {
    if (!this.track) return;
    const atStart = this.track.scrollLeft <= 2;
    const atEnd = this.track.scrollLeft + this.track.clientWidth >= this.track.scrollWidth - 2;
    if (this.prevButton) {
      this.prevButton.disabled = atStart;
    }
    if (this.nextButton) {
      this.nextButton.disabled = atEnd;
    }
  }

  generateDots() {
    if (this.dotsContainer) {
      // User provided their own dots container, just wire up clicks
      this.onDotClick = (e) => {
        const dot = e.target.closest('[data-carousel-dot]');
        if (dot) this.goTo(Number(dot.dataset.carouselDot));
      };
      this.dotsContainer.addEventListener('click', this.onDotClick);
      return;
    }
    // Auto-generate dots
    if (!this.track || this.pageCount === 0) return;

    const dots = document.createElement('div');
    dots.className = 'so-carousel__dots';
    dots.setAttribute('role', 'tablist');
    dots.setAttribute('aria-label', 'Carousel navigation');

    for (let i = 0; i < this.pageCount; i++) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'so-carousel__dot';
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-label', `Go to slide ${i + 1}`);
      button.dataset.carouselDot = i;
      dots.appendChild(button);
    }

    this.track.after(dots);
    this.dotsContainer = dots;

    this.onDotClick = (e) => {
      const dot = e.target.closest('[data-carousel-dot]');
      if (dot) this.goTo(Number(dot.dataset.carouselDot));
    };
    this.dotsContainer.addEventListener('click', this.onDotClick);
  }

  updateDots() {
    if (!this.dotsContainer) return;
    const dots = this.dotsContainer.querySelectorAll('[data-carousel-dot]');
    dots.forEach((dot, i) => {
      const active = i === this.currentIndex;
      dot.setAttribute('aria-current', active ? 'true' : 'false');
      dot.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  handleKeydown(event) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.goTo(this.currentIndex - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.goTo(this.currentIndex + 1);
    }
  }

  handlePointerDown(event) {
    if (event.button !== 0) return; // Only left button
    this._dragStartX = event.clientX;
    this._dragStartScrollLeft = this.track.scrollLeft;
    this._isDragging = true;
    this.track.setPointerCapture(event.pointerId);
    this.track.addEventListener('pointermove', this.onPointerMove);
    this.track.addEventListener('pointerup', this.onPointerUp);
  }

  handlePointerMove(event) {
    if (!this._isDragging) return;
    const dx = event.clientX - this._dragStartX;
    this.track.scrollLeft = this._dragStartScrollLeft - dx;
  }

  handlePointerUp() {
    this._isDragging = false;
    this.track?.removeEventListener('pointermove', this.onPointerMove);
    this.track?.removeEventListener('pointerup', this.onPointerUp);
  }
}
