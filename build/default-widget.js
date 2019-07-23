// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"EjGt":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

function logEvent() {
  var isDebug = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var message = arguments.length > 1 ? arguments[1] : undefined;
  var data = arguments.length > 2 ? arguments[2] : undefined;
  var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'info';

  if (isDebug && window.console) {
    var color = type === 'error' ? '#EB3223;' : '';
    var messageConsoleStyles = "\n       font-weight: bold;\n       color: ".concat(color, "\n    ");
    var infoButtonConsoleStyles = "\n      font-weight: normal;\n      text-decoration: underline;\n      color: ".concat(color, "\n    ");
    var arrowConsoleStyles = "\n      font: 10px Arial;\n      padding-left: 3px;\n      color: ".concat(color, "\n    ");
    var additionalDataConsoleStyles = "font-weight: bold;";
    console.groupCollapsed("%cElixirChat: ".concat(message, " %cInfo%c\u25BE"), messageConsoleStyles, infoButtonConsoleStyles, arrowConsoleStyles);

    if (_typeof(data) === 'object' && !(data instanceof Array)) {
      Object.keys(data).forEach(function (key) {
        console.log("%c".concat(key, ":\n"), additionalDataConsoleStyles, data[key], '\n');
      });
    } else {
      console.log('%c\nData:\n', additionalDataConsoleStyles, data);
    }

    console.log('%c\nStacktrace:', additionalDataConsoleStyles);
    console.trace();
    console.groupEnd();
  }
}

exports.logEvent = logEvent;

function capitalize(str) {
  return str.substr(0, 1).toUpperCase() + str.substr(1);
}

exports.capitalize = capitalize;

function randomDigitStringId(idLength) {
  return (Array(idLength).join('0') + Math.random()).slice(-idLength);
}

exports.randomDigitStringId = randomDigitStringId;
},{}],"4KO9":[function(require,module,exports) {
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

function insertElement(tagName, attributes, elementToAppendTo) {
  var element = document.createElement(tagName);

  if (_typeof(attributes) === 'object') {
    for (var key in attributes) {
      element[key] = attributes[key];
    }
  }

  if (elementToAppendTo) {
    elementToAppendTo.appendChild(element);
  }

  return element;
}

exports.insertElement = insertElement;

function inflect(locale, number, endings, hideNumber) {
  var getEnding = {};

  getEnding['en-US'] = function (number, endings) {
    return number === 1 ? endings[0] : endings[1];
  };

  getEnding['ru-RU'] = function (number, endings) {
    var cases = [2, 0, 1, 1, 1, 2];
    var endingIndex = number % 100 > 4 && number % 100 < 20 ? 2 : cases[Math.min(number % 10, 5)];
    return endings[endingIndex];
  };

  var ending = getEnding[locale](number, endings) || endings[0];
  return hideNumber ? ending : number + ' ' + ending;
}

exports.inflect = inflect;

function playNotificationSound() {
  var context = new AudioContext();
  var filter = context.createBiquadFilter();
  filter.type = 'notch';
  filter.frequency.value = 780;
  filter.Q.value = 1.5;
  filter.connect(context.destination);
  var gain1 = context.createGain();
  gain1.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1);
  gain1.connect(filter);
  var tone1 = context.createOscillator();
  tone1.frequency.value = 830.6;
  tone1.connect(gain1);
  tone1.start(0);
  tone1.stop(1.65);
  var gain2 = context.createGain();
  gain2.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1.5);
  gain2.connect(filter);
  var tone2 = context.createOscillator();
  tone2.frequency.value = 440;
  tone2.connect(gain2);
  tone2.start(0.15);
  tone2.stop(1.65);
}

exports.playNotificationSound = playNotificationSound;

function generateFontFaceRule(fontFamily, fontWeight, fontUrl) {
  return "@font-face {\n    font-family: \"".concat(fontFamily, "\";\n    font-weight: ").concat(fontWeight, ";\n    src: url(\"").concat(fontUrl, "\") format(\"woff\");\n  }");
}

exports.generateFontFaceRule = generateFontFaceRule;

function replaceCssVariables(cssCode, variables) {
  return cssCode.replace(/var\(--([a-z0-9_]+)\)/igm, function (match, key) {
    return variables[key];
  });
}

exports.replaceCssVariables = replaceCssVariables;

function parseCssVariables(cssRuleCode) {
  var cssVariables = {};
  cssRuleCode.trim().replace(/^.*{/gm, '').replace(/}$/, '').split('--').filter(function (line) {
    return /url\(/i.test(line);
  }).forEach(function (line) {
    var _line$trim$replace$sp = line.trim().replace(/^([a-z0-9]+)\s*:\s*/i, '$1@@@').split('@@@'),
        _line$trim$replace$sp2 = _slicedToArray(_line$trim$replace$sp, 2),
        name = _line$trim$replace$sp2[0],
        value = _line$trim$replace$sp2[1];

    name = name.trim();
    value = value.trim().replace(/;$/, '');
    cssVariables[name] = value;
  });
  return cssVariables;
}

exports.parseCssVariables = parseCssVariables;

function areCssVariablesSupported() {
  // Taken from Modernizr
  var supportsFn = window.CSS && window.CSS.supports.bind(window.CSS) || window.supportsCSS;
  return !!supportsFn && (supportsFn('--f:0') || supportsFn('--f', 0));
}

exports.areCssVariablesSupported = areCssVariablesSupported;
},{}],"J4Nk":[function(require,module,exports) {
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
'use strict';
/* eslint-disable no-unused-vars */

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
  if (val === null || val === undefined) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }

  return Object(val);
}

