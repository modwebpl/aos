export class aos {
  constructor(className = 'aos') {
    if (!this._setVars(className)) return;
    this._setEvents();
  }

  _setVars(className) {
    let _this = this;
    
    _this._aos = document.body.getElementsByclassName(className);
    if (!this._aos.length) return false;

    _this._scroll = {};
    _this._data = {};
    _this._arr = [];
    
    return true;
  }

  _setEvents() {
    this._setOffset();
    this._onScroll();
  }

  _setOffset() {
    each(this._aos, (key, val) => {
      let offset = parseInt(val.getAttribute('data-offset')) || 200, setY = val.getAttribute('data-y') || '50%',
        setX = val.getAttribute('data-x') || '0%';

      TweenLite.set(val, {autoAlpha: 0, y: setY, x: setX});

      this._data['act' + key] = false;
      this._data['rel' + key] = getOffset(val).t + offset;
      this._data['delay' + key] = val.getAttribute('data-delay') || 0;
      this._data['top' + key] = val.getAttribute('data-top') ? true : false;
    });
  }

  _onScroll() {
    let _this = this;

    this._scroll._fn = this._scroll._fn || {};
    this._scroll._fn.aos = () => {
      let sTop = document.body.scrollTop || document.documentElement.scrollTop, relTop, key = 0;

      for (key; key <= this._aos.length; key++) {
        !this._data['top' + key] ? relTop = sTop + window.innerHeight : relTop = sTop;

        if (relTop >= this._data['rel' + key] && !this._data['act' + key]) {
          this._data['act' + key] = true;

          let tl = new TimelineLite({
            paused: true,
            onComplete: function () {
              this.clear();
              _this._update(key);
            }
          });

          let timer = setTimeout(() => {
            tl.to(this._aos[key], 1.5, {y: '0%', x: '0%', ease: Expo.easeOut})
              .to(this._aos[key], 1.5, {autoAlpha: 1}, '-=1.5')
              .play();
          }, parseFloat(this._data['delay' + key]) * 1000);
        }
      }
    };
    document.addEventListener('scroll', this._scroll._fn.aos, {pasive: true});
  }

  _update(key) {
    this._arr.push(key);
    return this._arr.length === this._aos.length ? this.destroy() : void 0;
  }

  destroy() {
    try {
      if(this._scroll._fn.aos) document.removeEventListener('scroll', this._scroll._fn.aos);
      
      // Object.entries needs polyfill on IE <= 11
      Object.entries(this).forEach(([key, val]) => {
        this[key] = null;
      });

    } catch (e) {
      console.error(e.message);
    }
  }
}
