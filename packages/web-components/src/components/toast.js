export class SoToast extends HTMLElement {
  connectedCallback() {
    if (this._connected) return;
    this._connected = true;
  }

  disconnectedCallback() {
    this.clearTimer();
    this._connected = false;
  }

  show(message) {
    this.clearTimer();
    this._timerToken = Symbol('so-toast-timer');
    const timerToken = this._timerToken;

    this.textContent = String(message ?? '');
    this.setAttribute('open', '');

    const duration = Number(this.getAttribute('duration')) || 4000;
    this._timer = setTimeout(() => {
      if (this._timerToken === timerToken) {
        this.hide();
      }
    }, duration);
  }

  hide() {
    this.clearTimer();
    this.removeAttribute('open');
  }

  clearTimer() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }

    this._timerToken = null;
  }
}
