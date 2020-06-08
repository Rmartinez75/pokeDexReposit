!(function (e) {
  ('object' != typeof exports || 'undefined' == typeof module) &&
  'function' == typeof define &&
  define.amd
    ? define(e)
    : e();
})(function () {
  'use strict';
  function e(n) {
    var t = this.constructor;
    return this.then(
      function (e) {
        return t.resolve(n()).then(function () {
          return e;
        });
      },
      function (e) {
        return t.resolve(n()).then(function () {
          return t.reject(e);
        });
      }
    );
  }
  var n = setTimeout;
  function a(e) {
    return e && 'undefined' != typeof e.length;
  }
  function o() {}
  function i(e) {
    if (!(this instanceof i))
      throw new TypeError('Promises must be constructed via new');
    if ('function' != typeof e) throw new TypeError('not a function');
    (this._state = 0),
      (this._handled = !1),
      (this._value = undefined),
      (this._deferreds = []),
      s(e, this);
  }
  function r(o, r) {
    for (; 3 === o._state; ) o = o._value;
    0 !== o._state
      ? ((o._handled = !0),
        i._immediateFn(function () {
          var e = 1 === o._state ? r.onFulfilled : r.onRejected;
          if (null !== e) {
            var n;
            try {
              n = e(o._value);
            } catch (t) {
              return void u(r.promise, t);
            }
            f(r.promise, n);
          } else (1 === o._state ? f : u)(r.promise, o._value);
        }))
      : o._deferreds.push(r);
  }
  function f(e, n) {
    try {
      if (n === e)
        throw new TypeError('A promise cannot be resolved with itself.');
      if (n && ('object' == typeof n || 'function' == typeof n)) {
        var t = n.then;
        if (n instanceof i) return (e._state = 3), (e._value = n), void c(e);
        if ('function' == typeof t)
          return void s(
            (function o(e, n) {
              return function () {
                e.apply(n, arguments);
              };
            })(t, n),
            e
          );
      }
      (e._state = 1), (e._value = n), c(e);
    } catch (r) {
      u(e, r);
    }
  }
  function u(e, n) {
    (e._state = 2), (e._value = n), c(e);
  }
  function c(e) {
    2 === e._state &&
      0 === e._deferreds.length &&
      i._immediateFn(function () {
        e._handled || i._unhandledRejectionFn(e._value);
      });
    for (var n = 0, t = e._deferreds.length; n < t; n++) r(e, e._deferreds[n]);
    e._deferreds = null;
  }
  function l(e, n, t) {
    (this.onFulfilled = 'function' == typeof e ? e : null),
      (this.onRejected = 'function' == typeof n ? n : null),
      (this.promise = t);
  }
  function s(e, n) {
    var t = !1;
    try {
      e(
        function (e) {
          t || ((t = !0), f(n, e));
        },
        function (e) {
          t || ((t = !0), u(n, e));
        }
      );
    } catch (o) {
      if (t) return;
      (t = !0), u(n, o);
    }
  }
  (i.prototype['catch'] = function (e) {
    return this.then(null, e);
  }),
    (i.prototype.then = function (e, n) {
      var t = new this.constructor(o);
      return r(this, new l(e, n, t)), t;
    }),
    (i.prototype['finally'] = e),
    (i.all = function (n) {
      return new i(function (r, i) {
        if (!a(n)) return i(new TypeError('Promise.all accepts an array'));
        var f = Array.prototype.slice.call(n);
        if (0 === f.length) return r([]);
        var u = f.length;
        function c(n, e) {
          try {
            if (e && ('object' == typeof e || 'function' == typeof e)) {
              var t = e.then;
              if ('function' == typeof t)
                return void t.call(
                  e,
                  function (e) {
                    c(n, e);
                  },
                  i
                );
            }
            (f[n] = e), 0 == --u && r(f);
          } catch (o) {
            i(o);
          }
        }
        for (var e = 0; e < f.length; e++) c(e, f[e]);
      });
    }),
    (i.resolve = function (n) {
      return n && 'object' == typeof n && n.constructor === i
        ? n
        : new i(function (e) {
            e(n);
          });
    }),
    (i.reject = function (t) {
      return new i(function (e, n) {
        n(t);
      });
    }),
    (i.race = function (r) {
      return new i(function (e, n) {
        if (!a(r)) return n(new TypeError('Promise.race accepts an array'));
        for (var t = 0, o = r.length; t < o; t++) i.resolve(r[t]).then(e, n);
      });
    }),
    (i._immediateFn =
      'function' == typeof setImmediate
        ? function (e) {
            setImmediate(e);
          }
        : function (e) {
            n(e, 0);
          }),
    (i._unhandledRejectionFn = function (e) {
      void 0 !== console &&
        console &&
        console.warn('Possible Unhandled Promise Rejection:', e);
    });
  var t = (function () {
    if ('undefined' != typeof self) return self;
    if ('undefined' != typeof window) return window;
    if ('undefined' != typeof global) return global;
    throw Error('unable to locate global object');
  })();
  'function' != typeof t.Promise
    ? (t.Promise = i)
    : t.Promise.prototype['finally'] || (t.Promise.prototype['finally'] = e);
});
