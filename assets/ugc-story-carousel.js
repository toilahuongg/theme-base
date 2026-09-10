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
      this.isDragging = false;
      this.awaitingReset = false;
      this.reanchorTimer = 0;

      // Respect the theme's reduced-motion setting: skip autoplay and
      // collapse every animation to an instant jump.
      const motionReduced =
        window.VelouraSettings && window.VelouraSettings.motionReduced;
      this.motionReduced = !!motionReduced;
      this.dur = motionReduced ? 0 : 0.58;

      this.renderPagination();
      this.updateCopy(this.cards[this.activeIndex], true);
      // Clones must exist before the rail is positioned: prepending a
      // clone shifts the rail's layout origin, so position after cloning.
      this.createClones();
      this.translateRailToActive(undefined, false);
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
      clearTimeout(this.reanchorTimer);
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

    // Single place that moves the rail. GSAP owns the transform (x
    // alias), so the CSS transition on .ugc-rail is removed and nothing
    // fights the tween.
    moveRail(x, animate) {
      if (animate) {
        gsap.to(this.rail, {
          x: -x,
          duration: this.dur,
          ease: 'power2.inOut',
          overwrite: 'auto',
        });
      } else {
        gsap.set(this.rail, { x: -x });
      }
    }

    translateRailToActive(target, animate = true) {
      const active = this.cards[this.activeIndex];

      // Viewport-relative difference: the rail's own page offset cancels
      // out, so this stays correct inside any theme layout.
      const x =
        target !== undefined
          ? target
          : active.getBoundingClientRect().left -
            this.rail.getBoundingClientRect().left;

      this.moveRail(x, animate);
    }

    // Infinite scroll: a twin of the last card is prepended and a full
    // duplicate set is appended. Scrolling past an edge lands on the
    // identical twin — with real-looking cards following it, so no blank
    // strip ever appears — then the rail is silently re-anchored to the
    // real card. No jump, no pop.
    createClones() {
      if (this.cards.length < 2) return;
      if (this.rail.querySelector('[data-clone]')) return;

      const last = this.cards[this.cards.length - 1].cloneNode(true);
      last.dataset.clone = 'last';
      last.removeAttribute('data-index');

      const fragment = document.createDocumentFragment();
      this.cards.forEach((card, i) => {
        const twin = card.cloneNode(true);
        twin.dataset.clone = i === 0 ? 'first' : 'dup';
        twin.removeAttribute('data-index');
        fragment.appendChild(twin);
      });

      this.rail.appendChild(fragment);
      this.rail.prepend(last);

      // Tapping the visible twin promotes the real card it mirrors.
      const promote = (index) => (event) => {
        if (event.target.closest('button, a')) return;
        this.setActive(index);
      };
      this.rail
        .querySelector('[data-clone="first"]')
        .addEventListener('click', promote(0));
      last.addEventListener('click', promote(this.cards.length - 1));
    }

    // Scroll onto the twin of the first card (state becomes card 0),
    // then re-anchor the rail so scrolling continues seamlessly.
    goPastEnd() {
      const clone = this.rail.querySelector('[data-clone="first"]');
      if (!clone) {
        this.setActive(0);
        return;
      }
      // The landing card must look exactly like the active card it
      // mirrors (height, panels, controls) or the re-anchor pops.
      clone.classList.add('active');
      const cloneX =
        clone.getBoundingClientRect().left -
        this.rail.getBoundingClientRect().left;
      this.setActive(0, true, cloneX);
      this.scheduleReanchor();
    }

    goPastStart() {
      const clone = this.rail.querySelector('[data-clone="last"]');
      if (!clone) {
        this.setActive(this.cards.length - 1);
        return;
      }
      clone.classList.add('active');
      const cloneX =
        clone.getBoundingClientRect().left -
        this.rail.getBoundingClientRect().left;
      this.setActive(this.cards.length - 1, true, cloneX);
      this.scheduleReanchor();
    }

    // After the animated landing on the twin, reposition the rail onto
    // the real card it mirrors. Identical pixels, no transition, so the
    // reset is invisible. Deferred so a mid-animation interaction wins.
    scheduleReanchor() {
      this.awaitingReset = true;
      clearTimeout(this.reanchorTimer);
      this.reanchorTimer = setTimeout(() => {
        if (this.isDragging) return;
        this.silentReanchor();
      }, 700);
    }

    silentReanchor() {
      if (!this.awaitingReset) return;
      this.awaitingReset = false;

      // Twins keep active styling only while they are on screen.
      this.rail.querySelectorAll('[data-clone].active').forEach((clone) => {
        clone.classList.remove('active');
      });

      // Snap onto the real card instantly. Kill the landing tween first
      // so no stale animation writes over the jump.
      gsap.killTweensOf(this.rail);
      this.translateRailToActive(undefined, false);
    }

    syncPauseButtons() {
      this.cards.forEach((card, index) => {
        const pauseButton = card.querySelector('.pause-btn');
        if (!pauseButton) return;

        // Only the active card can be "playing" (autoplay in progress);
        // every other card shows the play affordance.
        this.setPauseIcons(
          pauseButton,
          index === this.activeIndex && !this.paused
        );
      });

      // The twin that is currently on screen mirrors the active card.
      this.rail
        .querySelectorAll('.ugc-card[data-clone].active .pause-btn')
        .forEach((pauseButton) => this.setPauseIcons(pauseButton, !this.paused));
    }

    setPauseIcons(pauseButton, isPlaying) {
      const pauseState = pauseButton.querySelector('.icon-state-pause');
      const playState = pauseButton.querySelector('.icon-state-play');

      if (pauseState) pauseState.hidden = !isPlaying;
      if (playState) playState.hidden = isPlaying;
      pauseButton.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
    }

    setActive(index, resetProgress = true, railTarget) {
      // If the rail still sits on a twin (mid-cycle), re-anchor it first
      // so every navigation target is computed from real positions.
      if (this.awaitingReset) this.silentReanchor();

      this.activeIndex = (index + this.cards.length) % this.cards.length;

      this.cards.forEach((card, i) => {
        card.classList.toggle('active', i === this.activeIndex);
      });

      if (resetProgress) {
        this.elapsed = 0;
      }

      this.renderPagination();
      this.updateCopy(this.cards[this.activeIndex]);
      this.syncPauseButtons();
      this.updateMobileProgress();

      // Card lefts are height-independent, so the rail target can be
      // measured and tweened synchronously — no frame wait needed.
      this.translateRailToActive(railTarget);
    }

    bindControls() {
      // Clicking a small card promotes it to active.
      this.cards.forEach((card, index) => {
        card.addEventListener('click', (event) => {
          if (event.target.closest('button')) return;

          if (index !== this.activeIndex) {
            this.setActive(index);
          }
        });
      });

      // Mute is independent per UGC card.
      this.cards.forEach((card) => {
        const mute = card.querySelector('.mute-btn');

        if (!mute) return;

        mute.addEventListener('click', (event) => {
          event.stopPropagation();

          const isMuted = mute.dataset.muted !== 'false';
          mute.dataset.muted = isMuted ? 'false' : 'true';
          const soundState = mute.querySelector('.icon-state-sound');
          const mutedState = mute.querySelector('.icon-state-muted');

          // The attribute now holds the post-click state; the icons and
          // label describe it (muted -> show the muted speaker).
          if (soundState) soundState.hidden = !isMuted;
          if (mutedState) mutedState.hidden = isMuted;
          mute.setAttribute('aria-label', isMuted ? 'Mute' : 'Unmute');
        });
      });

      // Pause controls the autoplay/progress of the active story.
      this.cards.forEach((card, index) => {
        const pauseButton = card.querySelector('.pause-btn');

        if (!pauseButton) return;

        pauseButton.addEventListener('click', (event) => {
          event.stopPropagation();

          if (index !== this.activeIndex) return;

          this.paused = !this.paused;
          this.syncPauseButtons();
        });
      });

      // Quick add for the active card's product.
      this.querySelectorAll('.cart-btn').forEach((button) => {
        button.addEventListener('click', (event) => {
          event.stopPropagation();
          this.addToCart(button);
        });
      });
    }

    addToCart(button) {
      const variantId = button.dataset.variantId;

      if (!variantId) return;

      // Only attempt the add when the theme's cart endpoints are present.
      if (!window.VelouraSettings || !window.VelouraSettings.routes) return;

      button.classList.add('btn--loading');

      const config = {
        method: 'POST',
        headers: {
          Accept: 'application/javascript',
          'X-Requested-With': 'XMLHttpRequest',
        },
      };

      const formData = new FormData();
      formData.append('id', variantId);
      formData.append('quantity', 1);

      const cartDrawer = document.querySelector('cart-drawer');
      if (
        cartDrawer &&
        typeof cartDrawer.getSectionsToRender === 'function'
      ) {
        formData.append(
          'sections',
          cartDrawer.getSectionsToRender().map((section) => section.id)
        );
        formData.append('sections_url', window.location.pathname);
      }

      config.body = formData;

      fetch(`${VelouraSettings.routes.cart_add_url}`, config)
        .then((response) => response.json())
        .then((response) => {
          if (response.status) return;

          if (window.VelouraEvents && window.PUB_SUB_EVENTS) {
            window.VelouraEvents.emit(
              window.PUB_SUB_EVENTS.cartUpdate,
              response
            );
          }

          const bagState = button.querySelector('.icon-state-bag');
          const addedState = button.querySelector('.icon-state-added');

          if (bagState) bagState.hidden = true;
          if (addedState) addedState.hidden = false;
          button.setAttribute('aria-label', 'Added to bag');
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          button.classList.remove('btn--loading');
          window.setTimeout(() => {
            const bagState = button.querySelector('.icon-state-bag');
            const addedState = button.querySelector('.icon-state-added');

            if (bagState) bagState.hidden = false;
            if (addedState) addedState.hidden = true;
            button.setAttribute('aria-label', 'Add to bag');
          }, 1200);
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
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        if (event.target.closest('button, a')) return;

        // If the rail still sits on a twin, re-anchor before measuring so
        // the drag starts from the real card positions.
        if (this.awaitingReset) this.silentReanchor();

        // Grabbing mid-slide: stop the tween so the finger owns the rail.
        gsap.killTweensOf(this.rail);

        pointerId = event.pointerId;
        startX = event.clientX;
        startY = event.clientY;
        // Measured live: self-correcting even with clones in the rail.
        baseX =
          this.cards[this.activeIndex].getBoundingClientRect().left -
          this.rail.getBoundingClientRect().left;
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

        gsap.set(this.rail, { x: -(baseX - dx) });
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
          const direction = dx < 0 ? 1 : -1;
          const next = this.activeIndex + direction;

          if (next < 0) {
            // Mobile: snap back at the ends. Desktop: scroll onto the
            // twin of the last card — seamless infinite scroll.
            if (window.matchMedia('(max-width: 900px)').matches) {
              this.translateRailToActive();
            } else {
              this.goPastStart();
            }
          } else if (next >= this.cards.length) {
            if (window.matchMedia('(max-width: 900px)').matches) {
              this.translateRailToActive();
            } else {
              this.goPastEnd();
            }
          } else {
            this.setActive(next);
          }
        } else {
          this.translateRailToActive();
        }

        // The gesture settled; drop a pending twin re-anchor from an
        // earlier cycle. Never the one just scheduled by goPast* — that
        // must keep the rail on the twin until the animation lands.
        const edgeSwipe =
          Math.abs(dx) >= threshold &&
          (next < 0 || next >= this.cards.length) &&
          !window.matchMedia('(max-width: 900px)').matches;

        if (this.awaitingReset && !edgeSwipe) this.silentReanchor();

        // A completed drag fires a click on the card/button; ignore it.
        this.suppressClick = true;
        setTimeout(() => {
          this.suppressClick = false;
        }, 400);
      };

      const onPointerCancel = () => {
        if (pointerId === null) return;
        pointerId = null;
        dragging = false;
        this.isDragging = false;
        surface.classList.remove('is-dragging');
        this.translateRailToActive();
        if (this.awaitingReset) this.silentReanchor();
      };

      surface.addEventListener('pointerdown', onPointerDown);
      surface.addEventListener('pointermove', onPointerMove);
      surface.addEventListener('pointerup', onPointerEnd);
      surface.addEventListener('pointercancel', onPointerCancel);

      // Swallow the click that immediately follows a completed drag.
      surface.addEventListener(
        'click',
        (event) => {
          if (!this.suppressClick) return;
          event.stopPropagation();
          event.preventDefault();
          this.suppressClick = false;
        },
        true
      );
    }

    // Driven by gsap.ticker (delta in ms), so the story clock shares the
    // GSAP frame loop instead of a second requestAnimationFrame.
    tick(delta) {
      if (!this.paused && !document.hidden) {
        this.elapsed += delta;

        if (this.elapsed >= this.slideDuration) {
          this.elapsed = 0;
          const next = this.activeIndex + 1;

          // Past the last card, keep scrolling onto the twin instead of
          // jumping back to the first — seamless infinite loop.
          if (next >= this.cards.length) {
            this.goPastEnd();
          } else {
            this.setActive(next, false);
          }
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