function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false;
    } // Detect buggy property enumeration order in older V8 versions.
    // https://bugs.chromium.org/p/v8/issues/detail?id=4118


    var test1 = new String('abc'); // eslint-disable-line no-new-wrappers

    test1[5] = 'de';

    if (Object.getOwnPropertyNames(test1)[0] === '5') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test2 = {};

    for (var i = 0; i < 10; i++) {
      test2['_' + String.fromCharCode(i)] = i;
    }

    var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
      return test2[n];
    });

    if (order2.join('') !== '0123456789') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test3 = {};
    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
      test3[letter] = letter;
    });

    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
      return false;
    }

    return true;
  } catch (err) {
    // We don't expect any of the above to throw, but better to be safe.
    return false;
  }
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
  var from;
  var to = toObject(target);
  var symbols;

  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);

    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }

    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from);

      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          to[symbols[i]] = from[symbols[i]];
        }
      }
    }
  }

  return to;
};
},{}],"awqi":[function(require,module,exports) {
/** @license React v16.8.6
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

var k = require("object-assign"),
    n = "function" === typeof Symbol && Symbol.for,
    p = n ? Symbol.for("react.element") : 60103,
    q = n ? Symbol.for("react.portal") : 60106,
    r = n ? Symbol.for("react.fragment") : 60107,
    t = n ? Symbol.for("react.strict_mode") : 60108,
    u = n ? Symbol.for("react.profiler") : 60114,
    v = n ? Symbol.for("react.provider") : 60109,
    w = n ? Symbol.for("react.context") : 60110,
    x = n ? Symbol.for("react.concurrent_mode") : 60111,
    y = n ? Symbol.for("react.forward_ref") : 60112,
    z = n ? Symbol.for("react.suspense") : 60113,
    aa = n ? Symbol.for("react.memo") : 60115,
    ba = n ? Symbol.for("react.lazy") : 60116,
    A = "function" === typeof Symbol && Symbol.iterator;

function ca(a, b, d, c, e, g, h, f) {
  if (!a) {
    a = void 0;
    if (void 0 === b) a = Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else {
      var l = [d, c, e, g, h, f],
          m = 0;
      a = Error(b.replace(/%s/g, function () {
        return l[m++];
      }));
      a.name = "Invariant Violation";
    }
    a.framesToPop = 1;
    throw a;
  }
}

function B(a) {
  for (var b = arguments.length - 1, d = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 0; c < b; c++) d += "&args[]=" + encodeURIComponent(arguments[c + 1]);

  ca(!1, "Minified React error #" + a + "; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ", d);
}

var C = {
  isMounted: function () {
    return !1;
  },
  enqueueForceUpdate: function () {},
  enqueueReplaceState: function () {},
  enqueueSetState: function () {}
},
    D = {};

function E(a, b, d) {
  this.props = a;
  this.context = b;
  this.refs = D;
  this.updater = d || C;
}

E.prototype.isReactComponent = {};

E.prototype.setState = function (a, b) {
  "object" !== typeof a && "function" !== typeof a && null != a ? B("85") : void 0;
  this.updater.enqueueSetState(this, a, b, "setState");
};

E.prototype.forceUpdate = function (a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};

function F() {}

F.prototype = E.prototype;

function G(a, b, d) {
  this.props = a;
  this.context = b;
  this.refs = D;
  this.updater = d || C;
}

var H = G.prototype = new F();
H.constructor = G;
k(H, E.prototype);
H.isPureReactComponent = !0;
var I = {
  current: null
},
    J = {
  current: null
},
    K = Object.prototype.hasOwnProperty,
    L = {
  key: !0,
  ref: !0,
  __self: !0,
  __source: !0
};

function M(a, b, d) {
  var c = void 0,
      e = {},
      g = null,
      h = null;
  if (null != b) for (c in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (g = "" + b.key), b) K.call(b, c) && !L.hasOwnProperty(c) && (e[c] = b[c]);
  var f = arguments.length - 2;
  if (1 === f) e.children = d;else if (1 < f) {
    for (var l = Array(f), m = 0; m < f; m++) l[m] = arguments[m + 2];

    e.children = l;
  }
  if (a && a.defaultProps) for (c in f = a.defaultProps, f) void 0 === e[c] && (e[c] = f[c]);
  return {
    $$typeof: p,
    type: a,
    key: g,
    ref: h,
    props: e,
    _owner: J.current
  };
}

function da(a, b) {
  return {
    $$typeof: p,
    type: a.type,
    key: b,
    ref: a.ref,
    props: a.props,
    _owner: a._owner
  };
}

function N(a) {
  return "object" === typeof a && null !== a && a.$$typeof === p;
}

function escape(a) {
  var b = {
    "=": "=0",
    ":": "=2"
  };
  return "$" + ("" + a).replace(/[=:]/g, function (a) {
    return b[a];
  });
}

var O = /\/+/g,
    P = [];

function Q(a, b, d, c) {
  if (P.length) {
    var e = P.pop();
    e.result = a;
    e.keyPrefix = b;
    e.func = d;
    e.context = c;
    e.count = 0;
    return e;
  }

  return {
    result: a,
    keyPrefix: b,
    func: d,
    context: c,
    count: 0
  };
}

function R(a) {
  a.result = null;
  a.keyPrefix = null;
  a.func = null;
  a.context = null;
  a.count = 0;
  10 > P.length && P.push(a);
}

function S(a, b, d, c) {
  var e = typeof a;
  if ("undefined" === e || "boolean" === e) a = null;
  var g = !1;
  if (null === a) g = !0;else switch (e) {
    case "string":
    case "number":
      g = !0;
      break;

    case "object":
      switch (a.$$typeof) {
        case p:
        case q:
          g = !0;
      }

  }
  if (g) return d(c, a, "" === b ? "." + T(a, 0) : b), 1;
  g = 0;
  b = "" === b ? "." : b + ":";
  if (Array.isArray(a)) for (var h = 0; h < a.length; h++) {
    e = a[h];
    var f = b + T(e, h);
    g += S(e, f, d, c);
  } else if (null === a || "object" !== typeof a ? f = null : (f = A && a[A] || a["@@iterator"], f = "function" === typeof f ? f : null), "function" === typeof f) for (a = f.call(a), h = 0; !(e = a.next()).done;) e = e.value, f = b + T(e, h++), g += S(e, f, d, c);else "object" === e && (d = "" + a, B("31", "[object Object]" === d ? "object with keys {" + Object.keys(a).join(", ") + "}" : d, ""));
  return g;
}

function U(a, b, d) {
  return null == a ? 0 : S(a, "", b, d);
}

function T(a, b) {
  return "object" === typeof a && null !== a && null != a.key ? escape(a.key) : b.toString(36);
}

function ea(a, b) {
  a.func.call(a.context, b, a.count++);
}

function fa(a, b, d) {
  var c = a.result,
      e = a.keyPrefix;
  a = a.func.call(a.context, b, a.count++);
  Array.isArray(a) ? V(a, c, d, function (a) {
    return a;
  }) : null != a && (N(a) && (a = da(a, e + (!a.key || b && b.key === a.key ? "" : ("" + a.key).replace(O, "$&/") + "/") + d)), c.push(a));
}

function V(a, b, d, c, e) {
  var g = "";
  null != d && (g = ("" + d).replace(O, "$&/") + "/");
  b = Q(b, g, c, e);
  U(a, fa, b);
  R(b);
}

function W() {
  var a = I.current;
  null === a ? B("321") : void 0;
  return a;
}

var X = {
  Children: {
    map: function (a, b, d) {
      if (null == a) return a;
      var c = [];
      V(a, c, null, b, d);
      return c;
    },
    forEach: function (a, b, d) {
      if (null == a) return a;
      b = Q(null, null, b, d);
      U(a, ea, b);
      R(b);
    },
    count: function (a) {
      return U(a, function () {
        return null;
      }, null);
    },
    toArray: function (a) {
      var b = [];
      V(a, b, null, function (a) {
        return a;
      });
      return b;
    },
    only: function (a) {
      N(a) ? void 0 : B("143");
      return a;
    }
  },
  createRef: function () {
    return {
      current: null
    };
  },
  Component: E,
  PureComponent: G,
  createContext: function (a, b) {
    void 0 === b && (b = null);
    a = {
      $$typeof: w,
      _calculateChangedBits: b,
      _currentValue: a,
      _currentValue2: a,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    };
    a.Provider = {
      $$typeof: v,
      _context: a
    };
    return a.Consumer = a;
  },
  forwardRef: function (a) {
    return {
      $$typeof: y,
      render: a
    };
  },
  lazy: function (a) {
    return {
      $$typeof: ba,
      _ctor: a,
      _status: -1,
      _result: null
    };
  },
  memo: function (a, b) {
    return {
      $$typeof: aa,
      type: a,
      compare: void 0 === b ? null : b
    };
  },
  useCallback: function (a, b) {
    return W().useCallback(a, b);
  },
  useContext: function (a, b) {
    return W().useContext(a, b);
  },
  useEffect: function (a, b) {
    return W().useEffect(a, b);
  },
  useImperativeHandle: function (a, b, d) {
    return W().useImperativeHandle(a, b, d);
  },
  useDebugValue: function () {},
  useLayoutEffect: function (a, b) {
    return W().useLayoutEffect(a, b);
  },
  useMemo: function (a, b) {
    return W().useMemo(a, b);
  },
  useReducer: function (a, b, d) {
    return W().useReducer(a, b, d);
  },
  useRef: function (a) {
    return W().useRef(a);
  },
  useState: function (a) {
    return W().useState(a);
  },
  Fragment: r,
  StrictMode: t,
  Suspense: z,
  createElement: M,
  cloneElement: function (a, b, d) {
    null === a || void 0 === a ? B("267", a) : void 0;
    var c = void 0,
        e = k({}, a.props),
        g = a.key,
        h = a.ref,
        f = a._owner;

    if (null != b) {
      void 0 !== b.ref && (h = b.ref, f = J.current);
      void 0 !== b.key && (g = "" + b.key);
      var l = void 0;
      a.type && a.type.defaultProps && (l = a.type.defaultProps);

      for (c in b) K.call(b, c) && !L.hasOwnProperty(c) && (e[c] = void 0 === b[c] && void 0 !== l ? l[c] : b[c]);
    }

    c = arguments.length - 2;
    if (1 === c) e.children = d;else if (1 < c) {
      l = Array(c);

      for (var m = 0; m < c; m++) l[m] = arguments[m + 2];

      e.children = l;
    }
    return {
      $$typeof: p,
      type: a.type,
      key: g,
      ref: h,
      props: e,
      _owner: f
    };
  },
  createFactory: function (a) {
    var b = M.bind(null, a);
    b.type = a;
    return b;
  },
  isValidElement: N,
  version: "16.8.6",
  unstable_ConcurrentMode: x,
  unstable_Profiler: u,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
    ReactCurrentDispatcher: I,
    ReactCurrentOwner: J,
    assign: k
  }
},
    Y = {
  default: X
},
    Z = Y && X || Y;
module.exports = Z.default || Z;
},{"object-assign":"J4Nk"}],"1n8/":[function(require,module,exports) {
'use strict';

if ("production" === 'production') {
  module.exports = require('./cjs/react.production.min.js');
} else {
  module.exports = require('./cjs/react.development.js');
}
},{"./cjs/react.production.min.js":"awqi"}],"5IvP":[function(require,module,exports) {
var global = arguments[3];
/** @license React v0.13.6
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';Object.defineProperty(exports,"__esModule",{value:!0});var d=null,e=!1,g=3,k=-1,l=-1,m=!1,n=!1;function p(){if(!m){var a=d.expirationTime;n?q():n=!0;r(t,a)}}
function u(){var a=d,b=d.next;if(d===b)d=null;else{var c=d.previous;d=c.next=b;b.previous=c}a.next=a.previous=null;c=a.callback;b=a.expirationTime;a=a.priorityLevel;var f=g,Q=l;g=a;l=b;try{var h=c()}finally{g=f,l=Q}if("function"===typeof h)if(h={callback:h,priorityLevel:a,expirationTime:b,next:null,previous:null},null===d)d=h.next=h.previous=h;else{c=null;a=d;do{if(a.expirationTime>=b){c=a;break}a=a.next}while(a!==d);null===c?c=d:c===d&&(d=h,p());b=c.previous;b.next=c.previous=h;h.next=c;h.previous=
b}}function v(){if(-1===k&&null!==d&&1===d.priorityLevel){m=!0;try{do u();while(null!==d&&1===d.priorityLevel)}finally{m=!1,null!==d?p():n=!1}}}function t(a){m=!0;var b=e;e=a;try{if(a)for(;null!==d;){var c=exports.unstable_now();if(d.expirationTime<=c){do u();while(null!==d&&d.expirationTime<=c)}else break}else if(null!==d){do u();while(null!==d&&!w())}}finally{m=!1,e=b,null!==d?p():n=!1,v()}}
var x=Date,y="function"===typeof setTimeout?setTimeout:void 0,z="function"===typeof clearTimeout?clearTimeout:void 0,A="function"===typeof requestAnimationFrame?requestAnimationFrame:void 0,B="function"===typeof cancelAnimationFrame?cancelAnimationFrame:void 0,C,D;function E(a){C=A(function(b){z(D);a(b)});D=y(function(){B(C);a(exports.unstable_now())},100)}
if("object"===typeof performance&&"function"===typeof performance.now){var F=performance;exports.unstable_now=function(){return F.now()}}else exports.unstable_now=function(){return x.now()};var r,q,w,G=null;"undefined"!==typeof window?G=window:"undefined"!==typeof global&&(G=global);
if(G&&G._schedMock){var H=G._schedMock;r=H[0];q=H[1];w=H[2];exports.unstable_now=H[3]}else if("undefined"===typeof window||"function"!==typeof MessageChannel){var I=null,J=function(a){if(null!==I)try{I(a)}finally{I=null}};r=function(a){null!==I?setTimeout(r,0,a):(I=a,setTimeout(J,0,!1))};q=function(){I=null};w=function(){return!1}}else{"undefined"!==typeof console&&("function"!==typeof A&&console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"),
"function"!==typeof B&&console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"));var K=null,L=!1,M=-1,N=!1,O=!1,P=0,R=33,S=33;w=function(){return P<=exports.unstable_now()};var T=new MessageChannel,U=T.port2;T.port1.onmessage=function(){L=!1;var a=K,b=M;K=null;M=-1;var c=exports.unstable_now(),f=!1;if(0>=P-c)if(-1!==b&&b<=c)f=!0;else{N||(N=!0,E(V));K=a;M=b;return}if(null!==a){O=!0;try{a(f)}finally{O=!1}}};
var V=function(a){if(null!==K){E(V);var b=a-P+S;b<S&&R<S?(8>b&&(b=8),S=b<R?R:b):R=b;P=a+S;L||(L=!0,U.postMessage(void 0))}else N=!1};r=function(a,b){K=a;M=b;O||0>b?U.postMessage(void 0):N||(N=!0,E(V))};q=function(){K=null;L=!1;M=-1}}exports.unstable_ImmediatePriority=1;exports.unstable_UserBlockingPriority=2;exports.unstable_NormalPriority=3;exports.unstable_IdlePriority=5;exports.unstable_LowPriority=4;
exports.unstable_runWithPriority=function(a,b){switch(a){case 1:case 2:case 3:case 4:case 5:break;default:a=3}var c=g,f=k;g=a;k=exports.unstable_now();try{return b()}finally{g=c,k=f,v()}};exports.unstable_next=function(a){switch(g){case 1:case 2:case 3:var b=3;break;default:b=g}var c=g,f=k;g=b;k=exports.unstable_now();try{return a()}finally{g=c,k=f,v()}};
exports.unstable_scheduleCallback=function(a,b){var c=-1!==k?k:exports.unstable_now();if("object"===typeof b&&null!==b&&"number"===typeof b.timeout)b=c+b.timeout;else switch(g){case 1:b=c+-1;break;case 2:b=c+250;break;case 5:b=c+1073741823;break;case 4:b=c+1E4;break;default:b=c+5E3}a={callback:a,priorityLevel:g,expirationTime:b,next:null,previous:null};if(null===d)d=a.next=a.previous=a,p();else{c=null;var f=d;do{if(f.expirationTime>b){c=f;break}f=f.next}while(f!==d);null===c?c=d:c===d&&(d=a,p());
b=c.previous;b.next=c.previous=a;a.next=c;a.previous=b}return a};exports.unstable_cancelCallback=function(a){var b=a.next;if(null!==b){if(b===a)d=null;else{a===d&&(d=b);var c=a.previous;c.next=b;b.previous=c}a.next=a.previous=null}};exports.unstable_wrapCallback=function(a){var b=g;return function(){var c=g,f=k;g=b;k=exports.unstable_now();try{return a.apply(this,arguments)}finally{g=c,k=f,v()}}};exports.unstable_getCurrentPriorityLevel=function(){return g};
exports.unstable_shouldYield=function(){return!e&&(null!==d&&d.expirationTime<l||w())};exports.unstable_continueExecution=function(){null!==d&&p()};exports.unstable_pauseExecution=function(){};exports.unstable_getFirstCallbackNode=function(){return d};

},{}],"MDSO":[function(require,module,exports) {
'use strict';

if ("production" === 'production') {
  module.exports = require('./cjs/scheduler.production.min.js');
} else {
  module.exports = require('./cjs/scheduler.development.js');
}
},{"./cjs/scheduler.production.min.js":"5IvP"}],"i17t":[function(require,module,exports) {
/** @license React v16.8.6
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 Modernizr 3.0.0pre (Custom Build) | MIT
*/
'use strict';var aa=require("react"),n=require("object-assign"),r=require("scheduler");function ba(a,b,c,d,e,f,g,h){if(!a){a=void 0;if(void 0===b)a=Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var l=[c,d,e,f,g,h],k=0;a=Error(b.replace(/%s/g,function(){return l[k++]}));a.name="Invariant Violation"}a.framesToPop=1;throw a;}}
function x(a){for(var b=arguments.length-1,c="https://reactjs.org/docs/error-decoder.html?invariant="+a,d=0;d<b;d++)c+="&args[]="+encodeURIComponent(arguments[d+1]);ba(!1,"Minified React error #"+a+"; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ",c)}aa?void 0:x("227");function ca(a,b,c,d,e,f,g,h,l){var k=Array.prototype.slice.call(arguments,3);try{b.apply(c,k)}catch(m){this.onError(m)}}
var da=!1,ea=null,fa=!1,ha=null,ia={onError:function(a){da=!0;ea=a}};function ja(a,b,c,d,e,f,g,h,l){da=!1;ea=null;ca.apply(ia,arguments)}function ka(a,b,c,d,e,f,g,h,l){ja.apply(this,arguments);if(da){if(da){var k=ea;da=!1;ea=null}else x("198"),k=void 0;fa||(fa=!0,ha=k)}}var la=null,ma={};
function na(){if(la)for(var a in ma){var b=ma[a],c=la.indexOf(a);-1<c?void 0:x("96",a);if(!oa[c]){b.extractEvents?void 0:x("97",a);oa[c]=b;c=b.eventTypes;for(var d in c){var e=void 0;var f=c[d],g=b,h=d;pa.hasOwnProperty(h)?x("99",h):void 0;pa[h]=f;var l=f.phasedRegistrationNames;if(l){for(e in l)l.hasOwnProperty(e)&&qa(l[e],g,h);e=!0}else f.registrationName?(qa(f.registrationName,g,h),e=!0):e=!1;e?void 0:x("98",d,a)}}}}
function qa(a,b,c){ra[a]?x("100",a):void 0;ra[a]=b;sa[a]=b.eventTypes[c].dependencies}var oa=[],pa={},ra={},sa={},ta=null,ua=null,va=null;function wa(a,b,c){var d=a.type||"unknown-event";a.currentTarget=va(c);ka(d,b,void 0,a);a.currentTarget=null}function xa(a,b){null==b?x("30"):void 0;if(null==a)return b;if(Array.isArray(a)){if(Array.isArray(b))return a.push.apply(a,b),a;a.push(b);return a}return Array.isArray(b)?[a].concat(b):[a,b]}
function ya(a,b,c){Array.isArray(a)?a.forEach(b,c):a&&b.call(c,a)}var za=null;function Aa(a){if(a){var b=a._dispatchListeners,c=a._dispatchInstances;if(Array.isArray(b))for(var d=0;d<b.length&&!a.isPropagationStopped();d++)wa(a,b[d],c[d]);else b&&wa(a,b,c);a._dispatchListeners=null;a._dispatchInstances=null;a.isPersistent()||a.constructor.release(a)}}
var Ba={injectEventPluginOrder:function(a){la?x("101"):void 0;la=Array.prototype.slice.call(a);na()},injectEventPluginsByName:function(a){var b=!1,c;for(c in a)if(a.hasOwnProperty(c)){var d=a[c];ma.hasOwnProperty(c)&&ma[c]===d||(ma[c]?x("102",c):void 0,ma[c]=d,b=!0)}b&&na()}};
function Ca(a,b){var c=a.stateNode;if(!c)return null;var d=ta(c);if(!d)return null;c=d[b];a:switch(b){case "onClick":case "onClickCapture":case "onDoubleClick":case "onDoubleClickCapture":case "onMouseDown":case "onMouseDownCapture":case "onMouseMove":case "onMouseMoveCapture":case "onMouseUp":case "onMouseUpCapture":(d=!d.disabled)||(a=a.type,d=!("button"===a||"input"===a||"select"===a||"textarea"===a));a=!d;break a;default:a=!1}if(a)return null;c&&"function"!==typeof c?x("231",b,typeof c):void 0;
return c}function Da(a){null!==a&&(za=xa(za,a));a=za;za=null;if(a&&(ya(a,Aa),za?x("95"):void 0,fa))throw a=ha,fa=!1,ha=null,a;}var Ea=Math.random().toString(36).slice(2),Fa="__reactInternalInstance$"+Ea,Ga="__reactEventHandlers$"+Ea;function Ha(a){if(a[Fa])return a[Fa];for(;!a[Fa];)if(a.parentNode)a=a.parentNode;else return null;a=a[Fa];return 5===a.tag||6===a.tag?a:null}function Ia(a){a=a[Fa];return!a||5!==a.tag&&6!==a.tag?null:a}
function Ja(a){if(5===a.tag||6===a.tag)return a.stateNode;x("33")}function Ka(a){return a[Ga]||null}function La(a){do a=a.return;while(a&&5!==a.tag);return a?a:null}function Ma(a,b,c){if(b=Ca(a,c.dispatchConfig.phasedRegistrationNames[b]))c._dispatchListeners=xa(c._dispatchListeners,b),c._dispatchInstances=xa(c._dispatchInstances,a)}
function Na(a){if(a&&a.dispatchConfig.phasedRegistrationNames){for(var b=a._targetInst,c=[];b;)c.push(b),b=La(b);for(b=c.length;0<b--;)Ma(c[b],"captured",a);for(b=0;b<c.length;b++)Ma(c[b],"bubbled",a)}}function Oa(a,b,c){a&&c&&c.dispatchConfig.registrationName&&(b=Ca(a,c.dispatchConfig.registrationName))&&(c._dispatchListeners=xa(c._dispatchListeners,b),c._dispatchInstances=xa(c._dispatchInstances,a))}function Pa(a){a&&a.dispatchConfig.registrationName&&Oa(a._targetInst,null,a)}
function Qa(a){ya(a,Na)}var Ra=!("undefined"===typeof window||!window.document||!window.document.createElement);function Sa(a,b){var c={};c[a.toLowerCase()]=b.toLowerCase();c["Webkit"+a]="webkit"+b;c["Moz"+a]="moz"+b;return c}var Ta={animationend:Sa("Animation","AnimationEnd"),animationiteration:Sa("Animation","AnimationIteration"),animationstart:Sa("Animation","AnimationStart"),transitionend:Sa("Transition","TransitionEnd")},Ua={},Va={};
Ra&&(Va=document.createElement("div").style,"AnimationEvent"in window||(delete Ta.animationend.animation,delete Ta.animationiteration.animation,delete Ta.animationstart.animation),"TransitionEvent"in window||delete Ta.transitionend.transition);function Wa(a){if(Ua[a])return Ua[a];if(!Ta[a])return a;var b=Ta[a],c;for(c in b)if(b.hasOwnProperty(c)&&c in Va)return Ua[a]=b[c];return a}
var Xa=Wa("animationend"),Ya=Wa("animationiteration"),Za=Wa("animationstart"),$a=Wa("transitionend"),ab="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),bb=null,cb=null,db=null;
function eb(){if(db)return db;var a,b=cb,c=b.length,d,e="value"in bb?bb.value:bb.textContent,f=e.length;for(a=0;a<c&&b[a]===e[a];a++);var g=c-a;for(d=1;d<=g&&b[c-d]===e[f-d];d++);return db=e.slice(a,1<d?1-d:void 0)}function fb(){return!0}function gb(){return!1}
function y(a,b,c,d){this.dispatchConfig=a;this._targetInst=b;this.nativeEvent=c;a=this.constructor.Interface;for(var e in a)a.hasOwnProperty(e)&&((b=a[e])?this[e]=b(c):"target"===e?this.target=d:this[e]=c[e]);this.isDefaultPrevented=(null!=c.defaultPrevented?c.defaultPrevented:!1===c.returnValue)?fb:gb;this.isPropagationStopped=gb;return this}
n(y.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():"unknown"!==typeof a.returnValue&&(a.returnValue=!1),this.isDefaultPrevented=fb)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():"unknown"!==typeof a.cancelBubble&&(a.cancelBubble=!0),this.isPropagationStopped=fb)},persist:function(){this.isPersistent=fb},isPersistent:gb,destructor:function(){var a=this.constructor.Interface,
b;for(b in a)this[b]=null;this.nativeEvent=this._targetInst=this.dispatchConfig=null;this.isPropagationStopped=this.isDefaultPrevented=gb;this._dispatchInstances=this._dispatchListeners=null}});y.Interface={type:null,target:null,currentTarget:function(){return null},eventPhase:null,bubbles:null,cancelable:null,timeStamp:function(a){return a.timeStamp||Date.now()},defaultPrevented:null,isTrusted:null};
y.extend=function(a){function b(){}function c(){return d.apply(this,arguments)}var d=this;b.prototype=d.prototype;var e=new b;n(e,c.prototype);c.prototype=e;c.prototype.constructor=c;c.Interface=n({},d.Interface,a);c.extend=d.extend;hb(c);return c};hb(y);function ib(a,b,c,d){if(this.eventPool.length){var e=this.eventPool.pop();this.call(e,a,b,c,d);return e}return new this(a,b,c,d)}function jb(a){a instanceof this?void 0:x("279");a.destructor();10>this.eventPool.length&&this.eventPool.push(a)}
function hb(a){a.eventPool=[];a.getPooled=ib;a.release=jb}var kb=y.extend({data:null}),lb=y.extend({data:null}),mb=[9,13,27,32],nb=Ra&&"CompositionEvent"in window,ob=null;Ra&&"documentMode"in document&&(ob=document.documentMode);
var pb=Ra&&"TextEvent"in window&&!ob,qb=Ra&&(!nb||ob&&8<ob&&11>=ob),rb=String.fromCharCode(32),sb={beforeInput:{phasedRegistrationNames:{bubbled:"onBeforeInput",captured:"onBeforeInputCapture"},dependencies:["compositionend","keypress","textInput","paste"]},compositionEnd:{phasedRegistrationNames:{bubbled:"onCompositionEnd",captured:"onCompositionEndCapture"},dependencies:"blur compositionend keydown keypress keyup mousedown".split(" ")},compositionStart:{phasedRegistrationNames:{bubbled:"onCompositionStart",
captured:"onCompositionStartCapture"},dependencies:"blur compositionstart keydown keypress keyup mousedown".split(" ")},compositionUpdate:{phasedRegistrationNames:{bubbled:"onCompositionUpdate",captured:"onCompositionUpdateCapture"},dependencies:"blur compositionupdate keydown keypress keyup mousedown".split(" ")}},tb=!1;
function ub(a,b){switch(a){case "keyup":return-1!==mb.indexOf(b.keyCode);case "keydown":return 229!==b.keyCode;case "keypress":case "mousedown":case "blur":return!0;default:return!1}}function vb(a){a=a.detail;return"object"===typeof a&&"data"in a?a.data:null}var wb=!1;function xb(a,b){switch(a){case "compositionend":return vb(b);case "keypress":if(32!==b.which)return null;tb=!0;return rb;case "textInput":return a=b.data,a===rb&&tb?null:a;default:return null}}
function yb(a,b){if(wb)return"compositionend"===a||!nb&&ub(a,b)?(a=eb(),db=cb=bb=null,wb=!1,a):null;switch(a){case "paste":return null;case "keypress":if(!(b.ctrlKey||b.altKey||b.metaKey)||b.ctrlKey&&b.altKey){if(b.char&&1<b.char.length)return b.char;if(b.which)return String.fromCharCode(b.which)}return null;case "compositionend":return qb&&"ko"!==b.locale?null:b.data;default:return null}}
var zb={eventTypes:sb,extractEvents:function(a,b,c,d){var e=void 0;var f=void 0;if(nb)b:{switch(a){case "compositionstart":e=sb.compositionStart;break b;case "compositionend":e=sb.compositionEnd;break b;case "compositionupdate":e=sb.compositionUpdate;break b}e=void 0}else wb?ub(a,c)&&(e=sb.compositionEnd):"keydown"===a&&229===c.keyCode&&(e=sb.compositionStart);e?(qb&&"ko"!==c.locale&&(wb||e!==sb.compositionStart?e===sb.compositionEnd&&wb&&(f=eb()):(bb=d,cb="value"in bb?bb.value:bb.textContent,wb=
!0)),e=kb.getPooled(e,b,c,d),f?e.data=f:(f=vb(c),null!==f&&(e.data=f)),Qa(e),f=e):f=null;(a=pb?xb(a,c):yb(a,c))?(b=lb.getPooled(sb.beforeInput,b,c,d),b.data=a,Qa(b)):b=null;return null===f?b:null===b?f:[f,b]}},Ab=null,Bb=null,Cb=null;function Db(a){if(a=ua(a)){"function"!==typeof Ab?x("280"):void 0;var b=ta(a.stateNode);Ab(a.stateNode,a.type,b)}}function Eb(a){Bb?Cb?Cb.push(a):Cb=[a]:Bb=a}function Fb(){if(Bb){var a=Bb,b=Cb;Cb=Bb=null;Db(a);if(b)for(a=0;a<b.length;a++)Db(b[a])}}
function Gb(a,b){return a(b)}function Hb(a,b,c){return a(b,c)}function Ib(){}var Jb=!1;function Kb(a,b){if(Jb)return a(b);Jb=!0;try{return Gb(a,b)}finally{if(Jb=!1,null!==Bb||null!==Cb)Ib(),Fb()}}var Lb={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Mb(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return"input"===b?!!Lb[a.type]:"textarea"===b?!0:!1}
function Nb(a){a=a.target||a.srcElement||window;a.correspondingUseElement&&(a=a.correspondingUseElement);return 3===a.nodeType?a.parentNode:a}function Ob(a){if(!Ra)return!1;a="on"+a;var b=a in document;b||(b=document.createElement("div"),b.setAttribute(a,"return;"),b="function"===typeof b[a]);return b}function Pb(a){var b=a.type;return(a=a.nodeName)&&"input"===a.toLowerCase()&&("checkbox"===b||"radio"===b)}
function Qb(a){var b=Pb(a)?"checked":"value",c=Object.getOwnPropertyDescriptor(a.constructor.prototype,b),d=""+a[b];if(!a.hasOwnProperty(b)&&"undefined"!==typeof c&&"function"===typeof c.get&&"function"===typeof c.set){var e=c.get,f=c.set;Object.defineProperty(a,b,{configurable:!0,get:function(){return e.call(this)},set:function(a){d=""+a;f.call(this,a)}});Object.defineProperty(a,b,{enumerable:c.enumerable});return{getValue:function(){return d},setValue:function(a){d=""+a},stopTracking:function(){a._valueTracker=
null;delete a[b]}}}}function Rb(a){a._valueTracker||(a._valueTracker=Qb(a))}function Sb(a){if(!a)return!1;var b=a._valueTracker;if(!b)return!0;var c=b.getValue();var d="";a&&(d=Pb(a)?a.checked?"true":"false":a.value);a=d;return a!==c?(b.setValue(a),!0):!1}var Tb=aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;Tb.hasOwnProperty("ReactCurrentDispatcher")||(Tb.ReactCurrentDispatcher={current:null});
var Ub=/^(.*)[\\\/]/,z="function"===typeof Symbol&&Symbol.for,Vb=z?Symbol.for("react.element"):60103,Wb=z?Symbol.for("react.portal"):60106,Xb=z?Symbol.for("react.fragment"):60107,Yb=z?Symbol.for("react.strict_mode"):60108,Zb=z?Symbol.for("react.profiler"):60114,$b=z?Symbol.for("react.provider"):60109,ac=z?Symbol.for("react.context"):60110,bc=z?Symbol.for("react.concurrent_mode"):60111,cc=z?Symbol.for("react.forward_ref"):60112,dc=z?Symbol.for("react.suspense"):60113,ec=z?Symbol.for("react.memo"):
60115,fc=z?Symbol.for("react.lazy"):60116,gc="function"===typeof Symbol&&Symbol.iterator;function hc(a){if(null===a||"object"!==typeof a)return null;a=gc&&a[gc]||a["@@iterator"];return"function"===typeof a?a:null}
function ic(a){if(null==a)return null;if("function"===typeof a)return a.displayName||a.name||null;if("string"===typeof a)return a;switch(a){case bc:return"ConcurrentMode";case Xb:return"Fragment";case Wb:return"Portal";case Zb:return"Profiler";case Yb:return"StrictMode";case dc:return"Suspense"}if("object"===typeof a)switch(a.$$typeof){case ac:return"Context.Consumer";case $b:return"Context.Provider";case cc:var b=a.render;b=b.displayName||b.name||"";return a.displayName||(""!==b?"ForwardRef("+b+
")":"ForwardRef");case ec:return ic(a.type);case fc:if(a=1===a._status?a._result:null)return ic(a)}return null}function jc(a){var b="";do{a:switch(a.tag){case 3:case 4:case 6:case 7:case 10:case 9:var c="";break a;default:var d=a._debugOwner,e=a._debugSource,f=ic(a.type);c=null;d&&(c=ic(d.type));d=f;f="";e?f=" (at "+e.fileName.replace(Ub,"")+":"+e.lineNumber+")":c&&(f=" (created by "+c+")");c="\n    in "+(d||"Unknown")+f}b+=c;a=a.return}while(a);return b}
var kc=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,lc=Object.prototype.hasOwnProperty,mc={},nc={};
function oc(a){if(lc.call(nc,a))return!0;if(lc.call(mc,a))return!1;if(kc.test(a))return nc[a]=!0;mc[a]=!0;return!1}function pc(a,b,c,d){if(null!==c&&0===c.type)return!1;switch(typeof b){case "function":case "symbol":return!0;case "boolean":if(d)return!1;if(null!==c)return!c.acceptsBooleans;a=a.toLowerCase().slice(0,5);return"data-"!==a&&"aria-"!==a;default:return!1}}
function qc(a,b,c,d){if(null===b||"undefined"===typeof b||pc(a,b,c,d))return!0;if(d)return!1;if(null!==c)switch(c.type){case 3:return!b;case 4:return!1===b;case 5:return isNaN(b);case 6:return isNaN(b)||1>b}return!1}function C(a,b,c,d,e){this.acceptsBooleans=2===b||3===b||4===b;this.attributeName=d;this.attributeNamespace=e;this.mustUseProperty=c;this.propertyName=a;this.type=b}var D={};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a){D[a]=new C(a,0,!1,a,null)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(a){var b=a[0];D[b]=new C(b,1,!1,a[1],null)});["contentEditable","draggable","spellCheck","value"].forEach(function(a){D[a]=new C(a,2,!1,a.toLowerCase(),null)});
["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(a){D[a]=new C(a,2,!1,a,null)});"allowFullScreen async autoFocus autoPlay controls default defer disabled formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a){D[a]=new C(a,3,!1,a.toLowerCase(),null)});["checked","multiple","muted","selected"].forEach(function(a){D[a]=new C(a,3,!0,a,null)});
["capture","download"].forEach(function(a){D[a]=new C(a,4,!1,a,null)});["cols","rows","size","span"].forEach(function(a){D[a]=new C(a,6,!1,a,null)});["rowSpan","start"].forEach(function(a){D[a]=new C(a,5,!1,a.toLowerCase(),null)});var rc=/[\-:]([a-z])/g;function sc(a){return a[1].toUpperCase()}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a){var b=a.replace(rc,
sc);D[b]=new C(b,1,!1,a,null)});"xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a){var b=a.replace(rc,sc);D[b]=new C(b,1,!1,a,"http://www.w3.org/1999/xlink")});["xml:base","xml:lang","xml:space"].forEach(function(a){var b=a.replace(rc,sc);D[b]=new C(b,1,!1,a,"http://www.w3.org/XML/1998/namespace")});["tabIndex","crossOrigin"].forEach(function(a){D[a]=new C(a,1,!1,a.toLowerCase(),null)});
function tc(a,b,c,d){var e=D.hasOwnProperty(b)?D[b]:null;var f=null!==e?0===e.type:d?!1:!(2<b.length)||"o"!==b[0]&&"O"!==b[0]||"n"!==b[1]&&"N"!==b[1]?!1:!0;f||(qc(b,c,e,d)&&(c=null),d||null===e?oc(b)&&(null===c?a.removeAttribute(b):a.setAttribute(b,""+c)):e.mustUseProperty?a[e.propertyName]=null===c?3===e.type?!1:"":c:(b=e.attributeName,d=e.attributeNamespace,null===c?a.removeAttribute(b):(e=e.type,c=3===e||4===e&&!0===c?"":""+c,d?a.setAttributeNS(d,b,c):a.setAttribute(b,c))))}
function uc(a){switch(typeof a){case "boolean":case "number":case "object":case "string":case "undefined":return a;default:return""}}function vc(a,b){var c=b.checked;return n({},b,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=c?c:a._wrapperState.initialChecked})}
function wc(a,b){var c=null==b.defaultValue?"":b.defaultValue,d=null!=b.checked?b.checked:b.defaultChecked;c=uc(null!=b.value?b.value:c);a._wrapperState={initialChecked:d,initialValue:c,controlled:"checkbox"===b.type||"radio"===b.type?null!=b.checked:null!=b.value}}function xc(a,b){b=b.checked;null!=b&&tc(a,"checked",b,!1)}
function yc(a,b){xc(a,b);var c=uc(b.value),d=b.type;if(null!=c)if("number"===d){if(0===c&&""===a.value||a.value!=c)a.value=""+c}else a.value!==""+c&&(a.value=""+c);else if("submit"===d||"reset"===d){a.removeAttribute("value");return}b.hasOwnProperty("value")?zc(a,b.type,c):b.hasOwnProperty("defaultValue")&&zc(a,b.type,uc(b.defaultValue));null==b.checked&&null!=b.defaultChecked&&(a.defaultChecked=!!b.defaultChecked)}
function Ac(a,b,c){if(b.hasOwnProperty("value")||b.hasOwnProperty("defaultValue")){var d=b.type;if(!("submit"!==d&&"reset"!==d||void 0!==b.value&&null!==b.value))return;b=""+a._wrapperState.initialValue;c||b===a.value||(a.value=b);a.defaultValue=b}c=a.name;""!==c&&(a.name="");a.defaultChecked=!a.defaultChecked;a.defaultChecked=!!a._wrapperState.initialChecked;""!==c&&(a.name=c)}
function zc(a,b,c){if("number"!==b||a.ownerDocument.activeElement!==a)null==c?a.defaultValue=""+a._wrapperState.initialValue:a.defaultValue!==""+c&&(a.defaultValue=""+c)}var Bc={change:{phasedRegistrationNames:{bubbled:"onChange",captured:"onChangeCapture"},dependencies:"blur change click focus input keydown keyup selectionchange".split(" ")}};function Cc(a,b,c){a=y.getPooled(Bc.change,a,b,c);a.type="change";Eb(c);Qa(a);return a}var Dc=null,Ec=null;function Fc(a){Da(a)}
function Gc(a){var b=Ja(a);if(Sb(b))return a}function Hc(a,b){if("change"===a)return b}var Ic=!1;Ra&&(Ic=Ob("input")&&(!document.documentMode||9<document.documentMode));function Jc(){Dc&&(Dc.detachEvent("onpropertychange",Kc),Ec=Dc=null)}function Kc(a){"value"===a.propertyName&&Gc(Ec)&&(a=Cc(Ec,a,Nb(a)),Kb(Fc,a))}function Lc(a,b,c){"focus"===a?(Jc(),Dc=b,Ec=c,Dc.attachEvent("onpropertychange",Kc)):"blur"===a&&Jc()}function Mc(a){if("selectionchange"===a||"keyup"===a||"keydown"===a)return Gc(Ec)}
function Nc(a,b){if("click"===a)return Gc(b)}function Oc(a,b){if("input"===a||"change"===a)return Gc(b)}
var Pc={eventTypes:Bc,_isInputEventSupported:Ic,extractEvents:function(a,b,c,d){var e=b?Ja(b):window,f=void 0,g=void 0,h=e.nodeName&&e.nodeName.toLowerCase();"select"===h||"input"===h&&"file"===e.type?f=Hc:Mb(e)?Ic?f=Oc:(f=Mc,g=Lc):(h=e.nodeName)&&"input"===h.toLowerCase()&&("checkbox"===e.type||"radio"===e.type)&&(f=Nc);if(f&&(f=f(a,b)))return Cc(f,c,d);g&&g(a,e,b);"blur"===a&&(a=e._wrapperState)&&a.controlled&&"number"===e.type&&zc(e,"number",e.value)}},Qc=y.extend({view:null,detail:null}),Rc={Alt:"altKey",
Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Sc(a){var b=this.nativeEvent;return b.getModifierState?b.getModifierState(a):(a=Rc[a])?!!b[a]:!1}function Tc(){return Sc}
var Uc=0,Vc=0,Wc=!1,Xc=!1,Yc=Qc.extend({screenX:null,screenY:null,clientX:null,clientY:null,pageX:null,pageY:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,getModifierState:Tc,button:null,buttons:null,relatedTarget:function(a){return a.relatedTarget||(a.fromElement===a.srcElement?a.toElement:a.fromElement)},movementX:function(a){if("movementX"in a)return a.movementX;var b=Uc;Uc=a.screenX;return Wc?"mousemove"===a.type?a.screenX-b:0:(Wc=!0,0)},movementY:function(a){if("movementY"in a)return a.movementY;
var b=Vc;Vc=a.screenY;return Xc?"mousemove"===a.type?a.screenY-b:0:(Xc=!0,0)}}),Zc=Yc.extend({pointerId:null,width:null,height:null,pressure:null,tangentialPressure:null,tiltX:null,tiltY:null,twist:null,pointerType:null,isPrimary:null}),$c={mouseEnter:{registrationName:"onMouseEnter",dependencies:["mouseout","mouseover"]},mouseLeave:{registrationName:"onMouseLeave",dependencies:["mouseout","mouseover"]},pointerEnter:{registrationName:"onPointerEnter",dependencies:["pointerout","pointerover"]},pointerLeave:{registrationName:"onPointerLeave",
dependencies:["pointerout","pointerover"]}},ad={eventTypes:$c,extractEvents:function(a,b,c,d){var e="mouseover"===a||"pointerover"===a,f="mouseout"===a||"pointerout"===a;if(e&&(c.relatedTarget||c.fromElement)||!f&&!e)return null;e=d.window===d?d:(e=d.ownerDocument)?e.defaultView||e.parentWindow:window;f?(f=b,b=(b=c.relatedTarget||c.toElement)?Ha(b):null):f=null;if(f===b)return null;var g=void 0,h=void 0,l=void 0,k=void 0;if("mouseout"===a||"mouseover"===a)g=Yc,h=$c.mouseLeave,l=$c.mouseEnter,k="mouse";
else if("pointerout"===a||"pointerover"===a)g=Zc,h=$c.pointerLeave,l=$c.pointerEnter,k="pointer";var m=null==f?e:Ja(f);e=null==b?e:Ja(b);a=g.getPooled(h,f,c,d);a.type=k+"leave";a.target=m;a.relatedTarget=e;c=g.getPooled(l,b,c,d);c.type=k+"enter";c.target=e;c.relatedTarget=m;d=b;if(f&&d)a:{b=f;e=d;k=0;for(g=b;g;g=La(g))k++;g=0;for(l=e;l;l=La(l))g++;for(;0<k-g;)b=La(b),k--;for(;0<g-k;)e=La(e),g--;for(;k--;){if(b===e||b===e.alternate)break a;b=La(b);e=La(e)}b=null}else b=null;e=b;for(b=[];f&&f!==e;){k=
f.alternate;if(null!==k&&k===e)break;b.push(f);f=La(f)}for(f=[];d&&d!==e;){k=d.alternate;if(null!==k&&k===e)break;f.push(d);d=La(d)}for(d=0;d<b.length;d++)Oa(b[d],"bubbled",a);for(d=f.length;0<d--;)Oa(f[d],"captured",c);return[a,c]}};function bd(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var cd=Object.prototype.hasOwnProperty;
function dd(a,b){if(bd(a,b))return!0;if("object"!==typeof a||null===a||"object"!==typeof b||null===b)return!1;var c=Object.keys(a),d=Object.keys(b);if(c.length!==d.length)return!1;for(d=0;d<c.length;d++)if(!cd.call(b,c[d])||!bd(a[c[d]],b[c[d]]))return!1;return!0}function ed(a){var b=a;if(a.alternate)for(;b.return;)b=b.return;else{if(0!==(b.effectTag&2))return 1;for(;b.return;)if(b=b.return,0!==(b.effectTag&2))return 1}return 3===b.tag?2:3}function fd(a){2!==ed(a)?x("188"):void 0}
function gd(a){var b=a.alternate;if(!b)return b=ed(a),3===b?x("188"):void 0,1===b?null:a;for(var c=a,d=b;;){var e=c.return,f=e?e.alternate:null;if(!e||!f)break;if(e.child===f.child){for(var g=e.child;g;){if(g===c)return fd(e),a;if(g===d)return fd(e),b;g=g.sibling}x("188")}if(c.return!==d.return)c=e,d=f;else{g=!1;for(var h=e.child;h;){if(h===c){g=!0;c=e;d=f;break}if(h===d){g=!0;d=e;c=f;break}h=h.sibling}if(!g){for(h=f.child;h;){if(h===c){g=!0;c=f;d=e;break}if(h===d){g=!0;d=f;c=e;break}h=h.sibling}g?
void 0:x("189")}}c.alternate!==d?x("190"):void 0}3!==c.tag?x("188"):void 0;return c.stateNode.current===c?a:b}function hd(a){a=gd(a);if(!a)return null;for(var b=a;;){if(5===b.tag||6===b.tag)return b;if(b.child)b.child.return=b,b=b.child;else{if(b===a)break;for(;!b.sibling;){if(!b.return||b.return===a)return null;b=b.return}b.sibling.return=b.return;b=b.sibling}}return null}
var id=y.extend({animationName:null,elapsedTime:null,pseudoElement:null}),jd=y.extend({clipboardData:function(a){return"clipboardData"in a?a.clipboardData:window.clipboardData}}),kd=Qc.extend({relatedTarget:null});function ld(a){var b=a.keyCode;"charCode"in a?(a=a.charCode,0===a&&13===b&&(a=13)):a=b;10===a&&(a=13);return 32<=a||13===a?a:0}
var md={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},nd={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",
116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},od=Qc.extend({key:function(a){if(a.key){var b=md[a.key]||a.key;if("Unidentified"!==b)return b}return"keypress"===a.type?(a=ld(a),13===a?"Enter":String.fromCharCode(a)):"keydown"===a.type||"keyup"===a.type?nd[a.keyCode]||"Unidentified":""},location:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,repeat:null,locale:null,getModifierState:Tc,charCode:function(a){return"keypress"===
a.type?ld(a):0},keyCode:function(a){return"keydown"===a.type||"keyup"===a.type?a.keyCode:0},which:function(a){return"keypress"===a.type?ld(a):"keydown"===a.type||"keyup"===a.type?a.keyCode:0}}),pd=Yc.extend({dataTransfer:null}),qd=Qc.extend({touches:null,targetTouches:null,changedTouches:null,altKey:null,metaKey:null,ctrlKey:null,shiftKey:null,getModifierState:Tc}),rd=y.extend({propertyName:null,elapsedTime:null,pseudoElement:null}),sd=Yc.extend({deltaX:function(a){return"deltaX"in a?a.deltaX:"wheelDeltaX"in
a?-a.wheelDeltaX:0},deltaY:function(a){return"deltaY"in a?a.deltaY:"wheelDeltaY"in a?-a.wheelDeltaY:"wheelDelta"in a?-a.wheelDelta:0},deltaZ:null,deltaMode:null}),td=[["abort","abort"],[Xa,"animationEnd"],[Ya,"animationIteration"],[Za,"animationStart"],["canplay","canPlay"],["canplaythrough","canPlayThrough"],["drag","drag"],["dragenter","dragEnter"],["dragexit","dragExit"],["dragleave","dragLeave"],["dragover","dragOver"],["durationchange","durationChange"],["emptied","emptied"],["encrypted","encrypted"],
["ended","ended"],["error","error"],["gotpointercapture","gotPointerCapture"],["load","load"],["loadeddata","loadedData"],["loadedmetadata","loadedMetadata"],["loadstart","loadStart"],["lostpointercapture","lostPointerCapture"],["mousemove","mouseMove"],["mouseout","mouseOut"],["mouseover","mouseOver"],["playing","playing"],["pointermove","pointerMove"],["pointerout","pointerOut"],["pointerover","pointerOver"],["progress","progress"],["scroll","scroll"],["seeking","seeking"],["stalled","stalled"],
["suspend","suspend"],["timeupdate","timeUpdate"],["toggle","toggle"],["touchmove","touchMove"],[$a,"transitionEnd"],["waiting","waiting"],["wheel","wheel"]],ud={},vd={};function wd(a,b){var c=a[0];a=a[1];var d="on"+(a[0].toUpperCase()+a.slice(1));b={phasedRegistrationNames:{bubbled:d,captured:d+"Capture"},dependencies:[c],isInteractive:b};ud[a]=b;vd[c]=b}
[["blur","blur"],["cancel","cancel"],["click","click"],["close","close"],["contextmenu","contextMenu"],["copy","copy"],["cut","cut"],["auxclick","auxClick"],["dblclick","doubleClick"],["dragend","dragEnd"],["dragstart","dragStart"],["drop","drop"],["focus","focus"],["input","input"],["invalid","invalid"],["keydown","keyDown"],["keypress","keyPress"],["keyup","keyUp"],["mousedown","mouseDown"],["mouseup","mouseUp"],["paste","paste"],["pause","pause"],["play","play"],["pointercancel","pointerCancel"],
["pointerdown","pointerDown"],["pointerup","pointerUp"],["ratechange","rateChange"],["reset","reset"],["seeked","seeked"],["submit","submit"],["touchcancel","touchCancel"],["touchend","touchEnd"],["touchstart","touchStart"],["volumechange","volumeChange"]].forEach(function(a){wd(a,!0)});td.forEach(function(a){wd(a,!1)});
var xd={eventTypes:ud,isInteractiveTopLevelEventType:function(a){a=vd[a];return void 0!==a&&!0===a.isInteractive},extractEvents:function(a,b,c,d){var e=vd[a];if(!e)return null;switch(a){case "keypress":if(0===ld(c))return null;case "keydown":case "keyup":a=od;break;case "blur":case "focus":a=kd;break;case "click":if(2===c.button)return null;case "auxclick":case "dblclick":case "mousedown":case "mousemove":case "mouseup":case "mouseout":case "mouseover":case "contextmenu":a=Yc;break;case "drag":case "dragend":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "dragstart":case "drop":a=
pd;break;case "touchcancel":case "touchend":case "touchmove":case "touchstart":a=qd;break;case Xa:case Ya:case Za:a=id;break;case $a:a=rd;break;case "scroll":a=Qc;break;case "wheel":a=sd;break;case "copy":case "cut":case "paste":a=jd;break;case "gotpointercapture":case "lostpointercapture":case "pointercancel":case "pointerdown":case "pointermove":case "pointerout":case "pointerover":case "pointerup":a=Zc;break;default:a=y}b=a.getPooled(e,b,c,d);Qa(b);return b}},yd=xd.isInteractiveTopLevelEventType,
zd=[];function Ad(a){var b=a.targetInst,c=b;do{if(!c){a.ancestors.push(c);break}var d;for(d=c;d.return;)d=d.return;d=3!==d.tag?null:d.stateNode.containerInfo;if(!d)break;a.ancestors.push(c);c=Ha(d)}while(c);for(c=0;c<a.ancestors.length;c++){b=a.ancestors[c];var e=Nb(a.nativeEvent);d=a.topLevelType;for(var f=a.nativeEvent,g=null,h=0;h<oa.length;h++){var l=oa[h];l&&(l=l.extractEvents(d,b,f,e))&&(g=xa(g,l))}Da(g)}}var Bd=!0;
function E(a,b){if(!b)return null;var c=(yd(a)?Cd:Dd).bind(null,a);b.addEventListener(a,c,!1)}function Ed(a,b){if(!b)return null;var c=(yd(a)?Cd:Dd).bind(null,a);b.addEventListener(a,c,!0)}function Cd(a,b){Hb(Dd,a,b)}
function Dd(a,b){if(Bd){var c=Nb(b);c=Ha(c);null===c||"number"!==typeof c.tag||2===ed(c)||(c=null);if(zd.length){var d=zd.pop();d.topLevelType=a;d.nativeEvent=b;d.targetInst=c;a=d}else a={topLevelType:a,nativeEvent:b,targetInst:c,ancestors:[]};try{Kb(Ad,a)}finally{a.topLevelType=null,a.nativeEvent=null,a.targetInst=null,a.ancestors.length=0,10>zd.length&&zd.push(a)}}}var Fd={},Gd=0,Hd="_reactListenersID"+(""+Math.random()).slice(2);
function Id(a){Object.prototype.hasOwnProperty.call(a,Hd)||(a[Hd]=Gd++,Fd[a[Hd]]={});return Fd[a[Hd]]}function Jd(a){a=a||("undefined"!==typeof document?document:void 0);if("undefined"===typeof a)return null;try{return a.activeElement||a.body}catch(b){return a.body}}function Kd(a){for(;a&&a.firstChild;)a=a.firstChild;return a}
function Ld(a,b){var c=Kd(a);a=0;for(var d;c;){if(3===c.nodeType){d=a+c.textContent.length;if(a<=b&&d>=b)return{node:c,offset:b-a};a=d}a:{for(;c;){if(c.nextSibling){c=c.nextSibling;break a}c=c.parentNode}c=void 0}c=Kd(c)}}function Md(a,b){return a&&b?a===b?!0:a&&3===a.nodeType?!1:b&&3===b.nodeType?Md(a,b.parentNode):"contains"in a?a.contains(b):a.compareDocumentPosition?!!(a.compareDocumentPosition(b)&16):!1:!1}
function Nd(){for(var a=window,b=Jd();b instanceof a.HTMLIFrameElement;){try{var c="string"===typeof b.contentWindow.location.href}catch(d){c=!1}if(c)a=b.contentWindow;else break;b=Jd(a.document)}return b}function Od(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return b&&("input"===b&&("text"===a.type||"search"===a.type||"tel"===a.type||"url"===a.type||"password"===a.type)||"textarea"===b||"true"===a.contentEditable)}
function Pd(){var a=Nd();if(Od(a)){if("selectionStart"in a)var b={start:a.selectionStart,end:a.selectionEnd};else a:{b=(b=a.ownerDocument)&&b.defaultView||window;var c=b.getSelection&&b.getSelection();if(c&&0!==c.rangeCount){b=c.anchorNode;var d=c.anchorOffset,e=c.focusNode;c=c.focusOffset;try{b.nodeType,e.nodeType}catch(A){b=null;break a}var f=0,g=-1,h=-1,l=0,k=0,m=a,p=null;b:for(;;){for(var t;;){m!==b||0!==d&&3!==m.nodeType||(g=f+d);m!==e||0!==c&&3!==m.nodeType||(h=f+c);3===m.nodeType&&(f+=m.nodeValue.length);
if(null===(t=m.firstChild))break;p=m;m=t}for(;;){if(m===a)break b;p===b&&++l===d&&(g=f);p===e&&++k===c&&(h=f);if(null!==(t=m.nextSibling))break;m=p;p=m.parentNode}m=t}b=-1===g||-1===h?null:{start:g,end:h}}else b=null}b=b||{start:0,end:0}}else b=null;return{focusedElem:a,selectionRange:b}}
function Qd(a){var b=Nd(),c=a.focusedElem,d=a.selectionRange;if(b!==c&&c&&c.ownerDocument&&Md(c.ownerDocument.documentElement,c)){if(null!==d&&Od(c))if(b=d.start,a=d.end,void 0===a&&(a=b),"selectionStart"in c)c.selectionStart=b,c.selectionEnd=Math.min(a,c.value.length);else if(a=(b=c.ownerDocument||document)&&b.defaultView||window,a.getSelection){a=a.getSelection();var e=c.textContent.length,f=Math.min(d.start,e);d=void 0===d.end?f:Math.min(d.end,e);!a.extend&&f>d&&(e=d,d=f,f=e);e=Ld(c,f);var g=Ld(c,
d);e&&g&&(1!==a.rangeCount||a.anchorNode!==e.node||a.anchorOffset!==e.offset||a.focusNode!==g.node||a.focusOffset!==g.offset)&&(b=b.createRange(),b.setStart(e.node,e.offset),a.removeAllRanges(),f>d?(a.addRange(b),a.extend(g.node,g.offset)):(b.setEnd(g.node,g.offset),a.addRange(b)))}b=[];for(a=c;a=a.parentNode;)1===a.nodeType&&b.push({element:a,left:a.scrollLeft,top:a.scrollTop});"function"===typeof c.focus&&c.focus();for(c=0;c<b.length;c++)a=b[c],a.element.scrollLeft=a.left,a.element.scrollTop=a.top}}
var Rd=Ra&&"documentMode"in document&&11>=document.documentMode,Sd={select:{phasedRegistrationNames:{bubbled:"onSelect",captured:"onSelectCapture"},dependencies:"blur contextmenu dragend focus keydown keyup mousedown mouseup selectionchange".split(" ")}},Td=null,Ud=null,Vd=null,Wd=!1;
function Xd(a,b){var c=b.window===b?b.document:9===b.nodeType?b:b.ownerDocument;if(Wd||null==Td||Td!==Jd(c))return null;c=Td;"selectionStart"in c&&Od(c)?c={start:c.selectionStart,end:c.selectionEnd}:(c=(c.ownerDocument&&c.ownerDocument.defaultView||window).getSelection(),c={anchorNode:c.anchorNode,anchorOffset:c.anchorOffset,focusNode:c.focusNode,focusOffset:c.focusOffset});return Vd&&dd(Vd,c)?null:(Vd=c,a=y.getPooled(Sd.select,Ud,a,b),a.type="select",a.target=Td,Qa(a),a)}
var Yd={eventTypes:Sd,extractEvents:function(a,b,c,d){var e=d.window===d?d.document:9===d.nodeType?d:d.ownerDocument,f;if(!(f=!e)){a:{e=Id(e);f=sa.onSelect;for(var g=0;g<f.length;g++){var h=f[g];if(!e.hasOwnProperty(h)||!e[h]){e=!1;break a}}e=!0}f=!e}if(f)return null;e=b?Ja(b):window;switch(a){case "focus":if(Mb(e)||"true"===e.contentEditable)Td=e,Ud=b,Vd=null;break;case "blur":Vd=Ud=Td=null;break;case "mousedown":Wd=!0;break;case "contextmenu":case "mouseup":case "dragend":return Wd=!1,Xd(c,d);case "selectionchange":if(Rd)break;
case "keydown":case "keyup":return Xd(c,d)}return null}};Ba.injectEventPluginOrder("ResponderEventPlugin SimpleEventPlugin EnterLeaveEventPlugin ChangeEventPlugin SelectEventPlugin BeforeInputEventPlugin".split(" "));ta=Ka;ua=Ia;va=Ja;Ba.injectEventPluginsByName({SimpleEventPlugin:xd,EnterLeaveEventPlugin:ad,ChangeEventPlugin:Pc,SelectEventPlugin:Yd,BeforeInputEventPlugin:zb});function Zd(a){var b="";aa.Children.forEach(a,function(a){null!=a&&(b+=a)});return b}
function $d(a,b){a=n({children:void 0},b);if(b=Zd(b.children))a.children=b;return a}function ae(a,b,c,d){a=a.options;if(b){b={};for(var e=0;e<c.length;e++)b["$"+c[e]]=!0;for(c=0;c<a.length;c++)e=b.hasOwnProperty("$"+a[c].value),a[c].selected!==e&&(a[c].selected=e),e&&d&&(a[c].defaultSelected=!0)}else{c=""+uc(c);b=null;for(e=0;e<a.length;e++){if(a[e].value===c){a[e].selected=!0;d&&(a[e].defaultSelected=!0);return}null!==b||a[e].disabled||(b=a[e])}null!==b&&(b.selected=!0)}}
function be(a,b){null!=b.dangerouslySetInnerHTML?x("91"):void 0;return n({},b,{value:void 0,defaultValue:void 0,children:""+a._wrapperState.initialValue})}function ce(a,b){var c=b.value;null==c&&(c=b.defaultValue,b=b.children,null!=b&&(null!=c?x("92"):void 0,Array.isArray(b)&&(1>=b.length?void 0:x("93"),b=b[0]),c=b),null==c&&(c=""));a._wrapperState={initialValue:uc(c)}}
function de(a,b){var c=uc(b.value),d=uc(b.defaultValue);null!=c&&(c=""+c,c!==a.value&&(a.value=c),null==b.defaultValue&&a.defaultValue!==c&&(a.defaultValue=c));null!=d&&(a.defaultValue=""+d)}function ee(a){var b=a.textContent;b===a._wrapperState.initialValue&&(a.value=b)}var fe={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg"};
function ge(a){switch(a){case "svg":return"http://www.w3.org/2000/svg";case "math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function he(a,b){return null==a||"http://www.w3.org/1999/xhtml"===a?ge(b):"http://www.w3.org/2000/svg"===a&&"foreignObject"===b?"http://www.w3.org/1999/xhtml":a}
var ie=void 0,je=function(a){return"undefined"!==typeof MSApp&&MSApp.execUnsafeLocalFunction?function(b,c,d,e){MSApp.execUnsafeLocalFunction(function(){return a(b,c,d,e)})}:a}(function(a,b){if(a.namespaceURI!==fe.svg||"innerHTML"in a)a.innerHTML=b;else{ie=ie||document.createElement("div");ie.innerHTML="<svg>"+b+"</svg>";for(b=ie.firstChild;a.firstChild;)a.removeChild(a.firstChild);for(;b.firstChild;)a.appendChild(b.firstChild)}});
function ke(a,b){if(b){var c=a.firstChild;if(c&&c===a.lastChild&&3===c.nodeType){c.nodeValue=b;return}}a.textContent=b}
var le={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,
floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},me=["Webkit","ms","Moz","O"];Object.keys(le).forEach(function(a){me.forEach(function(b){b=b+a.charAt(0).toUpperCase()+a.substring(1);le[b]=le[a]})});function ne(a,b,c){return null==b||"boolean"===typeof b||""===b?"":c||"number"!==typeof b||0===b||le.hasOwnProperty(a)&&le[a]?(""+b).trim():b+"px"}
function oe(a,b){a=a.style;for(var c in b)if(b.hasOwnProperty(c)){var d=0===c.indexOf("--"),e=ne(c,b[c],d);"float"===c&&(c="cssFloat");d?a.setProperty(c,e):a[c]=e}}var pe=n({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});
function qe(a,b){b&&(pe[a]&&(null!=b.children||null!=b.dangerouslySetInnerHTML?x("137",a,""):void 0),null!=b.dangerouslySetInnerHTML&&(null!=b.children?x("60"):void 0,"object"===typeof b.dangerouslySetInnerHTML&&"__html"in b.dangerouslySetInnerHTML?void 0:x("61")),null!=b.style&&"object"!==typeof b.style?x("62",""):void 0)}
function re(a,b){if(-1===a.indexOf("-"))return"string"===typeof b.is;switch(a){case "annotation-xml":case "color-profile":case "font-face":case "font-face-src":case "font-face-uri":case "font-face-format":case "font-face-name":case "missing-glyph":return!1;default:return!0}}
function se(a,b){a=9===a.nodeType||11===a.nodeType?a:a.ownerDocument;var c=Id(a);b=sa[b];for(var d=0;d<b.length;d++){var e=b[d];if(!c.hasOwnProperty(e)||!c[e]){switch(e){case "scroll":Ed("scroll",a);break;case "focus":case "blur":Ed("focus",a);Ed("blur",a);c.blur=!0;c.focus=!0;break;case "cancel":case "close":Ob(e)&&Ed(e,a);break;case "invalid":case "submit":case "reset":break;default:-1===ab.indexOf(e)&&E(e,a)}c[e]=!0}}}function te(){}var ue=null,ve=null;
function we(a,b){switch(a){case "button":case "input":case "select":case "textarea":return!!b.autoFocus}return!1}function xe(a,b){return"textarea"===a||"option"===a||"noscript"===a||"string"===typeof b.children||"number"===typeof b.children||"object"===typeof b.dangerouslySetInnerHTML&&null!==b.dangerouslySetInnerHTML&&null!=b.dangerouslySetInnerHTML.__html}
var ye="function"===typeof setTimeout?setTimeout:void 0,ze="function"===typeof clearTimeout?clearTimeout:void 0,Ae=r.unstable_scheduleCallback,Be=r.unstable_cancelCallback;
function Ce(a,b,c,d,e){a[Ga]=e;"input"===c&&"radio"===e.type&&null!=e.name&&xc(a,e);re(c,d);d=re(c,e);for(var f=0;f<b.length;f+=2){var g=b[f],h=b[f+1];"style"===g?oe(a,h):"dangerouslySetInnerHTML"===g?je(a,h):"children"===g?ke(a,h):tc(a,g,h,d)}switch(c){case "input":yc(a,e);break;case "textarea":de(a,e);break;case "select":b=a._wrapperState.wasMultiple,a._wrapperState.wasMultiple=!!e.multiple,c=e.value,null!=c?ae(a,!!e.multiple,c,!1):b!==!!e.multiple&&(null!=e.defaultValue?ae(a,!!e.multiple,e.defaultValue,
!0):ae(a,!!e.multiple,e.multiple?[]:"",!1))}}function De(a){for(a=a.nextSibling;a&&1!==a.nodeType&&3!==a.nodeType;)a=a.nextSibling;return a}function Ee(a){for(a=a.firstChild;a&&1!==a.nodeType&&3!==a.nodeType;)a=a.nextSibling;return a}new Set;var Fe=[],Ge=-1;function F(a){0>Ge||(a.current=Fe[Ge],Fe[Ge]=null,Ge--)}function G(a,b){Ge++;Fe[Ge]=a.current;a.current=b}var He={},H={current:He},I={current:!1},Ie=He;
function Je(a,b){var c=a.type.contextTypes;if(!c)return He;var d=a.stateNode;if(d&&d.__reactInternalMemoizedUnmaskedChildContext===b)return d.__reactInternalMemoizedMaskedChildContext;var e={},f;for(f in c)e[f]=b[f];d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=b,a.__reactInternalMemoizedMaskedChildContext=e);return e}function J(a){a=a.childContextTypes;return null!==a&&void 0!==a}function Ke(a){F(I,a);F(H,a)}function Le(a){F(I,a);F(H,a)}
function Me(a,b,c){H.current!==He?x("168"):void 0;G(H,b,a);G(I,c,a)}function Ne(a,b,c){var d=a.stateNode;a=b.childContextTypes;if("function"!==typeof d.getChildContext)return c;d=d.getChildContext();for(var e in d)e in a?void 0:x("108",ic(b)||"Unknown",e);return n({},c,d)}function Oe(a){var b=a.stateNode;b=b&&b.__reactInternalMemoizedMergedChildContext||He;Ie=H.current;G(H,b,a);G(I,I.current,a);return!0}
function Pe(a,b,c){var d=a.stateNode;d?void 0:x("169");c?(b=Ne(a,b,Ie),d.__reactInternalMemoizedMergedChildContext=b,F(I,a),F(H,a),G(H,b,a)):F(I,a);G(I,c,a)}var Qe=null,Re=null;function Se(a){return function(b){try{return a(b)}catch(c){}}}
function Te(a){if("undefined"===typeof __REACT_DEVTOOLS_GLOBAL_HOOK__)return!1;var b=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(b.isDisabled||!b.supportsFiber)return!0;try{var c=b.inject(a);Qe=Se(function(a){return b.onCommitFiberRoot(c,a)});Re=Se(function(a){return b.onCommitFiberUnmount(c,a)})}catch(d){}return!0}
function Ue(a,b,c,d){this.tag=a;this.key=c;this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null;this.index=0;this.ref=null;this.pendingProps=b;this.contextDependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null;this.mode=d;this.effectTag=0;this.lastEffect=this.firstEffect=this.nextEffect=null;this.childExpirationTime=this.expirationTime=0;this.alternate=null}function K(a,b,c,d){return new Ue(a,b,c,d)}
function Ve(a){a=a.prototype;return!(!a||!a.isReactComponent)}function We(a){if("function"===typeof a)return Ve(a)?1:0;if(void 0!==a&&null!==a){a=a.$$typeof;if(a===cc)return 11;if(a===ec)return 14}return 2}
function Xe(a,b){var c=a.alternate;null===c?(c=K(a.tag,b,a.key,a.mode),c.elementType=a.elementType,c.type=a.type,c.stateNode=a.stateNode,c.alternate=a,a.alternate=c):(c.pendingProps=b,c.effectTag=0,c.nextEffect=null,c.firstEffect=null,c.lastEffect=null);c.childExpirationTime=a.childExpirationTime;c.expirationTime=a.expirationTime;c.child=a.child;c.memoizedProps=a.memoizedProps;c.memoizedState=a.memoizedState;c.updateQueue=a.updateQueue;c.contextDependencies=a.contextDependencies;c.sibling=a.sibling;
c.index=a.index;c.ref=a.ref;return c}
function Ye(a,b,c,d,e,f){var g=2;d=a;if("function"===typeof a)Ve(a)&&(g=1);else if("string"===typeof a)g=5;else a:switch(a){case Xb:return Ze(c.children,e,f,b);case bc:return $e(c,e|3,f,b);case Yb:return $e(c,e|2,f,b);case Zb:return a=K(12,c,b,e|4),a.elementType=Zb,a.type=Zb,a.expirationTime=f,a;case dc:return a=K(13,c,b,e),a.elementType=dc,a.type=dc,a.expirationTime=f,a;default:if("object"===typeof a&&null!==a)switch(a.$$typeof){case $b:g=10;break a;case ac:g=9;break a;case cc:g=11;break a;case ec:g=
14;break a;case fc:g=16;d=null;break a}x("130",null==a?a:typeof a,"")}b=K(g,c,b,e);b.elementType=a;b.type=d;b.expirationTime=f;return b}function Ze(a,b,c,d){a=K(7,a,d,b);a.expirationTime=c;return a}function $e(a,b,c,d){a=K(8,a,d,b);b=0===(b&1)?Yb:bc;a.elementType=b;a.type=b;a.expirationTime=c;return a}function af(a,b,c){a=K(6,a,null,b);a.expirationTime=c;return a}
function bf(a,b,c){b=K(4,null!==a.children?a.children:[],a.key,b);b.expirationTime=c;b.stateNode={containerInfo:a.containerInfo,pendingChildren:null,implementation:a.implementation};return b}function cf(a,b){a.didError=!1;var c=a.earliestPendingTime;0===c?a.earliestPendingTime=a.latestPendingTime=b:c<b?a.earliestPendingTime=b:a.latestPendingTime>b&&(a.latestPendingTime=b);df(b,a)}
function ef(a,b){a.didError=!1;if(0===b)a.earliestPendingTime=0,a.latestPendingTime=0,a.earliestSuspendedTime=0,a.latestSuspendedTime=0,a.latestPingedTime=0;else{b<a.latestPingedTime&&(a.latestPingedTime=0);var c=a.latestPendingTime;0!==c&&(c>b?a.earliestPendingTime=a.latestPendingTime=0:a.earliestPendingTime>b&&(a.earliestPendingTime=a.latestPendingTime));c=a.earliestSuspendedTime;0===c?cf(a,b):b<a.latestSuspendedTime?(a.earliestSuspendedTime=0,a.latestSuspendedTime=0,a.latestPingedTime=0,cf(a,b)):
b>c&&cf(a,b)}df(0,a)}function ff(a,b){a.didError=!1;a.latestPingedTime>=b&&(a.latestPingedTime=0);var c=a.earliestPendingTime,d=a.latestPendingTime;c===b?a.earliestPendingTime=d===b?a.latestPendingTime=0:d:d===b&&(a.latestPendingTime=c);c=a.earliestSuspendedTime;d=a.latestSuspendedTime;0===c?a.earliestSuspendedTime=a.latestSuspendedTime=b:c<b?a.earliestSuspendedTime=b:d>b&&(a.latestSuspendedTime=b);df(b,a)}
function gf(a,b){var c=a.earliestPendingTime;a=a.earliestSuspendedTime;c>b&&(b=c);a>b&&(b=a);return b}function df(a,b){var c=b.earliestSuspendedTime,d=b.latestSuspendedTime,e=b.earliestPendingTime,f=b.latestPingedTime;e=0!==e?e:f;0===e&&(0===a||d<a)&&(e=d);a=e;0!==a&&c>a&&(a=c);b.nextExpirationTimeToWorkOn=e;b.expirationTime=a}function L(a,b){if(a&&a.defaultProps){b=n({},b);a=a.defaultProps;for(var c in a)void 0===b[c]&&(b[c]=a[c])}return b}
function hf(a){var b=a._result;switch(a._status){case 1:return b;case 2:throw b;case 0:throw b;default:a._status=0;b=a._ctor;b=b();b.then(function(b){0===a._status&&(b=b.default,a._status=1,a._result=b)},function(b){0===a._status&&(a._status=2,a._result=b)});switch(a._status){case 1:return a._result;case 2:throw a._result;}a._result=b;throw b;}}var jf=(new aa.Component).refs;
function kf(a,b,c,d){b=a.memoizedState;c=c(d,b);c=null===c||void 0===c?b:n({},b,c);a.memoizedState=c;d=a.updateQueue;null!==d&&0===a.expirationTime&&(d.baseState=c)}
var tf={isMounted:function(a){return(a=a._reactInternalFiber)?2===ed(a):!1},enqueueSetState:function(a,b,c){a=a._reactInternalFiber;var d=lf();d=mf(d,a);var e=nf(d);e.payload=b;void 0!==c&&null!==c&&(e.callback=c);of();pf(a,e);qf(a,d)},enqueueReplaceState:function(a,b,c){a=a._reactInternalFiber;var d=lf();d=mf(d,a);var e=nf(d);e.tag=rf;e.payload=b;void 0!==c&&null!==c&&(e.callback=c);of();pf(a,e);qf(a,d)},enqueueForceUpdate:function(a,b){a=a._reactInternalFiber;var c=lf();c=mf(c,a);var d=nf(c);d.tag=
sf;void 0!==b&&null!==b&&(d.callback=b);of();pf(a,d);qf(a,c)}};function uf(a,b,c,d,e,f,g){a=a.stateNode;return"function"===typeof a.shouldComponentUpdate?a.shouldComponentUpdate(d,f,g):b.prototype&&b.prototype.isPureReactComponent?!dd(c,d)||!dd(e,f):!0}
function vf(a,b,c){var d=!1,e=He;var f=b.contextType;"object"===typeof f&&null!==f?f=M(f):(e=J(b)?Ie:H.current,d=b.contextTypes,f=(d=null!==d&&void 0!==d)?Je(a,e):He);b=new b(c,f);a.memoizedState=null!==b.state&&void 0!==b.state?b.state:null;b.updater=tf;a.stateNode=b;b._reactInternalFiber=a;d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=e,a.__reactInternalMemoizedMaskedChildContext=f);return b}
function wf(a,b,c,d){a=b.state;"function"===typeof b.componentWillReceiveProps&&b.componentWillReceiveProps(c,d);"function"===typeof b.UNSAFE_componentWillReceiveProps&&b.UNSAFE_componentWillReceiveProps(c,d);b.state!==a&&tf.enqueueReplaceState(b,b.state,null)}
function xf(a,b,c,d){var e=a.stateNode;e.props=c;e.state=a.memoizedState;e.refs=jf;var f=b.contextType;"object"===typeof f&&null!==f?e.context=M(f):(f=J(b)?Ie:H.current,e.context=Je(a,f));f=a.updateQueue;null!==f&&(yf(a,f,c,e,d),e.state=a.memoizedState);f=b.getDerivedStateFromProps;"function"===typeof f&&(kf(a,b,f,c),e.state=a.memoizedState);"function"===typeof b.getDerivedStateFromProps||"function"===typeof e.getSnapshotBeforeUpdate||"function"!==typeof e.UNSAFE_componentWillMount&&"function"!==
typeof e.componentWillMount||(b=e.state,"function"===typeof e.componentWillMount&&e.componentWillMount(),"function"===typeof e.UNSAFE_componentWillMount&&e.UNSAFE_componentWillMount(),b!==e.state&&tf.enqueueReplaceState(e,e.state,null),f=a.updateQueue,null!==f&&(yf(a,f,c,e,d),e.state=a.memoizedState));"function"===typeof e.componentDidMount&&(a.effectTag|=4)}var zf=Array.isArray;
function Af(a,b,c){a=c.ref;if(null!==a&&"function"!==typeof a&&"object"!==typeof a){if(c._owner){c=c._owner;var d=void 0;c&&(1!==c.tag?x("309"):void 0,d=c.stateNode);d?void 0:x("147",a);var e=""+a;if(null!==b&&null!==b.ref&&"function"===typeof b.ref&&b.ref._stringRef===e)return b.ref;b=function(a){var b=d.refs;b===jf&&(b=d.refs={});null===a?delete b[e]:b[e]=a};b._stringRef=e;return b}"string"!==typeof a?x("284"):void 0;c._owner?void 0:x("290",a)}return a}
function Bf(a,b){"textarea"!==a.type&&x("31","[object Object]"===Object.prototype.toString.call(b)?"object with keys {"+Object.keys(b).join(", ")+"}":b,"")}
function Cf(a){function b(b,c){if(a){var d=b.lastEffect;null!==d?(d.nextEffect=c,b.lastEffect=c):b.firstEffect=b.lastEffect=c;c.nextEffect=null;c.effectTag=8}}function c(c,d){if(!a)return null;for(;null!==d;)b(c,d),d=d.sibling;return null}function d(a,b){for(a=new Map;null!==b;)null!==b.key?a.set(b.key,b):a.set(b.index,b),b=b.sibling;return a}function e(a,b,c){a=Xe(a,b,c);a.index=0;a.sibling=null;return a}function f(b,c,d){b.index=d;if(!a)return c;d=b.alternate;if(null!==d)return d=d.index,d<c?(b.effectTag=
2,c):d;b.effectTag=2;return c}function g(b){a&&null===b.alternate&&(b.effectTag=2);return b}function h(a,b,c,d){if(null===b||6!==b.tag)return b=af(c,a.mode,d),b.return=a,b;b=e(b,c,d);b.return=a;return b}function l(a,b,c,d){if(null!==b&&b.elementType===c.type)return d=e(b,c.props,d),d.ref=Af(a,b,c),d.return=a,d;d=Ye(c.type,c.key,c.props,null,a.mode,d);d.ref=Af(a,b,c);d.return=a;return d}function k(a,b,c,d){if(null===b||4!==b.tag||b.stateNode.containerInfo!==c.containerInfo||b.stateNode.implementation!==
c.implementation)return b=bf(c,a.mode,d),b.return=a,b;b=e(b,c.children||[],d);b.return=a;return b}function m(a,b,c,d,f){if(null===b||7!==b.tag)return b=Ze(c,a.mode,d,f),b.return=a,b;b=e(b,c,d);b.return=a;return b}function p(a,b,c){if("string"===typeof b||"number"===typeof b)return b=af(""+b,a.mode,c),b.return=a,b;if("object"===typeof b&&null!==b){switch(b.$$typeof){case Vb:return c=Ye(b.type,b.key,b.props,null,a.mode,c),c.ref=Af(a,null,b),c.return=a,c;case Wb:return b=bf(b,a.mode,c),b.return=a,b}if(zf(b)||
hc(b))return b=Ze(b,a.mode,c,null),b.return=a,b;Bf(a,b)}return null}function t(a,b,c,d){var e=null!==b?b.key:null;if("string"===typeof c||"number"===typeof c)return null!==e?null:h(a,b,""+c,d);if("object"===typeof c&&null!==c){switch(c.$$typeof){case Vb:return c.key===e?c.type===Xb?m(a,b,c.props.children,d,e):l(a,b,c,d):null;case Wb:return c.key===e?k(a,b,c,d):null}if(zf(c)||hc(c))return null!==e?null:m(a,b,c,d,null);Bf(a,c)}return null}function A(a,b,c,d,e){if("string"===typeof d||"number"===typeof d)return a=
a.get(c)||null,h(b,a,""+d,e);if("object"===typeof d&&null!==d){switch(d.$$typeof){case Vb:return a=a.get(null===d.key?c:d.key)||null,d.type===Xb?m(b,a,d.props.children,e,d.key):l(b,a,d,e);case Wb:return a=a.get(null===d.key?c:d.key)||null,k(b,a,d,e)}if(zf(d)||hc(d))return a=a.get(c)||null,m(b,a,d,e,null);Bf(b,d)}return null}function v(e,g,h,k){for(var l=null,m=null,q=g,u=g=0,B=null;null!==q&&u<h.length;u++){q.index>u?(B=q,q=null):B=q.sibling;var w=t(e,q,h[u],k);if(null===w){null===q&&(q=B);break}a&&
q&&null===w.alternate&&b(e,q);g=f(w,g,u);null===m?l=w:m.sibling=w;m=w;q=B}if(u===h.length)return c(e,q),l;if(null===q){for(;u<h.length;u++)if(q=p(e,h[u],k))g=f(q,g,u),null===m?l=q:m.sibling=q,m=q;return l}for(q=d(e,q);u<h.length;u++)if(B=A(q,e,u,h[u],k))a&&null!==B.alternate&&q.delete(null===B.key?u:B.key),g=f(B,g,u),null===m?l=B:m.sibling=B,m=B;a&&q.forEach(function(a){return b(e,a)});return l}function R(e,g,h,k){var l=hc(h);"function"!==typeof l?x("150"):void 0;h=l.call(h);null==h?x("151"):void 0;
for(var m=l=null,q=g,u=g=0,B=null,w=h.next();null!==q&&!w.done;u++,w=h.next()){q.index>u?(B=q,q=null):B=q.sibling;var v=t(e,q,w.value,k);if(null===v){q||(q=B);break}a&&q&&null===v.alternate&&b(e,q);g=f(v,g,u);null===m?l=v:m.sibling=v;m=v;q=B}if(w.done)return c(e,q),l;if(null===q){for(;!w.done;u++,w=h.next())w=p(e,w.value,k),null!==w&&(g=f(w,g,u),null===m?l=w:m.sibling=w,m=w);return l}for(q=d(e,q);!w.done;u++,w=h.next())w=A(q,e,u,w.value,k),null!==w&&(a&&null!==w.alternate&&q.delete(null===w.key?u:
w.key),g=f(w,g,u),null===m?l=w:m.sibling=w,m=w);a&&q.forEach(function(a){return b(e,a)});return l}return function(a,d,f,h){var k="object"===typeof f&&null!==f&&f.type===Xb&&null===f.key;k&&(f=f.props.children);var l="object"===typeof f&&null!==f;if(l)switch(f.$$typeof){case Vb:a:{l=f.key;for(k=d;null!==k;){if(k.key===l)if(7===k.tag?f.type===Xb:k.elementType===f.type){c(a,k.sibling);d=e(k,f.type===Xb?f.props.children:f.props,h);d.ref=Af(a,k,f);d.return=a;a=d;break a}else{c(a,k);break}else b(a,k);k=
k.sibling}f.type===Xb?(d=Ze(f.props.children,a.mode,h,f.key),d.return=a,a=d):(h=Ye(f.type,f.key,f.props,null,a.mode,h),h.ref=Af(a,d,f),h.return=a,a=h)}return g(a);case Wb:a:{for(k=f.key;null!==d;){if(d.key===k)if(4===d.tag&&d.stateNode.containerInfo===f.containerInfo&&d.stateNode.implementation===f.implementation){c(a,d.sibling);d=e(d,f.children||[],h);d.return=a;a=d;break a}else{c(a,d);break}else b(a,d);d=d.sibling}d=bf(f,a.mode,h);d.return=a;a=d}return g(a)}if("string"===typeof f||"number"===typeof f)return f=
""+f,null!==d&&6===d.tag?(c(a,d.sibling),d=e(d,f,h),d.return=a,a=d):(c(a,d),d=af(f,a.mode,h),d.return=a,a=d),g(a);if(zf(f))return v(a,d,f,h);if(hc(f))return R(a,d,f,h);l&&Bf(a,f);if("undefined"===typeof f&&!k)switch(a.tag){case 1:case 0:h=a.type,x("152",h.displayName||h.name||"Component")}return c(a,d)}}var Df=Cf(!0),Ef=Cf(!1),Ff={},N={current:Ff},Gf={current:Ff},Hf={current:Ff};function If(a){a===Ff?x("174"):void 0;return a}
function Jf(a,b){G(Hf,b,a);G(Gf,a,a);G(N,Ff,a);var c=b.nodeType;switch(c){case 9:case 11:b=(b=b.documentElement)?b.namespaceURI:he(null,"");break;default:c=8===c?b.parentNode:b,b=c.namespaceURI||null,c=c.tagName,b=he(b,c)}F(N,a);G(N,b,a)}function Kf(a){F(N,a);F(Gf,a);F(Hf,a)}function Lf(a){If(Hf.current);var b=If(N.current);var c=he(b,a.type);b!==c&&(G(Gf,a,a),G(N,c,a))}function Mf(a){Gf.current===a&&(F(N,a),F(Gf,a))}
var Nf=0,Of=2,Pf=4,Qf=8,Rf=16,Sf=32,Tf=64,Uf=128,Vf=Tb.ReactCurrentDispatcher,Wf=0,Xf=null,O=null,P=null,Yf=null,Q=null,Zf=null,$f=0,ag=null,bg=0,cg=!1,dg=null,eg=0;function fg(){x("321")}function gg(a,b){if(null===b)return!1;for(var c=0;c<b.length&&c<a.length;c++)if(!bd(a[c],b[c]))return!1;return!0}
function hg(a,b,c,d,e,f){Wf=f;Xf=b;P=null!==a?a.memoizedState:null;Vf.current=null===P?ig:jg;b=c(d,e);if(cg){do cg=!1,eg+=1,P=null!==a?a.memoizedState:null,Zf=Yf,ag=Q=O=null,Vf.current=jg,b=c(d,e);while(cg);dg=null;eg=0}Vf.current=kg;a=Xf;a.memoizedState=Yf;a.expirationTime=$f;a.updateQueue=ag;a.effectTag|=bg;a=null!==O&&null!==O.next;Wf=0;Zf=Q=Yf=P=O=Xf=null;$f=0;ag=null;bg=0;a?x("300"):void 0;return b}function lg(){Vf.current=kg;Wf=0;Zf=Q=Yf=P=O=Xf=null;$f=0;ag=null;bg=0;cg=!1;dg=null;eg=0}
function mg(){var a={memoizedState:null,baseState:null,queue:null,baseUpdate:null,next:null};null===Q?Yf=Q=a:Q=Q.next=a;return Q}function ng(){if(null!==Zf)Q=Zf,Zf=Q.next,O=P,P=null!==O?O.next:null;else{null===P?x("310"):void 0;O=P;var a={memoizedState:O.memoizedState,baseState:O.baseState,queue:O.queue,baseUpdate:O.baseUpdate,next:null};Q=null===Q?Yf=a:Q.next=a;P=O.next}return Q}function og(a,b){return"function"===typeof b?b(a):b}
function pg(a){var b=ng(),c=b.queue;null===c?x("311"):void 0;c.lastRenderedReducer=a;if(0<eg){var d=c.dispatch;if(null!==dg){var e=dg.get(c);if(void 0!==e){dg.delete(c);var f=b.memoizedState;do f=a(f,e.action),e=e.next;while(null!==e);bd(f,b.memoizedState)||(qg=!0);b.memoizedState=f;b.baseUpdate===c.last&&(b.baseState=f);c.lastRenderedState=f;return[f,d]}}return[b.memoizedState,d]}d=c.last;var g=b.baseUpdate;f=b.baseState;null!==g?(null!==d&&(d.next=null),d=g.next):d=null!==d?d.next:null;if(null!==
d){var h=e=null,l=d,k=!1;do{var m=l.expirationTime;m<Wf?(k||(k=!0,h=g,e=f),m>$f&&($f=m)):f=l.eagerReducer===a?l.eagerState:a(f,l.action);g=l;l=l.next}while(null!==l&&l!==d);k||(h=g,e=f);bd(f,b.memoizedState)||(qg=!0);b.memoizedState=f;b.baseUpdate=h;b.baseState=e;c.lastRenderedState=f}return[b.memoizedState,c.dispatch]}
function rg(a,b,c,d){a={tag:a,create:b,destroy:c,deps:d,next:null};null===ag?(ag={lastEffect:null},ag.lastEffect=a.next=a):(b=ag.lastEffect,null===b?ag.lastEffect=a.next=a:(c=b.next,b.next=a,a.next=c,ag.lastEffect=a));return a}function sg(a,b,c,d){var e=mg();bg|=a;e.memoizedState=rg(b,c,void 0,void 0===d?null:d)}
function tg(a,b,c,d){var e=ng();d=void 0===d?null:d;var f=void 0;if(null!==O){var g=O.memoizedState;f=g.destroy;if(null!==d&&gg(d,g.deps)){rg(Nf,c,f,d);return}}bg|=a;e.memoizedState=rg(b,c,f,d)}function ug(a,b){if("function"===typeof b)return a=a(),b(a),function(){b(null)};if(null!==b&&void 0!==b)return a=a(),b.current=a,function(){b.current=null}}function vg(){}
function wg(a,b,c){25>eg?void 0:x("301");var d=a.alternate;if(a===Xf||null!==d&&d===Xf)if(cg=!0,a={expirationTime:Wf,action:c,eagerReducer:null,eagerState:null,next:null},null===dg&&(dg=new Map),c=dg.get(b),void 0===c)dg.set(b,a);else{for(b=c;null!==b.next;)b=b.next;b.next=a}else{of();var e=lf();e=mf(e,a);var f={expirationTime:e,action:c,eagerReducer:null,eagerState:null,next:null},g=b.last;if(null===g)f.next=f;else{var h=g.next;null!==h&&(f.next=h);g.next=f}b.last=f;if(0===a.expirationTime&&(null===
d||0===d.expirationTime)&&(d=b.lastRenderedReducer,null!==d))try{var l=b.lastRenderedState,k=d(l,c);f.eagerReducer=d;f.eagerState=k;if(bd(k,l))return}catch(m){}finally{}qf(a,e)}}
var kg={readContext:M,useCallback:fg,useContext:fg,useEffect:fg,useImperativeHandle:fg,useLayoutEffect:fg,useMemo:fg,useReducer:fg,useRef:fg,useState:fg,useDebugValue:fg},ig={readContext:M,useCallback:function(a,b){mg().memoizedState=[a,void 0===b?null:b];return a},useContext:M,useEffect:function(a,b){return sg(516,Uf|Tf,a,b)},useImperativeHandle:function(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return sg(4,Pf|Sf,ug.bind(null,b,a),c)},useLayoutEffect:function(a,b){return sg(4,Pf|Sf,a,b)},
useMemo:function(a,b){var c=mg();b=void 0===b?null:b;a=a();c.memoizedState=[a,b];return a},useReducer:function(a,b,c){var d=mg();b=void 0!==c?c(b):b;d.memoizedState=d.baseState=b;a=d.queue={last:null,dispatch:null,lastRenderedReducer:a,lastRenderedState:b};a=a.dispatch=wg.bind(null,Xf,a);return[d.memoizedState,a]},useRef:function(a){var b=mg();a={current:a};return b.memoizedState=a},useState:function(a){var b=mg();"function"===typeof a&&(a=a());b.memoizedState=b.baseState=a;a=b.queue={last:null,dispatch:null,
lastRenderedReducer:og,lastRenderedState:a};a=a.dispatch=wg.bind(null,Xf,a);return[b.memoizedState,a]},useDebugValue:vg},jg={readContext:M,useCallback:function(a,b){var c=ng();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&gg(b,d[1]))return d[0];c.memoizedState=[a,b];return a},useContext:M,useEffect:function(a,b){return tg(516,Uf|Tf,a,b)},useImperativeHandle:function(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return tg(4,Pf|Sf,ug.bind(null,b,a),c)},useLayoutEffect:function(a,
b){return tg(4,Pf|Sf,a,b)},useMemo:function(a,b){var c=ng();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&gg(b,d[1]))return d[0];a=a();c.memoizedState=[a,b];return a},useReducer:pg,useRef:function(){return ng().memoizedState},useState:function(a){return pg(og,a)},useDebugValue:vg},xg=null,yg=null,zg=!1;
function Ag(a,b){var c=K(5,null,null,0);c.elementType="DELETED";c.type="DELETED";c.stateNode=b;c.return=a;c.effectTag=8;null!==a.lastEffect?(a.lastEffect.nextEffect=c,a.lastEffect=c):a.firstEffect=a.lastEffect=c}function Bg(a,b){switch(a.tag){case 5:var c=a.type;b=1!==b.nodeType||c.toLowerCase()!==b.nodeName.toLowerCase()?null:b;return null!==b?(a.stateNode=b,!0):!1;case 6:return b=""===a.pendingProps||3!==b.nodeType?null:b,null!==b?(a.stateNode=b,!0):!1;case 13:return!1;default:return!1}}
function Cg(a){if(zg){var b=yg;if(b){var c=b;if(!Bg(a,b)){b=De(c);if(!b||!Bg(a,b)){a.effectTag|=2;zg=!1;xg=a;return}Ag(xg,c)}xg=a;yg=Ee(b)}else a.effectTag|=2,zg=!1,xg=a}}function Dg(a){for(a=a.return;null!==a&&5!==a.tag&&3!==a.tag&&18!==a.tag;)a=a.return;xg=a}function Eg(a){if(a!==xg)return!1;if(!zg)return Dg(a),zg=!0,!1;var b=a.type;if(5!==a.tag||"head"!==b&&"body"!==b&&!xe(b,a.memoizedProps))for(b=yg;b;)Ag(a,b),b=De(b);Dg(a);yg=xg?De(a.stateNode):null;return!0}function Fg(){yg=xg=null;zg=!1}
var Gg=Tb.ReactCurrentOwner,qg=!1;function S(a,b,c,d){b.child=null===a?Ef(b,null,c,d):Df(b,a.child,c,d)}function Hg(a,b,c,d,e){c=c.render;var f=b.ref;Ig(b,e);d=hg(a,b,c,d,f,e);if(null!==a&&!qg)return b.updateQueue=a.updateQueue,b.effectTag&=-517,a.expirationTime<=e&&(a.expirationTime=0),Jg(a,b,e);b.effectTag|=1;S(a,b,d,e);return b.child}
function Kg(a,b,c,d,e,f){if(null===a){var g=c.type;if("function"===typeof g&&!Ve(g)&&void 0===g.defaultProps&&null===c.compare&&void 0===c.defaultProps)return b.tag=15,b.type=g,Lg(a,b,g,d,e,f);a=Ye(c.type,null,d,null,b.mode,f);a.ref=b.ref;a.return=b;return b.child=a}g=a.child;if(e<f&&(e=g.memoizedProps,c=c.compare,c=null!==c?c:dd,c(e,d)&&a.ref===b.ref))return Jg(a,b,f);b.effectTag|=1;a=Xe(g,d,f);a.ref=b.ref;a.return=b;return b.child=a}
function Lg(a,b,c,d,e,f){return null!==a&&dd(a.memoizedProps,d)&&a.ref===b.ref&&(qg=!1,e<f)?Jg(a,b,f):Mg(a,b,c,d,f)}function Ng(a,b){var c=b.ref;if(null===a&&null!==c||null!==a&&a.ref!==c)b.effectTag|=128}function Mg(a,b,c,d,e){var f=J(c)?Ie:H.current;f=Je(b,f);Ig(b,e);c=hg(a,b,c,d,f,e);if(null!==a&&!qg)return b.updateQueue=a.updateQueue,b.effectTag&=-517,a.expirationTime<=e&&(a.expirationTime=0),Jg(a,b,e);b.effectTag|=1;S(a,b,c,e);return b.child}
function Og(a,b,c,d,e){if(J(c)){var f=!0;Oe(b)}else f=!1;Ig(b,e);if(null===b.stateNode)null!==a&&(a.alternate=null,b.alternate=null,b.effectTag|=2),vf(b,c,d,e),xf(b,c,d,e),d=!0;else if(null===a){var g=b.stateNode,h=b.memoizedProps;g.props=h;var l=g.context,k=c.contextType;"object"===typeof k&&null!==k?k=M(k):(k=J(c)?Ie:H.current,k=Je(b,k));var m=c.getDerivedStateFromProps,p="function"===typeof m||"function"===typeof g.getSnapshotBeforeUpdate;p||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&
"function"!==typeof g.componentWillReceiveProps||(h!==d||l!==k)&&wf(b,g,d,k);Pg=!1;var t=b.memoizedState;l=g.state=t;var A=b.updateQueue;null!==A&&(yf(b,A,d,g,e),l=b.memoizedState);h!==d||t!==l||I.current||Pg?("function"===typeof m&&(kf(b,c,m,d),l=b.memoizedState),(h=Pg||uf(b,c,h,d,t,l,k))?(p||"function"!==typeof g.UNSAFE_componentWillMount&&"function"!==typeof g.componentWillMount||("function"===typeof g.componentWillMount&&g.componentWillMount(),"function"===typeof g.UNSAFE_componentWillMount&&
g.UNSAFE_componentWillMount()),"function"===typeof g.componentDidMount&&(b.effectTag|=4)):("function"===typeof g.componentDidMount&&(b.effectTag|=4),b.memoizedProps=d,b.memoizedState=l),g.props=d,g.state=l,g.context=k,d=h):("function"===typeof g.componentDidMount&&(b.effectTag|=4),d=!1)}else g=b.stateNode,h=b.memoizedProps,g.props=b.type===b.elementType?h:L(b.type,h),l=g.context,k=c.contextType,"object"===typeof k&&null!==k?k=M(k):(k=J(c)?Ie:H.current,k=Je(b,k)),m=c.getDerivedStateFromProps,(p="function"===
typeof m||"function"===typeof g.getSnapshotBeforeUpdate)||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||(h!==d||l!==k)&&wf(b,g,d,k),Pg=!1,l=b.memoizedState,t=g.state=l,A=b.updateQueue,null!==A&&(yf(b,A,d,g,e),t=b.memoizedState),h!==d||l!==t||I.current||Pg?("function"===typeof m&&(kf(b,c,m,d),t=b.memoizedState),(m=Pg||uf(b,c,h,d,l,t,k))?(p||"function"!==typeof g.UNSAFE_componentWillUpdate&&"function"!==typeof g.componentWillUpdate||("function"===
typeof g.componentWillUpdate&&g.componentWillUpdate(d,t,k),"function"===typeof g.UNSAFE_componentWillUpdate&&g.UNSAFE_componentWillUpdate(d,t,k)),"function"===typeof g.componentDidUpdate&&(b.effectTag|=4),"function"===typeof g.getSnapshotBeforeUpdate&&(b.effectTag|=256)):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&l===a.memoizedState||(b.effectTag|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&l===a.memoizedState||(b.effectTag|=256),b.memoizedProps=d,b.memoizedState=
t),g.props=d,g.state=t,g.context=k,d=m):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&l===a.memoizedState||(b.effectTag|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&l===a.memoizedState||(b.effectTag|=256),d=!1);return Qg(a,b,c,d,f,e)}
function Qg(a,b,c,d,e,f){Ng(a,b);var g=0!==(b.effectTag&64);if(!d&&!g)return e&&Pe(b,c,!1),Jg(a,b,f);d=b.stateNode;Gg.current=b;var h=g&&"function"!==typeof c.getDerivedStateFromError?null:d.render();b.effectTag|=1;null!==a&&g?(b.child=Df(b,a.child,null,f),b.child=Df(b,null,h,f)):S(a,b,h,f);b.memoizedState=d.state;e&&Pe(b,c,!0);return b.child}function Rg(a){var b=a.stateNode;b.pendingContext?Me(a,b.pendingContext,b.pendingContext!==b.context):b.context&&Me(a,b.context,!1);Jf(a,b.containerInfo)}
function Sg(a,b,c){var d=b.mode,e=b.pendingProps,f=b.memoizedState;if(0===(b.effectTag&64)){f=null;var g=!1}else f={timedOutAt:null!==f?f.timedOutAt:0},g=!0,b.effectTag&=-65;if(null===a)if(g){var h=e.fallback;a=Ze(null,d,0,null);0===(b.mode&1)&&(a.child=null!==b.memoizedState?b.child.child:b.child);d=Ze(h,d,c,null);a.sibling=d;c=a;c.return=d.return=b}else c=d=Ef(b,null,e.children,c);else null!==a.memoizedState?(d=a.child,h=d.sibling,g?(c=e.fallback,e=Xe(d,d.pendingProps,0),0===(b.mode&1)&&(g=null!==
b.memoizedState?b.child.child:b.child,g!==d.child&&(e.child=g)),d=e.sibling=Xe(h,c,h.expirationTime),c=e,e.childExpirationTime=0,c.return=d.return=b):c=d=Df(b,d.child,e.children,c)):(h=a.child,g?(g=e.fallback,e=Ze(null,d,0,null),e.child=h,0===(b.mode&1)&&(e.child=null!==b.memoizedState?b.child.child:b.child),d=e.sibling=Ze(g,d,c,null),d.effectTag|=2,c=e,e.childExpirationTime=0,c.return=d.return=b):d=c=Df(b,h,e.children,c)),b.stateNode=a.stateNode;b.memoizedState=f;b.child=c;return d}
function Jg(a,b,c){null!==a&&(b.contextDependencies=a.contextDependencies);if(b.childExpirationTime<c)return null;null!==a&&b.child!==a.child?x("153"):void 0;if(null!==b.child){a=b.child;c=Xe(a,a.pendingProps,a.expirationTime);b.child=c;for(c.return=b;null!==a.sibling;)a=a.sibling,c=c.sibling=Xe(a,a.pendingProps,a.expirationTime),c.return=b;c.sibling=null}return b.child}
function Tg(a,b,c){var d=b.expirationTime;if(null!==a)if(a.memoizedProps!==b.pendingProps||I.current)qg=!0;else{if(d<c){qg=!1;switch(b.tag){case 3:Rg(b);Fg();break;case 5:Lf(b);break;case 1:J(b.type)&&Oe(b);break;case 4:Jf(b,b.stateNode.containerInfo);break;case 10:Ug(b,b.memoizedProps.value);break;case 13:if(null!==b.memoizedState){d=b.child.childExpirationTime;if(0!==d&&d>=c)return Sg(a,b,c);b=Jg(a,b,c);return null!==b?b.sibling:null}}return Jg(a,b,c)}}else qg=!1;b.expirationTime=0;switch(b.tag){case 2:d=
b.elementType;null!==a&&(a.alternate=null,b.alternate=null,b.effectTag|=2);a=b.pendingProps;var e=Je(b,H.current);Ig(b,c);e=hg(null,b,d,a,e,c);b.effectTag|=1;if("object"===typeof e&&null!==e&&"function"===typeof e.render&&void 0===e.$$typeof){b.tag=1;lg();if(J(d)){var f=!0;Oe(b)}else f=!1;b.memoizedState=null!==e.state&&void 0!==e.state?e.state:null;var g=d.getDerivedStateFromProps;"function"===typeof g&&kf(b,d,g,a);e.updater=tf;b.stateNode=e;e._reactInternalFiber=b;xf(b,d,a,c);b=Qg(null,b,d,!0,f,
c)}else b.tag=0,S(null,b,e,c),b=b.child;return b;case 16:e=b.elementType;null!==a&&(a.alternate=null,b.alternate=null,b.effectTag|=2);f=b.pendingProps;a=hf(e);b.type=a;e=b.tag=We(a);f=L(a,f);g=void 0;switch(e){case 0:g=Mg(null,b,a,f,c);break;case 1:g=Og(null,b,a,f,c);break;case 11:g=Hg(null,b,a,f,c);break;case 14:g=Kg(null,b,a,L(a.type,f),d,c);break;default:x("306",a,"")}return g;case 0:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:L(d,e),Mg(a,b,d,e,c);case 1:return d=b.type,e=b.pendingProps,
e=b.elementType===d?e:L(d,e),Og(a,b,d,e,c);case 3:Rg(b);d=b.updateQueue;null===d?x("282"):void 0;e=b.memoizedState;e=null!==e?e.element:null;yf(b,d,b.pendingProps,null,c);d=b.memoizedState.element;if(d===e)Fg(),b=Jg(a,b,c);else{e=b.stateNode;if(e=(null===a||null===a.child)&&e.hydrate)yg=Ee(b.stateNode.containerInfo),xg=b,e=zg=!0;e?(b.effectTag|=2,b.child=Ef(b,null,d,c)):(S(a,b,d,c),Fg());b=b.child}return b;case 5:return Lf(b),null===a&&Cg(b),d=b.type,e=b.pendingProps,f=null!==a?a.memoizedProps:null,
g=e.children,xe(d,e)?g=null:null!==f&&xe(d,f)&&(b.effectTag|=16),Ng(a,b),1!==c&&b.mode&1&&e.hidden?(b.expirationTime=b.childExpirationTime=1,b=null):(S(a,b,g,c),b=b.child),b;case 6:return null===a&&Cg(b),null;case 13:return Sg(a,b,c);case 4:return Jf(b,b.stateNode.containerInfo),d=b.pendingProps,null===a?b.child=Df(b,null,d,c):S(a,b,d,c),b.child;case 11:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:L(d,e),Hg(a,b,d,e,c);case 7:return S(a,b,b.pendingProps,c),b.child;case 8:return S(a,b,b.pendingProps.children,
c),b.child;case 12:return S(a,b,b.pendingProps.children,c),b.child;case 10:a:{d=b.type._context;e=b.pendingProps;g=b.memoizedProps;f=e.value;Ug(b,f);if(null!==g){var h=g.value;f=bd(h,f)?0:("function"===typeof d._calculateChangedBits?d._calculateChangedBits(h,f):1073741823)|0;if(0===f){if(g.children===e.children&&!I.current){b=Jg(a,b,c);break a}}else for(h=b.child,null!==h&&(h.return=b);null!==h;){var l=h.contextDependencies;if(null!==l){g=h.child;for(var k=l.first;null!==k;){if(k.context===d&&0!==
(k.observedBits&f)){1===h.tag&&(k=nf(c),k.tag=sf,pf(h,k));h.expirationTime<c&&(h.expirationTime=c);k=h.alternate;null!==k&&k.expirationTime<c&&(k.expirationTime=c);k=c;for(var m=h.return;null!==m;){var p=m.alternate;if(m.childExpirationTime<k)m.childExpirationTime=k,null!==p&&p.childExpirationTime<k&&(p.childExpirationTime=k);else if(null!==p&&p.childExpirationTime<k)p.childExpirationTime=k;else break;m=m.return}l.expirationTime<c&&(l.expirationTime=c);break}k=k.next}}else g=10===h.tag?h.type===b.type?
null:h.child:h.child;if(null!==g)g.return=h;else for(g=h;null!==g;){if(g===b){g=null;break}h=g.sibling;if(null!==h){h.return=g.return;g=h;break}g=g.return}h=g}}S(a,b,e.children,c);b=b.child}return b;case 9:return e=b.type,f=b.pendingProps,d=f.children,Ig(b,c),e=M(e,f.unstable_observedBits),d=d(e),b.effectTag|=1,S(a,b,d,c),b.child;case 14:return e=b.type,f=L(e,b.pendingProps),f=L(e.type,f),Kg(a,b,e,f,d,c);case 15:return Lg(a,b,b.type,b.pendingProps,d,c);case 17:return d=b.type,e=b.pendingProps,e=b.elementType===
d?e:L(d,e),null!==a&&(a.alternate=null,b.alternate=null,b.effectTag|=2),b.tag=1,J(d)?(a=!0,Oe(b)):a=!1,Ig(b,c),vf(b,d,e,c),xf(b,d,e,c),Qg(null,b,d,!0,a,c)}x("156")}var Vg={current:null},Wg=null,Xg=null,Yg=null;function Ug(a,b){var c=a.type._context;G(Vg,c._currentValue,a);c._currentValue=b}function Zg(a){var b=Vg.current;F(Vg,a);a.type._context._currentValue=b}function Ig(a,b){Wg=a;Yg=Xg=null;var c=a.contextDependencies;null!==c&&c.expirationTime>=b&&(qg=!0);a.contextDependencies=null}
function M(a,b){if(Yg!==a&&!1!==b&&0!==b){if("number"!==typeof b||1073741823===b)Yg=a,b=1073741823;b={context:a,observedBits:b,next:null};null===Xg?(null===Wg?x("308"):void 0,Xg=b,Wg.contextDependencies={first:b,expirationTime:0}):Xg=Xg.next=b}return a._currentValue}var $g=0,rf=1,sf=2,ah=3,Pg=!1;function bh(a){return{baseState:a,firstUpdate:null,lastUpdate:null,firstCapturedUpdate:null,lastCapturedUpdate:null,firstEffect:null,lastEffect:null,firstCapturedEffect:null,lastCapturedEffect:null}}
function ch(a){return{baseState:a.baseState,firstUpdate:a.firstUpdate,lastUpdate:a.lastUpdate,firstCapturedUpdate:null,lastCapturedUpdate:null,firstEffect:null,lastEffect:null,firstCapturedEffect:null,lastCapturedEffect:null}}function nf(a){return{expirationTime:a,tag:$g,payload:null,callback:null,next:null,nextEffect:null}}function dh(a,b){null===a.lastUpdate?a.firstUpdate=a.lastUpdate=b:(a.lastUpdate.next=b,a.lastUpdate=b)}
function pf(a,b){var c=a.alternate;if(null===c){var d=a.updateQueue;var e=null;null===d&&(d=a.updateQueue=bh(a.memoizedState))}else d=a.updateQueue,e=c.updateQueue,null===d?null===e?(d=a.updateQueue=bh(a.memoizedState),e=c.updateQueue=bh(c.memoizedState)):d=a.updateQueue=ch(e):null===e&&(e=c.updateQueue=ch(d));null===e||d===e?dh(d,b):null===d.lastUpdate||null===e.lastUpdate?(dh(d,b),dh(e,b)):(dh(d,b),e.lastUpdate=b)}
function eh(a,b){var c=a.updateQueue;c=null===c?a.updateQueue=bh(a.memoizedState):fh(a,c);null===c.lastCapturedUpdate?c.firstCapturedUpdate=c.lastCapturedUpdate=b:(c.lastCapturedUpdate.next=b,c.lastCapturedUpdate=b)}function fh(a,b){var c=a.alternate;null!==c&&b===c.updateQueue&&(b=a.updateQueue=ch(b));return b}
function gh(a,b,c,d,e,f){switch(c.tag){case rf:return a=c.payload,"function"===typeof a?a.call(f,d,e):a;case ah:a.effectTag=a.effectTag&-2049|64;case $g:a=c.payload;e="function"===typeof a?a.call(f,d,e):a;if(null===e||void 0===e)break;return n({},d,e);case sf:Pg=!0}return d}
function yf(a,b,c,d,e){Pg=!1;b=fh(a,b);for(var f=b.baseState,g=null,h=0,l=b.firstUpdate,k=f;null!==l;){var m=l.expirationTime;m<e?(null===g&&(g=l,f=k),h<m&&(h=m)):(k=gh(a,b,l,k,c,d),null!==l.callback&&(a.effectTag|=32,l.nextEffect=null,null===b.lastEffect?b.firstEffect=b.lastEffect=l:(b.lastEffect.nextEffect=l,b.lastEffect=l)));l=l.next}m=null;for(l=b.firstCapturedUpdate;null!==l;){var p=l.expirationTime;p<e?(null===m&&(m=l,null===g&&(f=k)),h<p&&(h=p)):(k=gh(a,b,l,k,c,d),null!==l.callback&&(a.effectTag|=
32,l.nextEffect=null,null===b.lastCapturedEffect?b.firstCapturedEffect=b.lastCapturedEffect=l:(b.lastCapturedEffect.nextEffect=l,b.lastCapturedEffect=l)));l=l.next}null===g&&(b.lastUpdate=null);null===m?b.lastCapturedUpdate=null:a.effectTag|=32;null===g&&null===m&&(f=k);b.baseState=f;b.firstUpdate=g;b.firstCapturedUpdate=m;a.expirationTime=h;a.memoizedState=k}
function hh(a,b,c){null!==b.firstCapturedUpdate&&(null!==b.lastUpdate&&(b.lastUpdate.next=b.firstCapturedUpdate,b.lastUpdate=b.lastCapturedUpdate),b.firstCapturedUpdate=b.lastCapturedUpdate=null);ih(b.firstEffect,c);b.firstEffect=b.lastEffect=null;ih(b.firstCapturedEffect,c);b.firstCapturedEffect=b.lastCapturedEffect=null}function ih(a,b){for(;null!==a;){var c=a.callback;if(null!==c){a.callback=null;var d=b;"function"!==typeof c?x("191",c):void 0;c.call(d)}a=a.nextEffect}}
function jh(a,b){return{value:a,source:b,stack:jc(b)}}function kh(a){a.effectTag|=4}var lh=void 0,mh=void 0,nh=void 0,oh=void 0;lh=function(a,b){for(var c=b.child;null!==c;){if(5===c.tag||6===c.tag)a.appendChild(c.stateNode);else if(4!==c.tag&&null!==c.child){c.child.return=c;c=c.child;continue}if(c===b)break;for(;null===c.sibling;){if(null===c.return||c.return===b)return;c=c.return}c.sibling.return=c.return;c=c.sibling}};mh=function(){};
nh=function(a,b,c,d,e){var f=a.memoizedProps;if(f!==d){var g=b.stateNode;If(N.current);a=null;switch(c){case "input":f=vc(g,f);d=vc(g,d);a=[];break;case "option":f=$d(g,f);d=$d(g,d);a=[];break;case "select":f=n({},f,{value:void 0});d=n({},d,{value:void 0});a=[];break;case "textarea":f=be(g,f);d=be(g,d);a=[];break;default:"function"!==typeof f.onClick&&"function"===typeof d.onClick&&(g.onclick=te)}qe(c,d);g=c=void 0;var h=null;for(c in f)if(!d.hasOwnProperty(c)&&f.hasOwnProperty(c)&&null!=f[c])if("style"===
c){var l=f[c];for(g in l)l.hasOwnProperty(g)&&(h||(h={}),h[g]="")}else"dangerouslySetInnerHTML"!==c&&"children"!==c&&"suppressContentEditableWarning"!==c&&"suppressHydrationWarning"!==c&&"autoFocus"!==c&&(ra.hasOwnProperty(c)?a||(a=[]):(a=a||[]).push(c,null));for(c in d){var k=d[c];l=null!=f?f[c]:void 0;if(d.hasOwnProperty(c)&&k!==l&&(null!=k||null!=l))if("style"===c)if(l){for(g in l)!l.hasOwnProperty(g)||k&&k.hasOwnProperty(g)||(h||(h={}),h[g]="");for(g in k)k.hasOwnProperty(g)&&l[g]!==k[g]&&(h||
(h={}),h[g]=k[g])}else h||(a||(a=[]),a.push(c,h)),h=k;else"dangerouslySetInnerHTML"===c?(k=k?k.__html:void 0,l=l?l.__html:void 0,null!=k&&l!==k&&(a=a||[]).push(c,""+k)):"children"===c?l===k||"string"!==typeof k&&"number"!==typeof k||(a=a||[]).push(c,""+k):"suppressContentEditableWarning"!==c&&"suppressHydrationWarning"!==c&&(ra.hasOwnProperty(c)?(null!=k&&se(e,c),a||l===k||(a=[])):(a=a||[]).push(c,k))}h&&(a=a||[]).push("style",h);e=a;(b.updateQueue=e)&&kh(b)}};oh=function(a,b,c,d){c!==d&&kh(b)};
var ph="function"===typeof WeakSet?WeakSet:Set;function qh(a,b){var c=b.source,d=b.stack;null===d&&null!==c&&(d=jc(c));null!==c&&ic(c.type);b=b.value;null!==a&&1===a.tag&&ic(a.type);try{console.error(b)}catch(e){setTimeout(function(){throw e;})}}function rh(a){var b=a.ref;if(null!==b)if("function"===typeof b)try{b(null)}catch(c){sh(a,c)}else b.current=null}
function th(a,b,c){c=c.updateQueue;c=null!==c?c.lastEffect:null;if(null!==c){var d=c=c.next;do{if((d.tag&a)!==Nf){var e=d.destroy;d.destroy=void 0;void 0!==e&&e()}(d.tag&b)!==Nf&&(e=d.create,d.destroy=e());d=d.next}while(d!==c)}}
function uh(a,b){for(var c=a;;){if(5===c.tag){var d=c.stateNode;if(b)d.style.display="none";else{d=c.stateNode;var e=c.memoizedProps.style;e=void 0!==e&&null!==e&&e.hasOwnProperty("display")?e.display:null;d.style.display=ne("display",e)}}else if(6===c.tag)c.stateNode.nodeValue=b?"":c.memoizedProps;else if(13===c.tag&&null!==c.memoizedState){d=c.child.sibling;d.return=c;c=d;continue}else if(null!==c.child){c.child.return=c;c=c.child;continue}if(c===a)break;for(;null===c.sibling;){if(null===c.return||
c.return===a)return;c=c.return}c.sibling.return=c.return;c=c.sibling}}
function vh(a){"function"===typeof Re&&Re(a);switch(a.tag){case 0:case 11:case 14:case 15:var b=a.updateQueue;if(null!==b&&(b=b.lastEffect,null!==b)){var c=b=b.next;do{var d=c.destroy;if(void 0!==d){var e=a;try{d()}catch(f){sh(e,f)}}c=c.next}while(c!==b)}break;case 1:rh(a);b=a.stateNode;if("function"===typeof b.componentWillUnmount)try{b.props=a.memoizedProps,b.state=a.memoizedState,b.componentWillUnmount()}catch(f){sh(a,f)}break;case 5:rh(a);break;case 4:wh(a)}}
function xh(a){return 5===a.tag||3===a.tag||4===a.tag}
function yh(a){a:{for(var b=a.return;null!==b;){if(xh(b)){var c=b;break a}b=b.return}x("160");c=void 0}var d=b=void 0;switch(c.tag){case 5:b=c.stateNode;d=!1;break;case 3:b=c.stateNode.containerInfo;d=!0;break;case 4:b=c.stateNode.containerInfo;d=!0;break;default:x("161")}c.effectTag&16&&(ke(b,""),c.effectTag&=-17);a:b:for(c=a;;){for(;null===c.sibling;){if(null===c.return||xh(c.return)){c=null;break a}c=c.return}c.sibling.return=c.return;for(c=c.sibling;5!==c.tag&&6!==c.tag&&18!==c.tag;){if(c.effectTag&
2)continue b;if(null===c.child||4===c.tag)continue b;else c.child.return=c,c=c.child}if(!(c.effectTag&2)){c=c.stateNode;break a}}for(var e=a;;){if(5===e.tag||6===e.tag)if(c)if(d){var f=b,g=e.stateNode,h=c;8===f.nodeType?f.parentNode.insertBefore(g,h):f.insertBefore(g,h)}else b.insertBefore(e.stateNode,c);else d?(g=b,h=e.stateNode,8===g.nodeType?(f=g.parentNode,f.insertBefore(h,g)):(f=g,f.appendChild(h)),g=g._reactRootContainer,null!==g&&void 0!==g||null!==f.onclick||(f.onclick=te)):b.appendChild(e.stateNode);
else if(4!==e.tag&&null!==e.child){e.child.return=e;e=e.child;continue}if(e===a)break;for(;null===e.sibling;){if(null===e.return||e.return===a)return;e=e.return}e.sibling.return=e.return;e=e.sibling}}
function wh(a){for(var b=a,c=!1,d=void 0,e=void 0;;){if(!c){c=b.return;a:for(;;){null===c?x("160"):void 0;switch(c.tag){case 5:d=c.stateNode;e=!1;break a;case 3:d=c.stateNode.containerInfo;e=!0;break a;case 4:d=c.stateNode.containerInfo;e=!0;break a}c=c.return}c=!0}if(5===b.tag||6===b.tag){a:for(var f=b,g=f;;)if(vh(g),null!==g.child&&4!==g.tag)g.child.return=g,g=g.child;else{if(g===f)break;for(;null===g.sibling;){if(null===g.return||g.return===f)break a;g=g.return}g.sibling.return=g.return;g=g.sibling}e?
(f=d,g=b.stateNode,8===f.nodeType?f.parentNode.removeChild(g):f.removeChild(g)):d.removeChild(b.stateNode)}else if(4===b.tag){if(null!==b.child){d=b.stateNode.containerInfo;e=!0;b.child.return=b;b=b.child;continue}}else if(vh(b),null!==b.child){b.child.return=b;b=b.child;continue}if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return;b=b.return;4===b.tag&&(c=!1)}b.sibling.return=b.return;b=b.sibling}}
function zh(a,b){switch(b.tag){case 0:case 11:case 14:case 15:th(Pf,Qf,b);break;case 1:break;case 5:var c=b.stateNode;if(null!=c){var d=b.memoizedProps;a=null!==a?a.memoizedProps:d;var e=b.type,f=b.updateQueue;b.updateQueue=null;null!==f&&Ce(c,f,e,a,d,b)}break;case 6:null===b.stateNode?x("162"):void 0;b.stateNode.nodeValue=b.memoizedProps;break;case 3:break;case 12:break;case 13:c=b.memoizedState;d=void 0;a=b;null===c?d=!1:(d=!0,a=b.child,0===c.timedOutAt&&(c.timedOutAt=lf()));null!==a&&uh(a,d);c=
b.updateQueue;if(null!==c){b.updateQueue=null;var g=b.stateNode;null===g&&(g=b.stateNode=new ph);c.forEach(function(a){var c=Ah.bind(null,b,a);g.has(a)||(g.add(a),a.then(c,c))})}break;case 17:break;default:x("163")}}var Bh="function"===typeof WeakMap?WeakMap:Map;function Ch(a,b,c){c=nf(c);c.tag=ah;c.payload={element:null};var d=b.value;c.callback=function(){Dh(d);qh(a,b)};return c}
function Eh(a,b,c){c=nf(c);c.tag=ah;var d=a.type.getDerivedStateFromError;if("function"===typeof d){var e=b.value;c.payload=function(){return d(e)}}var f=a.stateNode;null!==f&&"function"===typeof f.componentDidCatch&&(c.callback=function(){"function"!==typeof d&&(null===Fh?Fh=new Set([this]):Fh.add(this));var c=b.value,e=b.stack;qh(a,b);this.componentDidCatch(c,{componentStack:null!==e?e:""})});return c}
function Gh(a){switch(a.tag){case 1:J(a.type)&&Ke(a);var b=a.effectTag;return b&2048?(a.effectTag=b&-2049|64,a):null;case 3:return Kf(a),Le(a),b=a.effectTag,0!==(b&64)?x("285"):void 0,a.effectTag=b&-2049|64,a;case 5:return Mf(a),null;case 13:return b=a.effectTag,b&2048?(a.effectTag=b&-2049|64,a):null;case 18:return null;case 4:return Kf(a),null;case 10:return Zg(a),null;default:return null}}
var Hh=Tb.ReactCurrentDispatcher,Ih=Tb.ReactCurrentOwner,Jh=1073741822,Kh=!1,T=null,Lh=null,U=0,Mh=-1,Nh=!1,V=null,Oh=!1,Ph=null,Qh=null,Rh=null,Fh=null;function Sh(){if(null!==T)for(var a=T.return;null!==a;){var b=a;switch(b.tag){case 1:var c=b.type.childContextTypes;null!==c&&void 0!==c&&Ke(b);break;case 3:Kf(b);Le(b);break;case 5:Mf(b);break;case 4:Kf(b);break;case 10:Zg(b)}a=a.return}Lh=null;U=0;Mh=-1;Nh=!1;T=null}
function Th(){for(;null!==V;){var a=V.effectTag;a&16&&ke(V.stateNode,"");if(a&128){var b=V.alternate;null!==b&&(b=b.ref,null!==b&&("function"===typeof b?b(null):b.current=null))}switch(a&14){case 2:yh(V);V.effectTag&=-3;break;case 6:yh(V);V.effectTag&=-3;zh(V.alternate,V);break;case 4:zh(V.alternate,V);break;case 8:a=V,wh(a),a.return=null,a.child=null,a.memoizedState=null,a.updateQueue=null,a=a.alternate,null!==a&&(a.return=null,a.child=null,a.memoizedState=null,a.updateQueue=null)}V=V.nextEffect}}
function Uh(){for(;null!==V;){if(V.effectTag&256)a:{var a=V.alternate,b=V;switch(b.tag){case 0:case 11:case 15:th(Of,Nf,b);break a;case 1:if(b.effectTag&256&&null!==a){var c=a.memoizedProps,d=a.memoizedState;a=b.stateNode;b=a.getSnapshotBeforeUpdate(b.elementType===b.type?c:L(b.type,c),d);a.__reactInternalSnapshotBeforeUpdate=b}break a;case 3:case 5:case 6:case 4:case 17:break a;default:x("163")}}V=V.nextEffect}}
function Vh(a,b){for(;null!==V;){var c=V.effectTag;if(c&36){var d=V.alternate,e=V,f=b;switch(e.tag){case 0:case 11:case 15:th(Rf,Sf,e);break;case 1:var g=e.stateNode;if(e.effectTag&4)if(null===d)g.componentDidMount();else{var h=e.elementType===e.type?d.memoizedProps:L(e.type,d.memoizedProps);g.componentDidUpdate(h,d.memoizedState,g.__reactInternalSnapshotBeforeUpdate)}d=e.updateQueue;null!==d&&hh(e,d,g,f);break;case 3:d=e.updateQueue;if(null!==d){g=null;if(null!==e.child)switch(e.child.tag){case 5:g=
e.child.stateNode;break;case 1:g=e.child.stateNode}hh(e,d,g,f)}break;case 5:f=e.stateNode;null===d&&e.effectTag&4&&we(e.type,e.memoizedProps)&&f.focus();break;case 6:break;case 4:break;case 12:break;case 13:break;case 17:break;default:x("163")}}c&128&&(e=V.ref,null!==e&&(f=V.stateNode,"function"===typeof e?e(f):e.current=f));c&512&&(Ph=a);V=V.nextEffect}}
function Wh(a,b){Rh=Qh=Ph=null;var c=W;W=!0;do{if(b.effectTag&512){var d=!1,e=void 0;try{var f=b;th(Uf,Nf,f);th(Nf,Tf,f)}catch(g){d=!0,e=g}d&&sh(b,e)}b=b.nextEffect}while(null!==b);W=c;c=a.expirationTime;0!==c&&Xh(a,c);X||W||Yh(1073741823,!1)}function of(){null!==Qh&&Be(Qh);null!==Rh&&Rh()}
function Zh(a,b){Oh=Kh=!0;a.current===b?x("177"):void 0;var c=a.pendingCommitExpirationTime;0===c?x("261"):void 0;a.pendingCommitExpirationTime=0;var d=b.expirationTime,e=b.childExpirationTime;ef(a,e>d?e:d);Ih.current=null;d=void 0;1<b.effectTag?null!==b.lastEffect?(b.lastEffect.nextEffect=b,d=b.firstEffect):d=b:d=b.firstEffect;ue=Bd;ve=Pd();Bd=!1;for(V=d;null!==V;){e=!1;var f=void 0;try{Uh()}catch(h){e=!0,f=h}e&&(null===V?x("178"):void 0,sh(V,f),null!==V&&(V=V.nextEffect))}for(V=d;null!==V;){e=!1;
f=void 0;try{Th()}catch(h){e=!0,f=h}e&&(null===V?x("178"):void 0,sh(V,f),null!==V&&(V=V.nextEffect))}Qd(ve);ve=null;Bd=!!ue;ue=null;a.current=b;for(V=d;null!==V;){e=!1;f=void 0;try{Vh(a,c)}catch(h){e=!0,f=h}e&&(null===V?x("178"):void 0,sh(V,f),null!==V&&(V=V.nextEffect))}if(null!==d&&null!==Ph){var g=Wh.bind(null,a,d);Qh=r.unstable_runWithPriority(r.unstable_NormalPriority,function(){return Ae(g)});Rh=g}Kh=Oh=!1;"function"===typeof Qe&&Qe(b.stateNode);c=b.expirationTime;b=b.childExpirationTime;b=
b>c?b:c;0===b&&(Fh=null);$h(a,b)}
function ai(a){for(;;){var b=a.alternate,c=a.return,d=a.sibling;if(0===(a.effectTag&1024)){T=a;a:{var e=b;b=a;var f=U;var g=b.pendingProps;switch(b.tag){case 2:break;case 16:break;case 15:case 0:break;case 1:J(b.type)&&Ke(b);break;case 3:Kf(b);Le(b);g=b.stateNode;g.pendingContext&&(g.context=g.pendingContext,g.pendingContext=null);if(null===e||null===e.child)Eg(b),b.effectTag&=-3;mh(b);break;case 5:Mf(b);var h=If(Hf.current);f=b.type;if(null!==e&&null!=b.stateNode)nh(e,b,f,g,h),e.ref!==b.ref&&(b.effectTag|=
128);else if(g){var l=If(N.current);if(Eg(b)){g=b;e=g.stateNode;var k=g.type,m=g.memoizedProps,p=h;e[Fa]=g;e[Ga]=m;f=void 0;h=k;switch(h){case "iframe":case "object":E("load",e);break;case "video":case "audio":for(k=0;k<ab.length;k++)E(ab[k],e);break;case "source":E("error",e);break;case "img":case "image":case "link":E("error",e);E("load",e);break;case "form":E("reset",e);E("submit",e);break;case "details":E("toggle",e);break;case "input":wc(e,m);E("invalid",e);se(p,"onChange");break;case "select":e._wrapperState=
{wasMultiple:!!m.multiple};E("invalid",e);se(p,"onChange");break;case "textarea":ce(e,m),E("invalid",e),se(p,"onChange")}qe(h,m);k=null;for(f in m)m.hasOwnProperty(f)&&(l=m[f],"children"===f?"string"===typeof l?e.textContent!==l&&(k=["children",l]):"number"===typeof l&&e.textContent!==""+l&&(k=["children",""+l]):ra.hasOwnProperty(f)&&null!=l&&se(p,f));switch(h){case "input":Rb(e);Ac(e,m,!0);break;case "textarea":Rb(e);ee(e,m);break;case "select":case "option":break;default:"function"===typeof m.onClick&&
(e.onclick=te)}f=k;g.updateQueue=f;g=null!==f?!0:!1;g&&kh(b)}else{m=b;p=f;e=g;k=9===h.nodeType?h:h.ownerDocument;l===fe.html&&(l=ge(p));l===fe.html?"script"===p?(e=k.createElement("div"),e.innerHTML="<script>\x3c/script>",k=e.removeChild(e.firstChild)):"string"===typeof e.is?k=k.createElement(p,{is:e.is}):(k=k.createElement(p),"select"===p&&(p=k,e.multiple?p.multiple=!0:e.size&&(p.size=e.size))):k=k.createElementNS(l,p);e=k;e[Fa]=m;e[Ga]=g;lh(e,b,!1,!1);p=e;k=f;m=g;var t=h,A=re(k,m);switch(k){case "iframe":case "object":E("load",
p);h=m;break;case "video":case "audio":for(h=0;h<ab.length;h++)E(ab[h],p);h=m;break;case "source":E("error",p);h=m;break;case "img":case "image":case "link":E("error",p);E("load",p);h=m;break;case "form":E("reset",p);E("submit",p);h=m;break;case "details":E("toggle",p);h=m;break;case "input":wc(p,m);h=vc(p,m);E("invalid",p);se(t,"onChange");break;case "option":h=$d(p,m);break;case "select":p._wrapperState={wasMultiple:!!m.multiple};h=n({},m,{value:void 0});E("invalid",p);se(t,"onChange");break;case "textarea":ce(p,
m);h=be(p,m);E("invalid",p);se(t,"onChange");break;default:h=m}qe(k,h);l=void 0;var v=k,R=p,u=h;for(l in u)if(u.hasOwnProperty(l)){var q=u[l];"style"===l?oe(R,q):"dangerouslySetInnerHTML"===l?(q=q?q.__html:void 0,null!=q&&je(R,q)):"children"===l?"string"===typeof q?("textarea"!==v||""!==q)&&ke(R,q):"number"===typeof q&&ke(R,""+q):"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&"autoFocus"!==l&&(ra.hasOwnProperty(l)?null!=q&&se(t,l):null!=q&&tc(R,l,q,A))}switch(k){case "input":Rb(p);
Ac(p,m,!1);break;case "textarea":Rb(p);ee(p,m);break;case "option":null!=m.value&&p.setAttribute("value",""+uc(m.value));break;case "select":h=p;h.multiple=!!m.multiple;p=m.value;null!=p?ae(h,!!m.multiple,p,!1):null!=m.defaultValue&&ae(h,!!m.multiple,m.defaultValue,!0);break;default:"function"===typeof h.onClick&&(p.onclick=te)}(g=we(f,g))&&kh(b);b.stateNode=e}null!==b.ref&&(b.effectTag|=128)}else null===b.stateNode?x("166"):void 0;break;case 6:e&&null!=b.stateNode?oh(e,b,e.memoizedProps,g):("string"!==
typeof g&&(null===b.stateNode?x("166"):void 0),e=If(Hf.current),If(N.current),Eg(b)?(g=b,f=g.stateNode,e=g.memoizedProps,f[Fa]=g,(g=f.nodeValue!==e)&&kh(b)):(f=b,g=(9===e.nodeType?e:e.ownerDocument).createTextNode(g),g[Fa]=b,f.stateNode=g));break;case 11:break;case 13:g=b.memoizedState;if(0!==(b.effectTag&64)){b.expirationTime=f;T=b;break a}g=null!==g;f=null!==e&&null!==e.memoizedState;null!==e&&!g&&f&&(e=e.child.sibling,null!==e&&(h=b.firstEffect,null!==h?(b.firstEffect=e,e.nextEffect=h):(b.firstEffect=
b.lastEffect=e,e.nextEffect=null),e.effectTag=8));if(g||f)b.effectTag|=4;break;case 7:break;case 8:break;case 12:break;case 4:Kf(b);mh(b);break;case 10:Zg(b);break;case 9:break;case 14:break;case 17:J(b.type)&&Ke(b);break;case 18:break;default:x("156")}T=null}b=a;if(1===U||1!==b.childExpirationTime){g=0;for(f=b.child;null!==f;)e=f.expirationTime,h=f.childExpirationTime,e>g&&(g=e),h>g&&(g=h),f=f.sibling;b.childExpirationTime=g}if(null!==T)return T;null!==c&&0===(c.effectTag&1024)&&(null===c.firstEffect&&
(c.firstEffect=a.firstEffect),null!==a.lastEffect&&(null!==c.lastEffect&&(c.lastEffect.nextEffect=a.firstEffect),c.lastEffect=a.lastEffect),1<a.effectTag&&(null!==c.lastEffect?c.lastEffect.nextEffect=a:c.firstEffect=a,c.lastEffect=a))}else{a=Gh(a,U);if(null!==a)return a.effectTag&=1023,a;null!==c&&(c.firstEffect=c.lastEffect=null,c.effectTag|=1024)}if(null!==d)return d;if(null!==c)a=c;else break}return null}
function bi(a){var b=Tg(a.alternate,a,U);a.memoizedProps=a.pendingProps;null===b&&(b=ai(a));Ih.current=null;return b}
function ci(a,b){Kh?x("243"):void 0;of();Kh=!0;var c=Hh.current;Hh.current=kg;var d=a.nextExpirationTimeToWorkOn;if(d!==U||a!==Lh||null===T)Sh(),Lh=a,U=d,T=Xe(Lh.current,null,U),a.pendingCommitExpirationTime=0;var e=!1;do{try{if(b)for(;null!==T&&!di();)T=bi(T);else for(;null!==T;)T=bi(T)}catch(u){if(Yg=Xg=Wg=null,lg(),null===T)e=!0,Dh(u);else{null===T?x("271"):void 0;var f=T,g=f.return;if(null===g)e=!0,Dh(u);else{a:{var h=a,l=g,k=f,m=u;g=U;k.effectTag|=1024;k.firstEffect=k.lastEffect=null;if(null!==
m&&"object"===typeof m&&"function"===typeof m.then){var p=m;m=l;var t=-1,A=-1;do{if(13===m.tag){var v=m.alternate;if(null!==v&&(v=v.memoizedState,null!==v)){A=10*(1073741822-v.timedOutAt);break}v=m.pendingProps.maxDuration;if("number"===typeof v)if(0>=v)t=0;else if(-1===t||v<t)t=v}m=m.return}while(null!==m);m=l;do{if(v=13===m.tag)v=void 0===m.memoizedProps.fallback?!1:null===m.memoizedState;if(v){l=m.updateQueue;null===l?(l=new Set,l.add(p),m.updateQueue=l):l.add(p);if(0===(m.mode&1)){m.effectTag|=
64;k.effectTag&=-1957;1===k.tag&&(null===k.alternate?k.tag=17:(g=nf(1073741823),g.tag=sf,pf(k,g)));k.expirationTime=1073741823;break a}k=h;l=g;var R=k.pingCache;null===R?(R=k.pingCache=new Bh,v=new Set,R.set(p,v)):(v=R.get(p),void 0===v&&(v=new Set,R.set(p,v)));v.has(l)||(v.add(l),k=ei.bind(null,k,p,l),p.then(k,k));-1===t?h=1073741823:(-1===A&&(A=10*(1073741822-gf(h,g))-5E3),h=A+t);0<=h&&Mh<h&&(Mh=h);m.effectTag|=2048;m.expirationTime=g;break a}m=m.return}while(null!==m);m=Error((ic(k.type)||"A React component")+
" suspended while rendering, but no fallback UI was specified.\n\nAdd a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display."+jc(k))}Nh=!0;m=jh(m,k);h=l;do{switch(h.tag){case 3:h.effectTag|=2048;h.expirationTime=g;g=Ch(h,m,g);eh(h,g);break a;case 1:if(t=m,A=h.type,k=h.stateNode,0===(h.effectTag&64)&&("function"===typeof A.getDerivedStateFromError||null!==k&&"function"===typeof k.componentDidCatch&&(null===Fh||!Fh.has(k)))){h.effectTag|=2048;
h.expirationTime=g;g=Eh(h,t,g);eh(h,g);break a}}h=h.return}while(null!==h)}T=ai(f);continue}}}break}while(1);Kh=!1;Hh.current=c;Yg=Xg=Wg=null;lg();if(e)Lh=null,a.finishedWork=null;else if(null!==T)a.finishedWork=null;else{c=a.current.alternate;null===c?x("281"):void 0;Lh=null;if(Nh){e=a.latestPendingTime;f=a.latestSuspendedTime;g=a.latestPingedTime;if(0!==e&&e<d||0!==f&&f<d||0!==g&&g<d){ff(a,d);fi(a,c,d,a.expirationTime,-1);return}if(!a.didError&&b){a.didError=!0;d=a.nextExpirationTimeToWorkOn=d;
b=a.expirationTime=1073741823;fi(a,c,d,b,-1);return}}b&&-1!==Mh?(ff(a,d),b=10*(1073741822-gf(a,d)),b<Mh&&(Mh=b),b=10*(1073741822-lf()),b=Mh-b,fi(a,c,d,a.expirationTime,0>b?0:b)):(a.pendingCommitExpirationTime=d,a.finishedWork=c)}}
function sh(a,b){for(var c=a.return;null!==c;){switch(c.tag){case 1:var d=c.stateNode;if("function"===typeof c.type.getDerivedStateFromError||"function"===typeof d.componentDidCatch&&(null===Fh||!Fh.has(d))){a=jh(b,a);a=Eh(c,a,1073741823);pf(c,a);qf(c,1073741823);return}break;case 3:a=jh(b,a);a=Ch(c,a,1073741823);pf(c,a);qf(c,1073741823);return}c=c.return}3===a.tag&&(c=jh(b,a),c=Ch(a,c,1073741823),pf(a,c),qf(a,1073741823))}
function mf(a,b){var c=r.unstable_getCurrentPriorityLevel(),d=void 0;if(0===(b.mode&1))d=1073741823;else if(Kh&&!Oh)d=U;else{switch(c){case r.unstable_ImmediatePriority:d=1073741823;break;case r.unstable_UserBlockingPriority:d=1073741822-10*(((1073741822-a+15)/10|0)+1);break;case r.unstable_NormalPriority:d=1073741822-25*(((1073741822-a+500)/25|0)+1);break;case r.unstable_LowPriority:case r.unstable_IdlePriority:d=1;break;default:x("313")}null!==Lh&&d===U&&--d}c===r.unstable_UserBlockingPriority&&
(0===gi||d<gi)&&(gi=d);return d}function ei(a,b,c){var d=a.pingCache;null!==d&&d.delete(b);if(null!==Lh&&U===c)Lh=null;else if(b=a.earliestSuspendedTime,d=a.latestSuspendedTime,0!==b&&c<=b&&c>=d){a.didError=!1;b=a.latestPingedTime;if(0===b||b>c)a.latestPingedTime=c;df(c,a);c=a.expirationTime;0!==c&&Xh(a,c)}}function Ah(a,b){var c=a.stateNode;null!==c&&c.delete(b);b=lf();b=mf(b,a);a=hi(a,b);null!==a&&(cf(a,b),b=a.expirationTime,0!==b&&Xh(a,b))}
function hi(a,b){a.expirationTime<b&&(a.expirationTime=b);var c=a.alternate;null!==c&&c.expirationTime<b&&(c.expirationTime=b);var d=a.return,e=null;if(null===d&&3===a.tag)e=a.stateNode;else for(;null!==d;){c=d.alternate;d.childExpirationTime<b&&(d.childExpirationTime=b);null!==c&&c.childExpirationTime<b&&(c.childExpirationTime=b);if(null===d.return&&3===d.tag){e=d.stateNode;break}d=d.return}return e}
function qf(a,b){a=hi(a,b);null!==a&&(!Kh&&0!==U&&b>U&&Sh(),cf(a,b),Kh&&!Oh&&Lh===a||Xh(a,a.expirationTime),ii>ji&&(ii=0,x("185")))}function ki(a,b,c,d,e){return r.unstable_runWithPriority(r.unstable_ImmediatePriority,function(){return a(b,c,d,e)})}var li=null,Y=null,mi=0,ni=void 0,W=!1,oi=null,Z=0,gi=0,pi=!1,qi=null,X=!1,ri=!1,si=null,ti=r.unstable_now(),ui=1073741822-(ti/10|0),vi=ui,ji=50,ii=0,wi=null;function xi(){ui=1073741822-((r.unstable_now()-ti)/10|0)}
function yi(a,b){if(0!==mi){if(b<mi)return;null!==ni&&r.unstable_cancelCallback(ni)}mi=b;a=r.unstable_now()-ti;ni=r.unstable_scheduleCallback(zi,{timeout:10*(1073741822-b)-a})}function fi(a,b,c,d,e){a.expirationTime=d;0!==e||di()?0<e&&(a.timeoutHandle=ye(Ai.bind(null,a,b,c),e)):(a.pendingCommitExpirationTime=c,a.finishedWork=b)}function Ai(a,b,c){a.pendingCommitExpirationTime=c;a.finishedWork=b;xi();vi=ui;Bi(a,c)}function $h(a,b){a.expirationTime=b;a.finishedWork=null}
function lf(){if(W)return vi;Ci();if(0===Z||1===Z)xi(),vi=ui;return vi}function Xh(a,b){null===a.nextScheduledRoot?(a.expirationTime=b,null===Y?(li=Y=a,a.nextScheduledRoot=a):(Y=Y.nextScheduledRoot=a,Y.nextScheduledRoot=li)):b>a.expirationTime&&(a.expirationTime=b);W||(X?ri&&(oi=a,Z=1073741823,Di(a,1073741823,!1)):1073741823===b?Yh(1073741823,!1):yi(a,b))}
function Ci(){var a=0,b=null;if(null!==Y)for(var c=Y,d=li;null!==d;){var e=d.expirationTime;if(0===e){null===c||null===Y?x("244"):void 0;if(d===d.nextScheduledRoot){li=Y=d.nextScheduledRoot=null;break}else if(d===li)li=e=d.nextScheduledRoot,Y.nextScheduledRoot=e,d.nextScheduledRoot=null;else if(d===Y){Y=c;Y.nextScheduledRoot=li;d.nextScheduledRoot=null;break}else c.nextScheduledRoot=d.nextScheduledRoot,d.nextScheduledRoot=null;d=c.nextScheduledRoot}else{e>a&&(a=e,b=d);if(d===Y)break;if(1073741823===
a)break;c=d;d=d.nextScheduledRoot}}oi=b;Z=a}var Ei=!1;function di(){return Ei?!0:r.unstable_shouldYield()?Ei=!0:!1}function zi(){try{if(!di()&&null!==li){xi();var a=li;do{var b=a.expirationTime;0!==b&&ui<=b&&(a.nextExpirationTimeToWorkOn=ui);a=a.nextScheduledRoot}while(a!==li)}Yh(0,!0)}finally{Ei=!1}}
function Yh(a,b){Ci();if(b)for(xi(),vi=ui;null!==oi&&0!==Z&&a<=Z&&!(Ei&&ui>Z);)Di(oi,Z,ui>Z),Ci(),xi(),vi=ui;else for(;null!==oi&&0!==Z&&a<=Z;)Di(oi,Z,!1),Ci();b&&(mi=0,ni=null);0!==Z&&yi(oi,Z);ii=0;wi=null;if(null!==si)for(a=si,si=null,b=0;b<a.length;b++){var c=a[b];try{c._onComplete()}catch(d){pi||(pi=!0,qi=d)}}if(pi)throw a=qi,qi=null,pi=!1,a;}function Bi(a,b){W?x("253"):void 0;oi=a;Z=b;Di(a,b,!1);Yh(1073741823,!1)}
function Di(a,b,c){W?x("245"):void 0;W=!0;if(c){var d=a.finishedWork;null!==d?Fi(a,d,b):(a.finishedWork=null,d=a.timeoutHandle,-1!==d&&(a.timeoutHandle=-1,ze(d)),ci(a,c),d=a.finishedWork,null!==d&&(di()?a.finishedWork=d:Fi(a,d,b)))}else d=a.finishedWork,null!==d?Fi(a,d,b):(a.finishedWork=null,d=a.timeoutHandle,-1!==d&&(a.timeoutHandle=-1,ze(d)),ci(a,c),d=a.finishedWork,null!==d&&Fi(a,d,b));W=!1}
function Fi(a,b,c){var d=a.firstBatch;if(null!==d&&d._expirationTime>=c&&(null===si?si=[d]:si.push(d),d._defer)){a.finishedWork=b;a.expirationTime=0;return}a.finishedWork=null;a===wi?ii++:(wi=a,ii=0);r.unstable_runWithPriority(r.unstable_ImmediatePriority,function(){Zh(a,b)})}function Dh(a){null===oi?x("246"):void 0;oi.expirationTime=0;pi||(pi=!0,qi=a)}function Gi(a,b){var c=X;X=!0;try{return a(b)}finally{(X=c)||W||Yh(1073741823,!1)}}
function Hi(a,b){if(X&&!ri){ri=!0;try{return a(b)}finally{ri=!1}}return a(b)}function Ii(a,b,c){X||W||0===gi||(Yh(gi,!1),gi=0);var d=X;X=!0;try{return r.unstable_runWithPriority(r.unstable_UserBlockingPriority,function(){return a(b,c)})}finally{(X=d)||W||Yh(1073741823,!1)}}
function Ji(a,b,c,d,e){var f=b.current;a:if(c){c=c._reactInternalFiber;b:{2===ed(c)&&1===c.tag?void 0:x("170");var g=c;do{switch(g.tag){case 3:g=g.stateNode.context;break b;case 1:if(J(g.type)){g=g.stateNode.__reactInternalMemoizedMergedChildContext;break b}}g=g.return}while(null!==g);x("171");g=void 0}if(1===c.tag){var h=c.type;if(J(h)){c=Ne(c,h,g);break a}}c=g}else c=He;null===b.context?b.context=c:b.pendingContext=c;b=e;e=nf(d);e.payload={element:a};b=void 0===b?null:b;null!==b&&(e.callback=b);
of();pf(f,e);qf(f,d);return d}function Ki(a,b,c,d){var e=b.current,f=lf();e=mf(f,e);return Ji(a,b,c,e,d)}function Li(a){a=a.current;if(!a.child)return null;switch(a.child.tag){case 5:return a.child.stateNode;default:return a.child.stateNode}}function Mi(a,b,c){var d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return{$$typeof:Wb,key:null==d?null:""+d,children:a,containerInfo:b,implementation:c}}
Ab=function(a,b,c){switch(b){case "input":yc(a,c);b=c.name;if("radio"===c.type&&null!=b){for(c=a;c.parentNode;)c=c.parentNode;c=c.querySelectorAll("input[name="+JSON.stringify(""+b)+'][type="radio"]');for(b=0;b<c.length;b++){var d=c[b];if(d!==a&&d.form===a.form){var e=Ka(d);e?void 0:x("90");Sb(d);yc(d,e)}}}break;case "textarea":de(a,c);break;case "select":b=c.value,null!=b&&ae(a,!!c.multiple,b,!1)}};
function Ni(a){var b=1073741822-25*(((1073741822-lf()+500)/25|0)+1);b>=Jh&&(b=Jh-1);this._expirationTime=Jh=b;this._root=a;this._callbacks=this._next=null;this._hasChildren=this._didComplete=!1;this._children=null;this._defer=!0}Ni.prototype.render=function(a){this._defer?void 0:x("250");this._hasChildren=!0;this._children=a;var b=this._root._internalRoot,c=this._expirationTime,d=new Oi;Ji(a,b,null,c,d._onCommit);return d};
Ni.prototype.then=function(a){if(this._didComplete)a();else{var b=this._callbacks;null===b&&(b=this._callbacks=[]);b.push(a)}};
Ni.prototype.commit=function(){var a=this._root._internalRoot,b=a.firstBatch;this._defer&&null!==b?void 0:x("251");if(this._hasChildren){var c=this._expirationTime;if(b!==this){this._hasChildren&&(c=this._expirationTime=b._expirationTime,this.render(this._children));for(var d=null,e=b;e!==this;)d=e,e=e._next;null===d?x("251"):void 0;d._next=e._next;this._next=b;a.firstBatch=this}this._defer=!1;Bi(a,c);b=this._next;this._next=null;b=a.firstBatch=b;null!==b&&b._hasChildren&&b.render(b._children)}else this._next=
null,this._defer=!1};Ni.prototype._onComplete=function(){if(!this._didComplete){this._didComplete=!0;var a=this._callbacks;if(null!==a)for(var b=0;b<a.length;b++)(0,a[b])()}};function Oi(){this._callbacks=null;this._didCommit=!1;this._onCommit=this._onCommit.bind(this)}Oi.prototype.then=function(a){if(this._didCommit)a();else{var b=this._callbacks;null===b&&(b=this._callbacks=[]);b.push(a)}};
Oi.prototype._onCommit=function(){if(!this._didCommit){this._didCommit=!0;var a=this._callbacks;if(null!==a)for(var b=0;b<a.length;b++){var c=a[b];"function"!==typeof c?x("191",c):void 0;c()}}};
function Pi(a,b,c){b=K(3,null,null,b?3:0);a={current:b,containerInfo:a,pendingChildren:null,pingCache:null,earliestPendingTime:0,latestPendingTime:0,earliestSuspendedTime:0,latestSuspendedTime:0,latestPingedTime:0,didError:!1,pendingCommitExpirationTime:0,finishedWork:null,timeoutHandle:-1,context:null,pendingContext:null,hydrate:c,nextExpirationTimeToWorkOn:0,expirationTime:0,firstBatch:null,nextScheduledRoot:null};this._internalRoot=b.stateNode=a}
Pi.prototype.render=function(a,b){var c=this._internalRoot,d=new Oi;b=void 0===b?null:b;null!==b&&d.then(b);Ki(a,c,null,d._onCommit);return d};Pi.prototype.unmount=function(a){var b=this._internalRoot,c=new Oi;a=void 0===a?null:a;null!==a&&c.then(a);Ki(null,b,null,c._onCommit);return c};Pi.prototype.legacy_renderSubtreeIntoContainer=function(a,b,c){var d=this._internalRoot,e=new Oi;c=void 0===c?null:c;null!==c&&e.then(c);Ki(b,d,a,e._onCommit);return e};
Pi.prototype.createBatch=function(){var a=new Ni(this),b=a._expirationTime,c=this._internalRoot,d=c.firstBatch;if(null===d)c.firstBatch=a,a._next=null;else{for(c=null;null!==d&&d._expirationTime>=b;)c=d,d=d._next;a._next=d;null!==c&&(c._next=a)}return a};function Qi(a){return!(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType&&(8!==a.nodeType||" react-mount-point-unstable "!==a.nodeValue))}Gb=Gi;Hb=Ii;Ib=function(){W||0===gi||(Yh(gi,!1),gi=0)};
function Ri(a,b){b||(b=a?9===a.nodeType?a.documentElement:a.firstChild:null,b=!(!b||1!==b.nodeType||!b.hasAttribute("data-reactroot")));if(!b)for(var c;c=a.lastChild;)a.removeChild(c);return new Pi(a,!1,b)}
function Si(a,b,c,d,e){var f=c._reactRootContainer;if(f){if("function"===typeof e){var g=e;e=function(){var a=Li(f._internalRoot);g.call(a)}}null!=a?f.legacy_renderSubtreeIntoContainer(a,b,e):f.render(b,e)}else{f=c._reactRootContainer=Ri(c,d);if("function"===typeof e){var h=e;e=function(){var a=Li(f._internalRoot);h.call(a)}}Hi(function(){null!=a?f.legacy_renderSubtreeIntoContainer(a,b,e):f.render(b,e)})}return Li(f._internalRoot)}
function Ti(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;Qi(b)?void 0:x("200");return Mi(a,b,null,c)}
var Vi={createPortal:Ti,findDOMNode:function(a){if(null==a)return null;if(1===a.nodeType)return a;var b=a._reactInternalFiber;void 0===b&&("function"===typeof a.render?x("188"):x("268",Object.keys(a)));a=hd(b);a=null===a?null:a.stateNode;return a},hydrate:function(a,b,c){Qi(b)?void 0:x("200");return Si(null,a,b,!0,c)},render:function(a,b,c){Qi(b)?void 0:x("200");return Si(null,a,b,!1,c)},unstable_renderSubtreeIntoContainer:function(a,b,c,d){Qi(c)?void 0:x("200");null==a||void 0===a._reactInternalFiber?
x("38"):void 0;return Si(a,b,c,!1,d)},unmountComponentAtNode:function(a){Qi(a)?void 0:x("40");return a._reactRootContainer?(Hi(function(){Si(null,null,a,!1,function(){a._reactRootContainer=null})}),!0):!1},unstable_createPortal:function(){return Ti.apply(void 0,arguments)},unstable_batchedUpdates:Gi,unstable_interactiveUpdates:Ii,flushSync:function(a,b){W?x("187"):void 0;var c=X;X=!0;try{return ki(a,b)}finally{X=c,Yh(1073741823,!1)}},unstable_createRoot:Ui,unstable_flushControlled:function(a){var b=
X;X=!0;try{ki(a)}finally{(X=b)||W||Yh(1073741823,!1)}},__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{Events:[Ia,Ja,Ka,Ba.injectEventPluginsByName,pa,Qa,function(a){ya(a,Pa)},Eb,Fb,Dd,Da]}};function Ui(a,b){Qi(a)?void 0:x("299","unstable_createRoot");return new Pi(a,!0,null!=b&&!0===b.hydrate)}
(function(a){var b=a.findFiberByHostInstance;return Te(n({},a,{overrideProps:null,currentDispatcherRef:Tb.ReactCurrentDispatcher,findHostInstanceByFiber:function(a){a=hd(a);return null===a?null:a.stateNode},findFiberByHostInstance:function(a){return b?b(a):null}}))})({findFiberByHostInstance:Ha,bundleType:0,version:"16.8.6",rendererPackageName:"react-dom"});var Wi={default:Vi},Xi=Wi&&Vi||Wi;module.exports=Xi.default||Xi;

},{"react":"1n8/","object-assign":"J4Nk","scheduler":"MDSO"}],"NKHc":[function(require,module,exports) {
'use strict';

function checkDCE() {
  /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== 'function') {
    return;
  }

  if ("production" !== 'production') {
    // This branch is unreachable because this function is only called
    // in production, but the condition is true only in development.
    // Therefore if the branch is still here, dead code elimination wasn't
    // properly applied.
    // Don't change the message. React DevTools relies on it. Also make sure
    // this message doesn't occur elsewhere in this function, or it will cause
    // a false positive.
    throw new Error('^_^');
  }

  try {
    // Verify that the code above has been dead code eliminated (DCE'd).
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    // DevTools shouldn't crash React, no matter what.
    // We should still report in case we break this code.
    console.error(err);
  }
}

if ("production" === 'production') {
  // DCE check should happen before ReactDOM bundle executes so that
  // DevTools can report bad minification during injection.
  checkDCE();
  module.exports = require('./cjs/react-dom.production.min.js');
} else {
  module.exports = require('./cjs/react-dom.development.js');
}
},{"./cjs/react-dom.production.min.js":"i17t"}],"9qb7":[function(require,module,exports) {
var define;
/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg) && arg.length) {
				var inner = classNames.apply(null, arg);
				if (inner) {
					classes.push(inner);
				}
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],"3dZY":[function(require,module,exports) {
var define;
!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):t.dayjs=n()}(this,function(){"use strict";var t="millisecond",n="second",e="minute",r="hour",i="day",s="week",u="month",o="quarter",a="year",h=/^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/,f=/\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,c=function(t,n,e){var r=String(t);return!r||r.length>=n?t:""+Array(n+1-r.length).join(e)+t},d={s:c,z:function(t){var n=-t.utcOffset(),e=Math.abs(n),r=Math.floor(e/60),i=e%60;return(n<=0?"+":"-")+c(r,2,"0")+":"+c(i,2,"0")},m:function(t,n){var e=12*(n.year()-t.year())+(n.month()-t.month()),r=t.clone().add(e,u),i=n-r<0,s=t.clone().add(e+(i?-1:1),u);return Number(-(e+(n-r)/(i?r-s:s-r))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(h){return{M:u,y:a,w:s,d:i,h:r,m:e,s:n,ms:t,Q:o}[h]||String(h||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},$={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},l="en",m={};m[l]=$;var y=function(t){return t instanceof v},M=function(t,n,e){var r;if(!t)return l;if("string"==typeof t)m[t]&&(r=t),n&&(m[t]=n,r=t);else{var i=t.name;m[i]=t,r=i}return e||(l=r),r},g=function(t,n,e){if(y(t))return t.clone();var r=n?"string"==typeof n?{format:n,pl:e}:n:{};return r.date=t,new v(r)},D=d;D.l=M,D.i=y,D.w=function(t,n){return g(t,{locale:n.$L,utc:n.$u})};var v=function(){function c(t){this.$L=this.$L||M(t.locale,null,!0),this.parse(t)}var d=c.prototype;return d.parse=function(t){this.$d=function(t){var n=t.date,e=t.utc;if(null===n)return new Date(NaN);if(D.u(n))return new Date;if(n instanceof Date)return new Date(n);if("string"==typeof n&&!/Z$/i.test(n)){var r=n.match(h);if(r)return e?new Date(Date.UTC(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)):new Date(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)}return new Date(n)}(t),this.init()},d.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},d.$utils=function(){return D},d.isValid=function(){return!("Invalid Date"===this.$d.toString())},d.isSame=function(t,n){var e=g(t);return this.startOf(n)<=e&&e<=this.endOf(n)},d.isAfter=function(t,n){return g(t)<this.startOf(n)},d.isBefore=function(t,n){return this.endOf(n)<g(t)},d.$g=function(t,n,e){return D.u(t)?this[n]:this.set(e,t)},d.year=function(t){return this.$g(t,"$y",a)},d.month=function(t){return this.$g(t,"$M",u)},d.day=function(t){return this.$g(t,"$W",i)},d.date=function(t){return this.$g(t,"$D","date")},d.hour=function(t){return this.$g(t,"$H",r)},d.minute=function(t){return this.$g(t,"$m",e)},d.second=function(t){return this.$g(t,"$s",n)},d.millisecond=function(n){return this.$g(n,"$ms",t)},d.unix=function(){return Math.floor(this.valueOf()/1e3)},d.valueOf=function(){return this.$d.getTime()},d.startOf=function(t,o){var h=this,f=!!D.u(o)||o,c=D.p(t),d=function(t,n){var e=D.w(h.$u?Date.UTC(h.$y,n,t):new Date(h.$y,n,t),h);return f?e:e.endOf(i)},$=function(t,n){return D.w(h.toDate()[t].apply(h.toDate(),(f?[0,0,0,0]:[23,59,59,999]).slice(n)),h)},l=this.$W,m=this.$M,y=this.$D,M="set"+(this.$u?"UTC":"");switch(c){case a:return f?d(1,0):d(31,11);case u:return f?d(1,m):d(0,m+1);case s:var g=this.$locale().weekStart||0,v=(l<g?l+7:l)-g;return d(f?y-v:y+(6-v),m);case i:case"date":return $(M+"Hours",0);case r:return $(M+"Minutes",1);case e:return $(M+"Seconds",2);case n:return $(M+"Milliseconds",3);default:return this.clone()}},d.endOf=function(t){return this.startOf(t,!1)},d.$set=function(s,o){var h,f=D.p(s),c="set"+(this.$u?"UTC":""),d=(h={},h[i]=c+"Date",h.date=c+"Date",h[u]=c+"Month",h[a]=c+"FullYear",h[r]=c+"Hours",h[e]=c+"Minutes",h[n]=c+"Seconds",h[t]=c+"Milliseconds",h)[f],$=f===i?this.$D+(o-this.$W):o;if(f===u||f===a){var l=this.clone().set("date",1);l.$d[d]($),l.init(),this.$d=l.set("date",Math.min(this.$D,l.daysInMonth())).toDate()}else d&&this.$d[d]($);return this.init(),this},d.set=function(t,n){return this.clone().$set(t,n)},d.get=function(t){return this[D.p(t)]()},d.add=function(t,o){var h,f=this;t=Number(t);var c=D.p(o),d=function(n){var e=g(f);return D.w(e.date(e.date()+Math.round(n*t)),f)};if(c===u)return this.set(u,this.$M+t);if(c===a)return this.set(a,this.$y+t);if(c===i)return d(1);if(c===s)return d(7);var $=(h={},h[e]=6e4,h[r]=36e5,h[n]=1e3,h)[c]||1,l=this.valueOf()+t*$;return D.w(l,this)},d.subtract=function(t,n){return this.add(-1*t,n)},d.format=function(t){var n=this;if(!this.isValid())return"Invalid Date";var e=t||"YYYY-MM-DDTHH:mm:ssZ",r=D.z(this),i=this.$locale(),s=this.$H,u=this.$m,o=this.$M,a=i.weekdays,h=i.months,c=function(t,r,i,s){return t&&(t[r]||t(n,e))||i[r].substr(0,s)},d=function(t){return D.s(s%12||12,t,"0")},$=i.meridiem||function(t,n,e){var r=t<12?"AM":"PM";return e?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:o+1,MM:D.s(o+1,2,"0"),MMM:c(i.monthsShort,o,h,3),MMMM:h[o]||h(this,e),D:this.$D,DD:D.s(this.$D,2,"0"),d:String(this.$W),dd:c(i.weekdaysMin,this.$W,a,2),ddd:c(i.weekdaysShort,this.$W,a,3),dddd:a[this.$W],H:String(s),HH:D.s(s,2,"0"),h:d(1),hh:d(2),a:$(s,u,!0),A:$(s,u,!1),m:String(u),mm:D.s(u,2,"0"),s:String(this.$s),ss:D.s(this.$s,2,"0"),SSS:D.s(this.$ms,3,"0"),Z:r};return e.replace(f,function(t,n){return n||l[t]||r.replace(":","")})},d.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},d.diff=function(t,h,f){var c,d=D.p(h),$=g(t),l=6e4*($.utcOffset()-this.utcOffset()),m=this-$,y=D.m(this,$);return y=(c={},c[a]=y/12,c[u]=y,c[o]=y/3,c[s]=(m-l)/6048e5,c[i]=(m-l)/864e5,c[r]=m/36e5,c[e]=m/6e4,c[n]=m/1e3,c)[d]||m,f?y:D.a(y)},d.daysInMonth=function(){return this.endOf(u).$D},d.$locale=function(){return m[this.$L]},d.locale=function(t,n){if(!t)return this.$L;var e=this.clone();return e.$L=M(t,n,!0),e},d.clone=function(){return D.w(this.toDate(),this)},d.toDate=function(){return new Date(this.$d)},d.toJSON=function(){return this.toISOString()},d.toISOString=function(){return this.$d.toISOString()},d.toString=function(){return this.$d.toUTCString()},c}();return g.prototype=v.prototype,g.extend=function(t,n){return t(n,v,g),g},g.locale=M,g.isDayjs=y,g.unix=function(t){return g(1e3*t)},g.en=m[l],g.Ls=m,g});

},{}],"B5kD":[function(require,module,exports) {
var define;
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.dayjs_plugin_calendar=t()}(this,function(){"use strict";return function(e,t,a){var d="h:mm A",n={lastDay:"[Yesterday at] "+d,sameDay:"[Today at] "+d,nextDay:"[Tomorrow at] "+d,nextWeek:"dddd [at] "+d,lastWeek:"[Last] dddd [at] "+d,sameElse:"MM/DD/YYYY"};t.prototype.calendar=function(e,t){var d=t||this.$locale().calendar||n,s=a(e||void 0).startOf("d"),o=this.diff(s,"d",!0),r=o<-6?"sameElse":o<-1?"lastWeek":o<0?"lastDay":o<1?"sameDay":o<2?"nextDay":o<7?"nextWeek":"sameElse";return this.format(d[r]||n[r])}}});

},{}],"7ZQM":[function(require,module,exports) {
var define;
!function(_,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("dayjs")):"function"==typeof define&&define.amd?define(["dayjs"],t):_.dayjs_locale_ru=t(_.dayjs)}(this,function(_){"use strict";_=_&&_.hasOwnProperty("default")?_.default:_;var t="января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря".split("_"),e="январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),n="янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.".split("_"),s="янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.".split("_"),d=/D[oD]?(\[[^[\]]*\]|\s)+MMMM?/,o={name:"ru",weekdays:"воскресенье_понедельник_вторник_среда_четверг_пятница_суббота".split("_"),weekdaysShort:"вск_пнд_втр_срд_чтв_птн_сбт".split("_"),weekdaysMin:"вс_пн_вт_ср_чт_пт_сб".split("_"),months:function(_,n){return d.test(n)?t[_.month()]:e[_.month()]},monthsShort:function(_,t){return d.test(t)?n[_.month()]:s[_.month()]},weekStart:1,formats:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY г.",LLL:"D MMMM YYYY г., H:mm",LLLL:"dddd, D MMMM YYYY г., H:mm"},relativeTime:{future:"через %s",past:"%s назад",s:"несколько секунд",m:"минута",mm:"%d минут",h:"час",hh:"%d часов",d:"день",dd:"%d дней",M:"месяц",MM:"%d месяцев",y:"год",yy:"%d лет"},ordinal:function(_){return _}};return _.locale(o,null,!0),o});

},{"dayjs":"3dZY"}],"70rD":[function(require,module,exports) {

},{}],"xqZa":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Styles are imported as strings via fs.readFileSync in order to include
 * them into a single bundle JS file, not copy to /dist folder
 */

