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
})({"5qf4":[function(require,module,exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],"2uHg":[function(require,module,exports) {
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],"5BXi":[function(require,module,exports) {
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],"P9Ib":[function(require,module,exports) {
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":"5BXi"}],"ss9A":[function(require,module,exports) {
var core = module.exports = { version: '2.6.0' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],"M7z6":[function(require,module,exports) {
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],"eT53":[function(require,module,exports) {
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":"M7z6"}],"/vZ6":[function(require,module,exports) {
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_is-object":"M7z6","./_global":"5qf4"}],"/o6G":[function(require,module,exports) {
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":"P9Ib","./_fails":"5BXi","./_dom-create":"/vZ6"}],"9y37":[function(require,module,exports) {
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":"M7z6"}],"nw8e":[function(require,module,exports) {
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":"eT53","./_ie8-dom-define":"/o6G","./_to-primitive":"9y37","./_descriptors":"P9Ib"}],"uJ6d":[function(require,module,exports) {
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],"0NXb":[function(require,module,exports) {
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_object-dp":"nw8e","./_property-desc":"uJ6d","./_descriptors":"P9Ib"}],"U49f":[function(require,module,exports) {
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],"PHot":[function(require,module,exports) {

var global = require('./_global');
var hide = require('./_hide');
var has = require('./_has');
var SRC = require('./_uid')('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

},{"./_global":"5qf4","./_hide":"0NXb","./_has":"2uHg","./_uid":"U49f","./_core":"ss9A"}],"6kYj":[function(require,module,exports) {
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],"E3Kh":[function(require,module,exports) {
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":"6kYj"}],"izCb":[function(require,module,exports) {

var global = require('./_global');
var core = require('./_core');
var hide = require('./_hide');
var redefine = require('./_redefine');
var ctx = require('./_ctx');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_global":"5qf4","./_core":"ss9A","./_hide":"0NXb","./_redefine":"PHot","./_ctx":"E3Kh"}],"AoVy":[function(require,module,exports) {
var META = require('./_uid')('meta');
var isObject = require('./_is-object');
var has = require('./_has');
var setDesc = require('./_object-dp').f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !require('./_fails')(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};

},{"./_uid":"U49f","./_is-object":"M7z6","./_has":"2uHg","./_object-dp":"nw8e","./_fails":"5BXi"}],"H21C":[function(require,module,exports) {
module.exports = false;

},{}],"6zGc":[function(require,module,exports) {

var core = require('./_core');
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: require('./_library') ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});

},{"./_core":"ss9A","./_global":"5qf4","./_library":"H21C"}],"44AI":[function(require,module,exports) {
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_shared":"6zGc","./_uid":"U49f","./_global":"5qf4"}],"rq3q":[function(require,module,exports) {
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_object-dp":"nw8e","./_has":"2uHg","./_wks":"44AI"}],"AuE7":[function(require,module,exports) {
exports.f = require('./_wks');

},{"./_wks":"44AI"}],"r4vV":[function(require,module,exports) {

var global = require('./_global');
var core = require('./_core');
var LIBRARY = require('./_library');
var wksExt = require('./_wks-ext');
var defineProperty = require('./_object-dp').f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};

},{"./_global":"5qf4","./_core":"ss9A","./_library":"H21C","./_wks-ext":"AuE7","./_object-dp":"nw8e"}],"Z5df":[function(require,module,exports) {
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],"nGau":[function(require,module,exports) {
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":"Z5df"}],"+Bjj":[function(require,module,exports) {
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],"g6sb":[function(require,module,exports) {
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_iobject":"nGau","./_defined":"+Bjj"}],"yjVO":[function(require,module,exports) {
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],"dJBs":[function(require,module,exports) {
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":"yjVO"}],"vfEH":[function(require,module,exports) {
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":"yjVO"}],"4Ca7":[function(require,module,exports) {
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-iobject":"g6sb","./_to-length":"dJBs","./_to-absolute-index":"vfEH"}],"NaGB":[function(require,module,exports) {
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":"6zGc","./_uid":"U49f"}],"vL0Z":[function(require,module,exports) {
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_has":"2uHg","./_to-iobject":"g6sb","./_array-includes":"4Ca7","./_shared-key":"NaGB"}],"9bbv":[function(require,module,exports) {
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],"U9a7":[function(require,module,exports) {
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_object-keys-internal":"vL0Z","./_enum-bug-keys":"9bbv"}],"EWMd":[function(require,module,exports) {
exports.f = Object.getOwnPropertySymbols;

},{}],"vjRp":[function(require,module,exports) {
exports.f = {}.propertyIsEnumerable;

},{}],"0jjw":[function(require,module,exports) {
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

},{"./_object-keys":"U9a7","./_object-gops":"EWMd","./_object-pie":"vjRp"}],"JTrm":[function(require,module,exports) {
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":"Z5df"}],"MiMz":[function(require,module,exports) {
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_object-dp":"nw8e","./_an-object":"eT53","./_object-keys":"U9a7","./_descriptors":"P9Ib"}],"xj/b":[function(require,module,exports) {
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":"5qf4"}],"sYaK":[function(require,module,exports) {
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":"eT53","./_object-dps":"MiMz","./_enum-bug-keys":"9bbv","./_shared-key":"NaGB","./_dom-create":"/vZ6","./_html":"xj/b"}],"Vzm0":[function(require,module,exports) {
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = require('./_object-keys-internal');
var hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};

},{"./_object-keys-internal":"vL0Z","./_enum-bug-keys":"9bbv"}],"dvol":[function(require,module,exports) {
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject');
var gOPN = require('./_object-gopn').f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_to-iobject":"g6sb","./_object-gopn":"Vzm0"}],"uIjZ":[function(require,module,exports) {
var pIE = require('./_object-pie');
var createDesc = require('./_property-desc');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var has = require('./_has');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};

},{"./_object-pie":"vjRp","./_property-desc":"uJ6d","./_to-iobject":"g6sb","./_to-primitive":"9y37","./_has":"2uHg","./_ie8-dom-define":"/o6G","./_descriptors":"P9Ib"}],"uVn9":[function(require,module,exports) {

'use strict';
// ECMAScript 6 symbols shim
var global = require('./_global');
var has = require('./_has');
var DESCRIPTORS = require('./_descriptors');
var $export = require('./_export');
var redefine = require('./_redefine');
var META = require('./_meta').KEY;
var $fails = require('./_fails');
var shared = require('./_shared');
var setToStringTag = require('./_set-to-string-tag');
var uid = require('./_uid');
var wks = require('./_wks');
var wksExt = require('./_wks-ext');
var wksDefine = require('./_wks-define');
var enumKeys = require('./_enum-keys');
var isArray = require('./_is-array');
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var createDesc = require('./_property-desc');
var _create = require('./_object-create');
var gOPNExt = require('./_object-gopn-ext');
var $GOPD = require('./_object-gopd');
var $DP = require('./_object-dp');
var $keys = require('./_object-keys');
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !require('./_library')) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

},{"./_global":"5qf4","./_has":"2uHg","./_descriptors":"P9Ib","./_export":"izCb","./_redefine":"PHot","./_meta":"AoVy","./_fails":"5BXi","./_shared":"6zGc","./_set-to-string-tag":"rq3q","./_uid":"U49f","./_wks":"44AI","./_wks-ext":"AuE7","./_wks-define":"r4vV","./_enum-keys":"0jjw","./_is-array":"JTrm","./_an-object":"eT53","./_is-object":"M7z6","./_to-iobject":"g6sb","./_to-primitive":"9y37","./_property-desc":"uJ6d","./_object-create":"sYaK","./_object-gopn-ext":"dvol","./_object-gopd":"uIjZ","./_object-dp":"nw8e","./_object-keys":"U9a7","./_object-gopn":"Vzm0","./_object-pie":"vjRp","./_object-gops":"EWMd","./_library":"H21C","./_hide":"0NXb"}],"D4xP":[function(require,module,exports) {
var $export = require('./_export');
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: require('./_object-create') });

},{"./_export":"izCb","./_object-create":"sYaK"}],"TSUD":[function(require,module,exports) {
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });

},{"./_export":"izCb","./_descriptors":"P9Ib","./_object-dp":"nw8e"}],"AwOq":[function(require,module,exports) {
var $export = require('./_export');
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperties: require('./_object-dps') });

},{"./_export":"izCb","./_descriptors":"P9Ib","./_object-dps":"MiMz"}],"s7uf":[function(require,module,exports) {
// most Object methods by ES6 should accept primitives
var $export = require('./_export');
var core = require('./_core');
var fails = require('./_fails');
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};

},{"./_export":"izCb","./_core":"ss9A","./_fails":"5BXi"}],"nIty":[function(require,module,exports) {
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = require('./_to-iobject');
var $getOwnPropertyDescriptor = require('./_object-gopd').f;

require('./_object-sap')('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});

},{"./_to-iobject":"g6sb","./_object-gopd":"uIjZ","./_object-sap":"s7uf"}],"rfVX":[function(require,module,exports) {
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":"+Bjj"}],"8q6y":[function(require,module,exports) {
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":"2uHg","./_to-object":"rfVX","./_shared-key":"NaGB"}],"ud3u":[function(require,module,exports) {
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = require('./_to-object');
var $getPrototypeOf = require('./_object-gpo');

require('./_object-sap')('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});

},{"./_to-object":"rfVX","./_object-gpo":"8q6y","./_object-sap":"s7uf"}],"m9aB":[function(require,module,exports) {
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object');
var $keys = require('./_object-keys');

require('./_object-sap')('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});

},{"./_to-object":"rfVX","./_object-keys":"U9a7","./_object-sap":"s7uf"}],"i23/":[function(require,module,exports) {
// 19.1.2.7 Object.getOwnPropertyNames(O)
require('./_object-sap')('getOwnPropertyNames', function () {
  return require('./_object-gopn-ext').f;
});

},{"./_object-sap":"s7uf","./_object-gopn-ext":"dvol"}],"EO7q":[function(require,module,exports) {
// 19.1.2.5 Object.freeze(O)
var isObject = require('./_is-object');
var meta = require('./_meta').onFreeze;

require('./_object-sap')('freeze', function ($freeze) {
  return function freeze(it) {
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});

},{"./_is-object":"M7z6","./_meta":"AoVy","./_object-sap":"s7uf"}],"+4GY":[function(require,module,exports) {
// 19.1.2.17 Object.seal(O)
var isObject = require('./_is-object');
var meta = require('./_meta').onFreeze;

require('./_object-sap')('seal', function ($seal) {
  return function seal(it) {
    return $seal && isObject(it) ? $seal(meta(it)) : it;
  };
});

},{"./_is-object":"M7z6","./_meta":"AoVy","./_object-sap":"s7uf"}],"3llM":[function(require,module,exports) {
// 19.1.2.15 Object.preventExtensions(O)
var isObject = require('./_is-object');
var meta = require('./_meta').onFreeze;

require('./_object-sap')('preventExtensions', function ($preventExtensions) {
  return function preventExtensions(it) {
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});

},{"./_is-object":"M7z6","./_meta":"AoVy","./_object-sap":"s7uf"}],"Z1rp":[function(require,module,exports) {
// 19.1.2.12 Object.isFrozen(O)
var isObject = require('./_is-object');

require('./_object-sap')('isFrozen', function ($isFrozen) {
  return function isFrozen(it) {
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});

},{"./_is-object":"M7z6","./_object-sap":"s7uf"}],"Fckj":[function(require,module,exports) {
// 19.1.2.13 Object.isSealed(O)
var isObject = require('./_is-object');

require('./_object-sap')('isSealed', function ($isSealed) {
  return function isSealed(it) {
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});

},{"./_is-object":"M7z6","./_object-sap":"s7uf"}],"1EYb":[function(require,module,exports) {
// 19.1.2.11 Object.isExtensible(O)
var isObject = require('./_is-object');

require('./_object-sap')('isExtensible', function ($isExtensible) {
  return function isExtensible(it) {
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});

},{"./_is-object":"M7z6","./_object-sap":"s7uf"}],"e3Bp":[function(require,module,exports) {
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;

},{"./_object-keys":"U9a7","./_object-gops":"EWMd","./_object-pie":"vjRp","./_to-object":"rfVX","./_iobject":"nGau","./_fails":"5BXi"}],"K3/J":[function(require,module,exports) {
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', { assign: require('./_object-assign') });

},{"./_export":"izCb","./_object-assign":"e3Bp"}],"zutv":[function(require,module,exports) {
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

},{}],"MlqR":[function(require,module,exports) {
// 19.1.3.10 Object.is(value1, value2)
var $export = require('./_export');
$export($export.S, 'Object', { is: require('./_same-value') });

},{"./_export":"izCb","./_same-value":"zutv"}],"vn3S":[function(require,module,exports) {
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object');
var anObject = require('./_an-object');
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

},{"./_is-object":"M7z6","./_an-object":"eT53","./_ctx":"E3Kh","./_object-gopd":"uIjZ"}],"0JGj":[function(require,module,exports) {
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', { setPrototypeOf: require('./_set-proto').set });

},{"./_export":"izCb","./_set-proto":"vn3S"}],"GM7B":[function(require,module,exports) {
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":"Z5df","./_wks":"44AI"}],"4zTK":[function(require,module,exports) {
'use strict';
// 19.1.3.6 Object.prototype.toString()
var classof = require('./_classof');
var test = {};
test[require('./_wks')('toStringTag')] = 'z';
if (test + '' != '[object z]') {
  require('./_redefine')(Object.prototype, 'toString', function toString() {
    return '[object ' + classof(this) + ']';
  }, true);
}

},{"./_classof":"GM7B","./_wks":"44AI","./_redefine":"PHot"}],"xcbV":[function(require,module,exports) {
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

},{}],"h83E":[function(require,module,exports) {
'use strict';
var aFunction = require('./_a-function');
var isObject = require('./_is-object');
var invoke = require('./_invoke');
var arraySlice = [].slice;
var factories = {};

var construct = function (F, len, args) {
  if (!(len in factories)) {
    for (var n = [], i = 0; i < len; i++) n[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction(this);
  var partArgs = arraySlice.call(arguments, 1);
  var bound = function (/* args... */) {
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if (isObject(fn.prototype)) bound.prototype = fn.prototype;
  return bound;
};

},{"./_a-function":"6kYj","./_is-object":"M7z6","./_invoke":"xcbV"}],"WIhg":[function(require,module,exports) {
// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = require('./_export');

$export($export.P, 'Function', { bind: require('./_bind') });

},{"./_export":"izCb","./_bind":"h83E"}],"N3yi":[function(require,module,exports) {
var dP = require('./_object-dp').f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || require('./_descriptors') && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});

},{"./_object-dp":"nw8e","./_descriptors":"P9Ib"}],"a7bX":[function(require,module,exports) {
'use strict';
var isObject = require('./_is-object');
var getPrototypeOf = require('./_object-gpo');
var HAS_INSTANCE = require('./_wks')('hasInstance');
var FunctionProto = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if (!(HAS_INSTANCE in FunctionProto)) require('./_object-dp').f(FunctionProto, HAS_INSTANCE, { value: function (O) {
  if (typeof this != 'function' || !isObject(O)) return false;
  if (!isObject(this.prototype)) return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while (O = getPrototypeOf(O)) if (this.prototype === O) return true;
  return false;
} });

},{"./_is-object":"M7z6","./_object-gpo":"8q6y","./_wks":"44AI","./_object-dp":"nw8e"}],"ECro":[function(require,module,exports) {
module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

},{}],"y5m2":[function(require,module,exports) {
var $export = require('./_export');
var defined = require('./_defined');
var fails = require('./_fails');
var spaces = require('./_string-ws');
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;

},{"./_export":"izCb","./_defined":"+Bjj","./_fails":"5BXi","./_string-ws":"ECro"}],"8pmY":[function(require,module,exports) {
var $parseInt = require('./_global').parseInt;
var $trim = require('./_string-trim').trim;
var ws = require('./_string-ws');
var hex = /^[-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;

},{"./_global":"5qf4","./_string-trim":"y5m2","./_string-ws":"ECro"}],"0C15":[function(require,module,exports) {
var $export = require('./_export');
var $parseInt = require('./_parse-int');
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), { parseInt: $parseInt });

},{"./_export":"izCb","./_parse-int":"8pmY"}],"0NfQ":[function(require,module,exports) {
var $parseFloat = require('./_global').parseFloat;
var $trim = require('./_string-trim').trim;

module.exports = 1 / $parseFloat(require('./_string-ws') + '-0') !== -Infinity ? function parseFloat(str) {
  var string = $trim(String(str), 3);
  var result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;

},{"./_global":"5qf4","./_string-trim":"y5m2","./_string-ws":"ECro"}],"Q4DA":[function(require,module,exports) {
var $export = require('./_export');
var $parseFloat = require('./_parse-float');
// 18.2.4 parseFloat(string)
$export($export.G + $export.F * (parseFloat != $parseFloat), { parseFloat: $parseFloat });

},{"./_export":"izCb","./_parse-float":"0NfQ"}],"ogxf":[function(require,module,exports) {
var isObject = require('./_is-object');
var setPrototypeOf = require('./_set-proto').set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};

},{"./_is-object":"M7z6","./_set-proto":"vn3S"}],"kRGG":[function(require,module,exports) {

'use strict';
var global = require('./_global');
var has = require('./_has');
var cof = require('./_cof');
var inheritIfRequired = require('./_inherit-if-required');
var toPrimitive = require('./_to-primitive');
var fails = require('./_fails');
var gOPN = require('./_object-gopn').f;
var gOPD = require('./_object-gopd').f;
var dP = require('./_object-dp').f;
var $trim = require('./_string-trim').trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(require('./_object-create')(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = require('./_descriptors') ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  require('./_redefine')(global, NUMBER, $Number);
}

},{"./_global":"5qf4","./_has":"2uHg","./_cof":"Z5df","./_inherit-if-required":"ogxf","./_to-primitive":"9y37","./_fails":"5BXi","./_object-gopn":"Vzm0","./_object-gopd":"uIjZ","./_object-dp":"nw8e","./_string-trim":"y5m2","./_object-create":"sYaK","./_descriptors":"P9Ib","./_redefine":"PHot"}],"25Au":[function(require,module,exports) {
var cof = require('./_cof');
module.exports = function (it, msg) {
  if (typeof it != 'number' && cof(it) != 'Number') throw TypeError(msg);
  return +it;
};

},{"./_cof":"Z5df"}],"UH4U":[function(require,module,exports) {
'use strict';
var toInteger = require('./_to-integer');
var defined = require('./_defined');

module.exports = function repeat(count) {
  var str = String(defined(this));
  var res = '';
  var n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str;
  return res;
};

},{"./_to-integer":"yjVO","./_defined":"+Bjj"}],"vva0":[function(require,module,exports) {
'use strict';
var $export = require('./_export');
var toInteger = require('./_to-integer');
var aNumberValue = require('./_a-number-value');
var repeat = require('./_string-repeat');
var $toFixed = 1.0.toFixed;
var floor = Math.floor;
var data = [0, 0, 0, 0, 0, 0];
var ERROR = 'Number.toFixed: incorrect invocation!';
var ZERO = '0';

var multiply = function (n, c) {
  var i = -1;
  var c2 = c;
  while (++i < 6) {
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};
var divide = function (n) {
  var i = 6;
  var c = 0;
  while (--i >= 0) {
    c += data[i];
    data[i] = floor(c / n);
    c = (c % n) * 1e7;
  }
};
var numToString = function () {
  var i = 6;
  var s = '';
  while (--i >= 0) {
    if (s !== '' || i === 0 || data[i] !== 0) {
      var t = String(data[i]);
      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
    }
  } return s;
};
var pow = function (x, n, acc) {
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};
var log = function (x) {
  var n = 0;
  var x2 = x;
  while (x2 >= 4096) {
    n += 12;
    x2 /= 4096;
  }
  while (x2 >= 2) {
    n += 1;
    x2 /= 2;
  } return n;
};

$export($export.P + $export.F * (!!$toFixed && (
  0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128.0.toFixed(0) !== '1000000000000000128'
) || !require('./_fails')(function () {
  // V8 ~ Android 4.3-
  $toFixed.call({});
})), 'Number', {
  toFixed: function toFixed(fractionDigits) {
    var x = aNumberValue(this, ERROR);
    var f = toInteger(fractionDigits);
    var s = '';
    var m = ZERO;
    var e, z, j, k;
    if (f < 0 || f > 20) throw RangeError(ERROR);
    // eslint-disable-next-line no-self-compare
    if (x != x) return 'NaN';
    if (x <= -1e21 || x >= 1e21) return String(x);
    if (x < 0) {
      s = '-';
      x = -x;
    }
    if (x > 1e-21) {
      e = log(x * pow(2, 69, 1)) - 69;
      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if (e > 0) {
        multiply(0, z);
        j = f;
        while (j >= 7) {
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while (j >= 23) {
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        m = numToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        m = numToString() + repeat.call(ZERO, f);
      }
    }
    if (f > 0) {
      k = m.length;
      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    } return m;
  }
});

},{"./_export":"izCb","./_to-integer":"yjVO","./_a-number-value":"25Au","./_string-repeat":"UH4U","./_fails":"5BXi"}],"Y4ol":[function(require,module,exports) {
'use strict';
var $export = require('./_export');
var $fails = require('./_fails');
var aNumberValue = require('./_a-number-value');
var $toPrecision = 1.0.toPrecision;

$export($export.P + $export.F * ($fails(function () {
  // IE7-
  return $toPrecision.call(1, undefined) !== '1';
}) || !$fails(function () {
  // V8 ~ Android 4.3-
  $toPrecision.call({});
})), 'Number', {
  toPrecision: function toPrecision(precision) {
    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision);
  }
});

},{"./_export":"izCb","./_fails":"5BXi","./_a-number-value":"25Au"}],"DzYy":[function(require,module,exports) {
// 20.1.2.1 Number.EPSILON
var $export = require('./_export');

$export($export.S, 'Number', { EPSILON: Math.pow(2, -52) });

},{"./_export":"izCb"}],"FuY7":[function(require,module,exports) {
// 20.1.2.2 Number.isFinite(number)
var $export = require('./_export');
var _isFinite = require('./_global').isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it) {
    return typeof it == 'number' && _isFinite(it);
  }
});

},{"./_export":"izCb","./_global":"5qf4"}],"T4z7":[function(require,module,exports) {
// 20.1.2.3 Number.isInteger(number)
var isObject = require('./_is-object');
var floor = Math.floor;
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};

},{"./_is-object":"M7z6"}],"pwRL":[function(require,module,exports) {
// 20.1.2.3 Number.isInteger(number)
var $export = require('./_export');

$export($export.S, 'Number', { isInteger: require('./_is-integer') });

},{"./_export":"izCb","./_is-integer":"T4z7"}],"SsgJ":[function(require,module,exports) {
// 20.1.2.4 Number.isNaN(number)
var $export = require('./_export');

$export($export.S, 'Number', {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});

},{"./_export":"izCb"}],"5qVI":[function(require,module,exports) {
// 20.1.2.5 Number.isSafeInteger(number)
var $export = require('./_export');
var isInteger = require('./_is-integer');
var abs = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number) {
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});

},{"./_export":"izCb","./_is-integer":"T4z7"}],"4shx":[function(require,module,exports) {
// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', { MAX_SAFE_INTEGER: 0x1fffffffffffff });

},{"./_export":"izCb"}],"+ifB":[function(require,module,exports) {
// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', { MIN_SAFE_INTEGER: -0x1fffffffffffff });

},{"./_export":"izCb"}],"yjyf":[function(require,module,exports) {
var $export = require('./_export');
var $parseFloat = require('./_parse-float');
// 20.1.2.12 Number.parseFloat(string)
$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', { parseFloat: $parseFloat });

},{"./_export":"izCb","./_parse-float":"0NfQ"}],"Guno":[function(require,module,exports) {
var $export = require('./_export');
var $parseInt = require('./_parse-int');
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', { parseInt: $parseInt });

},{"./_export":"izCb","./_parse-int":"8pmY"}],"ggmj":[function(require,module,exports) {
// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x) {
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};

},{}],"py3/":[function(require,module,exports) {
// 20.2.2.3 Math.acosh(x)
var $export = require('./_export');
var log1p = require('./_math-log1p');
var sqrt = Math.sqrt;
var $acosh = Math.acosh;

$export($export.S + $export.F * !($acosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  && Math.floor($acosh(Number.MAX_VALUE)) == 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN
  && $acosh(Infinity) == Infinity
), 'Math', {
  acosh: function acosh(x) {
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});

},{"./_export":"izCb","./_math-log1p":"ggmj"}],"ob11":[function(require,module,exports) {
// 20.2.2.5 Math.asinh(x)
var $export = require('./_export');
var $asinh = Math.asinh;

function asinh(x) {
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

// Tor Browser bug: Math.asinh(0) -> -0
$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', { asinh: asinh });

},{"./_export":"izCb"}],"iUik":[function(require,module,exports) {
// 20.2.2.7 Math.atanh(x)
var $export = require('./_export');
var $atanh = Math.atanh;

// Tor Browser bug: Math.atanh(-0) -> 0
$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x) {
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});

},{"./_export":"izCb"}],"qtVy":[function(require,module,exports) {
// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};

},{}],"YRuK":[function(require,module,exports) {
// 20.2.2.9 Math.cbrt(x)
var $export = require('./_export');
var sign = require('./_math-sign');

$export($export.S, 'Math', {
  cbrt: function cbrt(x) {
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});

},{"./_export":"izCb","./_math-sign":"qtVy"}],"R2Qc":[function(require,module,exports) {
// 20.2.2.11 Math.clz32(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  clz32: function clz32(x) {
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});

},{"./_export":"izCb"}],"nEse":[function(require,module,exports) {
// 20.2.2.12 Math.cosh(x)
var $export = require('./_export');
var exp = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x) {
    return (exp(x = +x) + exp(-x)) / 2;
  }
});

},{"./_export":"izCb"}],"A+f6":[function(require,module,exports) {
// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
module.exports = (!$expm1
  // Old FF bug
  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || $expm1(-2e-17) != -2e-17
) ? function expm1(x) {
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;

},{}],"AmoX":[function(require,module,exports) {
// 20.2.2.14 Math.expm1(x)
var $export = require('./_export');
var $expm1 = require('./_math-expm1');

$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', { expm1: $expm1 });

},{"./_export":"izCb","./_math-expm1":"A+f6"}],"z6h7":[function(require,module,exports) {
// 20.2.2.16 Math.fround(x)
var sign = require('./_math-sign');
var pow = Math.pow;
var EPSILON = pow(2, -52);
var EPSILON32 = pow(2, -23);
var MAX32 = pow(2, 127) * (2 - EPSILON32);
var MIN32 = pow(2, -126);

var roundTiesToEven = function (n) {
  return n + 1 / EPSILON - 1 / EPSILON;
};

module.exports = Math.fround || function fround(x) {
  var $abs = Math.abs(x);
  var $sign = sign(x);
  var a, result;
  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
  a = (1 + EPSILON32 / EPSILON) * $abs;
  result = a - (a - $abs);
  // eslint-disable-next-line no-self-compare
  if (result > MAX32 || result != result) return $sign * Infinity;
  return $sign * result;
};

},{"./_math-sign":"qtVy"}],"vmlq":[function(require,module,exports) {
// 20.2.2.16 Math.fround(x)
var $export = require('./_export');

$export($export.S, 'Math', { fround: require('./_math-fround') });

},{"./_export":"izCb","./_math-fround":"z6h7"}],"kLut":[function(require,module,exports) {
// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = require('./_export');
var abs = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2) { // eslint-disable-line no-unused-vars
    var sum = 0;
    var i = 0;
    var aLen = arguments.length;
    var larg = 0;
    var arg, div;
    while (i < aLen) {
      arg = abs(arguments[i++]);
      if (larg < arg) {
        div = larg / arg;
        sum = sum * div * div + 1;
        larg = arg;
      } else if (arg > 0) {
        div = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});

},{"./_export":"izCb"}],"A8J8":[function(require,module,exports) {
// 20.2.2.18 Math.imul(x, y)
var $export = require('./_export');
var $imul = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * require('./_fails')(function () {
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y) {
    var UINT16 = 0xffff;
    var xn = +x;
    var yn = +y;
    var xl = UINT16 & xn;
    var yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});

},{"./_export":"izCb","./_fails":"5BXi"}],"VUW8":[function(require,module,exports) {
// 20.2.2.21 Math.log10(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log10: function log10(x) {
    return Math.log(x) * Math.LOG10E;
  }
});

},{"./_export":"izCb"}],"qtpC":[function(require,module,exports) {
// 20.2.2.20 Math.log1p(x)
var $export = require('./_export');

$export($export.S, 'Math', { log1p: require('./_math-log1p') });

},{"./_export":"izCb","./_math-log1p":"ggmj"}],"1Jo9":[function(require,module,exports) {
// 20.2.2.22 Math.log2(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log2: function log2(x) {
    return Math.log(x) / Math.LN2;
  }
});

},{"./_export":"izCb"}],"mZl9":[function(require,module,exports) {
// 20.2.2.28 Math.sign(x)
var $export = require('./_export');

$export($export.S, 'Math', { sign: require('./_math-sign') });

},{"./_export":"izCb","./_math-sign":"qtVy"}],"m0zb":[function(require,module,exports) {
// 20.2.2.30 Math.sinh(x)
var $export = require('./_export');
var expm1 = require('./_math-expm1');
var exp = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * require('./_fails')(function () {
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x) {
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});

},{"./_export":"izCb","./_math-expm1":"A+f6","./_fails":"5BXi"}],"Fnqw":[function(require,module,exports) {
// 20.2.2.33 Math.tanh(x)
var $export = require('./_export');
var expm1 = require('./_math-expm1');
var exp = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x) {
    var a = expm1(x = +x);
    var b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});

},{"./_export":"izCb","./_math-expm1":"A+f6"}],"tiOR":[function(require,module,exports) {
// 20.2.2.34 Math.trunc(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  trunc: function trunc(it) {
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});

},{"./_export":"izCb"}],"xSM3":[function(require,module,exports) {
var $export = require('./_export');
var toAbsoluteIndex = require('./_to-absolute-index');
var fromCharCode = String.fromCharCode;
var $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x) { // eslint-disable-line no-unused-vars
    var res = [];
    var aLen = arguments.length;
    var i = 0;
    var code;
    while (aLen > i) {
      code = +arguments[i++];
      if (toAbsoluteIndex(code, 0x10ffff) !== code) throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});

},{"./_export":"izCb","./_to-absolute-index":"vfEH"}],"t2/9":[function(require,module,exports) {
var $export = require('./_export');
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite) {
    var tpl = toIObject(callSite.raw);
    var len = toLength(tpl.length);
    var aLen = arguments.length;
    var res = [];
    var i = 0;
    while (len > i) {
      res.push(String(tpl[i++]));
      if (i < aLen) res.push(String(arguments[i]));
    } return res.join('');
  }
});

},{"./_export":"izCb","./_to-iobject":"g6sb","./_to-length":"dJBs"}],"ZW4n":[function(require,module,exports) {
'use strict';
// 21.1.3.25 String.prototype.trim()
require('./_string-trim')('trim', function ($trim) {
  return function trim() {
    return $trim(this, 3);
  };
});

},{"./_string-trim":"y5m2"}],"x5yM":[function(require,module,exports) {
var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_to-integer":"yjVO","./_defined":"+Bjj"}],"JO4d":[function(require,module,exports) {
module.exports = {};

},{}],"ebgP":[function(require,module,exports) {
'use strict';
var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_object-create":"sYaK","./_property-desc":"uJ6d","./_set-to-string-tag":"rq3q","./_hide":"0NXb","./_wks":"44AI"}],"mH0U":[function(require,module,exports) {
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_library":"H21C","./_export":"izCb","./_redefine":"PHot","./_hide":"0NXb","./_iterators":"JO4d","./_iter-create":"ebgP","./_set-to-string-tag":"rq3q","./_object-gpo":"8q6y","./_wks":"44AI"}],"tbKg":[function(require,module,exports) {
'use strict';
var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_string-at":"x5yM","./_iter-define":"mH0U"}],"zR9y":[function(require,module,exports) {
'use strict';
var $export = require('./_export');
var $at = require('./_string-at')(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos) {
    return $at(this, pos);
  }
});

},{"./_export":"izCb","./_string-at":"x5yM"}],"6WEV":[function(require,module,exports) {
// 7.2.8 IsRegExp(argument)
var isObject = require('./_is-object');
var cof = require('./_cof');
var MATCH = require('./_wks')('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};

},{"./_is-object":"M7z6","./_cof":"Z5df","./_wks":"44AI"}],"GbTB":[function(require,module,exports) {
// helper for String#{startsWith, endsWith, includes}
var isRegExp = require('./_is-regexp');
var defined = require('./_defined');

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};

},{"./_is-regexp":"6WEV","./_defined":"+Bjj"}],"Ah+n":[function(require,module,exports) {
var MATCH = require('./_wks')('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};

},{"./_wks":"44AI"}],"zRn7":[function(require,module,exports) {
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
'use strict';
var $export = require('./_export');
var toLength = require('./_to-length');
var context = require('./_string-context');
var ENDS_WITH = 'endsWith';
var $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /* , endPosition = @length */) {
    var that = context(this, searchString, ENDS_WITH);
    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
    var len = toLength(that.length);
    var end = endPosition === undefined ? len : Math.min(toLength(endPosition), len);
    var search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});

},{"./_export":"izCb","./_to-length":"dJBs","./_string-context":"GbTB","./_fails-is-regexp":"Ah+n"}],"fH7p":[function(require,module,exports) {
// 21.1.3.7 String.prototype.includes(searchString, position = 0)
'use strict';
var $export = require('./_export');
var context = require('./_string-context');
var INCLUDES = 'includes';

$export($export.P + $export.F * require('./_fails-is-regexp')(INCLUDES), 'String', {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"./_export":"izCb","./_string-context":"GbTB","./_fails-is-regexp":"Ah+n"}],"C85R":[function(require,module,exports) {
var $export = require('./_export');

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./_string-repeat')
});

},{"./_export":"izCb","./_string-repeat":"UH4U"}],"w2SA":[function(require,module,exports) {
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';
var $export = require('./_export');
var toLength = require('./_to-length');
var context = require('./_string-context');
var STARTS_WITH = 'startsWith';
var $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = context(this, searchString, STARTS_WITH);
    var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});

},{"./_export":"izCb","./_to-length":"dJBs","./_string-context":"GbTB","./_fails-is-regexp":"Ah+n"}],"NE20":[function(require,module,exports) {
var $export = require('./_export');
var fails = require('./_fails');
var defined = require('./_defined');
var quot = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function (string, tag, attribute, value) {
  var S = String(defined(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function (NAME, exec) {
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function () {
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};

},{"./_export":"izCb","./_fails":"5BXi","./_defined":"+Bjj"}],"63US":[function(require,module,exports) {
'use strict';
// B.2.3.2 String.prototype.anchor(name)
require('./_string-html')('anchor', function (createHTML) {
  return function anchor(name) {
    return createHTML(this, 'a', 'name', name);
  };
});

},{"./_string-html":"NE20"}],"c1D0":[function(require,module,exports) {
'use strict';
// B.2.3.3 String.prototype.big()
require('./_string-html')('big', function (createHTML) {
  return function big() {
    return createHTML(this, 'big', '', '');
  };
});

},{"./_string-html":"NE20"}],"Ee86":[function(require,module,exports) {
'use strict';
// B.2.3.4 String.prototype.blink()
require('./_string-html')('blink', function (createHTML) {
  return function blink() {
    return createHTML(this, 'blink', '', '');
  };
});

},{"./_string-html":"NE20"}],"ry39":[function(require,module,exports) {
'use strict';
// B.2.3.5 String.prototype.bold()
require('./_string-html')('bold', function (createHTML) {
  return function bold() {
    return createHTML(this, 'b', '', '');
  };
});

},{"./_string-html":"NE20"}],"AHLq":[function(require,module,exports) {
'use strict';
// B.2.3.6 String.prototype.fixed()
require('./_string-html')('fixed', function (createHTML) {
  return function fixed() {
    return createHTML(this, 'tt', '', '');
  };
});

},{"./_string-html":"NE20"}],"H7V0":[function(require,module,exports) {
'use strict';
// B.2.3.7 String.prototype.fontcolor(color)
require('./_string-html')('fontcolor', function (createHTML) {
  return function fontcolor(color) {
    return createHTML(this, 'font', 'color', color);
  };
});

},{"./_string-html":"NE20"}],"Dx83":[function(require,module,exports) {
'use strict';
// B.2.3.8 String.prototype.fontsize(size)
require('./_string-html')('fontsize', function (createHTML) {
  return function fontsize(size) {
    return createHTML(this, 'font', 'size', size);
  };
});

},{"./_string-html":"NE20"}],"fRhg":[function(require,module,exports) {
'use strict';
// B.2.3.9 String.prototype.italics()
require('./_string-html')('italics', function (createHTML) {
  return function italics() {
    return createHTML(this, 'i', '', '');
  };
});

},{"./_string-html":"NE20"}],"1Aaz":[function(require,module,exports) {
'use strict';
// B.2.3.10 String.prototype.link(url)
require('./_string-html')('link', function (createHTML) {
  return function link(url) {
    return createHTML(this, 'a', 'href', url);
  };
});

},{"./_string-html":"NE20"}],"qBr3":[function(require,module,exports) {
'use strict';
// B.2.3.11 String.prototype.small()
require('./_string-html')('small', function (createHTML) {
  return function small() {
    return createHTML(this, 'small', '', '');
  };
});

},{"./_string-html":"NE20"}],"eNyu":[function(require,module,exports) {
'use strict';
// B.2.3.12 String.prototype.strike()
require('./_string-html')('strike', function (createHTML) {
  return function strike() {
    return createHTML(this, 'strike', '', '');
  };
});

},{"./_string-html":"NE20"}],"BVLK":[function(require,module,exports) {
'use strict';
// B.2.3.13 String.prototype.sub()
require('./_string-html')('sub', function (createHTML) {
  return function sub() {
    return createHTML(this, 'sub', '', '');
  };
});

},{"./_string-html":"NE20"}],"kMsL":[function(require,module,exports) {
'use strict';
// B.2.3.14 String.prototype.sup()
require('./_string-html')('sup', function (createHTML) {
  return function sup() {
    return createHTML(this, 'sup', '', '');
  };
});

},{"./_string-html":"NE20"}],"susM":[function(require,module,exports) {
// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = require('./_export');

$export($export.S, 'Date', { now: function () { return new Date().getTime(); } });

},{"./_export":"izCb"}],"Gj6n":[function(require,module,exports) {
'use strict';
var $export = require('./_export');
var toObject = require('./_to-object');
var toPrimitive = require('./_to-primitive');

$export($export.P + $export.F * require('./_fails')(function () {
  return new Date(NaN).toJSON() !== null
    || Date.prototype.toJSON.call({ toISOString: function () { return 1; } }) !== 1;
}), 'Date', {
  // eslint-disable-next-line no-unused-vars
  toJSON: function toJSON(key) {
    var O = toObject(this);
    var pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});

},{"./_export":"izCb","./_to-object":"rfVX","./_to-primitive":"9y37","./_fails":"5BXi"}],"tJHX":[function(require,module,exports) {
'use strict';
// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var fails = require('./_fails');
var getTime = Date.prototype.getTime;
var $toISOString = Date.prototype.toISOString;

var lz = function (num) {
  return num > 9 ? num : '0' + num;
};

// PhantomJS / old WebKit has a broken implementations
module.exports = (fails(function () {
  return $toISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
}) || !fails(function () {
  $toISOString.call(new Date(NaN));
})) ? function toISOString() {
  if (!isFinite(getTime.call(this))) throw RangeError('Invalid time value');
  var d = this;
  var y = d.getUTCFullYear();
  var m = d.getUTCMilliseconds();
  var s = y < 0 ? '-' : y > 9999 ? '+' : '';
  return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
    '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
    'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
    ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
} : $toISOString;

},{"./_fails":"5BXi"}],"oGqv":[function(require,module,exports) {
// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var $export = require('./_export');
var toISOString = require('./_date-to-iso-string');

// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (Date.prototype.toISOString !== toISOString), 'Date', {
  toISOString: toISOString
});

},{"./_export":"izCb","./_date-to-iso-string":"tJHX"}],"QX5V":[function(require,module,exports) {
var DateProto = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var $toString = DateProto[TO_STRING];
var getTime = DateProto.getTime;
if (new Date(NaN) + '' != INVALID_DATE) {
  require('./_redefine')(DateProto, TO_STRING, function toString() {
    var value = getTime.call(this);
    // eslint-disable-next-line no-self-compare
    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}

},{"./_redefine":"PHot"}],"8pVj":[function(require,module,exports) {
'use strict';
var anObject = require('./_an-object');
var toPrimitive = require('./_to-primitive');
var NUMBER = 'number';

module.exports = function (hint) {
  if (hint !== 'string' && hint !== NUMBER && hint !== 'default') throw TypeError('Incorrect hint');
  return toPrimitive(anObject(this), hint != NUMBER);
};

},{"./_an-object":"eT53","./_to-primitive":"9y37"}],"jQnQ":[function(require,module,exports) {
var TO_PRIMITIVE = require('./_wks')('toPrimitive');
var proto = Date.prototype;

if (!(TO_PRIMITIVE in proto)) require('./_hide')(proto, TO_PRIMITIVE, require('./_date-to-primitive'));

},{"./_wks":"44AI","./_hide":"0NXb","./_date-to-primitive":"8pVj"}],"x7iF":[function(require,module,exports) {
// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = require('./_export');

$export($export.S, 'Array', { isArray: require('./_is-array') });

},{"./_export":"izCb","./_is-array":"JTrm"}],"RnO+":[function(require,module,exports) {
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":"eT53"}],"0B0p":[function(require,module,exports) {
// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":"JO4d","./_wks":"44AI"}],"JCwR":[function(require,module,exports) {
'use strict';
var $defineProperty = require('./_object-dp');
var createDesc = require('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

},{"./_object-dp":"nw8e","./_property-desc":"uJ6d"}],"ia+4":[function(require,module,exports) {
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":"GM7B","./_wks":"44AI","./_iterators":"JO4d","./_core":"ss9A"}],"md62":[function(require,module,exports) {
var ITERATOR = require('./_wks')('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

},{"./_wks":"44AI"}],"RRcs":[function(require,module,exports) {
'use strict';
var ctx = require('./_ctx');
var $export = require('./_export');
var toObject = require('./_to-object');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var toLength = require('./_to-length');
var createProperty = require('./_create-property');
var getIterFn = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_ctx":"E3Kh","./_export":"izCb","./_to-object":"rfVX","./_iter-call":"RnO+","./_is-array-iter":"0B0p","./_to-length":"dJBs","./_create-property":"JCwR","./core.get-iterator-method":"ia+4","./_iter-detect":"md62"}],"RB6b":[function(require,module,exports) {
'use strict';
var $export = require('./_export');
var createProperty = require('./_create-property');

// WebKit Array.of isn't generic
$export($export.S + $export.F * require('./_fails')(function () {
  function F() { /* empty */ }
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */) {
    var index = 0;
    var aLen = arguments.length;
    var result = new (typeof this == 'function' ? this : Array)(aLen);
    while (aLen > index) createProperty(result, index, arguments[index++]);
    result.length = aLen;
    return result;
  }
});

},{"./_export":"izCb","./_create-property":"JCwR","./_fails":"5BXi"}],"2Hh2":[function(require,module,exports) {
'use strict';
var fails = require('./_fails');

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};

},{"./_fails":"5BXi"}],"Rs/6":[function(require,module,exports) {
'use strict';
// 22.1.3.13 Array.prototype.join(separator)
var $export = require('./_export');
var toIObject = require('./_to-iobject');
var arrayJoin = [].join;

// fallback for not array-like strings
$export($export.P + $export.F * (require('./_iobject') != Object || !require('./_strict-method')(arrayJoin)), 'Array', {
  join: function join(separator) {
    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
  }
});

},{"./_export":"izCb","./_to-iobject":"g6sb","./_iobject":"nGau","./_strict-method":"2Hh2"}],"btFn":[function(require,module,exports) {
'use strict';
var $export = require('./_export');
var html = require('./_html');
var cof = require('./_cof');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');
var arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * require('./_fails')(function () {
  if (html) arraySlice.call(html);
}), 'Array', {
  slice: function slice(begin, end) {
    var len = toLength(this.length);
    var klass = cof(this);
    end = end === undefined ? len : end;
    if (klass == 'Array') return arraySlice.call(this, begin, end);
    var start = toAbsoluteIndex(begin, len);
    var upTo = toAbsoluteIndex(end, len);
    var size = toLength(upTo - start);
    var cloned = new Array(size);
    var i = 0;
    for (; i < size; i++) cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});

},{"./_export":"izCb","./_html":"xj/b","./_cof":"Z5df","./_to-absolute-index":"vfEH","./_to-length":"dJBs","./_fails":"5BXi"}],"nrVf":[function(require,module,exports) {
'use strict';
var $export = require('./_export');
var aFunction = require('./_a-function');
var toObject = require('./_to-object');
var fails = require('./_fails');
var $sort = [].sort;
var test = [1, 2, 3];

$export($export.P + $export.F * (fails(function () {
  // IE8-
  test.sort(undefined);
}) || !fails(function () {
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !require('./_strict-method')($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});

},{"./_export":"izCb","./_a-function":"6kYj","./_to-object":"rfVX","./_fails":"5BXi","./_strict-method":"2Hh2"}],"NNbH":[function(require,module,exports) {
var isObject = require('./_is-object');
var isArray = require('./_is-array');
var SPECIES = require('./_wks')('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

},{"./_is-object":"M7z6","./_is-array":"JTrm","./_wks":"44AI"}],"igas":[function(require,module,exports) {
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};

},{"./_array-species-constructor":"NNbH"}],"AuPh":[function(require,module,exports) {
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = require('./_ctx');
var IObject = require('./_iobject');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var asc = require('./_array-species-create');
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

},{"./_ctx":"E3Kh","./_iobject":"nGau","./_to-object":"rfVX","./_to-length":"dJBs","./_array-species-create":"igas"}],"VsIt":[function(require,module,exports) {
'use strict';
var $export = require('./_export');
var $forEach = require('./_array-methods')(0);
var STRICT = require('./_strict-method')([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */) {
    return $forEach(this, callbackfn, arguments[1]);
  }
});

},{"./_export":"izCb","./_array-methods":"AuPh","./_strict-method":"2Hh2"}],"RBsu":[function(require,module,exports) {
'use strict';
var $export = require('./_export');
var $map = require('./_array-methods')(1);

$export($export.P + $export.F * !require('./_strict-method')([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments[1]);
  }
});

},{"./_export":"izCb","./_array-methods":"AuPh","./_strict-method":"2Hh2"}],"GyG6":[function(require,module,exports) {
'use strict';
var $export = require('./_export');
var $filter = require('./_array-methods')(2);

$export($export.P + $export.F * !require('./_strict-method')([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments[1]);
  }
});

},{"./_export":"izCb","./_array-methods":"AuPh","./_strict-method":"2Hh2"}],"dwTY":[function(require,module,exports) {
'use strict';
var $export = require('./_export');
var $some = require('./_array-methods')(3);

$export($export.P + $export.F * !require('./_strict-method')([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn /* , thisArg */) {
    return $some(this, callbackfn, arguments[1]);
  }
});

},{"./_export":"izCb","./_array-methods":"AuPh","./_strict-method":"2Hh2"}],"AJ80":[function(require,module,exports) {
'use strict';
var $export = require('./_export');
var $every = require('./_array-methods')(4);

$export($export.P + $export.F * !require('./_strict-method')([].every, true), 'Array', {
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn /* , thisArg */) {
    return $every(this, callbackfn, arguments[1]);
  }
});

},{"./_export":"izCb","./_array-methods":"AuPh","./_strict-method":"2Hh2"}],"BcRj":[function(require,module,exports) {
var aFunction = require('./_a-function');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var toLength = require('./_to-length');

module.exports = function (that, callbackfn, aLen, memo, isRight) {
  aFunction(callbackfn);
  var O = toObject(that);
  var self = IObject(O);
  var length = toLength(O.length);
  var index = isRight ? length - 1 : 0;
  var i = isRight ? -1 : 1;
  if (aLen < 2) for (;;) {
    if (index in self) {
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if (isRight ? index < 0 : length <= index) {
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for (;isRight ? index >= 0 : length > index; index += i) if (index in self) {
    memo = callbackfn(memo, self[index], index, O);
  }
  return memo;
};

},{"./_a-function":"6kYj","./_to-object":"rfVX","./_iobject":"nGau","./_to-length":"dJBs"}],"UGP9":[function(require,module,exports) {
'use strict';
var $export = require('./_export');
var $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});

},{"./_export":"izCb","./_array-reduce":"BcRj","./_strict-method":"2Hh2"}],"9qhG":[function(require,module,exports) {
'use strict';
var $export = require('./_export');
var $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduceRight, true), 'Array', {
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
  }
});

},{"./_export":"izCb","./_array-reduce":"BcRj","./_strict-method":"2Hh2"}],"LvRh":[function(require,module,exports) {
'use strict';
var $export = require('./_export');
var $indexOf = require('./_array-includes')(false);
var $native = [].indexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});

},{"./_export":"izCb","./_array-includes":"4Ca7","./_strict-method":"2Hh2"}],"kVuL":[function(require,module,exports) {
'use strict';
var $export = require('./_export');
var toIObject = require('./_to-iobject');
var toInteger = require('./_to-integer');
var toLength = require('./_to-length');
var $native = [].lastIndexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
    // convert -0 to +0
    if (NEGATIVE_ZERO) return $native.apply(this, arguments) || 0;
    var O = toIObject(this);
    var length = toLength(O.length);
    var index = length - 1;
    if (arguments.length > 1) index = Math.min(index, toInteger(arguments[1]));
    if (index < 0) index = length + index;
    for (;index >= 0; index--) if (index in O) if (O[index] === searchElement) return index || 0;
    return -1;
  }
});

},{"./_export":"izCb","./_to-iobject":"g6sb","./_to-integer":"yjVO","./_to-length":"dJBs","./_strict-method":"2Hh2"}],"Oppn":[function(require,module,exports) {
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';
var toObject = require('./_to-object');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');

module.exports = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = toObject(this);
  var len = toLength(O.length);
  var to = toAbsoluteIndex(target, len);
  var from = toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = Math.min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
  var inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];
    else delete O[to];
    to += inc;
    from += inc;
  } return O;
};

},{"./_to-object":"rfVX","./_to-absolute-index":"vfEH","./_to-length":"dJBs"}],"Z7e/":[function(require,module,exports) {
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./_wks')('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) require('./_hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

},{"./_wks":"44AI","./_hide":"0NXb"}],"tWTB":[function(require,module,exports) {
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', { copyWithin: require('./_array-copy-within') });

require('./_add-to-unscopables')('copyWithin');

},{"./_export":"izCb","./_array-copy-within":"Oppn","./_add-to-unscopables":"Z7e/"}],"hphS":[function(require,module,exports) {
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';
var toObject = require('./_to-object');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var aLen = arguments.length;
  var index = toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
  var end = aLen > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};

},{"./_to-object":"rfVX","./_to-absolute-index":"vfEH","./_to-length":"dJBs"}],"hUQ6":[function(require,module,exports) {
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', { fill: require('./_array-fill') });

require('./_add-to-unscopables')('fill');

},{"./_export":"izCb","./_array-fill":"hphS","./_add-to-unscopables":"Z7e/"}],"Qppk":[function(require,module,exports) {
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = require('./_export');
var $find = require('./_array-methods')(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);

},{"./_export":"izCb","./_array-methods":"AuPh","./_add-to-unscopables":"Z7e/"}],"7sVm":[function(require,module,exports) {
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = require('./_export');
var $find = require('./_array-methods')(6);
var KEY = 'findIndex';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);

},{"./_export":"izCb","./_array-methods":"AuPh","./_add-to-unscopables":"Z7e/"}],"5h4d":[function(require,module,exports) {

'use strict';
var global = require('./_global');
var dP = require('./_object-dp');
var DESCRIPTORS = require('./_descriptors');
var SPECIES = require('./_wks')('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};

},{"./_global":"5qf4","./_object-dp":"nw8e","./_descriptors":"P9Ib","./_wks":"44AI"}],"smn3":[function(require,module,exports) {
require('./_set-species')('Array');

},{"./_set-species":"5h4d"}],"x8b3":[function(require,module,exports) {
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],"6w+v":[function(require,module,exports) {
'use strict';
var addToUnscopables = require('./_add-to-unscopables');
var step = require('./_iter-step');
var Iterators = require('./_iterators');
var toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":"Z7e/","./_iter-step":"x8b3","./_iterators":"JO4d","./_to-iobject":"g6sb","./_iter-define":"mH0U"}],"hgks":[function(require,module,exports) {
'use strict';
// 21.2.5.3 get RegExp.prototype.flags
var anObject = require('./_an-object');
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

},{"./_an-object":"eT53"}],"+05B":[function(require,module,exports) {

var global = require('./_global');
var inheritIfRequired = require('./_inherit-if-required');
var dP = require('./_object-dp').f;
var gOPN = require('./_object-gopn').f;
var isRegExp = require('./_is-regexp');
var $flags = require('./_flags');
var $RegExp = global.RegExp;
var Base = $RegExp;
var proto = $RegExp.prototype;
var re1 = /a/g;
var re2 = /a/g;
// "new" creates a new object, old webkit buggy here
var CORRECT_NEW = new $RegExp(re1) !== re1;

if (require('./_descriptors') && (!CORRECT_NEW || require('./_fails')(function () {
  re2[require('./_wks')('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))) {
  $RegExp = function RegExp(p, f) {
    var tiRE = this instanceof $RegExp;
    var piRE = isRegExp(p);
    var fiU = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function (key) {
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function () { return Base[key]; },
      set: function (it) { Base[key] = it; }
    });
  };
  for (var keys = gOPN(Base), i = 0; keys.length > i;) proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  require('./_redefine')(global, 'RegExp', $RegExp);
}

require('./_set-species')('RegExp');

},{"./_global":"5qf4","./_inherit-if-required":"ogxf","./_object-dp":"nw8e","./_object-gopn":"Vzm0","./_is-regexp":"6WEV","./_flags":"hgks","./_descriptors":"P9Ib","./_fails":"5BXi","./_wks":"44AI","./_redefine":"PHot","./_set-species":"5h4d"}],"ZcPD":[function(require,module,exports) {
'use strict';

var regexpFlags = require('./_flags');

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;

},{"./_flags":"hgks"}],"S07n":[function(require,module,exports) {
'use strict';
var regexpExec = require('./_regexp-exec');
require('./_export')({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});

},{"./_regexp-exec":"ZcPD","./_export":"izCb"}],"pDhD":[function(require,module,exports) {
// 21.2.5.3 get RegExp.prototype.flags()
if (require('./_descriptors') && /./g.flags != 'g') require('./_object-dp').f(RegExp.prototype, 'flags', {
  configurable: true,
  get: require('./_flags')
});

},{"./_descriptors":"P9Ib","./_object-dp":"nw8e","./_flags":"hgks"}],"iflU":[function(require,module,exports) {

'use strict';
require('./es6.regexp.flags');
var anObject = require('./_an-object');
var $flags = require('./_flags');
var DESCRIPTORS = require('./_descriptors');
var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function (fn) {
  require('./_redefine')(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (require('./_fails')(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}

},{"./es6.regexp.flags":"pDhD","./_an-object":"eT53","./_flags":"hgks","./_descriptors":"P9Ib","./_redefine":"PHot","./_fails":"5BXi"}],"/t3a":[function(require,module,exports) {
'use strict';
var at = require('./_string-at')(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};

},{"./_string-at":"x5yM"}],"sNFG":[function(require,module,exports) {
'use strict';

var classof = require('./_classof');
var builtinExec = RegExp.prototype.exec;

 // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};

},{"./_classof":"GM7B"}],"LmBS":[function(require,module,exports) {
'use strict';
require('./es6.regexp.exec');
var redefine = require('./_redefine');
var hide = require('./_hide');
var fails = require('./_fails');
var defined = require('./_defined');
var wks = require('./_wks');
var regexpExec = require('./_regexp-exec');

var SPECIES = wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };
    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};

},{"./es6.regexp.exec":"S07n","./_redefine":"PHot","./_hide":"0NXb","./_fails":"5BXi","./_defined":"+Bjj","./_wks":"44AI","./_regexp-exec":"ZcPD"}],"RTfC":[function(require,module,exports) {
'use strict';

var anObject = require('./_an-object');
var toLength = require('./_to-length');
var advanceStringIndex = require('./_advance-string-index');
var regExpExec = require('./_regexp-exec-abstract');

// @@match logic
require('./_fix-re-wks')('match', 1, function (defined, MATCH, $match, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = defined(this);
      var fn = regexp == undefined ? undefined : regexp[MATCH];
      return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
    function (regexp) {
      var res = maybeCallNative($match, regexp, this);
      if (res.done) return res.value;
      var rx = anObject(regexp);
      var S = String(this);
      if (!rx.global) return regExpExec(rx, S);
      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regExpExec(rx, S)) !== null) {
        var matchStr = String(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});

},{"./_an-object":"eT53","./_to-length":"dJBs","./_advance-string-index":"/t3a","./_regexp-exec-abstract":"sNFG","./_fix-re-wks":"LmBS"}],"KGao":[function(require,module,exports) {
var global = arguments[3];
'use strict';

var anObject = require('./_an-object');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var toInteger = require('./_to-integer');
var advanceStringIndex = require('./_advance-string-index');
var regExpExec = require('./_regexp-exec-abstract');
var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
require('./_fix-re-wks')('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = defined(this);
      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
      return fn !== undefined
        ? fn.call(searchValue, O, replaceValue)
        : $replace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      var res = maybeCallNative($replace, regexp, this, replaceValue);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);
      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;
        results.push(result);
        if (!global) break;
        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }
      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return $replace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return ch;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return ch;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return ch;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});

},{"./_an-object":"eT53","./_to-object":"rfVX","./_to-length":"dJBs","./_to-integer":"yjVO","./_advance-string-index":"/t3a","./_regexp-exec-abstract":"sNFG","./_fix-re-wks":"LmBS"}],"zOab":[function(require,module,exports) {
'use strict';

var anObject = require('./_an-object');
var sameValue = require('./_same-value');
var regExpExec = require('./_regexp-exec-abstract');

// @@search logic
require('./_fix-re-wks')('search', 1, function (defined, SEARCH, $search, maybeCallNative) {
  return [
    // `String.prototype.search` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.search
    function search(regexp) {
      var O = defined(this);
      var fn = regexp == undefined ? undefined : regexp[SEARCH];
      return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
    },
    // `RegExp.prototype[@@search]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
    function (regexp) {
      var res = maybeCallNative($search, regexp, this);
      if (res.done) return res.value;
      var rx = anObject(regexp);
      var S = String(this);
      var previousLastIndex = rx.lastIndex;
      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
      var result = regExpExec(rx, S);
      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
      return result === null ? -1 : result.index;
    }
  ];
});

},{"./_an-object":"eT53","./_same-value":"zutv","./_regexp-exec-abstract":"sNFG","./_fix-re-wks":"LmBS"}],"Ex+G":[function(require,module,exports) {
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = require('./_an-object');
var aFunction = require('./_a-function');
var SPECIES = require('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

},{"./_an-object":"eT53","./_a-function":"6kYj","./_wks":"44AI"}],"a/o/":[function(require,module,exports) {
'use strict';

var isRegExp = require('./_is-regexp');
var anObject = require('./_an-object');
var speciesConstructor = require('./_species-constructor');
var advanceStringIndex = require('./_advance-string-index');
var toLength = require('./_to-length');
var callRegExpExec = require('./_regexp-exec-abstract');
var regexpExec = require('./_regexp-exec');
var $min = Math.min;
var $push = [].push;
var $SPLIT = 'split';
var LENGTH = 'length';
var LAST_INDEX = 'lastIndex';

// eslint-disable-next-line no-empty
var SUPPORTS_Y = !!(function () { try { return new RegExp('x', 'y'); } catch (e) {} })();

// @@split logic
require('./_fix-re-wks')('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
  var internalSplit = $split;
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return $split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy[LAST_INDEX];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : $split.call(this, separator, limit);
    };
  }

  return [
    // `String.prototype.split` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = defined(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(String(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                    (rx.multiline ? 'm' : '') +
                    (rx.unicode ? 'u' : '') +
                    (SUPPORTS_Y ? 'y' : 'g');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
      var lim = limit === undefined ? 0xffffffff : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = SUPPORTS_Y ? q : 0;
        var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
        var e;
        if (
          z === null ||
          (e = $min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
});

},{"./_is-regexp":"6WEV","./_an-object":"eT53","./_species-constructor":"Ex+G","./_advance-string-index":"/t3a","./_to-length":"dJBs","./_regexp-exec-abstract":"sNFG","./_regexp-exec":"ZcPD","./_fix-re-wks":"LmBS"}],"yJTF":[function(require,module,exports) {
module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

},{}],"Abke":[function(require,module,exports) {
var ctx = require('./_ctx');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var anObject = require('./_an-object');
var toLength = require('./_to-length');
var getIterFn = require('./core.get-iterator-method');
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;

},{"./_ctx":"E3Kh","./_iter-call":"RnO+","./_is-array-iter":"0B0p","./_an-object":"eT53","./_to-length":"dJBs","./core.get-iterator-method":"ia+4"}],"KY9y":[function(require,module,exports) {


var ctx = require('./_ctx');
var invoke = require('./_invoke');
var html = require('./_html');
var cel = require('./_dom-create');
var global = require('./_global');
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (require('./_cof')(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};

},{"./_ctx":"E3Kh","./_invoke":"xcbV","./_html":"xj/b","./_dom-create":"/vZ6","./_global":"5qf4","./_cof":"Z5df"}],"sFAp":[function(require,module,exports) {


var global = require('./_global');
var macrotask = require('./_task').set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = require('./_cof')(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

},{"./_global":"5qf4","./_task":"KY9y","./_cof":"Z5df"}],"L7XN":[function(require,module,exports) {
'use strict';
// 25.4.1.5 NewPromiseCapability(C)
var aFunction = require('./_a-function');

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};

},{"./_a-function":"6kYj"}],"tyG8":[function(require,module,exports) {
module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

},{}],"O5uh":[function(require,module,exports) {

var global = require('./_global');
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';

},{"./_global":"5qf4"}],"cNG8":[function(require,module,exports) {
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var newPromiseCapability = require('./_new-promise-capability');

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

},{"./_an-object":"eT53","./_is-object":"M7z6","./_new-promise-capability":"L7XN"}],"J0Tl":[function(require,module,exports) {
var redefine = require('./_redefine');
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};

},{"./_redefine":"PHot"}],"Pjta":[function(require,module,exports) {


'use strict';
var LIBRARY = require('./_library');
var global = require('./_global');
var ctx = require('./_ctx');
var classof = require('./_classof');
var $export = require('./_export');
var isObject = require('./_is-object');
var aFunction = require('./_a-function');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var speciesConstructor = require('./_species-constructor');
var task = require('./_task').set;
var microtask = require('./_microtask')();
var newPromiseCapabilityModule = require('./_new-promise-capability');
var perform = require('./_perform');
var userAgent = require('./_user-agent');
var promiseResolve = require('./_promise-resolve');
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = require('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
require('./_set-to-string-tag')($Promise, PROMISE);
require('./_set-species')(PROMISE);
Wrapper = require('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

},{"./_library":"H21C","./_global":"5qf4","./_ctx":"E3Kh","./_classof":"GM7B","./_export":"izCb","./_is-object":"M7z6","./_a-function":"6kYj","./_an-instance":"yJTF","./_for-of":"Abke","./_species-constructor":"Ex+G","./_task":"KY9y","./_microtask":"sFAp","./_new-promise-capability":"L7XN","./_perform":"tyG8","./_user-agent":"O5uh","./_promise-resolve":"cNG8","./_wks":"44AI","./_redefine-all":"J0Tl","./_set-to-string-tag":"rq3q","./_set-species":"5h4d","./_core":"ss9A","./_iter-detect":"md62"}],"1FW4":[function(require,module,exports) {
var isObject = require('./_is-object');
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

},{"./_is-object":"M7z6"}],"8aIi":[function(require,module,exports) {
'use strict';
var dP = require('./_object-dp').f;
var create = require('./_object-create');
var redefineAll = require('./_redefine-all');
var ctx = require('./_ctx');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var $iterDefine = require('./_iter-define');
var step = require('./_iter-step');
var setSpecies = require('./_set-species');
var DESCRIPTORS = require('./_descriptors');
var fastKey = require('./_meta').fastKey;
var validate = require('./_validate-collection');
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

},{"./_object-dp":"nw8e","./_object-create":"sYaK","./_redefine-all":"J0Tl","./_ctx":"E3Kh","./_an-instance":"yJTF","./_for-of":"Abke","./_iter-define":"mH0U","./_iter-step":"x8b3","./_set-species":"5h4d","./_descriptors":"P9Ib","./_meta":"AoVy","./_validate-collection":"1FW4"}],"hWYB":[function(require,module,exports) {

'use strict';
var global = require('./_global');
var $export = require('./_export');
var redefine = require('./_redefine');
var redefineAll = require('./_redefine-all');
var meta = require('./_meta');
var forOf = require('./_for-of');
var anInstance = require('./_an-instance');
var isObject = require('./_is-object');
var fails = require('./_fails');
var $iterDetect = require('./_iter-detect');
var setToStringTag = require('./_set-to-string-tag');
var inheritIfRequired = require('./_inherit-if-required');

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  var fixMethod = function (KEY) {
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function (a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a) {
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a) { fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b) { fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance = new C();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    var ACCEPT_ITERABLES = $iterDetect(function (iter) { new C(iter); }); // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new C();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    // weak collections should not contains .clear method
    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};

},{"./_global":"5qf4","./_export":"izCb","./_redefine":"PHot","./_redefine-all":"J0Tl","./_meta":"AoVy","./_for-of":"Abke","./_an-instance":"yJTF","./_is-object":"M7z6","./_fails":"5BXi","./_iter-detect":"md62","./_set-to-string-tag":"rq3q","./_inherit-if-required":"ogxf"}],"ioKM":[function(require,module,exports) {
'use strict';
var strong = require('./_collection-strong');
var validate = require('./_validate-collection');
var MAP = 'Map';

// 23.1 Map Objects
module.exports = require('./_collection')(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);

},{"./_collection-strong":"8aIi","./_validate-collection":"1FW4","./_collection":"hWYB"}],"coyu":[function(require,module,exports) {
'use strict';
var strong = require('./_collection-strong');
var validate = require('./_validate-collection');
var SET = 'Set';

// 23.2 Set Objects
module.exports = require('./_collection')(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);

},{"./_collection-strong":"8aIi","./_validate-collection":"1FW4","./_collection":"hWYB"}],"BNoi":[function(require,module,exports) {
'use strict';
var redefineAll = require('./_redefine-all');
var getWeak = require('./_meta').getWeak;
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var createArrayMethod = require('./_array-methods');
var $has = require('./_has');
var validate = require('./_validate-collection');
var arrayFind = createArrayMethod(5);
var arrayFindIndex = createArrayMethod(6);
var id = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function (that) {
  return that._l || (that._l = new UncaughtFrozenStore());
};
var UncaughtFrozenStore = function () {
  this.a = [];
};
var findUncaughtFrozen = function (store, key) {
  return arrayFind(store.a, function (it) {
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function (key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function (key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function (key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function (key) {
    var index = arrayFindIndex(this.a, function (it) {
      return it[0] === key;
    });
    if (~index) this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;      // collection type
      that._i = id++;      // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function (key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME))['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME)).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var data = getWeak(anObject(key), true);
    if (data === true) uncaughtFrozenStore(that).set(key, value);
    else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};

},{"./_redefine-all":"J0Tl","./_meta":"AoVy","./_an-object":"eT53","./_is-object":"M7z6","./_an-instance":"yJTF","./_for-of":"Abke","./_array-methods":"AuPh","./_has":"2uHg","./_validate-collection":"1FW4"}],"D6DP":[function(require,module,exports) {
'use strict';
var each = require('./_array-methods')(0);
var redefine = require('./_redefine');
var meta = require('./_meta');
var assign = require('./_object-assign');
var weak = require('./_collection-weak');
var isObject = require('./_is-object');
var fails = require('./_fails');
var validate = require('./_validate-collection');
var WEAK_MAP = 'WeakMap';
var getWeak = meta.getWeak;
var isExtensible = Object.isExtensible;
var uncaughtFrozenStore = weak.ufstore;
var tmp = {};
var InternalMap;

var wrapper = function (get) {
  return function WeakMap() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key) {
    if (isObject(key)) {
      var data = getWeak(key);
      if (data === true) return uncaughtFrozenStore(validate(this, WEAK_MAP)).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value) {
    return weak.def(validate(this, WEAK_MAP), key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = require('./_collection')(WEAK_MAP, wrapper, methods, weak, true, true);

// IE11 WeakMap frozen keys fix
if (fails(function () { return new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7; })) {
  InternalMap = weak.getConstructor(wrapper, WEAK_MAP);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function (key) {
    var proto = $WeakMap.prototype;
    var method = proto[key];
    redefine(proto, key, function (a, b) {
      // store frozen objects on internal weakmap shim
      if (isObject(a) && !isExtensible(a)) {
        if (!this._f) this._f = new InternalMap();
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}

},{"./_array-methods":"AuPh","./_redefine":"PHot","./_meta":"AoVy","./_object-assign":"e3Bp","./_collection-weak":"BNoi","./_is-object":"M7z6","./_fails":"5BXi","./_validate-collection":"1FW4","./_collection":"hWYB"}],"bRUR":[function(require,module,exports) {
'use strict';
var weak = require('./_collection-weak');
var validate = require('./_validate-collection');
var WEAK_SET = 'WeakSet';

// 23.4 WeakSet Objects
require('./_collection')(WEAK_SET, function (get) {
  return function WeakSet() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value) {
    return weak.def(validate(this, WEAK_SET), value, true);
  }
}, weak, false, true);

},{"./_collection-weak":"BNoi","./_validate-collection":"1FW4","./_collection":"hWYB"}],"fero":[function(require,module,exports) {

var global = require('./_global');
var hide = require('./_hide');
var uid = require('./_uid');
var TYPED = uid('typed_array');
var VIEW = uid('view');
var ABV = !!(global.ArrayBuffer && global.DataView);
var CONSTR = ABV;
var i = 0;
var l = 9;
var Typed;

var TypedArrayConstructors = (
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
).split(',');

while (i < l) {
  if (Typed = global[TypedArrayConstructors[i++]]) {
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV: ABV,
  CONSTR: CONSTR,
  TYPED: TYPED,
  VIEW: VIEW
};

},{"./_global":"5qf4","./_hide":"0NXb","./_uid":"U49f"}],"16zj":[function(require,module,exports) {
// https://tc39.github.io/ecma262/#sec-toindex
var toInteger = require('./_to-integer');
var toLength = require('./_to-length');
module.exports = function (it) {
  if (it === undefined) return 0;
  var number = toInteger(it);
  var length = toLength(number);
  if (number !== length) throw RangeError('Wrong length!');
  return length;
};

},{"./_to-integer":"yjVO","./_to-length":"dJBs"}],"Ujpk":[function(require,module,exports) {

'use strict';
var global = require('./_global');
var DESCRIPTORS = require('./_descriptors');
var LIBRARY = require('./_library');
var $typed = require('./_typed');
var hide = require('./_hide');
var redefineAll = require('./_redefine-all');
var fails = require('./_fails');
var anInstance = require('./_an-instance');
var toInteger = require('./_to-integer');
var toLength = require('./_to-length');
var toIndex = require('./_to-index');
var gOPN = require('./_object-gopn').f;
var dP = require('./_object-dp').f;
var arrayFill = require('./_array-fill');
var setToStringTag = require('./_set-to-string-tag');
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length!';
var WRONG_INDEX = 'Wrong index!';
var $ArrayBuffer = global[ARRAY_BUFFER];
var $DataView = global[DATA_VIEW];
var Math = global.Math;
var RangeError = global.RangeError;
// eslint-disable-next-line no-shadow-restricted-names
var Infinity = global.Infinity;
var BaseBuffer = $ArrayBuffer;
var abs = Math.abs;
var pow = Math.pow;
var floor = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;
var BUFFER = 'buffer';
var BYTE_LENGTH = 'byteLength';
var BYTE_OFFSET = 'byteOffset';
var $BUFFER = DESCRIPTORS ? '_b' : BUFFER;
var $LENGTH = DESCRIPTORS ? '_l' : BYTE_LENGTH;
var $OFFSET = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
function packIEEE754(value, mLen, nBytes) {
  var buffer = new Array(nBytes);
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0;
  var i = 0;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  var e, m, c;
  value = abs(value);
  // eslint-disable-next-line no-self-compare
  if (value != value || value === Infinity) {
    // eslint-disable-next-line no-self-compare
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if (value * (c = pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
  buffer[--i] |= s * 128;
  return buffer;
}
function unpackIEEE754(buffer, mLen, nBytes) {
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = eLen - 7;
  var i = nBytes - 1;
  var s = buffer[i--];
  var e = s & 127;
  var m;
  s >>= 7;
  for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  } return (s ? -1 : 1) * m * pow(2, e - mLen);
}

function unpackI32(bytes) {
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
}
function packI8(it) {
  return [it & 0xff];
}
function packI16(it) {
  return [it & 0xff, it >> 8 & 0xff];
}
function packI32(it) {
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
}
function packF64(it) {
  return packIEEE754(it, 52, 8);
}
function packF32(it) {
  return packIEEE754(it, 23, 4);
}

function addGetter(C, key, internal) {
  dP(C[PROTOTYPE], key, { get: function () { return this[internal]; } });
}

function get(view, bytes, index, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
}
function set(view, bytes, index, conversion, value, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = conversion(+value);
  for (var i = 0; i < bytes; i++) store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
}

if (!$typed.ABV) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
    var byteLength = toIndex(length);
    this._b = arrayFill.call(new Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH];
    var offset = toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if (DESCRIPTORS) {
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if (!fails(function () {
    $ArrayBuffer(1);
  }) || !fails(function () {
    new $ArrayBuffer(-1); // eslint-disable-line no-new
  }) || fails(function () {
    new $ArrayBuffer(); // eslint-disable-line no-new
    new $ArrayBuffer(1.5); // eslint-disable-line no-new
    new $ArrayBuffer(NaN); // eslint-disable-line no-new
    return $ArrayBuffer.name != ARRAY_BUFFER;
  })) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer);
      return new BaseBuffer(toIndex(length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for (var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) hide($ArrayBuffer, key, BaseBuffer[key]);
    }
    if (!LIBRARY) ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2));
  var $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if (view.getInt8(0) || !view.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;

},{"./_global":"5qf4","./_descriptors":"P9Ib","./_library":"H21C","./_typed":"fero","./_hide":"0NXb","./_redefine-all":"J0Tl","./_fails":"5BXi","./_an-instance":"yJTF","./_to-integer":"yjVO","./_to-length":"dJBs","./_to-index":"16zj","./_object-gopn":"Vzm0","./_object-dp":"nw8e","./_array-fill":"hphS","./_set-to-string-tag":"rq3q"}],"4NJ0":[function(require,module,exports) {
'use strict';
var $export = require('./_export');
var $typed = require('./_typed');
var buffer = require('./_typed-buffer');
var anObject = require('./_an-object');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');
var isObject = require('./_is-object');
var ArrayBuffer = require('./_global').ArrayBuffer;
var speciesConstructor = require('./_species-constructor');
var $ArrayBuffer = buffer.ArrayBuffer;
var $DataView = buffer.DataView;
var $isView = $typed.ABV && ArrayBuffer.isView;
var $slice = $ArrayBuffer.prototype.slice;
var VIEW = $typed.VIEW;
var ARRAY_BUFFER = 'ArrayBuffer';

$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), { ArrayBuffer: $ArrayBuffer });

$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it) {
    return $isView && $isView(it) || isObject(it) && VIEW in it;
  }
});

$export($export.P + $export.U + $export.F * require('./_fails')(function () {
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end) {
    if ($slice !== undefined && end === undefined) return $slice.call(anObject(this), start); // FF fix
    var len = anObject(this).byteLength;
    var first = toAbsoluteIndex(start, len);
    var fin = toAbsoluteIndex(end === undefined ? len : end, len);
    var result = new (speciesConstructor(this, $ArrayBuffer))(toLength(fin - first));
    var viewS = new $DataView(this);
    var viewT = new $DataView(result);
    var index = 0;
    while (first < fin) {
      viewT.setUint8(index++, viewS.getUint8(first++));
    } return result;
  }
});

require('./_set-species')(ARRAY_BUFFER);

},{"./_export":"izCb","./_typed":"fero","./_typed-buffer":"Ujpk","./_an-object":"eT53","./_to-absolute-index":"vfEH","./_to-length":"dJBs","./_is-object":"M7z6","./_global":"5qf4","./_species-constructor":"Ex+G","./_fails":"5BXi","./_set-species":"5h4d"}],"qL4B":[function(require,module,exports) {
var $export = require('./_export');
$export($export.G + $export.W + $export.F * !require('./_typed').ABV, {
  DataView: require('./_typed-buffer').DataView
});

},{"./_export":"izCb","./_typed":"fero","./_typed-buffer":"Ujpk"}],"4fd0":[function(require,module,exports) {
var global = arguments[3];
'use strict';
if (require('./_descriptors')) {
  var LIBRARY = require('./_library');
  var global = require('./_global');
  var fails = require('./_fails');
  var $export = require('./_export');
  var $typed = require('./_typed');
  var $buffer = require('./_typed-buffer');
  var ctx = require('./_ctx');
  var anInstance = require('./_an-instance');
  var propertyDesc = require('./_property-desc');
  var hide = require('./_hide');
  var redefineAll = require('./_redefine-all');
  var toInteger = require('./_to-integer');
  var toLength = require('./_to-length');
  var toIndex = require('./_to-index');
  var toAbsoluteIndex = require('./_to-absolute-index');
  var toPrimitive = require('./_to-primitive');
  var has = require('./_has');
  var classof = require('./_classof');
  var isObject = require('./_is-object');
  var toObject = require('./_to-object');
  var isArrayIter = require('./_is-array-iter');
  var create = require('./_object-create');
  var getPrototypeOf = require('./_object-gpo');
  var gOPN = require('./_object-gopn').f;
  var getIterFn = require('./core.get-iterator-method');
  var uid = require('./_uid');
  var wks = require('./_wks');
  var createArrayMethod = require('./_array-methods');
  var createArrayIncludes = require('./_array-includes');
  var speciesConstructor = require('./_species-constructor');
  var ArrayIterators = require('./es6.array.iterator');
  var Iterators = require('./_iterators');
  var $iterDetect = require('./_iter-detect');
  var setSpecies = require('./_set-species');
  var arrayFill = require('./_array-fill');
  var arrayCopyWithin = require('./_array-copy-within');
  var $DP = require('./_object-dp');
  var $GOPD = require('./_object-gopd');
  var dP = $DP.f;
  var gOPD = $GOPD.f;
  var RangeError = global.RangeError;
  var TypeError = global.TypeError;
  var Uint8Array = global.Uint8Array;
  var ARRAY_BUFFER = 'ArrayBuffer';
  var SHARED_BUFFER = 'Shared' + ARRAY_BUFFER;
  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
  var PROTOTYPE = 'prototype';
  var ArrayProto = Array[PROTOTYPE];
  var $ArrayBuffer = $buffer.ArrayBuffer;
  var $DataView = $buffer.DataView;
  var arrayForEach = createArrayMethod(0);
  var arrayFilter = createArrayMethod(2);
  var arraySome = createArrayMethod(3);
  var arrayEvery = createArrayMethod(4);
  var arrayFind = createArrayMethod(5);
  var arrayFindIndex = createArrayMethod(6);
  var arrayIncludes = createArrayIncludes(true);
  var arrayIndexOf = createArrayIncludes(false);
  var arrayValues = ArrayIterators.values;
  var arrayKeys = ArrayIterators.keys;
  var arrayEntries = ArrayIterators.entries;
  var arrayLastIndexOf = ArrayProto.lastIndexOf;
  var arrayReduce = ArrayProto.reduce;
  var arrayReduceRight = ArrayProto.reduceRight;
  var arrayJoin = ArrayProto.join;
  var arraySort = ArrayProto.sort;
  var arraySlice = ArrayProto.slice;
  var arrayToString = ArrayProto.toString;
  var arrayToLocaleString = ArrayProto.toLocaleString;
  var ITERATOR = wks('iterator');
  var TAG = wks('toStringTag');
  var TYPED_CONSTRUCTOR = uid('typed_constructor');
  var DEF_CONSTRUCTOR = uid('def_constructor');
  var ALL_CONSTRUCTORS = $typed.CONSTR;
  var TYPED_ARRAY = $typed.TYPED;
  var VIEW = $typed.VIEW;
  var WRONG_LENGTH = 'Wrong length!';

  var $map = createArrayMethod(1, function (O, length) {
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function () {
    // eslint-disable-next-line no-undef
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function () {
    new Uint8Array(1).set({});
  });

  var toOffset = function (it, BYTES) {
    var offset = toInteger(it);
    if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function (it) {
    if (isObject(it) && TYPED_ARRAY in it) return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function (C, length) {
    if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
      throw TypeError('It is not a typed array constructor!');
    } return new C(length);
  };

  var speciesFromList = function (O, list) {
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function (C, list) {
    var index = 0;
    var length = list.length;
    var result = allocate(C, length);
    while (length > index) result[index] = list[index++];
    return result;
  };

  var addGetter = function (it, key, internal) {
    dP(it, key, { get: function () { return this._d[internal]; } });
  };

  var $from = function from(source /* , mapfn, thisArg */) {
    var O = toObject(source);
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iterFn = getIterFn(O);
    var i, length, values, result, step, iterator;
    if (iterFn != undefined && !isArrayIter(iterFn)) {
      for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
        values.push(step.value);
      } O = values;
    }
    if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);
    for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of(/* ...items */) {
    var index = 0;
    var length = arguments.length;
    var result = allocate(this, length);
    while (length > index) result[index] = arguments[index++];
    return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function () { arrayToLocaleString.call(new Uint8Array(1)); });

  var $toLocaleString = function toLocaleString() {
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /* , end */) {
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /* , thisArg */) {
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /* , start, end */) { // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /* , thisArg */) {
      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
        arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /* , thisArg */) {
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /* , thisArg */) {
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /* , thisArg */) {
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /* , fromIndex */) {
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /* , fromIndex */) {
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator) { // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /* , fromIndex */) { // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /* , thisArg */) {
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse() {
      var that = this;
      var length = validate(that).length;
      var middle = Math.floor(length / 2);
      var index = 0;
      var value;
      while (index < middle) {
        value = that[index];
        that[index++] = that[--length];
        that[length] = value;
      } return that;
    },
    some: function some(callbackfn /* , thisArg */) {
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn) {
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end) {
      var O = validate(this);
      var length = O.length;
      var $begin = toAbsoluteIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
        O.buffer,
        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - $begin)
      );
    }
  };

  var $slice = function slice(start, end) {
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /* , offset */) {
    validate(this);
    var offset = toOffset(arguments[1], 1);
    var length = this.length;
    var src = toObject(arrayLike);
    var len = toLength(src.length);
    var index = 0;
    if (len + offset > length) throw RangeError(WRONG_LENGTH);
    while (index < len) this[offset + index] = src[index++];
  };

  var $iterators = {
    entries: function entries() {
      return arrayEntries.call(validate(this));
    },
    keys: function keys() {
      return arrayKeys.call(validate(this));
    },
    values: function values() {
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function (target, key) {
    return isObject(target)
      && target[TYPED_ARRAY]
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key) {
    return isTAIndex(target, key = toPrimitive(key, true))
      ? propertyDesc(2, target[key])
      : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc) {
    if (isTAIndex(target, key = toPrimitive(key, true))
      && isObject(desc)
      && has(desc, 'value')
      && !has(desc, 'get')
      && !has(desc, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !desc.configurable
      && (!has(desc, 'writable') || desc.writable)
      && (!has(desc, 'enumerable') || desc.enumerable)
    ) {
      target[key] = desc.value;
      return target;
    } return dP(target, key, desc);
  };

  if (!ALL_CONSTRUCTORS) {
    $GOPD.f = $getDesc;
    $DP.f = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty: $setDesc
  });

  if (fails(function () { arrayToString.call({}); })) {
    arrayToString = arrayToLocaleString = function toString() {
      return arrayJoin.call(this);
    };
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice: $slice,
    set: $set,
    constructor: function () { /* noop */ },
    toString: arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function () { return this[TYPED_ARRAY]; }
  });

  // eslint-disable-next-line max-statements
  module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
    CLAMPED = !!CLAMPED;
    var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + KEY;
    var SETTER = 'set' + KEY;
    var TypedArray = global[NAME];
    var Base = TypedArray || {};
    var TAC = TypedArray && getPrototypeOf(TypedArray);
    var FORCED = !TypedArray || !$typed.ABV;
    var O = {};
    var TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function (that, index) {
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function (that, index, value) {
      var data = that._d;
      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function (that, index) {
      dP(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if (FORCED) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME, '_d');
        var index = 0;
        var offset = 0;
        var buffer, byteLength, length, klass;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new $ArrayBuffer(byteLength);
        } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + offset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (TYPED_ARRAY in data) {
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if (!fails(function () {
      TypedArray(1);
    }) || !fails(function () {
      new TypedArray(-1); // eslint-disable-line no-new
    }) || !$iterDetect(function (iter) {
      new TypedArray(); // eslint-disable-line no-new
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(1.5); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if (!isObject(data)) return new Base(toIndex(data));
        if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          return $length !== undefined
            ? new Base(data, toOffset($offset, BYTES), $length)
            : $offset !== undefined
              ? new Base(data, toOffset($offset, BYTES))
              : new Base(data);
        }
        if (TYPED_ARRAY in data) return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function (key) {
        if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if (!LIBRARY) TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator = TypedArrayPrototype[ITERATOR];
    var CORRECT_ITER_NAME = !!$nativeIterator
      && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined);
    var $iterator = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
      dP(TypedArrayPrototype, TAG, {
        get: function () { return NAME; }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES
    });

    $export($export.S + $export.F * fails(function () { Base.of.call(TypedArray, 1); }), NAME, {
      from: $from,
      of: $of
    });

    if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, { set: $set });

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    if (!LIBRARY && TypedArrayPrototype.toString != arrayToString) TypedArrayPrototype.toString = arrayToString;

    $export($export.P + $export.F * fails(function () {
      new TypedArray(1).slice();
    }), NAME, { slice: $slice });

    $export($export.P + $export.F * (fails(function () {
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
    }) || !fails(function () {
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, { toLocaleString: $toLocaleString });

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if (!LIBRARY && !CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function () { /* empty */ };

},{"./_descriptors":"P9Ib","./_library":"H21C","./_global":"5qf4","./_fails":"5BXi","./_export":"izCb","./_typed":"fero","./_typed-buffer":"Ujpk","./_ctx":"E3Kh","./_an-instance":"yJTF","./_property-desc":"uJ6d","./_hide":"0NXb","./_redefine-all":"J0Tl","./_to-integer":"yjVO","./_to-length":"dJBs","./_to-index":"16zj","./_to-absolute-index":"vfEH","./_to-primitive":"9y37","./_has":"2uHg","./_classof":"GM7B","./_is-object":"M7z6","./_to-object":"rfVX","./_is-array-iter":"0B0p","./_object-create":"sYaK","./_object-gpo":"8q6y","./_object-gopn":"Vzm0","./core.get-iterator-method":"ia+4","./_uid":"U49f","./_wks":"44AI","./_array-methods":"AuPh","./_array-includes":"4Ca7","./_species-constructor":"Ex+G","./es6.array.iterator":"6w+v","./_iterators":"JO4d","./_iter-detect":"md62","./_set-species":"5h4d","./_array-fill":"hphS","./_array-copy-within":"Oppn","./_object-dp":"nw8e","./_object-gopd":"uIjZ"}],"wqM+":[function(require,module,exports) {
require('./_typed-array')('Int8', 1, function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":"4fd0"}],"QTtY":[function(require,module,exports) {
require('./_typed-array')('Uint8', 1, function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":"4fd0"}],"Kqgs":[function(require,module,exports) {
require('./_typed-array')('Uint8', 1, function (init) {
  return function Uint8ClampedArray(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
}, true);

},{"./_typed-array":"4fd0"}],"fEGw":[function(require,module,exports) {
require('./_typed-array')('Int16', 2, function (init) {
  return function Int16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":"4fd0"}],"xyd6":[function(require,module,exports) {
require('./_typed-array')('Uint16', 2, function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":"4fd0"}],"hIko":[function(require,module,exports) {
require('./_typed-array')('Int32', 4, function (init) {
  return function Int32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":"4fd0"}],"tNPN":[function(require,module,exports) {
require('./_typed-array')('Uint32', 4, function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":"4fd0"}],"/wis":[function(require,module,exports) {
require('./_typed-array')('Float32', 4, function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":"4fd0"}],"9mbT":[function(require,module,exports) {
require('./_typed-array')('Float64', 8, function (init) {
  return function Float64Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":"4fd0"}],"F0Xu":[function(require,module,exports) {
// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export = require('./_export');
var aFunction = require('./_a-function');
var anObject = require('./_an-object');
var rApply = (require('./_global').Reflect || {}).apply;
var fApply = Function.apply;
// MS Edge argumentsList argument is optional
$export($export.S + $export.F * !require('./_fails')(function () {
  rApply(function () { /* empty */ });
}), 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList) {
    var T = aFunction(target);
    var L = anObject(argumentsList);
    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
  }
});

},{"./_export":"izCb","./_a-function":"6kYj","./_an-object":"eT53","./_global":"5qf4","./_fails":"5BXi"}],"4JlF":[function(require,module,exports) {
// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export = require('./_export');
var create = require('./_object-create');
var aFunction = require('./_a-function');
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var fails = require('./_fails');
var bind = require('./_bind');
var rConstruct = (require('./_global').Reflect || {}).construct;

// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() { /* empty */ }
  return !(rConstruct(function () { /* empty */ }, [], F) instanceof F);
});
var ARGS_BUG = !fails(function () {
  rConstruct(function () { /* empty */ });
});

$export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args /* , newTarget */) {
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return rConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = create(isObject(proto) ? proto : Object.prototype);
    var result = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});

},{"./_export":"izCb","./_object-create":"sYaK","./_a-function":"6kYj","./_an-object":"eT53","./_is-object":"M7z6","./_fails":"5BXi","./_bind":"h83E","./_global":"5qf4"}],"S841":[function(require,module,exports) {
// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP = require('./_object-dp');
var $export = require('./_export');
var anObject = require('./_an-object');
var toPrimitive = require('./_to-primitive');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * require('./_fails')(function () {
  // eslint-disable-next-line no-undef
  Reflect.defineProperty(dP.f({}, 1, { value: 1 }), 1, { value: 2 });
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes) {
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_object-dp":"nw8e","./_export":"izCb","./_an-object":"eT53","./_to-primitive":"9y37","./_fails":"5BXi"}],"JRlJ":[function(require,module,exports) {
// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export = require('./_export');
var gOPD = require('./_object-gopd').f;
var anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey) {
    var desc = gOPD(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});

},{"./_export":"izCb","./_object-gopd":"uIjZ","./_an-object":"eT53"}],"bSEr":[function(require,module,exports) {
'use strict';
// 26.1.5 Reflect.enumerate(target)
var $export = require('./_export');
var anObject = require('./_an-object');
var Enumerate = function (iterated) {
  this._t = anObject(iterated); // target
  this._i = 0;                  // next index
  var keys = this._k = [];      // keys
  var key;
  for (key in iterated) keys.push(key);
};
require('./_iter-create')(Enumerate, 'Object', function () {
  var that = this;
  var keys = that._k;
  var key;
  do {
    if (that._i >= keys.length) return { value: undefined, done: true };
  } while (!((key = keys[that._i++]) in that._t));
  return { value: key, done: false };
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target) {
    return new Enumerate(target);
  }
});

},{"./_export":"izCb","./_an-object":"eT53","./_iter-create":"ebgP"}],"kv8Z":[function(require,module,exports) {
// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD = require('./_object-gopd');
var getPrototypeOf = require('./_object-gpo');
var has = require('./_has');
var $export = require('./_export');
var isObject = require('./_is-object');
var anObject = require('./_an-object');

function get(target, propertyKey /* , receiver */) {
  var receiver = arguments.length < 3 ? target : arguments[2];
  var desc, proto;
  if (anObject(target) === receiver) return target[propertyKey];
  if (desc = gOPD.f(target, propertyKey)) return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if (isObject(proto = getPrototypeOf(target))) return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', { get: get });

},{"./_object-gopd":"uIjZ","./_object-gpo":"8q6y","./_has":"2uHg","./_export":"izCb","./_is-object":"M7z6","./_an-object":"eT53"}],"zj1X":[function(require,module,exports) {
// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD = require('./_object-gopd');
var $export = require('./_export');
var anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
    return gOPD.f(anObject(target), propertyKey);
  }
});

},{"./_object-gopd":"uIjZ","./_export":"izCb","./_an-object":"eT53"}],"d0aC":[function(require,module,exports) {
// 26.1.8 Reflect.getPrototypeOf(target)
var $export = require('./_export');
var getProto = require('./_object-gpo');
var anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target) {
    return getProto(anObject(target));
  }
});

},{"./_export":"izCb","./_object-gpo":"8q6y","./_an-object":"eT53"}],"OWTq":[function(require,module,exports) {
// 26.1.9 Reflect.has(target, propertyKey)
var $export = require('./_export');

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey) {
    return propertyKey in target;
  }
});

},{"./_export":"izCb"}],"deHu":[function(require,module,exports) {
// 26.1.10 Reflect.isExtensible(target)
var $export = require('./_export');
var anObject = require('./_an-object');
var $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target) {
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});

},{"./_export":"izCb","./_an-object":"eT53"}],"kABk":[function(require,module,exports) {
// all object keys, includes non-enumerable and symbols
var gOPN = require('./_object-gopn');
var gOPS = require('./_object-gops');
var anObject = require('./_an-object');
var Reflect = require('./_global').Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
  var keys = gOPN.f(anObject(it));
  var getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};

},{"./_object-gopn":"Vzm0","./_object-gops":"EWMd","./_an-object":"eT53","./_global":"5qf4"}],"e6SV":[function(require,module,exports) {
// 26.1.11 Reflect.ownKeys(target)
var $export = require('./_export');

$export($export.S, 'Reflect', { ownKeys: require('./_own-keys') });

},{"./_export":"izCb","./_own-keys":"kABk"}],"BmyK":[function(require,module,exports) {
// 26.1.12 Reflect.preventExtensions(target)
var $export = require('./_export');
var anObject = require('./_an-object');
var $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target) {
    anObject(target);
    try {
      if ($preventExtensions) $preventExtensions(target);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_export":"izCb","./_an-object":"eT53"}],"K46i":[function(require,module,exports) {
// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP = require('./_object-dp');
var gOPD = require('./_object-gopd');
var getPrototypeOf = require('./_object-gpo');
var has = require('./_has');
var $export = require('./_export');
var createDesc = require('./_property-desc');
var anObject = require('./_an-object');
var isObject = require('./_is-object');

function set(target, propertyKey, V /* , receiver */) {
  var receiver = arguments.length < 4 ? target : arguments[3];
  var ownDesc = gOPD.f(anObject(target), propertyKey);
  var existingDescriptor, proto;
  if (!ownDesc) {
    if (isObject(proto = getPrototypeOf(target))) {
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if (has(ownDesc, 'value')) {
    if (ownDesc.writable === false || !isObject(receiver)) return false;
    if (existingDescriptor = gOPD.f(receiver, propertyKey)) {
      if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
      existingDescriptor.value = V;
      dP.f(receiver, propertyKey, existingDescriptor);
    } else dP.f(receiver, propertyKey, createDesc(0, V));
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', { set: set });

},{"./_object-dp":"nw8e","./_object-gopd":"uIjZ","./_object-gpo":"8q6y","./_has":"2uHg","./_export":"izCb","./_property-desc":"uJ6d","./_an-object":"eT53","./_is-object":"M7z6"}],"L5z5":[function(require,module,exports) {
// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export = require('./_export');
var setProto = require('./_set-proto');

if (setProto) $export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto) {
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_export":"izCb","./_set-proto":"vn3S"}],"TLss":[function(require,module,exports) {
'use strict';
// https://github.com/tc39/Array.prototype.includes
var $export = require('./_export');
var $includes = require('./_array-includes')(true);

$export($export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

require('./_add-to-unscopables')('includes');

},{"./_export":"izCb","./_array-includes":"4Ca7","./_add-to-unscopables":"Z7e/"}],"emcv":[function(require,module,exports) {
'use strict';
// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
var isArray = require('./_is-array');
var isObject = require('./_is-object');
var toLength = require('./_to-length');
var ctx = require('./_ctx');
var IS_CONCAT_SPREADABLE = require('./_wks')('isConcatSpreadable');

function flattenIntoArray(target, original, source, sourceLen, start, depth, mapper, thisArg) {
  var targetIndex = start;
  var sourceIndex = 0;
  var mapFn = mapper ? ctx(mapper, thisArg, 3) : false;
  var element, spreadable;

  while (sourceIndex < sourceLen) {
    if (sourceIndex in source) {
      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

      spreadable = false;
      if (isObject(element)) {
        spreadable = element[IS_CONCAT_SPREADABLE];
        spreadable = spreadable !== undefined ? !!spreadable : isArray(element);
      }

      if (spreadable && depth > 0) {
        targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
      } else {
        if (targetIndex >= 0x1fffffffffffff) throw TypeError();
        target[targetIndex] = element;
      }

      targetIndex++;
    }
    sourceIndex++;
  }
  return targetIndex;
}

module.exports = flattenIntoArray;

},{"./_is-array":"JTrm","./_is-object":"M7z6","./_to-length":"dJBs","./_ctx":"E3Kh","./_wks":"44AI"}],"I8vV":[function(require,module,exports) {
'use strict';
// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatMap
var $export = require('./_export');
var flattenIntoArray = require('./_flatten-into-array');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var aFunction = require('./_a-function');
var arraySpeciesCreate = require('./_array-species-create');

$export($export.P, 'Array', {
  flatMap: function flatMap(callbackfn /* , thisArg */) {
    var O = toObject(this);
    var sourceLen, A;
    aFunction(callbackfn);
    sourceLen = toLength(O.length);
    A = arraySpeciesCreate(O, 0);
    flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments[1]);
    return A;
  }
});

require('./_add-to-unscopables')('flatMap');

},{"./_export":"izCb","./_flatten-into-array":"emcv","./_to-object":"rfVX","./_to-length":"dJBs","./_a-function":"6kYj","./_array-species-create":"igas","./_add-to-unscopables":"Z7e/"}],"hTXg":[function(require,module,exports) {
'use strict';
// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatten
var $export = require('./_export');
var flattenIntoArray = require('./_flatten-into-array');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var toInteger = require('./_to-integer');
var arraySpeciesCreate = require('./_array-species-create');

$export($export.P, 'Array', {
  flatten: function flatten(/* depthArg = 1 */) {
    var depthArg = arguments[0];
    var O = toObject(this);
    var sourceLen = toLength(O.length);
    var A = arraySpeciesCreate(O, 0);
    flattenIntoArray(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toInteger(depthArg));
    return A;
  }
});

require('./_add-to-unscopables')('flatten');

},{"./_export":"izCb","./_flatten-into-array":"emcv","./_to-object":"rfVX","./_to-length":"dJBs","./_to-integer":"yjVO","./_array-species-create":"igas","./_add-to-unscopables":"Z7e/"}],"+9ht":[function(require,module,exports) {
'use strict';
// https://github.com/mathiasbynens/String.prototype.at
var $export = require('./_export');
var $at = require('./_string-at')(true);

$export($export.P, 'String', {
  at: function at(pos) {
    return $at(this, pos);
  }
});

},{"./_export":"izCb","./_string-at":"x5yM"}],"+lQn":[function(require,module,exports) {
// https://github.com/tc39/proposal-string-pad-start-end
var toLength = require('./_to-length');
var repeat = require('./_string-repeat');
var defined = require('./_defined');

module.exports = function (that, maxLength, fillString, left) {
  var S = String(defined(that));
  var stringLength = S.length;
  var fillStr = fillString === undefined ? ' ' : String(fillString);
  var intMaxLength = toLength(maxLength);
  if (intMaxLength <= stringLength || fillStr == '') return S;
  var fillLen = intMaxLength - stringLength;
  var stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};

},{"./_to-length":"dJBs","./_string-repeat":"UH4U","./_defined":"+Bjj"}],"9SWN":[function(require,module,exports) {
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export');
var $pad = require('./_string-pad');
var userAgent = require('./_user-agent');

// https://github.com/zloirock/core-js/issues/280
$export($export.P + $export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(userAgent), 'String', {
  padStart: function padStart(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});

},{"./_export":"izCb","./_string-pad":"+lQn","./_user-agent":"O5uh"}],"n20m":[function(require,module,exports) {
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export');
var $pad = require('./_string-pad');
var userAgent = require('./_user-agent');

// https://github.com/zloirock/core-js/issues/280
$export($export.P + $export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(userAgent), 'String', {
  padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});

},{"./_export":"izCb","./_string-pad":"+lQn","./_user-agent":"O5uh"}],"ppxd":[function(require,module,exports) {
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./_string-trim')('trimLeft', function ($trim) {
  return function trimLeft() {
    return $trim(this, 1);
  };
}, 'trimStart');

},{"./_string-trim":"y5m2"}],"hxx1":[function(require,module,exports) {
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./_string-trim')('trimRight', function ($trim) {
  return function trimRight() {
    return $trim(this, 2);
  };
}, 'trimEnd');

},{"./_string-trim":"y5m2"}],"nuR4":[function(require,module,exports) {
'use strict';
// https://tc39.github.io/String.prototype.matchAll/
var $export = require('./_export');
var defined = require('./_defined');
var toLength = require('./_to-length');
var isRegExp = require('./_is-regexp');
var getFlags = require('./_flags');
var RegExpProto = RegExp.prototype;

var $RegExpStringIterator = function (regexp, string) {
  this._r = regexp;
  this._s = string;
};

require('./_iter-create')($RegExpStringIterator, 'RegExp String', function next() {
  var match = this._r.exec(this._s);
  return { value: match, done: match === null };
});

$export($export.P, 'String', {
  matchAll: function matchAll(regexp) {
    defined(this);
    if (!isRegExp(regexp)) throw TypeError(regexp + ' is not a regexp!');
    var S = String(this);
    var flags = 'flags' in RegExpProto ? String(regexp.flags) : getFlags.call(regexp);
    var rx = new RegExp(regexp.source, ~flags.indexOf('g') ? flags : 'g' + flags);
    rx.lastIndex = toLength(regexp.lastIndex);
    return new $RegExpStringIterator(rx, S);
  }
});

},{"./_export":"izCb","./_defined":"+Bjj","./_to-length":"dJBs","./_is-regexp":"6WEV","./_flags":"hgks","./_iter-create":"ebgP"}],"DlMC":[function(require,module,exports) {
require('./_wks-define')('asyncIterator');

},{"./_wks-define":"r4vV"}],"m9Sq":[function(require,module,exports) {
require('./_wks-define')('observable');

},{"./_wks-define":"r4vV"}],"BQD8":[function(require,module,exports) {
// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export = require('./_export');
var ownKeys = require('./_own-keys');
var toIObject = require('./_to-iobject');
var gOPD = require('./_object-gopd');
var createProperty = require('./_create-property');

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIObject(object);
    var getDesc = gOPD.f;
    var keys = ownKeys(O);
    var result = {};
    var i = 0;
    var key, desc;
    while (keys.length > i) {
      desc = getDesc(O, key = keys[i++]);
      if (desc !== undefined) createProperty(result, key, desc);
    }
    return result;
  }
});

},{"./_export":"izCb","./_own-keys":"kABk","./_to-iobject":"g6sb","./_object-gopd":"uIjZ","./_create-property":"JCwR"}],"ljQU":[function(require,module,exports) {
var getKeys = require('./_object-keys');
var toIObject = require('./_to-iobject');
var isEnum = require('./_object-pie').f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it);
    var keys = getKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) if (isEnum.call(O, key = keys[i++])) {
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};

},{"./_object-keys":"U9a7","./_to-iobject":"g6sb","./_object-pie":"vjRp"}],"Ltmz":[function(require,module,exports) {
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export');
var $values = require('./_object-to-array')(false);

$export($export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});

},{"./_export":"izCb","./_object-to-array":"ljQU"}],"gxEP":[function(require,module,exports) {
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export');
var $entries = require('./_object-to-array')(true);

$export($export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});

},{"./_export":"izCb","./_object-to-array":"ljQU"}],"mhol":[function(require,module,exports) {
'use strict';
// Forced replacement prototype accessors methods
module.exports = require('./_library') || !require('./_fails')(function () {
  var K = Math.random();
  // In FF throws only define methods
  // eslint-disable-next-line no-undef, no-useless-call
  __defineSetter__.call(null, K, function () { /* empty */ });
  delete require('./_global')[K];
});

},{"./_library":"H21C","./_fails":"5BXi","./_global":"5qf4"}],"guoQ":[function(require,module,exports) {
'use strict';
var $export = require('./_export');
var toObject = require('./_to-object');
var aFunction = require('./_a-function');
var $defineProperty = require('./_object-dp');

// B.2.2.2 Object.prototype.__defineGetter__(P, getter)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __defineGetter__: function __defineGetter__(P, getter) {
    $defineProperty.f(toObject(this), P, { get: aFunction(getter), enumerable: true, configurable: true });
  }
});

},{"./_export":"izCb","./_to-object":"rfVX","./_a-function":"6kYj","./_object-dp":"nw8e","./_descriptors":"P9Ib","./_object-forced-pam":"mhol"}],"HMp9":[function(require,module,exports) {
'use strict';
var $export = require('./_export');
var toObject = require('./_to-object');
var aFunction = require('./_a-function');
var $defineProperty = require('./_object-dp');

// B.2.2.3 Object.prototype.__defineSetter__(P, setter)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __defineSetter__: function __defineSetter__(P, setter) {
    $defineProperty.f(toObject(this), P, { set: aFunction(setter), enumerable: true, configurable: true });
  }
});

},{"./_export":"izCb","./_to-object":"rfVX","./_a-function":"6kYj","./_object-dp":"nw8e","./_descriptors":"P9Ib","./_object-forced-pam":"mhol"}],"HB2g":[function(require,module,exports) {
'use strict';
var $export = require('./_export');
var toObject = require('./_to-object');
var toPrimitive = require('./_to-primitive');
var getPrototypeOf = require('./_object-gpo');
var getOwnPropertyDescriptor = require('./_object-gopd').f;

// B.2.2.4 Object.prototype.__lookupGetter__(P)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __lookupGetter__: function __lookupGetter__(P) {
    var O = toObject(this);
    var K = toPrimitive(P, true);
    var D;
    do {
      if (D = getOwnPropertyDescriptor(O, K)) return D.get;
    } while (O = getPrototypeOf(O));
  }
});

},{"./_export":"izCb","./_to-object":"rfVX","./_to-primitive":"9y37","./_object-gpo":"8q6y","./_object-gopd":"uIjZ","./_descriptors":"P9Ib","./_object-forced-pam":"mhol"}],"QF5J":[function(require,module,exports) {
'use strict';
var $export = require('./_export');
var toObject = require('./_to-object');
var toPrimitive = require('./_to-primitive');
var getPrototypeOf = require('./_object-gpo');
var getOwnPropertyDescriptor = require('./_object-gopd').f;

// B.2.2.5 Object.prototype.__lookupSetter__(P)
require('./_descriptors') && $export($export.P + require('./_object-forced-pam'), 'Object', {
  __lookupSetter__: function __lookupSetter__(P) {
    var O = toObject(this);
    var K = toPrimitive(P, true);
    var D;
    do {
      if (D = getOwnPropertyDescriptor(O, K)) return D.set;
    } while (O = getPrototypeOf(O));
  }
});

},{"./_export":"izCb","./_to-object":"rfVX","./_to-primitive":"9y37","./_object-gpo":"8q6y","./_object-gopd":"uIjZ","./_descriptors":"P9Ib","./_object-forced-pam":"mhol"}],"Ft+N":[function(require,module,exports) {
var forOf = require('./_for-of');

module.exports = function (iter, ITERATOR) {
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

},{"./_for-of":"Abke"}],"W884":[function(require,module,exports) {
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = require('./_classof');
var from = require('./_array-from-iterable');
module.exports = function (NAME) {
  return function toJSON() {
    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};

},{"./_classof":"GM7B","./_array-from-iterable":"Ft+N"}],"JwqU":[function(require,module,exports) {
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = require('./_export');

$export($export.P + $export.R, 'Map', { toJSON: require('./_collection-to-json')('Map') });

},{"./_export":"izCb","./_collection-to-json":"W884"}],"s0lJ":[function(require,module,exports) {
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = require('./_export');

$export($export.P + $export.R, 'Set', { toJSON: require('./_collection-to-json')('Set') });

},{"./_export":"izCb","./_collection-to-json":"W884"}],"0376":[function(require,module,exports) {
'use strict';
// https://tc39.github.io/proposal-setmap-offrom/
var $export = require('./_export');

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { of: function of() {
    var length = arguments.length;
    var A = new Array(length);
    while (length--) A[length] = arguments[length];
    return new this(A);
  } });
};

},{"./_export":"izCb"}],"FGzV":[function(require,module,exports) {
// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
require('./_set-collection-of')('Map');

},{"./_set-collection-of":"0376"}],"q4rf":[function(require,module,exports) {
// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
require('./_set-collection-of')('Set');

},{"./_set-collection-of":"0376"}],"q85i":[function(require,module,exports) {
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.of
require('./_set-collection-of')('WeakMap');

},{"./_set-collection-of":"0376"}],"dmfy":[function(require,module,exports) {
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.of
require('./_set-collection-of')('WeakSet');

},{"./_set-collection-of":"0376"}],"TwNt":[function(require,module,exports) {
'use strict';
// https://tc39.github.io/proposal-setmap-offrom/
var $export = require('./_export');
var aFunction = require('./_a-function');
var ctx = require('./_ctx');
var forOf = require('./_for-of');

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
    var mapFn = arguments[1];
    var mapping, A, n, cb;
    aFunction(this);
    mapping = mapFn !== undefined;
    if (mapping) aFunction(mapFn);
    if (source == undefined) return new this();
    A = [];
    if (mapping) {
      n = 0;
      cb = ctx(mapFn, arguments[2], 2);
      forOf(source, false, function (nextItem) {
        A.push(cb(nextItem, n++));
      });
    } else {
      forOf(source, false, A.push, A);
    }
    return new this(A);
  } });
};

},{"./_export":"izCb","./_a-function":"6kYj","./_ctx":"E3Kh","./_for-of":"Abke"}],"JQCn":[function(require,module,exports) {
// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
require('./_set-collection-from')('Map');

},{"./_set-collection-from":"TwNt"}],"rl69":[function(require,module,exports) {
// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
require('./_set-collection-from')('Set');

},{"./_set-collection-from":"TwNt"}],"mEhd":[function(require,module,exports) {
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.from
require('./_set-collection-from')('WeakMap');

},{"./_set-collection-from":"TwNt"}],"SgWE":[function(require,module,exports) {
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.from
require('./_set-collection-from')('WeakSet');

},{"./_set-collection-from":"TwNt"}],"zzQm":[function(require,module,exports) {
// https://github.com/tc39/proposal-global
var $export = require('./_export');

$export($export.G, { global: require('./_global') });

},{"./_export":"izCb","./_global":"5qf4"}],"4rsr":[function(require,module,exports) {
// https://github.com/tc39/proposal-global
var $export = require('./_export');

$export($export.S, 'System', { global: require('./_global') });

},{"./_export":"izCb","./_global":"5qf4"}],"c5Yp":[function(require,module,exports) {
// https://github.com/ljharb/proposal-is-error
var $export = require('./_export');
var cof = require('./_cof');

$export($export.S, 'Error', {
  isError: function isError(it) {
    return cof(it) === 'Error';
  }
});

},{"./_export":"izCb","./_cof":"Z5df"}],"88f2":[function(require,module,exports) {
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');

$export($export.S, 'Math', {
  clamp: function clamp(x, lower, upper) {
    return Math.min(upper, Math.max(lower, x));
  }
});

},{"./_export":"izCb"}],"M/9c":[function(require,module,exports) {
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');

$export($export.S, 'Math', { DEG_PER_RAD: Math.PI / 180 });

},{"./_export":"izCb"}],"7+zj":[function(require,module,exports) {
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');
var RAD_PER_DEG = 180 / Math.PI;

$export($export.S, 'Math', {
  degrees: function degrees(radians) {
    return radians * RAD_PER_DEG;
  }
});

},{"./_export":"izCb"}],"6fVz":[function(require,module,exports) {
// https://rwaldron.github.io/proposal-math-extensions/
module.exports = Math.scale || function scale(x, inLow, inHigh, outLow, outHigh) {
  if (
    arguments.length === 0
      // eslint-disable-next-line no-self-compare
      || x != x
      // eslint-disable-next-line no-self-compare
      || inLow != inLow
      // eslint-disable-next-line no-self-compare
      || inHigh != inHigh
      // eslint-disable-next-line no-self-compare
      || outLow != outLow
      // eslint-disable-next-line no-self-compare
      || outHigh != outHigh
  ) return NaN;
  if (x === Infinity || x === -Infinity) return x;
  return (x - inLow) * (outHigh - outLow) / (inHigh - inLow) + outLow;
};

},{}],"IeZ8":[function(require,module,exports) {
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');
var scale = require('./_math-scale');
var fround = require('./_math-fround');

$export($export.S, 'Math', {
  fscale: function fscale(x, inLow, inHigh, outLow, outHigh) {
    return fround(scale(x, inLow, inHigh, outLow, outHigh));
  }
});

},{"./_export":"izCb","./_math-scale":"6fVz","./_math-fround":"z6h7"}],"GM4x":[function(require,module,exports) {
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  iaddh: function iaddh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0;
    var $x1 = x1 >>> 0;
    var $y0 = y0 >>> 0;
    return $x1 + (y1 >>> 0) + (($x0 & $y0 | ($x0 | $y0) & ~($x0 + $y0 >>> 0)) >>> 31) | 0;
  }
});

},{"./_export":"izCb"}],"Y1L+":[function(require,module,exports) {
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  isubh: function isubh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0;
    var $x1 = x1 >>> 0;
    var $y0 = y0 >>> 0;
    return $x1 - (y1 >>> 0) - ((~$x0 & $y0 | ~($x0 ^ $y0) & $x0 - $y0 >>> 0) >>> 31) | 0;
  }
});

},{"./_export":"izCb"}],"cCkt":[function(require,module,exports) {
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  imulh: function imulh(u, v) {
    var UINT16 = 0xffff;
    var $u = +u;
    var $v = +v;
    var u0 = $u & UINT16;
    var v0 = $v & UINT16;
    var u1 = $u >> 16;
    var v1 = $v >> 16;
    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >> 16);
  }
});

},{"./_export":"izCb"}],"fCGe":[function(require,module,exports) {
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');

$export($export.S, 'Math', { RAD_PER_DEG: 180 / Math.PI });

},{"./_export":"izCb"}],"FX6J":[function(require,module,exports) {
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');
var DEG_PER_RAD = Math.PI / 180;

$export($export.S, 'Math', {
  radians: function radians(degrees) {
    return degrees * DEG_PER_RAD;
  }
});

},{"./_export":"izCb"}],"31zE":[function(require,module,exports) {
// https://rwaldron.github.io/proposal-math-extensions/
var $export = require('./_export');

$export($export.S, 'Math', { scale: require('./_math-scale') });

},{"./_export":"izCb","./_math-scale":"6fVz"}],"0zKy":[function(require,module,exports) {
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = require('./_export');

$export($export.S, 'Math', {
  umulh: function umulh(u, v) {
    var UINT16 = 0xffff;
    var $u = +u;
    var $v = +v;
    var u0 = $u & UINT16;
    var v0 = $v & UINT16;
    var u1 = $u >>> 16;
    var v1 = $v >>> 16;
    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >>> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >>> 16);
  }
});

},{"./_export":"izCb"}],"FD1C":[function(require,module,exports) {
// http://jfbastien.github.io/papers/Math.signbit.html
var $export = require('./_export');

$export($export.S, 'Math', { signbit: function signbit(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) != x ? x : x == 0 ? 1 / x == Infinity : x > 0;
} });

},{"./_export":"izCb"}],"l1j0":[function(require,module,exports) {

// https://github.com/tc39/proposal-promise-finally
'use strict';
var $export = require('./_export');
var core = require('./_core');
var global = require('./_global');
var speciesConstructor = require('./_species-constructor');
var promiseResolve = require('./_promise-resolve');

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });

},{"./_export":"izCb","./_core":"ss9A","./_global":"5qf4","./_species-constructor":"Ex+G","./_promise-resolve":"cNG8"}],"Worb":[function(require,module,exports) {
'use strict';
// https://github.com/tc39/proposal-promise-try
var $export = require('./_export');
var newPromiseCapability = require('./_new-promise-capability');
var perform = require('./_perform');

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });

},{"./_export":"izCb","./_new-promise-capability":"L7XN","./_perform":"tyG8"}],"Vya4":[function(require,module,exports) {
var Map = require('./es6.map');
var $export = require('./_export');
var shared = require('./_shared')('metadata');
var store = shared.store || (shared.store = new (require('./es6.weak-map'))());

var getOrCreateMetadataMap = function (target, targetKey, create) {
  var targetMetadata = store.get(target);
  if (!targetMetadata) {
    if (!create) return undefined;
    store.set(target, targetMetadata = new Map());
  }
  var keyMetadata = targetMetadata.get(targetKey);
  if (!keyMetadata) {
    if (!create) return undefined;
    targetMetadata.set(targetKey, keyMetadata = new Map());
  } return keyMetadata;
};
var ordinaryHasOwnMetadata = function (MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? false : metadataMap.has(MetadataKey);
};
var ordinaryGetOwnMetadata = function (MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? undefined : metadataMap.get(MetadataKey);
};
var ordinaryDefineOwnMetadata = function (MetadataKey, MetadataValue, O, P) {
  getOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
};
var ordinaryOwnMetadataKeys = function (target, targetKey) {
  var metadataMap = getOrCreateMetadataMap(target, targetKey, false);
  var keys = [];
  if (metadataMap) metadataMap.forEach(function (_, key) { keys.push(key); });
  return keys;
};
var toMetaKey = function (it) {
  return it === undefined || typeof it == 'symbol' ? it : String(it);
};
var exp = function (O) {
  $export($export.S, 'Reflect', O);
};

module.exports = {
  store: store,
  map: getOrCreateMetadataMap,
  has: ordinaryHasOwnMetadata,
  get: ordinaryGetOwnMetadata,
  set: ordinaryDefineOwnMetadata,
  keys: ordinaryOwnMetadataKeys,
  key: toMetaKey,
  exp: exp
};

},{"./es6.map":"ioKM","./_export":"izCb","./_shared":"6zGc","./es6.weak-map":"D6DP"}],"HqdS":[function(require,module,exports) {
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var toMetaKey = metadata.key;
var ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({ defineMetadata: function defineMetadata(metadataKey, metadataValue, target, targetKey) {
  ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), toMetaKey(targetKey));
} });

},{"./_metadata":"Vya4","./_an-object":"eT53"}],"Okij":[function(require,module,exports) {
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var toMetaKey = metadata.key;
var getOrCreateMetadataMap = metadata.map;
var store = metadata.store;

metadata.exp({ deleteMetadata: function deleteMetadata(metadataKey, target /* , targetKey */) {
  var targetKey = arguments.length < 3 ? undefined : toMetaKey(arguments[2]);
  var metadataMap = getOrCreateMetadataMap(anObject(target), targetKey, false);
  if (metadataMap === undefined || !metadataMap['delete'](metadataKey)) return false;
  if (metadataMap.size) return true;
  var targetMetadata = store.get(target);
  targetMetadata['delete'](targetKey);
  return !!targetMetadata.size || store['delete'](target);
} });

},{"./_metadata":"Vya4","./_an-object":"eT53"}],"S3NM":[function(require,module,exports) {
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var getPrototypeOf = require('./_object-gpo');
var ordinaryHasOwnMetadata = metadata.has;
var ordinaryGetOwnMetadata = metadata.get;
var toMetaKey = metadata.key;

var ordinaryGetMetadata = function (MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if (hasOwn) return ordinaryGetOwnMetadata(MetadataKey, O, P);
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryGetMetadata(MetadataKey, parent, P) : undefined;
};

metadata.exp({ getMetadata: function getMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryGetMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });

},{"./_metadata":"Vya4","./_an-object":"eT53","./_object-gpo":"8q6y"}],"LScP":[function(require,module,exports) {
var Set = require('./es6.set');
var from = require('./_array-from-iterable');
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var getPrototypeOf = require('./_object-gpo');
var ordinaryOwnMetadataKeys = metadata.keys;
var toMetaKey = metadata.key;

var ordinaryMetadataKeys = function (O, P) {
  var oKeys = ordinaryOwnMetadataKeys(O, P);
  var parent = getPrototypeOf(O);
  if (parent === null) return oKeys;
  var pKeys = ordinaryMetadataKeys(parent, P);
  return pKeys.length ? oKeys.length ? from(new Set(oKeys.concat(pKeys))) : pKeys : oKeys;
};

metadata.exp({ getMetadataKeys: function getMetadataKeys(target /* , targetKey */) {
  return ordinaryMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
} });

},{"./es6.set":"coyu","./_array-from-iterable":"Ft+N","./_metadata":"Vya4","./_an-object":"eT53","./_object-gpo":"8q6y"}],"sqj0":[function(require,module,exports) {
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var ordinaryGetOwnMetadata = metadata.get;
var toMetaKey = metadata.key;

metadata.exp({ getOwnMetadata: function getOwnMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryGetOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });

},{"./_metadata":"Vya4","./_an-object":"eT53"}],"tL+x":[function(require,module,exports) {
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var ordinaryOwnMetadataKeys = metadata.keys;
var toMetaKey = metadata.key;

metadata.exp({ getOwnMetadataKeys: function getOwnMetadataKeys(target /* , targetKey */) {
  return ordinaryOwnMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
} });

},{"./_metadata":"Vya4","./_an-object":"eT53"}],"6zEH":[function(require,module,exports) {
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var getPrototypeOf = require('./_object-gpo');
var ordinaryHasOwnMetadata = metadata.has;
var toMetaKey = metadata.key;

var ordinaryHasMetadata = function (MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if (hasOwn) return true;
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryHasMetadata(MetadataKey, parent, P) : false;
};

metadata.exp({ hasMetadata: function hasMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryHasMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });

},{"./_metadata":"Vya4","./_an-object":"eT53","./_object-gpo":"8q6y"}],"4d1Y":[function(require,module,exports) {
var metadata = require('./_metadata');
var anObject = require('./_an-object');
var ordinaryHasOwnMetadata = metadata.has;
var toMetaKey = metadata.key;

metadata.exp({ hasOwnMetadata: function hasOwnMetadata(metadataKey, target /* , targetKey */) {
  return ordinaryHasOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
} });

},{"./_metadata":"Vya4","./_an-object":"eT53"}],"AN3+":[function(require,module,exports) {
var $metadata = require('./_metadata');
var anObject = require('./_an-object');
var aFunction = require('./_a-function');
var toMetaKey = $metadata.key;
var ordinaryDefineOwnMetadata = $metadata.set;

$metadata.exp({ metadata: function metadata(metadataKey, metadataValue) {
  return function decorator(target, targetKey) {
    ordinaryDefineOwnMetadata(
      metadataKey, metadataValue,
      (targetKey !== undefined ? anObject : aFunction)(target),
      toMetaKey(targetKey)
    );
  };
} });

},{"./_metadata":"Vya4","./_an-object":"eT53","./_a-function":"6kYj"}],"A0aM":[function(require,module,exports) {

// https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-09/sept-25.md#510-globalasap-for-enqueuing-a-microtask
var $export = require('./_export');
var microtask = require('./_microtask')();
var process = require('./_global').process;
var isNode = require('./_cof')(process) == 'process';

$export($export.G, {
  asap: function asap(fn) {
    var domain = isNode && process.domain;
    microtask(domain ? domain.bind(fn) : fn);
  }
});

},{"./_export":"izCb","./_microtask":"sFAp","./_global":"5qf4","./_cof":"Z5df"}],"jFPl":[function(require,module,exports) {

'use strict';
// https://github.com/zenparsing/es-observable
var $export = require('./_export');
var global = require('./_global');
var core = require('./_core');
var microtask = require('./_microtask')();
var OBSERVABLE = require('./_wks')('observable');
var aFunction = require('./_a-function');
var anObject = require('./_an-object');
var anInstance = require('./_an-instance');
var redefineAll = require('./_redefine-all');
var hide = require('./_hide');
var forOf = require('./_for-of');
var RETURN = forOf.RETURN;

var getMethod = function (fn) {
  return fn == null ? undefined : aFunction(fn);
};

var cleanupSubscription = function (subscription) {
  var cleanup = subscription._c;
  if (cleanup) {
    subscription._c = undefined;
    cleanup();
  }
};

var subscriptionClosed = function (subscription) {
  return subscription._o === undefined;
};

var closeSubscription = function (subscription) {
  if (!subscriptionClosed(subscription)) {
    subscription._o = undefined;
    cleanupSubscription(subscription);
  }
};

var Subscription = function (observer, subscriber) {
  anObject(observer);
  this._c = undefined;
  this._o = observer;
  observer = new SubscriptionObserver(this);
  try {
    var cleanup = subscriber(observer);
    var subscription = cleanup;
    if (cleanup != null) {
      if (typeof cleanup.unsubscribe === 'function') cleanup = function () { subscription.unsubscribe(); };
      else aFunction(cleanup);
      this._c = cleanup;
    }
  } catch (e) {
    observer.error(e);
    return;
  } if (subscriptionClosed(this)) cleanupSubscription(this);
};

Subscription.prototype = redefineAll({}, {
  unsubscribe: function unsubscribe() { closeSubscription(this); }
});

var SubscriptionObserver = function (subscription) {
  this._s = subscription;
};

SubscriptionObserver.prototype = redefineAll({}, {
  next: function next(value) {
    var subscription = this._s;
    if (!subscriptionClosed(subscription)) {
      var observer = subscription._o;
      try {
        var m = getMethod(observer.next);
        if (m) return m.call(observer, value);
      } catch (e) {
        try {
          closeSubscription(subscription);
        } finally {
          throw e;
        }
      }
    }
  },
  error: function error(value) {
    var subscription = this._s;
    if (subscriptionClosed(subscription)) throw value;
    var observer = subscription._o;
    subscription._o = undefined;
    try {
      var m = getMethod(observer.error);
      if (!m) throw value;
      value = m.call(observer, value);
    } catch (e) {
      try {
        cleanupSubscription(subscription);
      } finally {
        throw e;
      }
    } cleanupSubscription(subscription);
    return value;
  },
  complete: function complete(value) {
    var subscription = this._s;
    if (!subscriptionClosed(subscription)) {
      var observer = subscription._o;
      subscription._o = undefined;
      try {
        var m = getMethod(observer.complete);
        value = m ? m.call(observer, value) : undefined;
      } catch (e) {
        try {
          cleanupSubscription(subscription);
        } finally {
          throw e;
        }
      } cleanupSubscription(subscription);
      return value;
    }
  }
});

var $Observable = function Observable(subscriber) {
  anInstance(this, $Observable, 'Observable', '_f')._f = aFunction(subscriber);
};

redefineAll($Observable.prototype, {
  subscribe: function subscribe(observer) {
    return new Subscription(observer, this._f);
  },
  forEach: function forEach(fn) {
    var that = this;
    return new (core.Promise || global.Promise)(function (resolve, reject) {
      aFunction(fn);
      var subscription = that.subscribe({
        next: function (value) {
          try {
            return fn(value);
          } catch (e) {
            reject(e);
            subscription.unsubscribe();
          }
        },
        error: reject,
        complete: resolve
      });
    });
  }
});

redefineAll($Observable, {
  from: function from(x) {
    var C = typeof this === 'function' ? this : $Observable;
    var method = getMethod(anObject(x)[OBSERVABLE]);
    if (method) {
      var observable = anObject(method.call(x));
      return observable.constructor === C ? observable : new C(function (observer) {
        return observable.subscribe(observer);
      });
    }
    return new C(function (observer) {
      var done = false;
      microtask(function () {
        if (!done) {
          try {
            if (forOf(x, false, function (it) {
              observer.next(it);
              if (done) return RETURN;
            }) === RETURN) return;
          } catch (e) {
            if (done) throw e;
            observer.error(e);
            return;
          } observer.complete();
        }
      });
      return function () { done = true; };
    });
  },
  of: function of() {
    for (var i = 0, l = arguments.length, items = new Array(l); i < l;) items[i] = arguments[i++];
    return new (typeof this === 'function' ? this : $Observable)(function (observer) {
      var done = false;
      microtask(function () {
        if (!done) {
          for (var j = 0; j < items.length; ++j) {
            observer.next(items[j]);
            if (done) return;
          } observer.complete();
        }
      });
      return function () { done = true; };
    });
  }
});

hide($Observable.prototype, OBSERVABLE, function () { return this; });

$export($export.G, { Observable: $Observable });

require('./_set-species')('Observable');

},{"./_export":"izCb","./_global":"5qf4","./_core":"ss9A","./_microtask":"sFAp","./_wks":"44AI","./_a-function":"6kYj","./_an-object":"eT53","./_an-instance":"yJTF","./_redefine-all":"J0Tl","./_hide":"0NXb","./_for-of":"Abke","./_set-species":"5h4d"}],"OTsy":[function(require,module,exports) {

// ie9- setTimeout & setInterval additional parameters fix
var global = require('./_global');
var $export = require('./_export');
var userAgent = require('./_user-agent');
var slice = [].slice;
var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check
var wrap = function (set) {
  return function (fn, time /* , ...args */) {
    var boundArgs = arguments.length > 2;
    var args = boundArgs ? slice.call(arguments, 2) : false;
    return set(boundArgs ? function () {
      // eslint-disable-next-line no-new-func
      (typeof fn == 'function' ? fn : Function(fn)).apply(this, args);
    } : fn, time);
  };
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout: wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});

},{"./_global":"5qf4","./_export":"izCb","./_user-agent":"O5uh"}],"5hZL":[function(require,module,exports) {
var $export = require('./_export');
var $task = require('./_task');
$export($export.G + $export.B, {
  setImmediate: $task.set,
  clearImmediate: $task.clear
});

},{"./_export":"izCb","./_task":"KY9y"}],"v6Aj":[function(require,module,exports) {

var $iterators = require('./es6.array.iterator');
var getKeys = require('./_object-keys');
var redefine = require('./_redefine');
var global = require('./_global');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var wks = require('./_wks');
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}

},{"./es6.array.iterator":"6w+v","./_object-keys":"U9a7","./_redefine":"PHot","./_global":"5qf4","./_hide":"0NXb","./_iterators":"JO4d","./_wks":"44AI"}],"8w2b":[function(require,module,exports) {
require('./modules/es6.symbol');
require('./modules/es6.object.create');
require('./modules/es6.object.define-property');
require('./modules/es6.object.define-properties');
require('./modules/es6.object.get-own-property-descriptor');
require('./modules/es6.object.get-prototype-of');
require('./modules/es6.object.keys');
require('./modules/es6.object.get-own-property-names');
require('./modules/es6.object.freeze');
require('./modules/es6.object.seal');
require('./modules/es6.object.prevent-extensions');
require('./modules/es6.object.is-frozen');
require('./modules/es6.object.is-sealed');
require('./modules/es6.object.is-extensible');
require('./modules/es6.object.assign');
require('./modules/es6.object.is');
require('./modules/es6.object.set-prototype-of');
require('./modules/es6.object.to-string');
require('./modules/es6.function.bind');
require('./modules/es6.function.name');
require('./modules/es6.function.has-instance');
require('./modules/es6.parse-int');
require('./modules/es6.parse-float');
require('./modules/es6.number.constructor');
require('./modules/es6.number.to-fixed');
require('./modules/es6.number.to-precision');
require('./modules/es6.number.epsilon');
require('./modules/es6.number.is-finite');
require('./modules/es6.number.is-integer');
require('./modules/es6.number.is-nan');
require('./modules/es6.number.is-safe-integer');
require('./modules/es6.number.max-safe-integer');
require('./modules/es6.number.min-safe-integer');
require('./modules/es6.number.parse-float');
require('./modules/es6.number.parse-int');
require('./modules/es6.math.acosh');
require('./modules/es6.math.asinh');
require('./modules/es6.math.atanh');
require('./modules/es6.math.cbrt');
require('./modules/es6.math.clz32');
require('./modules/es6.math.cosh');
require('./modules/es6.math.expm1');
require('./modules/es6.math.fround');
require('./modules/es6.math.hypot');
require('./modules/es6.math.imul');
require('./modules/es6.math.log10');
require('./modules/es6.math.log1p');
require('./modules/es6.math.log2');
require('./modules/es6.math.sign');
require('./modules/es6.math.sinh');
require('./modules/es6.math.tanh');
require('./modules/es6.math.trunc');
require('./modules/es6.string.from-code-point');
require('./modules/es6.string.raw');
require('./modules/es6.string.trim');
require('./modules/es6.string.iterator');
require('./modules/es6.string.code-point-at');
require('./modules/es6.string.ends-with');
require('./modules/es6.string.includes');
require('./modules/es6.string.repeat');
require('./modules/es6.string.starts-with');
require('./modules/es6.string.anchor');
require('./modules/es6.string.big');
require('./modules/es6.string.blink');
require('./modules/es6.string.bold');
require('./modules/es6.string.fixed');
require('./modules/es6.string.fontcolor');
require('./modules/es6.string.fontsize');
require('./modules/es6.string.italics');
require('./modules/es6.string.link');
require('./modules/es6.string.small');
require('./modules/es6.string.strike');
require('./modules/es6.string.sub');
require('./modules/es6.string.sup');
require('./modules/es6.date.now');
require('./modules/es6.date.to-json');
require('./modules/es6.date.to-iso-string');
require('./modules/es6.date.to-string');
require('./modules/es6.date.to-primitive');
require('./modules/es6.array.is-array');
require('./modules/es6.array.from');
require('./modules/es6.array.of');
require('./modules/es6.array.join');
require('./modules/es6.array.slice');
require('./modules/es6.array.sort');
require('./modules/es6.array.for-each');
require('./modules/es6.array.map');
require('./modules/es6.array.filter');
require('./modules/es6.array.some');
require('./modules/es6.array.every');
require('./modules/es6.array.reduce');
require('./modules/es6.array.reduce-right');
require('./modules/es6.array.index-of');
require('./modules/es6.array.last-index-of');
require('./modules/es6.array.copy-within');
require('./modules/es6.array.fill');
require('./modules/es6.array.find');
require('./modules/es6.array.find-index');
require('./modules/es6.array.species');
require('./modules/es6.array.iterator');
require('./modules/es6.regexp.constructor');
require('./modules/es6.regexp.exec');
require('./modules/es6.regexp.to-string');
require('./modules/es6.regexp.flags');
require('./modules/es6.regexp.match');
require('./modules/es6.regexp.replace');
require('./modules/es6.regexp.search');
require('./modules/es6.regexp.split');
require('./modules/es6.promise');
require('./modules/es6.map');
require('./modules/es6.set');
require('./modules/es6.weak-map');
require('./modules/es6.weak-set');
require('./modules/es6.typed.array-buffer');
require('./modules/es6.typed.data-view');
require('./modules/es6.typed.int8-array');
require('./modules/es6.typed.uint8-array');
require('./modules/es6.typed.uint8-clamped-array');
require('./modules/es6.typed.int16-array');
require('./modules/es6.typed.uint16-array');
require('./modules/es6.typed.int32-array');
require('./modules/es6.typed.uint32-array');
require('./modules/es6.typed.float32-array');
require('./modules/es6.typed.float64-array');
require('./modules/es6.reflect.apply');
require('./modules/es6.reflect.construct');
require('./modules/es6.reflect.define-property');
require('./modules/es6.reflect.delete-property');
require('./modules/es6.reflect.enumerate');
require('./modules/es6.reflect.get');
require('./modules/es6.reflect.get-own-property-descriptor');
require('./modules/es6.reflect.get-prototype-of');
require('./modules/es6.reflect.has');
require('./modules/es6.reflect.is-extensible');
require('./modules/es6.reflect.own-keys');
require('./modules/es6.reflect.prevent-extensions');
require('./modules/es6.reflect.set');
require('./modules/es6.reflect.set-prototype-of');
require('./modules/es7.array.includes');
require('./modules/es7.array.flat-map');
require('./modules/es7.array.flatten');
require('./modules/es7.string.at');
require('./modules/es7.string.pad-start');
require('./modules/es7.string.pad-end');
require('./modules/es7.string.trim-left');
require('./modules/es7.string.trim-right');
require('./modules/es7.string.match-all');
require('./modules/es7.symbol.async-iterator');
require('./modules/es7.symbol.observable');
require('./modules/es7.object.get-own-property-descriptors');
require('./modules/es7.object.values');
require('./modules/es7.object.entries');
require('./modules/es7.object.define-getter');
require('./modules/es7.object.define-setter');
require('./modules/es7.object.lookup-getter');
require('./modules/es7.object.lookup-setter');
require('./modules/es7.map.to-json');
require('./modules/es7.set.to-json');
require('./modules/es7.map.of');
require('./modules/es7.set.of');
require('./modules/es7.weak-map.of');
require('./modules/es7.weak-set.of');
require('./modules/es7.map.from');
require('./modules/es7.set.from');
require('./modules/es7.weak-map.from');
require('./modules/es7.weak-set.from');
require('./modules/es7.global');
require('./modules/es7.system.global');
require('./modules/es7.error.is-error');
require('./modules/es7.math.clamp');
require('./modules/es7.math.deg-per-rad');
require('./modules/es7.math.degrees');
require('./modules/es7.math.fscale');
require('./modules/es7.math.iaddh');
require('./modules/es7.math.isubh');
require('./modules/es7.math.imulh');
require('./modules/es7.math.rad-per-deg');
require('./modules/es7.math.radians');
require('./modules/es7.math.scale');
require('./modules/es7.math.umulh');
require('./modules/es7.math.signbit');
require('./modules/es7.promise.finally');
require('./modules/es7.promise.try');
require('./modules/es7.reflect.define-metadata');
require('./modules/es7.reflect.delete-metadata');
require('./modules/es7.reflect.get-metadata');
require('./modules/es7.reflect.get-metadata-keys');
require('./modules/es7.reflect.get-own-metadata');
require('./modules/es7.reflect.get-own-metadata-keys');
require('./modules/es7.reflect.has-metadata');
require('./modules/es7.reflect.has-own-metadata');
require('./modules/es7.reflect.metadata');
require('./modules/es7.asap');
require('./modules/es7.observable');
require('./modules/web.timers');
require('./modules/web.immediate');
require('./modules/web.dom.iterable');
module.exports = require('./modules/_core');

},{"./modules/es6.symbol":"uVn9","./modules/es6.object.create":"D4xP","./modules/es6.object.define-property":"TSUD","./modules/es6.object.define-properties":"AwOq","./modules/es6.object.get-own-property-descriptor":"nIty","./modules/es6.object.get-prototype-of":"ud3u","./modules/es6.object.keys":"m9aB","./modules/es6.object.get-own-property-names":"i23/","./modules/es6.object.freeze":"EO7q","./modules/es6.object.seal":"+4GY","./modules/es6.object.prevent-extensions":"3llM","./modules/es6.object.is-frozen":"Z1rp","./modules/es6.object.is-sealed":"Fckj","./modules/es6.object.is-extensible":"1EYb","./modules/es6.object.assign":"K3/J","./modules/es6.object.is":"MlqR","./modules/es6.object.set-prototype-of":"0JGj","./modules/es6.object.to-string":"4zTK","./modules/es6.function.bind":"WIhg","./modules/es6.function.name":"N3yi","./modules/es6.function.has-instance":"a7bX","./modules/es6.parse-int":"0C15","./modules/es6.parse-float":"Q4DA","./modules/es6.number.constructor":"kRGG","./modules/es6.number.to-fixed":"vva0","./modules/es6.number.to-precision":"Y4ol","./modules/es6.number.epsilon":"DzYy","./modules/es6.number.is-finite":"FuY7","./modules/es6.number.is-integer":"pwRL","./modules/es6.number.is-nan":"SsgJ","./modules/es6.number.is-safe-integer":"5qVI","./modules/es6.number.max-safe-integer":"4shx","./modules/es6.number.min-safe-integer":"+ifB","./modules/es6.number.parse-float":"yjyf","./modules/es6.number.parse-int":"Guno","./modules/es6.math.acosh":"py3/","./modules/es6.math.asinh":"ob11","./modules/es6.math.atanh":"iUik","./modules/es6.math.cbrt":"YRuK","./modules/es6.math.clz32":"R2Qc","./modules/es6.math.cosh":"nEse","./modules/es6.math.expm1":"AmoX","./modules/es6.math.fround":"vmlq","./modules/es6.math.hypot":"kLut","./modules/es6.math.imul":"A8J8","./modules/es6.math.log10":"VUW8","./modules/es6.math.log1p":"qtpC","./modules/es6.math.log2":"1Jo9","./modules/es6.math.sign":"mZl9","./modules/es6.math.sinh":"m0zb","./modules/es6.math.tanh":"Fnqw","./modules/es6.math.trunc":"tiOR","./modules/es6.string.from-code-point":"xSM3","./modules/es6.string.raw":"t2/9","./modules/es6.string.trim":"ZW4n","./modules/es6.string.iterator":"tbKg","./modules/es6.string.code-point-at":"zR9y","./modules/es6.string.ends-with":"zRn7","./modules/es6.string.includes":"fH7p","./modules/es6.string.repeat":"C85R","./modules/es6.string.starts-with":"w2SA","./modules/es6.string.anchor":"63US","./modules/es6.string.big":"c1D0","./modules/es6.string.blink":"Ee86","./modules/es6.string.bold":"ry39","./modules/es6.string.fixed":"AHLq","./modules/es6.string.fontcolor":"H7V0","./modules/es6.string.fontsize":"Dx83","./modules/es6.string.italics":"fRhg","./modules/es6.string.link":"1Aaz","./modules/es6.string.small":"qBr3","./modules/es6.string.strike":"eNyu","./modules/es6.string.sub":"BVLK","./modules/es6.string.sup":"kMsL","./modules/es6.date.now":"susM","./modules/es6.date.to-json":"Gj6n","./modules/es6.date.to-iso-string":"oGqv","./modules/es6.date.to-string":"QX5V","./modules/es6.date.to-primitive":"jQnQ","./modules/es6.array.is-array":"x7iF","./modules/es6.array.from":"RRcs","./modules/es6.array.of":"RB6b","./modules/es6.array.join":"Rs/6","./modules/es6.array.slice":"btFn","./modules/es6.array.sort":"nrVf","./modules/es6.array.for-each":"VsIt","./modules/es6.array.map":"RBsu","./modules/es6.array.filter":"GyG6","./modules/es6.array.some":"dwTY","./modules/es6.array.every":"AJ80","./modules/es6.array.reduce":"UGP9","./modules/es6.array.reduce-right":"9qhG","./modules/es6.array.index-of":"LvRh","./modules/es6.array.last-index-of":"kVuL","./modules/es6.array.copy-within":"tWTB","./modules/es6.array.fill":"hUQ6","./modules/es6.array.find":"Qppk","./modules/es6.array.find-index":"7sVm","./modules/es6.array.species":"smn3","./modules/es6.array.iterator":"6w+v","./modules/es6.regexp.constructor":"+05B","./modules/es6.regexp.exec":"S07n","./modules/es6.regexp.to-string":"iflU","./modules/es6.regexp.flags":"pDhD","./modules/es6.regexp.match":"RTfC","./modules/es6.regexp.replace":"KGao","./modules/es6.regexp.search":"zOab","./modules/es6.regexp.split":"a/o/","./modules/es6.promise":"Pjta","./modules/es6.map":"ioKM","./modules/es6.set":"coyu","./modules/es6.weak-map":"D6DP","./modules/es6.weak-set":"bRUR","./modules/es6.typed.array-buffer":"4NJ0","./modules/es6.typed.data-view":"qL4B","./modules/es6.typed.int8-array":"wqM+","./modules/es6.typed.uint8-array":"QTtY","./modules/es6.typed.uint8-clamped-array":"Kqgs","./modules/es6.typed.int16-array":"fEGw","./modules/es6.typed.uint16-array":"xyd6","./modules/es6.typed.int32-array":"hIko","./modules/es6.typed.uint32-array":"tNPN","./modules/es6.typed.float32-array":"/wis","./modules/es6.typed.float64-array":"9mbT","./modules/es6.reflect.apply":"F0Xu","./modules/es6.reflect.construct":"4JlF","./modules/es6.reflect.define-property":"S841","./modules/es6.reflect.delete-property":"JRlJ","./modules/es6.reflect.enumerate":"bSEr","./modules/es6.reflect.get":"kv8Z","./modules/es6.reflect.get-own-property-descriptor":"zj1X","./modules/es6.reflect.get-prototype-of":"d0aC","./modules/es6.reflect.has":"OWTq","./modules/es6.reflect.is-extensible":"deHu","./modules/es6.reflect.own-keys":"e6SV","./modules/es6.reflect.prevent-extensions":"BmyK","./modules/es6.reflect.set":"K46i","./modules/es6.reflect.set-prototype-of":"L5z5","./modules/es7.array.includes":"TLss","./modules/es7.array.flat-map":"I8vV","./modules/es7.array.flatten":"hTXg","./modules/es7.string.at":"+9ht","./modules/es7.string.pad-start":"9SWN","./modules/es7.string.pad-end":"n20m","./modules/es7.string.trim-left":"ppxd","./modules/es7.string.trim-right":"hxx1","./modules/es7.string.match-all":"nuR4","./modules/es7.symbol.async-iterator":"DlMC","./modules/es7.symbol.observable":"m9Sq","./modules/es7.object.get-own-property-descriptors":"BQD8","./modules/es7.object.values":"Ltmz","./modules/es7.object.entries":"gxEP","./modules/es7.object.define-getter":"guoQ","./modules/es7.object.define-setter":"HMp9","./modules/es7.object.lookup-getter":"HB2g","./modules/es7.object.lookup-setter":"QF5J","./modules/es7.map.to-json":"JwqU","./modules/es7.set.to-json":"s0lJ","./modules/es7.map.of":"FGzV","./modules/es7.set.of":"q4rf","./modules/es7.weak-map.of":"q85i","./modules/es7.weak-set.of":"dmfy","./modules/es7.map.from":"JQCn","./modules/es7.set.from":"rl69","./modules/es7.weak-map.from":"mEhd","./modules/es7.weak-set.from":"SgWE","./modules/es7.global":"zzQm","./modules/es7.system.global":"4rsr","./modules/es7.error.is-error":"c5Yp","./modules/es7.math.clamp":"88f2","./modules/es7.math.deg-per-rad":"M/9c","./modules/es7.math.degrees":"7+zj","./modules/es7.math.fscale":"IeZ8","./modules/es7.math.iaddh":"GM4x","./modules/es7.math.isubh":"Y1L+","./modules/es7.math.imulh":"cCkt","./modules/es7.math.rad-per-deg":"fCGe","./modules/es7.math.radians":"FX6J","./modules/es7.math.scale":"31zE","./modules/es7.math.umulh":"0zKy","./modules/es7.math.signbit":"FD1C","./modules/es7.promise.finally":"l1j0","./modules/es7.promise.try":"Worb","./modules/es7.reflect.define-metadata":"HqdS","./modules/es7.reflect.delete-metadata":"Okij","./modules/es7.reflect.get-metadata":"S3NM","./modules/es7.reflect.get-metadata-keys":"LScP","./modules/es7.reflect.get-own-metadata":"sqj0","./modules/es7.reflect.get-own-metadata-keys":"tL+x","./modules/es7.reflect.has-metadata":"6zEH","./modules/es7.reflect.has-own-metadata":"4d1Y","./modules/es7.reflect.metadata":"AN3+","./modules/es7.asap":"A0aM","./modules/es7.observable":"jFPl","./modules/web.timers":"OTsy","./modules/web.immediate":"5hZL","./modules/web.dom.iterable":"v6Aj","./modules/_core":"ss9A"}],"pGZN":[function(require,module,exports) {
var global = arguments[3];
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof global.process === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

},{}],"p9gL":[function(require,module,exports) {
module.exports = function (regExp, replace) {
  var replacer = replace === Object(replace) ? function (part) {
    return replace[part];
  } : replace;
  return function (it) {
    return String(it).replace(regExp, replacer);
  };
};

},{}],"4lrB":[function(require,module,exports) {
// https://github.com/benjamingr/RexExp.escape
var $export = require('./_export');
var $re = require('./_replacer')(/[\\^$*+?.()|[\]{}]/g, '\\$&');

$export($export.S, 'RegExp', { escape: function escape(it) { return $re(it); } });

},{"./_export":"izCb","./_replacer":"p9gL"}],"aLB7":[function(require,module,exports) {
require('../../modules/core.regexp.escape');
module.exports = require('../../modules/_core').RegExp.escape;

},{"../../modules/core.regexp.escape":"4lrB","../../modules/_core":"ss9A"}],"wllv":[function(require,module,exports) {
var global = arguments[3];

"use strict";

require("core-js/shim");

require("regenerator-runtime/runtime");

require("core-js/fn/regexp/escape");

if (global._babelPolyfill) {
  throw new Error("only one instance of babel-polyfill is allowed");
}
global._babelPolyfill = true;

var DEFINE_PROPERTY = "defineProperty";
function define(O, key, value) {
  O[key] || Object[DEFINE_PROPERTY](O, key, {
    writable: true,
    configurable: true,
    value: value
  });
}

define(String.prototype, "padLeft", "".padStart);
define(String.prototype, "padRight", "".padEnd);

"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
  [][key] && define(Array, key, Function.call.bind([][key]));
});
},{"core-js/shim":"8w2b","regenerator-runtime/runtime":"pGZN","core-js/fn/regexp/escape":"aLB7"}],"EjGt":[function(require,module,exports) {
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

exports.randomDigitStringId = randomDigitStringId; // Lodash-like _.get

function _get(object, path, defaultValue) {
  try {
    return eval('object.' + path);
  } catch (e) {
    return defaultValue;
  }
}

exports._get = _get; // Lodash-like _.merge

function _merge(object1, object2) {
  var mergedObject = {};

  for (var a in object1) {
    mergedObject[a] = object1[a];
  }

  for (var b in object2) {
    if (object2[b]) {
      mergedObject[b] = object2[b];
    }
  }

  return mergedObject;
}

exports._merge = _merge; // Lodash-like _.last

function _last(arr) {
  return arr[arr.length - 1];
}

exports._last = _last; // Lodash-like _.round

function _round(num) {
  return +num.toFixed(2);
}

exports._round = _round;

function detectPlatform() {
  return {
    isWindows: navigator.platform.indexOf('Win') > -1,
    isMac: navigator.platform.indexOf('Mac') > -1
  };
}

exports.detectPlatform = detectPlatform;
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

},{}],"70rD":[function(require,module,exports) {

},{}],"GpM8":[function(require,module,exports) {
"use strict";
/**
 * Styles are imported as base64-strings via fs.readFileSync() in order to include
 * them into a single bundle JS file, not simply copy to /dist folder as separate files
 *
 * Note that Parcel bundler utilizes a very limited custom implementation of fs.readFileSync()
 * @see https://en.parceljs.org/javascript.html#javascript
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var fs = require('fs');

var woffDataUrlPrefix = 'data:font/woff;base64,';
var mp3DataUrlPrefix = 'data:audio/mpeg;base64,';
exports.default = {
  fontGraphikBoldWeb: woffDataUrlPrefix + "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",
  fontGraphikRegularWeb: woffDataUrlPrefix + "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",
  fontElixirchatIcons: woffDataUrlPrefix + "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",
  notificationSound: mp3DataUrlPrefix + "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VVVVVVVVVVVVVVVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+1LE0wPMVUr9oIxh6AAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7UsShg8AAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tSxKGDwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+1LEoYPAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7UsShg8AAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tSxKGDwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+1LEoYPAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7UsShg8AAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tSxKGDwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU="
};
},{"fs":"70rD"}],"4KO9":[function(require,module,exports) {
"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var assets_1 = __importDefault(require("./widget/DefaultWidget/assets"));

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

function inflectDayJSWeekDays(locale, formattedDateString) {
  if (locale === 'en-US') {
    return formattedDateString;
  }

  var updatedFormattedDateString = formattedDateString;
  var reDictRu = {
    'в понедельник': 'в понедельник',
    'в вторник': 'во вторник',
    'в среда': 'в среду',
    'в четверг': 'в четверг',
    'в пятница': 'в пятницу',
    'в суббота': 'в субботу',
    'в воскресенье': 'в воскресенье'
  };

  for (var key in reDictRu) {
    var regex = new RegExp(key, 'ig');
    updatedFormattedDateString = updatedFormattedDateString.replace(regex, reDictRu[key]);
  }

  return updatedFormattedDateString;
}

exports.inflectDayJSWeekDays = inflectDayJSWeekDays;
/**
 * Prevents browser from muting audio autoplay
 * @see https://medium.com/@curtisrobinson/how-to-auto-play-audio-in-safari-with-javascript-21d50b0a2765
 */

function unlockNotificationSoundAutoplay(e) {
  var notification = new Audio(assets_1.default.notificationSound);
  notification.play().then(function () {
    notification.pause();
    notification.currentTime = 0;
  });

  if (e.target.tagName !== 'TEXTAREA') {
    // In Firefox, click on textarea doesn't unlock autoplay
    e.currentTarget.removeEventListener(e.type, unlockNotificationSoundAutoplay);
  }
}

exports.unlockNotificationSoundAutoplay = unlockNotificationSoundAutoplay;

function playNotificationSound() {
  var notification = new Audio(assets_1.default.notificationSound);
  notification.play();
}

exports.playNotificationSound = playNotificationSound;

function generateFontFaceRule(fontFamily, fontWeight, fontUrl) {
  return "@font-face {\n    font-family: \"".concat(fontFamily, "\";\n    ").concat(fontWeight ? "font-weight: ".concat(fontWeight, ";") : '', "\n    src: url(\"").concat(fontUrl, "\") format(\"woff\");\n  }");
}

exports.generateFontFaceRule = generateFontFaceRule;

function isWebImage(mimeType) {
  return ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'].includes(mimeType.toLowerCase());
}

exports.isWebImage = isWebImage;

function getHumanReadableFileSize(locale, sizeInBytes) {
  var unitsDict = {
    'ru-RU': {
      'kb': 'Кб',
      'mb': 'Мб',
      'gb': 'Гб'
    },
    'en-US': {
      'kb': 'Kb',
      'mb': 'Mb',
      'gb': 'Gb'
    }
  };
  var sizeInKb = sizeInBytes / 1024;
  var sizeInMb = sizeInKb / 1024;
  var sizeInGb = sizeInMb / 1024;
  var primarySize = sizeInKb;
  var primaryUnit = 'kb';

  if (sizeInGb > 1) {
    primarySize = sizeInGb;
    primaryUnit = 'gb';
  } else if (sizeInMb > 1) {
    primarySize = sizeInMb;
    primaryUnit = 'mb';
  }

  primarySize = primarySize < 0.1 ? 0.1 : +primarySize.toFixed(1);
  return primarySize.toLocaleString(locale) + ' ' + unitsDict[locale || 'en-US'][primaryUnit];
}

exports.getHumanReadableFileSize = getHumanReadableFileSize;

function getImageDimensions(_x) {
  return _getImageDimensions.apply(this, arguments);
}

function _getImageDimensions() {
  _getImageDimensions = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(imageUrl) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (resolve) {
              var image = new Image();

              image.onload = function () {
                resolve({
                  width: image.width,
                  height: image.height
                });
              };

              image.onerror = function () {
                resolve({
                  width: 0,
                  height: 0
                });
              };

              image.src = imageUrl;
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getImageDimensions.apply(this, arguments);
}

exports.getImageDimensions = getImageDimensions;
},{"./widget/DefaultWidget/assets":"GpM8"}],"3dZY":[function(require,module,exports) {
var define;
!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):t.dayjs=n()}(this,function(){"use strict";var t="millisecond",n="second",e="minute",r="hour",i="day",s="week",u="month",o="quarter",a="year",h=/^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/,f=/\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,c=function(t,n,e){var r=String(t);return!r||r.length>=n?t:""+Array(n+1-r.length).join(e)+t},d={s:c,z:function(t){var n=-t.utcOffset(),e=Math.abs(n),r=Math.floor(e/60),i=e%60;return(n<=0?"+":"-")+c(r,2,"0")+":"+c(i,2,"0")},m:function(t,n){var e=12*(n.year()-t.year())+(n.month()-t.month()),r=t.clone().add(e,u),i=n-r<0,s=t.clone().add(e+(i?-1:1),u);return Number(-(e+(n-r)/(i?r-s:s-r))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(h){return{M:u,y:a,w:s,d:i,h:r,m:e,s:n,ms:t,Q:o}[h]||String(h||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},$={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},l="en",m={};m[l]=$;var y=function(t){return t instanceof v},M=function(t,n,e){var r;if(!t)return l;if("string"==typeof t)m[t]&&(r=t),n&&(m[t]=n,r=t);else{var i=t.name;m[i]=t,r=i}return e||(l=r),r},g=function(t,n,e){if(y(t))return t.clone();var r=n?"string"==typeof n?{format:n,pl:e}:n:{};return r.date=t,new v(r)},D=d;D.l=M,D.i=y,D.w=function(t,n){return g(t,{locale:n.$L,utc:n.$u})};var v=function(){function c(t){this.$L=this.$L||M(t.locale,null,!0),this.parse(t)}var d=c.prototype;return d.parse=function(t){this.$d=function(t){var n=t.date,e=t.utc;if(null===n)return new Date(NaN);if(D.u(n))return new Date;if(n instanceof Date)return new Date(n);if("string"==typeof n&&!/Z$/i.test(n)){var r=n.match(h);if(r)return e?new Date(Date.UTC(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)):new Date(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)}return new Date(n)}(t),this.init()},d.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},d.$utils=function(){return D},d.isValid=function(){return!("Invalid Date"===this.$d.toString())},d.isSame=function(t,n){var e=g(t);return this.startOf(n)<=e&&e<=this.endOf(n)},d.isAfter=function(t,n){return g(t)<this.startOf(n)},d.isBefore=function(t,n){return this.endOf(n)<g(t)},d.$g=function(t,n,e){return D.u(t)?this[n]:this.set(e,t)},d.year=function(t){return this.$g(t,"$y",a)},d.month=function(t){return this.$g(t,"$M",u)},d.day=function(t){return this.$g(t,"$W",i)},d.date=function(t){return this.$g(t,"$D","date")},d.hour=function(t){return this.$g(t,"$H",r)},d.minute=function(t){return this.$g(t,"$m",e)},d.second=function(t){return this.$g(t,"$s",n)},d.millisecond=function(n){return this.$g(n,"$ms",t)},d.unix=function(){return Math.floor(this.valueOf()/1e3)},d.valueOf=function(){return this.$d.getTime()},d.startOf=function(t,o){var h=this,f=!!D.u(o)||o,c=D.p(t),d=function(t,n){var e=D.w(h.$u?Date.UTC(h.$y,n,t):new Date(h.$y,n,t),h);return f?e:e.endOf(i)},$=function(t,n){return D.w(h.toDate()[t].apply(h.toDate(),(f?[0,0,0,0]:[23,59,59,999]).slice(n)),h)},l=this.$W,m=this.$M,y=this.$D,M="set"+(this.$u?"UTC":"");switch(c){case a:return f?d(1,0):d(31,11);case u:return f?d(1,m):d(0,m+1);case s:var g=this.$locale().weekStart||0,v=(l<g?l+7:l)-g;return d(f?y-v:y+(6-v),m);case i:case"date":return $(M+"Hours",0);case r:return $(M+"Minutes",1);case e:return $(M+"Seconds",2);case n:return $(M+"Milliseconds",3);default:return this.clone()}},d.endOf=function(t){return this.startOf(t,!1)},d.$set=function(s,o){var h,f=D.p(s),c="set"+(this.$u?"UTC":""),d=(h={},h[i]=c+"Date",h.date=c+"Date",h[u]=c+"Month",h[a]=c+"FullYear",h[r]=c+"Hours",h[e]=c+"Minutes",h[n]=c+"Seconds",h[t]=c+"Milliseconds",h)[f],$=f===i?this.$D+(o-this.$W):o;if(f===u||f===a){var l=this.clone().set("date",1);l.$d[d]($),l.init(),this.$d=l.set("date",Math.min(this.$D,l.daysInMonth())).toDate()}else d&&this.$d[d]($);return this.init(),this},d.set=function(t,n){return this.clone().$set(t,n)},d.get=function(t){return this[D.p(t)]()},d.add=function(t,o){var h,f=this;t=Number(t);var c=D.p(o),d=function(n){var e=g(f);return D.w(e.date(e.date()+Math.round(n*t)),f)};if(c===u)return this.set(u,this.$M+t);if(c===a)return this.set(a,this.$y+t);if(c===i)return d(1);if(c===s)return d(7);var $=(h={},h[e]=6e4,h[r]=36e5,h[n]=1e3,h)[c]||1,l=this.valueOf()+t*$;return D.w(l,this)},d.subtract=function(t,n){return this.add(-1*t,n)},d.format=function(t){var n=this;if(!this.isValid())return"Invalid Date";var e=t||"YYYY-MM-DDTHH:mm:ssZ",r=D.z(this),i=this.$locale(),s=this.$H,u=this.$m,o=this.$M,a=i.weekdays,h=i.months,c=function(t,r,i,s){return t&&(t[r]||t(n,e))||i[r].substr(0,s)},d=function(t){return D.s(s%12||12,t,"0")},$=i.meridiem||function(t,n,e){var r=t<12?"AM":"PM";return e?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:o+1,MM:D.s(o+1,2,"0"),MMM:c(i.monthsShort,o,h,3),MMMM:h[o]||h(this,e),D:this.$D,DD:D.s(this.$D,2,"0"),d:String(this.$W),dd:c(i.weekdaysMin,this.$W,a,2),ddd:c(i.weekdaysShort,this.$W,a,3),dddd:a[this.$W],H:String(s),HH:D.s(s,2,"0"),h:d(1),hh:d(2),a:$(s,u,!0),A:$(s,u,!1),m:String(u),mm:D.s(u,2,"0"),s:String(this.$s),ss:D.s(this.$s,2,"0"),SSS:D.s(this.$ms,3,"0"),Z:r};return e.replace(f,function(t,n){return n||l[t]||r.replace(":","")})},d.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},d.diff=function(t,h,f){var c,d=D.p(h),$=g(t),l=6e4*($.utcOffset()-this.utcOffset()),m=this-$,y=D.m(this,$);return y=(c={},c[a]=y/12,c[u]=y,c[o]=y/3,c[s]=(m-l)/6048e5,c[i]=(m-l)/864e5,c[r]=m/36e5,c[e]=m/6e4,c[n]=m/1e3,c)[d]||m,f?y:D.a(y)},d.daysInMonth=function(){return this.endOf(u).$D},d.$locale=function(){return m[this.$L]},d.locale=function(t,n){if(!t)return this.$L;var e=this.clone();return e.$L=M(t,n,!0),e},d.clone=function(){return D.w(this.toDate(),this)},d.toDate=function(){return new Date(this.$d)},d.toJSON=function(){return this.toISOString()},d.toISOString=function(){return this.$d.toISOString()},d.toString=function(){return this.$d.toUTCString()},c}();return g.prototype=v.prototype,g.extend=function(t,n){return t(n,v,g),g},g.locale=M,g.isDayjs=y,g.unix=function(t){return g(1e3*t)},g.en=m[l],g.Ls=m,g});

},{}],"B5kD":[function(require,module,exports) {
var define;
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.dayjs_plugin_calendar=t()}(this,function(){"use strict";return function(e,t,a){var d="h:mm A",n={lastDay:"[Yesterday at] "+d,sameDay:"[Today at] "+d,nextDay:"[Tomorrow at] "+d,nextWeek:"dddd [at] "+d,lastWeek:"[Last] dddd [at] "+d,sameElse:"MM/DD/YYYY"};t.prototype.calendar=function(e,t){var d=t||this.$locale().calendar||n,s=a(e||void 0).startOf("d"),o=this.diff(s,"d",!0),r=o<-6?"sameElse":o<-1?"lastWeek":o<0?"lastDay":o<1?"sameDay":o<2?"nextDay":o<7?"nextWeek":"sameElse";return this.format(d[r]||n[r])}}});

},{}],"7ZQM":[function(require,module,exports) {
var define;
!function(_,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("dayjs")):"function"==typeof define&&define.amd?define(["dayjs"],t):_.dayjs_locale_ru=t(_.dayjs)}(this,function(_){"use strict";_=_&&_.hasOwnProperty("default")?_.default:_;var t="января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря".split("_"),e="январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),n="янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.".split("_"),s="янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.".split("_"),d=/D[oD]?(\[[^[\]]*\]|\s)+MMMM?/,o={name:"ru",weekdays:"воскресенье_понедельник_вторник_среда_четверг_пятница_суббота".split("_"),weekdaysShort:"вск_пнд_втр_срд_чтв_птн_сбт".split("_"),weekdaysMin:"вс_пн_вт_ср_чт_пт_сб".split("_"),months:function(_,n){return d.test(n)?t[_.month()]:e[_.month()]},monthsShort:function(_,t){return d.test(t)?n[_.month()]:s[_.month()]},weekStart:1,formats:{LT:"H:mm",LTS:"H:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY г.",LLL:"D MMMM YYYY г., H:mm",LLLL:"dddd, D MMMM YYYY г., H:mm"},relativeTime:{future:"через %s",past:"%s назад",s:"несколько секунд",m:"минута",mm:"%d минут",h:"час",hh:"%d часов",d:"день",dd:"%d дней",M:"месяц",MM:"%d месяцев",y:"год",yy:"%d лет"},ordinal:function(_){return _}};return _.locale(o,null,!0),o});

},{"dayjs":"3dZY"}],"Asjh":[function(require,module,exports) {
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
},{"./factoryWithThrowingShims":"wVGV"}],"FpH/":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidMatch = isValidMatch;
var uriSchemeRegex = /^[A-Za-z][-.+A-Za-z0-9]+:/;
var hasFullProtocolRegex = /^[A-Za-z][-.+A-Za-z0-9]+:\/\//;
var hasWordCharAfterProtocolRegex = /:[^\s]*?[A-Za-z]/;
var invalidProtocolRelMatchRegex = /^[\w]\/\//;

/**
 * Determines if a given match found by the match parser is valid.
 * Will return `false` for:
 *
 * 1) URL matches which do not have at least have one period ('.') in the
 *    domain name (effectively skipping over matches like "abc:def").
 *    However, URL matches with a protocol will be allowed (ex: 'http://localhost')
 * 2) URL matches which do not have at least one word character in the
 *    domain name (effectively skipping over matches like "git:1.0").
 * 3) A protocol-relative url match (a URL beginning with '//') whose
 *    previous character is a word character (effectively skipping over
 *    strings like "abc//google.com")
 *
 * Otherwise, returns `true`.
 *
 * @param {String} urlMatch The matched URL, if there was one. Will be an
 *   empty string if the match is not a URL match.
 * @param {String} protocolUrlMatch The match URL string for a protocol
 *   match. Ex: 'http://yahoo.com'. This is used to match something like
 *   'http://localhost', where we won't double check that the domain name
 *   has at least one '.' in it.
 * @param {String} protocolRelativeMatch The protocol-relative string for a
 *   URL match (i.e. '//'), possibly with a preceding character (ex, a
 *   space, such as: ' //', or a letter, such as: 'a//'). The match is
 *   invalid if there is a word character preceding the '//'.
 * @return {Boolean} `true` if the match given is valid and should be
 *   processed, or `false` if the match is invalid and/or should just not be
 *   processed.
 */
function isValidMatch(urlMatch, protocolUrlMatch, protocolRelativeMatch) {
  if (protocolUrlMatch && !isValidUriScheme(protocolUrlMatch) || urlMatchDoesNotHaveProtocolOrDot(urlMatch, protocolUrlMatch) || // At least one period ('.') must exist in the URL match for us to consider it an actual URL, *unless* it was a full protocol match (like 'http://localhost')
  urlMatchDoesNotHaveAtLeastOneWordChar(urlMatch, protocolUrlMatch) || // At least one letter character must exist in the domain name after a protocol match. Ex: skip over something like "git:1.0"
  isInvalidProtocolRelativeMatch(protocolRelativeMatch) // A protocol-relative match which has a word character in front of it (so we can skip something like "abc//google.com")
  ) {
      return false;
    }

  return true;
}

/**
 * Determines if the URI scheme is a valid scheme to be autolinked. Returns
 * `false` if the scheme is 'javascript:' or 'vbscript:'
 *
 * @private
 * @param {String} uriSchemeMatch The match URL string for a full URI scheme
 *   match. Ex: 'http://yahoo.com' or 'mailto:a@a.com'.
 * @return {Boolean} `true` if the scheme is a valid one, `false` otherwise.
 */
function isValidUriScheme(uriSchemeMatch) {
  var uriScheme = uriSchemeMatch.match(uriSchemeRegex)[0].toLowerCase();

  return uriScheme !== 'javascript:' && uriScheme !== 'vbscript:';
}

/**
 * Determines if a URL match does not have either:
 *
 * a) a full protocol (i.e. 'http://'), or
 * b) at least one dot ('.') in the domain name (for a non-full-protocol
 *    match).
 *
 * Either situation is considered an invalid URL (ex: 'git:d' does not have
 * either the '://' part, or at least one dot in the domain name. If the
 * match was 'git:abc.com', we would consider this valid.)
 *
 * @private
 * @param {String} urlMatch The matched URL, if there was one. Will be an
 *   empty string if the match is not a URL match.
 * @param {String} protocolUrlMatch The match URL string for a protocol
 *   match. Ex: 'http://yahoo.com'. This is used to match something like
 *   'http://localhost', where we won't double check that the domain name
 *   has at least one '.' in it.
 * @return {Boolean} `true` if the URL match does not have a full protocol,
 *   or at least one dot ('.') in a non-full-protocol match.
 */
function urlMatchDoesNotHaveProtocolOrDot(urlMatch, protocolUrlMatch) {
  return !!urlMatch && (!protocolUrlMatch || !hasFullProtocolRegex.test(protocolUrlMatch)) && urlMatch.indexOf('.') === -1;
}

/**
 * Determines if a URL match does not have at least one word character after
 * the protocol (i.e. in the domain name).
 *
 * At least one letter character must exist in the domain name after a
 * protocol match. Ex: skip over something like "git:1.0"
 *
 * @private
 * @param {String} urlMatch The matched URL, if there was one. Will be an
 *   empty string if the match is not a URL match.
 * @param {String} protocolUrlMatch The match URL string for a protocol
 *   match. Ex: 'http://yahoo.com'. This is used to know whether or not we
 *   have a protocol in the URL string, in order to check for a word
 *   character after the protocol separator (':').
 * @return {Boolean} `true` if the URL match does not have at least one word
 *   character in it after the protocol, `false` otherwise.
 */
function urlMatchDoesNotHaveAtLeastOneWordChar(urlMatch, protocolUrlMatch) {
  if (urlMatch && protocolUrlMatch) {
    return !hasWordCharAfterProtocolRegex.test(urlMatch);
  } else {
    return false;
  }
}

/**
 * Determines if a protocol-relative match is an invalid one. This method
 * returns `true` if there is a `protocolRelativeMatch`, and that match
 * contains a word character before the '//' (i.e. it must contain
 * whitespace or nothing before the '//' in order to be considered valid).
 *
 * @private
 * @param {String} protocolRelativeMatch The protocol-relative string for a
 *   URL match (i.e. '//'), possibly with a preceding character (ex, a
 *   space, such as: ' //', or a letter, such as: 'a//'). The match is
 *   invalid if there is a word character preceding the '//'.
 * @return {Boolean} `true` if it is an invalid protocol-relative match,
 *   `false` otherwise.
 */
function isInvalidProtocolRelativeMatch(protocolRelativeMatch) {
  return !!protocolRelativeMatch && invalidProtocolRelMatchRegex.test(protocolRelativeMatch);
}
},{}],"iqWA":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A regular expression used to remove the 'http://' or 'https://' and/or the 'www.' from URLs.
 */
var URL_PREFIX_REGEX = /^(https?:\/\/)?(www\.)?/i;

/**
 * The regular expression used to remove the protocol-relative '//' from the {@link #url} string, for purposes
 * of {@link #getAnchorText}. A protocol-relative URL is, for example, "//yahoo.com"
 */
var PROTOCOL_RELATIVE_REGEX = /^\/\//;

/**
 * @class Autolinker.match.Url
 *
 * Represents a Url match found in an input string which should be Autolinked.
 */

var URLMatch = function () {
  function URLMatch(url, protocolUrlMatch, protocolRelativeMatch, position) {
    _classCallCheck(this, URLMatch);

    this._url = url;
    this._protocolUrlMatch = protocolUrlMatch;
    this._protocolRelativeMatch = protocolRelativeMatch;
    this.position = position;

    /**
     * Will be set to `true` if the 'http://' protocol has been prepended to the {@link #url} (because the
     * {@link #url} did not have a protocol)
     */
    this.protocolPrepended = false;
  }

  /**
   * Returns the url that was matched, assuming the protocol to be 'http://' if the original
   * match was missing a protocol.
   *
   * @return {String}
   */


  _createClass(URLMatch, [{
    key: 'getUrl',
    value: function getUrl() {
      var url = this._url;

      // if the url string doesn't begin with a protocol, assume 'http://'
      if (!this._protocolRelativeMatch && !this._protocolUrlMatch && !this.protocolPrepended) {
        url = this._url = 'http://' + url;

        this.protocolPrepended = true;
      }

      return url;
    }

    /**
     * Returns the anchor href that should be generated for the match.
     *
     * @return {String}
     */

  }, {
    key: 'getAnchorHref',
    value: function getAnchorHref() {
      var url = this.getUrl();

      return url.replace(/&amp;/g, '&'); // any &amp;'s in the URL should be converted back to '&' if they were displayed as &amp; in the source html
    }

    /**
     * Returns the anchor text that should be generated for the match.
     *
     * @return {String}
     */

  }, {
    key: 'getAnchorText',
    value: function getAnchorText() {
      var anchorText = this.getUrl();

      if (this._protocolRelativeMatch) {
        // Strip off any protocol-relative '//' from the anchor text
        anchorText = this.stripProtocolRelativePrefix(anchorText);
      }
      anchorText = this.stripUrlPrefix(anchorText); // remove URL prefix
      anchorText = this.removeTrailingSlash(anchorText); // remove trailing slash, if there is one

      return anchorText;
    }

    // ---------------------------------------

    // Utility Functionality

    /**
     * Strips the URL prefix (such as "http://" or "https://") from the given text.
     *
     * @private
     * @param {String} text The text of the anchor that is being generated, for which to strip off the
     *   url prefix (such as stripping off "http://")
     * @return {String} The `anchorText`, with the prefix stripped.
     */

  }, {
    key: 'stripUrlPrefix',
    value: function stripUrlPrefix(text) {
      return text.replace(URL_PREFIX_REGEX, '');
    }

    /**
     * Strips any protocol-relative '//' from the anchor text.
     *
     * @private
     * @param {String} text The text of the anchor that is being generated, for which to strip off the
     *   protocol-relative prefix (such as stripping off "//")
     * @return {String} The `anchorText`, with the protocol-relative prefix stripped.
     */

  }, {
    key: 'stripProtocolRelativePrefix',
    value: function stripProtocolRelativePrefix(text) {
      return text.replace(PROTOCOL_RELATIVE_REGEX, '');
    }

    /**
     * Removes any trailing slash from the given `anchorText`, in preparation for the text to be displayed.
     *
     * @private
     * @param {String} anchorText The text of the anchor that is being generated, for which to remove any trailing
     *   slash ('/') that may exist.
     * @return {String} The `anchorText`, with the trailing slash removed.
     */

  }, {
    key: 'removeTrailingSlash',
    value: function removeTrailingSlash(anchorText) {
      if (anchorText.charAt(anchorText.length - 1) === '/') {
        anchorText = anchorText.slice(0, -1);
      }
      return anchorText;
    }
  }]);

  return URLMatch;
}();

exports.default = URLMatch;
},{}],"gYzK":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = function (text) {
  var regex = new RegExp(urlRegex, 'gi');
  var matches = [];

  var match;
  while ((match = regex.exec(text)) !== null) {
    var _match = match,
        _match2 = _slicedToArray(_match, 4),
        matchedText = _match2[0],
        protocolUrlMatch = _match2[1],
        wwwProtocolRelativeMatch = _match2[2],
        tldProtocolRelativeMatch = _match2[3];

    var protocolRelativeMatch = wwwProtocolRelativeMatch || tldProtocolRelativeMatch;

    // If it's a protocol-relative '//' match, remove the character
    // before the '//' (which the matcherRegex needed to match due to
    // the lack of a negative look-behind in JavaScript regular
    // expressions)
    if (protocolRelativeMatch) {
      var charBeforeMatch = protocolRelativeMatch.match(charBeforeProtocolRelMatchRegex)[1] || '';

      // fix up the `matchStr` if there was a preceding char before a protocol-relative match, which was needed to determine the match itself (since there are no look-behinds in JS regexes)
      if (charBeforeMatch) {
        matchedText = matchedText.slice(1); // remove the prefixed char from the match
        match.index++;
      }
    }

    if ((0, _match_validator.isValidMatch)(matchedText, protocolUrlMatch, protocolRelativeMatch)) {
      var position = { start: match.index, end: regex.lastIndex };
      matches.push(new _url_match2.default(matchedText, protocolUrlMatch, protocolRelativeMatch, position));
    }
  }

  return matches;
};

var _match_validator = require('./match_validator');

var _url_match = require('./url_match');

var _url_match2 = _interopRequireDefault(_url_match);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// match protocol, allow in format "http://" or "mailto:". However, do not match
// the first part of something like 'link:http://www.google.com' (i.e. don't match "link:").
// Also, make sure we don't interpret 'google.com:8000' as if 'google.com' was a
// protocol here (i.e. ignore a trailing port number in this regex)
var protocolRegex = /(?:[A-Za-z][-.+A-Za-z0-9]+:(?![A-Za-z][-.+A-Za-z0-9]+:\/\/)(?!\d+\/?)(?:\/\/)?)/;

// starting with 'www.'
var wwwRegex = /(?:www\.)/;

// anything looking at all like a domain, non-unicode domains, not ending in a period
var domainNameRegex = /[A-Za-z0-9.-]*[A-Za-z0-9-]/;

// match our known top level domains (TLDs)
var tldRegex = /\.(?:international|construction|contractors|enterprises|photography|productions|foundation|immobilien|industries|management|properties|technology|christmas|community|directory|education|equipment|institute|marketing|solutions|vacations|bargains|boutique|builders|catering|cleaning|clothing|computer|democrat|diamonds|graphics|holdings|lighting|partners|plumbing|supplies|training|ventures|academy|careers|company|cruises|domains|exposed|flights|florist|gallery|guitars|holiday|kitchen|neustar|okinawa|recipes|rentals|reviews|shiksha|singles|support|systems|agency|berlin|camera|center|coffee|condos|dating|estate|events|expert|futbol|kaufen|luxury|maison|monash|museum|nagoya|photos|repair|report|social|supply|tattoo|tienda|travel|viajes|villas|vision|voting|voyage|actor|build|cards|cheap|codes|dance|email|glass|house|mango|ninja|parts|photo|shoes|solar|today|tokyo|tools|watch|works|aero|arpa|asia|best|bike|blue|buzz|camp|club|cool|coop|farm|fish|gift|guru|info|jobs|kiwi|kred|land|limo|link|menu|mobi|moda|name|pics|pink|post|qpon|rich|ruhr|sexy|tips|vote|voto|wang|wien|wiki|zone|bar|bid|biz|cab|cat|ceo|com|edu|gov|int|kim|mil|net|onl|org|pro|pub|red|tel|uno|wed|xxx|xyz|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cw|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw)\b/;

// Allow optional path, query string, and hash anchor, not ending in the following characters: "?!:,.;"
// http://blog.codinghorror.com/the-problem-with-urls/
var urlSuffixRegex = /[-A-Za-z0-9+&@#/%=~_()|'$*[\]?!:,.;]*[-A-Za-z0-9+&@#/%=~_()|'$*[\]]/;

var charBeforeProtocolRelMatchRegex = /^(.)?\/\//;

/* eslint-disable indent */
var urlRegex = ['(?:', // parens to cover match for protocol (optional), and domain
'(', // *** Capturing group $1, for a protocol-prefixed url (ex: http://google.com)
protocolRegex.source, domainNameRegex.source, ')', '|', '(?:', // non-capturing paren for a 'www.' prefixed url (ex: www.google.com)
'(.?//)?', // *** Capturing group $2 for an optional protocol-relative URL. Must be at the beginning of the string or start with a non-word character
wwwRegex.source, domainNameRegex.source, ')', '|', '(?:', // non-capturing paren for known a TLD url (ex: google.com)
'(.?//)?', // *** Capturing group $3 for an optional protocol-relative URL. Must be at the beginning of the string or start with a non-word character
domainNameRegex.source, tldRegex.source, ')', ')', '(?:' + urlSuffixRegex.source + ')?'].join('');
/* eslint-enable indent */
},{"./match_validator":"FpH/","./url_match":"iqWA"}],"7BCM":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _match_parser = require('./match_parser');

var _match_parser2 = _interopRequireDefault(_match_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AutoLinkText = function (_PureComponent) {
  _inherits(AutoLinkText, _PureComponent);

  function AutoLinkText() {
    _classCallCheck(this, AutoLinkText);

    return _possibleConstructorReturn(this, (AutoLinkText.__proto__ || Object.getPrototypeOf(AutoLinkText)).apply(this, arguments));
  }

  _createClass(AutoLinkText, [{
    key: 'prepareElements',
    value: function prepareElements(matches, text) {
      var _this2 = this;

      var elements = [];
      var lastIndex = 0;

      matches.forEach(function (match) {
        if (match.position.start !== 0) {
          elements.push(_react2.default.createElement('span', {}, text.slice(lastIndex, match.position.start)));
        }
        elements.push(_react2.default.createElement('a', Object.assign({}, { href: match.getAnchorHref() }, _this2.props.linkProps), match.getAnchorText()));
        lastIndex = match.position.end;
      });

      if (lastIndex < text.length) {
        elements.push(_react2.default.createElement('span', {}, text.slice(lastIndex)));
      }

      return elements;
    }
  }, {
    key: 'truncate',
    value: function truncate(items) {
      var _this3 = this;

      if (!this.props.maxLength) return items;

      var elements = [];
      var length = 0;

      items.some(function (el) {
        length += el.props.children.length;

        if (length > _this3.props.maxLength) {
          var truncatedText = el.props.children.slice(0, -(length - _this3.props.maxLength));
          elements.push(_react2.default.cloneElement(el, {}, truncatedText));
          return true; // stop iterating through the elements
        }

        elements.push(el);
      });

      return elements;
    }

    /*
     * Generate unique keys for each of the elements.
     * The key will be based on the index of the element.
     */

  }, {
    key: 'keyElements',
    value: function keyElements(elements) {
      return elements.map(function (el, index) {
        return _react2.default.cloneElement(el, { key: index });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var text = this.props.text || '';

      var keyedElements = this.keyElements(this.truncate(this.prepareElements((0, _match_parser2.default)(text), text)));

      return _react2.default.createElement('span', {}, keyedElements);
    }
  }]);

  return AutoLinkText;
}(_react.PureComponent);

exports.default = AutoLinkText;


AutoLinkText.propTypes = {
  text: _propTypes2.default.string,
  linkProps: _propTypes2.default.object,
  maxLength: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string])
};
},{"react":"1n8/","prop-types":"5D9O","./match_parser":"gYzK"}],"CLsL":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var utilsCommon_1 = require("../utilsCommon");

var ScreenshotTaker =
/*#__PURE__*/
function () {
  function ScreenshotTaker() {
    var _this = this;

    _classCallCheck(this, ScreenshotTaker);

    this.mediaOptions = {};
    this.width = 0;
    this.height = 0;

    this.takeScreenshot = function () {
      return new Promise(function (resolve, reject) {
        _this.getMediaStream().then(function (stream) {
          _this.stream = stream;
          _this.video.srcObject = _this.stream;

          _this.video.oncanplay = function () {
            _this.setVideoCanvasSize();

            setTimeout(function () {
              var screenshot = _this.captureVideoFrame();

              _this.stopMediaStream();

              resolve(screenshot);
            }, 500);
          };

          _this.video.play();
        }).catch(reject);
      });
    };

    this.initialize();
  }

  _createClass(ScreenshotTaker, [{
    key: "initialize",
    value: function initialize() {
      this.width = screen.width;
      this.canvas = document.createElement('canvas');
      this.video = document.createElement('video');
    }
  }, {
    key: "setVideoCanvasSize",
    value: function setVideoCanvasSize() {
      var video = this.video,
          canvas = this.canvas,
          width = this.width;
      this.height = video.videoHeight / (video.videoWidth / width);
      video.width = width;
      video.height = this.height;
      canvas.width = width;
      canvas.height = this.height;
    }
  }, {
    key: "captureVideoFrame",
    value: function captureVideoFrame() {
      var canvas = this.canvas,
          width = this.width,
          height = this.height,
          video = this.video;
      var context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, width, height);
      var dataUrl = canvas.toDataURL('image/png');
      var file = this.base64ToFile(dataUrl);
      return {
        dataUrl: dataUrl,
        file: file
      };
    }
  }, {
    key: "stopMediaStream",
    value: function stopMediaStream() {
      this.stream.getTracks()[0].stop();
    }
  }, {
    key: "getMediaStream",
    value: function getMediaStream() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        try {
          var mediaDevices = navigator.mediaDevices;
          mediaDevices.getDisplayMedia(_this2.mediaOptions).then(resolve).catch(reject);
        } catch (e) {
          reject({
            message: 'MediaDevices.getDisplayMedia is not supported in this browser'
          });
        }
      });
    }
  }, {
    key: "base64ToFile",
    value: function base64ToFile(dataUrl) {
      var blobBin = atob(dataUrl.split(',')[1]);
      var blobArray = [];

      for (var i = 0; i < blobBin.length; i++) {
        blobArray.push(blobBin.charCodeAt(i));
      }

      var blob = new Blob([new Uint8Array(blobArray)]);
      var fileName = "Screenshot ".concat(new Date().toLocaleString(), ".png");
      return new File([blob], fileName, {
        type: 'image/png'
      });
    }
  }]);

  return ScreenshotTaker;
}();

exports.ScreenshotTaker = ScreenshotTaker;

exports.getCompatibilityFallback = function () {
  if (navigator.mediaDevices.getDisplayMedia) {
    return null;
  } else {
    var platform = utilsCommon_1.detectPlatform();

    if (platform.isMac) {
      return {
        pressKey: 'Cmd+Control+Shift+3'
      };
    } else if (platform.isWindows) {
      return {
        pressKey: 'PrtSc',
        pressKeySecondary: 'Fn+PrtSc'
      };
    } else {
      return {
        pressKey: null
      };
    }
  }
};
},{"../utilsCommon":"EjGt"}],"17A3":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var react_autolink_text2_1 = __importDefault(require("react-autolink-text2"));

var utilsCommon_1 = require("../../utilsCommon");

var utilsWidget_1 = require("../../utilsWidget");

var ScreenshotTaker_1 = require("../../sdk/ScreenshotTaker");

var ChatMessages =
/*#__PURE__*/
function (_react_1$Component) {
  _inherits(ChatMessages, _react_1$Component);

  function ChatMessages() {
    var _this;

    _classCallCheck(this, ChatMessages);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ChatMessages).apply(this, arguments));
    _this.state = {
      processedMessages: [],
      imagePreviews: [],
      screenshotFallback: null
    };
    _this.maxThumbnailSize = 256;

    _this.setProcessedMessages = function (messages, highlightedMessageIds) {
      var imagePreviews = [];
      var processedMessages = messages.map(function (message, i) {
        var processedMessage = Object.assign({}, message);
        var previousMessage = messages[i - 1];

        if (previousMessage) {
          var isDayEarlier = dayjs_1.default(previousMessage.timestamp).isBefore(dayjs_1.default(message.timestamp).startOf('day'));

          if (isDayEarlier) {
            processedMessage.prependDateTitle = true;
          }
        }

        if (processedMessage.attachments.length) {
          var _this$processAttachme = _this.processAttachments(message.attachments, message.sender),
              files = _this$processAttachme.files,
              images = _this$processAttachme.images;

          imagePreviews = imagePreviews.concat(images);
          processedMessage.files = files;
          processedMessage.images = images;
        }

        if (highlightedMessageIds.includes(processedMessage.id)) {
          processedMessage.isHighlighted = true;
        }

        return processedMessage;
      });

      _this.setState({
        processedMessages: processedMessages,
        imagePreviews: imagePreviews
      });
    };

    _this.processAttachments = function (attachments, sender) {
      var images = [];
      var files = [];
      attachments.forEach(function (attachment) {
        var thumbnailUrl = utilsCommon_1._get(attachment, 'thumbnails[0].url', null);

        var thumbnailRatio = _this.maxThumbnailSize / Math.max(attachment.width, attachment.height);
        var thumbnailWidth = attachment.width * thumbnailRatio;
        var thumbnailHeight = attachment.height * thumbnailRatio;

        if (utilsWidget_1.isWebImage(attachment.contentType) && thumbnailWidth && thumbnailHeight) {
          images.push(Object.assign({}, attachment, {
            sender: sender,
            thumbnailUrl: thumbnailUrl,
            thumbnailWidth: thumbnailWidth,
            thumbnailHeight: thumbnailHeight
          }));
        } else {
          files.push(Object.assign({}, attachment, {
            thumbnailUrl: thumbnailUrl
          }));
        }
      });
      return {
        images: images,
        files: files
      };
    };

    _this.onImagePreviewClick = function (e, preview) {
      var onImagePreviewOpen = _this.props.onImagePreviewOpen;
      var imagePreviews = _this.state.imagePreviews;
      onImagePreviewOpen(preview, imagePreviews);
      e.preventDefault();
    };

    _this.shouldHideMessageBalloon = function (message) {
      var hasText = message.text.trim();
      var hasReply = message.responseToMessage;
      var hasFiles = message.files && message.files.length;
      return message.sender.isCurrentClient && !hasText && !hasReply && !hasFiles;
    };

    _this.scrollToMessage = function (message) {
      var highlightedClassName = 'elixirchat-chat-messages__item--highlighted';

      var messageDOMElement = _this.refs["message-".concat(message.id)];

      if (messageDOMElement) {
        messageDOMElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        messageDOMElement.classList.add(highlightedClassName);
        setTimeout(function () {
          messageDOMElement.classList.remove(highlightedClassName);
        }, 1000);
      }
    };

    _this.onTakeScreenshotClick = function () {
      var _this$props = _this.props,
          elixirChatWidget = _this$props.elixirChatWidget,
          onScreenshotRequestFulfilled = _this$props.onScreenshotRequestFulfilled;
      elixirChatWidget.toggleChatVisibility();
      elixirChatWidget.takeScreenshot().then(function (screenshot) {
        onScreenshotRequestFulfilled(screenshot);
        elixirChatWidget.toggleChatVisibility();
      }).catch(function () {
        elixirChatWidget.toggleChatVisibility();
      });
    };

    _this.renderKeyShortcut = function (keySequence) {
      return react_1.default.createElement(react_1.Fragment, null, keySequence.split(/\+/).map(function (key, index) {
        return react_1.default.createElement(react_1.Fragment, {
          key: index
        }, !!index && '+', react_1.default.createElement("kbd", null, key));
      }));
    };

    return _this;
  }

  _createClass(ChatMessages, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props2 = this.props,
          messages = _this$props2.messages,
          highlightedMessageIds = _this$props2.highlightedMessageIds;
      dayjs_1.default.locale('ru');
      dayjs_1.default.extend(calendar_1.default);
      this.setProcessedMessages(messages, highlightedMessageIds);
      this.setState({
        screenshotFallback: ScreenshotTaker_1.getCompatibilityFallback()
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props3 = this.props,
          messages = _this$props3.messages,
          highlightedMessageIds = _this$props3.highlightedMessageIds;
      var didMessagesChange = prevProps.messages !== messages;
      var didHighlightedMessagesChange = prevProps.highlightedMessageIds !== highlightedMessageIds;

      if (didMessagesChange || didHighlightedMessagesChange) {
        this.setProcessedMessages(messages, highlightedMessageIds);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state = this.state,
          processedMessages = _this$state.processedMessages,
          screenshotFallback = _this$state.screenshotFallback;
      var _this$props4 = this.props,
          elixirChatWidget = _this$props4.elixirChatWidget,
          onReplyMessage = _this$props4.onReplyMessage,
          onSubmitRetry = _this$props4.onSubmitRetry;
      return react_1.default.createElement("div", {
        className: "elixirchat-chat-messages"
      }, processedMessages.map(function (message) {
        return react_1.default.createElement(react_1.Fragment, {
          key: message.id
        }, message.prependDateTitle && react_1.default.createElement("div", {
          className: "elixirchat-chat-messages__date-title"
        }, dayjs_1.default(message.timestamp).calendar(null, {
          sameDay: '[Сегодня, ] D MMMM',
          lastDay: '[Вчера, ] D MMMM',
          lastWeek: 'D MMMM',
          sameElse: 'D MMMM'
        })), !message.isSystem && react_1.default.createElement("div", {
          ref: "message-".concat(message.id),
          className: classnames_1.default({
            'elixirchat-chat-messages__item': true,
            'elixirchat-chat-messages__item--by-me': message.sender.isCurrentClient,
            'elixirchat-chat-messages__item--by-operator': message.sender.isOperator,
            'elixirchat-chat-messages__item--highlighted': message.isHighlighted
          })
        }, !_this2.shouldHideMessageBalloon(message) && react_1.default.createElement("div", {
          className: "elixirchat-chat-messages__balloon",
          onDoubleClick: function onDoubleClick() {
            return onReplyMessage(message.id);
          }
        }, !message.sender.isCurrentClient && react_1.default.createElement("div", {
          className: "elixirchat-chat-messages__sender"
        }, message.sender.firstName, " ", message.sender.lastName), Boolean(message.responseToMessage) && react_1.default.createElement("div", {
          className: "elixirchat-chat-messages__reply-message",
          onClick: function onClick() {
            return _this2.scrollToMessage(message.responseToMessage);
          }
        }, react_1.default.createElement("i", {
          className: "elixirchat-chat-messages__reply-message-icon icon-reply-right"
        }), message.responseToMessage.sender.firstName, "\xA0", message.responseToMessage.sender.lastName, "\xA0", react_1.default.createElement("span", {
          title: message.responseToMessage.text
        }, message.responseToMessage.text.substr(0, 100))), message.text && react_1.default.createElement("div", {
          className: "elixirchat-chat-messages__text"
        }, react_1.default.createElement(react_autolink_text2_1.default, {
          linkProps: {
            target: '_blank',
            rel: 'noopener noreferrer'
          },
          text: message.text
        })), Boolean(message.files) && Boolean(message.files.length) && react_1.default.createElement("ul", {
          className: "elixirchat-chat-files"
        }, message.files.map(function (file) {
          var _classnames_1$default;

          return react_1.default.createElement("li", {
            key: file.id,
            className: "elixirchat-chat-files__item"
          }, react_1.default.createElement("a", {
            className: classnames_1.default((_classnames_1$default = {}, _defineProperty(_classnames_1$default, 'elixirchat-chat-files__preview', true), _defineProperty(_classnames_1$default, 'elixirchat-chat-files__preview-image', file.thumbnailUrl), _defineProperty(_classnames_1$default, 'elixirchat-chat-files__preview-submitting', message.isSubmitting), _classnames_1$default)),
            style: {
              backgroundImage: "url(".concat(file.thumbnailUrl, ")")
            },
            href: file.url,
            target: "_blank"
          }, !file.thumbnailUrl && !message.isSubmitting && react_1.default.createElement("i", {
            className: "icon-file"
          }), message.isSubmitting && react_1.default.createElement("i", {
            className: "elixirchat-chat-files__preview-spinner icon-spinner-xs"
          })), react_1.default.createElement("div", {
            className: "elixirchat-chat-files__text"
          }, react_1.default.createElement("a", {
            className: "elixirchat-chat-files__text-link",
            href: file.url,
            target: "_blank"
          }, file.name), react_1.default.createElement("br", null), react_1.default.createElement("span", {
            className: "elixirchat-chat-files__text-secondary"
          }, message.isSubmitting ? 'Загрузка...' : utilsWidget_1.getHumanReadableFileSize('ru-RU', file.bytesSize))));
        }))), Boolean(message.images) && Boolean(message.images.length) && react_1.default.createElement("ul", {
          className: "elixirchat-chat-images"
        }, message.images.map(function (image) {
          return react_1.default.createElement("li", {
            key: image.id,
            className: "elixirchat-chat-images__item"
          }, react_1.default.createElement("a", {
            className: "elixirchat-chat-images__link",
            href: image.url,
            target: "_blank",
            onClick: function onClick(e) {
              return _this2.onImagePreviewClick(e, Object.assign({}, image, {
                sender: message.sender
              }));
            }
          }, react_1.default.createElement("img", {
            className: "elixirchat-chat-images__img",
            width: utilsCommon_1._round(image.thumbnailWidth, 2),
            height: utilsCommon_1._round(image.thumbnailHeight),
            src: image.thumbnailUrl,
            alt: image.name,
            "data-error-message": "\u0424\u0430\u0439\u043B \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D",
            onError: function onError(e) {
              return e.target.parentNode.classList.add('elixirchat-chat-images__item-not-found');
            }
          })));
        })), react_1.default.createElement("div", {
          className: "elixirchat-chat-messages__bottom"
        }, message.isSubmissionError && react_1.default.createElement("span", {
          className: "elixirchat-chat-messages__submission-error",
          title: "\u041D\u0430\u0436\u043C\u0438\u0442\u0435, \u0447\u0442\u043E\u0431\u044B \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0435\u0449\u0435 \u0440\u0430\u0437",
          onClick: function onClick() {
            return onSubmitRetry(message);
          }
        }, "\u041D\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E"), !message.isSubmissionError && react_1.default.createElement(react_1.Fragment, null, !message.sender.isCurrentClient && dayjs_1.default(message.timestamp).format('H:mm'), !message.isSystem && react_1.default.createElement("span", {
          className: "elixirchat-chat-messages__reply-button",
          title: "\u0414\u043B\u044F \u043E\u0442\u0432\u0435\u0442\u0430 \u0442\u0430\u043A\u0436\u0435 \u043C\u043E\u0436\u043D\u043E \u0434\u0432\u0430\u0436\u0434\u044B \u043A\u043B\u0438\u043A\u043D\u0443\u0442\u044C \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435",
          onClick: function onClick() {
            return onReplyMessage(message.id);
          }
        }, "\u041E\u0442\u0432\u0435\u0442\u0438\u0442\u044C"), message.sender.isCurrentClient && dayjs_1.default(message.timestamp).format('H:mm')))), message.isSystem && react_1.default.createElement("div", {
          className: classnames_1.default({
            'elixirchat-chat-messages__item': true,
            'elixirchat-chat-messages__item--by-operator': true,
            'elixirchat-chat-messages__item--system': true
          })
        }, react_1.default.createElement("div", {
          className: "elixirchat-chat-messages__balloon"
        }, react_1.default.createElement("div", {
          className: "elixirchat-chat-messages__sender"
        }, message.sender.firstName, " ", message.sender.lastName, !message.sender.firstName && !message.sender.lastName && elixirChatWidget.widgetTitle), message.systemData.type === 'SCREENSHOT_REQUESTED' && react_1.default.createElement(react_1.Fragment, null, react_1.default.createElement("div", {
          className: "elixirchat-chat-messages__text"
        }, "\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043F\u0440\u0438\u0448\u043B\u0438\u0442\u0435 \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442 \u0432\u0430\u0448\u0435\u0433\u043E \u044D\u043A\u0440\u0430\u043D\u0430.", Boolean(screenshotFallback) && Boolean(screenshotFallback.pressKey) && react_1.default.createElement(react_1.Fragment, null, "\xA0\u0414\u043B\u044F \u044D\u0442\u043E\u0433\u043E \u043D\u0430\u0436\u043C\u0438\u0442\u0435 ", _this2.renderKeyShortcut(screenshotFallback.pressKey), screenshotFallback.pressKeySecondary && react_1.default.createElement(react_1.Fragment, null, "\xA0(", _this2.renderKeyShortcut(screenshotFallback.pressKeySecondary), ")"), ", \u0430 \u0437\u0430\u0442\u0435\u043C \u0432\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0432 \u0442\u0435\u043A\u0441\u0442\u043E\u0432\u043E\u0435 \u043F\u043E\u043B\u0435.")), !Boolean(screenshotFallback) && react_1.default.createElement("button", {
          className: "elixirchat-chat-messages__take-screenshot",
          onClick: _this2.onTakeScreenshotClick
        }, "\u0421\u0434\u0435\u043B\u0430\u0442\u044C \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442")), message.systemData.type === 'NOBODY_WORKING' && react_1.default.createElement(react_1.Fragment, null, react_1.default.createElement("div", {
          className: "elixirchat-chat-messages__text"
        }, "\u041A \u0441\u043E\u0436\u0430\u043B\u0435\u043D\u0438\u044E, \u0432\u0441\u0435 \u043E\u043F\u0435\u0440\u0430\u0442\u043E\u0440\u044B \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0438 \u0441\u0435\u0439\u0447\u0430\u0441 \u043E\u0444\u0444\u043B\u0430\u0439\u043D", message.systemData.whenWouldWork && ', но будут снова в сети ' + utilsWidget_1.inflectDayJSWeekDays('ru-RU', dayjs_1.default(message.systemData.whenWouldWork).calendar(null, {
          nextWeek: '[в] dddd [в] H:mm',
          nextDay: '[завтра в] H:mm',
          sameDay: '[сегодня в] H:mm',
          lastDay: 'D MMMM [в] H:mm',
          lastWeek: 'D MMMM [в] H:mm',
          sameElse: 'D MMMM [в] H:mm'
        })), ".")), message.systemData.type === 'NEW_CLIENT_PLACEHOLDER' && react_1.default.createElement(react_1.Fragment, null, react_1.default.createElement("div", {
          className: "elixirchat-chat-messages__text"
        }, "\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435! \u041A\u0430\u043A \u043C\u044B \u043C\u043E\u0436\u0435\u043C \u0432\u0430\u043C \u043F\u043E\u043C\u043E\u0447\u044C?"))), react_1.default.createElement("div", {
          className: "elixirchat-chat-messages__bottom"
        }, dayjs_1.default(message.timestamp).format('H:mm'))));
      }));
    }
  }]);

  return ChatMessages;
}(react_1.Component);

exports.ChatMessages = ChatMessages;
},{"react":"1n8/","classnames":"9qb7","dayjs":"3dZY","dayjs/plugin/calendar":"B5kD","dayjs/locale/ru":"7ZQM","react-autolink-text2":"7BCM","../../utilsCommon":"EjGt","../../utilsWidget":"4KO9","../../sdk/ScreenshotTaker":"CLsL"}],"SpjQ":[function(require,module,exports) {
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
},{}],"0Ldd":[function(require,module,exports) {
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
},{"@babel/runtime/helpers/esm/extends":"SpjQ","@babel/runtime/helpers/esm/objectWithoutPropertiesLoose":"3Vab","@babel/runtime/helpers/esm/inheritsLoose":"S11h","@babel/runtime/helpers/esm/assertThisInitialized":"bk0i","react":"1n8/","prop-types":"5D9O"}],"Bm76":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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

var ScreenshotTaker_1 = require("../../sdk/ScreenshotTaker");

var ChatTextarea =
/*#__PURE__*/
function (_react_1$Component) {
  _inherits(ChatTextarea, _react_1$Component);

  function ChatTextarea() {
    var _this;

    _classCallCheck(this, ChatTextarea);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ChatTextarea).apply(this, arguments));
    _this.container = react_1.default.createRef();
    _this.inputFile = react_1.default.createRef();
    _this.textarea = null;
    _this.state = {
      areTextareaActionsCollapsed: false,
      screenshotFallback: null
    };

    _this.focusTextarea = function () {
      setTimeout(function () {
        _this.textarea.focus();
      });
    };

    _this.onTextareaChange = function (e) {
      var _this$props = _this.props,
          elixirChatWidget = _this$props.elixirChatWidget,
          onChange = _this$props.onChange;
      var textareaText = e.target.value;
      elixirChatWidget.dispatchTypedText(textareaText);
      onChange({
        textareaText: textareaText
      });
    };

    _this.onTextareaKeyDown = function (e) {
      var _this$props2 = _this.props,
          onMessageSubmit = _this$props2.onMessageSubmit,
          onChange = _this$props2.onChange,
          textareaText = _this$props2.textareaText,
          textareaResponseToMessageId = _this$props2.textareaResponseToMessageId,
          textareaAttachments = _this$props2.textareaAttachments;

      if (e.keyCode === 13 && e.shiftKey === false) {
        // Press "Enter" without holding Shift
        e.preventDefault();

        if (textareaText.trim() || textareaAttachments.length) {
          onMessageSubmit({
            textareaText: textareaText,
            textareaResponseToMessageId: textareaResponseToMessageId,
            textareaAttachments: textareaAttachments
          });
          onChange({
            textareaText: '',
            textareaResponseToMessageId: null,
            textareaAttachments: []
          });
        }
      }
    };

    _this.onRemoveReplyTo = function () {
      _this.props.onChange({
        textareaResponseToMessageId: null
      });

      _this.updateVerticalHeight();
    };

    _this.addAttachments =
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(newAttachments) {
        var _this$props3, textareaAttachments, onChange, enrichedNewAttachments;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this$props3 = _this.props, textareaAttachments = _this$props3.textareaAttachments, onChange = _this$props3.onChange;
                enrichedNewAttachments = newAttachments.map(
                /*#__PURE__*/
                function () {
                  var _ref2 = _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee(attachment) {
                    var id, imageBlobUrl, dimensions;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            id = utilsCommon_1.randomDigitStringId(6);
                            imageBlobUrl = URL.createObjectURL(attachment.file);
                            _context.next = 4;
                            return utilsWidget_1.getImageDimensions(imageBlobUrl);

                          case 4:
                            dimensions = _context.sent;
                            return _context.abrupt("return", Object.assign({}, attachment, dimensions, {
                              id: id
                            }));

                          case 6:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x2) {
                    return _ref2.apply(this, arguments);
                  };
                }());
                _context2.t0 = onChange;
                _context2.t1 = [];
                _context2.t2 = _toConsumableArray(textareaAttachments);
                _context2.t3 = _toConsumableArray;
                _context2.next = 8;
                return Promise.all(enrichedNewAttachments);

              case 8:
                _context2.t4 = _context2.sent;
                _context2.t5 = (0, _context2.t3)(_context2.t4);
                _context2.t6 = _context2.t1.concat.call(_context2.t1, _context2.t2, _context2.t5);
                _context2.t7 = {
                  textareaAttachments: _context2.t6
                };
                (0, _context2.t0)(_context2.t7);

                _this.updateVerticalHeight();

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();

    _this.removeAttachment = function (attachmentId) {
      var _this$props4 = _this.props,
          textareaAttachments = _this$props4.textareaAttachments,
          onChange = _this$props4.onChange;
      onChange({
        textareaAttachments: textareaAttachments.filter(function (item) {
          return item.id !== attachmentId;
        })
      });

      _this.updateVerticalHeight();
    };

    _this.handleAttachmentPaste = function (e) {
      var clipboardItem = (e.clipboardData || e.originalEvent.clipboardData || window.clipboardData).items[0];

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
      var _this$props5 = _this.props,
          elixirChatWidget = _this$props5.elixirChatWidget,
          onChange = _this$props5.onChange,
          textareaText = _this$props5.textareaText;
      elixirChatWidget.toggleChatVisibility();
      elixirChatWidget.takeScreenshot().then(function (screenshot) {
        _this.addAttachments([{
          name: 'Скриншот экрана',
          file: screenshot.file,
          isScreenshot: true
        }]);

        var updatedText = textareaText.trim() ? textareaText : 'Вот скриншот моего экрана';
        onChange({
          textareaText: updatedText
        });
        elixirChatWidget.toggleChatVisibility();
      }).catch(function () {
        elixirChatWidget.toggleChatVisibility();
      });
    };

    _this.onInputFileChange = function (e) {
      var textareaAttachments = Array.from(e.target.files).map(function (file) {
        return {
          name: file.name,
          file: file
        };
      });

      _this.addAttachments(textareaAttachments);

      _this.inputFile.current.value = '';
    };

    _this.updateVerticalHeight =
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(options) {
        var onVerticalResize, containerElement, newHeight;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                onVerticalResize = _this.props.onVerticalResize;
                containerElement = _this.container.current;

                if (containerElement) {
                  _context3.next = 4;
                  break;
                }

                return _context3.abrupt("return");

              case 4:
                newHeight = containerElement.offsetHeight;
                _context3.next = 7;
                return _this.setState({
                  areTextareaActionsCollapsed: newHeight < 60
                });

              case 7:
                onVerticalResize(newHeight, options);

              case 8:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    }();

    return _this;
  }

  _createClass(ChatTextarea, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var elixirChatWidget = this.props.elixirChatWidget;
      elixirChatWidget.onIFrameContentMounted(function () {
        if (elixirChatWidget.visibleByDefault) {
          _this2.focusTextarea();
        }
      });
      elixirChatWidget.onToggleChatVisibility(function (isOpen) {
        if (isOpen) {
          _this2.updateVerticalHeight({
            forceScrollToBottom: true
          });

          _this2.focusTextarea();
        }
      });
      this.setState({
        screenshotFallback: ScreenshotTaker_1.getCompatibilityFallback()
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props6 = this.props,
          textareaAttachments = _this$props6.textareaAttachments,
          textareaResponseToMessageId = _this$props6.textareaResponseToMessageId,
          isImagePreviewOpen = _this$props6.isImagePreviewOpen;
      var didResponseToMessageIdChange = textareaResponseToMessageId !== prevProps.textareaResponseToMessageId;
      var didAttachmentsChange = textareaAttachments !== prevProps.textareaAttachments;
      var didImagePreviewClose = !isImagePreviewOpen && prevProps.isImagePreviewOpen;

      if (didResponseToMessageIdChange || didAttachmentsChange) {
        this.updateVerticalHeight();
        this.focusTextarea();
      }

      if (didImagePreviewClose) {
        this.focusTextarea();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$state = this.state,
          areTextareaActionsCollapsed = _this$state.areTextareaActionsCollapsed,
          screenshotFallback = _this$state.screenshotFallback;
      var _this$props7 = this.props,
          messages = _this$props7.messages,
          textareaText = _this$props7.textareaText,
          textareaResponseToMessageId = _this$props7.textareaResponseToMessageId,
          textareaAttachments = _this$props7.textareaAttachments,
          currentlyTypingUsers = _this$props7.currentlyTypingUsers;
      var responseToMessage = messages.filter(function (message) {
        return message.id === textareaResponseToMessageId;
      })[0];
      return react_1.default.createElement("div", {
        className: "elixirchat-chat-textarea",
        ref: this.container
      }, Boolean(currentlyTypingUsers.length) && react_1.default.createElement("div", {
        className: "elixirchat-chat-typing"
      }, react_1.default.createElement("i", {
        className: "elixirchat-chat-typing__icon icon-typing"
      }), utilsWidget_1.inflect('ru-RU', currentlyTypingUsers.length, ['человек пишет...', 'человека пишут...', 'человек пишут...'])), Boolean(responseToMessage) && react_1.default.createElement("div", {
        className: "elixirchat-chat-textarea__reply-to"
      }, react_1.default.createElement("span", {
        className: "elixirchat-chat-textarea__reply-to-text"
      }, react_1.default.createElement("i", {
        className: "elixirchat-chat-textarea__reply-to-icon icon-reply-right"
      }), react_1.default.createElement("span", {
        title: responseToMessage.text
      }, responseToMessage.text && responseToMessage.text.substr(0, 100), !responseToMessage.text && responseToMessage.sender.firstName + ' ' + responseToMessage.sender.lastName)), react_1.default.createElement("span", {
        className: "elixirchat-chat-textarea__reply-to-remove icon-close-thick",
        onClick: this.onRemoveReplyTo
      })), react_1.default.createElement("div", {
        className: classnames_1.default({
          'elixirchat-chat-textarea__actions': true,
          'elixirchat-chat-textarea__actions--collapsed': areTextareaActionsCollapsed
        })
      }, !Boolean(screenshotFallback) && react_1.default.createElement("button", {
        className: "elixirchat-chat-textarea__actions-screenshot",
        onClick: this.onScreenShotClick,
        title: "\u0421\u0434\u0435\u043B\u0430\u0442\u044C \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442"
      }, react_1.default.createElement("i", {
        className: "icon-screenshot"
      })), react_1.default.createElement("span", {
        className: "elixirchat-chat-textarea__actions-attach",
        title: "\u041F\u0440\u0438\u043A\u0440\u0435\u043F\u0438\u0442\u044C \u0444\u0430\u0439\u043B"
      }, react_1.default.createElement("label", {
        className: "elixirchat-chat-textarea__actions-attach-label",
        htmlFor: "DefaultWidget-file-upload"
      }, react_1.default.createElement("i", {
        className: "icon-file"
      })), react_1.default.createElement("input", {
        className: "elixirchat-chat-textarea__actions-attach-input",
        id: "DefaultWidget-file-upload",
        type: "file",
        ref: this.inputFile,
        multiple: true,
        onChange: this.onInputFileChange
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
        value: textareaText
      }), Boolean(textareaAttachments.length) && react_1.default.createElement("ul", {
        className: "elixirchat-chat-attachment-list"
      }, textareaAttachments.map(function (attachment) {
        return react_1.default.createElement("li", {
          key: attachment.id,
          className: "elixirchat-chat-attachment-item"
        }, react_1.default.createElement("i", {
          className: classnames_1.default({
            'elixirchat-chat-attachment-icon': true,
            'icon-file': !attachment.isScreenshot,
            'icon-screenshot': attachment.isScreenshot
          })
        }), react_1.default.createElement("span", {
          className: "elixirchat-chat-attachment-filename"
        }, attachment.name), react_1.default.createElement("i", {
          className: "elixirchat-chat-attachment-remove icon-close-thick",
          tabIndex: 0,
          onClick: function onClick() {
            return _this3.removeAttachment(attachment.id);
          }
        }));
      })));
    }
  }]);

  return ChatTextarea;
}(react_1.Component);

exports.ChatTextarea = ChatTextarea;
},{"react":"1n8/","classnames":"9qb7","react-textarea-autosize":"0Ldd","../../utilsCommon":"EjGt","../../utilsWidget":"4KO9","../../sdk/ScreenshotTaker":"CLsL"}],"8tJY":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = __importStar(require("react"));

var utilsCommon_1 = require("../../utilsCommon");

var utilsWidget_1 = require("../../utilsWidget");

var ChatMessages_1 = require("./ChatMessages");

var ChatTextarea_1 = require("./ChatTextarea");

var Chat =
/*#__PURE__*/
function (_react_1$Component) {
  _inherits(Chat, _react_1$Component);

  function Chat() {
    var _this;

    _classCallCheck(this, Chat);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Chat).apply(this, arguments));
    _this.container = react_1.default.createRef();
    _this.scrollBlock = react_1.default.createRef();
    _this.messageChunkSize = 100; // TODO: reduce to 20 when unread message count implemented in server-side

    _this.state = {
      messages: [],
      highlightedMessageIds: [],
      room: {},
      client: {},
      currentlyTypingUsers: [],
      textareaText: '',
      textareaResponseToMessageId: null,
      textareaAttachments: [],
      isLoading: true,
      isLoadingError: false,
      isLoadingPreviousMessages: false,
      widgetTitle: '',
      areOperatorsOnline: false
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

    _this.onTextareaVerticalResize = function (newTextareaHeight) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var hasUserScroll = _this.hasUserScroll();

      _this.scrollBlock.current.style.bottom = newTextareaHeight + 'px';

      if (!hasUserScroll || options.forceScrollToBottom) {
        _this.scrollToBottom();
      }
    };

    _this.onMessageSubmit =
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var elixirChatWidget, _this$state2, textareaText, textareaResponseToMessageId, textareaAttachments, messages, hasUserScroll, temporaryMessage;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              elixirChatWidget = _this.props.elixirChatWidget;
              _this$state2 = _this.state, textareaText = _this$state2.textareaText, textareaResponseToMessageId = _this$state2.textareaResponseToMessageId, textareaAttachments = _this$state2.textareaAttachments, messages = _this$state2.messages;

              if (!(textareaText.trim() || textareaAttachments.length)) {
                _context.next = 9;
                break;
              }

              hasUserScroll = _this.hasUserScroll();
              temporaryMessage = _this.generateTemporaryMessage({
                textareaText: textareaText,
                textareaResponseToMessageId: textareaResponseToMessageId,
                textareaAttachments: textareaAttachments
              });
              _context.next = 7;
              return _this.setState({
                messages: [].concat(_toConsumableArray(messages), [temporaryMessage])
              });

            case 7:
              if (!hasUserScroll) {
                _this.scrollToBottom();
              }

              elixirChatWidget.sendMessage({
                text: textareaText,
                responseToMessageId: textareaResponseToMessageId,
                attachments: textareaAttachments.map(function (attachment) {
                  return attachment.file;
                }),
                tempId: temporaryMessage.tempId
              }).catch(function () {
                _this.changeMessageById(temporaryMessage.id, {
                  isSubmitting: false,
                  isSubmissionError: true
                });

                elixirChatWidget.dispatchTypedText(false);
              });

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    _this.changeMessageById = function (messageId, data) {
      var messages = _this.state.messages;
      var changedMessages = messages.map(function (message) {
        if (message.id === messageId) {
          var changedMessage = Object.assign({}, message);

          for (var key in data) {
            changedMessage[key] = data[key];
          }

          return changedMessage;
        } else {
          return Object.assign({}, message);
        }
      });

      _this.setState({
        messages: changedMessages
      });
    };

    _this.replaceTemporaryMessageWithActualOne = function (newMessage) {
      var messages = _this.state.messages;

      var temporaryMessage = utilsCommon_1._last(messages.filter(function (message) {
        return message.tempId === newMessage.tempId;
      }));

      if (temporaryMessage) {
        _this.changeMessageById(temporaryMessage.id, newMessage);
      } else {
        _this.setState({
          messages: [].concat(_toConsumableArray(_this.state.messages), [newMessage])
        });
      }
    };

    _this.generateTemporaryMessage = function (_ref2) {
      var textareaText = _ref2.textareaText,
          textareaResponseToMessageId = _ref2.textareaResponseToMessageId,
          textareaAttachments = _ref2.textareaAttachments;
      var messages = _this.state.messages;
      var responseToMessage = messages.filter(function (message) {
        return message.id === textareaResponseToMessageId;
      })[0];
      var attachments = textareaAttachments.map(function (attachment) {
        var id = utilsCommon_1.randomDigitStringId(6);
        var originalFileObject = attachment.file;
        var contentType = originalFileObject.type;
        var url = URL.createObjectURL(originalFileObject);
        var thumbnails = [];

        if (utilsWidget_1.isWebImage(contentType) && attachment.width && attachment.height) {
          thumbnails = [{
            id: id,
            url: url
          }];
        }

        return {
          id: id,
          url: url,
          originalFileObject: originalFileObject,
          contentType: contentType,
          thumbnails: thumbnails,
          name: attachment.name,
          width: attachment.width,
          height: attachment.height,
          bytesSize: originalFileObject.size
        };
      });
      return {
        id: utilsCommon_1.randomDigitStringId(6),
        tempId: utilsCommon_1.randomDigitStringId(6),
        text: textareaText.trim() || '',
        timestamp: new Date().toISOString(),
        sender: {
          isOperator: false,
          isCurrentClient: true
        },
        responseToMessage: responseToMessage || null,
        attachments: attachments,
        isSubmitting: true
      };
    };

    _this.generateNewClientPlaceholderMessage = function () {
      return {
        id: utilsCommon_1.randomDigitStringId(6),
        timestamp: new Date().toISOString(),
        isSystem: true,
        sender: {},
        attachments: [],
        systemData: {
          type: 'NEW_CLIENT_PLACEHOLDER'
        }
      };
    };

    _this.getRepliesToCurrentClient = function () {
      var elixirChatWidget = _this.props.elixirChatWidget;
      var messages = _this.state.messages;

      if (elixirChatWidget.isPrivate) {
        return messages.filter(function (message) {
          var isSentByCurrentClient = message.sender.id !== elixirChatWidget.elixirChatClientId;
          var isNewClientPlaceholder = utilsCommon_1._get(message, 'systemData.type') === 'NEW_CLIENT_PLACEHOLDER';
          return !isSentByCurrentClient && !isNewClientPlaceholder;
        });
      } else {
        return messages.filter(function (message) {
          var responseToMessage = message.responseToMessage,
              sender = message.sender;
          var isSentByCurrentClient = sender.id !== elixirChatWidget.elixirChatClientId;
          var isResponseToCurrentClient = responseToMessage && responseToMessage.sender.id === elixirChatWidget.elixirChatClientId;
          return isResponseToCurrentClient && !isSentByCurrentClient;
        });
      }
    };

    _this.updateUnseenRepliesCount = function () {
      var elixirChatWidget = _this.props.elixirChatWidget;

      var allRepliesToCurrentClient = _this.getRepliesToCurrentClient();

      var latestUnseenReplyId = localStorage.getItem('elixirchat-latest-unseen-reply');
      var latestUnseenReplyIndex = allRepliesToCurrentClient.map(function (message) {
        return message.id;
      }).indexOf(latestUnseenReplyId);
      var unseenRepliesToCurrentClient = latestUnseenReplyIndex === -1 ? allRepliesToCurrentClient : allRepliesToCurrentClient.slice(latestUnseenReplyIndex + 1);
      var highlightedMessageIds = unseenRepliesToCurrentClient.map(function (message) {
        return message.id;
      });

      _this.setState({
        highlightedMessageIds: highlightedMessageIds
      });

      elixirChatWidget.setUnreadCount(unseenRepliesToCurrentClient.length);
    };

    _this.resetUnseenRepliesCount = function () {
      var elixirChatWidget = _this.props.elixirChatWidget;

      var allRepliesToCurrentClient = _this.getRepliesToCurrentClient();

      var latestReplyToCurrentClient = utilsCommon_1._last(allRepliesToCurrentClient);

      if (latestReplyToCurrentClient) {
        localStorage.setItem('elixirchat-latest-unseen-reply', latestReplyToCurrentClient.id);
      }

      elixirChatWidget.setUnreadCount(0);

      _this.setState({
        highlightedMessageIds: []
      });
    };

    _this.onTextareaChange = function (stateChange) {
      _this.setState(stateChange);
    };

    _this.onScreenshotRequestFulfilled =
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(screenshot) {
        var _this$state3, textareaText, textareaAttachments, imageBlobUrl, dimensions, newAttachment, updatedText;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this$state3 = _this.state, textareaText = _this$state3.textareaText, textareaAttachments = _this$state3.textareaAttachments;
                imageBlobUrl = URL.createObjectURL(screenshot.file);
                _context2.next = 4;
                return utilsWidget_1.getImageDimensions(imageBlobUrl);

              case 4:
                dimensions = _context2.sent;
                newAttachment = Object.assign({
                  id: utilsCommon_1.randomDigitStringId(6),
                  name: 'Скриншот экрана',
                  file: screenshot.file,
                  isScreenshot: true
                }, dimensions);
                updatedText = textareaText.trim() ? textareaText : 'Вот скриншот моего экрана';

                _this.setState({
                  textareaText: updatedText,
                  textareaAttachments: [].concat(_toConsumableArray(textareaAttachments), [newAttachment])
                });

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x) {
        return _ref3.apply(this, arguments);
      };
    }();

    _this.onReplyMessage = function (messageId) {
      _this.setState({
        textareaResponseToMessageId: messageId
      });
    };

    _this.onSubmitRetry =
    /*#__PURE__*/
    function () {
      var _ref4 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(message) {
        var elixirChatWidget;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                elixirChatWidget = _this.props.elixirChatWidget;

                _this.changeMessageById(message.id, {
                  isSubmitting: true,
                  isSubmissionError: false
                });

                elixirChatWidget.sendMessage({
                  text: message.text,
                  attachments: message.attachments.map(function (attachment) {
                    return attachment.originalFileObject;
                  }).filter(function (file) {
                    return file;
                  }),
                  responseToMessageId: utilsCommon_1._get(message, 'responseToMessage.id'),
                  tempId: message.tempId
                }).catch(function () {
                  _this.changeMessageById(message.id, {
                    isSubmitting: false,
                    isSubmissionError: true
                  });
                });

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x2) {
        return _ref4.apply(this, arguments);
      };
    }();

    return _this;
  }

  _createClass(Chat, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var elixirChatWidget = this.props.elixirChatWidget;
      elixirChatWidget.onIFrameReady(function () {
        elixirChatWidget.widgetIFrameDocument.body.addEventListener('click', utilsWidget_1.unlockNotificationSoundAutoplay);
      });
      elixirChatWidget.onConnectSuccess(function () {
        _this2.setState({
          widgetTitle: elixirChatWidget.widgetTitle
        });

        elixirChatWidget.fetchMessageHistory(_this2.messageChunkSize).then(
        /*#__PURE__*/
        function () {
          var _ref5 = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee4(messages) {
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    if (messages.length < _this2.messageChunkSize) {
                      messages = [_this2.generateNewClientPlaceholderMessage()].concat(_toConsumableArray(messages));
                    }

                    _context4.next = 3;
                    return _this2.setState({
                      messages: messages,
                      isLoading: false
                    });

                  case 3:
                    _this2.scrollToBottom();

                    _this2.updateUnseenRepliesCount();

                    elixirChatWidget.setIFrameContentMounted();

                  case 6:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _callee4);
          }));

          return function (_x3) {
            return _ref5.apply(this, arguments);
          };
        }()).catch(
        /*#__PURE__*/
        function () {
          var _ref6 = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee5(e) {
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.next = 2;
                    return _this2.setState({
                      isLoading: false,
                      isLoadingError: true
                    });

                  case 2:
                    elixirChatWidget.setIFrameContentMounted();

                  case 3:
                  case "end":
                    return _context5.stop();
                }
              }
            }, _callee5);
          }));

          return function (_x4) {
            return _ref6.apply(this, arguments);
          };
        }());
      });
      elixirChatWidget.onConnectError(
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return _this2.setState({
                  isLoading: false,
                  isLoadingError: true
                });

              case 2:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      })));
      elixirChatWidget.onMessage(function (message) {
        var hasUserScroll = _this2.hasUserScroll();

        var messages = [].concat(_toConsumableArray(_this2.state.messages), [message]);
        var isMessageSentByCurrentClient = message.sender.isCurrentClient;

        if (isMessageSentByCurrentClient) {
          _this2.replaceTemporaryMessageWithActualOne(message);
        } else {
          _this2.setState({
            messages: messages
          });

          utilsWidget_1.playNotificationSound();
        }

        if (!hasUserScroll) {
          _this2.scrollToBottom();
        }

        _this2.updateUnseenRepliesCount();
      });
      elixirChatWidget.onTyping(function (currentlyTypingUsers) {
        _this2.setState({
          currentlyTypingUsers: currentlyTypingUsers
        });
      });
      elixirChatWidget.onOperatorOnlineStatusChange(function (areOperatorsOnline) {
        console.log('%c__ IS ONLINE CHANGED', 'color: green', isOnline); // TODO: remove

        _this2.setState({
          areOperatorsOnline: areOperatorsOnline
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          elixirChatWidget = _this$props.elixirChatWidget,
          onImagePreviewOpen = _this$props.onImagePreviewOpen,
          isImagePreviewOpen = _this$props.isImagePreviewOpen;
      var _this$state4 = this.state,
          messages = _this$state4.messages,
          highlightedMessageIds = _this$state4.highlightedMessageIds,
          textareaText = _this$state4.textareaText,
          textareaResponseToMessageId = _this$state4.textareaResponseToMessageId,
          textareaAttachments = _this$state4.textareaAttachments,
          currentlyTypingUsers = _this$state4.currentlyTypingUsers,
          isLoading = _this$state4.isLoading,
          isLoadingError = _this$state4.isLoadingError,
          widgetTitle = _this$state4.widgetTitle,
          areOperatorsOnline = _this$state4.areOperatorsOnline;
      return react_1.default.createElement("div", {
        className: "elixirchat-chat-container",
        ref: this.container,
        onClick: this.resetUnseenRepliesCount
      }, react_1.default.createElement("h2", {
        className: "elixirchat-chat-header"
      }, widgetTitle && react_1.default.createElement(react_1.Fragment, null, areOperatorsOnline && react_1.default.createElement("i", {
        className: "elixirchat-chat-header__indicator"
      }), widgetTitle), react_1.default.createElement("button", {
        className: "elixirchat-chat-header__close",
        title: "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u0447\u0430\u0442",
        onClick: elixirChatWidget.toggleChatVisibility
      }, react_1.default.createElement("i", {
        className: "icon-close-thin"
      }))), isLoading && react_1.default.createElement("i", {
        className: "elixirchat-chat-spinner"
      }), isLoadingError && react_1.default.createElement("div", {
        className: "elixirchat-chat-fatal-error"
      }, "\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438. ", react_1.default.createElement("br", null), "\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043F\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443 ", react_1.default.createElement("span", {
        className: "elixirchat-chat-fatal-error--nowrap"
      }, "\u0438\u043B\u0438 \u0441\u0432\u044F\u0436\u0438\u0442\u0435\u0441\u044C \u0441"), " \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u043E\u043C."), !isLoading && !isLoadingError && react_1.default.createElement(react_1.Fragment, null, react_1.default.createElement("div", {
        className: "elixirchat-chat-scroll",
        ref: this.scrollBlock,
        onScroll: this.onMessagesScroll
      }, react_1.default.createElement(ChatMessages_1.ChatMessages, {
        onLoadPreviousMessages: this.loadPreviousMessages,
        onScreenshotRequestFulfilled: this.onScreenshotRequestFulfilled,
        onImagePreviewOpen: onImagePreviewOpen,
        onReplyMessage: this.onReplyMessage,
        onSubmitRetry: this.onSubmitRetry,
        messages: messages,
        highlightedMessageIds: highlightedMessageIds,
        elixirChatWidget: elixirChatWidget
      })), react_1.default.createElement(ChatTextarea_1.ChatTextarea, {
        onMessageSubmit: this.onMessageSubmit,
        onChange: this.onTextareaChange,
        messages: messages,
        textareaText: textareaText,
        isImagePreviewOpen: isImagePreviewOpen,
        textareaResponseToMessageId: textareaResponseToMessageId,
        textareaAttachments: textareaAttachments,
        currentlyTypingUsers: currentlyTypingUsers,
        onVerticalResize: this.onTextareaVerticalResize,
        elixirChatWidget: elixirChatWidget
      })));
    }
  }]);

  return Chat;
}(react_1.Component);

exports.Chat = Chat;
},{"react":"1n8/","../../utilsCommon":"EjGt","../../utilsWidget":"4KO9","./ChatMessages":"17A3","./ChatTextarea":"Bm76"}],"0q3/":[function(require,module,exports) {
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

Object.defineProperty(exports, "__esModule", {
  value: true
});

var react_1 = __importStar(require("react"));

var react_dom_1 = require("react-dom");

var IFrameWrapper =
/*#__PURE__*/
function (_react_1$Component) {
  _inherits(IFrameWrapper, _react_1$Component);

  function IFrameWrapper() {
    var _this;

    _classCallCheck(this, IFrameWrapper);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(IFrameWrapper).apply(this, arguments));
    _this.iframeContentContainer = null;
    _this.iframe = react_1.default.createRef();
    _this.state = {
      isIframeReady: false
    };

    _this.onIframeReady = function () {
      return new Promise(function (resolve) {
        var iframeElement = _this.iframe.current;
        var iframeDocument = iframeElement.contentWindow.document;

        if (iframeDocument.readyState === 'complete') {
          resolve(iframeDocument);
        } else {
          iframeElement.addEventListener('load', function (e) {
            iframeElement = e.target;
            iframeDocument = e.target.contentWindow.document;
            resolve(iframeDocument);
          });
        }
      });
    };

    return _this;
  }

  _createClass(IFrameWrapper, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var elixirChatWidget = this.props.elixirChatWidget;
      this.onIframeReady().then(function (iframeDocument) {
        _this2.iframeContentContainer = iframeDocument.createElement('main');
        iframeDocument.body.appendChild(_this2.iframeContentContainer);

        _this2.setState({
          isIframeReady: true
        });

        elixirChatWidget.setIFrameReady(iframeDocument);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className;
      var isIframeReady = this.state.isIframeReady;
      return react_1.default.createElement("iframe", {
        className: className,
        ref: this.iframe
      }, isIframeReady && react_dom_1.createPortal(react_1.default.Children.only(children), this.iframeContentContainer));
    }
  }]);

  return IFrameWrapper;
}(react_1.Component);

exports.IFrameWrapper = IFrameWrapper;
},{"react":"1n8/","react-dom":"NKHc"}],"3Xfh":[function(require,module,exports) {
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

var ImagePreview =
/*#__PURE__*/
function (_react_1$Component) {
  _inherits(ImagePreview, _react_1$Component);

  function ImagePreview() {
    var _this;

    _classCallCheck(this, ImagePreview);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ImagePreview).apply(this, arguments));
    _this.state = {
      currentPreview: {},
      displaySize: {
        width: 0,
        height: 0
      },
      marginTop: 0,
      isVisible: false,
      isLoading: false
    };
    _this.previewHorizontalPaddings = 100;
    _this.previewVerticalPaddings = 120;

    _this.setPreview = function (preview) {
      var width = preview.width,
          height = preview.height,
          url = preview.url;

      if (preview && url && width && height) {
        var displaySize = _this.calculateImagePreviewSize(width, height);

        var marginTop = _this.calculateImagePreviewTopMargin(displaySize.height);

        _this.setState({
          currentPreview: preview,
          displaySize: displaySize,
          marginTop: marginTop,
          isVisible: true,
          isLoading: true
        });
      } else {
        _this.setState({
          currentPreview: {},
          displaySize: {
            width: 0,
            height: 0
          },
          marginTop: 0,
          isVisible: false,
          isLoading: false
        });
      }
    };

    _this.calculateImagePreviewSize = function (imageNativeWidth, imageNativeHeight) {
      var maxImageWidth = window.innerWidth - _this.previewHorizontalPaddings; // window viewport width minus horizontal paddings

      var width = imageNativeWidth;
      var height = imageNativeHeight;

      if (imageNativeWidth > maxImageWidth) {
        var ratio = maxImageWidth / imageNativeWidth;
        width = maxImageWidth;
        height = Math.round(imageNativeHeight * ratio);
      }

      return {
        width: width,
        height: height
      };
    };

    _this.calculateImagePreviewTopMargin = function (imageDisplayHeight) {
      var availableVerticalSpace = window.innerHeight - _this.previewVerticalPaddings;

      if (availableVerticalSpace < imageDisplayHeight) {
        return 0;
      } else {
        return (availableVerticalSpace - imageDisplayHeight) / 2;
      }
    };

    _this.onIframeBodyKeyup = function (e) {
      if (e.which === 27
      /* Esc */
      ) {
          _this.onClose();
        } else if (e.which === 37
      /* Arrow left */
      ) {
          _this.onArrowNavigation(-1);
        } else if (e.which === 39
      /* Arrow right */
      ) {
          _this.onArrowNavigation(1);
        }
    };

    _this.onArrowNavigation = function (delta) {
      var gallery = _this.props.gallery;
      var _this$state = _this.state,
          isVisible = _this$state.isVisible,
          currentPreview = _this$state.currentPreview;

      if (!isVisible) {
        return false;
      }

      var currentPreviewIndex = gallery.map(function (image) {
        return image.id;
      }).indexOf(currentPreview.id);
      var nextPreviewIndex = currentPreviewIndex + delta;

      if (nextPreviewIndex < 0) {
        nextPreviewIndex = gallery.length - 1;
      } else if (nextPreviewIndex >= gallery.length) {
        nextPreviewIndex = 0;
      }

      _this.setPreview(gallery[nextPreviewIndex]);
    };

    _this.onClose = function () {
      var onClose = _this.props.onClose;

      _this.setState({
        isVisible: false
      });

      onClose();
    };

    _this.onImageLoad = function () {
      _this.setState({
        isLoading: false
      });
    };

    return _this;
  }

  _createClass(ImagePreview, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var elixirChatWidget = this.props.elixirChatWidget;
      elixirChatWidget.onIFrameReady(function () {
        elixirChatWidget.widgetIFrameDocument.body.addEventListener('keyup', _this2.onIframeBodyKeyup);
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var elixirChatWidget = this.props.elixirChatWidget;
      elixirChatWidget.widgetIFrameDocument.body.removeEventListener('keyup', this.onIframeBodyKeyup);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var preview = this.props.preview;

      if (prevProps.preview.url !== preview.url) {
        this.setPreview(preview);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state2 = this.state,
          currentPreview = _this$state2.currentPreview,
          displaySize = _this$state2.displaySize,
          marginTop = _this$state2.marginTop,
          isLoading = _this$state2.isLoading,
          isVisible = _this$state2.isVisible;
      return react_1.default.createElement("div", {
        className: classnames_1.default({
          'elixirchat-widget-image-preview': true,
          'elixirchat-widget-image-preview--visible': isVisible
        }),
        onClick: this.onClose
      }, react_1.default.createElement("div", {
        className: "elixirchat-widget-image-preview__inner"
      }, currentPreview.url && react_1.default.createElement("img", {
        className: classnames_1.default({
          'elixirchat-widget-image-preview__img': true,
          'elixirchat-widget-image-preview__img--loading': isLoading
        }),
        onLoad: this.onImageLoad,
        style: {
          marginTop: marginTop
        },
        width: displaySize.width,
        height: displaySize.height,
        src: currentPreview.url,
        alt: currentPreview.name
      })));
    }
  }]);

  return ImagePreview;
}(react_1.Component);

exports.ImagePreview = ImagePreview;
},{"react":"1n8/","classnames":"9qb7"}],"xqZa":[function(require,module,exports) {
"use strict";
/**
 * SCSS files from widget/DefaultWidget/styles are transpiled into dist/styles
 *
 * Styles are imported as strings via fs.readFileSync in order to include
 * them into a single bundle JS file, not simply copy to /dist folder
 *
 * Note that Parcel bundler utilizes a very limited custom implementation of fs.readFileSync()
 * @see https://en.parceljs.org/javascript.html#javascript
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var fs = require('fs');

exports.default = {
  icons: "/* GLOBAL */\n/* CUSTOM */\n[class^=\"icon-\"], [class*=\" icon-\"] {\n  font-family: \"elixirchat-icons\" !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: 1;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n\n.icon-arrow-down:before {\n  content: \"\\e900\"; }\n\n.icon-close-thick:before {\n  content: \"\\e901\"; }\n\n.icon-close-thin:before {\n  content: \"\\e902\"; }\n\n.icon-file:before {\n  content: \"\\e903\"; }\n\n.icon-logo:before {\n  content: \"\\e904\"; }\n\n.icon-reply-left:before {\n  content: \"\\e905\"; }\n\n.icon-reply-right:before {\n  content: \"\\e906\"; }\n\n.icon-screenshot:before {\n  content: \"\\e907\"; }\n\n.icon-spinner-lg:before {\n  content: \"\\e908\"; }\n\n.icon-spinner-xs:before {\n  content: \"\\e909\"; }\n\n.icon-typing:before {\n  content: \"\\e90a\"; }\n",
  Widget: "/* GLOBAL */\n/* CUSTOM */\n/* GLOBAL */\n/* CUSTOM */\n@keyframes spinner {\n  to {\n    transform: rotate(360deg); } }\n\n.elixirchat-widget-button {\n  font-family: \"elixirchat-icons\";\n  position: fixed;\n  bottom: 30px;\n  right: 30px;\n  width: 60px;\n  height: 60px;\n  border: 0;\n  border-radius: 100%;\n  cursor: pointer;\n  background-color: #FF0066;\n  box-shadow: 0 0 25px rgba(0, 0, 0, 0.15);\n  outline: none;\n  z-index: 999999;\n  transition: background-color 200ms;\n  color: #ffffff;\n  /* TODO: replace w/ <i class\"icon...\"> element when button is rewritten as a React component */\n  /* TODO: replace w/ <i class\"icon...\"> element when button is rewritten as a React component */ }\n  .elixirchat-widget-button:hover {\n    background-color: #e0005a; }\n  .elixirchat-widget-button:after, .elixirchat-widget-button:before {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    top: 0;\n    left: 0;\n    transition: opacity 300ms;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    box-sizing: border-box; }\n  .elixirchat-widget-button:after {\n    content: \"\\e904\";\n    /* .icon-logo */\n    font-size: 28px;\n    padding-top: 5px;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale; }\n  .elixirchat-widget-button:before {\n    content: \"\\e902\";\n    /* .icon-close-thin */\n    font-size: 21px;\n    opacity: 0; }\n  .elixirchat-widget-button--visible:after {\n    opacity: 0; }\n  .elixirchat-widget-button--visible:before {\n    opacity: 1; }\n  @media (min-width: 0px) and (max-width: 480px) {\n    .elixirchat-widget-button {\n      right: 20px;\n      bottom: 20px; } }\n\n.elixirchat-widget-button-counter {\n  font: 13px/20px Graphik, \"Helvetica Neue\", sans-serif;\n  display: none;\n  position: absolute;\n  padding: 1px 5px 0 5px;\n  min-width: 10px;\n  height: 20px;\n  text-align: center;\n  border-radius: 20px;\n  background: #FF0066;\n  color: #FFFFFF;\n  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.2);\n  z-index: 2;\n  right: 0;\n  top: 0; }\n  .elixirchat-widget-button-counter--has-unread {\n    display: block; }\n\n.elixirchat-widget-iframe {\n  border-radius: 8px;\n  background: #ffffff;\n  position: fixed;\n  max-height: 600px;\n  height: calc(100vh - 130px);\n  width: 380px;\n  bottom: 100px;\n  right: 30px;\n  border: 0;\n  box-shadow: 0 0 60px rgba(0, 0, 0, 0.15);\n  z-index: 999998;\n  transition: all 200ms;\n  opacity: 1;\n  transform: none;\n  transform-origin: bottom;\n  display: none; }\n  .elixirchat-widget-iframe--opening {\n    opacity: 0;\n    transform: translateY(15px) scale(0.9); }\n  .elixirchat-widget-iframe--visible {\n    display: block; }\n  @media (min-width: 0px) and (max-width: 480px) {\n    .elixirchat-widget-iframe {\n      bottom: 0;\n      right: 0;\n      left: 0;\n      top: 0;\n      width: 100%;\n      height: 100%;\n      max-height: 100%;\n      z-index: 9999999;\n      border-radius: 0; } }\n\n.elixirchat-widget-image-preview {\n  position: fixed;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  top: 0;\n  z-index: 9999999;\n  background: rgba(0, 0, 0, 0.8);\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding: 40px 50px 0 50px;\n  text-align: center;\n  display: none; }\n  .elixirchat-widget-image-preview--visible {\n    display: block; }\n\n.elixirchat-widget-image-preview__inner {\n  display: inline-block; }\n\n.elixirchat-widget-image-preview__img {\n  position: relative;\n  z-index: 2;\n  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);\n  margin-bottom: 40px; }\n  .elixirchat-widget-image-preview__img--loading {\n    display: none; }\n",
  Chat: "/* GLOBAL */\n/* CUSTOM */\n/* GLOBAL */\n/* CUSTOM */\n@keyframes spinner {\n  to {\n    transform: rotate(360deg); } }\n\nbody {\n  margin: 0;\n  padding: 0; }\n\nbody,\ninput,\nbutton,\ntextarea {\n  font: 14px/18px Graphik, \"Helvetica Neue\", sans-serif;\n  outline: none;\n  color: #151319;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n\n.elixirchat-chat-container {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  left: 0; }\n\n.elixirchat-chat-header {\n  margin: 0;\n  font-size: 16px;\n  height: 53px;\n  box-sizing: border-box;\n  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.15);\n  padding: 19px 55px 0 30px;\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  z-index: 2;\n  border-radius: 8px 8px 0 0;\n  background: #FFFFFF;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis; }\n\n.elixirchat-chat-header__indicator {\n  display: inline-block;\n  width: 10px;\n  height: 10px;\n  border-radius: 100%;\n  background: #50C900;\n  vertical-align: middle;\n  margin-right: 8px;\n  margin-top: -2px; }\n\n.elixirchat-chat-header__close {\n  width: 53px;\n  height: 53px;\n  border: 0;\n  opacity: .25;\n  position: absolute;\n  top: 1px;\n  right: 0;\n  transition: opacity 200ms;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 15px;\n  background: none;\n  cursor: pointer; }\n  .elixirchat-chat-header__close:hover {\n    opacity: .4; }\n\n.elixirchat-chat-scroll {\n  position: fixed;\n  top: 53px;\n  left: 0;\n  right: 0;\n  bottom: 110px;\n  overflow-x: hidden;\n  overflow-y: auto;\n  padding: 20px 30px; }\n\n.elixirchat-chat-spinner {\n  position: fixed;\n  top: 50%;\n  margin: -45px 0 0 -45px;\n  left: 50%;\n  display: block;\n  width: 90px;\n  height: 90px;\n  border-radius: 100%;\n  border: 1px solid #E2E2E2;\n  animation: spinner 1s linear infinite; }\n  .elixirchat-chat-spinner:after {\n    content: '';\n    background: #FFFFFF;\n    width: 5px;\n    height: 30px;\n    position: absolute;\n    top: 50%;\n    margin: -15px 0 0 0;\n    left: -2px; }\n\n.elixirchat-chat-fatal-error {\n  position: fixed;\n  top: 50%;\n  transform: translateY(-50%);\n  left: 0;\n  right: 0;\n  display: block;\n  padding: 0 50px;\n  color: #999999;\n  line-height: 22px;\n  text-align: center; }\n  .elixirchat-chat-fatal-error--nowrap {\n    white-space: nowrap; }\n",
  ChatMessages: "/* GLOBAL */\n/* CUSTOM */\n/* GLOBAL */\n/* CUSTOM */\n@keyframes spinner {\n  to {\n    transform: rotate(360deg); } }\n\n.elixirchat-chat-messages {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end; }\n  .elixirchat-chat-messages a {\n    text-decoration: none;\n    outline: none; }\n\n.elixirchat-chat-messages__date-title {\n  text-transform: uppercase;\n  font-size: 12px;\n  font-weight: bold;\n  border-bottom: 1px solid #151319;\n  line-height: 21px;\n  margin-bottom: 15px;\n  width: 100%; }\n\n.elixirchat-chat-messages__item {\n  max-width: 80%;\n  min-width: 50%;\n  margin-bottom: 15px;\n  transition: background-color 500ms; }\n  .elixirchat-chat-messages__item--by-operator {\n    align-self: flex-start;\n    padding-right: 20%;\n    width: 100%; }\n  .elixirchat-chat-messages__item:not(.elixirchat-chat-messages__item--by-me):not(.elixirchat-chat-messages__item--by-operator) {\n    padding-left: 20%;\n    width: 100%; }\n  .elixirchat-chat-messages__item--highlighted:not(.elixirchat-chat-messages__item--by-me) {\n    background: rgba(255, 0, 102, 0.05); }\n\n.elixirchat-chat-messages__sender {\n  color: #0033FF;\n  font-weight: bold;\n  padding-bottom: 1px; }\n  .elixirchat-chat-messages__item--by-me .elixirchat-chat-messages__sender {\n    color: #FFFFFF; }\n  .elixirchat-chat-messages__item--by-operator .elixirchat-chat-messages__sender {\n    color: #FF0066; }\n\n.elixirchat-chat-messages__balloon + .elixirchat-chat-messages__balloon {\n  margin-top: 10px; }\n\n.elixirchat-chat-messages__item--by-me .elixirchat-chat-messages__balloon {\n  padding: 9px 10px 7px 10px;\n  border-radius: 3px;\n  background: #0033FF;\n  color: #FFFFFF; }\n\n.elixirchat-chat-messages__reply-message {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  color: #999999;\n  margin: 2px 0 4px 0;\n  cursor: default; }\n  .elixirchat-chat-messages__item--by-me .elixirchat-chat-messages__reply-message {\n    color: rgba(255, 255, 255, 0.65); }\n\n.elixirchat-chat-messages__reply-message-icon {\n  margin-right: 7px;\n  opacity: .9;\n  vertical-align: text-bottom; }\n\n.elixirchat-chat-messages__text {\n  white-space: pre-wrap;\n  word-break: break-word; }\n  .elixirchat-chat-messages__text kbd {\n    font: 13px/17px Graphik, \"Helvetica Neue\", sans-serif;\n    background: rgba(0, 0, 0, 0.05);\n    border: 1px solid rgba(0, 0, 0, 0.1);\n    border-bottom-width: 2px;\n    border-radius: 2px;\n    padding: 1px 2px;\n    display: inline-block;\n    margin: 0 1px; }\n  .elixirchat-chat-messages__item--by-operator .elixirchat-chat-messages__text a {\n    color: #0033FF; }\n  .elixirchat-chat-messages__item--by-me .elixirchat-chat-messages__text a {\n    color: #FFFFFF;\n    text-decoration: underline; }\n  .elixirchat-chat-messages__item--by-me .elixirchat-chat-messages__text + .elixirchat-chat-files {\n    padding-top: 8px; }\n\n.elixirchat-chat-messages__bottom {\n  text-align: right;\n  color: #999999;\n  padding-top: 2px;\n  white-space: nowrap; }\n  .elixirchat-chat-messages__item--by-operator .elixirchat-chat-messages__bottom {\n    text-align: left; }\n\n.elixirchat-chat-messages__submission-error {\n  color: #FF0066;\n  cursor: pointer; }\n\n.elixirchat-chat-messages__reply-button {\n  margin-left: 10px;\n  cursor: pointer; }\n  .elixirchat-chat-messages__reply-button:hover {\n    color: #FF0066; }\n  .elixirchat-chat-messages__item--by-me .elixirchat-chat-messages__reply-button {\n    margin-left: 0;\n    margin-right: 10px; }\n\n.elixirchat-chat-files {\n  list-style: none;\n  padding: 6px 0 3px 0;\n  margin: 0; }\n  .elixirchat-chat-messages__item--by-me .elixirchat-chat-files {\n    padding-top: 2px; }\n\n.elixirchat-chat-files__item {\n  display: flex;\n  line-height: 21px;\n  margin-top: 10px;\n  padding: 0;\n  cursor: default; }\n  .elixirchat-chat-files__item:first-child {\n    margin-top: 0; }\n  .elixirchat-chat-files__item:hover .elixirchat-chat-files__preview {\n    background-color: #efefef; }\n  .elixirchat-chat-files__item:hover .elixirchat-chat-files__preview-image:after {\n    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1); }\n\n.elixirchat-chat-files__preview {\n  width: 50px;\n  height: 50px;\n  flex-basis: 50px;\n  flex-shrink: 0;\n  border-radius: 3px;\n  background: #F4F4F4;\n  transition: all 200ms;\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: #a6a6a6 !important; }\n\n.elixirchat-chat-files__preview-image {\n  background-size: cover; }\n  .elixirchat-chat-files__preview-image:after {\n    content: \"\";\n    position: absolute;\n    border-radius: 3px;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);\n    pointer-events: none;\n    transition: all 200ms; }\n\n.elixirchat-chat-files__preview-submitting {\n  background-image: none;\n  display: flex;\n  align-items: center;\n  justify-content: center; }\n\n.elixirchat-chat-files__text {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  padding: 6px 0 0 9px; }\n\n.elixirchat-chat-files__text-link {\n  margin-left: -15px;\n  padding-left: 15px; }\n  .elixirchat-chat-messages__item--by-me .elixirchat-chat-files__text-link {\n    color: #FFFFFF; }\n\n.elixirchat-chat-files__text-secondary {\n  color: rgba(0, 0, 0, 0.25); }\n  .elixirchat-chat-messages__item--by-me .elixirchat-chat-files__text-secondary {\n    color: rgba(255, 255, 255, 0.5); }\n\n.elixirchat-chat-messages__take-screenshot {\n  background: #FF0066;\n  color: #FFFFFF;\n  border: 0;\n  border-radius: 4px;\n  padding: 1px 11px 0 11px;\n  height: 31px;\n  line-height: 31px;\n  margin: 6px 0 3px 0;\n  transition: background-color 300ms; }\n  .elixirchat-chat-messages__take-screenshot:hover {\n    background: #e0005a; }\n\n.elixirchat-chat-files__preview-spinner {\n  display: block;\n  width: 22px;\n  height: 22px;\n  font-size: 22.4px;\n  animation: spinner 1s linear infinite; }\n\n.elixirchat-chat-images {\n  list-style: none;\n  padding: 0 0 0 0;\n  margin: 6px 0 2px 0; }\n\n.elixirchat-chat-images__item {\n  padding: 0;\n  margin-top: 6px; }\n  .elixirchat-chat-images__item:first-child {\n    margin-top: 2px; }\n  .elixirchat-chat-messages__item--by-me .elixirchat-chat-images__item {\n    text-align: right; }\n\n.elixirchat-chat-images__link {\n  display: inline-block;\n  vertical-align: bottom;\n  position: relative; }\n  .elixirchat-chat-images__link:after {\n    content: \"\";\n    position: absolute;\n    border-radius: 3px;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);\n    pointer-events: none; }\n\n.elixirchat-chat-images__img {\n  max-width: 256px;\n  max-height: 256px;\n  border-radius: 3px;\n  display: block; }\n\n.elixirchat-chat-images__item-not-found > img {\n  position: relative;\n  min-width: 180px;\n  pointer-events: none;\n  cursor: default; }\n  .elixirchat-chat-images__item-not-found > img:after {\n    content: \"(\" attr(alt) \")\";\n    color: rgba(0, 0, 0, 0.2);\n    display: block;\n    margin: 8px 0 0 20px;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    position: absolute;\n    top: 50%;\n    transform: translateY(-50%);\n    width: calc(100% - 40px);\n    text-align: center; }\n  .elixirchat-chat-images__item-not-found > img:before {\n    content: attr(data-error-message);\n    color: rgba(0, 0, 0, 0.2);\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    background: #fff;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    padding-bottom: 25px; }\n",
  ChatTextarea: "/* GLOBAL */\n/* CUSTOM */\n.elixirchat-chat-textarea {\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background: #FFFFFF;\n  z-index: 3;\n  box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.15);\n  border-radius: 0 0 8px 8px; }\n\n.elixirchat-chat-typing {\n  position: absolute;\n  background: #FFFFFF;\n  color: #d5d5d5;\n  left: 0;\n  right: 0;\n  bottom: 100%;\n  font-weight: bold;\n  padding: 0 30px 18px 54px;\n  box-shadow: 0 -15px 15px 6px #FFFFFF, inset 0 -1px 0 rgba(0, 0, 0, 0.15); }\n\n.elixirchat-chat-typing__icon {\n  position: absolute;\n  left: 30px;\n  top: 3px;\n  font-size: 11px;\n  color: #d5d5d5;\n  z-index: 2; }\n\n.elixirchat-chat-textarea__reply-to {\n  color: #0033FF;\n  margin: 18px 0 -8px 30px;\n  position: relative;\n  z-index: 1;\n  background: #FFFFFF;\n  box-shadow: -2px 10px 3px #FFFFFF; }\n\n.elixirchat-chat-textarea__reply-to-text {\n  display: inline-block;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  max-width: calc(100% - 140px); }\n\n.elixirchat-chat-textarea__reply-to-icon {\n  margin-right: 4px;\n  vertical-align: text-top; }\n\n.elixirchat-chat-textarea__reply-to-remove {\n  vertical-align: text-top;\n  margin-left: 6px;\n  font-size: 11px;\n  line-height: 6px; }\n\n.elixirchat-chat-textarea__actions {\n  position: absolute;\n  right: 20px;\n  bottom: 20px;\n  z-index: 2;\n  transition: transform 200ms; }\n  .elixirchat-chat-textarea__actions--collapsed {\n    transform: translateY(9px); }\n\n.elixirchat-chat-textarea__actions-screenshot,\n.elixirchat-chat-textarea__actions-attach {\n  width: 38px;\n  height: 31px;\n  background: #FFFFFF;\n  border: 1px solid #d5d5d5;\n  border-radius: 7px;\n  position: relative;\n  margin-left: 10px;\n  display: inline-block;\n  vertical-align: top;\n  box-sizing: border-box;\n  overflow: hidden;\n  transition: background-color 200ms;\n  color: rgba(0, 0, 0, 0.32);\n  padding-top: 4px; }\n  .elixirchat-chat-textarea__actions-screenshot:hover,\n  .elixirchat-chat-textarea__actions-attach:hover {\n    background-color: #efefef; }\n\n.elixirchat-chat-textarea__actions-attach-input {\n  position: absolute;\n  z-index: 1;\n  opacity: 0; }\n\n.elixirchat-chat-textarea__actions-attach-label {\n  position: absolute;\n  z-index: 2;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  padding-top: 8px;\n  text-align: center; }\n\n.elixirchat-chat-textarea__textarea {\n  border: 0;\n  position: relative;\n  left: 0;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  padding: 17px 0 0 30px;\n  margin-bottom: 17px;\n  resize: none;\n  width: calc(100% - 120px); }\n\n.elixirchat-chat-attachment-list {\n  padding: 0;\n  margin: -2px 0 15px 30px;\n  list-style: none;\n  line-height: 22px;\n  color: #0033FF; }\n\n.elixirchat-chat-attachment-item {\n  margin: 0;\n  white-space: nowrap; }\n\n.elixirchat-chat-attachment-icon {\n  margin-right: 8px;\n  vertical-align: middle; }\n  .elixirchat-chat-attachment-icon.icon-screenshot {\n    font-size: 12px;\n    margin-left: -1px; }\n\n.elixirchat-chat-attachment-filename {\n  max-width: calc(100% - 165px);\n  display: inline-block;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  vertical-align: middle; }\n\n.elixirchat-chat-attachment-remove {\n  font-size: 11px;\n  margin-left: 7px;\n  vertical-align: middle; }\n",
  ImagePreview: ""
};
},{"fs":"70rD"}],"2RVT":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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

var classnames_1 = __importDefault(require("classnames"));

var utilsWidget_1 = require("../../utilsWidget");

var Chat_1 = require("./Chat");

var IFrameWrapper_1 = require("./IFrameWrapper");

var ImagePreview_1 = require("./ImagePreview");

var styles_1 = __importDefault(require("./styles"));

var assets_1 = __importDefault(require("./assets"));

var Widget =
/*#__PURE__*/
function (_react_1$Component) {
  _inherits(Widget, _react_1$Component);

  function Widget() {
    var _this;

    _classCallCheck(this, Widget);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Widget).apply(this, arguments));
    _this.state = {
      isIFrameOpen: false,
      isIFrameOpeningAnimation: false,
      outsideIframeStyles: null,
      insideIframeStyles: null,
      unreadCount: 0,
      isImagePreviewOpen: false,
      currentImagePreview: {},
      imagePreviewGallery: []
    };

    _this.generateStyles = function () {
      var elixirChatWidget = _this.props.elixirChatWidget;
      var fontFaceGraphikNormal = utilsWidget_1.generateFontFaceRule('Graphik', 'normal', assets_1.default.fontGraphikRegularWeb);
      var fontFaceGraphikBold = utilsWidget_1.generateFontFaceRule('Graphik', 'bold', assets_1.default.fontGraphikBoldWeb);
      var fontFaceElixirIcons = utilsWidget_1.generateFontFaceRule('elixirchat-icons', null, assets_1.default.fontElixirchatIcons);
      var outsideIframeStyles = [styles_1.default.icons, styles_1.default.Widget, styles_1.default.ImagePreview, fontFaceGraphikNormal, fontFaceElixirIcons].join('\n'); // TODO: research why Safari ignoring @imported fonts if
      //  elixirChatWidget.iframeStyles is put in the end of insideIframeStyles

      var insideIframeStyles = [elixirChatWidget.iframeStyles, styles_1.default.icons, styles_1.default.Chat, styles_1.default.ChatMessages, styles_1.default.ChatTextarea, fontFaceGraphikNormal, fontFaceGraphikBold, fontFaceElixirIcons].join('\n');
      return {
        outsideIframeStyles: outsideIframeStyles,
        insideIframeStyles: insideIframeStyles
      };
    };

    _this.onToggleButton =
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _this.setState({
                isIFrameOpen: !_this.state.isIFrameOpen,
                isIFrameOpeningAnimation: true
              });

            case 2:
              setTimeout(function () {
                _this.setState({
                  isIFrameOpeningAnimation: false
                });
              });

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    _this.onImagePreviewOpen = function (currentImagePreview, imagePreviewGallery) {
      _this.setState({
        isImagePreviewOpen: true,
        currentImagePreview: currentImagePreview,
        imagePreviewGallery: imagePreviewGallery
      });
    };

    _this.onImagePreviewClose = function () {
      _this.setState({
        isImagePreviewOpen: false,
        currentImagePreview: {},
        imagePreviewGallery: []
      });
    };

    return _this;
  }

  _createClass(Widget, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var elixirChatWidget = this.props.elixirChatWidget;

      var _this$generateStyles = this.generateStyles(),
          outsideIframeStyles = _this$generateStyles.outsideIframeStyles,
          insideIframeStyles = _this$generateStyles.insideIframeStyles;

      document.body.addEventListener('click', utilsWidget_1.unlockNotificationSoundAutoplay);
      this.setState({
        outsideIframeStyles: outsideIframeStyles,
        insideIframeStyles: insideIframeStyles
      });
      elixirChatWidget.onToggleChatVisibility(this.onToggleButton);
      elixirChatWidget.onSetUnreadCount(function (unreadCount) {
        return _this2.setState({
          unreadCount: unreadCount
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var elixirChatWidget = this.props.elixirChatWidget;
      var _this$state = this.state,
          isIFrameOpen = _this$state.isIFrameOpen,
          isIFrameOpeningAnimation = _this$state.isIFrameOpeningAnimation,
          outsideIframeStyles = _this$state.outsideIframeStyles,
          insideIframeStyles = _this$state.insideIframeStyles,
          unreadCount = _this$state.unreadCount,
          currentImagePreview = _this$state.currentImagePreview,
          imagePreviewGallery = _this$state.imagePreviewGallery,
          isImagePreviewOpen = _this$state.isImagePreviewOpen;
      return react_1.default.createElement(react_1.Fragment, null, react_1.default.createElement("style", {
        dangerouslySetInnerHTML: {
          __html: outsideIframeStyles
        }
      }), react_1.default.createElement("button", {
        className: "elixirchat-widget-button",
        onClick: elixirChatWidget.toggleChatVisibility
      }, react_1.default.createElement("span", {
        className: classnames_1.default({
          'elixirchat-widget-button-counter': true,
          'elixirchat-widget-button-counter--has-unread': unreadCount
        })
      }, Boolean(unreadCount) && unreadCount)), react_1.default.createElement(ImagePreview_1.ImagePreview, {
        elixirChatWidget: elixirChatWidget,
        preview: currentImagePreview,
        gallery: imagePreviewGallery,
        onClose: this.onImagePreviewClose
      }), react_1.default.createElement(IFrameWrapper_1.IFrameWrapper, {
        elixirChatWidget: elixirChatWidget,
        className: classnames_1.default({
          'elixirchat-widget-iframe': true,
          'elixirchat-widget-iframe--visible': isIFrameOpen,
          'elixirchat-widget-iframe--opening': isIFrameOpeningAnimation
        })
      }, react_1.default.createElement(react_1.Fragment, null, react_1.default.createElement("style", {
        dangerouslySetInnerHTML: {
          __html: insideIframeStyles
        }
      }), react_1.default.createElement(Chat_1.Chat, {
        elixirChatWidget: elixirChatWidget,
        isImagePreviewOpen: isImagePreviewOpen,
        onImagePreviewOpen: this.onImagePreviewOpen
      }))));
    }
  }]);

  return Widget;
}(react_1.Component);

exports.Widget = Widget;

function renderWidgetReactComponent(container, elixirChatWidget) {
  var component;
  react_dom_1.default.render(react_1.default.createElement(Widget, {
    ref: function ref(widget) {
      component = widget;
    },
    elixirChatWidget: elixirChatWidget
  }), container);
  return component;
}

exports.renderWidgetReactComponent = renderWidgetReactComponent;
},{"react":"1n8/","react-dom":"NKHc","classnames":"9qb7","../../utilsWidget":"4KO9","./Chat":"8tJY","./IFrameWrapper":"0q3/","./ImagePreview":"3Xfh","./styles":"xqZa","./assets":"GpM8"}],"8fxs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ['average', 'big', 'colossal', 'fat', 'giant', 'gigantic', 'great', 'huge', 'immense', 'large', 'little', 'long', 'mammoth', 'massive', 'miniature', 'petite', 'puny', 'short', 'small', 'tall', 'tiny', 'boiling', 'breezy', 'broken', 'bumpy', 'chilly', 'cold', 'cool', 'creepy', 'crooked', 'cuddly', 'curly', 'damaged', 'damp', 'dirty', 'dry', 'dusty', 'filthy', 'flaky', 'fluffy', 'wet', 'broad', 'chubby', 'crooked', 'curved', 'deep', 'flat', 'high', 'hollow', 'low', 'narrow', 'round', 'shallow', 'skinny', 'square', 'steep', 'straight', 'wide', 'ancient', 'brief', 'early', 'fast', 'late', 'long', 'modern', 'old', 'quick', 'rapid', 'short', 'slow', 'swift', 'young', 'abundant', 'empty', 'few', 'heavy', 'light', 'many', 'numerous', 'Sound', 'cooing', 'deafening', 'faint', 'harsh', 'hissing', 'hushed', 'husky', 'loud', 'melodic', 'moaning', 'mute', 'noisy', 'purring', 'quiet', 'raspy', 'resonant', 'screeching', 'shrill', 'silent', 'soft', 'squealing', 'thundering', 'voiceless', 'whispering', 'bitter', 'delicious', 'fresh', 'juicy', 'ripe', 'rotten', 'salty', 'sour', 'spicy', 'stale', 'sticky', 'strong', 'sweet', 'tasteless', 'tasty', 'thirsty', 'fluttering', 'fuzzy', 'greasy', 'grubby', 'hard', 'hot', 'icy', 'loose', 'melted', 'plastic', 'prickly', 'rainy', 'rough', 'scattered', 'shaggy', 'shaky', 'sharp', 'shivering', 'silky', 'slimy', 'slippery', 'smooth', 'soft', 'solid', 'steady', 'sticky', 'tender', 'tight', 'uneven', 'weak', 'wet', 'wooden', 'afraid', 'angry', 'annoyed', 'anxious', 'arrogant', 'ashamed', 'awful', 'bad', 'bewildered', 'bored', 'combative', 'condemned', 'confused', 'creepy', 'cruel', 'dangerous', 'defeated', 'defiant', 'depressed', 'disgusted', 'disturbed', 'eerie', 'embarrassed', 'envious', 'evil', 'fierce', 'foolish', 'frantic', 'frightened', 'grieving', 'helpless', 'homeless', 'hungry', 'hurt', 'ill', 'jealous', 'lonely', 'mysterious', 'naughty', 'nervous', 'obnoxious', 'outrageous', 'panicky', 'repulsive', 'scary', 'scornful', 'selfish', 'sore', 'tense', 'terrible', 'thoughtless', 'tired', 'troubled', 'upset', 'uptight', 'weary', 'wicked', 'worried', 'agreeable', 'amused', 'brave', 'calm', 'charming', 'cheerful', 'comfortable', 'cooperative', 'courageous', 'delightful', 'determined', 'eager', 'elated', 'enchanting', 'encouraging', 'energetic', 'enthusiastic', 'excited', 'exuberant', 'fair', 'faithful', 'fantastic', 'fine', 'friendly', 'funny', 'gentle', 'glorious', 'good', 'happy', 'healthy', 'helpful', 'hilarious', 'jolly', 'joyous', 'kind', 'lively', 'lovely', 'lucky', 'obedient', 'perfect', 'pleasant', 'proud', 'relieved', 'silly', 'smiling', 'splendid', 'successful', 'thoughtful', 'victorious', 'vivacious', 'witty', 'wonderful', 'zealous', 'zany', 'other', 'good', 'new', 'old', 'great', 'high', 'small', 'different', 'large', 'local', 'social', 'important', 'long', 'young', 'national', 'british', 'right', 'early', 'possible', 'big', 'little', 'political', 'able', 'late', 'general', 'full', 'far', 'low', 'public', 'available', 'bad', 'main', 'sure', 'clear', 'major', 'economic', 'only', 'likely', 'real', 'black', 'particular', 'international', 'special', 'difficult', 'certain', 'open', 'whole', 'white', 'free', 'short', 'easy', 'strong', 'european', 'central', 'similar', 'human', 'common', 'necessary', 'single', 'personal', 'hard', 'private', 'poor', 'financial', 'wide', 'foreign', 'simple', 'recent', 'concerned', 'american', 'various', 'close', 'fine', 'english', 'wrong', 'present', 'royal', 'natural', 'individual', 'nice', 'french', 'following', 'current', 'modern', 'labour', 'legal', 'happy', 'final', 'red', 'normal', 'serious', 'previous', 'total', 'prime', 'significant', 'industrial', 'sorry', 'dead', 'specific', 'appropriate', 'top', 'soviet', 'basic', 'military', 'original', 'successful', 'aware', 'hon', 'popular', 'heavy', 'professional', 'direct', 'dark', 'cold', 'ready', 'green', 'useful', 'effective', 'western', 'traditional', 'scottish', 'german', 'independent', 'deep', 'interesting', 'considerable', 'involved', 'physical', 'left', 'hot', 'existing', 'responsible', 'complete', 'medical', 'blue', 'extra', 'past', 'male', 'interested', 'fair', 'essential', 'beautiful', 'civil', 'primary', 'obvious', 'future', 'environmental', 'positive', 'senior', 'nuclear', 'annual', 'relevant', 'huge', 'rich', 'commercial', 'safe', 'regional', 'practical', 'official', 'separate', 'key', 'chief', 'regular', 'due', 'additional', 'active', 'powerful', 'complex', 'standard', 'impossible', 'light', 'warm', 'middle', 'fresh', 'sexual', 'front', 'domestic', 'actual', 'united', 'technical', 'ordinary', 'cheap', 'strange', 'internal', 'excellent', 'quiet', 'soft', 'potential', 'northern', 'religious', 'quick', 'very', 'famous', 'cultural', 'proper', 'broad', 'joint', 'formal', 'limited', 'conservative', 'lovely', 'usual', 'ltd', 'unable', 'rural', 'initial', 'substantial', 'christian', 'bright', 'average', 'leading', 'reasonable', 'immediate', 'suitable', 'equal', 'detailed', 'working', 'overall', 'female', 'afraid', 'democratic', 'growing', 'sufficient', 'scientific', 'eastern', 'correct', 'inc', 'irish', 'expensive', 'educational', 'mental', 'dangerous', 'critical', 'increased', 'familiar', 'unlikely', 'double', 'perfect', 'slow', 'tiny', 'dry', 'historical', 'thin', 'daily', 'southern', 'increasing', 'wild', 'alone', 'urban', 'empty', 'married', 'narrow', 'liberal', 'supposed', 'upper', 'apparent', 'tall', 'busy', 'bloody', 'prepared', 'russian', 'moral', 'careful', 'clean', 'attractive', 'japanese', 'vital', 'thick', 'alternative', 'fast', 'ancient', 'elderly', 'rare', 'external', 'capable', 'brief', 'wonderful', 'grand', 'typical', 'entire', 'grey', 'constant', 'vast', 'surprised', 'ideal', 'terrible', 'academic', 'funny', 'minor', 'pleased', 'severe', 'ill', 'corporate', 'negative', 'permanent', 'weak', 'brown', 'fundamental', 'odd', 'crucial', 'inner', 'used', 'criminal', 'contemporary', 'sharp', 'sick', 'near', 'roman', 'massive', 'unique', 'secondary', 'parliamentary', 'african', 'unknown', 'subsequent', 'angry', 'alive', 'guilty', 'lucky', 'enormous', 'well', 'communist', 'yellow', 'unusual', 'net', 'tough', 'dear', 'extensive', 'glad', 'remaining', 'agricultural', 'alright', 'healthy', 'italian', 'principal', 'tired', 'efficient', 'comfortable', 'chinese', 'relative', 'friendly', 'conventional', 'willing', 'sudden', 'proposed', 'voluntary', 'slight', 'valuable', 'dramatic', 'golden', 'temporary', 'federal', 'keen', 'flat', 'silent', 'indian', 'worried', 'pale', 'statutory', 'welsh', 'dependent', 'firm', 'wet', 'competitive', 'armed', 'radical', 'outside', 'acceptable', 'sensitive', 'living', 'pure', 'global', 'emotional', 'sad', 'secret', 'rapid', 'adequate', 'fixed', 'sweet', 'administrative', 'wooden', 'remarkable', 'comprehensive', 'surprising', 'solid', 'rough', 'mere', 'mass', 'brilliant', 'maximum', 'absolute', 'tory', 'electronic', 'visual', 'electric', 'cool', 'spanish', 'literary', 'continuing', 'supreme', 'chemical', 'genuine', 'exciting', 'written', 'stupid', 'advanced', 'extreme', 'classical', 'fit', 'favourite', 'socialist', 'widespread', 'confident', 'straight', 'catholic', 'proud', 'numerous', 'opposite', 'distinct', 'mad', 'helpful', 'given', 'disabled', 'consistent', 'anxious', 'nervous', 'awful', 'stable', 'constitutional', 'satisfied', 'conscious', 'developing', 'strategic', 'holy', 'smooth', 'dominant', 'remote', 'theoretical', 'outstanding', 'pink', 'pretty', 'clinical', 'minimum', 'honest', 'impressive', 'related', 'residential', 'extraordinary', 'plain', 'visible', 'accurate', 'distant', 'still', 'greek', 'complicated', 'musical', 'precise', 'gentle', 'broken', 'live', 'silly', 'fat', 'tight', 'monetary', 'round', 'psychological', 'violent', 'unemployed', 'inevitable', 'junior', 'sensible', 'grateful', 'pleasant', 'dirty', 'structural', 'welcome', 'deaf', 'above', 'continuous', 'blind', 'overseas', 'mean', 'entitled', 'delighted', 'loose', 'occasional', 'evident', 'desperate', 'fellow', 'universal', 'square', 'steady', 'classic', 'equivalent', 'intellectual', 'victorian', 'level', 'ultimate', 'creative', 'lost', 'medieval', 'clever', 'linguistic', 'convinced', 'judicial', 'raw', 'sophisticated', 'asleep', 'vulnerable', 'illegal', 'outer', 'revolutionary', 'bitter', 'changing', 'australian', 'native', 'imperial', 'strict', 'wise', 'informal', 'flexible', 'collective', 'frequent', 'experimental', 'spiritual', 'intense', 'rational', 'ethnic', 'generous', 'inadequate', 'prominent', 'logical', 'bare', 'historic', 'modest', 'dutch', 'acute', 'electrical', 'valid', 'weekly', 'gross', 'automatic', 'loud', 'reliable', 'mutual', 'liable', 'multiple', 'ruling', 'curious', 'arab', 'sole', 'jewish', 'managing', 'pregnant', 'latin', 'nearby', 'exact', 'underlying', 'identical', 'satisfactory', 'marginal', 'distinctive', 'electoral', 'urgent', 'presidential', 'controversial', 'oral', 'everyday', 'encouraging', 'organic', 'continued', 'expected', 'statistical', 'desirable', 'innocent', 'improved', 'exclusive', 'marked', 'experienced', 'unexpected', 'superb', 'sheer', 'disappointed', 'frightened', 'gastric', 'capitalist', 'romantic', 'naked', 'reluctant', 'magnificent', 'convenient', 'established', 'closed', 'uncertain', 'artificial', 'diplomatic', 'tremendous', 'marine', 'mechanical', 'retail', 'institutional', 'mixed', 'required', 'biological', 'known', 'functional', 'straightforward', 'superior', 'digital', 'spectacular', 'unhappy', 'confused', 'unfair', 'aggressive', 'spare', 'painful', 'abstract', 'asian', 'associated', 'legislative', 'monthly', 'intelligent', 'hungry', 'explicit', 'nasty', 'just', 'faint', 'coloured', 'ridiculous', 'amazing', 'comparable', 'successive', 'realistic', 'back', 'decent', 'unnecessary', 'flying', 'fucking', 'random', 'influential', 'dull', 'genetic', 'neat', 'marvellous', 'crazy', 'damp', 'giant', 'secure', 'bottom', 'skilled', 'subtle', 'elegant', 'brave', 'lesser', 'parallel', 'steep', 'intensive', 'casual', 'tropical', 'lonely', 'partial', 'preliminary', 'concrete', 'alleged', 'assistant', 'vertical', 'upset', 'delicate', 'mild', 'occupational', 'excessive', 'progressive', 'iraqi', 'exceptional', 'integrated', 'striking', 'continental', 'okay', 'harsh', 'combined', 'fierce', 'handsome', 'characteristic', 'chronic', 'compulsory', 'interim', 'objective', 'splendid', 'magic', 'systematic', 'obliged', 'payable', 'fun', 'horrible', 'primitive', 'fascinating', 'ideological', 'metropolitan', 'surrounding', 'estimated', 'peaceful', 'premier', 'operational', 'technological', 'kind', 'advisory', 'hostile', 'precious', 'gay', 'accessible', 'determined', 'excited', 'impressed', 'provincial', 'smart', 'endless', 'isolated', 'drunk', 'geographical', 'like', 'dynamic', 'boring', 'forthcoming', 'unfortunate', 'definite', 'super', 'notable', 'indirect', 'stiff', 'wealthy', 'awkward', 'lively', 'neutral', 'artistic', 'content', 'mature', 'colonial', 'ambitious', 'evil', 'magnetic', 'verbal', 'legitimate', 'sympathetic', 'empirical', 'head', 'shallow', 'vague', 'naval', 'depressed', 'shared', 'added', 'shocked', 'mid', 'worthwhile', 'qualified', 'missing', 'blank', 'absent', 'favourable', 'polish', 'israeli', 'developed', 'profound', 'representative', 'enthusiastic', 'dreadful', 'rigid', 'reduced', 'cruel', 'coastal', 'peculiar', 'racial', 'ugly', 'swiss', 'crude', 'extended', 'selected', 'eager', 'feminist', 'canadian', 'bold', 'relaxed', 'corresponding', 'running', 'planned', 'applicable', 'immense', 'allied', 'comparative', 'uncomfortable', 'conservation', 'productive', 'beneficial', 'bored', 'charming', 'minimal', 'mobile', 'turkish', 'orange', 'rear', 'passive', 'suspicious', 'overwhelming', 'fatal', 'resulting', 'symbolic', 'registered', 'neighbouring', 'calm', 'irrelevant', 'patient', 'compact', 'profitable', 'rival', 'loyal', 'moderate', 'distinguished', 'interior', 'noble', 'insufficient', 'eligible', 'mysterious', 'varying', 'managerial', 'molecular', 'olympic', 'linear', 'prospective', 'printed', 'parental', 'diverse', 'elaborate', 'furious', 'fiscal', 'burning', 'useless', 'semantic', 'embarrassed', 'inherent', 'philosophical', 'deliberate', 'awake', 'variable', 'promising', 'unpleasant', 'varied', 'sacred', 'selective', 'inclined', 'tender', 'hidden', 'worthy', 'intermediate', 'sound', 'protective', 'fortunate', 'slim', 'islamic', 'defensive', 'divine', 'stuck', 'driving', 'invisible', 'misleading', 'circular', 'mathematical', 'inappropriate', 'liquid', 'persistent', 'solar', 'doubtful', 'manual', 'architectural', 'intact', 'incredible', 'devoted', 'prior', 'tragic', 'respectable', 'optimistic', 'convincing', 'unacceptable', 'decisive', 'competent', 'spatial', 'respective', 'binding', 'relieved', 'nursing', 'toxic', 'select', 'redundant', 'integral', 'then', 'probable', 'amateur', 'fond', 'passing', 'specified', 'territorial', 'horizontal', 'inland', 'cognitive', 'regulatory', 'miserable', 'resident', 'polite', 'scared', 'marxist', 'gothic', 'civilian', 'instant', 'lengthy', 'adverse', 'korean', 'unconscious', 'anonymous', 'aesthetic', 'orthodox', 'static', 'unaware', 'costly', 'fantastic', 'foolish', 'fashionable', 'causal', 'compatible', 'wee', 'implicit', 'dual', 'ok', 'cheerful', 'subjective', 'forward', 'surviving', 'exotic', 'purple', 'cautious', 'visiting', 'aggregate', 'ethical', 'protestant', 'teenage', 'dying', 'disastrous', 'delicious', 'confidential', 'underground', 'thorough', 'grim', 'autonomous', 'atomic', 'frozen', 'colourful', 'injured', 'uniform', 'ashamed', 'glorious', 'wicked', 'coherent', 'rising', 'shy', 'novel', 'balanced', 'delightful', 'arbitrary', 'adjacent', 'psychiatric', 'worrying', 'weird', 'unchanged', 'rolling', 'evolutionary', 'intimate', 'sporting', 'disciplinary', 'formidable', 'lexical', 'noisy', 'gradual', 'accused', 'homeless', 'supporting', 'coming', 'renewed', 'excess', 'retired', 'rubber', 'chosen', 'outdoor', 'embarrassing', 'preferred', 'bizarre', 'appalling', 'agreed', 'imaginative', 'governing', 'accepted', 'vocational', 'palestinian', 'mighty', 'puzzled', 'worldwide', 'handicapped', 'organisational', 'sunny', 'eldest', 'eventual', 'spontaneous', 'vivid', 'rude', 'faithful', 'ministerial', 'innovative', 'controlled', 'conceptual', 'unwilling', 'civic', 'meaningful', 'disturbing', 'alive', 'brainy', 'breakable', 'busy', 'careful', 'cautious', 'clever', 'concerned', 'crazy', 'curious', 'dead', 'different', 'difficult', 'doubtful', 'easy', 'famous', 'fragile', 'helpful', 'helpless', 'important', 'impossible', 'innocent', 'inquisitive', 'modern', 'open', 'outstanding', 'poor', 'powerful', 'puzzled', 'real', 'rich', 'shy', 'sleepy', 'stupid', 'super', 'tame', 'uninterested', 'wandering', 'wild', 'wrong', 'adorable', 'alert', 'average', 'beautiful', 'blonde', 'bloody', 'blushing', 'bright', 'clean', 'clear', 'cloudy', 'colorful', 'crowded', 'cute', 'dark', 'drab', 'distinct', 'dull', 'elegant', 'fancy', 'filthy', 'glamorous', 'gleaming', 'graceful', 'grotesque', 'homely', 'light', 'misty', 'motionless', 'muddy', 'plain', 'poised', 'quaint', 'shiny', 'smoggy', 'sparkling', 'spotless', 'stormy', 'strange', 'ugly', 'unsightly', 'unusual', 'bad', 'better', 'beautiful', 'big', 'black', 'blue', 'bright', 'clumsy', 'crazy', 'dizzy', 'dull', 'fat', 'frail', 'friendly', 'funny', 'great', 'green', 'gigantic', 'gorgeous', 'grumpy', 'handsome', 'happy', 'horrible', 'itchy', 'jittery', 'jolly', 'kind', 'long', 'lazy', 'magnificent', 'magenta', 'many', 'mighty', 'mushy', 'nasty', 'new', 'nice', 'nosy', 'nutty', 'nutritious', 'odd', 'orange', 'ordinary', 'pretty', 'precious', 'prickly', 'purple', 'quaint', 'quiet', 'quick', 'quickest', 'rainy', 'rare', 'ratty', 'red', 'roasted', 'robust', 'round', 'sad', 'scary', 'scrawny', 'short', 'silly', 'stingy', 'strange', 'striped', 'spotty', 'tart', 'tall', 'tame', 'tan', 'tender', 'testy', 'tricky', 'tough', 'ugly', 'ugliest', 'vast', 'watery', 'wasteful', 'wonderful', 'yellow', 'yummy', 'zany'];
},{}],"TAQU":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ['amaranth', 'amber', 'amethyst', 'apricot', 'aqua', 'aquamarine', 'azure', 'beige', 'black', 'blue', 'blush', 'bronze', 'brown', 'chocolate', 'coffee', 'copper', 'coral', 'crimson', 'cyan', 'emerald', 'fuchsia', 'gold', 'gray', 'green', 'harlequin', 'indigo', 'ivory', 'jade', 'lavender', 'lime', 'magenta', 'maroon', 'moccasin', 'olive', 'orange', 'peach', 'pink', 'plum', 'purple', 'red', 'rose', 'salmon', 'sapphire', 'scarlet', 'silver', 'tan', 'teal', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];
},{}],"ch1d":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ['canidae', 'felidae', 'cat', 'cattle', 'dog', 'donkey', 'goat', 'horse', 'pig', 'rabbit', 'aardvark', 'aardwolf', 'albatross', 'alligator', 'alpaca', 'amphibian', 'anaconda', 'angelfish', 'anglerfish', 'ant', 'anteater', 'antelope', 'antlion', 'ape', 'aphid', 'armadillo', 'asp', 'baboon', 'badger', 'bandicoot', 'barnacle', 'barracuda', 'basilisk', 'bass', 'bat', 'bear', 'beaver', 'bedbug', 'bee', 'beetle', 'bird', 'bison', 'blackbird', 'boa', 'boar', 'bobcat', 'bobolink', 'bonobo', 'booby', 'bovid', 'bug', 'butterfly', 'buzzard', 'camel', 'canid', 'capybara', 'cardinal', 'caribou', 'carp', 'cat', 'catshark', 'caterpillar', 'catfish', 'cattle', 'centipede', 'cephalopod', 'chameleon', 'cheetah', 'chickadee', 'chicken', 'chimpanzee', 'chinchilla', 'chipmunk', 'clam', 'clownfish', 'cobra', 'cockroach', 'cod', 'condor', 'constrictor', 'coral', 'cougar', 'cow', 'coyote', 'crab', 'crane', 'crawdad', 'crayfish', 'cricket', 'crocodile', 'crow', 'cuckoo', 'cicada', 'damselfly', 'deer', 'dingo', 'dinosaur', 'dog', 'dolphin', 'donkey', 'dormouse', 'dove', 'dragonfly', 'dragon', 'duck', 'eagle', 'earthworm', 'earwig', 'echidna', 'eel', 'egret', 'elephant', 'elk', 'emu', 'ermine', 'falcon', 'ferret', 'finch', 'firefly', 'fish', 'flamingo', 'flea', 'fly', 'flyingfish', 'fowl', 'fox', 'frog', 'gamefowl', 'galliform', 'gazelle', 'gecko', 'gerbil', 'gibbon', 'giraffe', 'goat', 'goldfish', 'goose', 'gopher', 'gorilla', 'grasshopper', 'grouse', 'guan', 'guanaco', 'guineafowl', 'gull', 'guppy', 'haddock', 'halibut', 'hamster', 'hare', 'harrier', 'hawk', 'hedgehog', 'heron', 'herring', 'hippopotamus', 'hookworm', 'hornet', 'horse', 'hoverfly', 'hummingbird', 'hyena', 'iguana', 'impala', 'jackal', 'jaguar', 'jay', 'jellyfish', 'junglefowl', 'kangaroo', 'kingfisher', 'kite', 'kiwi', 'koala', 'koi', 'krill', 'ladybug', 'lamprey', 'landfowl', 'lark', 'leech', 'lemming', 'lemur', 'leopard', 'leopon', 'limpet', 'lion', 'lizard', 'llama', 'lobster', 'locust', 'loon', 'louse', 'lungfish', 'lynx', 'macaw', 'mackerel', 'magpie', 'mammal', 'manatee', 'mandrill', 'marlin', 'marmoset', 'marmot', 'marsupial', 'marten', 'mastodon', 'meadowlark', 'meerkat', 'mink', 'minnow', 'mite', 'mockingbird', 'mole', 'mollusk', 'mongoose', 'monkey', 'moose', 'mosquito', 'moth', 'mouse', 'mule', 'muskox', 'narwhal', 'newt', 'nightingale', 'ocelot', 'octopus', 'opossum', 'orangutan', 'orca', 'ostrich', 'otter', 'owl', 'ox', 'panda', 'panther', 'parakeet', 'parrot', 'parrotfish', 'partridge', 'peacock', 'peafowl', 'pelican', 'penguin', 'perch', 'pheasant', 'pig', 'pigeon', 'pike', 'pinniped', 'piranha', 'planarian', 'platypus', 'pony', 'porcupine', 'porpoise', 'possum', 'prawn', 'primate', 'ptarmigan', 'puffin', 'puma', 'python', 'quail', 'quelea', 'quokka', 'rabbit', 'raccoon', 'rat', 'rattlesnake', 'raven', 'reindeer', 'reptile', 'rhinoceros', 'roadrunner', 'rodent', 'rook', 'rooster', 'roundworm', 'sailfish', 'salamander', 'salmon', 'sawfish', 'scallop', 'scorpion', 'seahorse', 'shark', 'sheep', 'shrew', 'shrimp', 'silkworm', 'silverfish', 'skink', 'skunk', 'sloth', 'slug', 'smelt', 'snail', 'snake', 'snipe', 'sole', 'sparrow', 'spider', 'spoonbill', 'squid', 'squirrel', 'starfish', 'stingray', 'stoat', 'stork', 'sturgeon', 'swallow', 'swan', 'swift', 'swordfish', 'swordtail', 'tahr', 'takin', 'tapir', 'tarantula', 'tarsier', 'termite', 'tern', 'thrush', 'tick', 'tiger', 'tiglon', 'toad', 'tortoise', 'toucan', 'trout', 'tuna', 'turkey', 'turtle', 'tyrannosaurus', 'urial', 'vicuna', 'viper', 'vole', 'vulture', 'wallaby', 'walrus', 'wasp', 'warbler', 'weasel', 'whale', 'whippet', 'whitefish', 'wildcat', 'wildebeest', 'wildfowl', 'wolf', 'wolverine', 'wombat', 'woodpecker', 'worm', 'wren', 'xerinae', 'yak', 'zebra', 'alpaca', 'cat', 'cattle', 'chicken', 'dog', 'donkey', 'ferret', 'gayal', 'goldfish', 'guppy', 'horse', 'koi', 'llama', 'sheep', 'yak'];
},{}],"m78u":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var UniqueNamesGenerator = function () {
  function UniqueNamesGenerator(config) {
    var length = config.length,
        separator = config.separator,
        dictionaries = config.dictionaries;
    this.dictionaries = dictionaries;
    this.separator = separator;
    this.length = length;
  }

  UniqueNamesGenerator.prototype.generate = function () {
    var _this = this;

    if (!this.dictionaries) {
      throw new Error('Cannot find any dictionary. Please provide at least one, or leave ' + 'the "dictionary" field empty in the config object');
    }

    if (this.length <= 0) {
      throw new Error('Invalid length provided');
    }

    if (this.length > this.dictionaries.length) {
      throw new Error('The length cannot be bigger than the number of dictionaries.\n' + ("Length provided: " + this.length + ". Number of dictionaries provided: " + this.dictionaries.length));
    }

    return this.dictionaries.slice(0, this.length).reduce(function (acc, curr) {
      var rnd = Math.floor(Math.random() * curr.length);
      var word = curr[rnd];
      return acc ? "" + acc + _this.separator + word : "" + word;
    }, '');
  };

  return UniqueNamesGenerator;
}();

exports.UniqueNamesGenerator = UniqueNamesGenerator;
},{}],"oOYt":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var adjectives_1 = __importDefault(require("./dictionaries/adjectives"));

var colors_1 = __importDefault(require("./dictionaries/colors"));

var animals_1 = __importDefault(require("./dictionaries/animals"));

var unique_names_generator_1 = require("./unique-names-generator");

var defaultConfig = {
  separator: '_',
  length: 3,
  dictionaries: [adjectives_1.default, colors_1.default, animals_1.default]
};

exports.uniqueNamesGenerator = function (customConfig) {
  if (customConfig === void 0) {
    customConfig = {};
  }

  var config = __assign({}, defaultConfig, customConfig, {
    dictionaries: (customConfig && customConfig.dictionaries || defaultConfig.dictionaries).slice()
  });

  var ung = new unique_names_generator_1.UniqueNamesGenerator(config);
  return ung.generate();
};
},{"./dictionaries/adjectives":"8fxs","./dictionaries/colors":"TAQU","./dictionaries/animals":"ch1d","./unique-names-generator":"m78u"}],"LC55":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var adjectives_1 = __importDefault(require("./adjectives"));

exports.adjectives = adjectives_1.default;

var animals_1 = __importDefault(require("./animals"));

exports.animals = animals_1.default;

var colors_1 = __importDefault(require("./colors"));

exports.colors = colors_1.default;
},{"./adjectives":"8fxs","./animals":"ch1d","./colors":"TAQU"}],"Qz33":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) {
    if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./lib/index"));

__export(require("./lib/dictionaries/index"));
},{"./lib/index":"oOYt","./lib/dictionaries/index":"LC55"}],"1fv+":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var GraphQLClient =
/*#__PURE__*/
function () {
  function GraphQLClient(_ref) {
    var url = _ref.url,
        token = _ref.token;

    _classCallCheck(this, GraphQLClient);

    this.headers = {
      'Accept': 'application/json'
    };
    this.url = url;
    this.token = token;

    if (this.token) {
      this.headers.Authorization = "Bearer ".concat(this.token);
    }
  }

  _createClass(GraphQLClient, [{
    key: "makeFormData",
    value: function makeFormData(query, variables, binaryFiles) {
      var formData = new FormData();
      formData.append('query', query);
      formData.append('variables', JSON.stringify(variables));

      for (var fileName in binaryFiles) {
        formData.append(fileName, binaryFiles[fileName]);
      }

      return formData;
    }
  }, {
    key: "query",
    value: function query(_query, variables, binaryFiles) {
      var _this = this;

      var headers;
      var body;

      if (binaryFiles) {
        body = this.makeFormData(_query, variables, binaryFiles);
        headers = this.headers;
      } else {
        body = JSON.stringify({
          query: _query,
          variables: variables
        });
        headers = Object.assign({}, this.headers, {
          'Content-Type': 'application/json'
        });
      }

      return new Promise(function (resolve, reject) {
        fetch(_this.url, {
          method: 'POST',
          headers: headers,
          body: body
        }).then(function (response) {
          return response.json();
        }).then(function (response) {
          if (response.errors) {
            reject(response);
          } else {
            resolve(response.data);
          }
        }).catch(function (response) {
          return reject(response);
        });
      });
    }
  }]);

  return GraphQLClient;
}();

exports.GraphQLClient = GraphQLClient;

exports.simplifyGraphQLJSON = function (graphQLJSON) {
  return graphQLJSON.edges.map(function (data) {
    return Object.assign({}, data.node, {
      cursor: data.cursor
    });
  });
};

exports.gql = function (queryParts) {
  return queryParts.join('');
};

exports.insertGraphQlFragments = function (query) {
  var fragments = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var fragmentsString = '';

  for (var name in fragments) {
    fragmentsString += fragments[name];
  }

  return query + fragmentsString;
};
},{}],"1lqy":[function(require,module,exports) {
"use strict";

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  fragment fragmentCompanyEmployee on CompanyEmployee {\n    employee {\n      id\n      firstName\n      lastName\n    }\n    __typename\n    isWorking\n    role\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  fragment fragmentClient on Client {\n    __typename\n    id\n    foreignId\n    firstName\n    lastName\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var GraphQLClient_1 = require("../GraphQLClient");

var utilsCommon_1 = require("../../utilsCommon");

exports.fragmentClient = GraphQLClient_1.gql(_templateObject());
exports.fragmentCompanyEmployee = GraphQLClient_1.gql(_templateObject2());

function serializeUser(user, options) {
  var elixirChatId = utilsCommon_1._get(user, 'foreignId') || null;
  var isOperator = utilsCommon_1._get(user, '__typename') !== 'Client';
  var id = isOperator ? utilsCommon_1._get(user, 'employee.id') : utilsCommon_1._get(user, 'id');
  return {
    id: id || null,
    firstName: utilsCommon_1._get(user, 'firstName') || utilsCommon_1._get(user, 'employee.firstName') || '',
    lastName: utilsCommon_1._get(user, 'lastName') || utilsCommon_1._get(user, 'employee.lastName') || '',
    isCurrentClient: elixirChatId === options.currentClientId,
    isOperator: isOperator,
    elixirChatId: elixirChatId
  };
}

exports.serializeUser = serializeUser;
},{"../GraphQLClient":"1fv+","../../utilsCommon":"EjGt"}],"EIvU":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

exports.default = function (innerThis, boundThis) {
  if (innerThis !== boundThis) {
    throw new TypeError("Cannot instantiate an arrow function");
  }
};
},{}],"o7wy":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flip = flip;
exports.constant = constant;
exports.on = on;
exports.compose = compose;
exports.pipe = pipe;
exports.curry = curry;
// eslint-disable-line no-redeclare

// Flips the order of the arguments to a function of two arguments.
// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare

// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare

// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare
function flip(f) {
  return function (b, a) {
    return f(a, b);
  };
}

// Returns its first argument and ignores its second.
// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare
// eslint-disable-line no-redeclare

function constant(a) {
  return function () {
    return a;
  };
}

// The `on` function is used to change the domain of a binary operator.
function on(o, f) {
  return function (x, y) {
    return o(f(x), f(y));
  };
}

function compose() {
  var _this = this;

  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  // eslint-disable-line no-redeclare
  var len = fns.length - 1;
  return function (x) {
    var y = x;
    for (var _i = len; _i > -1; _i--) {
      y = fns[_i].call(_this, y);
    }
    return y;
  };
}

function pipe() {
  var _this2 = this;

  for (var _len2 = arguments.length, fns = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    fns[_key2] = arguments[_key2];
  }

  // eslint-disable-line no-redeclare
  var len = fns.length - 1;
  return function (x) {
    var y = x;
    for (var _i2 = 0; _i2 <= len; _i2++) {
      y = fns[_i2].call(_this2, y);
    }
    return y;
  };
}

function curried(f, length, acc) {
  return function () {
    var combined = acc.concat(Array.prototype.slice.call(arguments));
    return combined.length >= length ? f.apply(this, combined) : curried(f, length, combined);
  };
}

function curry(f) {
  // eslint-disable-line no-redeclare
  return curried(f, f.length, []);
}
},{}],"lytE":[function(require,module,exports) {
var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_to-integer":"yjVO","./_defined":"+Bjj"}],"1kq3":[function(require,module,exports) {
module.exports = true;

},{}],"3zRh":[function(require,module,exports) {
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":"6kYj"}],"zotD":[function(require,module,exports) {
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":"M7z6"}],"6MLN":[function(require,module,exports) {
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":"5BXi"}],"9kxq":[function(require,module,exports) {
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_is-object":"M7z6","./_global":"5qf4"}],"R6c1":[function(require,module,exports) {
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":"6MLN","./_fails":"5BXi","./_dom-create":"9kxq"}],"EKwp":[function(require,module,exports) {
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":"M7z6"}],"Gfzd":[function(require,module,exports) {
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":"zotD","./_ie8-dom-define":"R6c1","./_to-primitive":"EKwp","./_descriptors":"6MLN"}],"akPY":[function(require,module,exports) {
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_object-dp":"Gfzd","./_property-desc":"uJ6d","./_descriptors":"6MLN"}],"vSO4":[function(require,module,exports) {

var global = require('./_global');
var core = require('./_core');
var ctx = require('./_ctx');
var hide = require('./_hide');
var has = require('./_has');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_global":"5qf4","./_core":"ss9A","./_ctx":"3zRh","./_hide":"akPY","./_has":"2uHg"}],"gojl":[function(require,module,exports) {
module.exports = require('./_hide');

},{"./_hide":"akPY"}],"E5Ce":[function(require,module,exports) {
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":"Z5df"}],"Wyka":[function(require,module,exports) {
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_iobject":"E5Ce","./_defined":"+Bjj"}],"S7IM":[function(require,module,exports) {
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":"yjVO"}],"Zwq5":[function(require,module,exports) {
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":"yjVO"}],"LNnS":[function(require,module,exports) {
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-iobject":"Wyka","./_to-length":"S7IM","./_to-absolute-index":"Zwq5"}],"NB7d":[function(require,module,exports) {

var core = require('./_core');
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: require('./_library') ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});

},{"./_core":"ss9A","./_global":"5qf4","./_library":"1kq3"}],"/wuY":[function(require,module,exports) {
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":"NB7d","./_uid":"U49f"}],"B9Lq":[function(require,module,exports) {
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_has":"2uHg","./_to-iobject":"Wyka","./_array-includes":"LNnS","./_shared-key":"/wuY"}],"knrM":[function(require,module,exports) {
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_object-keys-internal":"B9Lq","./_enum-bug-keys":"9bbv"}],"gjjs":[function(require,module,exports) {
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_object-dp":"Gfzd","./_an-object":"zotD","./_object-keys":"knrM","./_descriptors":"6MLN"}],"ebIA":[function(require,module,exports) {
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":"5qf4"}],"TNJq":[function(require,module,exports) {
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":"zotD","./_object-dps":"gjjs","./_enum-bug-keys":"9bbv","./_shared-key":"/wuY","./_dom-create":"9kxq","./_html":"ebIA"}],"Ug9I":[function(require,module,exports) {
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_shared":"NB7d","./_uid":"U49f","./_global":"5qf4"}],"11Ut":[function(require,module,exports) {
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_object-dp":"Gfzd","./_has":"2uHg","./_wks":"Ug9I"}],"b7Q2":[function(require,module,exports) {
'use strict';
var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_object-create":"TNJq","./_property-desc":"uJ6d","./_set-to-string-tag":"11Ut","./_hide":"akPY","./_wks":"Ug9I"}],"mbLO":[function(require,module,exports) {
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":"+Bjj"}],"HHE0":[function(require,module,exports) {
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":"2uHg","./_to-object":"mbLO","./_shared-key":"/wuY"}],"uRfg":[function(require,module,exports) {
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_library":"1kq3","./_export":"vSO4","./_redefine":"gojl","./_hide":"akPY","./_iterators":"JO4d","./_iter-create":"b7Q2","./_set-to-string-tag":"11Ut","./_object-gpo":"HHE0","./_wks":"Ug9I"}],"i+u+":[function(require,module,exports) {
'use strict';
var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_string-at":"lytE","./_iter-define":"uRfg"}],"ID6i":[function(require,module,exports) {
module.exports = function () { /* empty */ };

},{}],"OYXR":[function(require,module,exports) {
'use strict';
var addToUnscopables = require('./_add-to-unscopables');
var step = require('./_iter-step');
var Iterators = require('./_iterators');
var toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":"ID6i","./_iter-step":"x8b3","./_iterators":"JO4d","./_to-iobject":"Wyka","./_iter-define":"uRfg"}],"COf8":[function(require,module,exports) {

require('./es6.array.iterator');
var global = require('./_global');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var TO_STRING_TAG = require('./_wks')('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

},{"./es6.array.iterator":"OYXR","./_global":"5qf4","./_hide":"akPY","./_iterators":"JO4d","./_wks":"Ug9I"}],"ZxII":[function(require,module,exports) {
exports.f = require('./_wks');

},{"./_wks":"Ug9I"}],"nFDa":[function(require,module,exports) {
require('../../modules/es6.string.iterator');
require('../../modules/web.dom.iterable');
module.exports = require('../../modules/_wks-ext').f('iterator');

},{"../../modules/es6.string.iterator":"i+u+","../../modules/web.dom.iterable":"COf8","../../modules/_wks-ext":"ZxII"}],"6t7t":[function(require,module,exports) {
module.exports = { "default": require("core-js/library/fn/symbol/iterator"), __esModule: true };
},{"core-js/library/fn/symbol/iterator":"nFDa"}],"e8vu":[function(require,module,exports) {
var META = require('./_uid')('meta');
var isObject = require('./_is-object');
var has = require('./_has');
var setDesc = require('./_object-dp').f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !require('./_fails')(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};

},{"./_uid":"U49f","./_is-object":"M7z6","./_has":"2uHg","./_object-dp":"Gfzd","./_fails":"5BXi"}],"c2zY":[function(require,module,exports) {

var global = require('./_global');
var core = require('./_core');
var LIBRARY = require('./_library');
var wksExt = require('./_wks-ext');
var defineProperty = require('./_object-dp').f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};

},{"./_global":"5qf4","./_core":"ss9A","./_library":"1kq3","./_wks-ext":"ZxII","./_object-dp":"Gfzd"}],"ycyv":[function(require,module,exports) {
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

},{"./_object-keys":"knrM","./_object-gops":"EWMd","./_object-pie":"vjRp"}],"ayXv":[function(require,module,exports) {
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":"Z5df"}],"Ni5N":[function(require,module,exports) {
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = require('./_object-keys-internal');
var hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};

},{"./_object-keys-internal":"B9Lq","./_enum-bug-keys":"9bbv"}],"rMkZ":[function(require,module,exports) {
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject');
var gOPN = require('./_object-gopn').f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_to-iobject":"Wyka","./_object-gopn":"Ni5N"}],"sxPs":[function(require,module,exports) {
var pIE = require('./_object-pie');
var createDesc = require('./_property-desc');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var has = require('./_has');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};

},{"./_object-pie":"vjRp","./_property-desc":"uJ6d","./_to-iobject":"Wyka","./_to-primitive":"EKwp","./_has":"2uHg","./_ie8-dom-define":"R6c1","./_descriptors":"6MLN"}],"Aa2f":[function(require,module,exports) {

'use strict';
// ECMAScript 6 symbols shim
var global = require('./_global');
var has = require('./_has');
var DESCRIPTORS = require('./_descriptors');
var $export = require('./_export');
var redefine = require('./_redefine');
var META = require('./_meta').KEY;
var $fails = require('./_fails');
var shared = require('./_shared');
var setToStringTag = require('./_set-to-string-tag');
var uid = require('./_uid');
var wks = require('./_wks');
var wksExt = require('./_wks-ext');
var wksDefine = require('./_wks-define');
var enumKeys = require('./_enum-keys');
var isArray = require('./_is-array');
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var createDesc = require('./_property-desc');
var _create = require('./_object-create');
var gOPNExt = require('./_object-gopn-ext');
var $GOPD = require('./_object-gopd');
var $DP = require('./_object-dp');
var $keys = require('./_object-keys');
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !require('./_library')) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

},{"./_global":"5qf4","./_has":"2uHg","./_descriptors":"6MLN","./_export":"vSO4","./_redefine":"gojl","./_meta":"e8vu","./_fails":"5BXi","./_shared":"NB7d","./_set-to-string-tag":"11Ut","./_uid":"U49f","./_wks":"Ug9I","./_wks-ext":"ZxII","./_wks-define":"c2zY","./_enum-keys":"ycyv","./_is-array":"ayXv","./_an-object":"zotD","./_is-object":"M7z6","./_to-iobject":"Wyka","./_to-primitive":"EKwp","./_property-desc":"uJ6d","./_object-create":"TNJq","./_object-gopn-ext":"rMkZ","./_object-gopd":"sxPs","./_object-dp":"Gfzd","./_object-keys":"knrM","./_object-gopn":"Ni5N","./_object-pie":"vjRp","./_object-gops":"EWMd","./_library":"1kq3","./_hide":"akPY"}],"c6mp":[function(require,module,exports) {
require('./_wks-define')('asyncIterator');

},{"./_wks-define":"c2zY"}],"2mwf":[function(require,module,exports) {
require('./_wks-define')('observable');

},{"./_wks-define":"c2zY"}],"Ky5l":[function(require,module,exports) {
require('../../modules/es6.symbol');
require('../../modules/es6.object.to-string');
require('../../modules/es7.symbol.async-iterator');
require('../../modules/es7.symbol.observable');
module.exports = require('../../modules/_core').Symbol;

},{"../../modules/es6.symbol":"Aa2f","../../modules/es6.object.to-string":"70rD","../../modules/es7.symbol.async-iterator":"c6mp","../../modules/es7.symbol.observable":"2mwf","../../modules/_core":"ss9A"}],"ibPW":[function(require,module,exports) {
module.exports = { "default": require("core-js/library/fn/symbol"), __esModule: true };
},{"core-js/library/fn/symbol":"Ky5l"}],"GyB/":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var _iterator = require("../core-js/symbol/iterator");

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = require("../core-js/symbol");

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};
},{"../core-js/symbol/iterator":"6t7t","../core-js/symbol":"ibPW"}],"hEIm":[function(require,module,exports) {
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":"zotD"}],"af0K":[function(require,module,exports) {
// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":"JO4d","./_wks":"Ug9I"}],"vUQk":[function(require,module,exports) {
'use strict';
var $defineProperty = require('./_object-dp');
var createDesc = require('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

},{"./_object-dp":"Gfzd","./_property-desc":"uJ6d"}],"ZHvQ":[function(require,module,exports) {
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":"Z5df","./_wks":"Ug9I"}],"7AqT":[function(require,module,exports) {
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":"ZHvQ","./_wks":"Ug9I","./_iterators":"JO4d","./_core":"ss9A"}],"Lli7":[function(require,module,exports) {
var ITERATOR = require('./_wks')('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

},{"./_wks":"Ug9I"}],"N484":[function(require,module,exports) {
'use strict';
var ctx = require('./_ctx');
var $export = require('./_export');
var toObject = require('./_to-object');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var toLength = require('./_to-length');
var createProperty = require('./_create-property');
var getIterFn = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_ctx":"3zRh","./_export":"vSO4","./_to-object":"mbLO","./_iter-call":"hEIm","./_is-array-iter":"af0K","./_to-length":"S7IM","./_create-property":"vUQk","./core.get-iterator-method":"7AqT","./_iter-detect":"Lli7"}],"O35A":[function(require,module,exports) {
require('../../modules/es6.string.iterator');
require('../../modules/es6.array.from');
module.exports = require('../../modules/_core').Array.from;

},{"../../modules/es6.string.iterator":"i+u+","../../modules/es6.array.from":"N484","../../modules/_core":"ss9A"}],"VuZO":[function(require,module,exports) {
module.exports = { "default": require("core-js/library/fn/array/from"), __esModule: true };
},{"core-js/library/fn/array/from":"O35A"}],"mYpx":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var _from = require("../core-js/array/from");

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};
},{"../core-js/array/from":"VuZO"}],"uj5A":[function(require,module,exports) {
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;

},{"./_object-keys":"knrM","./_object-gops":"EWMd","./_object-pie":"vjRp","./_to-object":"mbLO","./_iobject":"E5Ce","./_fails":"5BXi"}],"YD0x":[function(require,module,exports) {
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', { assign: require('./_object-assign') });

},{"./_export":"vSO4","./_object-assign":"uj5A"}],"vcHl":[function(require,module,exports) {
require('../../modules/es6.object.assign');
module.exports = require('../../modules/_core').Object.assign;

},{"../../modules/es6.object.assign":"YD0x","../../modules/_core":"ss9A"}],"gc0D":[function(require,module,exports) {
module.exports = { "default": require("core-js/library/fn/object/assign"), __esModule: true };
},{"core-js/library/fn/object/assign":"vcHl"}],"T4f3":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var _assign = require("../core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
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
},{"../core-js/object/assign":"gc0D"}],"cOHw":[function(require,module,exports) {
// most Object methods by ES6 should accept primitives
var $export = require('./_export');
var core = require('./_core');
var fails = require('./_fails');
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};

},{"./_export":"vSO4","./_core":"ss9A","./_fails":"5BXi"}],"PDcB":[function(require,module,exports) {
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object');
var $keys = require('./_object-keys');

require('./_object-sap')('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});

},{"./_to-object":"mbLO","./_object-keys":"knrM","./_object-sap":"cOHw"}],"eOjq":[function(require,module,exports) {
require('../../modules/es6.object.keys');
module.exports = require('../../modules/_core').Object.keys;

},{"../../modules/es6.object.keys":"PDcB","../../modules/_core":"ss9A"}],"8FtN":[function(require,module,exports) {
module.exports = { "default": require("core-js/library/fn/object/keys"), __esModule: true };
},{"core-js/library/fn/object/keys":"eOjq"}],"7Kpw":[function(require,module,exports) {
// 20.1.2.3 Number.isInteger(number)
var isObject = require('./_is-object');
var floor = Math.floor;
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};

},{"./_is-object":"M7z6"}],"o/ds":[function(require,module,exports) {
// 20.1.2.3 Number.isInteger(number)
var $export = require('./_export');

$export($export.S, 'Number', { isInteger: require('./_is-integer') });

},{"./_export":"vSO4","./_is-integer":"7Kpw"}],"hCBp":[function(require,module,exports) {
require('../../modules/es6.number.is-integer');
module.exports = require('../../modules/_core').Number.isInteger;

},{"../../modules/es6.number.is-integer":"o/ds","../../modules/_core":"ss9A"}],"6/OP":[function(require,module,exports) {
module.exports = { "default": require("core-js/library/fn/number/is-integer"), __esModule: true };
},{"core-js/library/fn/number/is-integer":"hCBp"}],"zCAL":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

exports.default = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};
},{}],"Yu+T":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveIndex = exports.replace = exports.repeat = exports.remove = exports.reduceWhile = exports.reduceIf = exports.prepend = exports.isPossibleFromObject = exports.isLastIndex = exports.isKey = exports.insert = exports.fromObject = exports.cycleNext = exports.convertIfNot = exports.append = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("babel-runtime/helpers/toConsumableArray"));

var _newArrowCheck2 = _interopRequireDefault(require("babel-runtime/helpers/newArrowCheck"));

var _Fun = require("flow-static-land/lib/Fun");

var _extends2 = _interopRequireDefault(require("babel-runtime/helpers/extends"));

var _from = _interopRequireDefault(require("babel-runtime/core-js/array/from"));

var _keys = _interopRequireDefault(require("babel-runtime/core-js/object/keys"));

var _isInteger = _interopRequireDefault(require("babel-runtime/core-js/number/is-integer"));

var _objectWithoutProperties2 = _interopRequireDefault(require("babel-runtime/helpers/objectWithoutProperties"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _this = undefined;
/**
 * Returns a new Array with elements appended to the one given.
 */

var append = function (elements, array) {
  (0, _newArrowCheck2.default)(this, _this);
  return [].concat((0, _toConsumableArray2.default)(array), (0, _toConsumableArray2.default)(elements));
}.bind(undefined);

var append$1 = (0, _Fun.curry)(append);
exports.append = append$1;
var _this$1 = undefined;
/**
 * Returns input if it is an Array or returns a new Array with input inside if
 * it is not.
 */

var convertIfNot = function (input) {
  (0, _newArrowCheck2.default)(this, _this$1);
  return Array.isArray(input) ? input : [input];
}.bind(undefined);

exports.convertIfNot = convertIfNot;
var _this$3 = undefined;
/**
 * Returns true if given index is the last one or false otherwise.
 */

var isLastIndex = function (array, index) {
  (0, _newArrowCheck2.default)(this, _this$3);
  return index === array.length - 1;
}.bind(undefined);

var isLastIndex$1 = (0, _Fun.curry)(isLastIndex);
exports.isLastIndex = isLastIndex$1;
var _this$2 = undefined;
/**
 * Returns 0 if current index is the last one, or returns next if it is not.
 */

var cycleNext = function (array, currentIndex) {
  (0, _newArrowCheck2.default)(this, _this$2);
  return isLastIndex$1(array, currentIndex) ? 0 : currentIndex + 1;
}.bind(undefined);

var cycleNext$1 = (0, _Fun.curry)(cycleNext);
exports.cycleNext = cycleNext$1;
var _this$4 = undefined;

var getObjectLength = function (object) {
  (0, _newArrowCheck2.default)(this, _this$4);
  return Math.max.apply(Math, (0, _toConsumableArray2.default)((0, _keys.default)(object))) + 1;
}.bind(undefined);
/**
 * Creates a new array using the given object
 * If all of its entries are array keys.
 * 
 * (it could also have a property length with its size)
 */


var fromObject = function (object) {
  (0, _newArrowCheck2.default)(this, _this$4);
  return (0, _from.default)("length" in object ? object : (0, _extends2.default)({}, object, {
    length: getObjectLength(object)
  }));
}.bind(undefined);

exports.fromObject = fromObject;
var _this$5 = undefined;
/**
 * Returns a new Array with the result of having inserted the given elements at
 * the specified index.
 */

var insert = function (index, elements, array) {
  (0, _newArrowCheck2.default)(this, _this$5);
  return [].concat((0, _toConsumableArray2.default)(array.slice(0, index)), (0, _toConsumableArray2.default)(elements), (0, _toConsumableArray2.default)(array.slice(index + 1)));
}.bind(undefined);

var insert$1 = (0, _Fun.curry)(insert);
exports.insert = insert$1;
var _this$6 = undefined;

var isIntGreaterThan = function (number, other) {
  (0, _newArrowCheck2.default)(this, _this$6);
  return (0, _isInteger.default)(number) && number >= other;
}.bind(undefined);
/**
 * Returns true if the given string is an Array key or false otherwise.
 */


var isKey = function (string) {
  (0, _newArrowCheck2.default)(this, _this$6);
  return isIntGreaterThan(Number(string), 0);
}.bind(undefined);

exports.isKey = isKey;
var _this$7 = undefined;
/**
 * Returns true if an Array can be created from the given Object, or in other
 * words, if it has or not a length property, and the rest of its keys are Array
 * ones.
 */

var isPossibleFromObject = function (_ref) {
  var length = _ref.length,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["length"]);
  (0, _newArrowCheck2.default)(this, _this$7);
  return (0, _keys.default)(rest).every(isKey);
}.bind(undefined);

exports.isPossibleFromObject = isPossibleFromObject;
var _this$8 = undefined;
/**
 * Returns a new Array with elements prepended to the one given.
 */

var prepend = function (elements, array) {
  (0, _newArrowCheck2.default)(this, _this$8);
  return [].concat((0, _toConsumableArray2.default)(elements), (0, _toConsumableArray2.default)(array));
}.bind(undefined);

var prepend$1 = (0, _Fun.curry)(prepend);
exports.prepend = prepend$1;
var _this$9 = undefined;
/**
 * Reduce the given array applying reduce function only to elements filtered.
 */

var reduceIf = function (filter, reduce, resultInitial, array) {
  (0, _newArrowCheck2.default)(this, _this$9);
  return array.reduce(function (result, element, index) {
    (0, _newArrowCheck2.default)(this, _this$9);
    return filter(element, index, result) ? reduce(result, element, index) : result;
  }.bind(this), resultInitial);
}.bind(undefined);

var reduceIf$1 = (0, _Fun.curry)(reduceIf);
exports.reduceIf = reduceIf$1;
var _this$10 = undefined;
/**
 * Reduce the given array applying reduce function while shouldProceed function
 * returns true.
 */

var reduceWhile = function (shouldProceed, reduce, resultInitial, array) {
  (0, _newArrowCheck2.default)(this, _this$10);
  var result = resultInitial;
  array.every(function (element, index) {
    (0, _newArrowCheck2.default)(this, _this$10);
    var proceed = shouldProceed(element, index, result);

    if (proceed) {
      result = reduce(result, element, index);
    }

    return proceed;
  }.bind(this));
  return result;
}.bind(undefined);

var reduceWhile$1 = (0, _Fun.curry)(reduceWhile);
exports.reduceWhile = reduceWhile$1;
var _this$11 = undefined;
/**
 * Returns a new Array with the result of having removed the specified amount
 * (count) of elements at the given index.
 */

var remove = function (index, count, array) {
  (0, _newArrowCheck2.default)(this, _this$11);
  return [].concat((0, _toConsumableArray2.default)(array.slice(0, index)), (0, _toConsumableArray2.default)(array.slice(index + count)));
}.bind(undefined);

var remove$1 = (0, _Fun.curry)(remove);
exports.remove = remove$1;
var _this$12 = undefined;
/**
 * Returns a new Array with the given size (count) filled with the specified
 * element.
 */

var repeat = function (count, element) {
  (0, _newArrowCheck2.default)(this, _this$12);
  return [].concat((0, _toConsumableArray2.default)(Array(count))).map(function () {
    (0, _newArrowCheck2.default)(this, _this$12);
    return element;
  }.bind(this));
}.bind(undefined);

var repeat$1 = (0, _Fun.curry)(repeat);
exports.repeat = repeat$1;
var _this$13 = undefined;
/**
 * Returns a new Array with the result of having replaced the elements at the
 * given index with the ones specified.
 */

var replace = function (index, elements, array) {
  (0, _newArrowCheck2.default)(this, _this$13);
  return [].concat((0, _toConsumableArray2.default)(array.slice(0, index)), (0, _toConsumableArray2.default)(elements), (0, _toConsumableArray2.default)(array.slice(index + elements.length)));
}.bind(undefined);

var replace$1 = (0, _Fun.curry)(replace);
exports.replace = replace$1;
var _this$14 = undefined;
/**
 * Returns an absolute index from a relative one.
 * 
 * Relative indexes differ from absolute ones in that they can be negative and
 * in those cases it would be as simple as substracting them from the length of
 * the array from where they belong to obtain their absolute counterparts.
 */

var resolveIndex = function (array, relativeIndex) {
  (0, _newArrowCheck2.default)(this, _this$14);
  return relativeIndex < 0 ? array.length - relativeIndex : relativeIndex;
}.bind(undefined);

var resolveIndex$1 = (0, _Fun.curry)(resolveIndex);
exports.resolveIndex = resolveIndex$1;
},{"babel-runtime/helpers/toConsumableArray":"mYpx","babel-runtime/helpers/newArrowCheck":"EIvU","flow-static-land/lib/Fun":"o7wy","babel-runtime/helpers/extends":"T4f3","babel-runtime/core-js/array/from":"VuZO","babel-runtime/core-js/object/keys":"8FtN","babel-runtime/core-js/number/is-integer":"6/OP","babel-runtime/helpers/objectWithoutProperties":"zCAL"}],"jIGR":[function(require,module,exports) {
'use strict';

module.exports = function equal(a, b) {
  if (a === b) return true;

  var arrA = Array.isArray(a)
    , arrB = Array.isArray(b)
    , i;

  if (arrA && arrB) {
    if (a.length != b.length) return false;
    for (i = 0; i < a.length; i++)
      if (!equal(a[i], b[i])) return false;
    return true;
  }

  if (arrA != arrB) return false;

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    var keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) return false;

    var dateA = a instanceof Date
      , dateB = b instanceof Date;
    if (dateA && dateB) return a.getTime() == b.getTime();
    if (dateA != dateB) return false;

    var regexpA = a instanceof RegExp
      , regexpB = b instanceof RegExp;
    if (regexpA && regexpB) return a.toString() == b.toString();
    if (regexpA != regexpB) return false;

    for (i = 0; i < keys.length; i++)
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = 0; i < keys.length; i++)
      if(!equal(a[keys[i]], b[keys[i]])) return false;

    return true;
  }

  return false;
};

},{}],"htFH":[function(require,module,exports) {
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });

},{"./_export":"vSO4","./_descriptors":"6MLN","./_object-dp":"Gfzd"}],"3v7p":[function(require,module,exports) {
require('../../modules/es6.object.define-property');
var $Object = require('../../modules/_core').Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};

},{"../../modules/es6.object.define-property":"htFH","../../modules/_core":"ss9A"}],"FFZn":[function(require,module,exports) {
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":"3v7p"}],"Xos8":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var _defineProperty = require("../core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (obj, key, value) {
  if (key in obj) {
    (0, _defineProperty2.default)(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};
},{"../core-js/object/define-property":"FFZn"}],"By4a":[function(require,module,exports) {
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').isIterable = function (it) {
  var O = Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    // eslint-disable-next-line no-prototype-builtins
    || Iterators.hasOwnProperty(classof(O));
};

},{"./_classof":"ZHvQ","./_wks":"Ug9I","./_iterators":"JO4d","./_core":"ss9A"}],"TEgB":[function(require,module,exports) {
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.is-iterable');

},{"../modules/web.dom.iterable":"COf8","../modules/es6.string.iterator":"i+u+","../modules/core.is-iterable":"By4a"}],"gkZy":[function(require,module,exports) {
module.exports = { "default": require("core-js/library/fn/is-iterable"), __esModule: true };
},{"core-js/library/fn/is-iterable":"TEgB"}],"ugM7":[function(require,module,exports) {
var anObject = require('./_an-object');
var get = require('./core.get-iterator-method');
module.exports = require('./_core').getIterator = function (it) {
  var iterFn = get(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};

},{"./_an-object":"zotD","./core.get-iterator-method":"7AqT","./_core":"ss9A"}],"Lvd3":[function(require,module,exports) {
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.get-iterator');

},{"../modules/web.dom.iterable":"COf8","../modules/es6.string.iterator":"i+u+","../modules/core.get-iterator":"ugM7"}],"X9RM":[function(require,module,exports) {
module.exports = { "default": require("core-js/library/fn/get-iterator"), __esModule: true };
},{"core-js/library/fn/get-iterator":"Lvd3"}],"m8OI":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var _isIterable2 = require("../core-js/is-iterable");

var _isIterable3 = _interopRequireDefault(_isIterable2);

var _getIterator2 = require("../core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if ((0, _isIterable3.default)(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();
},{"../core-js/is-iterable":"gkZy","../core-js/get-iterator":"X9RM"}],"d/AR":[function(require,module,exports) {
var getKeys = require('./_object-keys');
var toIObject = require('./_to-iobject');
var isEnum = require('./_object-pie').f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it);
    var keys = getKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) if (isEnum.call(O, key = keys[i++])) {
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};

},{"./_object-keys":"knrM","./_to-iobject":"Wyka","./_object-pie":"vjRp"}],"Omhj":[function(require,module,exports) {
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export');
var $entries = require('./_object-to-array')(true);

$export($export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});

},{"./_export":"vSO4","./_object-to-array":"d/AR"}],"lQ0T":[function(require,module,exports) {
require('../../modules/es7.object.entries');
module.exports = require('../../modules/_core').Object.entries;

},{"../../modules/es7.object.entries":"Omhj","../../modules/_core":"ss9A"}],"FgrW":[function(require,module,exports) {
module.exports = { "default": require("core-js/library/fn/object/entries"), __esModule: true };
},{"core-js/library/fn/object/entries":"lQ0T"}],"7Q0f":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateIn = exports.toUndefinedIfEmpty = exports.shallowEqual = exports.shallowCopy = exports.setIn = exports.set = exports.removeIn = exports.remove = exports.map = exports.isEmpty = exports.is = exports.haveSameProps = exports.hasKey = exports.hasIn = exports.getKeys = exports.getIn = exports.get = void 0;

var _newArrowCheck2 = _interopRequireDefault(require("babel-runtime/helpers/newArrowCheck"));

var _Fun = require("flow-static-land/lib/Fun");

var _typeof2 = _interopRequireDefault(require("babel-runtime/helpers/typeof"));

var _utilsArray = require("@jumpn/utils-array");

var _keys = _interopRequireDefault(require("babel-runtime/core-js/object/keys"));

var _toConsumableArray2 = _interopRequireDefault(require("babel-runtime/helpers/toConsumableArray"));

var _fastDeepEqual = _interopRequireDefault(require("fast-deep-equal"));

var _defineProperty2 = _interopRequireDefault(require("babel-runtime/helpers/defineProperty"));

var _extends2 = _interopRequireDefault(require("babel-runtime/helpers/extends"));

var _slicedToArray2 = _interopRequireDefault(require("babel-runtime/helpers/slicedToArray"));

var _entries = _interopRequireDefault(require("babel-runtime/core-js/object/entries"));

var _objectWithoutProperties2 = _interopRequireDefault(require("babel-runtime/helpers/objectWithoutProperties"));

var _symbol = _interopRequireDefault(require("babel-runtime/core-js/symbol"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _this = void 0,
    get = function (e, r) {
  return (0, _newArrowCheck2.default)(this, _this), r[e];
}.bind(void 0),
    get$1 = (0, _Fun.curry)(get),
    _this$2 = void 0,
    isObject = function (e) {
  return (0, _newArrowCheck2.default)(this, _this$2), null !== e && "object" === (void 0 === e ? "undefined" : (0, _typeof2.default)(e));
}.bind(void 0),
    is = function (e) {
  return (0, _newArrowCheck2.default)(this, _this$2), Array.isArray(e) || isObject(e);
}.bind(void 0),
    _this$1 = void 0,
    getInIfNeeded = function (e, r, t) {
  return (0, _newArrowCheck2.default)(this, _this$1), (0, _utilsArray.isLastIndex)(r, e) ? t : getInRecur(e + 1, r, t);
}.bind(void 0),
    getNotCompositeErrorMessage = function (e, r, t) {
  return (0, _newArrowCheck2.default)(this, _this$1), "Expected to find a composite at [" + String(r.join(", ")) + "][" + String(e) + "], but instead got: " + (void 0 === t ? "undefined" : (0, _typeof2.default)(t));
}.bind(void 0),
    ensureIsComposite = function (e, r, t) {
  if ((0, _newArrowCheck2.default)(this, _this$1), is(t)) return t;
  throw new Error(getNotCompositeErrorMessage(e, r, t));
}.bind(void 0),
    getInRecur = function (e, r, t) {
  return (0, _newArrowCheck2.default)(this, _this$1), void 0 === t ? void 0 : getInIfNeeded(e, r, get$1(r[e], ensureIsComposite(e, r, t)));
}.bind(void 0),
    getIn = function (e, r) {
  return (0, _newArrowCheck2.default)(this, _this$1), 0 === e.length ? void 0 : getInRecur(0, e, r);
}.bind(void 0),
    getIn$1 = (0, _Fun.curry)(getIn),
    _this$3 = void 0,
    getKeys = function (e) {
  return (0, _newArrowCheck2.default)(this, _this$3), Array.isArray(e) ? [].concat((0, _toConsumableArray2.default)(e.keys())) : (0, _keys.default)(e);
}.bind(void 0),
    _this$4 = void 0,
    hasIn = function (e, r, t) {
  return (0, _newArrowCheck2.default)(this, _this$4), (0, _fastDeepEqual.default)(getIn$1(e, t), r);
}.bind(void 0),
    hasIn$1 = (0, _Fun.curry)(hasIn),
    _this$5 = void 0,
    hasKey = function (e, r) {
  return (0, _newArrowCheck2.default)(this, _this$5), Object.prototype.hasOwnProperty.call(r, e);
}.bind(void 0),
    hasKey$1 = (0, _Fun.curry)(hasKey),
    _this$6 = void 0,
    haveSameProps = function (e, r) {
  (0, _newArrowCheck2.default)(this, _this$6);
  var t = getKeys(e);
  return t.length === getKeys(r).length && t.every(function (t) {
    return (0, _newArrowCheck2.default)(this, _this$6), hasKey$1(t, r) && get$1(t, e) === get$1(t, r);
  }.bind(this));
}.bind(void 0),
    haveSameProps$1 = (0, _Fun.curry)(haveSameProps),
    _this$7 = void 0,
    isEmpty = function (e) {
  return (0, _newArrowCheck2.default)(this, _this$7), 0 === getKeys(e).length;
}.bind(void 0),
    _this$8 = void 0,
    mapObject = function (e, r) {
  return (0, _newArrowCheck2.default)(this, _this$8), (0, _entries.default)(r).reduce(function (t, i) {
    var n = (0, _slicedToArray2.default)(i, 2),
        o = n[0],
        s = n[1];
    return (0, _newArrowCheck2.default)(this, _this$8), (0, _extends2.default)({}, t, (0, _defineProperty2.default)({}, o, e(s, o, r)));
  }.bind(this), {});
}.bind(void 0),
    map = function (e, r) {
  return (0, _newArrowCheck2.default)(this, _this$8), Array.isArray(r) ? r.map(e) : mapObject(e, r);
}.bind(void 0),
    map$1 = (0, _Fun.curry)(map),
    _this$9 = void 0,
    objectRemove = function (e, r) {
  r[e];
  var t = (0, _objectWithoutProperties2.default)(r, [e]);
  return (0, _newArrowCheck2.default)(this, _this$9), t;
}.bind(void 0),
    remove$1 = function (e, r) {
  return (0, _newArrowCheck2.default)(this, _this$9), Array.isArray(r) ? (0, _utilsArray.remove)(e, 1, r) : objectRemove(e, r);
}.bind(void 0),
    remove$2 = (0, _Fun.curry)(remove$1),
    _this$12 = void 0,
    shallowCopy = function (e) {
  return (0, _newArrowCheck2.default)(this, _this$12), Array.isArray(e) ? [].concat((0, _toConsumableArray2.default)(e)) : (0, _extends2.default)({}, e);
}.bind(void 0),
    _this$11 = void 0,
    createReduceContext = function (e) {
  (0, _newArrowCheck2.default)(this, _this$11);
  var r = shallowCopy(e);
  return {
    origin: r,
    current: r,
    previous: void 0
  };
}.bind(void 0),
    set = function (e, r, t) {
  return (0, _newArrowCheck2.default)(this, _this$11), t[e] = r, get$1(e, t);
}.bind(void 0),
    updateSet = function (e, r, t, i) {
  return (0, _newArrowCheck2.default)(this, _this$11), (0, _extends2.default)({}, i, {
    current: set(e[r], t, i.current),
    previous: i.current
  });
}.bind(void 0),
    updateRemove = function (e, r, t) {
  (0, _newArrowCheck2.default)(this, _this$11);
  var i = remove$2(e[r], t.current);
  return 0 === r ? (0, _extends2.default)({}, t, {
    current: i,
    origin: i
  }) : (0, _extends2.default)({}, t, {
    previous: set(e[r - 1], i, t.previous)
  });
}.bind(void 0),
    removeAction = (0, _symbol.default)("composite.updateIn.removeAction"),
    update = function (e, r, t, i) {
  return (0, _newArrowCheck2.default)(this, _this$11), t === removeAction ? updateRemove(e, r, i) : updateSet(e, r, t, i);
}.bind(void 0),
    createSupporting = function (e) {
  return (0, _newArrowCheck2.default)(this, _this$11), "number" == typeof e ? [] : {};
}.bind(void 0),
    copyOrCreate = function (e, r, t) {
  return (0, _newArrowCheck2.default)(this, _this$11), hasKey$1(e, t) ? shallowCopy(get$1(e, t)) : createSupporting(r);
}.bind(void 0),
    getNext = function (e, r, t, i) {
  return (0, _newArrowCheck2.default)(this, _this$11), (0, _utilsArray.isLastIndex)(e, t) ? r(get$1(e[t], i)) : copyOrCreate(e[t], e[t + 1], i);
}.bind(void 0),
    getReducer = function (e, r) {
  return (0, _newArrowCheck2.default)(this, _this$11), function (t, i, n) {
    return (0, _newArrowCheck2.default)(this, _this$11), update(e, n, getNext(e, r, n, t.current), t);
  }.bind(this);
}.bind(void 0),
    updateIn = function (e, r, t) {
  return (0, _newArrowCheck2.default)(this, _this$11), 0 === e.length ? t : e.reduce(getReducer(e, r), createReduceContext(t)).origin;
}.bind(void 0),
    updateInCurried = (0, _Fun.curry)(updateIn);

exports.updateIn = updateInCurried;
exports.shallowCopy = shallowCopy;
exports.remove = remove$2;
exports.map = map$1;
exports.isEmpty = isEmpty;
exports.haveSameProps = haveSameProps$1;
exports.hasKey = hasKey$1;
exports.hasIn = hasIn$1;
exports.getKeys = getKeys;
exports.getIn = getIn$1;
exports.is = is;
exports.get = get$1;
updateInCurried.remove = removeAction;

var _this$10 = void 0,
    remove$3 = function () {
  return (0, _newArrowCheck2.default)(this, _this$10), updateInCurried.remove;
}.bind(void 0),
    removeIn = function (e, r) {
  return (0, _newArrowCheck2.default)(this, _this$10), updateInCurried(e, remove$3, r);
}.bind(void 0),
    removeIn$1 = (0, _Fun.curry)(removeIn),
    _this$13 = void 0,
    set$1 = function (e, r, t) {
  (0, _newArrowCheck2.default)(this, _this$13);
  var i = shallowCopy(t);
  return i[e] = r, i;
}.bind(void 0),
    set$2 = (0, _Fun.curry)(set$1),
    _this$14 = void 0,
    setIn = function (e, r, t) {
  return (0, _newArrowCheck2.default)(this, _this$14), updateInCurried(e, function () {
    return (0, _newArrowCheck2.default)(this, _this$14), r;
  }.bind(this), t);
}.bind(void 0),
    setIn$1 = (0, _Fun.curry)(setIn),
    _this$15 = void 0,
    xor = function (e, r) {
  return (0, _newArrowCheck2.default)(this, _this$15), Boolean(Number(e) ^ Number(r));
}.bind(void 0),
    shallowEqual = function (e, r) {
  return (0, _newArrowCheck2.default)(this, _this$15), e === r || !xor(Array.isArray(e), Array.isArray(r)) && haveSameProps$1(e, r);
}.bind(void 0),
    shallowEqual$1 = (0, _Fun.curry)(shallowEqual),
    _this$16 = void 0,
    toUndefinedIfEmpty = function (e) {
  return (0, _newArrowCheck2.default)(this, _this$16), isEmpty(e) ? void 0 : e;
}.bind(void 0); //# sourceMappingURL=index.js.map


exports.toUndefinedIfEmpty = toUndefinedIfEmpty;
exports.shallowEqual = shallowEqual$1;
exports.setIn = setIn$1;
exports.set = set$2;
exports.removeIn = removeIn$1;
},{"babel-runtime/helpers/newArrowCheck":"EIvU","flow-static-land/lib/Fun":"o7wy","babel-runtime/helpers/typeof":"GyB/","@jumpn/utils-array":"Yu+T","babel-runtime/core-js/object/keys":"8FtN","babel-runtime/helpers/toConsumableArray":"mYpx","fast-deep-equal":"jIGR","babel-runtime/helpers/defineProperty":"Xos8","babel-runtime/helpers/extends":"T4f3","babel-runtime/helpers/slicedToArray":"m8OI","babel-runtime/core-js/object/entries":"FgrW","babel-runtime/helpers/objectWithoutProperties":"zCAL","babel-runtime/core-js/symbol":"ibPW"}],"XFqm":[function(require,module,exports) {
var define;
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.Phoenix=t():e.Phoenix=t()}(this,function(){return function(e){var t={};function n(i){if(t[i])return t[i].exports;var o=t[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(i,o,function(t){return e[t]}.bind(null,o));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){(function(t){e.exports=t.Phoenix=n(2)}).call(this,n(1))},function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){"use strict";function i(e){return function(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function r(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=[],i=!0,o=!1,r=void 0;try{for(var s,a=e[Symbol.iterator]();!(i=(s=a.next()).done)&&(n.push(s.value),!t||n.length!==t);i=!0);}catch(e){o=!0,r=e}finally{try{i||null==a.return||a.return()}finally{if(o)throw r}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function c(e,t,n){return t&&a(e.prototype,t),n&&a(e,n),e}n.r(t),n.d(t,"Channel",function(){return b}),n.d(t,"Serializer",function(){return j}),n.d(t,"Socket",function(){return R}),n.d(t,"LongPoll",function(){return C}),n.d(t,"Ajax",function(){return T}),n.d(t,"Presence",function(){return w});var u="undefined"!=typeof self?self:null,h="undefined"!=typeof window?window:null,l=u||h||void 0,f={connecting:0,open:1,closing:2,closed:3},d=1e4,p={closed:"closed",errored:"errored",joined:"joined",joining:"joining",leaving:"leaving"},v={close:"phx_close",error:"phx_error",join:"phx_join",reply:"phx_reply",leave:"phx_leave"},y=[v.close,v.error,v.join,v.reply,v.leave],m={longpoll:"longpoll",websocket:"websocket"},g=function(e){if("function"==typeof e)return e;return function(){return e}},k=function(){function e(t,n,i,o){s(this,e),this.channel=t,this.event=n,this.payload=i||function(){return{}},this.receivedResp=null,this.timeout=o,this.timeoutTimer=null,this.recHooks=[],this.sent=!1}return c(e,[{key:"resend",value:function(e){this.timeout=e,this.reset(),this.send()}},{key:"send",value:function(){this.hasReceived("timeout")||(this.startTimeout(),this.sent=!0,this.channel.socket.push({topic:this.channel.topic,event:this.event,payload:this.payload(),ref:this.ref,join_ref:this.channel.joinRef()}))}},{key:"receive",value:function(e,t){return this.hasReceived(e)&&t(this.receivedResp.response),this.recHooks.push({status:e,callback:t}),this}},{key:"reset",value:function(){this.cancelRefEvent(),this.ref=null,this.refEvent=null,this.receivedResp=null,this.sent=!1}},{key:"matchReceive",value:function(e){var t=e.status,n=e.response;e.ref;this.recHooks.filter(function(e){return e.status===t}).forEach(function(e){return e.callback(n)})}},{key:"cancelRefEvent",value:function(){this.refEvent&&this.channel.off(this.refEvent)}},{key:"cancelTimeout",value:function(){clearTimeout(this.timeoutTimer),this.timeoutTimer=null}},{key:"startTimeout",value:function(){var e=this;this.timeoutTimer&&this.cancelTimeout(),this.ref=this.channel.socket.makeRef(),this.refEvent=this.channel.replyEventName(this.ref),this.channel.on(this.refEvent,function(t){e.cancelRefEvent(),e.cancelTimeout(),e.receivedResp=t,e.matchReceive(t)}),this.timeoutTimer=setTimeout(function(){e.trigger("timeout",{})},this.timeout)}},{key:"hasReceived",value:function(e){return this.receivedResp&&this.receivedResp.status===e}},{key:"trigger",value:function(e,t){this.channel.trigger(this.refEvent,{status:e,response:t})}}]),e}(),b=function(){function e(t,n,i){var o=this;s(this,e),this.state=p.closed,this.topic=t,this.params=g(n||{}),this.socket=i,this.bindings=[],this.bindingRef=0,this.timeout=this.socket.timeout,this.joinedOnce=!1,this.joinPush=new k(this,v.join,this.params,this.timeout),this.pushBuffer=[],this.rejoinTimer=new E(function(){o.socket.isConnected()&&o.rejoin()},this.socket.rejoinAfterMs),this.socket.onError(function(){return o.rejoinTimer.reset()}),this.socket.onOpen(function(){o.rejoinTimer.reset(),o.isErrored()&&o.rejoin()}),this.joinPush.receive("ok",function(){o.state=p.joined,o.rejoinTimer.reset(),o.pushBuffer.forEach(function(e){return e.send()}),o.pushBuffer=[]}),this.joinPush.receive("error",function(){o.state=p.errored,o.socket.isConnected()&&o.rejoinTimer.scheduleTimeout()}),this.onClose(function(){o.rejoinTimer.reset(),o.socket.hasLogger()&&o.socket.log("channel","close ".concat(o.topic," ").concat(o.joinRef())),o.state=p.closed,o.socket.remove(o)}),this.onError(function(e){o.socket.hasLogger()&&o.socket.log("channel","error ".concat(o.topic),e),o.isJoining()&&o.joinPush.reset(),o.state=p.errored,o.socket.isConnected()&&o.rejoinTimer.scheduleTimeout()}),this.joinPush.receive("timeout",function(){o.socket.hasLogger()&&o.socket.log("channel","timeout ".concat(o.topic," (").concat(o.joinRef(),")"),o.joinPush.timeout),new k(o,v.leave,g({}),o.timeout).send(),o.state=p.errored,o.joinPush.reset(),o.socket.isConnected()&&o.rejoinTimer.scheduleTimeout()}),this.on(v.reply,function(e,t){o.trigger(o.replyEventName(t),e)})}return c(e,[{key:"join",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.timeout;if(this.joinedOnce)throw new Error("tried to join multiple times. 'join' can only be called a single time per channel instance");return this.timeout=e,this.joinedOnce=!0,this.rejoin(),this.joinPush}},{key:"onClose",value:function(e){this.on(v.close,e)}},{key:"onError",value:function(e){return this.on(v.error,function(t){return e(t)})}},{key:"on",value:function(e,t){var n=this.bindingRef++;return this.bindings.push({event:e,ref:n,callback:t}),n}},{key:"off",value:function(e,t){this.bindings=this.bindings.filter(function(n){return!(n.event===e&&(void 0===t||t===n.ref))})}},{key:"canPush",value:function(){return this.socket.isConnected()&&this.isJoined()}},{key:"push",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:this.timeout;if(!this.joinedOnce)throw new Error("tried to push '".concat(e,"' to '").concat(this.topic,"' before joining. Use channel.join() before pushing events"));var i=new k(this,e,function(){return t},n);return this.canPush()?i.send():(i.startTimeout(),this.pushBuffer.push(i)),i}},{key:"leave",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.timeout;this.rejoinTimer.reset(),this.joinPush.cancelTimeout(),this.state=p.leaving;var n=function(){e.socket.hasLogger()&&e.socket.log("channel","leave ".concat(e.topic)),e.trigger(v.close,"leave")},i=new k(this,v.leave,g({}),t);return i.receive("ok",function(){return n()}).receive("timeout",function(){return n()}),i.send(),this.canPush()||i.trigger("ok",{}),i}},{key:"onMessage",value:function(e,t,n){return t}},{key:"isLifecycleEvent",value:function(e){return y.indexOf(e)>=0}},{key:"isMember",value:function(e,t,n,i){return this.topic===e&&(!i||i===this.joinRef()||!this.isLifecycleEvent(t)||(this.socket.hasLogger()&&this.socket.log("channel","dropping outdated message",{topic:e,event:t,payload:n,joinRef:i}),!1))}},{key:"joinRef",value:function(){return this.joinPush.ref}},{key:"sendJoin",value:function(e){this.state=p.joining,this.joinPush.resend(e)}},{key:"rejoin",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.timeout;this.isLeaving()||this.sendJoin(e)}},{key:"trigger",value:function(e,t,n,i){var o=this.onMessage(e,t,n,i);if(t&&!o)throw new Error("channel onMessage callbacks must return the payload, modified or unmodified");for(var r=0;r<this.bindings.length;r++){var s=this.bindings[r];s.event===e&&s.callback(o,n,i||this.joinRef())}}},{key:"replyEventName",value:function(e){return"chan_reply_".concat(e)}},{key:"isClosed",value:function(){return this.state===p.closed}},{key:"isErrored",value:function(){return this.state===p.errored}},{key:"isJoined",value:function(){return this.state===p.joined}},{key:"isJoining",value:function(){return this.state===p.joining}},{key:"isLeaving",value:function(){return this.state===p.leaving}}]),e}(),j={encode:function(e,t){var n=[e.join_ref,e.ref,e.topic,e.event,e.payload];return t(JSON.stringify(n))},decode:function(e,t){var n=r(JSON.parse(e),5);return t({join_ref:n[0],ref:n[1],topic:n[2],event:n[3],payload:n[4]})}},R=function(){function e(t){var n=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};s(this,e),this.stateChangeCallbacks={open:[],close:[],error:[],message:[]},this.channels=[],this.sendBuffer=[],this.ref=0,this.timeout=i.timeout||d,this.transport=i.transport||l.WebSocket||C,this.defaultEncoder=j.encode,this.defaultDecoder=j.decode,this.closeWasClean=!1,this.unloaded=!1,this.binaryType=i.binaryType||"arraybuffer",this.transport!==C?(this.encode=i.encode||this.defaultEncoder,this.decode=i.decode||this.defaultDecoder):(this.encode=this.defaultEncoder,this.decode=this.defaultDecoder),h&&h.addEventListener&&h.addEventListener("beforeunload",function(e){n.conn&&(n.unloaded=!0,n.abnormalClose("unloaded"))}),this.heartbeatIntervalMs=i.heartbeatIntervalMs||3e4,this.rejoinAfterMs=function(e){return i.rejoinAfterMs?i.rejoinAfterMs(e):[1e3,2e3,5e3][e-1]||1e4},this.reconnectAfterMs=function(e){return n.unloaded?100:i.reconnectAfterMs?i.reconnectAfterMs(e):[10,50,100,150,200,250,500,1e3,2e3][e-1]||5e3},this.logger=i.logger||null,this.longpollerTimeout=i.longpollerTimeout||2e4,this.params=g(i.params||{}),this.endPoint="".concat(t,"/").concat(m.websocket),this.heartbeatTimer=null,this.pendingHeartbeatRef=null,this.reconnectTimer=new E(function(){n.teardown(function(){return n.connect()})},this.reconnectAfterMs)}return c(e,[{key:"protocol",value:function(){return location.protocol.match(/^https/)?"wss":"ws"}},{key:"endPointURL",value:function(){var e=T.appendParams(T.appendParams(this.endPoint,this.params()),{vsn:"2.0.0"});return"/"!==e.charAt(0)?e:"/"===e.charAt(1)?"".concat(this.protocol(),":").concat(e):"".concat(this.protocol(),"://").concat(location.host).concat(e)}},{key:"disconnect",value:function(e,t,n){this.closeWasClean=!0,this.reconnectTimer.reset(),this.teardown(e,t,n)}},{key:"connect",value:function(e){var t=this;e&&(console&&console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor"),this.params=g(e)),this.conn||(this.closeWasClean=!1,this.conn=new this.transport(this.endPointURL()),this.conn.binaryType=this.binaryType,this.conn.timeout=this.longpollerTimeout,this.conn.onopen=function(){return t.onConnOpen()},this.conn.onerror=function(e){return t.onConnError(e)},this.conn.onmessage=function(e){return t.onConnMessage(e)},this.conn.onclose=function(e){return t.onConnClose(e)})}},{key:"log",value:function(e,t,n){this.logger(e,t,n)}},{key:"hasLogger",value:function(){return null!==this.logger}},{key:"onOpen",value:function(e){this.stateChangeCallbacks.open.push(e)}},{key:"onClose",value:function(e){this.stateChangeCallbacks.close.push(e)}},{key:"onError",value:function(e){this.stateChangeCallbacks.error.push(e)}},{key:"onMessage",value:function(e){this.stateChangeCallbacks.message.push(e)}},{key:"onConnOpen",value:function(){this.hasLogger()&&this.log("transport","connected to ".concat(this.endPointURL())),this.unloaded=!1,this.closeWasClean=!1,this.flushSendBuffer(),this.reconnectTimer.reset(),this.resetHeartbeat(),this.stateChangeCallbacks.open.forEach(function(e){return e()})}},{key:"resetHeartbeat",value:function(){var e=this;this.conn&&this.conn.skipHeartbeat||(this.pendingHeartbeatRef=null,clearInterval(this.heartbeatTimer),this.heartbeatTimer=setInterval(function(){return e.sendHeartbeat()},this.heartbeatIntervalMs))}},{key:"teardown",value:function(e,t,n){this.conn&&(this.conn.onclose=function(){},t?this.conn.close(t,n||""):this.conn.close(),this.conn=null),e&&e()}},{key:"onConnClose",value:function(e){this.hasLogger()&&this.log("transport","close",e),this.triggerChanError(),clearInterval(this.heartbeatTimer),this.closeWasClean||this.reconnectTimer.scheduleTimeout(),this.stateChangeCallbacks.close.forEach(function(t){return t(e)})}},{key:"onConnError",value:function(e){this.hasLogger()&&this.log("transport",e),this.triggerChanError(),this.stateChangeCallbacks.error.forEach(function(t){return t(e)})}},{key:"triggerChanError",value:function(){this.channels.forEach(function(e){e.isErrored()||e.isLeaving()||e.isClosed()||e.trigger(v.error)})}},{key:"connectionState",value:function(){switch(this.conn&&this.conn.readyState){case f.connecting:return"connecting";case f.open:return"open";case f.closing:return"closing";default:return"closed"}}},{key:"isConnected",value:function(){return"open"===this.connectionState()}},{key:"remove",value:function(e){this.channels=this.channels.filter(function(t){return t.joinRef()!==e.joinRef()})}},{key:"channel",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=new b(e,t,this);return this.channels.push(n),n}},{key:"push",value:function(e){var t=this;if(this.hasLogger()){var n=e.topic,i=e.event,o=e.payload,r=e.ref,s=e.join_ref;this.log("push","".concat(n," ").concat(i," (").concat(s,", ").concat(r,")"),o)}this.isConnected()?this.encode(e,function(e){return t.conn.send(e)}):this.sendBuffer.push(function(){return t.encode(e,function(e){return t.conn.send(e)})})}},{key:"makeRef",value:function(){var e=this.ref+1;return e===this.ref?this.ref=0:this.ref=e,this.ref.toString()}},{key:"sendHeartbeat",value:function(){if(this.isConnected()){if(this.pendingHeartbeatRef)return this.pendingHeartbeatRef=null,this.hasLogger()&&this.log("transport","heartbeat timeout. Attempting to re-establish connection"),void this.abnormalClose("heartbeat timeout");this.pendingHeartbeatRef=this.makeRef(),this.push({topic:"phoenix",event:"heartbeat",payload:{},ref:this.pendingHeartbeatRef})}}},{key:"abnormalClose",value:function(e){this.closeWasClean=!1,this.conn.close(1e3,e)}},{key:"flushSendBuffer",value:function(){this.isConnected()&&this.sendBuffer.length>0&&(this.sendBuffer.forEach(function(e){return e()}),this.sendBuffer=[])}},{key:"onConnMessage",value:function(e){var t=this;this.decode(e.data,function(e){var n=e.topic,i=e.event,o=e.payload,r=e.ref,s=e.join_ref;r&&r===t.pendingHeartbeatRef&&(t.pendingHeartbeatRef=null),t.hasLogger()&&t.log("receive","".concat(o.status||""," ").concat(n," ").concat(i," ").concat(r&&"("+r+")"||""),o);for(var a=0;a<t.channels.length;a++){var c=t.channels[a];c.isMember(n,i,o,s)&&c.trigger(i,o,r,s)}for(var u=0;u<t.stateChangeCallbacks.message.length;u++)t.stateChangeCallbacks.message[u](e)})}}]),e}(),C=function(){function e(t){s(this,e),this.endPoint=null,this.token=null,this.skipHeartbeat=!0,this.onopen=function(){},this.onerror=function(){},this.onmessage=function(){},this.onclose=function(){},this.pollEndpoint=this.normalizeEndpoint(t),this.readyState=f.connecting,this.poll()}return c(e,[{key:"normalizeEndpoint",value:function(e){return e.replace("ws://","http://").replace("wss://","https://").replace(new RegExp("(.*)/"+m.websocket),"$1/"+m.longpoll)}},{key:"endpointURL",value:function(){return T.appendParams(this.pollEndpoint,{token:this.token})}},{key:"closeAndRetry",value:function(){this.close(),this.readyState=f.connecting}},{key:"ontimeout",value:function(){this.onerror("timeout"),this.closeAndRetry()}},{key:"poll",value:function(){var e=this;this.readyState!==f.open&&this.readyState!==f.connecting||T.request("GET",this.endpointURL(),"application/json",null,this.timeout,this.ontimeout.bind(this),function(t){if(t){var n=t.status,i=t.token,o=t.messages;e.token=i}else n=0;switch(n){case 200:o.forEach(function(t){return e.onmessage({data:t})}),e.poll();break;case 204:e.poll();break;case 410:e.readyState=f.open,e.onopen(),e.poll();break;case 0:case 500:e.onerror(),e.closeAndRetry();break;default:throw new Error("unhandled poll status ".concat(n))}})}},{key:"send",value:function(e){var t=this;T.request("POST",this.endpointURL(),"application/json",e,this.timeout,this.onerror.bind(this,"timeout"),function(e){e&&200===e.status||(t.onerror(e&&e.status),t.closeAndRetry())})}},{key:"close",value:function(e,t){this.readyState=f.closed,this.onclose()}}]),e}(),T=function(){function e(){s(this,e)}return c(e,null,[{key:"request",value:function(e,t,n,i,o,r,s){if(l.XDomainRequest){var a=new XDomainRequest;this.xdomainRequest(a,e,t,i,o,r,s)}else{var c=l.XMLHttpRequest?new l.XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP");this.xhrRequest(c,e,t,n,i,o,r,s)}}},{key:"xdomainRequest",value:function(e,t,n,i,o,r,s){var a=this;e.timeout=o,e.open(t,n),e.onload=function(){var t=a.parseJSON(e.responseText);s&&s(t)},r&&(e.ontimeout=r),e.onprogress=function(){},e.send(i)}},{key:"xhrRequest",value:function(e,t,n,i,o,r,s,a){var c=this;e.open(t,n,!0),e.timeout=r,e.setRequestHeader("Content-Type",i),e.onerror=function(){a&&a(null)},e.onreadystatechange=function(){if(e.readyState===c.states.complete&&a){var t=c.parseJSON(e.responseText);a(t)}},s&&(e.ontimeout=s),e.send(o)}},{key:"parseJSON",value:function(e){if(!e||""===e)return null;try{return JSON.parse(e)}catch(t){return console&&console.log("failed to parse JSON response",e),null}}},{key:"serialize",value:function(e,t){var n=[];for(var i in e)if(e.hasOwnProperty(i)){var r=t?"".concat(t,"[").concat(i,"]"):i,s=e[i];"object"===o(s)?n.push(this.serialize(s,r)):n.push(encodeURIComponent(r)+"="+encodeURIComponent(s))}return n.join("&")}},{key:"appendParams",value:function(e,t){if(0===Object.keys(t).length)return e;var n=e.match(/\?/)?"&":"?";return"".concat(e).concat(n).concat(this.serialize(t))}}]),e}();T.states={complete:4};var w=function(){function e(t){var n=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};s(this,e);var o=i.events||{state:"presence_state",diff:"presence_diff"};this.state={},this.pendingDiffs=[],this.channel=t,this.joinRef=null,this.caller={onJoin:function(){},onLeave:function(){},onSync:function(){}},this.channel.on(o.state,function(t){var i=n.caller,o=i.onJoin,r=i.onLeave,s=i.onSync;n.joinRef=n.channel.joinRef(),n.state=e.syncState(n.state,t,o,r),n.pendingDiffs.forEach(function(t){n.state=e.syncDiff(n.state,t,o,r)}),n.pendingDiffs=[],s()}),this.channel.on(o.diff,function(t){var i=n.caller,o=i.onJoin,r=i.onLeave,s=i.onSync;n.inPendingSyncState()?n.pendingDiffs.push(t):(n.state=e.syncDiff(n.state,t,o,r),s())})}return c(e,[{key:"onJoin",value:function(e){this.caller.onJoin=e}},{key:"onLeave",value:function(e){this.caller.onLeave=e}},{key:"onSync",value:function(e){this.caller.onSync=e}},{key:"list",value:function(t){return e.list(this.state,t)}},{key:"inPendingSyncState",value:function(){return!this.joinRef||this.joinRef!==this.channel.joinRef()}}],[{key:"syncState",value:function(e,t,n,i){var o=this,r=this.clone(e),s={},a={};return this.map(r,function(e,n){t[e]||(a[e]=n)}),this.map(t,function(e,t){var n=r[e];if(n){var i=t.metas.map(function(e){return e.phx_ref}),c=n.metas.map(function(e){return e.phx_ref}),u=t.metas.filter(function(e){return c.indexOf(e.phx_ref)<0}),h=n.metas.filter(function(e){return i.indexOf(e.phx_ref)<0});u.length>0&&(s[e]=t,s[e].metas=u),h.length>0&&(a[e]=o.clone(n),a[e].metas=h)}else s[e]=t}),this.syncDiff(r,{joins:s,leaves:a},n,i)}},{key:"syncDiff",value:function(e,t,n,o){var r=t.joins,s=t.leaves,a=this.clone(e);return n||(n=function(){}),o||(o=function(){}),this.map(r,function(e,t){var o=a[e];if(a[e]=t,o){var r,s=a[e].metas.map(function(e){return e.phx_ref}),c=o.metas.filter(function(e){return s.indexOf(e.phx_ref)<0});(r=a[e].metas).unshift.apply(r,i(c))}n(e,o,t)}),this.map(s,function(e,t){var n=a[e];if(n){var i=t.metas.map(function(e){return e.phx_ref});n.metas=n.metas.filter(function(e){return i.indexOf(e.phx_ref)<0}),o(e,n,t),0===n.metas.length&&delete a[e]}}),a}},{key:"list",value:function(e,t){return t||(t=function(e,t){return t}),this.map(e,function(e,n){return t(e,n)})}},{key:"map",value:function(e,t){return Object.getOwnPropertyNames(e).map(function(n){return t(n,e[n])})}},{key:"clone",value:function(e){return JSON.parse(JSON.stringify(e))}}]),e}(),E=function(){function e(t,n){s(this,e),this.callback=t,this.timerCalc=n,this.timer=null,this.tries=0}return c(e,[{key:"reset",value:function(){this.tries=0,clearTimeout(this.timer)}},{key:"scheduleTimeout",value:function(){var e=this;clearTimeout(this.timer),this.timer=setTimeout(function(){e.tries=e.tries+1,e.callback()},this.timerCalc(this.tries+1))}}]),e}()}])});
},{}],"XfJI":[function(require,module,exports) {
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }
}

module.exports = _arrayWithoutHoles;
},{}],"OMTj":[function(require,module,exports) {
function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

module.exports = _iterableToArray;
},{}],"wF/n":[function(require,module,exports) {
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

module.exports = _nonIterableSpread;
},{}],"Fhqp":[function(require,module,exports) {
var arrayWithoutHoles = require("./arrayWithoutHoles");

var iterableToArray = require("./iterableToArray");

var nonIterableSpread = require("./nonIterableSpread");

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;
},{"./arrayWithoutHoles":"XfJI","./iterableToArray":"OMTj","./nonIterableSpread":"wF/n"}],"tS9b":[function(require,module,exports) {
function _newArrowCheck(innerThis, boundThis) {
  if (innerThis !== boundThis) {
    throw new TypeError("Cannot instantiate an arrow function");
  }
}

module.exports = _newArrowCheck;
},{}],"2hqA":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestToCompat = exports.requestFromCompat = exports.hasSubscription = exports.getOperationType = exports.errorsToString = void 0;

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.regexp.match");

require("core-js/modules/es6.array.some");

require("core-js/modules/es6.function.bind");

var _newArrowCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/newArrowCheck"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _this = undefined;

var locationsToString = function locationsToString(locations) {
  var _this2 = this;

  (0, _newArrowCheck2.default)(this, _this);
  return locations.map(function (_ref) {
    var column = _ref.column,
        line = _ref.line;
    (0, _newArrowCheck2.default)(this, _this2);
    return "".concat(line, ":").concat(column);
  }.bind(this)).join("; ");
}.bind(undefined);

var errorToString = function errorToString(_ref2) {
  var message = _ref2.message,
      locations = _ref2.locations;
  (0, _newArrowCheck2.default)(this, _this);
  return message + (locations ? " (".concat(locationsToString(locations), ")") : "");
}.bind(undefined);
/**
 * Transforms an array of GqlError into a string.
 *
 * @example
 *
 * const gqlRespose = {
 *   errors: [
 *     {message: "First Error", locations: [{column: 10, line: 2}]},
 *     {message: "Second Error", locations: [{column: 2, line: 4}]}
 *   ]
 * }
 *
 * const error = errorsToString(gqlRespose.errors);
 * // string with the following:
 * // First Error (2:10)
 * // Second Error (4:2)
 */


var errorsToString = function errorsToString(gqlErrors) {
  (0, _newArrowCheck2.default)(this, _this);
  return gqlErrors.map(errorToString).join("\n");
}.bind(undefined);

exports.errorsToString = errorsToString;
var _this$1 = undefined;
var operationTypeRe = /^\s*(query|mutation|subscription|\{)/;

var getOperationTypeFromMatched = function getOperationTypeFromMatched(matched) {
  (0, _newArrowCheck2.default)(this, _this$1);
  return matched === "{" ? "query" : matched;
}.bind(undefined);
/**
 * Returns the type (query, mutation, or subscription) of the given operation
 *
 * @example
 *
 * const operation = `
 *   subscription userSubscription($userId: ID!) {
 *     user(userId: $userId) {
 *       id
 *       name
 *     }
 *   }
 * `;
 *
 * const operationType = getOperationType(operation);
 *
 * console.log(operationType); // "subscription"
 */


var getOperationType = function getOperationType(operation) {
  (0, _newArrowCheck2.default)(this, _this$1);
  var result = operation.match(operationTypeRe);

  if (!result) {
    throw new TypeError("Invalid operation:\n".concat(operation));
  }

  return getOperationTypeFromMatched(result[1]);
}.bind(undefined);

exports.getOperationType = getOperationType;
var _this$2 = undefined;

var isSubscription = function isSubscription(definition) {
  (0, _newArrowCheck2.default)(this, _this$2);
  return definition.kind === "OperationDefinition" && definition.operation === "subscription";
}.bind(undefined);
/**
 * Returns true if documentNode has a subscription or false otherwise
 */


var hasSubscription = function hasSubscription(documentNode) {
  (0, _newArrowCheck2.default)(this, _this$2);
  return documentNode.definitions.some(isSubscription);
}.bind(undefined);

exports.hasSubscription = hasSubscription;
var _this$3 = undefined;
/**
 * Creates a GqlRequest using given GqlRequestCompat
 *
 * @param {GqlRequestCompat<Variables>} gqlRequestCompat
 *
 * @return {GqlRequest<Variables>} 
 *
 * @example
 * const query = `
 *   query userQuery($userId: ID!) {
 *     user(userId: $userId) {
 *       id
 *       email
 *     }
 *   }
 * `;
 * 
 * console.log(requestFromCompat({query, variables: {userId: 10}}));
 * // {operation: "...", variables: {userId: 10}}
 */

var requestFromCompat = function requestFromCompat(_ref) {
  var operation = _ref.query,
      variables = _ref.variables;
  (0, _newArrowCheck2.default)(this, _this$3);
  return variables ? {
    operation: operation,
    variables: variables
  } : {
    operation: operation
  };
}.bind(undefined);

exports.requestFromCompat = requestFromCompat;
var _this$4 = undefined;
/**
 * Creates a GqlRequest using given GqlRequestCompat
 *
 * @param {GqlRequest<Variables>} gqlRequest
 *
 * @return {GqlRequestCompat<Variables>}
 * 
 * @example
 * const operation = `
 *   query userQuery($userId: ID!) {
 *     user(userId: $userId) {
 *       id
 *       email
 *     }
 *   }
 * `;
 * 
 * console.log(requestToCompat({operation, variables: {userId: 10}}));
 * // {query: "...", variables: {userId: 10}}
 */

var requestToCompat = function requestToCompat(_ref) {
  var query = _ref.operation,
      variables = _ref.variables;
  (0, _newArrowCheck2.default)(this, _this$4);
  return variables ? {
    query: query,
    variables: variables
  } : {
    query: query
  };
}.bind(undefined); //# sourceMappingURL=index.js.map


exports.requestToCompat = requestToCompat;
},{"core-js/modules/es6.array.map":"RBsu","core-js/modules/es6.regexp.match":"RTfC","core-js/modules/es6.array.some":"dwTY","core-js/modules/es6.function.bind":"WIhg","@babel/runtime/helpers/newArrowCheck":"tS9b"}],"AVeU":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// === Symbol Support ===

var hasSymbols = function () {
  return typeof Symbol === 'function';
};
var hasSymbol = function (name) {
  return hasSymbols() && Boolean(Symbol[name]);
};
var getSymbol = function (name) {
  return hasSymbol(name) ? Symbol[name] : '@@' + name;
};

if (hasSymbols() && !hasSymbol('observable')) {
  Symbol.observable = Symbol('observable');
}

var SymbolIterator = getSymbol('iterator');
var SymbolObservable = getSymbol('observable');
var SymbolSpecies = getSymbol('species');

// === Abstract Operations ===

function getMethod(obj, key) {
  var value = obj[key];

  if (value == null) return undefined;

  if (typeof value !== 'function') throw new TypeError(value + ' is not a function');

  return value;
}

function getSpecies(obj) {
  var ctor = obj.constructor;
  if (ctor !== undefined) {
    ctor = ctor[SymbolSpecies];
    if (ctor === null) {
      ctor = undefined;
    }
  }
  return ctor !== undefined ? ctor : Observable;
}

function isObservable(x) {
  return x instanceof Observable; // SPEC: Brand check
}

function hostReportError(e) {
  if (hostReportError.log) {
    hostReportError.log(e);
  } else {
    setTimeout(function () {
      throw e;
    });
  }
}

function enqueue(fn) {
  Promise.resolve().then(function () {
    try {
      fn();
    } catch (e) {
      hostReportError(e);
    }
  });
}

function cleanupSubscription(subscription) {
  var cleanup = subscription._cleanup;
  if (cleanup === undefined) return;

  subscription._cleanup = undefined;

  if (!cleanup) {
    return;
  }

  try {
    if (typeof cleanup === 'function') {
      cleanup();
    } else {
      var unsubscribe = getMethod(cleanup, 'unsubscribe');
      if (unsubscribe) {
        unsubscribe.call(cleanup);
      }
    }
  } catch (e) {
    hostReportError(e);
  }
}

function closeSubscription(subscription) {
  subscription._observer = undefined;
  subscription._queue = undefined;
  subscription._state = 'closed';
}

function flushSubscription(subscription) {
  var queue = subscription._queue;
  if (!queue) {
    return;
  }
  subscription._queue = undefined;
  subscription._state = 'ready';
  for (var i = 0; i < queue.length; ++i) {
    notifySubscription(subscription, queue[i].type, queue[i].value);
    if (subscription._state === 'closed') break;
  }
}

function notifySubscription(subscription, type, value) {
  subscription._state = 'running';

  var observer = subscription._observer;

  try {
    var m = getMethod(observer, type);
    switch (type) {
      case 'next':
        if (m) m.call(observer, value);
        break;
      case 'error':
        closeSubscription(subscription);
        if (m) m.call(observer, value);else throw value;
        break;
      case 'complete':
        closeSubscription(subscription);
        if (m) m.call(observer);
        break;
    }
  } catch (e) {
    hostReportError(e);
  }

  if (subscription._state === 'closed') cleanupSubscription(subscription);else if (subscription._state === 'running') subscription._state = 'ready';
}

function onNotify(subscription, type, value) {
  if (subscription._state === 'closed') return;

  if (subscription._state === 'buffering') {
    subscription._queue.push({ type: type, value: value });
    return;
  }

  if (subscription._state !== 'ready') {
    subscription._state = 'buffering';
    subscription._queue = [{ type: type, value: value }];
    enqueue(function () {
      return flushSubscription(subscription);
    });
    return;
  }

  notifySubscription(subscription, type, value);
}

var Subscription = function () {
  function Subscription(observer, subscriber) {
    _classCallCheck(this, Subscription);

    // ASSERT: observer is an object
    // ASSERT: subscriber is callable

    this._cleanup = undefined;
    this._observer = observer;
    this._queue = undefined;
    this._state = 'initializing';

    var subscriptionObserver = new SubscriptionObserver(this);

    try {
      this._cleanup = subscriber.call(undefined, subscriptionObserver);
    } catch (e) {
      subscriptionObserver.error(e);
    }

    if (this._state === 'initializing') this._state = 'ready';
  }

  _createClass(Subscription, [{
    key: 'unsubscribe',
    value: function unsubscribe() {
      if (this._state !== 'closed') {
        closeSubscription(this);
        cleanupSubscription(this);
      }
    }
  }, {
    key: 'closed',
    get: function () {
      return this._state === 'closed';
    }
  }]);

  return Subscription;
}();

var SubscriptionObserver = function () {
  function SubscriptionObserver(subscription) {
    _classCallCheck(this, SubscriptionObserver);

    this._subscription = subscription;
  }

  _createClass(SubscriptionObserver, [{
    key: 'next',
    value: function next(value) {
      onNotify(this._subscription, 'next', value);
    }
  }, {
    key: 'error',
    value: function error(value) {
      onNotify(this._subscription, 'error', value);
    }
  }, {
    key: 'complete',
    value: function complete() {
      onNotify(this._subscription, 'complete');
    }
  }, {
    key: 'closed',
    get: function () {
      return this._subscription._state === 'closed';
    }
  }]);

  return SubscriptionObserver;
}();

var Observable = exports.Observable = function () {
  function Observable(subscriber) {
    _classCallCheck(this, Observable);

    if (!(this instanceof Observable)) throw new TypeError('Observable cannot be called as a function');

    if (typeof subscriber !== 'function') throw new TypeError('Observable initializer must be a function');

    this._subscriber = subscriber;
  }

  _createClass(Observable, [{
    key: 'subscribe',
    value: function subscribe(observer) {
      if (typeof observer !== 'object' || observer === null) {
        observer = {
          next: observer,
          error: arguments[1],
          complete: arguments[2]
        };
      }
      return new Subscription(observer, this._subscriber);
    }
  }, {
    key: 'forEach',
    value: function forEach(fn) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        if (typeof fn !== 'function') {
          reject(new TypeError(fn + ' is not a function'));
          return;
        }

        function done() {
          subscription.unsubscribe();
          resolve();
        }

        var subscription = _this.subscribe({
          next: function (value) {
            try {
              fn(value, done);
            } catch (e) {
              reject(e);
              subscription.unsubscribe();
            }
          },

          error: reject,
          complete: resolve
        });
      });
    }
  }, {
    key: 'map',
    value: function map(fn) {
      var _this2 = this;

      if (typeof fn !== 'function') throw new TypeError(fn + ' is not a function');

      var C = getSpecies(this);

      return new C(function (observer) {
        return _this2.subscribe({
          next: function (value) {
            try {
              value = fn(value);
            } catch (e) {
              return observer.error(e);
            }
            observer.next(value);
          },
          error: function (e) {
            observer.error(e);
          },
          complete: function () {
            observer.complete();
          }
        });
      });
    }
  }, {
    key: 'filter',
    value: function filter(fn) {
      var _this3 = this;

      if (typeof fn !== 'function') throw new TypeError(fn + ' is not a function');

      var C = getSpecies(this);

      return new C(function (observer) {
        return _this3.subscribe({
          next: function (value) {
            try {
              if (!fn(value)) return;
            } catch (e) {
              return observer.error(e);
            }
            observer.next(value);
          },
          error: function (e) {
            observer.error(e);
          },
          complete: function () {
            observer.complete();
          }
        });
      });
    }
  }, {
    key: 'reduce',
    value: function reduce(fn) {
      var _this4 = this;

      if (typeof fn !== 'function') throw new TypeError(fn + ' is not a function');

      var C = getSpecies(this);
      var hasSeed = arguments.length > 1;
      var hasValue = false;
      var seed = arguments[1];
      var acc = seed;

      return new C(function (observer) {
        return _this4.subscribe({
          next: function (value) {
            var first = !hasValue;
            hasValue = true;

            if (!first || hasSeed) {
              try {
                acc = fn(acc, value);
              } catch (e) {
                return observer.error(e);
              }
            } else {
              acc = value;
            }
          },
          error: function (e) {
            observer.error(e);
          },
          complete: function () {
            if (!hasValue && !hasSeed) return observer.error(new TypeError('Cannot reduce an empty sequence'));

            observer.next(acc);
            observer.complete();
          }
        });
      });
    }
  }, {
    key: 'concat',
    value: function concat() {
      var _this5 = this;

      for (var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++) {
        sources[_key] = arguments[_key];
      }

      var C = getSpecies(this);

      return new C(function (observer) {
        var subscription = void 0;
        var index = 0;

        function startNext(next) {
          subscription = next.subscribe({
            next: function (v) {
              observer.next(v);
            },
            error: function (e) {
              observer.error(e);
            },
            complete: function () {
              if (index === sources.length) {
                subscription = undefined;
                observer.complete();
              } else {
                startNext(C.from(sources[index++]));
              }
            }
          });
        }

        startNext(_this5);

        return function () {
          if (subscription) {
            subscription.unsubscribe();
            subscription = undefined;
          }
        };
      });
    }
  }, {
    key: 'flatMap',
    value: function flatMap(fn) {
      var _this6 = this;

      if (typeof fn !== 'function') throw new TypeError(fn + ' is not a function');

      var C = getSpecies(this);

      return new C(function (observer) {
        var subscriptions = [];

        var outer = _this6.subscribe({
          next: function (value) {
            if (fn) {
              try {
                value = fn(value);
              } catch (e) {
                return observer.error(e);
              }
            }

            var inner = C.from(value).subscribe({
              next: function (value) {
                observer.next(value);
              },
              error: function (e) {
                observer.error(e);
              },
              complete: function () {
                var i = subscriptions.indexOf(inner);
                if (i >= 0) subscriptions.splice(i, 1);
                completeIfDone();
              }
            });

            subscriptions.push(inner);
          },
          error: function (e) {
            observer.error(e);
          },
          complete: function () {
            completeIfDone();
          }
        });

        function completeIfDone() {
          if (outer.closed && subscriptions.length === 0) observer.complete();
        }

        return function () {
          subscriptions.forEach(function (s) {
            return s.unsubscribe();
          });
          outer.unsubscribe();
        };
      });
    }
  }, {
    key: SymbolObservable,
    value: function () {
      return this;
    }
  }], [{
    key: 'from',
    value: function from(x) {
      var C = typeof this === 'function' ? this : Observable;

      if (x == null) throw new TypeError(x + ' is not an object');

      var method = getMethod(x, SymbolObservable);
      if (method) {
        var observable = method.call(x);

        if (Object(observable) !== observable) throw new TypeError(observable + ' is not an object');

        if (isObservable(observable) && observable.constructor === C) return observable;

        return new C(function (observer) {
          return observable.subscribe(observer);
        });
      }

      if (hasSymbol('iterator')) {
        method = getMethod(x, SymbolIterator);
        if (method) {
          return new C(function (observer) {
            enqueue(function () {
              if (observer.closed) return;
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = method.call(x)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var item = _step.value;

                  observer.next(item);
                  if (observer.closed) return;
                }
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError;
                  }
                }
              }

              observer.complete();
            });
          });
        }
      }

      if (Array.isArray(x)) {
        return new C(function (observer) {
          enqueue(function () {
            if (observer.closed) return;
            for (var i = 0; i < x.length; ++i) {
              observer.next(x[i]);
              if (observer.closed) return;
            }
            observer.complete();
          });
        });
      }

      throw new TypeError(x + ' is not observable');
    }
  }, {
    key: 'of',
    value: function of() {
      for (var _len2 = arguments.length, items = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        items[_key2] = arguments[_key2];
      }

      var C = typeof this === 'function' ? this : Observable;

      return new C(function (observer) {
        enqueue(function () {
          if (observer.closed) return;
          for (var i = 0; i < items.length; ++i) {
            observer.next(items[i]);
            if (observer.closed) return;
          }
          observer.complete();
        });
      });
    }
  }, {
    key: SymbolSpecies,
    get: function () {
      return this;
    }
  }]);

  return Observable;
}();

if (hasSymbols()) {
  Object.defineProperty(Observable, Symbol('extensions'), {
    value: {
      symbol: SymbolObservable,
      hostReportError: hostReportError
    },
    configurable: true
  });
}
},{}],"U0NN":[function(require,module,exports) {
module.exports = require('./lib/Observable.js').Observable;

},{"./lib/Observable.js":"AVeU"}],"IxO8":[function(require,module,exports) {
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;
},{}],"fwAU":[function(require,module,exports) {
var defineProperty = require("./defineProperty");

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      defineProperty(target, key, source[key]);
    });
  }

  return target;
}

module.exports = _objectSpread;
},{"./defineProperty":"IxO8"}],"t2zx":[function(require,module,exports) {
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

module.exports = _objectWithoutPropertiesLoose;
},{}],"U8F3":[function(require,module,exports) {
var objectWithoutPropertiesLoose = require("./objectWithoutPropertiesLoose");

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = objectWithoutPropertiesLoose(source, excluded);
  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

module.exports = _objectWithoutProperties;
},{"./objectWithoutPropertiesLoose":"t2zx"}],"zTqj":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unobserveOrCancel = exports.unobserve = exports.toObservable = exports.send = exports.observe = exports.create = exports.cancel = void 0;

require("core-js/modules/es6.array.find-index");

require("core-js/modules/es6.array.find");

require("core-js/modules/es6.function.name");

var _utilsComposite = require("@jumpn/utils-composite");

require("phoenix");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.for-each");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _utilsGraphql = require("@jumpn/utils-graphql");

var _zenObservable = _interopRequireDefault(require("zen-observable"));

require("core-js/modules/es7.array.includes");

require("core-js/modules/es6.string.includes");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

require("core-js/modules/es6.array.index-of");

var _utilsArray = require("@jumpn/utils-array");

require("core-js/modules/es6.function.bind");

var _newArrowCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/newArrowCheck"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _this = undefined;

var cancel = function cancel(_ref) {
  var activeObservers = _ref.activeObservers,
      canceledObservers = _ref.canceledObservers,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["activeObservers", "canceledObservers"]);
  (0, _newArrowCheck2.default)(this, _this);
  return (0, _objectSpread2.default)({}, rest, {
    isActive: false,
    activeObservers: [],
    canceledObservers: (0, _toConsumableArray2.default)(activeObservers).concat((0, _toConsumableArray2.default)(canceledObservers))
  });
}.bind(undefined);

var _this$1 = undefined;

var getNotifier = function getNotifier(handlerName, payload) {
  var _this2 = this;

  (0, _newArrowCheck2.default)(this, _this$1);
  return function (observer) {
    (0, _newArrowCheck2.default)(this, _this2);
    return observer[handlerName] && observer[handlerName](payload);
  }.bind(this);
}.bind(undefined);

var getHandlerName = function getHandlerName(_ref) {
  var name = _ref.name;
  (0, _newArrowCheck2.default)(this, _this$1);
  return "on".concat(name);
}.bind(undefined);

var notifyAll = function notifyAll(observers, event) {
  (0, _newArrowCheck2.default)(this, _this$1);
  return observers.forEach(getNotifier(getHandlerName(event), event.payload));
}.bind(undefined);

var _this$2 = undefined;

var notifyCanceled = function notifyCanceled(notifier, event) {
  (0, _newArrowCheck2.default)(this, _this$2);
  notifyAll(notifier.canceledObservers, event);
  return notifier;
}.bind(undefined);

var eventNames = {
  abort: "Abort",
  cancel: "Cancel",
  error: "Error",
  result: "Result",
  start: "Start"
};
var _this$3 = undefined;

var createStartEvent = function createStartEvent(payload) {
  (0, _newArrowCheck2.default)(this, _this$3);
  return {
    payload: payload,
    name: eventNames.start
  };
}.bind(undefined);

var createResultEvent = function createResultEvent(payload) {
  (0, _newArrowCheck2.default)(this, _this$3);
  return {
    payload: payload,
    name: eventNames.result
  };
}.bind(undefined);

var createErrorEvent = function createErrorEvent(payload) {
  (0, _newArrowCheck2.default)(this, _this$3);
  return {
    payload: payload,
    name: eventNames.error
  };
}.bind(undefined);

var createCancelEvent = function createCancelEvent() {
  (0, _newArrowCheck2.default)(this, _this$3);
  return {
    name: eventNames.cancel,
    payload: undefined
  };
}.bind(undefined);

var createAbortEvent = function createAbortEvent(payload) {
  (0, _newArrowCheck2.default)(this, _this$3);
  return {
    payload: payload,
    name: eventNames.abort
  };
}.bind(undefined);

var _this$4 = undefined;

var clearCanceled = function clearCanceled(notifier) {
  (0, _newArrowCheck2.default)(this, _this$4);
  return (0, _objectSpread2.default)({}, notifier, {
    canceledObservers: []
  });
}.bind(undefined);

var flushCanceled = function flushCanceled(notifier) {
  (0, _newArrowCheck2.default)(this, _this$4);
  return notifier.canceledObservers.length > 0 ? clearCanceled(notifyCanceled(notifier, createCancelEvent())) : notifier;
}.bind(undefined);

var _this$5 = undefined;

var findIndex = function findIndex(notifiers, key, value // $FlowFixMe: flow is having some troubles to match hasIn signature (curry)
) {
  (0, _newArrowCheck2.default)(this, _this$5);
  return notifiers.findIndex((0, _utilsComposite.hasIn)([key], value));
}.bind(undefined);

var _this$6 = undefined;

var refresh = function refresh(notifier) {
  var _this2 = this;

  (0, _newArrowCheck2.default)(this, _this$6);
  return function (notifiers) {
    (0, _newArrowCheck2.default)(this, _this2);
    return (0, _utilsArray.replace)(findIndex(notifiers, "request", notifier.request), [notifier], notifiers);
  }.bind(this);
}.bind(undefined);

var _this$7 = undefined;

var remove$1 = function remove$$1(notifier) {
  var _this2 = this;

  (0, _newArrowCheck2.default)(this, _this$7);
  return function (notifiers) {
    (0, _newArrowCheck2.default)(this, _this2);
    return (0, _utilsArray.remove)(findIndex(notifiers, "request", notifier.request), 1, notifiers);
  }.bind(this);
}.bind(undefined);

var _this$8 = undefined;

var updateNotifiers = function updateNotifiers(absintheSocket, updater) {
  (0, _newArrowCheck2.default)(this, _this$8);
  absintheSocket.notifiers = updater(absintheSocket.notifiers);
  return absintheSocket;
}.bind(undefined);

var _this$9 = undefined;

var refreshNotifier = function refreshNotifier(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$9);
  updateNotifiers(absintheSocket, refresh(notifier));
  return notifier;
}.bind(undefined);

var requestStatuses = {
  canceled: "canceled",
  canceling: "canceling",
  pending: "pending",
  sent: "sent",
  sending: "sending"
};
var _this$a = undefined;

var getObservers = function getObservers(_ref) {
  var activeObservers = _ref.activeObservers,
      canceledObservers = _ref.canceledObservers;
  (0, _newArrowCheck2.default)(this, _this$a);
  return (0, _toConsumableArray2.default)(activeObservers).concat((0, _toConsumableArray2.default)(canceledObservers));
}.bind(undefined);

var notify = function notify(notifier, event) {
  (0, _newArrowCheck2.default)(this, _this$a);
  notifyAll(getObservers(notifier), event);
  return notifier;
}.bind(undefined);

var _this$b = undefined;

var abortNotifier = function abortNotifier(absintheSocket, notifier, error) {
  (0, _newArrowCheck2.default)(this, _this$b);
  return updateNotifiers(absintheSocket, remove$1(notify(notifier, createAbortEvent(error))));
}.bind(undefined);

var _this$c = undefined;

var find = function find(notifiers, key, value // $FlowFixMe: flow is having some troubles to match hasIn signature (curry)
) {
  (0, _newArrowCheck2.default)(this, _this$c);
  return notifiers.find((0, _utilsComposite.hasIn)([key], value));
}.bind(undefined);

var _this$d = undefined;

var notifyActive = function notifyActive(notifier, event) {
  (0, _newArrowCheck2.default)(this, _this$d);
  notifyAll(notifier.activeObservers, event);
  return notifier;
}.bind(undefined);

var _this$e = undefined;

var notifyResultEvent = function notifyResultEvent(notifier, result) {
  (0, _newArrowCheck2.default)(this, _this$e);
  return notifyActive(notifier, createResultEvent(result));
}.bind(undefined);

var _this$f = undefined;

var notifyStartEvent = function notifyStartEvent(notifier) {
  (0, _newArrowCheck2.default)(this, _this$f);
  return notifyActive(notifier, createStartEvent(notifier));
}.bind(undefined);

var _this$g = undefined;

var reset = function reset(notifier) {
  (0, _newArrowCheck2.default)(this, _this$g);
  return flushCanceled((0, _objectSpread2.default)({}, notifier, {
    isActive: true,
    requestStatus: requestStatuses.pending,
    subscriptionId: undefined
  }));
}.bind(undefined);

var _this$h = undefined;

var handlePush = function handlePush(push, handler) {
  (0, _newArrowCheck2.default)(this, _this$h);
  return push.receive("ok", handler.onSucceed).receive("error", handler.onError).receive("timeout", handler.onTimeout);
}.bind(undefined);

var _this$i = undefined;

var getPushHandlerMethodGetter = function getPushHandlerMethodGetter(absintheSocket, request) {
  var _this2 = this;

  (0, _newArrowCheck2.default)(this, _this$i);
  return function (handle) {
    var _this3 = this;

    (0, _newArrowCheck2.default)(this, _this2);
    return function () {
      (0, _newArrowCheck2.default)(this, _this3);
      var notifier = find(absintheSocket.notifiers, "request", request);

      if (notifier) {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        handle.apply(void 0, [absintheSocket, notifier].concat(args));
      }
    }.bind(this);
  }.bind(this);
}.bind(undefined);

var getPushHandler = function getPushHandler(absintheSocket, request, notifierPushHandler) {
  (0, _newArrowCheck2.default)(this, _this$i);
  return (0, _utilsComposite.map)(getPushHandlerMethodGetter(absintheSocket, request), notifierPushHandler);
}.bind(undefined);

var pushAbsintheEvent = function pushAbsintheEvent(absintheSocket, request, notifierPushHandler, absintheEvent) {
  (0, _newArrowCheck2.default)(this, _this$i);
  handlePush(absintheSocket.channel.push(absintheEvent.name, absintheEvent.payload), getPushHandler(absintheSocket, request, notifierPushHandler));
  return absintheSocket;
}.bind(undefined);

var absintheEventNames = {
  doc: "doc",
  unsubscribe: "unsubscribe"
};
var _this$j = undefined;

var createAbsintheUnsubscribeEvent = function createAbsintheUnsubscribeEvent(payload) {
  (0, _newArrowCheck2.default)(this, _this$j);
  return {
    payload: payload,
    name: absintheEventNames.unsubscribe
  };
}.bind(undefined);

var createAbsintheDocEvent = function createAbsintheDocEvent(payload) {
  (0, _newArrowCheck2.default)(this, _this$j);
  return {
    payload: payload,
    name: absintheEventNames.doc
  };
}.bind(undefined);

var _this$k = undefined;

var pushAbsintheDocEvent = function pushAbsintheDocEvent(absintheSocket, _ref, notifierPushHandler) {
  var request = _ref.request;
  (0, _newArrowCheck2.default)(this, _this$k);
  return pushAbsintheEvent(absintheSocket, request, notifierPushHandler, createAbsintheDocEvent((0, _utilsGraphql.requestToCompat)(request)));
}.bind(undefined);

var setNotifierRequestStatusSending = function setNotifierRequestStatusSending(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$k);
  return refreshNotifier(absintheSocket, (0, _objectSpread2.default)({}, notifier, {
    requestStatus: requestStatuses.sending
  }));
}.bind(undefined);

var createRequestError = function createRequestError(message) {
  (0, _newArrowCheck2.default)(this, _this$k);
  return new Error("request: ".concat(message));
}.bind(undefined);

var onTimeout = function onTimeout(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$k);
  return notifyActive(notifier, createErrorEvent(createRequestError("timeout")));
}.bind(undefined);

var onError = function onError(absintheSocket, notifier, errorMessage) {
  (0, _newArrowCheck2.default)(this, _this$k);
  return abortNotifier(absintheSocket, notifier, createRequestError(errorMessage));
}.bind(undefined);

var getNotifierPushHandler = function getNotifierPushHandler(onSucceed) {
  (0, _newArrowCheck2.default)(this, _this$k);
  return {
    onError: onError,
    onSucceed: onSucceed,
    onTimeout: onTimeout
  };
}.bind(undefined);

var pushRequestUsing = function pushRequestUsing(absintheSocket, notifier, onSucceed) {
  (0, _newArrowCheck2.default)(this, _this$k);
  return pushAbsintheDocEvent(absintheSocket, setNotifierRequestStatusSending(absintheSocket, notifier), getNotifierPushHandler(onSucceed));
}.bind(undefined);

var _this$l = undefined;

var onUnsubscribeSucceedCanceled = function onUnsubscribeSucceedCanceled(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$l);
  return updateNotifiers(absintheSocket, remove$1(flushCanceled(notifier)));
}.bind(undefined);

var onUnsubscribeSucceedActive = function onUnsubscribeSucceedActive(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$l);
  return subscribe(absintheSocket, refreshNotifier(absintheSocket, reset(notifier)));
}.bind(undefined);

var createUnsubscribeError = function createUnsubscribeError(message) {
  (0, _newArrowCheck2.default)(this, _this$l);
  return new Error("unsubscribe: ".concat(message));
}.bind(undefined);

var unsubscribeHandler = {
  onError: function onError$$1(absintheSocket, notifier, errorMessage) {
    (0, _newArrowCheck2.default)(this, _this$l);
    return abortNotifier(absintheSocket, notifier, createUnsubscribeError(errorMessage));
  }.bind(undefined),
  onTimeout: function onTimeout(absintheSocket, notifier) {
    (0, _newArrowCheck2.default)(this, _this$l);
    return notifyCanceled(notifier, createErrorEvent(createUnsubscribeError("timeout")));
  }.bind(undefined),
  onSucceed: function onSucceed(absintheSocket, notifier) {
    (0, _newArrowCheck2.default)(this, _this$l);

    if (notifier.isActive) {
      onUnsubscribeSucceedActive(absintheSocket, notifier);
    } else {
      onUnsubscribeSucceedCanceled(absintheSocket, notifier);
    }
  }.bind(undefined)
};

var pushAbsintheUnsubscribeEvent = function pushAbsintheUnsubscribeEvent(absintheSocket, _ref) {
  var request = _ref.request,
      subscriptionId = _ref.subscriptionId;
  (0, _newArrowCheck2.default)(this, _this$l);
  return pushAbsintheEvent(absintheSocket, request, unsubscribeHandler, createAbsintheUnsubscribeEvent({
    subscriptionId: subscriptionId
  }));
}.bind(undefined);

var unsubscribe = function unsubscribe(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$l);
  return pushAbsintheUnsubscribeEvent(absintheSocket, refreshNotifier(absintheSocket, (0, _objectSpread2.default)({}, notifier, {
    requestStatus: requestStatuses.canceling
  })));
}.bind(undefined);

var onSubscribeSucceed = function onSubscribeSucceed(absintheSocket, notifier, _ref2) {
  var subscriptionId = _ref2.subscriptionId;
  (0, _newArrowCheck2.default)(this, _this$l);
  var subscribedNotifier = refreshNotifier(absintheSocket, (0, _objectSpread2.default)({}, notifier, {
    subscriptionId: subscriptionId,
    requestStatus: requestStatuses.sent
  }));

  if (subscribedNotifier.isActive) {
    notifyStartEvent(subscribedNotifier);
  } else {
    unsubscribe(absintheSocket, subscribedNotifier);
  }
}.bind(undefined);

var onSubscribe = function onSubscribe(absintheSocket, notifier, response) {
  (0, _newArrowCheck2.default)(this, _this$l);

  if (response.errors) {
    onError(absintheSocket, notifier, (0, _utilsGraphql.errorsToString)(response.errors));
  } else {
    onSubscribeSucceed(absintheSocket, notifier, response);
  }
}.bind(undefined);

var subscribe = function subscribe(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$l);
  return pushRequestUsing(absintheSocket, notifier, onSubscribe);
}.bind(undefined);

var onDataMessage = function onDataMessage(absintheSocket, _ref3) {
  var payload = _ref3.payload;
  (0, _newArrowCheck2.default)(this, _this$l);
  var notifier = find(absintheSocket.notifiers, "subscriptionId", payload.subscriptionId);

  if (notifier) {
    notifyResultEvent(notifier, payload.result);
  }
}.bind(undefined);

var dataMessageEventName = "subscription:data";

var isDataMessage = function isDataMessage(message) {
  (0, _newArrowCheck2.default)(this, _this$l);
  return message.event === dataMessageEventName;
}.bind(undefined);

var _this$m = undefined;

var cancelQueryOrMutationSending = function cancelQueryOrMutationSending(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$m);
  return updateNotifiers(absintheSocket, refresh(flushCanceled(cancel(notifier))));
}.bind(undefined);

var cancelQueryOrMutationIfSending = function cancelQueryOrMutationIfSending(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$m);
  return notifier.requestStatus === requestStatuses.sending ? cancelQueryOrMutationSending(absintheSocket, notifier) : absintheSocket;
}.bind(undefined);

var cancelPending = function cancelPending(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$m);
  return updateNotifiers(absintheSocket, remove$1(flushCanceled(cancel(notifier))));
}.bind(undefined);

var cancelQueryOrMutation = function cancelQueryOrMutation(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$m);
  return notifier.requestStatus === requestStatuses.pending ? cancelPending(absintheSocket, notifier) : cancelQueryOrMutationIfSending(absintheSocket, notifier);
}.bind(undefined);

var unsubscribeIfNeeded = function unsubscribeIfNeeded(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$m);
  return notifier.requestStatus === requestStatuses.sent ? unsubscribe(absintheSocket, notifier) : absintheSocket;
}.bind(undefined);

var cancelNonPendingSubscription = function cancelNonPendingSubscription(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$m);
  return unsubscribeIfNeeded(absintheSocket, refreshNotifier(absintheSocket, cancel(notifier)));
}.bind(undefined);

var cancelSubscription = function cancelSubscription(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$m);
  return notifier.requestStatus === requestStatuses.pending ? cancelPending(absintheSocket, notifier) : cancelNonPendingSubscription(absintheSocket, notifier);
}.bind(undefined);

var cancelActive = function cancelActive(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$m);
  return notifier.operationType === "subscription" ? cancelSubscription(absintheSocket, notifier) : cancelQueryOrMutation(absintheSocket, notifier);
}.bind(undefined);
/**
 * Cancels a notifier sending a Cancel event to all its observers and
 * unsubscribing in case it holds a subscription request
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 *
 * withAbsintheSocket.cancel(absintheSocket, notifier);
 */


var cancel$1 = function cancel$$1(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$m);
  return notifier.isActive ? cancelActive(absintheSocket, notifier) : absintheSocket;
}.bind(undefined);

exports.cancel = cancel$1;
var _this$n = undefined;

var setNotifierRequestStatusSent = function setNotifierRequestStatusSent(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$n);
  return refreshNotifier(absintheSocket, (0, _objectSpread2.default)({}, notifier, {
    requestStatus: requestStatuses.sent
  }));
}.bind(undefined);

var onQueryOrMutationSucceed = function onQueryOrMutationSucceed(absintheSocket, notifier, response) {
  (0, _newArrowCheck2.default)(this, _this$n);
  return updateNotifiers(absintheSocket, remove$1(notifyResultEvent(setNotifierRequestStatusSent(absintheSocket, notifier), response)));
}.bind(undefined);

var pushQueryOrMutation = function pushQueryOrMutation(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$n);
  return pushRequestUsing(absintheSocket, notifyStartEvent(notifier), onQueryOrMutationSucceed);
}.bind(undefined);

var pushRequest = function pushRequest(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$n);

  if (notifier.operationType === "subscription") {
    subscribe(absintheSocket, notifier);
  } else {
    pushQueryOrMutation(absintheSocket, notifier);
  }
}.bind(undefined);

var _this$o = undefined;

var createChannelJoinError = function createChannelJoinError(message) {
  (0, _newArrowCheck2.default)(this, _this$o);
  return new Error("channel join: ".concat(message));
}.bind(undefined);

var notifyErrorToAllActive = function notifyErrorToAllActive(absintheSocket, errorMessage) {
  var _this2 = this;

  (0, _newArrowCheck2.default)(this, _this$o);
  return absintheSocket.notifiers.forEach(function (notifier) {
    (0, _newArrowCheck2.default)(this, _this2);
    return notifyActive(notifier, createErrorEvent(createChannelJoinError(errorMessage)));
  }.bind(this));
}.bind(undefined); // join Push is reused and so the handler
// https://github.com/phoenixframework/phoenix/blob/master/assets/js/phoenix.js#L356


var createChannelJoinHandler = function createChannelJoinHandler(absintheSocket) {
  var _this3 = this;

  (0, _newArrowCheck2.default)(this, _this$o);
  return {
    onError: function onError(errorMessage) {
      (0, _newArrowCheck2.default)(this, _this3);
      return notifyErrorToAllActive(absintheSocket, errorMessage);
    }.bind(this),
    onSucceed: function onSucceed() {
      var _this4 = this;

      (0, _newArrowCheck2.default)(this, _this3);
      return absintheSocket.notifiers.forEach(function (notifier) {
        (0, _newArrowCheck2.default)(this, _this4);
        return pushRequest(absintheSocket, notifier);
      }.bind(this));
    }.bind(this),
    onTimeout: function onTimeout() {
      (0, _newArrowCheck2.default)(this, _this3);
      return notifyErrorToAllActive(absintheSocket, "timeout");
    }.bind(this)
  };
}.bind(undefined);

var joinChannel = function joinChannel(absintheSocket) {
  (0, _newArrowCheck2.default)(this, _this$o);
  handlePush(absintheSocket.channel.join(), createChannelJoinHandler(absintheSocket));
  absintheSocket.channelJoinCreated = true;
  return absintheSocket;
}.bind(undefined);

var _this$p = undefined;

var onMessage = function onMessage(absintheSocket) {
  var _this2 = this;

  (0, _newArrowCheck2.default)(this, _this$p);
  return function (message) {
    (0, _newArrowCheck2.default)(this, _this2);

    if (isDataMessage(message)) {
      onDataMessage(absintheSocket, message);
    }
  }.bind(this);
}.bind(undefined);

var createConnectionCloseError = function createConnectionCloseError() {
  (0, _newArrowCheck2.default)(this, _this$p);
  return new Error("connection: close");
}.bind(undefined);

var notifyConnectionCloseError = function notifyConnectionCloseError(notifier) {
  (0, _newArrowCheck2.default)(this, _this$p);
  return notify(notifier, createErrorEvent(createConnectionCloseError()));
}.bind(undefined);

var notifierOnConnectionCloseCanceled = function notifierOnConnectionCloseCanceled(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$p);
  return updateNotifiers(absintheSocket, remove$1(notifyConnectionCloseError(notifier)));
}.bind(undefined);

var notifierOnConnectionCloseActive = function notifierOnConnectionCloseActive(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$p);

  if (notifier.operationType === "mutation") {
    abortNotifier(absintheSocket, notifier, createConnectionCloseError());
  } else {
    refreshNotifier(absintheSocket, reset(notifyConnectionCloseError(notifier)));
  }
}.bind(undefined);

var notifierOnConnectionClose = function notifierOnConnectionClose(absintheSocket) {
  var _this3 = this;

  (0, _newArrowCheck2.default)(this, _this$p);
  return function (notifier) {
    (0, _newArrowCheck2.default)(this, _this3);

    if (notifier.isActive) {
      notifierOnConnectionCloseActive(absintheSocket, notifier);
    } else {
      notifierOnConnectionCloseCanceled(absintheSocket, notifier);
    }
  }.bind(this);
}.bind(undefined);

var onConnectionClose = function onConnectionClose(absintheSocket) {
  var _this4 = this;

  (0, _newArrowCheck2.default)(this, _this$p);
  return function () {
    (0, _newArrowCheck2.default)(this, _this4);
    return absintheSocket.notifiers.forEach(notifierOnConnectionClose(absintheSocket));
  }.bind(this);
}.bind(undefined);

var shouldJoinChannel = function shouldJoinChannel(absintheSocket) {
  (0, _newArrowCheck2.default)(this, _this$p);
  return !absintheSocket.channelJoinCreated && absintheSocket.notifiers.length > 0;
}.bind(undefined);

var onConnectionOpen = function onConnectionOpen(absintheSocket) {
  var _this5 = this;

  (0, _newArrowCheck2.default)(this, _this$p);
  return function () {
    (0, _newArrowCheck2.default)(this, _this5);

    if (shouldJoinChannel(absintheSocket)) {
      joinChannel(absintheSocket);
    }
  }.bind(this);
}.bind(undefined);

var absintheChannelName = "__absinthe__:control";
/**
 * Creates an Absinthe Socket using the given Phoenix Socket instance
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 * import {Socket as PhoenixSocket} from "phoenix";

 * const absintheSocket = withAbsintheSocket.create(
 *   new PhoenixSocket("ws://localhost:4000/socket")
 * );
 */

var create = function create(phoenixSocket) {
  (0, _newArrowCheck2.default)(this, _this$p);
  var absintheSocket = {
    phoenixSocket: phoenixSocket,
    channel: phoenixSocket.channel(absintheChannelName),
    channelJoinCreated: false,
    notifiers: []
  };
  phoenixSocket.onOpen(onConnectionOpen(absintheSocket));
  phoenixSocket.onClose(onConnectionClose(absintheSocket));
  phoenixSocket.onMessage(onMessage(absintheSocket));
  return absintheSocket;
}.bind(undefined);

exports.create = create;
var _this$q = undefined;

var observe = function observe(_ref, observer) {
  var activeObservers = _ref.activeObservers,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["activeObservers"]);
  (0, _newArrowCheck2.default)(this, _this$q);
  return (0, _objectSpread2.default)({}, rest, {
    activeObservers: (0, _toConsumableArray2.default)(activeObservers).concat([observer]),
    isActive: true
  });
}.bind(undefined);

var _this$r = undefined;
/**
 * Observes given notifier using the provided observer
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket"
 *
 * const logEvent = eventName => (...args) => console.log(eventName, ...args);
 *
 * const updatedNotifier = withAbsintheSocket.observe(absintheSocket, notifier, {
 *   onAbort: logEvent("abort"),
 *   onError: logEvent("error"),
 *   onStart: logEvent("open"),
 *   onResult: logEvent("result")
 * });
 */

var observe$1 = function observe$$1(absintheSocket, notifier, observer) {
  (0, _newArrowCheck2.default)(this, _this$r);
  return refreshNotifier(absintheSocket, observe(notifier, observer));
}.bind(undefined);

exports.observe = observe$1;
var _this$s = undefined;

var createUsing = function createUsing(request, operationType) {
  (0, _newArrowCheck2.default)(this, _this$s);
  return {
    operationType: operationType,
    request: request,
    activeObservers: [],
    canceledObservers: [],
    isActive: true,
    requestStatus: requestStatuses.pending,
    subscriptionId: undefined
  };
}.bind(undefined);

var create$1 = function create(request) {
  (0, _newArrowCheck2.default)(this, _this$s);
  return createUsing(request, (0, _utilsGraphql.getOperationType)(request.operation));
}.bind(undefined);

var _this$t = undefined;

var reactivate = function reactivate(notifier) {
  (0, _newArrowCheck2.default)(this, _this$t);
  return notifier.isActive ? notifier : (0, _objectSpread2.default)({}, notifier, {
    isActive: true
  });
}.bind(undefined);

var _this$u = undefined;

var connectOrJoinChannel = function connectOrJoinChannel(absintheSocket) {
  (0, _newArrowCheck2.default)(this, _this$u);

  if (absintheSocket.phoenixSocket.isConnected()) {
    joinChannel(absintheSocket);
  } else {
    // socket ignores connect calls if a connection has already been created
    absintheSocket.phoenixSocket.connect();
  }
}.bind(undefined);

var sendNew = function sendNew(absintheSocket, request) {
  (0, _newArrowCheck2.default)(this, _this$u);
  var notifier = create$1(request);
  updateNotifiers(absintheSocket, (0, _utilsArray.append)([notifier]));

  if (absintheSocket.channelJoinCreated) {
    pushRequest(absintheSocket, notifier);
  } else {
    connectOrJoinChannel(absintheSocket);
  }

  return notifier;
}.bind(undefined);

var updateCanceledReactivate = function updateCanceledReactivate(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$u);
  return refreshNotifier(absintheSocket, reactivate(notifier));
}.bind(undefined);

var updateCanceled = function updateCanceled(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$u);
  return notifier.requestStatus === requestStatuses.sending ? updateCanceledReactivate(absintheSocket, flushCanceled(notifier)) : updateCanceledReactivate(absintheSocket, notifier);
}.bind(undefined);

var updateIfCanceled = function updateIfCanceled(absintheSocket, notifier) {
  (0, _newArrowCheck2.default)(this, _this$u);
  return notifier.isActive ? notifier : updateCanceled(absintheSocket, notifier);
}.bind(undefined);

var getExistentIfAny = function getExistentIfAny(absintheSocket, request) {
  (0, _newArrowCheck2.default)(this, _this$u);
  var notifier = find(absintheSocket.notifiers, "request", request);
  return notifier && updateIfCanceled(absintheSocket, notifier);
}.bind(undefined);
/**
 * Sends given request and returns an object (notifier) to track its progress
 * (see observe function)
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 *
 * const operation = `
 *   subscription userSubscription($userId: ID!) {
 *     user(userId: $userId) {
 *       id
 *       name
 *     }
 *   }
 * `;
 *
 * // This example uses a subscription, but the functionallity is the same for
 * // all operation types (queries, mutations and subscriptions)
 *
 * const notifier = withAbsintheSocket.send(absintheSocket, {
 *   operation,
 *   variables: {userId: 10}
 * });
 */


var send = function send(absintheSocket, request) {
  (0, _newArrowCheck2.default)(this, _this$u);
  return getExistentIfAny(absintheSocket, request) || sendNew(absintheSocket, request);
}.bind(undefined);

exports.send = send;
var _this$v = undefined; // prettier-ignore

var getUnsubscriber = function getUnsubscriber(absintheSocket, _ref, observer, unsubscribe) {
  var _this2 = this;

  var request = _ref.request;
  (0, _newArrowCheck2.default)(this, _this$v);
  return function () {
    (0, _newArrowCheck2.default)(this, _this2);
    var notifier = find(absintheSocket.notifiers, "request", request);
    unsubscribe(absintheSocket, notifier, notifier ? observer : undefined);
  }.bind(this);
}.bind(undefined);

var onResult = function onResult(_ref2, observableObserver) {
  var _this3 = this;

  var operationType = _ref2.operationType;
  (0, _newArrowCheck2.default)(this, _this$v);
  return function (result) {
    (0, _newArrowCheck2.default)(this, _this3);
    observableObserver.next(result);

    if (operationType !== "subscription") {
      observableObserver.complete();
    }
  }.bind(this);
}.bind(undefined);

var createObserver = function createObserver(notifier, handlers, observableObserver) {
  (0, _newArrowCheck2.default)(this, _this$v);
  return (0, _objectSpread2.default)({}, handlers, {
    onAbort: observableObserver.error.bind(observableObserver),
    onResult: onResult(notifier, observableObserver)
  });
}.bind(undefined);
/**
 * Creates an Observable that will follow the given notifier
 *
 * @param {AbsintheSocket} absintheSocket
 * @param {Notifier<Result, Variables>} notifier
 * @param {Object} [options]
 * @param {function(error: Error): undefined} [options.onError]
 * @param {function(notifier: Notifier<Result, Variables>): undefined} [options.onStart]
 * @param {function(): undefined} [options.unsubscribe]
 *
 * @return {Observable}
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 *
 * const unobserveOrCancelIfNeeded = (absintheSocket, notifier, observer) => {
 *   if (notifier && observer) {
 *     withAbsintheSocket.unobserveOrCancel(absintheSocket, notifier, observer);
 *   }
 * };
 *
 * const logEvent = eventName => (...args) => console.log(eventName, ...args);
 *
 * const observable = withAbsintheSocket.toObservable(absintheSocket, notifier, {
 *   onError: logEvent("error"),
 *   onStart: logEvent("open"),
 *   unsubscribe: unobserveOrCancelIfNeeded
 * });
 */


var toObservable = function toObservable(absintheSocket, notifier) {
  var _this4 = this;

  var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      unsubscribe = _ref3.unsubscribe,
      handlers = (0, _objectWithoutProperties2.default)(_ref3, ["unsubscribe"]);

  (0, _newArrowCheck2.default)(this, _this$v);
  return new _zenObservable.default(function (observableObserver) {
    (0, _newArrowCheck2.default)(this, _this4);
    var observer = createObserver(notifier, handlers, observableObserver);
    observe$1(absintheSocket, notifier, observer);
    return unsubscribe && getUnsubscriber(absintheSocket, notifier, observer, unsubscribe);
  }.bind(this));
}.bind(undefined);

exports.toObservable = toObservable;
var _this$w = undefined;

var removeObserver = function removeObserver(observers, observer) {
  (0, _newArrowCheck2.default)(this, _this$w);
  return (0, _utilsArray.remove)(observers.indexOf(observer), 1, observers);
}.bind(undefined);

var unobserve = function unobserve(_ref, observer) {
  var activeObservers = _ref.activeObservers,
      rest = (0, _objectWithoutProperties2.default)(_ref, ["activeObservers"]);
  (0, _newArrowCheck2.default)(this, _this$w);
  return (0, _objectSpread2.default)({}, rest, {
    activeObservers: removeObserver(activeObservers, observer)
  });
}.bind(undefined);

var _this$x = undefined;

var ensureHasActiveObserver = function ensureHasActiveObserver(notifier, observer) {
  (0, _newArrowCheck2.default)(this, _this$x);
  if (notifier.activeObservers.includes(observer)) return notifier;
  throw new Error("Observer is not attached to notifier");
}.bind(undefined);
/**
 * Detaches observer from notifier
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 *
 * withAbsintheSocket.unobserve(absintheSocket, notifier, observer);
 */


var unobserve$1 = function unobserve$$1(absintheSocket, notifier, observer) {
  (0, _newArrowCheck2.default)(this, _this$x);
  return updateNotifiers(absintheSocket, refresh(unobserve(ensureHasActiveObserver(notifier, observer), observer)));
}.bind(undefined);

exports.unobserve = unobserve$1;
var _this$y = undefined;

var doUnobserveOrCancel = function doUnobserveOrCancel(absintheSocket, notifier, observer) {
  (0, _newArrowCheck2.default)(this, _this$y);
  return notifier.activeObservers.length === 1 ? cancel$1(absintheSocket, notifier) : unobserve$1(absintheSocket, notifier, observer);
}.bind(undefined);
/**
 * Cancels notifier if there are no more observers apart from the one given, or
 * detaches given observer from notifier otherwise
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 *
 * withAbsintheSocket.unobserve(absintheSocket, notifier, observer);
 */


var unobserveOrCancel = function unobserveOrCancel(absintheSocket, notifier, observer) {
  (0, _newArrowCheck2.default)(this, _this$y);
  return notifier.isActive ? doUnobserveOrCancel(absintheSocket, notifier, observer) : absintheSocket;
}.bind(undefined); //# sourceMappingURL=index.js.map


exports.unobserveOrCancel = unobserveOrCancel;
},{"core-js/modules/es6.array.find-index":"7sVm","core-js/modules/es6.array.find":"Qppk","core-js/modules/es6.function.name":"N3yi","@jumpn/utils-composite":"7Q0f","phoenix":"XFqm","core-js/modules/web.dom.iterable":"v6Aj","core-js/modules/es6.array.for-each":"VsIt","@babel/runtime/helpers/toConsumableArray":"Fhqp","@jumpn/utils-graphql":"2hqA","zen-observable":"U0NN","core-js/modules/es7.array.includes":"TLss","core-js/modules/es6.string.includes":"fH7p","@babel/runtime/helpers/objectSpread":"fwAU","@babel/runtime/helpers/objectWithoutProperties":"U8F3","core-js/modules/es6.array.index-of":"LvRh","@jumpn/utils-array":"Yu+T","core-js/modules/es6.function.bind":"WIhg","@babel/runtime/helpers/newArrowCheck":"tS9b"}],"sQAQ":[function(require,module,exports) {
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  fragment fragmentFile on File {\n    id\n    url\n    name\n    bytesSize\n    height\n    width\n    contentType\n    thumbnails {\n      id\n      url\n      name\n      bytesSize\n      height\n      width\n      contentType\n      thumbType\n    }\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var GraphQLClient_1 = require("../GraphQLClient");

exports.fragmentFile = GraphQLClient_1.gql(_templateObject());

function serializeFile(fileData, options) {
  var file = fileData || {};
  var thumbnails = null;

  if (file.thumbnails && file.thumbnails.length) {
    thumbnails = file.thumbnails.map(function (thumbnail) {
      var serializedThumbnail = serializeFile(thumbnail, options);
      return {
        id: serializedThumbnail.id,
        url: serializedThumbnail.url,
        name: serializedThumbnail.name,
        bytesSize: serializedThumbnail.bytesSize,
        width: serializedThumbnail.width,
        height: serializedThumbnail.height,
        contentType: serializedThumbnail.contentType,
        thumbType: thumbnail.thumbType || null
      };
    });
  }

  var uploadsUrlPrefix = options.backendStaticUrl.replace(/\/$/, '') + '/';
  var fileUrl = '';

  if (file.url) {
    fileUrl = /^uploads/i.test(file.url) ? uploadsUrlPrefix + file.url : file.url;
  }

  return {
    id: file.id || null,
    url: fileUrl,
    name: file.name || '',
    bytesSize: file.bytesSize || 0,
    height: file.height || 0,
    width: file.width || 0,
    thumbnails: thumbnails,
    contentType: file.contentType || null,
    originalFileObject: file.originalFileObject || null
  };
}

exports.serializeFile = serializeFile;
},{"../GraphQLClient":"1fv+"}],"ZEl5":[function(require,module,exports) {
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  fragment fragmentMessage on Message {\n    id\n    tempId\n    text\n    timestamp\n    system\n    sender {\n      ... on Client { ...fragmentClient }\n      ... on CompanyEmployee { ...fragmentCompanyEmployee }\n    }\n    attachments {\n      ...fragmentFile\n    }\n    data {\n      ... on SystemMessageData {\n        type\n        author {\n          ...fragmentCompanyEmployee\n        }\n        whenWouldWork\n      }\n      ... on NotSystemMessageData {\n        responseToMessage {\n          id\n          text\n          sender {\n            __typename\n            ... on Client { ...fragmentClient }\n            ... on CompanyEmployee { ...fragmentCompanyEmployee }\n          }\n        }\n      }\n    }\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var GraphQLClient_1 = require("../GraphQLClient");

var utilsCommon_1 = require("../../utilsCommon");

var serializeUser_1 = require("./serializeUser");

var serializeFile_1 = require("./serializeFile");

exports.fragmentMessage = GraphQLClient_1.insertGraphQlFragments(GraphQLClient_1.gql(_templateObject()), {
  fragmentClient: serializeUser_1.fragmentClient,
  fragmentCompanyEmployee: serializeUser_1.fragmentCompanyEmployee,
  fragmentFile: serializeFile_1.fragmentFile
});

function serializeMessage(message, options) {
  var _message$sender = message.sender,
      sender = _message$sender === void 0 ? {} : _message$sender,
      attachments = message.attachments,
      _message$data = message.data,
      data = _message$data === void 0 ? {} : _message$data;
  var responseToMessage = data.responseToMessage,
      _data$author = data.author,
      author = _data$author === void 0 ? {} : _data$author;
  var serializedSender = serializeUser_1.serializeUser(Object.assign({}, sender, author), options);
  var serializedAttachments = (attachments || []).map(function (attachment) {
    return serializeFile_1.serializeFile(attachment, options);
  });

  var responseToMessageSender = utilsCommon_1._get(responseToMessage, 'sender', {});

  var serializedResponseToMessage = {
    id: utilsCommon_1._get(responseToMessage, 'id') || null,
    text: utilsCommon_1._get(responseToMessage, 'text') || '',
    sender: serializeUser_1.serializeUser(responseToMessageSender, options)
  };

  var isSystem = utilsCommon_1._get(message, 'system', false);

  return {
    id: utilsCommon_1._get(message, 'id') || null,
    tempId: utilsCommon_1._get(message, 'tempId') || null,
    text: utilsCommon_1._get(message, 'text') || '',
    timestamp: utilsCommon_1._get(message, 'timestamp') || '',
    cursor: utilsCommon_1._get(message, 'cursor') || null,
    sender: serializedSender,
    responseToMessage: serializedResponseToMessage.id ? serializedResponseToMessage : null,
    attachments: serializedAttachments,
    isSubmitting: utilsCommon_1._get(message, 'isSubmitting') || false,
    isSubmissionError: utilsCommon_1._get(message, 'isSubmissionError') || false,
    isSystem: isSystem,
    systemData: !isSystem ? null : {
      type: utilsCommon_1._get(message, 'data.type') || null,
      whenWouldWork: utilsCommon_1._get(message, 'data.whenWouldWork') || null
    }
  };
}

exports.serializeMessage = serializeMessage;
},{"../GraphQLClient":"1fv+","../../utilsCommon":"EjGt","./serializeUser":"1lqy","./serializeFile":"sQAQ"}],"y8vH":[function(require,module,exports) {
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n    query ($beforeCursor: String, $limit: Int!) {\n      messages(before: $beforeCursor, last: $limit) {\n        edges {\n          cursor\n          node {\n            ...fragmentMessage\n          }\n        }\n      }\n    }\n  "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n    mutation ($text: String!, $responseToMessageId: ID, $attachments: [Upload!], $tempId: ID) {\n      sendMessage(text: $text, responseToMessageId: $responseToMessageId, attachments: $attachments, tempId: $tempId) {\n        ...fragmentMessage\n      }\n    }\n  "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n    subscription {\n      newMessage {\n        ...fragmentMessage\n      }\n    }\n  "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var AbsintheSocket = __importStar(require("@absinthe/socket"));

var Phoenix = __importStar(require("phoenix"));

var serializeMessage_1 = require("./serializers/serializeMessage");

var GraphQLClient_1 = require("./GraphQLClient");

var MessagesSubscription =
/*#__PURE__*/
function () {
  function MessagesSubscription(config) {
    var _this = this;

    _classCallCheck(this, MessagesSubscription);

    this.latestMessageHistoryCursorsCache = [];
    this.reachedBeginningOfMessageHistory = false;
    this.isCurrentlySubscribed = false;
    this.subscriptionQuery = GraphQLClient_1.insertGraphQlFragments(GraphQLClient_1.gql(_templateObject()), {
      fragmentMessage: serializeMessage_1.fragmentMessage
    });
    this.sendMessageQuery = GraphQLClient_1.insertGraphQlFragments(GraphQLClient_1.gql(_templateObject2()), {
      fragmentMessage: serializeMessage_1.fragmentMessage
    });
    this.messageHistoryQuery = GraphQLClient_1.insertGraphQlFragments(GraphQLClient_1.gql(_templateObject3()), {
      fragmentMessage: serializeMessage_1.fragmentMessage
    });

    this.unsubscribe = function () {
      _this.absintheSocket = AbsintheSocket.cancel(_this.absintheSocket, _this.notifier);
      _this.latestMessageHistoryCursorsCache = [];
      _this.reachedBeginningOfMessageHistory = false;
      _this.isCurrentlySubscribed = false;

      _this.onUnsubscribe();
    };

    this.sendMessage = function (_ref) {
      var text = _ref.text,
          attachments = _ref.attachments,
          responseToMessageId = _ref.responseToMessageId,
          tempId = _ref.tempId;
      var query = _this.sendMessageQuery;
      var attachmentFileNames = [];
      var binaryAttachmentsObject = {};
      attachments.forEach(function (file) {
        attachmentFileNames.push(file.name);
        binaryAttachmentsObject[file.name] = file;
      });
      var variables = {
        text: text,
        attachments: attachmentFileNames,
        responseToMessageId: responseToMessageId,
        tempId: tempId
      };
      return new Promise(function (resolve, reject) {
        _this.graphQLClient.query(query, variables, binaryAttachmentsObject).then(function (data) {
          if (data && data.sendMessage) {
            var message = serializeMessage_1.serializeMessage(data.sendMessage, {
              backendStaticUrl: _this.backendStaticUrl,
              currentClientId: _this.currentClientId
            });
            resolve(message);
          } else {
            reject({
              error: data,
              variables: variables,
              query: query
            });
          }
        }).catch(function (error) {
          reject({
            error: error,
            variables: variables,
            query: query
          });
        });
      });
    };

    this.fetchMessageHistory = function (limit, beforeCursor) {
      var query = _this.messageHistoryQuery;
      var variables = {
        limit: limit,
        beforeCursor: beforeCursor
      };
      return new Promise(function (resolve, reject) {
        if (_this.reachedBeginningOfMessageHistory) {
          resolve([]);
          return;
        }

        _this.graphQLClient.query(query, variables).then(function (response) {
          if (response.messages) {
            var messages = GraphQLClient_1.simplifyGraphQLJSON(response.messages).map(function (message) {
              return serializeMessage_1.serializeMessage(message, {
                backendStaticUrl: _this.backendStaticUrl,
                currentClientId: _this.currentClientId
              });
            }).filter(function (message) {
              return !_this.latestMessageHistoryCursorsCache.includes(message.cursor);
            });
            _this.latestMessageHistoryCursorsCache = [].concat(_toConsumableArray(messages.map(function (message) {
              return message.cursor;
            })), _toConsumableArray(_this.latestMessageHistoryCursorsCache)).slice(0, limit);

            if (messages.length < limit) {
              _this.reachedBeginningOfMessageHistory = true;
            }

            resolve(messages);
          } else {
            reject({
              response: response,
              limit: limit,
              beforeCursor: beforeCursor,
              query: query,
              variables: variables
            });
          }
        }).catch(function (error) {
          reject({
            error: error,
            limit: limit,
            beforeCursor: beforeCursor,
            query: query,
            variables: variables
          });
        });
      });
    };

    this.apiUrl = config.apiUrl;
    this.socketUrl = config.socketUrl;
    this.backendStaticUrl = config.backendStaticUrl;
    this.token = config.token;
    this.currentClientId = config.currentClientId;

    this.onSubscribeSuccess = config.onSubscribeSuccess || function () {};

    this.onSubscribeError = config.onSubscribeError || function () {};

    this.onUnsubscribe = config.onUnsubscribe || function () {};

    this.onMessage = config.onMessage;
    this.initialize();
  }

  _createClass(MessagesSubscription, [{
    key: "initialize",
    value: function initialize() {
      this.absintheSocket = AbsintheSocket.create(new Phoenix.Socket(this.socketUrl, {
        params: {
          token: this.token
        }
      }));
      this.graphQLClient = new GraphQLClient_1.GraphQLClient({
        url: this.apiUrl,
        token: this.token
      });
      this.subscribe();
    }
  }, {
    key: "subscribe",
    value: function subscribe() {
      var _this2 = this;

      var notifier = AbsintheSocket.send(this.absintheSocket, {
        operation: this.subscriptionQuery
      });
      AbsintheSocket.observe(this.absintheSocket, notifier, {
        onAbort: function onAbort(e) {
          return _this2.onSubscribeAbort(e);
        },
        onStart: function onStart(notifier) {
          _this2.notifier = notifier;

          if (!_this2.isCurrentlySubscribed) {
            _this2.isCurrentlySubscribed = true;

            _this2.onSubscribeSuccess(notifier);
          }
        },
        onResult: function onResult(_ref2) {
          var data = _ref2.data;

          if (data && data.newMessage) {
            var message = serializeMessage_1.serializeMessage(data.newMessage, {
              backendStaticUrl: _this2.backendStaticUrl,
              currentClientId: _this2.currentClientId
            });

            _this2.onMessage(message);
          }
        }
      });
    }
  }, {
    key: "onSubscribeAbort",
    value: function onSubscribeAbort(error) {
      this.onSubscribeError({
        error: error,
        graphQLQuery: this.subscriptionQuery
      });
    }
  }]);

  return MessagesSubscription;
}();

exports.MessagesSubscription = MessagesSubscription;
},{"@absinthe/socket":"zTqj","phoenix":"XFqm","./serializers/serializeMessage":"ZEl5","./GraphQLClient":"1fv+"}],"QERd":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Phoenix = __importStar(require("phoenix"));

var TypingStatusSubscription =
/*#__PURE__*/
function () {
  function TypingStatusSubscription(params) {
    var _this = this;

    _classCallCheck(this, TypingStatusSubscription);

    this.hasConnectErrorOccurred = false;
    this.currentlyTypingUsers = [];
    this.typingTimeouts = {};
    this.typedText = '';

    this.subscribeStatusChange = function () {
      _this.channel.on('presence_diff', function (diff) {
        if (diff.joins && Object.values(diff.joins).length) {
          _this.onStatusChange(diff.joins);
        }
      });
    };

    this.dispatchTypedText = function (typedText) {
      if (_this.channel) {
        var trimmedText = typeof typedText === 'string' ? typedText.trim() : '';

        if (typedText === false) {
          _this.channel.push('typing', {
            typing: false,
            text: ''
          });
        } else if (_this.typedText !== trimmedText) {
          _this.channel.push('typing', {
            typing: Boolean(trimmedText),
            text: trimmedText
          });

          _this.typedText = trimmedText;
        }
      }
    };

    this.resubscribeToAnotherRoom = function (roomId) {
      return new Promise(function (resolve, reject) {
        _this.unsubscribeFromThisRoom().then(function () {
          _this.roomId = roomId;

          _this.joinChannel(function () {
            _this.subscribeStatusChange();

            resolve();
          });
        }).catch(reject);
      });
    };

    this.unsubscribeFromThisRoom = function () {
      return new Promise(function (resolve, reject) {
        if (_this.channel) {
          _this.channel.leave().receive('ok', function () {
            _this.roomId = null;
            _this.channel = null;
            resolve();
          }).receive('error', reject);
        } else {
          _this.roomId = null;
          _this.channel = null;
          resolve();
        }
      });
    };

    this.socketUrl = params.socketUrl;
    this.token = params.token;
    this.roomId = params.roomId;
    this.clientId = params.clientId;

    this.onSubscribeSuccess = params.onSubscribeSuccess || function () {};

    this.onSubscribeError = params.onSubscribeError || function () {};

    this.onChange = params.onChange;
    this.connect(function () {
      _this.joinChannel(_this.subscribeStatusChange);
    });
  }

  _createClass(TypingStatusSubscription, [{
    key: "connect",
    value: function connect() {
      var _this2 = this;

      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
      this.phoenixSocket = new Phoenix.Socket(this.socketUrl, {
        params: {
          token: this.token
        }
      });
      this.phoenixSocket.onError(function (error) {
        if (!_this2.hasConnectErrorOccurred) {
          var message = 'Could not open connection via WebSocketPhoenixClient';

          _this2.onSubscribeError({
            error: error,
            message: message
          });

          _this2.hasConnectErrorOccurred = true;
        }
      });
      this.phoenixSocket.onOpen(callback);
      this.phoenixSocket.connect();
    }
  }, {
    key: "joinChannel",
    value: function joinChannel() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
      var phoenixSocket = this.phoenixSocket,
          roomId = this.roomId,
          onSubscribeError = this.onSubscribeError,
          onSubscribeSuccess = this.onSubscribeSuccess;
      this.channel = phoenixSocket.channel('public:room:' + roomId, {});
      this.channel.join().receive('ok', function (data) {
        onSubscribeSuccess(data);
        callback();
      }).receive('error', function (error) {
        onSubscribeError({
          error: error,
          roomId: roomId
        });
      }).receive('timeout', function () {
        var message = 'Networking issue: could not join room via WebSocketPhoenixClient';
        onSubscribeError({
          error: {
            message: message
          },
          roomId: roomId
        });
      });
    }
  }, {
    key: "onStatusChange",
    value: function onStatusChange(state) {
      var userId = Object.keys(state)[0];

      if (userId === this.clientId) {
        return;
      }

      var statusValues = Object.values(state)[0];
      var statusChange = statusValues.metas[0];
      var userData = {
        id: userId,
        firstName: statusChange.first_name,
        lastName: statusChange.last_name
      };
      var currentlyTypingUserIds = this.currentlyTypingUsers.map(function (user) {
        return user.id;
      });

      if (statusChange.typing) {
        this.debouncedRemoveFromCurrentlyTypingUsers(userId);
      }

      if (statusChange.typing && !currentlyTypingUserIds.includes(userId)) {
        this.currentlyTypingUsers.push(userData);
        this.onChange(this.currentlyTypingUsers);
      } else if (!statusChange && currentlyTypingUserIds.includes(userId)) {
        this.currentlyTypingUsers = this.currentlyTypingUsers.filter(function (user) {
          return user.id !== userId;
        });
        this.onChange(this.currentlyTypingUsers);
      }
    }
  }, {
    key: "debouncedRemoveFromCurrentlyTypingUsers",
    value: function debouncedRemoveFromCurrentlyTypingUsers(userId) {
      var _this3 = this;

      if (this.typingTimeouts[userId]) {
        clearTimeout(this.typingTimeouts[userId]);
      }

      this.typingTimeouts[userId] = setTimeout(function () {
        _this3.currentlyTypingUsers = _this3.currentlyTypingUsers.filter(function (user) {
          return user.id !== userId;
        });

        _this3.onChange(_this3.currentlyTypingUsers);
      }, 2000);
    }
  }]);

  return TypingStatusSubscription;
}();

exports.TypingStatusSubscription = TypingStatusSubscription;
},{"phoenix":"XFqm"}],"zgd1":[function(require,module,exports) {
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n    subscription {\n      updateCompanyWorking\n    }\n  "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var AbsintheSocket = __importStar(require("@absinthe/socket"));

var Phoenix = __importStar(require("phoenix"));

var GraphQLClient_1 = require("./GraphQLClient");

var OperatorOnlineStatusSubscription =
/*#__PURE__*/
function () {
  function OperatorOnlineStatusSubscription(config) {
    var _this = this;

    _classCallCheck(this, OperatorOnlineStatusSubscription);

    this.isCurrentlySubscribed = false;
    this.subscriptionQuery = GraphQLClient_1.gql(_templateObject());

    this.unsubscribe = function () {
      _this.absintheSocket = AbsintheSocket.cancel(_this.absintheSocket, _this.notifier);
      _this.isCurrentlySubscribed = false;

      _this.onUnsubscribe();
    };

    this.socketUrl = config.socketUrl;
    this.token = config.token;

    this.onSubscribeSuccess = config.onSubscribeSuccess || function () {};

    this.onSubscribeError = config.onSubscribeError || function () {};

    this.onUnsubscribe = config.onUnsubscribe || function () {};

    this.onStatusChange = config.onStatusChange;
    this.initialize();
  }

  _createClass(OperatorOnlineStatusSubscription, [{
    key: "initialize",
    value: function initialize() {
      this.absintheSocket = AbsintheSocket.create(new Phoenix.Socket(this.socketUrl, {
        params: {
          token: this.token
        }
      }));
      this.subscribe();
    }
  }, {
    key: "subscribe",
    value: function subscribe() {
      var _this2 = this;

      var notifier = AbsintheSocket.send(this.absintheSocket, {
        operation: this.subscriptionQuery
      });
      AbsintheSocket.observe(this.absintheSocket, notifier, {
        onAbort: function onAbort(e) {
          return _this2.onSubscribeAbort(e);
        },
        onStart: function onStart(notifier) {
          _this2.notifier = notifier;

          if (!_this2.isCurrentlySubscribed) {
            _this2.isCurrentlySubscribed = true;

            _this2.onSubscribeSuccess(notifier);
          }
        },
        onResult: function onResult(data) {
          // TODO: figure out format & update
          console.warn('OperatorOnlineStatusSubscription data', data);

          _this2.onStatusChange(data);
        }
      });
    }
  }, {
    key: "onSubscribeAbort",
    value: function onSubscribeAbort(error) {
      this.onSubscribeError({
        error: error,
        graphQLQuery: this.subscriptionQuery
      });
    }
  }]);

  return OperatorOnlineStatusSubscription;
}();

exports.OperatorOnlineStatusSubscription = OperatorOnlineStatusSubscription;
},{"@absinthe/socket":"zTqj","phoenix":"XFqm","./GraphQLClient":"1fv+"}],"Pqo8":[function(require,module,exports) {
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n    mutation($companyId: Uuid!, $room: ForeignRoom, $client: ForeignClient) {\n      joinRoom (companyId: $companyId, room: $room, client: $client) {\n        token\n        company {\n          working\n          widgetTitle\n        }\n        client {\n          ...fragmentClient\n        }\n        room {\n          id\n          title\n          foreignId\n        }\n      }\n    }\n  "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var unique_names_generator_1 = require("unique-names-generator");

var utilsCommon_1 = require("../utilsCommon");

var serializeUser_1 = require("./serializers/serializeUser");

var MessagesSubscription_1 = require("./MessagesSubscription");

var TypingStatusSubscription_1 = require("./TypingStatusSubscription");

var OperatorOnlineStatusSubscription_1 = require("./OperatorOnlineStatusSubscription");

var ScreenshotTaker_1 = require("./ScreenshotTaker");

var GraphQLClient_1 = require("./GraphQLClient");

exports.API_REFERENCE_URL = 'https://github.com/elixirchat/elixirchat-js-sdk';

var ElixirChat =
/*#__PURE__*/
function () {
  function ElixirChat(config) {
    var _this = this;

    _classCallCheck(this, ElixirChat);

    this.widgetTitle = '';
    this.defaultWidgetTitle = 'Служба поддержки';
    this.joinRoomQuery = GraphQLClient_1.insertGraphQlFragments(GraphQLClient_1.gql(_templateObject()), {
      fragmentClient: serializeUser_1.fragmentClient
    });
    this.onMessageCallbacks = [];
    this.onConnectSuccessCallbacks = [];
    this.onConnectErrorCallbacks = [];
    this.onTypingCallbacks = [];
    this.onOperatorOnlineStatusChangeCallbacks = [];

    this.dispatchTypedText = function (typedText) {
      _this.typingStatusSubscription.dispatchTypedText(typedText);
    };

    this.onMessage = function (callback) {
      _this.onMessageCallbacks.push(callback);
    };

    this.onTyping = function (callback) {
      _this.onTypingCallbacks.push(callback);
    };

    this.onOperatorOnlineStatusChange = function (callback) {
      _this.onOperatorOnlineStatusChangeCallbacks.push(callback);
    };

    this.reconnect = function (_ref) {
      var room = _ref.room,
          client = _ref.client;
      utilsCommon_1.logEvent(_this.debug, 'Attempting to reconnect to another room', {
        room: room,
        client: client
      });

      if (room) {
        _this.room = room;
      }

      if (client) {
        _this.client = client;
      }

      _this.isPrivate = !room || !room.id;

      _this.setDefaultConfigValues();

      _this.messagesSubscription.unsubscribe();

      _this.operatorOnlineStatusSubscription.unsubscribe();

      return _this.connectToRoom().then(function () {
        _this.saveRoomClientToLocalStorage(_this.room, _this.client);

        _this.subscribeToNewMessages();

        _this.subscribeToOperatorOnlineStatusChange();

        _this.typingStatusSubscription.resubscribeToAnotherRoom(_this.room.id);
      });
    };

    this.onConnectSuccess = function (callback) {
      _this.onConnectSuccessCallbacks.push(callback);
    };

    this.onConnectError = function (callback) {
      _this.onConnectErrorCallbacks.push(callback);
    };

    this.takeScreenshot = function () {
      return _this.screenshotTaker.takeScreenshot().then(function (screenshot) {
        utilsCommon_1.logEvent(_this.debug, 'Captured screenshot', screenshot);
        return screenshot;
      }).catch(function (e) {
        utilsCommon_1.logEvent(_this.debug, 'Could not capture screenshot', e, 'error');
        throw e;
      });
    };

    this.fetchMessageHistory = function (limit, beforeCursor) {
      return _this.messagesSubscription.fetchMessageHistory(limit, beforeCursor).then(function (messages) {
        utilsCommon_1.logEvent(_this.debug, 'Fetched message history', {
          limit: limit,
          beforeCursor: beforeCursor,
          messages: messages
        });
        return messages;
      }).catch(function (data) {
        utilsCommon_1.logEvent(_this.debug, 'Could not fetch message history', data, 'error');
        throw data;
      });
    };

    this.apiUrl = config.apiUrl;
    this.socketUrl = config.socketUrl;
    this.backendStaticUrl = config.backendStaticUrl;
    this.companyId = config.companyId;
    this.debug = config.debug || false;
    this.room = config.room;
    this.client = config.client;
    this.isPrivate = !this.room || !this.room.id;
    var localValues = this.getRoomClientFromLocalStorage();

    if (!this.room || !this.room.id) {
      this.room = localValues.room;
    }

    if (!this.client || !this.client.id) {
      this.client = localValues.client;
    }

    this.initialize();
  }

  _createClass(ElixirChat, [{
    key: "initialize",
    value: function initialize() {
      var _this2 = this;

      if (!this.companyId) {
        utilsCommon_1.logEvent(this.debug, "Required parameter companyId is not provided: \nSee more: ".concat(exports.API_REFERENCE_URL, "#config-companyid"), null, 'error');
        return;
      }

      utilsCommon_1.logEvent(this.debug, 'Initializing ElixirChat', {
        apiUrl: this.apiUrl,
        socketUrl: this.socketUrl,
        backendStaticUrl: this.backendStaticUrl,
        companyId: this.companyId,
        room: this.room,
        client: this.client,
        debug: this.debug
      });
      this.screenshotTaker = new ScreenshotTaker_1.ScreenshotTaker();
      this.setDefaultConfigValues();
      this.connectToRoom().then(function () {
        _this2.saveRoomClientToLocalStorage(_this2.room, _this2.client);

        _this2.subscribeToNewMessages();

        _this2.subscribeToTypingStatusChange();

        _this2.subscribeToOperatorOnlineStatusChange();
      });
    }
  }, {
    key: "getDefaultClientData",
    value: function getDefaultClientData() {
      var baseTitle = unique_names_generator_1.uniqueNamesGenerator({
        length: 2,
        separator: ' ',
        dictionaries: null
      });

      var _baseTitle$split$map = baseTitle.split(' ').map(utilsCommon_1.capitalize),
          _baseTitle$split$map2 = _slicedToArray(_baseTitle$split$map, 2),
          firstName = _baseTitle$split$map2[0],
          lastName = _baseTitle$split$map2[1];

      var randomFourDigitPostfix = utilsCommon_1.randomDigitStringId(4);
      var uniqueId = baseTitle.replace(' ', '-') + '-' + randomFourDigitPostfix;
      var clientData = {
        id: uniqueId,
        firstName: firstName,
        lastName: lastName
      };
      utilsCommon_1.logEvent(this.debug, 'Generated default client data', clientData);
      return clientData;
    }
  }, {
    key: "getRoomClientFromLocalStorage",
    value: function getRoomClientFromLocalStorage() {
      var room;
      var client;

      try {
        room = JSON.parse(localStorage.getItem('elixirchat-room'));
      } catch (e) {}

      try {
        client = JSON.parse(localStorage.getItem('elixirchat-client'));
      } catch (e) {}

      utilsCommon_1.logEvent(this.debug, 'Fetched room, client values from localStorage', {
        room: room,
        client: client
      });
      return {
        room: room,
        client: client
      };
    }
  }, {
    key: "saveRoomClientToLocalStorage",
    value: function saveRoomClientToLocalStorage(room, client) {
      localStorage.setItem('elixirchat-room', JSON.stringify(room));
      localStorage.setItem('elixirchat-client', JSON.stringify(client));
    }
  }, {
    key: "setDefaultConfigValues",
    value: function setDefaultConfigValues() {
      var client = this.client || {};
      var room = this.room || {};
      var defaultClientData = this.getDefaultClientData();
      var clientId = client.id || defaultClientData.id;
      var clientFirstName = client.firstName;
      var clientLastName = client.lastName;

      if (!clientFirstName && !clientLastName) {
        clientFirstName = defaultClientData.firstName;
        clientLastName = defaultClientData.lastName;
      }

      this.client = {
        id: clientId,
        firstName: clientFirstName,
        lastName: clientLastName
      };
      var roomId = room.id || clientId;
      var roomTitle = room.title || clientFirstName + ' ' + clientLastName;
      var roomData = room.data || {};
      this.room = {
        id: roomId,
        title: roomTitle,
        data: roomData
      };
      utilsCommon_1.logEvent(this.debug, 'Set room and client values', {
        room: this.room,
        client: this.client
      });
    }
  }, {
    key: "serializeRoomData",
    value: function serializeRoomData(data) {
      var serializedData = {};

      for (var key in data) {
        serializedData[key] = data[key].toString();
      }

      return JSON.stringify(serializedData);
    }
  }, {
    key: "connectToRoom",
    value: function connectToRoom() {
      var _this3 = this;

      this.graphQLClient = new GraphQLClient_1.GraphQLClient({
        url: this.apiUrl
      });
      var query = this.joinRoomQuery;
      var variables = {
        companyId: this.companyId,
        room: {
          id: this.room.id,
          title: this.room.title,
          data: this.serializeRoomData(this.room.data)
        },
        client: this.client
      };
      return new Promise(function (resolve, reject) {
        _this3.graphQLClient.query(query, variables).then(function (_ref2) {
          var joinRoom = _ref2.joinRoom;

          if (joinRoom) {
            _this3.authToken = joinRoom.token;
            _this3.connected = true;
            _this3.client.firstName = joinRoom.client.firstName;
            _this3.client.lastName = joinRoom.client.lastName;
            _this3.client.id = joinRoom.client.foreignId;
            _this3.elixirChatClientId = joinRoom.client.id;
            _this3.widgetTitle = joinRoom.company.widgetTitle || _this3.defaultWidgetTitle;
            _this3.room.id = joinRoom.room.foreignId;
            _this3.room.title = joinRoom.room.title;
            _this3.elixirChatRoomId = joinRoom.room.id;
            utilsCommon_1.logEvent(_this3.debug, 'Joined room', {
              joinRoom: joinRoom,
              room: _this3.room,
              client: _this3.client
            });
            resolve(joinRoom);
          } else {
            utilsCommon_1.logEvent(_this3.debug, 'Failed to join room', {
              joinRoom: joinRoom,
              query: query,
              variables: variables
            }, 'error');

            _this3.onConnectErrorCallbacks.forEach(function (callback) {
              return callback(joinRoom);
            });

            reject(joinRoom);
          }
        }).catch(function (response) {
          utilsCommon_1.logEvent(_this3.debug, 'Failed to join room', {
            response: response,
            query: query,
            variables: variables
          }, 'error');

          _this3.onConnectErrorCallbacks.forEach(function (callback) {
            return callback(response);
          });

          reject(response);
        });
      });
    }
  }, {
    key: "subscribeToTypingStatusChange",
    value: function subscribeToTypingStatusChange() {
      var _this4 = this;

      this.typingStatusSubscription = new TypingStatusSubscription_1.TypingStatusSubscription({
        socketUrl: this.socketUrl,
        token: this.authToken,
        roomId: this.elixirChatRoomId,
        clientId: this.elixirChatClientId,
        onSubscribeSuccess: function onSubscribeSuccess() {
          utilsCommon_1.logEvent(_this4.debug, 'Successfully subscribed to typing status change', {
            roomId: _this4.elixirChatRoomId
          });
        },
        onSubscribeError: function onSubscribeError(data) {
          utilsCommon_1.logEvent(_this4.debug, 'Failed to subscribe to typing status change', data, 'error');
        },
        onChange: function onChange(peopleWhoAreTyping) {
          utilsCommon_1.logEvent(_this4.debug, 'Some users started/stopped typing', {
            peopleWhoAreTyping: peopleWhoAreTyping
          });

          _this4.onTypingCallbacks.forEach(function (callback) {
            return callback(peopleWhoAreTyping);
          });
        }
      });
    }
  }, {
    key: "subscribeToOperatorOnlineStatusChange",
    value: function subscribeToOperatorOnlineStatusChange() {
      var _this5 = this;

      this.operatorOnlineStatusSubscription = new OperatorOnlineStatusSubscription_1.OperatorOnlineStatusSubscription({
        socketUrl: this.socketUrl,
        token: this.authToken,
        onSubscribeSuccess: function onSubscribeSuccess() {
          utilsCommon_1.logEvent(_this5.debug, 'Successfully subscribed to operator online status change');
        },
        onSubscribeError: function onSubscribeError(data) {
          utilsCommon_1.logEvent(_this5.debug, 'Failed to subscribe to operator online status change', data, 'error');
        },
        onStatusChange: function onStatusChange(isOnline) {
          utilsCommon_1.logEvent(_this5.debug, isOnline ? 'Operators got back online' : 'All operators went');

          _this5.onOperatorOnlineStatusChangeCallbacks.forEach(function (callback) {
            return callback(isOnline);
          });
        },
        onUnsubscribe: function onUnsubscribe() {
          utilsCommon_1.logEvent(_this5.debug, 'Unsubscribed from  operator online status change');
        }
      });
    }
  }, {
    key: "subscribeToNewMessages",
    value: function subscribeToNewMessages() {
      var _this6 = this;

      this.messagesSubscription = new MessagesSubscription_1.MessagesSubscription({
        apiUrl: this.apiUrl,
        socketUrl: this.socketUrl,
        backendStaticUrl: this.backendStaticUrl,
        token: this.authToken,
        currentClientId: this.client.id,
        onSubscribeSuccess: function onSubscribeSuccess() {
          var roomData = {
            room: _this6.room,
            client: _this6.client
          };
          utilsCommon_1.logEvent(_this6.debug, 'Successfully subscribed to messages', roomData);

          _this6.onConnectSuccessCallbacks.forEach(function (callback) {
            return callback(roomData);
          });
        },
        onSubscribeError: function onSubscribeError(data) {
          utilsCommon_1.logEvent(_this6.debug, 'Failed to subscribe to messages', {
            data: data
          }, 'error');

          _this6.onConnectErrorCallbacks.forEach(function (callback) {
            return callback(data);
          });
        },
        onMessage: function onMessage(message) {
          utilsCommon_1.logEvent(_this6.debug, 'Received new message', message);

          _this6.onMessageCallbacks.forEach(function (callback) {
            return callback(message);
          });
        },
        onUnsubscribe: function onUnsubscribe() {
          utilsCommon_1.logEvent(_this6.debug, 'Unsubscribed from messages', {
            room: _this6.room,
            client: _this6.client
          });
        }
      });
    }
  }, {
    key: "sendMessage",
    value: function sendMessage(params) {
      var _this7 = this;

      var text = params.text;
      var attachments = params.attachments && params.attachments.length ? Array.from(params.attachments).filter(function (file) {
        return file;
      }) : [];
      var responseToMessageId = typeof params.responseToMessageId === 'string' ? params.responseToMessageId : null;
      var tempId = params.tempId;

      if (text.trim() || attachments.length) {
        return this.messagesSubscription.sendMessage({
          text: text,
          attachments: attachments,
          responseToMessageId: responseToMessageId,
          tempId: tempId
        }).then(function (message) {
          utilsCommon_1.logEvent(_this7.debug, 'Sent message', {
            message: message,
            params: params,
            normalizedParams: {
              text: text,
              attachments: attachments,
              responseToMessageId: responseToMessageId,
              tempId: tempId
            }
          });

          _this7.typingStatusSubscription.dispatchTypedText(false);

          return message;
        }).catch(function (error) {
          utilsCommon_1.logEvent(_this7.debug, 'Failed to send message', error, 'error');
          throw error;
        });
      } else {
        var errorMessage = 'Either "text" or "attachment" property must not be empty';
        utilsCommon_1.logEvent(this.debug, errorMessage, params, 'error');
        return new Promise(function (resolve, reject) {
          reject({
            message: errorMessage,
            params: params
          });
        });
      }
    }
  }, {
    key: "reachedBeginningOfMessageHistory",
    get: function get() {
      return this.messagesSubscription ? this.messagesSubscription.reachedBeginningOfMessageHistory : false;
    }
  }]);

  return ElixirChat;
}();

exports.ElixirChat = ElixirChat;

if (typeof window !== 'undefined') {
  window.ElixirChat = ElixirChat;
}
},{"unique-names-generator":"Qz33","../utilsCommon":"EjGt","./serializers/serializeUser":"1lqy","./MessagesSubscription":"y8vH","./TypingStatusSubscription":"QERd","./OperatorOnlineStatusSubscription":"zgd1","./ScreenshotTaker":"CLsL","./GraphQLClient":"1fv+"}],"7QCb":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ElixirChat_1 = require("./ElixirChat");

exports.default = ElixirChat_1.ElixirChat;
},{"./ElixirChat":"Pqo8"}],"Nvy6":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("babel-polyfill");

var utilsCommon_1 = require("../utilsCommon");

var Widget_1 = require("./DefaultWidget/Widget");

var ElixirChat = window.ElixirChat;

if (!window.ElixirChat) {
  ElixirChat = require('../sdk').default;
}

if (!ElixirChat) {
  utilsCommon_1.logEvent(true, 'Cannot find ElixirChat SDK. Are you sure you imported SDK (ether via "import" or via the <script/> tag)?\n' + 'See: https://github.com/elixirchat/elixirchat-js-sdk#add-default-widget', {
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
    _this.widgetIsIFrameReady = false;
    _this.widgetIsIFrameContentMounted = false;
    _this.widgetChatReactComponent = {};
    _this.widgetIFrameDocument = {};
    _this.onToggleChatVisibilityCallbacks = [];
    _this.onSetUnreadCountCallbacks = [];
    _this.onIFrameReadyCallbacks = [];
    _this.onIFrameContentMountedCallbacks = [];

    _this.setUnreadCount = function (count) {
      _this.widgetUnreadCount = +count || 0;

      _this.onSetUnreadCountCallbacks.forEach(function (callback) {
        return callback(_this.widgetUnreadCount);
      });
    };

    _this.onSetUnreadCount = function (callback) {
      _this.onSetUnreadCountCallbacks.push(callback);
    };

    _this.toggleChatVisibility =
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var callbacks, i;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this.widgetIsVisible = !_this.widgetIsVisible;
              callbacks = _this.onToggleChatVisibilityCallbacks;
              i = 0;

            case 3:
              if (!(i < callbacks.length)) {
                _context.next = 9;
                break;
              }

              _context.next = 6;
              return callbacks[i](_this.widgetIsVisible);

            case 6:
              i++;
              _context.next = 3;
              break;

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    _this.onToggleChatVisibility = function (callback) {
      _this.onToggleChatVisibilityCallbacks.push(callback);
    };

    _this.setIFrameReady =
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(iframeDocument) {
        var callbacks, i;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this.widgetIsIFrameReady = true;
                _this.widgetIFrameDocument = iframeDocument;
                callbacks = _this.onIFrameReadyCallbacks;
                i = 0;

              case 4:
                if (!(i < callbacks.length)) {
                  _context2.next = 10;
                  break;
                }

                _context2.next = 7;
                return callbacks[i]();

              case 7:
                i++;
                _context2.next = 4;
                break;

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }();

    _this.onIFrameReady = function (callback) {
      _this.onIFrameReadyCallbacks.push(callback);

      if (_this.widgetIsIFrameReady) {
        callback();
      }
    };

    _this.setIFrameContentMounted =
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      var callbacks, i;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _this.widgetIsIFrameContentMounted = true;
              callbacks = _this.onIFrameContentMountedCallbacks;
              i = 0;

            case 3:
              if (!(i < callbacks.length)) {
                _context3.next = 9;
                break;
              }

              _context3.next = 6;
              return callbacks[i]();

            case 6:
              i++;
              _context3.next = 3;
              break;

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    _this.onIFrameContentMounted = function (callback) {
      _this.onIFrameContentMountedCallbacks.push(callback);

      if (_this.widgetIsIFrameContentMounted) {
        callback();
      }
    };

    _this.appendWidget =
    /*#__PURE__*/
    function () {
      var _ref5 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(_ref4) {
        var container, _ref4$iframeStyles, iframeStyles, _ref4$visibleByDefaul, visibleByDefault, errorMessage;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                container = _ref4.container, _ref4$iframeStyles = _ref4.iframeStyles, iframeStyles = _ref4$iframeStyles === void 0 ? '' : _ref4$iframeStyles, _ref4$visibleByDefaul = _ref4.visibleByDefault, visibleByDefault = _ref4$visibleByDefaul === void 0 ? false : _ref4$visibleByDefaul;

                if (container instanceof HTMLElement) {
                  _context4.next = 5;
                  break;
                }

                errorMessage = 'You must provide an HTMLElement as a "container" option to appendWidget() method';
                utilsCommon_1.logEvent(_this.debug, errorMessage, {
                  container: container,
                  iframeStyles: iframeStyles,
                  visibleByDefault: visibleByDefault
                }, 'error');
                return _context4.abrupt("return");

              case 5:
                _this.container = container;
                _this.iframeStyles = iframeStyles || '';
                _this.visibleByDefault = visibleByDefault;
                _this.widgetChatReactComponent = Widget_1.renderWidgetReactComponent(_this.container, _assertThisInitialized(_this));

                _this.onIFrameReady(function () {
                  if (_this.visibleByDefault) {
                    _this.toggleChatVisibility();
                  }
                });

                utilsCommon_1.logEvent(_this.debug, 'Appended ElixirChat default widget', {
                  container: container
                });
                return _context4.abrupt("return", _this.widgetChatReactComponent);

              case 12:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      return function (_x2) {
        return _ref5.apply(this, arguments);
      };
    }();

    return _this;
  }

  return ElixirChatWidget;
}(ElixirChat);

exports.ElixirChatWidget = ElixirChatWidget;

if (typeof window !== 'undefined') {
  window.ElixirChatWidget = ElixirChatWidget;
}
},{"babel-polyfill":"wllv","../utilsCommon":"EjGt","./DefaultWidget/Widget":"2RVT","../sdk":"7QCb"}],"7QCb":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ElixirChatWidget_1 = require("./ElixirChatWidget");

exports.default = ElixirChatWidget_1.ElixirChatWidget;
},{"./ElixirChatWidget":"Nvy6"}]},{},["7QCb"], null)