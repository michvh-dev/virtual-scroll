(() => {
  // src/utils/position.ts
  var getCurrentMobilePositionFromEvent = (e) => {
    let position = e;
    if (e.targetTouches && e.targetTouches.length >= 1) {
      position = e.targetTouches[0];
    }
    return { y: position.clientY, x: position.clientX };
  };

  // src/VirtualScroll.ts
  var _VirtualScroll = class {
    constructor(config = {
      vertical: true,
      horizontal: false,
      keyBoardOffset: 50,
      boundaries: {}
    }) {
      this.element = window;
      this.pageX = 0;
      this.pageY = 0;
      this.keyBindings = {
        down: [1, 0],
        up: [-1, 0],
        right: [0, 1],
        left: [0, -1]
      };
      this.mobileConfig = {
        pressed: false,
        timeConstant: 325,
        reference: {
          x: 0,
          y: 0
        },
        velocity: {
          x: 0,
          y: 0
        },
        frame: {
          x: 0,
          y: 0
        },
        target: {
          x: 0,
          y: 0
        },
        timestamp: 0,
        ticker: void 0,
        amplitude: { x: 0, y: 0 }
      };
      this.handleMouseScroll = (e) => {
        e.preventDefault();
        this.scroll(e.deltaX, e.deltaY);
      };
      this.handleKeyDownMove = (e) => {
        console.log(e.key);
        const keyBindChange = this.keyBindings[e.key];
        if (keyBindChange) {
          this.scroll(
            keyBindChange[0] * this.config.keyBoardOffset,
            keyBindChange[1] * this.config.keyBoardOffset
          );
        }
      };
      this.mobileAutoScroll = () => {
        let deltaX = 0;
        let deltaY = 0;
        const { amplitude, timestamp, timeConstant, target } = this.mobileConfig;
        if (amplitude.x) {
          const elapsed = Date.now() - timestamp;
          deltaX = -amplitude.x * Math.exp(-elapsed / timeConstant);
        }
        if (amplitude.y) {
          const elapsed = Date.now() - timestamp;
          deltaY = -amplitude.y * Math.exp(-elapsed / timeConstant);
        }
        if (deltaX > 0.5 || deltaX < -0.5 || deltaY > 0.5 || deltaY < -0.5) {
          this.scroll(target.x + deltaX, target.y + deltaY);
          requestAnimationFrame(this.mobileAutoScroll);
        } else {
          this.scroll(target.x, target.y);
        }
      };
      this.scrollEventKey = "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";
      this.eventWrappers = [];
      this.config = config;
      this.setEventListeners();
    }
    get boundaries() {
      return this.config.boundaries || {};
    }
    scroll(offsetX, offsetY) {
      if (this.config.vertical) {
        this.pageY = this.pageY + offsetY;
      }
      if (this.config.horizontal) {
        this.pageX = this.pageX + offsetX;
      }
      if (this.boundaries.minX !== void 0 && this.pageX < this.boundaries.minX) {
        this.pageX = this.boundaries.minX;
      }
      if (this.boundaries.maxX !== void 0 && this.pageX > this.boundaries.maxX) {
        this.pageX = this.boundaries.maxX;
      }
      if (this.boundaries.minY !== void 0 && this.pageY < this.boundaries.minY) {
        this.pageY = this.boundaries.minY;
      }
      if (this.boundaries.maxY !== void 0 && this.pageY > this.boundaries.maxY) {
        this.pageY = this.boundaries.maxY;
      }
      this.triggerEvent(_VirtualScroll.Events.scroll, {
        currentX: this.pageX,
        currentY: this.pageY,
        offsetX,
        offsetY
      });
    }
    trackMobile() {
      const now = Date.now();
      const elapsed = now - this.mobileConfig.timestamp;
      this.mobileConfig.timestamp = now;
      const deltaX = this.pageX - this.mobileConfig.frame.x;
      const deltaY = this.pageY - this.mobileConfig.frame.y;
      this.mobileConfig.frame.x = this.pageX;
      this.mobileConfig.frame.y = this.pageY;
      const vX = 1e3 * deltaX / (1 + elapsed);
      const vY = 1e3 * deltaY / (1 + elapsed);
      this.mobileConfig.velocity.x = 0.8 * vX + 0.2 * this.mobileConfig.velocity.x;
      this.mobileConfig.velocity.y = 0.8 * vY + 0.2 * this.mobileConfig.velocity.y;
    }
    mobileTouchStart(e) {
      this.mobileConfig.pressed = true;
      this.mobileConfig.reference = getCurrentMobilePositionFromEvent(e);
      this.mobileConfig.velocity = this.mobileConfig.amplitude = { x: 0, y: 0 };
      this.mobileConfig.frame.x = this.pageX;
      this.mobileConfig.frame.y = this.pageY;
      this.mobileConfig.timestamp = Date.now();
      clearInterval(this.mobileConfig.ticker);
      this.mobileConfig.ticker = setInterval(this.trackMobile, 100);
      if (e.target.nodeName !== "A") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
    mobileTouchMove(e) {
      const { pressed, reference } = this.mobileConfig;
      if (pressed) {
        const { x, y } = getCurrentMobilePositionFromEvent(e);
        let offsetY = reference.y - y;
        let offsetX = reference.x - x;
        if (offsetY > 2 || offsetY < -2) {
          offsetY = 0;
        }
        if (offsetX > 2 || offsetX < -2) {
          offsetX = 0;
        }
        reference.y = y;
        this.scroll(offsetX, offsetY);
      }
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    mobileTouchEnd(e) {
      const { ticker, amplitude, target, velocity } = this.mobileConfig;
      this.mobileConfig.pressed = false;
      clearInterval(ticker);
      if (velocity.x > 10 || velocity.x < -10) {
        amplitude.x = 0.8 * velocity.x;
        target.x = Math.round(this.pageX + amplitude.x);
      }
      if (velocity.y > 10 || velocity.y < -10) {
        amplitude.y = 0.8 * velocity.y;
        target.y = Math.round(this.pageX + amplitude.y);
      }
      if (amplitude.x || amplitude.y) {
        this.mobileConfig.timestamp = Date.now();
        requestAnimationFrame(this.mobileAutoScroll);
      }
      if (e.target && e.target.nodeName !== "A") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
    setEventListeners() {
      this.element.addEventListener(this.scrollEventKey, this.handleMouseScroll, {
        passive: false
      });
      window.document.addEventListener("keydown", this.handleKeyDownMove);
      this.element.addEventListener("touchstart", this.mobileTouchStart, {
        passive: false
      });
      this.element.addEventListener("touchmove", this.mobileTouchMove, {
        passive: false
      });
      this.element.addEventListener("touchend", this.mobileTouchEnd, {
        passive: false
      });
    }
    triggerEvent(eventName, object) {
      document.dispatchEvent(new CustomEvent(eventName, { detail: object }));
    }
    on(key, cb) {
      const wrapped = ({ detail }) => cb(detail);
      this.eventWrappers[cb] = wrapped;
      document.addEventListener(_VirtualScroll.Events[key], wrapped);
    }
  };
  var VirtualScroll = _VirtualScroll;
  VirtualScroll.Events = {
    scroll: "virtual-scroll-event-scroll"
  };
  var VirtualScroll_default = VirtualScroll;
})();
//# sourceMappingURL=index.global.js.map