var fs = require('fs'); // Styles outside the Chat iframe


exports.DefaultWidgetGlobalStyles = ".elixirchat-widget-button {\n  position: fixed;\n  bottom: 30px;\n  right: 30px;\n  width: 60px;\n  height: 60px;\n  border: 0;\n  cursor: pointer;\n  border-radius: 100%;\n  background-color: #FF006E;\n  box-shadow: 0 0 25px rgba(0,0,0,.15);\n  outline: none;\n  z-index: 999999;\n}\n\n.elixirchat-widget-button:after,\n.elixirchat-widget-button:before {\n  content: \"\";\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  transition: opacity 300ms;\n}\n\n.elixirchat-widget-button:after {\n  background: var(--ElixirChatWidgetIconChat) no-repeat center 18px;\n  background-size: 29px;\n}\n\n.elixirchat-widget-button:before {\n  background: var(--ElixirChatWidgetIconClose) no-repeat center 21px;\n  background-size: 20px;\n}\n\n.elixirchat-widget-button:before {\n  opacity: 0;\n}\n\n.elixirchat-widget-button--visible:after {\n  opacity: 0;\n}\n\n.elixirchat-widget-button--visible:before {\n  opacity: 1;\n}\n\n.elixirchat-widget-iframe {\n  border-radius: 8px;\n  background: #ffffff;\n  position: fixed;\n  max-height: 600px;\n  height: calc(100vh - 130px);\n  width: 380px;\n  bottom: 100px;\n  right: 30px;\n  border: 0;\n  box-shadow: 0 0 60px rgba(0,0,0,.15);\n  z-index: 999998;\n  transition: all 200ms;\n  opacity: 1;\n  transform: none;\n  transform-origin: bottom right;\n}\n\n.elixirchat-widget-iframe--opening {\n  opacity: 0;\n  transform: translateY(15px) scale(0.9);\n}\n"; // Styles inside the Chat iframe

