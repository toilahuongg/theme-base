class MotionElement extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    if (VelouraSettings.motionReduced) return;

    this.preInitialize();
    VelouraTheme.Motion.inView(
      this,
      async () => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.initialize();
          });
        });
      },
      { margin: "0px 0px -50px 0px" }
    );
  }

  get isHold() {
    return this.hasAttribute("hold");
  }

  get animationType() {
    return this.dataset.motion || "none";
  }

  get animationDelay() {
    return parseInt(this.dataset.motionDelay || 0) / 1000;
  }

  /**
   * Value in rem
   */
  getTranslateX(value) {
    if (VelouraSettings.isRTL) {
      value *= -1;
    }

    return `${value}rem`;
  }

  preInitialize() {
    if (this.isHold) return;

    switch (this.animationType) {
      case "fade-in":
        VelouraTheme.Motion.animate(this, { opacity: 0.01 }, { duration: 0 });
        break;

      case "fade-in-up":
        VelouraTheme.Motion.animate(
          this,
          { transform: "translate3d(0, 2rem, 0)", opacity: 0.01 },
          { duration: 0 }
        );
        break;

      case "fade-in-left":
        VelouraTheme.Motion.animate(
          this,
          {
            transform: `translate3d(${this.getTranslateX(-2)}, 0, 0)`,
            opacity: 0.01,
          },
          { duration: 0 }
        );
        break;

      case "fade-in-right":
        VelouraTheme.Motion.animate(
          this,
          {
            transform: `translate3d(${this.getTranslateX(2)}, 0, 0)`,
            opacity: 0.01,
          },
          { duration: 0 }
        );
        break;

      case "zoom-in-lg":
        VelouraTheme.Motion.animate(
          this,
          { transform: "scale3d(0, 0, 0)" },
          { duration: 0 }
        );
        break;

      case "zoom-out-sm":
        VelouraTheme.Motion.animate(
          this,
          { transform: "scale3d(1.1, 1.1, 1.1)" },
          { duration: 0 }
        );
        break;
    }
  }

  async initialize() {
    if (this.isHold) return;

    switch (this.animationType) {
      case "fade-in":
        await VelouraTheme.Motion.animate(
          this,
          { opacity: 1 },
          { duration: 1.5, delay: this.animationDelay, easing: [0, 0, 0.3, 1] }
        ).finished;
        break;

      case "fade-in-up":
      case "fade-in-left":
      case "fade-in-right":
        await VelouraTheme.Motion.animate(
          this,
          { transform: "translate3d(0, 0, 0)", opacity: 1 },
          {
            duration: VelouraSettings.animationDuration,
            delay: this.animationDelay,
            easing: [0, 0, 0.3, 1],
          }
        ).finished;
        break;

      case "zoom-in-lg":
      case "zoom-out-sm":
        await VelouraTheme.Motion.animate(
          this,
          { transform: "scale3d(1, 1, 1)" },
          {
            duration: VelouraSettings.animationDuration,
            delay: this.animationDelay,
            easing: [0, 0, 0.3, 1],
          }
        ).finished;
        break;
    }
  }

  async resetAnimation(duration) {
    switch (this.animationType) {
      case "fade-in":
        await VelouraTheme.Motion.animate(
          this,
          { opacity: 0 },
          {
            duration: duration ? duration : 1.5,
            delay: this.animationDelay,
            easing: duration ? "none" : [0, 0, 0.3, 1],
          }
        ).finished;
        break;

      case "fade-in-up":
        await VelouraTheme.Motion.animate(
          this,
          { transform: "translate3d(0, 2rem, 0)", opacity: 0 },
          {
            duration: duration ? duration : VelouraSettings.animationDuration,
            delay: this.animationDelay,
            easing: duration ? "none" : [0, 0, 0.3, 1],
          }
        ).finished;
        break;

      case "fade-in-left":
        await VelouraTheme.Motion.animate(
          this,
          {
            transform: `translate3d(${this.getTranslateX(-2)}, 0, 0)`,
            opacity: 0,
          },
          {
            duration: duration ? duration : VelouraSettings.animationDuration,
            delay: this.animationDelay,
            easing: duration ? "none" : [0, 0, 0.3, 1],
          }
        ).finished;
        break;

      case "fade-in-right":
        await VelouraTheme.Motion.animate(
          this,
          {
            transform: `translate3d(${this.getTranslateX(2)}, 0, 0)`,
            opacity: 0,
          },
          {
            duration: duration ? duration : VelouraSettings.animationDuration,
            delay: this.animationDelay,
            easing: duration ? "none" : [0, 0, 0.3, 1],
          }
        ).finished;
        break;

      case "zoom-in-lg":
        await VelouraTheme.Motion.animate(
          this,
          { transform: "scale3d(0, 0, 0)" },
          {
            duration: duration ? duration : 1.3,
            delay: this.animationDelay,
            easing: duration ? "none" : [0, 0, 0.3, 1],
          }
        ).finished;
        break;

      case "zoom-out-sm":
        await VelouraTheme.Motion.animate(
          this,
          { transform: "scale3d(0, 0, 0)" },
          {
            duration: duration ? duration : 1.3,
            delay: this.animationDelay,
            easing: duration ? "none" : [0.16, 1, 0.3, 1],
          }
        ).finished;
        break;
    }
  }

  refreshAnimation() {
    this.removeAttribute("hold");
    this.preInitialize();
    setTimeout(() => {
      this.initialize();
    }, 50); // Delay a bit to make animation re init properly.
  }
}
customElements.define("motion-element", MotionElement);

