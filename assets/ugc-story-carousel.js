// Inline copy of snippets/icon-check.liquid for the benefits list that
// this element re-renders at runtime (Liquid snippets cannot run in JS).
const CHECK_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="m-icon-svg m-icon--small m-icon-check"><polyline points="20 6 9 17 4 12"></polyline></svg>';

if (!customElements.get('ugc-story-carousel')) {
  const gsap = window.gsap;

  class UgcStoryCarousel extends HTMLElement {
    connectedCallback() {
      this.rail = this.querySelector('.ugc-rail');
      this.cards = [...this.querySelectorAll('.ugc-card')];

      if (!this.rail || this.cards.length < 2) return;

      this.copyTitle = this.querySelector('.ugc-title');
      this.benefits = this.querySelector('.ugc-benefits');
      this.pagination = this.querySelector('.ugc-pagination');
      this.mobileProgress = this.querySelector('.story-progress-mobile__bar');

      this.slideDuration = Number(this.dataset.slideDuration) || 6500;
      this.autoplay = this.dataset.autoplay !== 'false';
      this.paused = false;
      this.elapsed = 0;
      this.activeIndex = 0;
      this.activePos = 0;
      this.isDragging = false;

      // Respect the theme's reduced-motion setting: skip autoplay and
      // collapse every animation to an instant jump.
      const motionReduced =
        window.VelouraSettings && window.VelouraSettings.motionReduced;
      this.motionReduced = !!motionReduced;
      this.dur = motionReduced ? 0 : 0.58;

      // Ring model: the rail holds several copies of the card cycle. The
      // active card always settles at the window's left edge (slot 0);
      // stepping just animates to the next copy and the ring rotates
      // in-frame at each settle. The content is periodic, so rotation
      // (DOM move + compensating x) is invisible — and because the rail
      // transform is always canonical, there is no deferred "re-anchor"
      // teleport when a new gesture starts.
      this.buildRing();
      this.setActive(0, true, false);
      this.syncPauseButtons();
      this.bindControls();
      this.bindSwipe();

      if (this.autoplay && !motionReduced) {
        // GSAP's ticker drives the story clock so autoplay and the
        // rail tweens share a single frame loop.
        this.tickBound = (time, delta) => this.tick(delta);
        gsap.ticker.add(this.tickBound);
      }
    }

    disconnectedCallback() {
      if (this.tickBound) gsap.ticker.remove(this.tickBound);
    }

    formatNumber(index) {
      return String(index + 1).padStart(2, '0') + '.';
    }

    activeProgressBar() {
      return this.pagination
        ? this.pagination.querySelector('.story-progress__bar')
        : null;
    }

    renderPagination() {
      if (!this.pagination) return;

      this.pagination.innerHTML = '';

      this.cards.forEach((card, index) => {
        const button = document.createElement('button');
        button.className = 'page-btn' + (index === this.activeIndex ? ' active' : '');
        button.textContent = this.formatNumber(index);
        button.type = 'button';
        button.setAttribute('aria-label', `Story ${index + 1}`);

        button.addEventListener('click', () => {
          this.setActive(index);
        });

        this.pagination.appendChild(button);

        // The progress line sits immediately after the active number.
        if (index === this.activeIndex) {
          const track = document.createElement('span');
          track.className = 'story-progress';

          const bar = document.createElement('span');
          bar.className = 'story-progress__bar';

          track.appendChild(bar);
          this.pagination.appendChild(track);
        }
      });
    }

    updateCopy(card, instant = false) {
      if (!card.dataset.title && !card.dataset.bullets) return;

      const targets = [this.copyTitle, this.benefits].filter(Boolean);
      if (!targets.length) return;

      const swap = () => {
        if (card.dataset.title && this.copyTitle) {
          this.copyTitle.textContent = card.dataset.title;
        }

        if (card.dataset.bullets && this.benefits) {
          this.benefits.innerHTML = card.dataset.bullets
            .split('|')
            .filter(Boolean)
            .map(
              (text) =>
                `<li><span class="check">${CHECK_ICON}</span>${text}</li>`
            )
            .join('');
        }
      };

      // Initial render and reduced motion skip the fade entirely.
      if (instant || this.motionReduced) {
        swap();
        return;
      }

      gsap.killTweensOf(targets);
      gsap
        .timeline()
        .to(targets, {
          autoAlpha: 0,
          y: 10,
          duration: this.dur,
          ease: 'power2.in',
        })
        .add(swap)
        .to(targets, {
          autoAlpha: 1,
          y: 0,
          duration: this.dur,
          ease: 'power2.out',
        });
    }

    // Rail geometry: one slot = card width + gap. Adjacent children share
    // the rail transform, so the difference is transform-independent.
    step() {
      const a = this.rail.children[0].getBoundingClientRect();
      const b = this.rail.children[1].getBoundingClientRect();
      return b.left - a.left;
    }

    // Single place that moves the rail. GSAP owns the transform (x
    // alias), so the CSS transition on .ugc-rail is removed and nothing
    // fights the tween.
    setRailX(x, animate, onComplete) {
      if (animate) {
        gsap.to(this.rail, {
          x,
          duration: this.dur,
          ease: 'power2.inOut',
          overwrite: 'auto',
          onComplete,
        });
      } else {
        gsap.set(this.rail, { x });
        if (onComplete) onComplete();
      }
    }

    // Position the active card at slot 0 (window's left edge). Animate
    // unless the caller wants an instant jump.
    goTo(pos, animate = true) {
      this.setRailX(-pos * this.step(), animate, () => this.rotateIfNeeded());
    }

    // Build the ring: several full copies of the card cycle, enough that
    // both drag directions always have content beyond the window.
    buildRing() {
      const n = this.cards.length;
      const step = this.step();
      const windowW = this.querySelector('.ugc-window').getBoundingClientRect()
        .width;
      const segments = Math.max(
        3,
        Math.ceil((windowW + step) / (n * step)) + 2
      );

      this.rail.innerHTML = '';
      for (let s = 0; s < segments; s++) {
        this.cards.forEach((card, i) => {
          const node = s === 0 ? card : card.cloneNode(true);
          if (s > 0) {
            node.dataset.clone = String(s);
            node.removeAttribute('data-index');
          }
          this.rail.appendChild(node);
        });
      }
      this.ring = [...this.rail.children];
      this.activePos = n; // start in the middle segment
    }

    // The active card's node is ring[activePos]; keep the .active styling
    // on exactly that visible node.
    applyActiveClasses() {
      this.ring.forEach((card) => card.classList.remove('active'));
      this.ring[this.activePos].classList.add('active');
    }

    // Keep the ring periodic around the active slot. Called at every
    // settle, so the rail transform is always canonical when a new
    // gesture starts — nothing to re-anchor, no jump.
    rotateIfNeeded() {
      const n = this.cards.length;
      const step = this.step();
      let x = gsap.getProperty(this.rail, 'x');
      let pos = this.activePos;

      // The ring recycles exactly the cards that just passed: one per
      // slot the active card moved (the while loops make this a batch
      // only when a single gesture crossed several cards at once).
      // Backward: move one card from the tail to the front (a −1 shift
      // of the periodic ring, so compensate x by −1 slot).
      while (pos < n) {
        this.rail.insertBefore(
          this.rail.lastElementChild,
          this.rail.firstElementChild
        );
        this.ring = [...this.rail.children];
        pos += 1;
        x -= step;
        gsap.set(this.rail, { x });
      }

      // Forward: move the passed card to the tail (+1 shift of the
      // periodic ring, compensate x by +1 slot — pixels stay identical).
      while (pos >= n + 1) {
        this.rail.appendChild(this.rail.children[0]);
        this.ring = [...this.rail.children];
        pos -= 1;
        x += step;
        gsap.set(this.rail, { x });
      }

      this.activePos = pos;
    }

    setActive(index, resetProgress = true, animate = true) {
      const n = this.cards.length;
      const target = ((index % n) + n) % n;

      // Shortest rotation around the ring (ties go forward).
      let delta = target - this.activeIndex;
      if (delta > n / 2) delta -= n;
      if (delta < -n / 2) delta += n;

      // Eager bookkeeping: consecutive setActive calls (rapid clicks,
      // autoplay ticks) chain off the latest position, even mid-tween.
      this.activeIndex = target;
      this.activePos =
        (((this.activePos + delta) % this.ring.length) + this.ring.length) %
        this.ring.length;

      if (resetProgress) this.elapsed = 0;

      // Styling flips immediately: the incoming card grows as it slides in.
      this.applyActiveClasses();
      this.renderPagination();
      this.updateCopy(this.cards[target], !animate);
      this.syncPauseButtons();
      this.syncMedia();
      this.updateMobileProgress();

      this.goTo(this.activePos, animate);
    }

    // One video plays at a time: pause every media element in the rail,
    // then play the active card's video (unless the story is paused or
    // reduced motion is set — the poster stays up in both cases).
    syncMedia() {
      if (!this.rail) return;

      this.rail.querySelectorAll('video').forEach((video) => video.pause());

      if (this.paused || this.motionReduced) return;

      const activeCard = this.ring[this.activePos];
      const video = activeCard ? activeCard.querySelector('video') : null;
      if (!video) return;

      const playPromise = video.play();
      if (playPromise && playPromise.catch) playPromise.catch(() => {});
    }

    syncPauseButtons() {
      const playing = !this.paused;

      this.cards.forEach((card, index) => {
        const pauseButton = card.querySelector('.pause-btn');
        if (pauseButton) {
          this.setPauseIcons(
            pauseButton,
            index === this.activeIndex && playing
          );
        }
      });

      // The visible card may be a ring copy; mirror the playing state on
      // its pause button too.
      const activeButton = this.ring[this.activePos].querySelector('.pause-btn');
      if (activeButton) this.setPauseIcons(activeButton, playing);
    }

    setPauseIcons(pauseButton, isPlaying) {
      const pauseState = pauseButton.querySelector('.icon-state-pause');
      const playState = pauseButton.querySelector('.icon-state-play');

      if (pauseState) pauseState.hidden = !isPlaying;
      if (playState) playState.hidden = isPlaying;
      pauseButton.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
    }

    bindControls() {
      // One delegated handler for card buttons — mute, pause, cart.
      // Ring copies are covered too; their positions change as the ring
      // rotates, so resolve the node against the live ring on every
      // click. Clicking a card background does nothing (navigation is
      // drag/swipe, autoplay, and pagination only).
      this.rail.addEventListener('click', (event) => {
        // Resolve against what the pointer pressed (within the last
        // 750ms), not the computed click target. Mid-slide the rail
        // drifts between pointerdown and pointerup, so the click can
        // land on the common ancestor of both targets — e.g. a card
        // whose content moved under the pointer. Without this, a press
        // on a mute/pause button could hit the wrong element.
        // Keyboard clicks have no press — fall back to the event.
        const recent =
          this._pressEl && performance.now() - this._pressAt < 750;
        const pressed = recent ? this._pressEl : event.target;
        const card = pressed.closest('.ugc-card');
        if (!card || !this.ring.includes(card)) return;

        const button = pressed.closest('button');

        // Mute is independent per card. With a video, mirror the toggle
        // onto the media element so the button actually controls sound.
        if (button && button.classList.contains('mute-btn')) {
          event.stopPropagation();
          const isMuted = button.dataset.muted !== 'false';
          button.dataset.muted = isMuted ? 'false' : 'true';
          const soundState = button.querySelector('.icon-state-sound');
          const mutedState = button.querySelector('.icon-state-muted');
          if (soundState) soundState.hidden = !isMuted;
          if (mutedState) mutedState.hidden = isMuted;
          button.setAttribute('aria-label', isMuted ? 'Mute' : 'Unmute');
          const cardVideo = card.querySelector('video');
          if (cardVideo) cardVideo.muted = !isMuted;
          return;
        }

        // Pause controls the autoplay/progress of the active story — and
        // the active video, when the card has one.
        if (button && button.classList.contains('pause-btn')) {
          event.stopPropagation();
          if (this.ring.indexOf(card) !== this.activePos) return;
          this.paused = !this.paused;
          this.syncPauseButtons();
          this.syncMedia();
          return;
        }
        // Cart is a theme <product-form> submit button now — it owns its
        // own click-to-add (spinner, cart drawer events); nothing to do.
      });
    }

    bindSwipe() {
      const surface = this.querySelector('.ugc-window');
      if (!surface || !globalThis.PointerEvent) return;

      let pointerId = null;
      let startX = 0;
      let startY = 0;
      let baseX = 0;
      let dragging = false;
      const threshold = 60;

      const onPointerDown = (event) => {
        if (pointerId !== null) return;

        // Remember what the pointer pressed. The browser fires the click
        // on the common ancestor of the down/up targets, which mid-slide
        // can be a card whose content drifted — the click handler needs
        // this to resolve against the pressed element, not the drift.
        this._pressEl = event.target;
        this._pressAt = performance.now();

        if (event.pointerType === 'mouse' && event.button !== 0) return;
        if (event.target.closest('button, a')) return;

        // Grabbing mid-slide: stop the tween so the finger owns the rail.
        gsap.killTweensOf(this.rail);

        pointerId = event.pointerId;
        startX = event.clientX;
        startY = event.clientY;
        // The rail is always in its canonical position at rest (rotation
        // is in-frame at every settle), so the drag continues straight
        // from the current transform — no re-anchor, no jump.
        baseX = gsap.getProperty(this.rail, 'x');
        dragging = false;
      };

      const onPointerMove = (event) => {
        if (event.pointerId !== pointerId) return;

        const dx = event.clientX - startX;
        const dy = event.clientY - startY;

        if (!dragging) {
          if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;

          // A vertical gesture means page scroll — abandon the swipe.
          if (Math.abs(dy) > Math.abs(dx)) {
            pointerId = null;
            return;
          }

          dragging = true;
          this.isDragging = true;
          surface.classList.add('is-dragging');
        }

        gsap.set(this.rail, { x: baseX + dx });
      };

      const onPointerEnd = (event) => {
        if (event.pointerId !== pointerId) return;

        const dx = event.clientX - startX;
        const wasDragging = dragging;

        pointerId = null;
        dragging = false;
        this.isDragging = false;
        surface.classList.remove('is-dragging');

        if (!wasDragging) return;

        if (Math.abs(dx) >= threshold) {
          // Advance one slot per full card dragged (min one).
          const steps = Math.max(
            1,
            Math.round(Math.abs(dx) / this.step())
          );
          const direction = dx < 0 ? 1 : -1;
          const next = this.activeIndex + direction * steps;

          if (
            window.matchMedia('(max-width: 900px)').matches &&
            (next < 0 || next >= this.cards.length)
          ) {
            // Mobile keeps the old hard-stop feel: the ends are the ends —
            // travel as far as they allow, then snap back to the edge card.
            const clamped = Math.min(
              this.cards.length - 1,
              Math.max(0, next)
            );
            if (clamped === this.activeIndex) {
              this.goTo(this.activePos);
            } else {
              this.setActive(clamped);
            }
          } else {
            this.setActive(next);
          }
        } else {
          this.goTo(this.activePos);
        }
      };

      const onPointerCancel = () => {
        if (pointerId === null) return;
        pointerId = null;
        dragging = false;
        this.isDragging = false;
        surface.classList.remove('is-dragging');
        this.goTo(this.activePos);
      };

      surface.addEventListener('pointerdown', onPointerDown);
      surface.addEventListener('pointermove', onPointerMove);
      surface.addEventListener('pointerup', onPointerEnd);
      surface.addEventListener('pointercancel', onPointerCancel);
    }

    // Driven by gsap.ticker (delta in ms), so the story clock shares the
    // GSAP frame loop instead of a second requestAnimationFrame.
    tick(delta) {
      if (!this.paused && !document.hidden) {
        this.elapsed += delta;

        if (this.elapsed >= this.slideDuration) {
          this.elapsed = 0;
          this.setActive(this.activeIndex + 1, false);
        }
      }

      const bar = this.activeProgressBar();

      if (bar) {
        const progress = Math.min(1, this.elapsed / this.slideDuration);
        bar.style.width = `${progress * 100}%`;
      }

      this.updateMobileProgress();
    }

    updateMobileProgress() {
      if (!this.mobileProgress) return;

      // Overall position across all cards: finished cards plus the
      // fraction of the current one, as a single track fill.
      const progress =
        (this.activeIndex + this.elapsed / this.slideDuration) /
        this.cards.length;

      this.mobileProgress.style.width = `${Math.min(progress, 1) * 100}%`;
    }
  }

  customElements.define('ugc-story-carousel', UgcStoryCarousel);
}