exports.DefaultWidgetStyles = "body {\n  margin: 0;\n  padding: 0;\n}\n\nbody,\ninput,\nbutton,\ntextarea {\n  font: 14px/18px Graphik, 'Helvetica Neue', sans-serif;\n  outline: none;\n  color: #151319;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.elixirchat-chat-container {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  left: 0;\n}\n\n.elixirchat-chat-header {\n  margin: 0;\n  font-size: 16px;\n  height: 53px;\n  box-sizing: border-box;\n  box-shadow: 0 1px 0 rgba(0,0,0,.15);\n  padding: 19px 0 0 30px;\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  z-index: 2;\n  border-radius: 8px 8px 0 0;\n  background: #ffffff;\n}\n\n.elixirchat-chat-header__indicator {\n  display: inline-block;\n  width: 10px;\n  height: 10px;\n  border-radius: 100%;\n  background: #50C900;\n  vertical-align: middle;\n  margin-right: 8px;\n  margin-top: -2px;\n}\n\n.elixirchat-chat-header__close {\n  width: 53px;\n  height: 53px;\n  border: 0;\n  background: transparent var(--ElixirChatChatCloseIconBlack) no-repeat center;\n  background-size: 15px;\n  opacity: .22;\n  position: absolute;\n  top: 1px;\n  right: 0;\n  transition: opacity 200ms;\n}\n\n.elixirchat-chat-header__close:hover {\n  opacity: .4;\n}\n\n.elixirchat-chat-scroll {\n  position: fixed;\n  top: 53px;\n  left: 0;\n  right: 0;\n  bottom: 110px;\n  overflow-x: hidden;\n  overflow-y: auto;\n  padding: 20px 30px;\n}\n\n@keyframes spinner {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n.elixirchat-chat-spinner {\n  position: fixed;\n  top: 50%;\n  margin: -45px 0 0 -45px;\n  left: 50%;\n  display: block;\n  width: 90px;\n  height: 90px;\n  border-radius: 100%;\n  border: 1px solid #E2E2E2;\n  animation: spinner 1s linear infinite;\n}\n\n.elixirchat-chat-spinner:after {\n  content: '';\n  background: #ffffff;\n  width: 5px;\n  height: 30px;\n  position: absolute;\n  top: 50%;\n  margin: -15px 0 0 0;\n  left: -2px;\n}\n";
exports.DefaultWidgetMessagesStyles = ".elixirchat-chat-messages {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n}\n\n.elixirchat-chat-messages__date-title {\n  text-transform: uppercase;\n  font-size: 12px;\n  font-weight: bold;\n  border-bottom: 1px solid #151319;\n  line-height: 21px;\n  margin-bottom: 15px;\n  width: 100%;\n}\n\n.elixirchat-chat-messages__item {\n  max-width: 80%;\n  min-width: 50%;\n  margin-bottom: 15px;\n}\n\n.elixirchat-chat-messages__sender {\n  color: #0033FF;\n  font-weight: bold;\n  padding-bottom: 1px;\n}\n\n.elixirchat-chat-messages__text {\n  white-space: pre-wrap;\n}\n\n.elixirchat-chat-messages__timestamp {\n  text-align: right;\n  color: #999999;\n  padding-top: 3px;\n}\n\n.elixirchat-chat-messages__item--by-me .elixirchat-chat-messages__balloon {\n  padding: 9px 10px 7px 10px;\n  border-radius: 3px;\n  background: #0033FF;\n  color: #ffffff;\n}\n\n.elixirchat-chat-messages__item--by-me .elixirchat-chat-messages__sender {\n  color: #ffffff;\n}\n\n.elixirchat-chat-messages__item--by-agent {\n  align-self: flex-start;\n}\n\n.elixirchat-chat-messages__item--by-agent .elixirchat-chat-messages__sender {\n  color: #FF006E;\n}\n\n.elixirchat-chat-messages__item--by-agent .elixirchat-chat-messages__timestamp {\n  text-align: left;\n}\n";
exports.DefaultWidgetTextareaStyles = ".elixirchat-chat-textarea {\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background: #ffffff;\n  z-index: 3;\n  box-shadow: 0 -1px 0 rgba(0,0,0,.15);\n  border-radius: 0 0 8px 8px;\n}\n\n.elixirchat-chat-typing {\n  position: absolute;\n  background: #ffffff;\n  left: 0;\n  right: 0;\n  bottom: 100%;\n  font-weight: bold;\n  color: #D5D5D5;\n  padding: 0 30px 18px 56px;\n  box-shadow: 0 -15px 15px 6px rgba(255,255,255,.99), inset 0 -1px 0 rgba(0,0,0,.15);\n}\n\n.elixirchat-chat-typing:before {\n  content: \"\";\n  position: absolute;\n  left: 30px;\n  top: 3px;\n  width: 18px;\n  height: 11px;\n  background: var(--ElixirChatChatTypingIconBlack) no-repeat center;\n  background-size: contain;\n  opacity: .15;\n  z-index: 2;\n}\n\n.elixirchat-chat-textarea__actions {\n  position: absolute;\n  right: 20px;\n  bottom: 20px;\n  z-index: 2;\n  transition: transform 200ms;\n}\n\n.elixirchat-chat-textarea__actions--collapsed {\n  transform: translateY(9px);\n}\n\n.elixirchat-chat-textarea__actions-screenshot,\n.elixirchat-chat-textarea__actions-attach {\n  width: 38px;\n  height: 31px;\n  border: 1px solid #D5D5D5;\n  border-radius: 7px;\n  position: relative;\n  margin-left: 10px;\n  display: inline-block;\n  vertical-align: top;\n  box-sizing: border-box;\n  overflow: hidden;\n  transition: background-color 200ms;\n  background: #ffffff;\n}\n\n.elixirchat-chat-textarea__actions-attach-input {\n  position: absolute;\n  z-index: 1;\n  opacity: 0;\n}\n\n.elixirchat-chat-textarea__actions-attach-label {\n  position: absolute;\n  z-index: 2;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n}\n\n.elixirchat-chat-textarea__actions-screenshot:hover,\n.elixirchat-chat-textarea__actions-attach-label:hover {\n  background-color: #f5f5f5;\n}\n\n.elixirchat-chat-textarea__actions-screenshot:after,\n.elixirchat-chat-textarea__actions-attach-label:after {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  opacity: .25;\n}\n\n.elixirchat-chat-textarea__actions-screenshot:after {\n  background: var(--ElixirChatChatScreenshotIconBlack) no-repeat center;\n  background-size: 20px 14px;\n}\n\n.elixirchat-chat-textarea__actions-attach-label:after {\n  background: var(--ElixirChatChatAttachIconBlack) center no-repeat;\n  background-size: 20px 14px;\n}\n\n.elixirchat-chat-textarea__textarea {\n  border: 0;\n  position: relative;\n  left: 0;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  padding: 17px 0 0 30px;\n  margin-bottom: 17px;\n  resize: none;\n  width: calc(100% - 120px);\n}\n\n.elixirchat-chat-attachment-list {\n  padding: 0;\n  margin: -2px 0 15px 30px;\n  list-style: none;\n  line-height: 22px;\n  color: #0033FF;\n}\n\n.elixirchat-chat-attachment-item {\n  margin: 0;\n  white-space: nowrap;\n}\n\n.elixirchat-chat-attachment-icon {\n  display: inline-block;\n  margin-right: 10px;\n  width: 14px;\n  height: 14px;\n  background: var(--ElixirChatChatAttachIconBlue) no-repeat center;\n  background-size: contain;\n  vertical-align: middle;\n}\n\n.elixirchat-chat-attachment-icon--screenshot {\n  width: 16px;\n  height: 12px;\n  background: var(--ElixirChatChatScreenshotIconBlue) no-repeat center;\n  margin-top: -2px;\n}\n\n.elixirchat-chat-attachment-filename {\n  max-width: calc(100% - 165px);\n  display: inline-block;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  vertical-align: middle;\n}\n\n.elixirchat-chat-attachment-remove {\n  width: 11px;\n  height: 11px;\n  margin-left: 9px;\n  display: inline-block;\n  vertical-align: middle;\n  background: var(--ElixirChatChatRemoveIconBlue) no-repeat center;\n  background-size: contain;\n}\n";
},{"fs":"70rD"}],"Q0s5":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = __importStar(require("react"));