class GridList extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    if (VelouraSettings.motionReduced) return;

    this.hideGridItems();
    VelouraTheme.Motion.inView(
      this,
      () => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.showGridItems();
          });
        });
      },
      { margin: "0px 0px -50px 0px" }
    );
  }

  get animationType() {
    return this.dataset.motion || "none";
  }

  get gridItems() {
    return this.querySelectorAll(".grid-list__column");
  }

  get visibleGridItems() {
    return this.querySelectorAll(".grid-list__column:not([style])");
  }

  /**
   * Value in rem
   */
  getTranslateX(value) {
    if (VelouraSettings.isRTL) {
      value *= -1;
    }

    return `${value}rem`;
  }

  hideGridItems() {
    switch (this.animationType) {
      case "fade-in":
        VelouraTheme.Motion.animate(
          this.gridItems,
          { opacity: 0.01 },
          { duration: 0 }
        );
        break;

      case "fade-in-up":
        VelouraTheme.Motion.animate(
          this.gridItems,
          {
            transform: "translate3d(0, 2rem, 0)",
            opacity: 0.01,
            visibility: "hidden",
          },
          { duration: 0 }
        );
        break;

      case "fade-in-left":
        VelouraTheme.Motion.animate(
          this.gridItems,
          {
            transform: `translate3d(${this.getTranslateX(-2)}, 0, 0)`,
            opacity: 0.01,
            visibility: "hidden",
          },
          { duration: 0 }
        );
        break;

      case "fade-in-right":
        VelouraTheme.Motion.animate(
          this.gridItems,
          {
            transform: `translate3d(${this.getTranslateX(2)}, 0, 0)`,
            opacity: 0.01,
            visibility: "hidden",
          },
          { duration: 0 }
        );
        break;
    }
  }

  showItems(items) {
    switch (this.animationType) {
      case "fade-in":
        VelouraTheme.Motion.animate(
          items,
          {
            opacity: [0.01, 1],
            visibility: ["hidden", "visible"],
          },
          {
            duration: VelouraSettings.animationDuration,
            delay: VelouraTheme.Motion.stagger(0.1),
            easing: [0, 0, 0.3, 1],
          }
        );
        break;

      case "fade-in-up":
        VelouraTheme.Motion.animate(
          items,
          {
            transform: ["translate3d(0, 2rem, 0)", "translate3d(0, 0, 0)"],
            opacity: [0.01, 1],
            visibility: ["hidden", "visible"],
          },
          {
            duration: VelouraSettings.animationDuration,
            delay: VelouraTheme.Motion.stagger(0.1),
            easing: [0, 0, 0.3, 1],
          }
        );
        break;

      case "fade-in-left":
        VelouraTheme.Motion.animate(
          items,
          {
            transform: [
              `translate3d(${this.getTranslateX(-2)}, 0, 0)`,
              "translate3d(0, 0, 0)",
            ],
            opacity: [0.01, 1],
            visibility: ["hidden", "visible"],
          },
          {
            duration: VelouraSettings.animationDuration,
            delay: VelouraTheme.Motion.stagger(0.1),
            easing: [0, 0, 0.3, 1],
          }
        );
        break;

      case "fade-in-right":
        VelouraTheme.Motion.animate(
          items,
          {
            transform: [
              `translate3d(${this.getTranslateX(2)}, 0, 0)`,
              "translate3d(0, 0, 0)",
            ],
            opacity: [0.01, 1],
            visibility: ["hidden", "visible"],
          },
          {
            duration: VelouraSettings.animationDuration,
            delay: VelouraTheme.Motion.stagger(0.1),
            easing: [0, 0, 0.3, 1],
          }
        );
        break;
    }
  }

  showGridItems() {
    this.showItems(this.gridItems);
  }

  reShowVisibleGridItems() {
    this.showItems(this.visibleGridItems);
  }
}
customElements.define("grid-list", GridList);
