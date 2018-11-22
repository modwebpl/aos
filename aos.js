export class aos {
  constructor(className = 'aos') {
    this.init(className);
  }

  init(className) {
    if (!this._setVars(className)) return;
    this._setEvents();
  }

  _setVars(className) {
    var _this = this;

    _this._body = document.getElementsByTagName('body')[0];
    if (!_this._body) return false;

    _this._aos = _this._body.querySelectorAll('.' + className);
    if (!_this._aos.length) return false;

    _this._scroll = {};
    _this._data = {};
    _this._timer = {};
    _this._arr = [];

    return true;
  }

  _setEvents() {
    this._setOffset();
    this._onScroll();
  }

  _setOffset() {
    each(this._aos, (key, val) => {
      let offset = parseInt(val.getAttribute('data-offset')) || 0;

      this._data['act' + key] = false;
      this._data['rel' + key] = getOffset(val).t + offset;
      this._data['delay' + key] = val.getAttribute('data-delay') || 0;

      TweenLite.set(val, {autoAlpha: 0, y: '50%'})
    });
  }

  _onScroll() {
    var _this = this;

    this._scroll._fn = this._scroll._fn || {};
    this._scroll._fn.aos = () => {
      let sTop = document.body.scrollTop || document.documentElement.scrollTop,
        relTop = sTop + window.innerHeight;

      for (let key = 0; key <= this._aos.length; key++) {

        if (relTop >= this._data['rel' + key] && !this._data['act' + key]) {

          this._data['act' + key] = true;

          let tl = new TimelineLite({
            paused: true,
            onComplete: function () {
              this.clear();
              _this._update(key);
            }
          });

          this._timer = setTimeout(() => {
            tl.play().to(this._aos[key], 1.5, {y: '0%', ease: Expo.easeOut})
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

      clearTimeout(this._timer);
      Object.entries(this).forEach(([key, val]) => {
        delete this[key];
      });

    } catch (e) {
      console.error(e);
    }
  }
}