var classnames_1 = __importDefault(require("classnames"));

var dayjs_1 = __importDefault(require("dayjs"));

var calendar_1 = __importDefault(require("dayjs/plugin/calendar"));

require("dayjs/locale/ru");

var styles_1 = require("./styles");

var DefaultWidgetMessages =
/*#__PURE__*/
function (_react_1$Component) {
  _inherits(DefaultWidgetMessages, _react_1$Component);

  function DefaultWidgetMessages() {
    var _this;

    _classCallCheck(this, DefaultWidgetMessages);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DefaultWidgetMessages).apply(this, arguments));
    _this.state = {
      messages: []
    };

    _this.processMessages = function (messages) {
      return messages.map(function (message, i) {
        var previousMessage = messages[i - 1];

        if (previousMessage) {
          var isDayEarlier = dayjs_1.default(previousMessage.timestamp).isBefore(dayjs_1.default(message.timestamp).startOf('day'));

          if (isDayEarlier) {
            message.prependDateTitle = true;
          }
        }

        return message;
      });
    };

    return _this;
  }

  _createClass(DefaultWidgetMessages, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      dayjs_1.default.locale('ru');
      dayjs_1.default.extend(calendar_1.default);
      this.props.elixirChatWidget.injectIframeStyles(styles_1.DefaultWidgetMessagesStyles);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.messages.length !== this.props.messages.length) {
        this.setState({
          messages: this.processMessages(this.props.messages)
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var messages = this.state.messages;
      return react_1.default.createElement("div", {
        className: "elixirchat-chat-messages"
      }, messages.map(function (message) {
        return react_1.default.createElement(react_1.Fragment, {
          key: message.id
        }, message.prependDateTitle && react_1.default.createElement("div", {
          className: "elixirchat-chat-messages__date-title"
        }, dayjs_1.default(message.timestamp).calendar(null, {
          sameDay: '[Сегодня, ] D MMMM',
          lastDay: '[Вчера, ] D MMMM',
          lastWeek: 'D MMMM',
          sameElse: 'D MMMM'
        })), react_1.default.createElement("div", {
          className: classnames_1.default({
            'elixirchat-chat-messages__item': true,
            'elixirchat-chat-messages__item--by-me': message.sender.isCurrentClient,
            'elixirchat-chat-messages__item--by-agent': message.sender.isAgent
          })
        }, react_1.default.createElement("div", {
          className: "elixirchat-chat-messages__balloon"
        }, react_1.default.createElement("div", {
          className: "elixirchat-chat-messages__sender"
        }, message.sender.isCurrentClient ? 'Я' : (message.sender.firstName || '') + ' ' + (message.sender.lastName || '')), react_1.default.createElement("div", {
          className: "elixirchat-chat-messages__text"
        }, message.text)), react_1.default.createElement("div", {
          className: "elixirchat-chat-messages__timestamp"
        }, dayjs_1.default(message.timestamp).format('H:mm, D MMMM')
        /* TODO: handle US date format e.g. "2:30 PM, July 10" */
        )));
      }));
    }
  }]);

  return DefaultWidgetMessages;
}(react_1.Component);

