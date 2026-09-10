if (!customElements.get('ugc-grid')) {
  class UgcGrid extends HTMLElement {
    connectedCallback() {
      const modal = this.querySelector('.ugc-modal');

      if (!modal) return;

      this.modal = modal;
      this.modalImage = modal.querySelector('.ugc-modal__image');
      this.modalUser = modal.querySelector('.ugc-modal__user');
      this.modalCaption = modal.querySelector('.ugc-modal__caption');
      this.modalProduct = modal.querySelector('.ugc-modal__product');
      this.shopButton = modal.querySelector('.ugc-modal__shop');
      this.closeButton = modal.querySelector('.ugc-modal__close');

      this.cards = [...this.querySelectorAll('.ugc-card')];

      this.cards.forEach((card) => {
        card.addEventListener('click', () => this.openModal(card));
      });

      this.closeButton.addEventListener('click', () => this.closeModal());

      this.modal.addEventListener('click', (event) => {
        if (event.target === this.modal) this.closeModal();
      });

      window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') this.closeModal();
      });
    }

    openModal(card) {
      this.modalImage.src = card.dataset.image || '';
      this.modalImage.alt = card.dataset.caption || '';
      this.modalUser.textContent = card.dataset.user || '';
      this.modalCaption.textContent = card.dataset.caption || '';
      this.modalProduct.textContent = card.dataset.product || '';

      if (card.dataset.link) {
        this.shopButton.href = card.dataset.link;
        this.shopButton.hidden = false;
      } else {
        this.shopButton.href = '#';
        this.shopButton.hidden = true;
      }

      this.modal.classList.add('open');
      this.modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    closeModal() {
      this.modal.classList.remove('open');
      this.modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  customElements.define('ugc-grid', UgcGrid);
}
