export class aos {
  constructor(className = 'aos') {
    this.init(className);
  }

  init(className) {
    if (!this._setVars(className)) return;
    this._setEvents();
  }

  _setVars(className) {
    let _this = this;

    _this._parent = document.getElementsByTagName('body')[0];
    if (!_this._parent) return false;

    _this._aos = _this._parent.querySelectorAll('.' + className);
    if (!_this._aos.length) return false;

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
      let sTop = document.body.scrollTop || document.documentElement.scrollTop, relTop;

      for (let key = 0; key <= this._aos.length; key++) {
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
            tl.play().to(this._aos[key], 1.5, {y: '0%', x: '0%', ease: Expo.easeOut})
              .to(this._aos[key], 1.5, {autoAlpha: 1}, '-=1.5');
          }, parseFloat(this._data['delay' + key]) * 1000);
        }
      }
    };
    document.addEventListener('scroll', this._scroll._fn.aos);
  }

  _update(key) {
    this._arr.push(key);
    this._arr.length === this._aos.length ? this.destroy() : '';
  }

  destroy() {
    try {
      this._scroll._fn.aos ? document.removeEventListener('scroll', this._scroll._fn.aos) : '';
      
      Object.entries(this).forEach(([key, val]) => {
        delete this[key];
      });

    } catch (e) {
      console.error(e);
    }
  }
}