exports.DefaultWidgetMessages = DefaultWidgetMessages;
},{"react":"1n8/","classnames":"9qb7","dayjs":"3dZY","dayjs/plugin/calendar":"B5kD","dayjs/locale/ru":"7ZQM","./styles":"xqZa"}],"SpjQ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _extends;

function _extends() {
  exports.default = _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}
},{}],"3Vab":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _objectWithoutPropertiesLoose;

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}
},{}],"S11h":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _inheritsLoose;

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}
},{}],"bk0i":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _assertThisInitialized;

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}
},{}],"Asjh":[function(require,module,exports) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;

},{}],"wVGV":[function(require,module,exports) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

},{"./lib/ReactPropTypesSecret":"Asjh"}],"5D9O":[function(require,module,exports) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
if ("production" !== 'production') {
  var ReactIs = require('react-is'); // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod


  var throwOnDirectAccess = true;
  module.exports = require('./factoryWithTypeCheckers')(ReactIs.isElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = require('./factoryWithThrowingShims')();
}
},{"./factoryWithThrowingShims":"wVGV"}],"0Ldd":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/objectWithoutPropertiesLoose"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/inheritsLoose"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/assertThisInitialized"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isIE = !!document.documentElement.currentStyle;
var HIDDEN_TEXTAREA_STYLE = {
  'min-height': '0',
  'max-height': 'none',
  height: '0',
  visibility: 'hidden',
  overflow: 'hidden',
  position: 'absolute',
  'z-index': '-1000',
  top: '0',
  right: '0'
};
var SIZING_STYLE = ['letter-spacing', 'line-height', 'font-family', 'font-weight', 'font-size', 'font-style', 'tab-size', 'text-rendering', 'text-transform', 'width', 'text-indent', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width', 'box-sizing'];
var computedStyleCache = {};
var hiddenTextarea = document.createElement('textarea');

var forceHiddenStyles = function forceHiddenStyles(node) {
  Object.keys(HIDDEN_TEXTAREA_STYLE).forEach(function (key) {
    node.style.setProperty(key, HIDDEN_TEXTAREA_STYLE[key], 'important');
  });
};

{
  forceHiddenStyles(hiddenTextarea);
}

function calculateNodeHeight(uiTextNode, uid, useCache, minRows, maxRows) {
  if (useCache === void 0) {
    useCache = false;
  }

  if (minRows === void 0) {
    minRows = null;
  }

  if (maxRows === void 0) {
    maxRows = null;
  }

  if (hiddenTextarea.parentNode === null) {
    document.body.appendChild(hiddenTextarea);
  } // Copy all CSS properties that have an impact on the height of the content in
  // the textbox


  var nodeStyling = calculateNodeStyling(uiTextNode, uid, useCache);

  if (nodeStyling === null) {
    return null;
  }

  var paddingSize = nodeStyling.paddingSize,
      borderSize = nodeStyling.borderSize,
      boxSizing = nodeStyling.boxSizing,
      sizingStyle = nodeStyling.sizingStyle; // Need to have the overflow attribute to hide the scrollbar otherwise
  // text-lines will not calculated properly as the shadow will technically be
  // narrower for content

  Object.keys(sizingStyle).forEach(function (key) {
    hiddenTextarea.style[key] = sizingStyle[key];
  });
  forceHiddenStyles(hiddenTextarea);
  hiddenTextarea.value = uiTextNode.value || uiTextNode.placeholder || 'x';
  var minHeight = -Infinity;
  var maxHeight = Infinity;
  var height = hiddenTextarea.scrollHeight;

  if (boxSizing === 'border-box') {
    // border-box: add border, since height = content + padding + border
    height = height + borderSize;
  } else if (boxSizing === 'content-box') {
    // remove padding, since height = content
    height = height - paddingSize;
  } // measure height of a textarea with a single row


  hiddenTextarea.value = 'x';
  var singleRowHeight = hiddenTextarea.scrollHeight - paddingSize; // Stores the value's rows count rendered in `hiddenTextarea`,
  // regardless if `maxRows` or `minRows` props are passed

  var valueRowCount = Math.floor(height / singleRowHeight);

  if (minRows !== null) {
    minHeight = singleRowHeight * minRows;

    if (boxSizing === 'border-box') {
      minHeight = minHeight + paddingSize + borderSize;
    }

    height = Math.max(minHeight, height);
  }

  if (maxRows !== null) {
    maxHeight = singleRowHeight * maxRows;

    if (boxSizing === 'border-box') {
      maxHeight = maxHeight + paddingSize + borderSize;
    }

    height = Math.min(maxHeight, height);
  }

  var rowCount = Math.floor(height / singleRowHeight);
  return {
    height: height,
    minHeight: minHeight,
    maxHeight: maxHeight,
    rowCount: rowCount,
    valueRowCount: valueRowCount
  };
}

function calculateNodeStyling(node, uid, useCache) {
  if (useCache === void 0) {
    useCache = false;
  }

  if (useCache && computedStyleCache[uid]) {
    return computedStyleCache[uid];
  }

  var style = window.getComputedStyle(node);

  if (style === null) {
    return null;
  }

  var sizingStyle = SIZING_STYLE.reduce(function (obj, name) {
    obj[name] = style.getPropertyValue(name);
    return obj;
  }, {});
  var boxSizing = sizingStyle['box-sizing']; // probably node is detached from DOM, can't read computed dimensions

  if (boxSizing === '') {
    return null;
  } // IE (Edge has already correct behaviour) returns content width as computed width
  // so we need to add manually padding and border widths


  if (isIE && boxSizing === 'border-box') {
    sizingStyle.width = parseFloat(sizingStyle.width) + parseFloat(style['border-right-width']) + parseFloat(style['border-left-width']) + parseFloat(style['padding-right']) + parseFloat(style['padding-left']) + 'px';
  }

  var paddingSize = parseFloat(sizingStyle['padding-bottom']) + parseFloat(sizingStyle['padding-top']);
  var borderSize = parseFloat(sizingStyle['border-bottom-width']) + parseFloat(sizingStyle['border-top-width']);
  var nodeInfo = {
    sizingStyle: sizingStyle,
    paddingSize: paddingSize,
    borderSize: borderSize,
    boxSizing: boxSizing
  };

  if (useCache) {
    computedStyleCache[uid] = nodeInfo;
  }

  return nodeInfo;
}

var purgeCache = function purgeCache(uid) {
  delete computedStyleCache[uid];
};

var noop = function noop() {};

var uid = 0;

var TextareaAutosize =
/*#__PURE__*/
function (_React$Component) {
  (0, _inheritsLoose2.default)(TextareaAutosize, _React$Component);

  function TextareaAutosize(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this._onRef = function (node) {
      _this._ref = node;
      var inputRef = _this.props.inputRef;

      if (typeof inputRef === 'function') {
        inputRef(node);
        return;
      }

      inputRef.current = node;
    };

    _this._onChange = function (event) {
      if (!_this._controlled) {
        _this._resizeComponent();
      }

      _this.props.onChange(event, (0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    };

    _this._resizeComponent = function (callback) {
      if (callback === void 0) {
        callback = noop;
      }

      var nodeHeight = calculateNodeHeight(_this._ref, _this._uid, _this.props.useCacheForDOMMeasurements, _this.props.minRows, _this.props.maxRows);

      if (nodeHeight === null) {
        callback();
        return;
      }

      var height = nodeHeight.height,
          minHeight = nodeHeight.minHeight,
          maxHeight = nodeHeight.maxHeight,
          rowCount = nodeHeight.rowCount,
          valueRowCount = nodeHeight.valueRowCount;
      _this.rowCount = rowCount;
      _this.valueRowCount = valueRowCount;

      if (_this.state.height !== height || _this.state.minHeight !== minHeight || _this.state.maxHeight !== maxHeight) {
        _this.setState({
          height: height,
          minHeight: minHeight,
          maxHeight: maxHeight
        }, callback);

        return;
      }

      callback();
    };

    _this.state = {
      height: props.style && props.style.height || 0,
      minHeight: -Infinity,
      maxHeight: Infinity
    };
    _this._uid = uid++;
    _this._controlled = props.value !== undefined;
    _this._resizeLock = false;
    return _this;
  }

  var _proto = TextareaAutosize.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        _inputRef = _this$props.inputRef,
        _maxRows = _this$props.maxRows,
        _minRows = _this$props.minRows,
        _onHeightChange = _this$props.onHeightChange,
        _useCacheForDOMMeasurements = _this$props.useCacheForDOMMeasurements,
        props = (0, _objectWithoutPropertiesLoose2.default)(_this$props, ["inputRef", "maxRows", "minRows", "onHeightChange", "useCacheForDOMMeasurements"]);
    props.style = (0, _extends2.default)({}, props.style, {
      height: this.state.height
    });
    var maxHeight = Math.max(props.style.maxHeight || Infinity, this.state.maxHeight);

    if (maxHeight < this.state.height) {
      props.style.overflow = 'hidden';
    }

    return _react.default.createElement("textarea", (0, _extends2.default)({}, props, {
      onChange: this._onChange,
      ref: this._onRef
    }));
  };

  _proto.componentDidMount = function componentDidMount() {
    var _this2 = this;

    this._resizeComponent(); // Working around Firefox bug which runs resize listeners even when other JS is running at the same moment
    // causing competing rerenders (due to setState in the listener) in React.
    // More can be found here - facebook/react#6324


    this._resizeListener = function () {
      if (_this2._resizeLock) {
        return;
      }

      _this2._resizeLock = true;

      _this2._resizeComponent(function () {
        _this2._resizeLock = false;
      });
    };

    window.addEventListener('resize', this._resizeListener);
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) {
      this._resizeComponent();
    }

    if (this.state.height !== prevState.height) {
      this.props.onHeightChange(this.state.height, this);
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    window.removeEventListener('resize', this._resizeListener);
    purgeCache(this._uid);
  };

  return TextareaAutosize;
}(_react.default.Component);

TextareaAutosize.defaultProps = {
  inputRef: noop,
  onChange: noop,
  onHeightChange: noop,
  useCacheForDOMMeasurements: false
};
"production" !== "production" ? TextareaAutosize.propTypes = {
  inputRef: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.shape({
    current: _propTypes.default.any
  })]),
  maxRows: _propTypes.default.number,
  minRows: _propTypes.default.number,
  onChange: _propTypes.default.func,
  onHeightChange: _propTypes.default.func,
  style: _propTypes.default.object,
  useCacheForDOMMeasurements: _propTypes.default.bool,
  value: _propTypes.default.string
} : void 0;
var _default = TextareaAutosize;
exports.default = _default;
},{"@babel/runtime/helpers/esm/extends":"SpjQ","@babel/runtime/helpers/esm/objectWithoutPropertiesLoose":"3Vab","@babel/runtime/helpers/esm/inheritsLoose":"S11h","@babel/runtime/helpers/esm/assertThisInitialized":"bk0i","react":"1n8/","prop-types":"5D9O"}],"5K0r":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = __importStar(require("react"));

