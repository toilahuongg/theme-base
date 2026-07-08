export class SoCarousel extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;

    this.track = this.querySelector('[data-carousel-track]');
    this.prevButton = this.querySelector('[data-carousel-prev]');
    this.nextButton = this.querySelector('[data-carousel-next]');
    this.prev = () => this.scroll(-1);
    this.next = () => this.scroll(1);
    this.prevButton?.addEventListener('click', this.prev);
    this.nextButton?.addEventListener('click', this.next);
    this._connected = true;
  }

  disconnectedCallback() {
    this.prevButton?.removeEventListener('click', this.prev);
    this.nextButton?.removeEventListener('click', this.next);
    this._connected = false;
  }

  scroll(direction) {
    if (!this.track) return;

    const distance = this.track.clientWidth || 320;
    this.track.scrollBy({ left: distance * direction, behavior: 'smooth' });
  }
}
