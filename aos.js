export class aos {
  constructor() {
    this.init();
  }

  init() {
    if (!this._setVars()) return;
    this._setEvents();
  }

  _setVars() {
    var _this = this;

    _this._aos = document.querySelectorAll('.aos');
    if (!_this._aos.length) return false;

    _this._scroll = {};
    _this._data = {};
    _this._arr = [];

    EasePack;
    return true;
  }

  _setEvents() {
    this._setOffset();
    this._onScroll();
  }

  _setOffset() {
    each(this._aos, (key, val) => {
      let offset = val.getAttribute('data-offset') || 0;

      this._data['act' + key] = false;
      this._data['rel' + key] = parseInt(getOffset(val).t - offset);

      TweenLite.set(val, {autoAlpha: 0, y: '50%'})
    });
  }

  _onScroll() {
    var _this = this;

    this._scroll._fn = this._scroll._fn || {};
    this._scroll._fn.aos = () => {
      let sTop = document.body.scrollTop || document.documentElement.scrollTop;

      for (let key = 0; key <= this._aos.length; key++) {

        if (sTop >= this._data['rel' + key] && !this._data['act' + key]) {

          this._data['act' + key] = true;

          let tl = new TimelineLite({
            paused: true,
            onComplete: function () {
              this.clear();
              _this._update(key);
            }
          });
          tl.play().to(this._aos[key], 1.5, {y: '0%', ease: Expo.easeOut})
            .to(this._aos[key], 1.5, {autoAlpha: 1}, '-=1.2');
        }
      }
    };
    document.addEventListener('scroll', this._scroll._fn.aos);
  }

  _update(key) {
    this._arr.push(key);
    if (this._arr.length === this._aos.length) this.destroy();
  }

  destroy() {
    try {
      this._scroll._fn.aos ? document.removeEventListener('scroll', this._scroll._fn.aos) : '';

      Object.entries(this).forEach(([key, val]) => {
        delete this[key];
      });

    } catch (e) {
      console.error(e.message);
    }
  }
}