var classnames_1 = __importDefault(require("classnames"));

var react_textarea_autosize_1 = __importDefault(require("react-textarea-autosize"));

var utilsCommon_1 = require("../../utilsCommon");

var utilsWidget_1 = require("../../utilsWidget");

var styles_1 = require("./styles");

var DefaultWidgetTextarea =
/*#__PURE__*/
function (_react_1$Component) {
  _inherits(DefaultWidgetTextarea, _react_1$Component);

  function DefaultWidgetTextarea() {
    var _this;

    _classCallCheck(this, DefaultWidgetTextarea);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DefaultWidgetTextarea).apply(this, arguments));
    _this.container = react_1.default.createRef();
    _this.textarea = null;
    _this.state = {
      replyToId: null,
      typedText: '',
      attachments: [],
      areTextareaActionsCollapsed: false
    };

    _this.onReplyClick = function (messageId) {
      _this.setState({
        replyToId: messageId
      });
    };

    _this.onTextareaChange = function (e) {
      _this.props.elixirChatWidget.dispatchTypedText(e.target.value);

      _this.setState({
        typedText: e.target.value
      });
    };

    _this.onTextareaKeyDown = function (e) {
      if (e.keyCode === 13 && e.shiftKey === false) {
        // Press "Enter" without holding Shift
        e.preventDefault();
        var _this$state = _this.state,
            typedText = _this$state.typedText,
            replyToId = _this$state.replyToId,
            attachments = _this$state.attachments;
        var elixirChatWidget = _this.props.elixirChatWidget;

        if (typedText.trim()) {
          elixirChatWidget.sendMessage({
            text: typedText,
            responseToMessageId: replyToId,
            attachments: attachments
          });

          _this.setState({
            typedText: '',
            replyToId: null
          });
        }
      }
    };

    _this.onRemoveReplyTo = function () {
      // this.props.onRemoveReplyTo();
      _this.updateVerticalHeight();
    };

    _this.addAttachments = function (attachments) {
      _this.setState({
        attachments: [].concat(_toConsumableArray(_this.state.attachments), _toConsumableArray(attachments.map(function (item) {
          return Object.assign({}, item, {
            id: utilsCommon_1.randomDigitStringId(6)
          });
        })))
      });

      _this.updateVerticalHeight();
    };

    _this.removeAttachment = function (attachmentId) {
      _this.setState({
        attachments: _this.state.attachments.filter(function (item) {
          return item.id !== attachmentId;
        })
      });

      _this.updateVerticalHeight();
    };

    _this.handleAttachmentPaste = function (e) {
      var clipboardItem = (event.clipboardData || event.originalEvent.clipboardData).items[0];

      if (clipboardItem.kind === 'file') {
        e.preventDefault();
        var file = clipboardItem.getAsFile();

        if (file) {
          _this.addAttachments([{
            name: 'Вставлено из буфера',
            file: file
          }]);
        }
      }
    };

    _this.onScreenShotClick = function () {
      var elixirChatWidget = _this.props.elixirChatWidget;
      elixirChatWidget.toggleChatVisibility();
      elixirChatWidget.takeScreenshot().then(function (screenshot) {
        _this.addAttachments([{
          name: 'Скриншот экрана',
          file: screenshot.file,
          isScreenshot: true
        }]);

        elixirChatWidget.toggleChatVisibility();
      }).catch(function () {
        elixirChatWidget.toggleChatVisibility();
      });
    };

    _this.onInputFileChange = function (e) {
      var attachments = Array.from(e.target.files).map(function (file) {
        return {
          name: file.name,
          file: file
        };
      });

      _this.addAttachments(attachments);
    };

    _this.updateVerticalHeight = function (options) {
      setTimeout(function () {
        var newHeight = _this.container.current.offsetHeight;

        _this.setState({
          areTextareaActionsCollapsed: newHeight < 60
        });

        _this.props.onVerticalResize(newHeight, options);
      }, 0);
    };

    return _this;
  }

  _createClass(DefaultWidgetTextarea, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var elixirChatWidget = this.props.elixirChatWidget;
      elixirChatWidget.injectIframeStyles(styles_1.DefaultWidgetTextareaStyles);
      elixirChatWidget.onToggleChatVisibility(function (isOpen) {
        if (isOpen) {
          _this2.updateVerticalHeight({
            scrollToBottom: true
          });

          _this2.textarea.focus();
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$state2 = this.state,
          typedText = _this$state2.typedText,
          attachments = _this$state2.attachments,
          replyToId = _this$state2.replyToId,
          areTextareaActionsCollapsed = _this$state2.areTextareaActionsCollapsed;
      var currentlyTypingUsers = this.props.currentlyTypingUsers;
      return react_1.default.createElement("div", {
        className: "elixirchat-chat-textarea",
        ref: this.container
      }, Boolean(currentlyTypingUsers.length) && react_1.default.createElement("div", {
        className: "elixirchat-chat-typing"
      }, utilsWidget_1.inflect('ru-RU', currentlyTypingUsers.length, ['человек пишет...', 'человека пишут...', 'человек пишут...'])), react_1.default.createElement("div", {
        className: classnames_1.default({
          'elixirchat-chat-textarea__actions': true,
          'elixirchat-chat-textarea__actions--collapsed': areTextareaActionsCollapsed
        })
      }, react_1.default.createElement("button", {
        className: "elixirchat-chat-textarea__actions-screenshot",
        onClick: this.onScreenShotClick,
        title: "\u0421\u0434\u0435\u043B\u0430\u0442\u044C \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442"
      }), react_1.default.createElement("span", {
        className: "elixirchat-chat-textarea__actions-attach",
        title: "\u041F\u0440\u0438\u043A\u0440\u0435\u043F\u0438\u0442\u044C \u0444\u0430\u0439\u043B"
      }, react_1.default.createElement("input", {
        className: "elixirchat-chat-textarea__actions-attach-input",
        id: "DefaultWidget-file-upload",
        type: "file",
        multiple: true,
        onChange: this.onInputFileChange
      }), react_1.default.createElement("label", {
        className: "elixirchat-chat-textarea__actions-attach-label",
        htmlFor: "DefaultWidget-file-upload"
      }))), react_1.default.createElement(react_textarea_autosize_1.default, {
        className: "elixirchat-chat-textarea__textarea",
        placeholder: "\u041D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435...",
        inputRef: function inputRef(tag) {
          _this3.textarea = tag;
        },
        minRows: 1,
        maxRows: 5,
        onHeightChange: this.updateVerticalHeight,
        onPaste: this.handleAttachmentPaste,
        onChange: this.onTextareaChange,
        onKeyDown: this.onTextareaKeyDown,
        value: typedText
      }), Boolean(attachments.length) && react_1.default.createElement("ul", {
        className: "elixirchat-chat-attachment-list"
      }, attachments.map(function (attachment) {
        return react_1.default.createElement("li", {
          key: attachment.id,
          className: "elixirchat-chat-attachment-item"
        }, react_1.default.createElement("i", {
          className: classnames_1.default({
            'elixirchat-chat-attachment-icon': true,
            'elixirchat-chat-attachment-icon--screenshot': attachment.isScreenshot
          })
        }), react_1.default.createElement("span", {
          className: "elixirchat-chat-attachment-filename"
        }, attachment.name), react_1.default.createElement("i", {
          className: "elixirchat-chat-attachment-remove",
          tabIndex: 0,
          onClick: function onClick() {
            return _this3.removeAttachment(attachment.id);
          }
        }));
      })));
    }
  }]);

  return DefaultWidgetTextarea;
}(react_1.Component);

exports.DefaultWidgetTextarea = DefaultWidgetTextarea;
},{"react":"1n8/","classnames":"9qb7","react-textarea-autosize":"0Ldd","../../utilsCommon":"EjGt","../../utilsWidget":"4KO9","./styles":"xqZa"}],"Fn99":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = __importStar(require("react"));

var react_dom_1 = __importDefault(require("react-dom"));

var utilsWidget_1 = require("../../utilsWidget");

var DefaultWidgetMessages_1 = require("./DefaultWidgetMessages");

var DefaultWidgetTextarea_1 = require("./DefaultWidgetTextarea");

var styles_1 = require("./styles");

var DefaultWidget =
/*#__PURE__*/
function (_react_1$Component) {
  _inherits(DefaultWidget, _react_1$Component);

  function DefaultWidget() {
    var _this;

    _classCallCheck(this, DefaultWidget);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DefaultWidget).apply(this, arguments));
    _this.container = react_1.default.createRef();
    _this.scrollBlock = react_1.default.createRef();
    _this.messageChunkSize = 20;
    _this.state = {
      messages: [],
      room: {},
      client: {},
      currentlyTypingUsers: [],
      isLoading: true,
      isLoadingPreviousMessages: false
    };

    _this.loadPreviousMessages = function (callback) {
      var _this$state = _this.state,
          messages = _this$state.messages,
          isLoadingPreviousMessages = _this$state.isLoadingPreviousMessages;
      var elixirChatWidget = _this.props.elixirChatWidget;

      if (!isLoadingPreviousMessages && !elixirChatWidget.reachedBeginningOfMessageHistory) {
        _this.setState({
          isLoadingPreviousMessages: true
        });

        elixirChatWidget.fetchMessageHistory(_this.messageChunkSize, messages[0].cursor).then(function (history) {
          var updatedMessages = [].concat(_toConsumableArray(history), _toConsumableArray(messages));

          _this.setState({
            messages: updatedMessages,
            isLoadingPreviousMessages: false
          }, callback);
        });
      }
    };

    _this.onMessagesScroll = function () {
      var scrollBlock = _this.scrollBlock.current;

      if (scrollBlock.scrollTop <= 0) {
        var initialScrollHeight = scrollBlock.scrollHeight;

        _this.loadPreviousMessages(function () {
          setTimeout(function () {
            scrollBlock.scrollTop = scrollBlock.scrollHeight - initialScrollHeight;
          }, 0);
        });
      }
    };

    _this.hasUserScroll = function () {
      var scrollBlock = _this.scrollBlock.current;
      return scrollBlock.scrollTop !== scrollBlock.scrollHeight - scrollBlock.offsetHeight;
    };

    _this.scrollToBottom = function () {
      _this.scrollBlock.current.scrollTop = _this.scrollBlock.current.scrollHeight;
    };

    _this.onTextareaVerticalResize = function (newTextareaHeight, options) {
      var hasUserScroll = _this.hasUserScroll();

      _this.scrollBlock.current.style.bottom = newTextareaHeight + 'px';

      if (!hasUserScroll || options.scrollToBottom) {
        _this.scrollToBottom();
      }
    };

    return _this;
  }

  _createClass(DefaultWidget, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var elixirChatWidget = this.props.elixirChatWidget;
      elixirChatWidget.injectIframeStyles(styles_1.DefaultWidgetStyles);
      elixirChatWidget.onConnectSuccess(function () {
        elixirChatWidget.fetchMessageHistory(_this2.messageChunkSize).then(function (messages) {
          _this2.setState({
            messages: messages,
            isLoading: false
          });

          _this2.scrollToBottom();
        });
      });
      elixirChatWidget.onMessage(function (message) {
        var messages = [].concat(_toConsumableArray(_this2.state.messages), [message]);

        var hasUserScroll = _this2.hasUserScroll();

        _this2.setState({
          messages: messages
        });

        utilsWidget_1.playNotificationSound();

        if (!hasUserScroll) {
          _this2.scrollToBottom();
        }
      });
      elixirChatWidget.onTyping(function (currentlyTypingUsers) {
        _this2.setState({
          currentlyTypingUsers: currentlyTypingUsers
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state2 = this.state,
          messages = _this$state2.messages,
          currentlyTypingUsers = _this$state2.currentlyTypingUsers,
          isLoading = _this$state2.isLoading;
      var elixirChatWidget = this.props.elixirChatWidget;
      return react_1.default.createElement("div", {
        className: "elixirchat-chat-container",
        ref: this.container
      }, react_1.default.createElement("h2", {
        className: "elixirchat-chat-header"
      }, react_1.default.createElement("i", {
        className: "elixirchat-chat-header__indicator"
      }), "\u0421\u043B\u0443\u0436\u0431\u0430 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0438", react_1.default.createElement("button", {
        className: "elixirchat-chat-header__close",
        title: "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u0447\u0430\u0442",
        onClick: elixirChatWidget.toggleChatVisibility
      })), isLoading && react_1.default.createElement("i", {
        className: "elixirchat-chat-spinner"
      }), react_1.default.createElement("div", {
        className: "elixirchat-chat-scroll",
        ref: this.scrollBlock,
        onScroll: this.onMessagesScroll
      }, react_1.default.createElement(DefaultWidgetMessages_1.DefaultWidgetMessages, {
        onLoadPreviousMessages: this.loadPreviousMessages,
        elixirChatWidget: elixirChatWidget,
        messages: messages
      })), react_1.default.createElement(DefaultWidgetTextarea_1.DefaultWidgetTextarea, {
        currentlyTypingUsers: currentlyTypingUsers,
        onVerticalResize: this.onTextareaVerticalResize,
        elixirChatWidget: elixirChatWidget
      }));
    }
  }]);

  return DefaultWidget;
}(react_1.Component);

exports.DefaultWidget = DefaultWidget;

function appendDefaultElixirChatWidget(container, elixirChatWidget) {
  var component;
  react_dom_1.default.render(react_1.default.createElement(DefaultWidget, {
    elixirChatWidget: elixirChatWidget,
    ref: function ref(widget) {
      component = widget;
    }
  }), container);
  return component;
}

exports.appendDefaultElixirChatWidget = appendDefaultElixirChatWidget;
},{"react":"1n8/","react-dom":"NKHc","../../utilsWidget":"4KO9","./DefaultWidgetMessages":"Q0s5","./DefaultWidgetTextarea":"5K0r","./styles":"xqZa"}],"GpM8":[function(require,module,exports) {
"use strict";
/**
 * Styles are imported as base64-strings via fs.readFileSync() in order to include
 * them into a single bundle JS file, not copy to /dist folder as separate files
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var fs = require('fs');

var dataUrlWoff = 'data:font/woff;base64,';
var dataUrlSvg = 'data:image/svg+xml;base64,';
var GraphikBoldWeb = dataUrlWoff + "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";
var GraphikRegularWeb = dataUrlWoff + "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";
var ChatAttachIconBlack = dataUrlSvg + "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDU1LjIgKDc4MTgxKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT5pY29uPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IkNsaWVudC1HZW5lcmFsIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtOTE0LjAwMDAwMCwgLTcxMi4wMDAwMDApIiBmaWxsPSIjMDAwMDAwIj4KICAgICAgICAgICAgPGcgaWQ9Im9wZW4iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU4MC4wMDAwMDAsIDE0Ni4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJjaGF0Ij4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0idHlwaW5nIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgNTQ3LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtNy1Db3B5LTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMyMi4wMDAwMDAsIDExLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTEyLjkxMDc4NDQsMjAuOTIyMjA2MSBDMTIuMzIzMTgxNiwyMC4yNzEwOTcxIDEyLDE5LjQwNTQ3MDggMTIsMTguNDg1MTk3OCBDMTIsMTcuNTY0MzQzNiAxMi4zMjMxODE2LDE2LjY5ODcxNzMgMTIuOTEwNzg0NCwxNi4wNDc2MDgyIEwxOC44OTc4NzUxLDkuMzQ3OTI2NjIgQzIwLjUyMDA3ODcsNy41NTA5ODE4MSAyMy4xNTk1Njk3LDcuNTUwNDAwNDYgMjQuNzgxNzczNCw5LjM0NzkyNjYyIEMyNS41Njc2OTIyLDEwLjIxODc4NSAyNiwxMS4zNzYyNDc3IDI2LDEyLjYwNzU0MTUgQzI2LDEzLjgzODgzNTMgMjUuNTY3NjkyMiwxNC45OTY4NzkzIDI0Ljc4MTc3MzQsMTUuODY3MTU2NCBMMTkuMjcwMjI4NiwyMiBMMTguNTgwODQ0NSwyMS4yMzU1MjgyIEwyNC4wOTE4NjQ2LDE1LjEwMjY4NDUgQzI1LjMzMzE3NTcsMTMuNzI2NjM1MiAyNS4zMzMxNzU3LDExLjQ4ODQ0NzcgMjQuMDkxODY0NiwxMC4xMTIzOTg1IEMyMi44NTEwNzgyLDguNzM2OTMwNTEgMjAuODI5NjE5NSw4LjczNjM0OTE2IDE5LjU4Nzc4MzgsMTAuMTEyMzk4NSBMMTMuNjAxMjE3OCwxNi44MTIwOCBDMTMuMTk3NzY1NSwxNy4yNTkxMzYyIDEyLjk3NTg0MDUsMTcuODUyNjkxOSAxMi45NzU4NDA1LDE4LjQ4NTE5NzggQzEyLjk3NTg0MDUsMTkuMTE3MTIyNSAxMy4xOTgyOTAxLDE5LjcxMDY3ODIgMTMuNjAxMjE3OCwyMC4xNTc3MzQzIEMxNC40MzM4MzAxLDIxLjA4MDkxNCAxNS43ODg0NjQ1LDIxLjA3OTc1MTMgMTYuNjIwNTUyMSwyMC4xNTc3MzQzIEwyMS41NDc3MTQzLDE0LjY1ODE2MzcgQzIxLjk3MTEwMzIsMTQuMTg5MDE2MyAyMS45NzExMDMyLDEzLjQyNTcwNzIgMjEuNTQ3NzE0MywxMi45NTU5Nzg1IEMyMS4xMjQzMjU1LDEyLjQ4NjgzMTIgMjAuNDM0OTQxNCwxMi40ODY4MzEyIDIwLjAxMTU1MjUsMTIuOTU1OTc4NSBMMTUuNTYwNDYwOSwxNy44ODkyOTI1IEwxNC44NzAwMjc1LDE3LjEyNDIzOTQgTDE5LjMyMjE2ODUsMTIuMTkxNTA2NyBDMjAuMTI1NDAwNiwxMS4zMDA4ODI1IDIxLjQzMzg2NjIsMTEuMzAwMzAxMSAyMi4yMzgxNDc3LDEyLjE5MTUwNjcgQzIzLjA0MjQyOTEsMTMuMDgyNzEyMiAyMy4wNDE5MDQ0LDE0LjUzMjAxMTMgMjIuMjM4MTQ3NywxNS40MjI2MzU1IEwxNy4zMTA0NjA5LDIwLjkyMjIwNjEgQzE2LjcyMjMzMzQsMjEuNTczMzE1MiAxNS45NDE2NjEsMjEuOTMyMDA2NiAxNS4xMTA2MjI2LDIxLjkzMjAwNjYgQzE0LjI3OTU4NDMsMjEuOTMyMDA2NiAxMy40OTgzODczLDIxLjU3MzMxNTIgMTIuOTEwNzg0NCwyMC45MjIyMDYxIFoiIGlkPSJpY29uIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==";
var ChatAttachIconBlue = dataUrlSvg + "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDU1LjIgKDc4MTgxKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT5pY29uPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IkNsaWVudC1HZW5lcmFsIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjMzMC4wMDAwMDAsIC02ODYuMDAwMDAwKSIgZmlsbD0iIzAwMzNGRiI+CiAgICAgICAgICAgIDxnIGlkPSJvcGVuLWNvcHktMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjMwMC4wMDAwMDAsIDE0Ni4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJjaGF0Ij4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0idHlwaW5nIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgNDg1LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iYXR0YWNoIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMC4wMDAwMDAsIDUzLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTAuOTEwNzg0NDM1LDE0LjkyMjIwNjEgQzAuMzIzMTgxNTc0LDE0LjI3MTA5NzEgLTUuMzA1Mzg1NzZlLTE0LDEzLjQwNTQ3MDggLTUuMzA1Mzg1NzZlLTE0LDEyLjQ4NTE5NzggQy01LjMwNTM4NTc2ZS0xNCwxMS41NjQzNDM2IDAuMzIzMTgxNTc0LDEwLjY5ODcxNzMgMC45MTA3ODQ0MzUsMTAuMDQ3NjA4MiBMNi44OTc4NzUwNiwzLjM0NzkyNjYyIEM4LjUyMDA3ODY3LDEuNTUwOTgxODEgMTEuMTU5NTY5NywxLjU1MDQwMDQ2IDEyLjc4MTc3MzQsMy4zNDc5MjY2MiBDMTMuNTY3NjkyMiw0LjIxODc4NTAzIDE0LDUuMzc2MjQ3NyAxNCw2LjYwNzU0MTQ5IEMxNCw3LjgzODgzNTI4IDEzLjU2NzY5MjIsOC45OTY4NzkzIDEyLjc4MTc3MzQsOS44NjcxNTYzNiBMNy4yNzAyMjg1NywxNiBMNi41ODA4NDQ1LDE1LjIzNTUyODIgTDEyLjA5MTg2NDYsOS4xMDI2ODQ1MyBDMTMuMzMzMTc1Nyw3LjcyNjYzNTIzIDEzLjMzMzE3NTcsNS40ODg0NDc3NSAxMi4wOTE4NjQ2LDQuMTEyMzk4NDUgQzEwLjg1MTA3ODIsMi43MzY5MzA1MSA4LjgyOTYxOTQ2LDIuNzM2MzQ5MTYgNy41ODc3ODM3Nyw0LjExMjM5ODQ1IEwxLjYwMTIxNzgsMTAuODEyMDggQzEuMTk3NzY1NDgsMTEuMjU5MTM2MiAwLjk3NTg0MDQ2NiwxMS44NTI2OTE5IDAuOTc1ODQwNDY2LDEyLjQ4NTE5NzggQzAuOTc1ODQwNDY2LDEzLjExNzEyMjUgMS4xOTgyOTAxMiwxMy43MTA2NzgyIDEuNjAxMjE3OCwxNC4xNTc3MzQzIEMyLjQzMzgzMDA3LDE1LjA4MDkxNCAzLjc4ODQ2NDUyLDE1LjA3OTc1MTMgNC42MjA1NTIxNCwxNC4xNTc3MzQzIEw5LjU0NzcxNDMsOC42NTgxNjM3IEM5Ljk3MTEwMzE1LDguMTg5MDE2MzUgOS45NzExMDMxNSw3LjQyNTcwNzIxIDkuNTQ3NzE0Myw2Ljk1NTk3ODUxIEM5LjEyNDMyNTQ2LDYuNDg2ODMxMTYgOC40MzQ5NDEzOCw2LjQ4NjgzMTE2IDguMDExNTUyNTQsNi45NTU5Nzg1MSBMMy41NjA0NjA4NiwxMS44ODkyOTI1IEwyLjg3MDAyNzUsMTEuMTI0MjM5NCBMNy4zMjIxNjg0Nyw2LjE5MTUwNjY4IEM4LjEyNTQwMDU5LDUuMzAwODgyNDcgOS40MzM4NjYyNSw1LjMwMDMwMTEyIDEwLjIzODE0NzcsNi4xOTE1MDY2OCBDMTEuMDQyNDI5MSw3LjA4MjcxMjI0IDExLjA0MTkwNDQsOC41MzIwMTEzMSAxMC4yMzgxNDc3LDkuNDIyNjM1NTMgTDUuMzEwNDYwODYsMTQuOTIyMjA2MSBDNC43MjIzMzMzNSwxNS41NzMzMTUyIDMuOTQxNjYwOTgsMTUuOTMyMDA2NiAzLjExMDYyMjY1LDE1LjkzMjAwNjYgQzIuMjc5NTg0MzIsMTUuOTMyMDA2NiAxLjQ5ODM4NzMsMTUuNTczMzE1MiAwLjkxMDc4NDQzNSwxNC45MjIyMDYxIFoiIGlkPSJpY29uIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==";
var ChatCloseIconBlack = dataUrlSvg + "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNXB4IiB2aWV3Qm94PSIwIDAgMTYgMTUiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDU1LjIgKDc4MTgxKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT7DlzwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiPgogICAgICAgIDxnIGlkPSJDbGllbnQtR2VuZXJhbCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE0MDQuMDAwMDAwLCAtMTY2LjAwMDAwMCkiIHN0cm9rZT0iIzAwMDAwMCI+CiAgICAgICAgICAgIDxnIGlkPSJvcGVuLWNvcHkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEwNjAuMDAwMDAwLCAxNDYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iY2hhdCI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IsOXIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzNDUuMDAwMDAwLCAyMC4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTUuNjg0MzQxODllLTE0LDAgTDE0LjE0MjEzNTYsMTQuMTQyMTM1NiIgaWQ9IkxpbmUiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTUuNjg0MzQxODllLTE0LDAgTDE0LjE0MjEzNTYsMTQuMTQyMTM1NiIgaWQ9IkxpbmUtQ29weSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNy4wNzEwNjgsIDcuMDcxMDY4KSBzY2FsZSgtMSwgMSkgdHJhbnNsYXRlKC03LjA3MTA2OCwgLTcuMDcxMDY4KSAiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==";
var ChatRemoveIconBlue = dataUrlSvg + "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTFweCIgaGVpZ2h0PSIxMXB4IiB2aWV3Qm94PSIwIDAgMTEgMTEiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDU1LjIgKDc4MTgxKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT5QYXRoPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IkNsaWVudC1HZW5lcmFsIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjQ1NS4wMDAwMDAsIC02ODguMDAwMDAwKSIgZmlsbD0iIzAwMzNGRiI+CiAgICAgICAgICAgIDxnIGlkPSJvcGVuLWNvcHktMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjMwMC4wMDAwMDAsIDE0Ni4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJjaGF0Ij4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0idHlwaW5nIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgNDg1LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iYXR0YWNoIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMC4wMDAwMDAsIDUzLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlBhdGgiIHBvaW50cz0iMTM0LjQ3ODcyMyAxNSAxMzYgMTMuNDc4NzIzNCAxMzIuMTM4Mjk4IDkuNSAxMzYgNS42MzgyOTc4NyAxMzQuNDc4NzIzIDQgMTMwLjUgNy45Nzg3MjM0IDEyNi42MzgyOTggNCAxMjUgNS42MzgyOTc4NyAxMjguOTc4NzIzIDkuNSAxMjUgMTMuNDc4NzIzNCAxMjYuNjM4Mjk4IDE1IDEzMC41IDExLjEzODI5NzkiPjwvcG9seWdvbj4KICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+";
var ChatScreenshotIconBlack = dataUrlSvg + "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjBweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMjAgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDU1LjIgKDc4MTgxKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT5Hcm91cCA5PC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IkNsaWVudC1HZW5lcmFsIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODYzLjAwMDAwMCwgLTcxMy4wMDAwMDApIiBzdHJva2U9IiMwMDAwMDAiPgogICAgICAgICAgICA8ZyBpZD0ib3BlbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTgwLjAwMDAwMCwgMTQ2LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9ImNoYXQiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSJ0eXBpbmciIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCA1NDcuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxnIGlkPSJHcm91cC03LUNvcHktMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjc0LjAwMDAwMCwgMTEuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtOSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOS4wMDAwMDAsIDkuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZSIgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSIxOSIgaGVpZ2h0PSIxMCIgcng9IjMiPjwvcmVjdD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlLUNvcHktMiIgeD0iNS41IiB5PSIxMy41IiB3aWR0aD0iOSIgaGVpZ2h0PSIxIiByeD0iMC41Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==";
var ChatScreenshotIconBlue = dataUrlSvg + "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxMnB4IiB2aWV3Qm94PSIwIDAgMTYgMTIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDU1LjIgKDc4MTgxKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT5Hcm91cCA4PC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IkNsaWVudC1HZW5lcmFsIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjMzMC4wMDAwMDAsIC03MTAuMDAwMDAwKSIgc3Ryb2tlPSIjMDAzM0ZGIj4KICAgICAgICAgICAgPGcgaWQ9Im9wZW4tY29weS0zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMzAwLjAwMDAwMCwgMTQ2LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9ImNoYXQiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSJ0eXBpbmciIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCA0ODUuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxnIGlkPSJhdHRhY2gtY29weSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzAuMDAwMDAwLCA3Ny4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxnIGlkPSJHcm91cC04IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgMi4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlIiB4PSIwLjUiIHk9IjAuNSIgd2lkdGg9IjE1IiBoZWlnaHQ9IjkiIHJ4PSIzIj48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZS1Db3B5LTIiIHg9IjQuNSIgeT0iMTEuNSIgd2lkdGg9IjciIGhlaWdodD0iMSIgcng9IjAuNSI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=";
var ChatTypingIconBlack = dataUrlSvg + "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxMXB4IiB2aWV3Qm94PSIwIDAgMTggMTEiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDU1LjIgKDc4MTgxKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT5Hcm91cDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJDbGllbnQtR2VuZXJhbCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTYxMC4wMDAwMDAsIC02NjIuMDAwMDAwKSIgZmlsbD0iIzAwMDAwMCIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9Im9wZW4iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU4MC4wMDAwMDAsIDE0Ni4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJjaGF0Ij4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzAuMDAwMDAwLCA1MTAuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxnIGlkPSJHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTQuODM3ODM3OCwwIEwzLjE2MjE2MjE2LDAgQzEuNDEwODEwODEsMCAwLDEuMzI5MTY2NjcgMCwyLjk3OTE2NjY3IEwwLDguMDIwODMzMzMgQzAsOS42NzA4MzMzMyAxLjQxMDgxMDgxLDExIDMuMTYyMTYyMTYsMTEgTDE0LjgzNzgzNzgsMTEgQzE2LjU4OTE4OTIsMTEgMTgsOS42NzA4MzMzMyAxOCw4LjAyMDgzMzMzIEwxOCwyLjk3OTE2NjY3IEMxOCwxLjMyOTE2NjY3IDE2LjU4OTE4OTIsMCAxNC44Mzc4Mzc4LDAgWiBNMTYuNTQwNTQwNSw4LjAyMDgzMzMzIEMxNi41NDA1NDA1LDguOTE0NTgzMzMgMTUuNzg2NDg2NSw5LjYyNSAxNC44Mzc4Mzc4LDkuNjI1IEwzLjE2MjE2MjE2LDkuNjI1IEMyLjIxMzUxMzUxLDkuNjI1IDEuNDU5NDU5NDYsOC45MTQ1ODMzMyAxLjQ1OTQ1OTQ2LDguMDIwODMzMzMgTDEuNDU5NDU5NDYsMi45NzkxNjY2NyBDMS40NTk0NTk0NiwyLjA4NTQxNjY3IDIuMjEzNTEzNTEsMS4zNzUgMy4xNjIxNjIxNiwxLjM3NSBMMTQuODM3ODM3OCwxLjM3NSBDMTUuNzg2NDg2NSwxLjM3NSAxNi41NDA1NDA1LDIuMDg1NDE2NjcgMTYuNTQwNTQwNSwyLjk3OTE2NjY3IEwxNi41NDA1NDA1LDguMDIwODMzMzMgWiIgaWQ9IlNoYXBlIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTIuMjgzNzgzOCw3LjIxODc1IEw1LjcxNjIxNjIyLDcuMjE4NzUgQzUuMzAyNzAyNyw3LjIxODc1IDQuOTg2NDg2NDksNy41MTY2NjY2NyA0Ljk4NjQ4NjQ5LDcuOTA2MjUgQzQuOTg2NDg2NDksOC4yOTU4MzMzMyA1LjMwMjcwMjcsOC41OTM3NSA1LjcxNjIxNjIyLDguNTkzNzUgTDEyLjMwODEwODEsOC41OTM3NSBDMTIuNzIxNjIxNiw4LjU5Mzc1IDEzLjAzNzgzNzgsOC4yOTU4MzMzMyAxMy4wMzc4Mzc4LDcuOTA2MjUgQzEzLjAzNzgzNzgsNy41MTY2NjY2NyAxMi42OTcyOTczLDcuMjE4NzUgMTIuMjgzNzgzOCw3LjIxODc1IFoiIGlkPSJQYXRoIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMy40MDU0MDU0MSwzLjc4MTI1IEw0LjM3ODM3ODM4LDMuNzgxMjUgQzQuNzkxODkxODksMy43ODEyNSA1LjEwODEwODExLDMuNDgzMzMzMzMgNS4xMDgxMDgxMSwzLjA5Mzc1IEM1LjEwODEwODExLDIuNzA0MTY2NjcgNC43OTE4OTE4OSwyLjQwNjI1IDQuMzc4Mzc4MzgsMi40MDYyNSBMMy40MDU0MDU0MSwyLjQwNjI1IEMyLjk5MTg5MTg5LDIuNDA2MjUgMi42NzU2NzU2OCwyLjcwNDE2NjY3IDIuNjc1Njc1NjgsMy4wOTM3NSBDMi42NzU2NzU2OCwzLjQ4MzMzMzMzIDIuOTkxODkxODksMy43ODEyNSAzLjQwNTQwNTQxLDMuNzgxMjUgWiIgaWQ9IlBhdGgiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik02LjgxMDgxMDgxLDMuNzgxMjUgTDcuNzgzNzgzNzgsMy43ODEyNSBDOC4xOTcyOTczLDMuNzgxMjUgOC41MTM1MTM1MSwzLjQ4MzMzMzMzIDguNTEzNTEzNTEsMy4wOTM3NSBDOC41MTM1MTM1MSwyLjcwNDE2NjY3IDguMTk3Mjk3MywyLjQwNjI1IDcuNzgzNzgzNzgsMi40MDYyNSBMNi44MTA4MTA4MSwyLjQwNjI1IEM2LjM5NzI5NzMsMi40MDYyNSA2LjA4MTA4MTA4LDIuNzA0MTY2NjcgNi4wODEwODEwOCwzLjA5Mzc1IEM2LjA4MTA4MTA4LDMuNDgzMzMzMzMgNi4zOTcyOTczLDMuNzgxMjUgNi44MTA4MTA4MSwzLjc4MTI1IFoiIGlkPSJQYXRoIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTAuMjE2MjE2MiwzLjc4MTI1IEwxMS4xODkxODkyLDMuNzgxMjUgQzExLjYwMjcwMjcsMy43ODEyNSAxMS45MTg5MTg5LDMuNDgzMzMzMzMgMTEuOTE4OTE4OSwzLjA5Mzc1IEMxMS45MTg5MTg5LDIuNzA0MTY2NjcgMTEuNjAyNzAyNywyLjQwNjI1IDExLjE4OTE4OTIsMi40MDYyNSBMMTAuMjE2MjE2MiwyLjQwNjI1IEM5LjgwMjcwMjcsMi40MDYyNSA5LjQ4NjQ4NjQ5LDIuNzA0MTY2NjcgOS40ODY0ODY0OSwzLjA5Mzc1IEM5LjQ4NjQ4NjQ5LDMuNDgzMzMzMzMgOS44MDI3MDI3LDMuNzgxMjUgMTAuMjE2MjE2MiwzLjc4MTI1IFoiIGlkPSJQYXRoIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTQuNTk0NTk0NiwyLjQwNjI1IEwxMy42MjE2MjE2LDIuNDA2MjUgQzEzLjIwODEwODEsMi40MDYyNSAxMi44OTE4OTE5LDIuNzA0MTY2NjcgMTIuODkxODkxOSwzLjA5Mzc1IEMxMi44OTE4OTE5LDMuNDgzMzMzMzMgMTMuMjA4MTA4MSwzLjc4MTI1IDEzLjYyMTYyMTYsMy43ODEyNSBMMTQuNTk0NTk0NiwzLjc4MTI1IEMxNS4wMDgxMDgxLDMuNzgxMjUgMTUuMzI0MzI0MywzLjQ4MzMzMzMzIDE1LjMyNDMyNDMsMy4wOTM3NSBDMTUuMzI0MzI0MywyLjcwNDE2NjY3IDE1LjAwODEwODEsMi40MDYyNSAxNC41OTQ1OTQ2LDIuNDA2MjUgWiIgaWQ9IlBhdGgiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik00LjM3ODM3ODM4LDQuOTI3MDgzMzMgTDMuNDA1NDA1NDEsNC45MjcwODMzMyBDMi45OTE4OTE4OSw0LjkyNzA4MzMzIDIuNjc1Njc1NjgsNS4yMjUgMi42NzU2NzU2OCw1LjYxNDU4MzMzIEMyLjY3NTY3NTY4LDYuMDA0MTY2NjcgMi45OTE4OTE4OSw2LjMwMjA4MzMzIDMuNDA1NDA1NDEsNi4zMDIwODMzMyBMNC4zNzgzNzgzOCw2LjMwMjA4MzMzIEM0Ljc5MTg5MTg5LDYuMzAyMDgzMzMgNS4xMDgxMDgxMSw2LjAwNDE2NjY3IDUuMTA4MTA4MTEsNS42MTQ1ODMzMyBDNS4xMDgxMDgxMSw1LjIyNSA0Ljc5MTg5MTg5LDQuOTI3MDgzMzMgNC4zNzgzNzgzOCw0LjkyNzA4MzMzIFoiIGlkPSJQYXRoIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNi44MTA4MTA4MSw2LjMwMjA4MzMzIEw4LjAyNzAyNzAzLDYuMzAyMDgzMzMgQzguNDQwNTQwNTQsNi4zMDIwODMzMyA4Ljc1Njc1Njc2LDYuMDA0MTY2NjcgOC43NTY3NTY3Niw1LjYxNDU4MzMzIEM4Ljc1Njc1Njc2LDUuMjI1IDguNDQwNTQwNTQsNC45MjcwODMzMyA4LjAyNzAyNzAzLDQuOTI3MDgzMzMgTDYuODEwODEwODEsNC45MjcwODMzMyBDNi4zOTcyOTczLDQuOTI3MDgzMzMgNi4wODEwODEwOCw1LjIyNSA2LjA4MTA4MTA4LDUuNjE0NTgzMzMgQzYuMDgxMDgxMDgsNi4wMDQxNjY2NyA2LjM5NzI5NzMsNi4zMDIwODMzMyA2LjgxMDgxMDgxLDYuMzAyMDgzMzMgWiIgaWQ9IlBhdGgiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMC4yMTYyMTYyLDYuMzAyMDgzMzMgTDExLjE4OTE4OTIsNi4zMDIwODMzMyBDMTEuNjAyNzAyNyw2LjMwMjA4MzMzIDExLjkxODkxODksNi4wMDQxNjY2NyAxMS45MTg5MTg5LDUuNjE0NTgzMzMgQzExLjkxODkxODksNS4yMjUgMTEuNjAyNzAyNyw0LjkyNzA4MzMzIDExLjE4OTE4OTIsNC45MjcwODMzMyBMMTAuMjE2MjE2Miw0LjkyNzA4MzMzIEM5LjgwMjcwMjcsNC45MjcwODMzMyA5LjQ4NjQ4NjQ5LDUuMjI1IDkuNDg2NDg2NDksNS42MTQ1ODMzMyBDOS40ODY0ODY0OSw2LjAwNDE2NjY3IDkuODAyNzAyNyw2LjMwMjA4MzMzIDEwLjIxNjIxNjIsNi4zMDIwODMzMyBaIiBpZD0iUGF0aCI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE0LjU5NDU5NDYsNC45MjcwODMzMyBMMTMuNjIxNjIxNiw0LjkyNzA4MzMzIEMxMy4yMDgxMDgxLDQuOTI3MDgzMzMgMTIuODkxODkxOSw1LjIyNSAxMi44OTE4OTE5LDUuNjE0NTgzMzMgQzEyLjg5MTg5MTksNi4wMDQxNjY2NyAxMy4yMDgxMDgxLDYuMzAyMDgzMzMgMTMuNjIxNjIxNiw2LjMwMjA4MzMzIEwxNC41OTQ1OTQ2LDYuMzAyMDgzMzMgQzE1LjAwODEwODEsNi4zMDIwODMzMyAxNS4zMjQzMjQzLDYuMDA0MTY2NjcgMTUuMzI0MzI0Myw1LjYxNDU4MzMzIEMxNS4zMjQzMjQzLDUuMjI1IDE1LjAwODEwODEsNC45MjcwODMzMyAxNC41OTQ1OTQ2LDQuOTI3MDgzMzMgWiIgaWQ9IlBhdGgiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+";
var WidgetIconChat = dataUrlSvg + "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzdweCIgaGVpZ2h0PSIzNXB4IiB2aWV3Qm94PSIwIDAgMzcgMzUiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDU1LjIgKDc4MTgxKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT5pY29uPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IkNsaWVudC1HZW5lcmFsIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDI0LjAwMDAwMCwgLTc3OC4wMDAwMDApIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICA8ZyBpZD0iY2xvc2VkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0MDUuMDAwMDAwLCA3NTYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0ic3RhcnQtYnV0dG9uIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMzEuNzQwNDU4NSw1Ni45MDg0MzM3IEMzMS40NTYxNTI2LDU2LjkwODQzMzcgMzEuMTcxODQ2Nyw1Ni43OTg1NTQyIDMwLjk0MDg0ODEsNTYuNTc4Nzk1MiBDMzAuNDk2NjIwMiw1Ni4xMjA5NjM5IDMwLjQ5NjYyMDIsNTUuMzg4NDMzNyAzMC45MjMwNzksNTQuOTMwNjAyNCBMMzguOTE5MTgyNyw0Ni41NDMxMzI1IEw1MS4zMDQyNTg4LDQ2LjU0MzEzMjUgQzUyLjE5MjcxNDgsNDYuNTQzMTMyNSA1Mi45MjEyNDg2LDQ1Ljc5MjI4OTIgNTIuOTIxMjQ4Niw0NC44NzY2MjY1IEw1Mi45MjEyNDg2LDI2LjAxMzk3NTkgQzUyLjkyMTI0ODYsMjUuMTM0OTM5OCA1Mi4yMjgyNTMsMjQuNDIwNzIyOSA1MS4zNzUzMzUzLDI0LjQyMDcyMjkgTDIzLjEyMjQzNTcsMjQuNDIwNzIyOSBDMjIuMDkxODI2NywyNC40MjA3MjI5IDIxLjI3NDQ0NzMsMjUuMjgxNDQ1OCAyMS4yNzQ0NDczLDI2LjMyNTMwMTIgTDIxLjI3NDQ0NzMsNDQuOTg2NTA2IEMyMS4yNzQ0NDczLDQ1LjgyODkxNTcgMjEuOTQ5NjczOCw0Ni41MjQ4MTkzIDIyLjc2NzA1MzMsNDYuNTI0ODE5MyBMMjguNjQ4NjMxOCw0Ni41MjQ4MTkzIEMyOS4yNzA1NTA5LDQ2LjUyNDgxOTMgMjkuNzg1ODU1NCw0Ny4wNTU5MDM2IDI5Ljc4NTg1NTQsNDcuNjk2ODY3NSBDMjkuNzg1ODU1NCw0OC4zMzc4MzEzIDI5LjI3MDU1MDksNDguODY4OTE1NyAyOC42NDg2MzE4LDQ4Ljg2ODkxNTcgTDIyLjc2NzA1MzMsNDguODY4OTE1NyBDMjAuNjg4MDY2Myw0OC44Njg5MTU3IDE5LDQ3LjEyOTE1NjYgMTksNDQuOTg2NTA2IEwxOSwyNi4zMjUzMDEyIEMxOSwyMy45ODEyMDQ4IDIwLjg0Nzk4ODQsMjIuMDc2NjI2NSAyMy4xMjI0MzU3LDIyLjA3NjYyNjUgTDUxLjM1NzU2NjEsMjIuMDc2NjI2NSBDNTMuNDcyMDkxMywyMi4wNzY2MjY1IDU1LjE3NzkyNjgsMjMuODM0Njk4OCA1NS4xNzc5MjY4LDI2LjAxMzk3NTkgTDU1LjE3NzkyNjgsNDQuODU4MzEzMyBDNTUuMTc3OTI2OCw0Ny4wNTU5MDM2IDUzLjQzNjU1MzEsNDguODUwNjAyNCA1MS4zMDQyNTg4LDQ4Ljg1MDYwMjQgTDM5Ljg3ODcxNTEsNDguODUwNjAyNCBMMzIuNTQwMDY4OSw1Ni41NDIxNjg3IEMzMi4zMjY4Mzk0LDU2Ljc4MDI0MSAzMi4wMjQ3NjQ0LDU2LjkwODQzMzcgMzEuNzQwNDU4NSw1Ni45MDg0MzM3IFoiIGlkPSJpY29uIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==";
var WidgetIconClose = dataUrlSvg + "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjJweCIgaGVpZ2h0PSIyMnB4IiB2aWV3Qm94PSIwIDAgMjIgMjIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDU1LjIgKDc4MTgxKSAtIGh0dHBzOi8vc2tldGNoYXBwLmNvbSAtLT4KICAgIDx0aXRsZT5Hcm91cCA3PC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IkNsaWVudC1HZW5lcmFsIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjYzMS4wMDAwMDAsIC03ODIuMDAwMDAwKSIgZmlsbD0iI0ZGRkZGRiI+CiAgICAgICAgICAgIDxnIGlkPSJvcGVuLWNvcHktMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjMwMC4wMDAwMDAsIDE0Ni4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJzdGFydC1idXR0b24iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMwNS4wMDAwMDAsIDYxMC4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtNyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjUuMDAwMDAwLCAyNS4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTIuMDAwMDAwLCAxMi4wMDAwMDApIHJvdGF0ZSg0NS4wMDAwMDApIHRyYW5zbGF0ZSgtMTIuMDAwMDAwLCAtMTIuMDAwMDAwKSAiIHg9IjExIiB5PSItMyIgd2lkdGg9IjIiIGhlaWdodD0iMzAiIHJ4PSIxIj48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUtQ29weS01IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMi4wMDAwMDAsIDEyLjAwMDAwMCkgc2NhbGUoMSwgLTEpIHJvdGF0ZSg0NS4wMDAwMDApIHRyYW5zbGF0ZSgtMTIuMDAwMDAwLCAtMTIuMDAwMDAwKSAiIHg9IjExIiB5PSItMyIgd2lkdGg9IjIiIGhlaWdodD0iMzAiIHJ4PSIxIj48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=";
exports.assetsBase64 = {
  GraphikBoldWeb: GraphikBoldWeb,
  GraphikRegularWeb: GraphikRegularWeb,
  ChatAttachIconBlack: ChatAttachIconBlack,
  ChatAttachIconBlue: ChatAttachIconBlue,
  ChatCloseIconBlack: ChatCloseIconBlack,
  ChatRemoveIconBlue: ChatRemoveIconBlue,
  ChatScreenshotIconBlack: ChatScreenshotIconBlack,
  ChatScreenshotIconBlue: ChatScreenshotIconBlue,
  ChatTypingIconBlack: ChatTypingIconBlack,
  WidgetIconChat: WidgetIconChat,
  WidgetIconClose: WidgetIconClose
};
/**
 * For older browsers, CSS variables are automatically replaced in CSS with base64 encoded assets
 * @see ElixirChatWidget.replaceCssVariablesWithDataUrls()
 */

exports.iframeAssetUrlCssVars = ":root {\n  --ElixirChatChatAttachIconBlack:      url(".concat(ChatAttachIconBlack, ");\n  --ElixirChatChatAttachIconBlue:       url(").concat(ChatAttachIconBlue, ");\n  --ElixirChatChatCloseIconBlack:       url(").concat(ChatCloseIconBlack, ");\n  --ElixirChatChatRemoveIconBlue:       url(").concat(ChatRemoveIconBlue, ");\n  --ElixirChatChatScreenshotIconBlack:  url(").concat(ChatScreenshotIconBlack, ");\n  --ElixirChatChatScreenshotIconBlue:   url(").concat(ChatScreenshotIconBlue, ");\n  --ElixirChatChatTypingIconBlack:      url(").concat(ChatTypingIconBlack, ");\n}");
exports.globalAssetUrlCssVars = ":root {\n  --ElixirChatWidgetIconChat:           url(".concat(WidgetIconChat, ");\n  --ElixirChatWidgetIconClose:          url(").concat(WidgetIconClose, ");\n}");
},{"fs":"70rD"}],"Nvy6":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var utilsCommon_1 = require("../utilsCommon");

var utilsWidget_1 = require("../utilsWidget");

var DefaultWidget_1 = require("./DefaultWidget/DefaultWidget");

var assets_1 = require("./DefaultWidget/assets");

var styles_1 = require("./DefaultWidget/styles");

var ElixirChat = window.ElixirChat;

if ("production" === 'development') {
  ElixirChat = require('../sdk').default;
}

if (!ElixirChat) {
  utilsCommon_1.logEvent(true, 'Cannot find ElixirChat SDK. Are you sure you imported SDK (ether via "import" or via the <script/> tag)?\n' + 'See: https://github.com/elixirchat/elixirchat-widget#add-default-widget', {
    NODE_ENV: "production"
  }, 'error');
}

var ElixirChatWidget =
/*#__PURE__*/
function (_ElixirChat) {
  _inherits(ElixirChatWidget, _ElixirChat);

  function ElixirChatWidget() {
    var _this;

    _classCallCheck(this, ElixirChatWidget);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ElixirChatWidget).apply(this, arguments));
    _this.widgetIsVisible = false;
    _this.widgetChatReactComponent = {};
    _this.onToggleChatVisibilityCallbacks = [];

    _this.toggleChatVisibility = function () {
      var iframeClassNameOpening = 'elixirchat-widget-iframe--opening';
      var buttonClassNameVisible = 'elixirchat-widget-button--visible';
      _this.widgetIsVisible = !_this.widgetIsVisible;
      _this.widgetChatIframe.hidden = !_this.widgetIsVisible;

      if (_this.widgetIsVisible) {
        _this.widgetButton.classList.add(buttonClassNameVisible);

        _this.widgetChatIframe.classList.add(iframeClassNameOpening);

        setTimeout(function () {
          _this.widgetChatIframe.classList.remove(iframeClassNameOpening);
        }, 0);
      } else {
        _this.widgetButton.classList.remove(buttonClassNameVisible);
      }

      _this.onToggleChatVisibilityCallbacks.forEach(function (callback) {
        return callback(_this.widgetIsVisible);
      });
    };

    _this.onToggleChatVisibility = function (callback) {
      _this.onToggleChatVisibilityCallbacks.push(callback);
    };

    _this.appendWidget = function (_ref) {
      var container = _ref.container,
          _ref$iframeStyles = _ref.iframeStyles,
          iframeStyles = _ref$iframeStyles === void 0 ? '' : _ref$iframeStyles,
          _ref$visibleByDefault = _ref.visibleByDefault,
          visibleByDefault = _ref$visibleByDefault === void 0 ? false : _ref$visibleByDefault;

      if (!(container instanceof HTMLElement)) {
        var errorMessage = 'You must provide an HTMLElement as a "container" option to appendWidget() method';
        utilsCommon_1.logEvent(_this.debug, errorMessage, {
          container: container,
          iframeStyles: iframeStyles
        }, 'error');
        return;
      }

      _this.container = container;
      _this.iframeStyles = iframeStyles;
      _this.visibleByDefault = visibleByDefault;

      _this.appendChatIframe();

      _this.appendWidgetButton();

      var iframeContainer = _this.widgetChatIframe.contentWindow.document.querySelector('main');

      _this.widgetChatReactComponent = DefaultWidget_1.appendDefaultElixirChatWidget(iframeContainer, _assertThisInitialized(_this));

      _this.addendStyles();

      if (_this.visibleByDefault) {
        _this.toggleChatVisibility();
      }

      utilsCommon_1.logEvent(_this.debug, 'Appended ElixirChat default widget', {
        container: container
      });
      return _this.widgetChatReactComponent;
    };

    return _this;
  }

  _createClass(ElixirChatWidget, [{
    key: "injectGlobalStyles",
    value: function injectGlobalStyles(styles) {
      var cssCode = styles;

      if (!utilsWidget_1.areCssVariablesSupported()) {
        cssCode = utilsWidget_1.replaceCssVariables(styles, utilsWidget_1.parseCssVariables(assets_1.globalAssetUrlCssVars));
      }

      utilsWidget_1.insertElement('style', {
        innerHTML: cssCode,
        type: 'text/css'
      }, this.container);
    }
  }, {
    key: "injectIframeStyles",
    value: function injectIframeStyles(styles) {
      var iframeContainer = this.widgetChatIframe.contentWindow.document.querySelector('main');
      var cssCode = styles;

      if (!utilsWidget_1.areCssVariablesSupported()) {
        cssCode = utilsWidget_1.replaceCssVariables(styles, utilsWidget_1.parseCssVariables(assets_1.iframeAssetUrlCssVars));
      }

      utilsWidget_1.insertElement('style', {
        innerHTML: cssCode,
        type: 'text/css'
      }, iframeContainer);
    }
  }, {
    key: "appendWidgetButton",
    value: function appendWidgetButton() {
      var button = utilsWidget_1.insertElement('button', {
        className: 'elixirchat-widget-button'
      }, this.container);
      button.addEventListener('click', this.toggleChatVisibility);

      if (this.widgetButton) {
        this.widgetButton.remove();
      }

      this.widgetButton = button;
    }
  }, {
    key: "appendChatIframe",
    value: function appendChatIframe() {
      var iframe = utilsWidget_1.insertElement('iframe', {
        hidden: true,
        className: 'elixirchat-widget-iframe'
      }, this.container);
      iframe.contentWindow.document.body.appendChild(utilsWidget_1.insertElement('main'));

      if (this.widgetChatIframe) {
        this.widgetChatIframe.remove();
      }

      this.widgetChatIframe = iframe;
    }
  }, {
    key: "addendStyles",
    value: function addendStyles() {
      this.injectGlobalStyles(styles_1.DefaultWidgetGlobalStyles, this.container);
      this.injectGlobalStyles(assets_1.globalAssetUrlCssVars, this.container);
      this.injectIframeStyles([utilsWidget_1.generateFontFaceRule('Graphik', 'normal', assets_1.assetsBase64.GraphikRegularWeb), utilsWidget_1.generateFontFaceRule('Graphik', 'bold', assets_1.assetsBase64.GraphikBoldWeb)].join('\n'));
      this.injectIframeStyles(this.iframeStyles);
      this.injectIframeStyles(assets_1.iframeAssetUrlCssVars);
    }
  }]);

  return ElixirChatWidget;
}(ElixirChat);

exports.ElixirChatWidget = ElixirChatWidget;

if (typeof window !== 'undefined') {
  window.ElixirChatWidget = ElixirChatWidget;
}
},{"../utilsCommon":"EjGt","../utilsWidget":"4KO9","./DefaultWidget/DefaultWidget":"Fn99","./DefaultWidget/assets":"GpM8","./DefaultWidget/styles":"xqZa"}],"7QCb":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ElixirChatWidget_1 = require("./ElixirChatWidget");

exports.default = ElixirChatWidget_1.ElixirChatWidget;
},{"./ElixirChatWidget":"Nvy6"}]},{},["7QCb"], null)