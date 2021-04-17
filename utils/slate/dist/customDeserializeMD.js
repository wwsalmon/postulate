function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
// ASSET: node_modules/unified/index.js
var $0e83540398b72d6c7ff5b7960200199e$exports = {};
// ASSET: node_modules/bail/index.js
var $767b5d156eb5c1acf0957fd6d4f1c24f$exports = {};
$767b5d156eb5c1acf0957fd6d4f1c24f$exports = $767b5d156eb5c1acf0957fd6d4f1c24f$var$bail;
function $767b5d156eb5c1acf0957fd6d4f1c24f$var$bail(err) {
  if (err) {
    throw err;
  }
}
var $0e83540398b72d6c7ff5b7960200199e$var$bail = $767b5d156eb5c1acf0957fd6d4f1c24f$exports;
// ASSET: node_modules/unified/node_modules/is-buffer/index.js
var $41548ce910323f1afed7d688847ddf13$exports = {};
/*!
* Determine if an object is a Buffer
*
* @author   Feross Aboukhadijeh <https://feross.org>
* @license  MIT
*/
$41548ce910323f1afed7d688847ddf13$exports = function isBuffer(obj) {
  return obj != null && obj.constructor != null && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj);
};
var $0e83540398b72d6c7ff5b7960200199e$var$buffer = $41548ce910323f1afed7d688847ddf13$exports;
// ASSET: node_modules/extend/index.js
var $8e6229493b493af405ee178eb724c773$exports = {};
var $8e6229493b493af405ee178eb724c773$var$hasOwn = Object.prototype.hasOwnProperty;
var $8e6229493b493af405ee178eb724c773$var$toStr = Object.prototype.toString;
var $8e6229493b493af405ee178eb724c773$var$defineProperty = Object.defineProperty;
var $8e6229493b493af405ee178eb724c773$var$gOPD = Object.getOwnPropertyDescriptor;
var $8e6229493b493af405ee178eb724c773$var$isArray = function isArray(arr) {
  if (typeof Array.isArray === 'function') {
    return Array.isArray(arr);
  }
  return $8e6229493b493af405ee178eb724c773$var$toStr.call(arr) === '[object Array]';
};
var $8e6229493b493af405ee178eb724c773$var$isPlainObject = function isPlainObject(obj) {
  if (!obj || $8e6229493b493af405ee178eb724c773$var$toStr.call(obj) !== '[object Object]') {
    return false;
  }
  var hasOwnConstructor = $8e6229493b493af405ee178eb724c773$var$hasOwn.call(obj, 'constructor');
  var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && $8e6229493b493af405ee178eb724c773$var$hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
  // Not own constructor property must be Object
  if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
    return false;
  }
  // Own properties are enumerated firstly, so to speed up,
  // if last one is own, then all properties are own.
  var key;
  for (key in obj) {}
  return typeof key === 'undefined' || $8e6229493b493af405ee178eb724c773$var$hasOwn.call(obj, key);
};
// If name is '__proto__', and Object.defineProperty is available, define __proto__ as an own property on target
var $8e6229493b493af405ee178eb724c773$var$setProperty = function setProperty(target, options) {
  if ($8e6229493b493af405ee178eb724c773$var$defineProperty && options.name === '__proto__') {
    $8e6229493b493af405ee178eb724c773$var$defineProperty(target, options.name, {
      enumerable: true,
      configurable: true,
      value: options.newValue,
      writable: true
    });
  } else {
    target[options.name] = options.newValue;
  }
};
// Return undefined instead of __proto__ if '__proto__' is not an own property
var $8e6229493b493af405ee178eb724c773$var$getProperty = function getProperty(obj, name) {
  if (name === '__proto__') {
    if (!$8e6229493b493af405ee178eb724c773$var$hasOwn.call(obj, name)) {
      return void 0;
    } else if ($8e6229493b493af405ee178eb724c773$var$gOPD) {
      // In early versions of node, obj['__proto__'] is buggy when obj has
      // __proto__ as an own property. Object.getOwnPropertyDescriptor() works.
      return $8e6229493b493af405ee178eb724c773$var$gOPD(obj, name).value;
    }
  }
  return obj[name];
};
$8e6229493b493af405ee178eb724c773$exports = function extend() {
  var options, name, src, copy, copyIsArray, clone;
  var target = arguments[0];
  var i = 1;
  var length = arguments.length;
  var deep = false;
  // Handle a deep copy situation
  if (typeof target === 'boolean') {
    deep = target;
    target = arguments[1] || ({});
    // skip the boolean and the target
    i = 2;
  }
  if (target == null || typeof target !== 'object' && typeof target !== 'function') {
    target = {};
  }
  for (; i < length; ++i) {
    options = arguments[i];
    // Only deal with non-null/undefined values
    if (options != null) {
      // Extend the base object
      for (name in options) {
        src = $8e6229493b493af405ee178eb724c773$var$getProperty(target, name);
        copy = $8e6229493b493af405ee178eb724c773$var$getProperty(options, name);
        // Prevent never-ending loop
        if (target !== copy) {
          // Recurse if we're merging plain objects or arrays
          if (deep && copy && ($8e6229493b493af405ee178eb724c773$var$isPlainObject(copy) || (copyIsArray = $8e6229493b493af405ee178eb724c773$var$isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && $8e6229493b493af405ee178eb724c773$var$isArray(src) ? src : [];
            } else {
              clone = src && $8e6229493b493af405ee178eb724c773$var$isPlainObject(src) ? src : {};
            }
            // Never move original objects, clone them
            $8e6229493b493af405ee178eb724c773$var$setProperty(target, {
              name: name,
              newValue: extend(deep, clone, copy)
            });
          } else if (typeof copy !== 'undefined') {
            $8e6229493b493af405ee178eb724c773$var$setProperty(target, {
              name: name,
              newValue: copy
            });
          }
        }
      }
    }
  }
  // Return the modified object
  return target;
};
var $0e83540398b72d6c7ff5b7960200199e$var$extend = $8e6229493b493af405ee178eb724c773$exports;
// ASSET: node_modules/is-plain-obj/index.js
var $133af9e1eca3ce616b612c32bd5b0c7f$exports = {};
$133af9e1eca3ce616b612c32bd5b0c7f$exports = value => {
  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
};
var $0e83540398b72d6c7ff5b7960200199e$var$plain = $133af9e1eca3ce616b612c32bd5b0c7f$exports;
// ASSET: node_modules/trough/index.js
var $6d0df8e1dbf0cb3cf0bf2a1c20696769$exports = {};
// ASSET: node_modules/trough/wrap.js
var $0a37c7c1b2cd30ce3e1d68791547076d$exports = {};
var $0a37c7c1b2cd30ce3e1d68791547076d$var$slice = [].slice;
$0a37c7c1b2cd30ce3e1d68791547076d$exports = $0a37c7c1b2cd30ce3e1d68791547076d$var$wrap;
// Wrap `fn`.
// Can be sync or async; return a promise, receive a completion handler, return
// new values and errors.
function $0a37c7c1b2cd30ce3e1d68791547076d$var$wrap(fn, callback) {
  var invoked;
  return wrapped;
  function wrapped() {
    var params = $0a37c7c1b2cd30ce3e1d68791547076d$var$slice.call(arguments, 0);
    var callback = fn.length > params.length;
    var result;
    if (callback) {
      params.push(done);
    }
    try {
      result = fn.apply(null, params);
    } catch (error) {
      // Well, this is quite the pickle.
      // `fn` received a callback and invoked it (thus continuing the pipeline),
      // but later also threw an error.
      // We’re not about to restart the pipeline again, so the only thing left
      // to do is to throw the thing instead.
      if (callback && invoked) {
        throw error;
      }
      return done(error);
    }
    if (!callback) {
      if (result && typeof result.then === 'function') {
        result.then(then, done);
      } else if (result instanceof Error) {
        done(result);
      } else {
        then(result);
      }
    }
  }
  // Invoke `next`, only once.
  function done() {
    if (!invoked) {
      invoked = true;
      callback.apply(null, arguments);
    }
  }
  // Invoke `done` with one value.
  // Tracks if an error is passed, too.
  function then(value) {
    done(null, value);
  }
}
var $6d0df8e1dbf0cb3cf0bf2a1c20696769$var$wrap = $0a37c7c1b2cd30ce3e1d68791547076d$exports;
$6d0df8e1dbf0cb3cf0bf2a1c20696769$exports = $6d0df8e1dbf0cb3cf0bf2a1c20696769$var$trough;
$6d0df8e1dbf0cb3cf0bf2a1c20696769$var$trough.wrap = $6d0df8e1dbf0cb3cf0bf2a1c20696769$var$wrap;
var $6d0df8e1dbf0cb3cf0bf2a1c20696769$var$slice = [].slice;
// Create new middleware.
function $6d0df8e1dbf0cb3cf0bf2a1c20696769$var$trough() {
  var fns = [];
  var middleware = {};
  middleware.run = run;
  middleware.use = use;
  return middleware;
  // Run `fns`.  Last argument must be a completion handler.
  function run() {
    var index = -1;
    var input = $6d0df8e1dbf0cb3cf0bf2a1c20696769$var$slice.call(arguments, 0, -1);
    var done = arguments[arguments.length - 1];
    if (typeof done !== 'function') {
      throw new Error('Expected function as last argument, not ' + done);
    }
    next.apply(null, [null].concat(input));
    // Run the next `fn`, if any.
    function next(err) {
      var fn = fns[++index];
      var params = $6d0df8e1dbf0cb3cf0bf2a1c20696769$var$slice.call(arguments, 0);
      var values = params.slice(1);
      var length = input.length;
      var pos = -1;
      if (err) {
        done(err);
        return;
      }
      // Copy non-nully input into values.
      while (++pos < length) {
        if (values[pos] === null || values[pos] === undefined) {
          values[pos] = input[pos];
        }
      }
      input = values;
      // Next or done.
      if (fn) {
        $6d0df8e1dbf0cb3cf0bf2a1c20696769$var$wrap(fn, next).apply(null, input);
      } else {
        done.apply(null, [null].concat(input));
      }
    }
  }
  // Add `fn` to the list.
  function use(fn) {
    if (typeof fn !== 'function') {
      throw new Error('Expected `fn` to be a function, not ' + fn);
    }
    fns.push(fn);
    return middleware;
  }
}
var $0e83540398b72d6c7ff5b7960200199e$var$trough = $6d0df8e1dbf0cb3cf0bf2a1c20696769$exports;
// ASSET: node_modules/vfile/index.js
var $52c87acfaf081714af2cd0b9a36c45f7$exports = {};
// ASSET: node_modules/vfile/lib/index.js
var $9e225faa8c06c4fc16bdb15be3ef2148$exports = {};
// ASSET: node_modules/vfile-message/index.js
var $ed672b91225d7df2555bc7b6bb628d8e$exports = {};
// ASSET: node_modules/unist-util-stringify-position/index.js
var $4f36b95a30d2954da268e0c54f89babe$exports = {};
var $4f36b95a30d2954da268e0c54f89babe$var$own = ({}).hasOwnProperty;
$4f36b95a30d2954da268e0c54f89babe$exports = $4f36b95a30d2954da268e0c54f89babe$var$stringify;
function $4f36b95a30d2954da268e0c54f89babe$var$stringify(value) {
  // Nothing.
  if (!value || typeof value !== 'object') {
    return '';
  }
  // Node.
  if ($4f36b95a30d2954da268e0c54f89babe$var$own.call(value, 'position') || $4f36b95a30d2954da268e0c54f89babe$var$own.call(value, 'type')) {
    return $4f36b95a30d2954da268e0c54f89babe$var$position(value.position);
  }
  // Position.
  if ($4f36b95a30d2954da268e0c54f89babe$var$own.call(value, 'start') || $4f36b95a30d2954da268e0c54f89babe$var$own.call(value, 'end')) {
    return $4f36b95a30d2954da268e0c54f89babe$var$position(value);
  }
  // Point.
  if ($4f36b95a30d2954da268e0c54f89babe$var$own.call(value, 'line') || $4f36b95a30d2954da268e0c54f89babe$var$own.call(value, 'column')) {
    return $4f36b95a30d2954da268e0c54f89babe$var$point(value);
  }
  // ?
  return '';
}
function $4f36b95a30d2954da268e0c54f89babe$var$point(point) {
  if (!point || typeof point !== 'object') {
    point = {};
  }
  return $4f36b95a30d2954da268e0c54f89babe$var$index(point.line) + ':' + $4f36b95a30d2954da268e0c54f89babe$var$index(point.column);
}
function $4f36b95a30d2954da268e0c54f89babe$var$position(pos) {
  if (!pos || typeof pos !== 'object') {
    pos = {};
  }
  return $4f36b95a30d2954da268e0c54f89babe$var$point(pos.start) + '-' + $4f36b95a30d2954da268e0c54f89babe$var$point(pos.end);
}
function $4f36b95a30d2954da268e0c54f89babe$var$index(value) {
  return value && typeof value === 'number' ? value : 1;
}
var $ed672b91225d7df2555bc7b6bb628d8e$var$stringify = $4f36b95a30d2954da268e0c54f89babe$exports;
$ed672b91225d7df2555bc7b6bb628d8e$exports = $ed672b91225d7df2555bc7b6bb628d8e$var$VMessage;
// Inherit from `Error#`.
function $ed672b91225d7df2555bc7b6bb628d8e$var$VMessagePrototype() {}
$ed672b91225d7df2555bc7b6bb628d8e$var$VMessagePrototype.prototype = Error.prototype;
$ed672b91225d7df2555bc7b6bb628d8e$var$VMessage.prototype = new $ed672b91225d7df2555bc7b6bb628d8e$var$VMessagePrototype();
// Message properties.
var $ed672b91225d7df2555bc7b6bb628d8e$var$proto = $ed672b91225d7df2555bc7b6bb628d8e$var$VMessage.prototype;
$ed672b91225d7df2555bc7b6bb628d8e$var$proto.file = '';
$ed672b91225d7df2555bc7b6bb628d8e$var$proto.name = '';
$ed672b91225d7df2555bc7b6bb628d8e$var$proto.reason = '';
$ed672b91225d7df2555bc7b6bb628d8e$var$proto.message = '';
$ed672b91225d7df2555bc7b6bb628d8e$var$proto.stack = '';
$ed672b91225d7df2555bc7b6bb628d8e$var$proto.fatal = null;
$ed672b91225d7df2555bc7b6bb628d8e$var$proto.column = null;
$ed672b91225d7df2555bc7b6bb628d8e$var$proto.line = null;
// Construct a new VMessage.
//
// Note: We cannot invoke `Error` on the created context, as that adds readonly
// `line` and `column` attributes on Safari 9, thus throwing and failing the
// data.
function $ed672b91225d7df2555bc7b6bb628d8e$var$VMessage(reason, position, origin) {
  var parts;
  var range;
  var location;
  if (typeof position === 'string') {
    origin = position;
    position = null;
  }
  parts = $ed672b91225d7df2555bc7b6bb628d8e$var$parseOrigin(origin);
  range = $ed672b91225d7df2555bc7b6bb628d8e$var$stringify(position) || '1:1';
  location = {
    start: {
      line: null,
      column: null
    },
    end: {
      line: null,
      column: null
    }
  };
  // Node.
  if (position && position.position) {
    position = position.position;
  }
  if (position) {
    // Position.
    if (position.start) {
      location = position;
      position = position.start;
    } else {
      // Point.
      location.start = position;
    }
  }
  if (reason.stack) {
    this.stack = reason.stack;
    reason = reason.message;
  }
  this.message = reason;
  this.name = range;
  this.reason = reason;
  this.line = position ? position.line : null;
  this.column = position ? position.column : null;
  this.location = location;
  this.source = parts[0];
  this.ruleId = parts[1];
}
function $ed672b91225d7df2555bc7b6bb628d8e$var$parseOrigin(origin) {
  var result = [null, null];
  var index;
  if (typeof origin === 'string') {
    index = origin.indexOf(':');
    if (index === -1) {
      result[1] = origin;
    } else {
      result[0] = origin.slice(0, index);
      result[1] = origin.slice(index + 1);
    }
  }
  return result;
}
var $9e225faa8c06c4fc16bdb15be3ef2148$var$VMessage = $ed672b91225d7df2555bc7b6bb628d8e$exports;
// ASSET: node_modules/vfile/lib/core.js
var $9ec8a52fd5fa8ff709ca28bc89b4e9a3$exports = {};
var $9479d8345b5241e1739ab4bdc2a70e0b$export$basename = $9479d8345b5241e1739ab4bdc2a70e0b$var$basename;
var $9479d8345b5241e1739ab4bdc2a70e0b$export$dirname = $9479d8345b5241e1739ab4bdc2a70e0b$var$dirname;
var $9479d8345b5241e1739ab4bdc2a70e0b$export$extname = $9479d8345b5241e1739ab4bdc2a70e0b$var$extname;
var $9479d8345b5241e1739ab4bdc2a70e0b$export$join = $9479d8345b5241e1739ab4bdc2a70e0b$var$join;
var $9479d8345b5241e1739ab4bdc2a70e0b$export$sep = '/';
function $9479d8345b5241e1739ab4bdc2a70e0b$var$basename(path, ext) {
  var start = 0;
  var end = -1;
  var index;
  var firstNonSlashEnd;
  var seenNonSlash;
  var extIndex;
  if (ext !== undefined && typeof ext !== 'string') {
    throw new TypeError('"ext" argument must be a string');
  }
  $9479d8345b5241e1739ab4bdc2a70e0b$var$assertPath(path);
  index = path.length;
  if (ext === undefined || !ext.length || ext.length > path.length) {
    while (index--) {
      if (path.charCodeAt(index) === 47) /*`/`*/
      {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now.
        if (seenNonSlash) {
          start = index + 1;
          break;
        }
      } else if (end < 0) {
        // We saw the first non-path separator, mark this as the end of our
        // path component.
        seenNonSlash = true;
        end = index + 1;
      }
    }
    return end < 0 ? '' : path.slice(start, end);
  }
  if (ext === path) {
    return '';
  }
  firstNonSlashEnd = -1;
  extIndex = ext.length - 1;
  while (index--) {
    if (path.charCodeAt(index) === 47) /*`/`*/
    {
      // If we reached a path separator that was not part of a set of path
      // separators at the end of the string, stop now.
      if (seenNonSlash) {
        start = index + 1;
        break;
      }
    } else {
      if (firstNonSlashEnd < 0) {
        // We saw the first non-path separator, remember this index in case
        // we need it if the extension ends up not matching.
        seenNonSlash = true;
        firstNonSlashEnd = index + 1;
      }
      if (extIndex > -1) {
        // Try to match the explicit extension.
        if (path.charCodeAt(index) === ext.charCodeAt(extIndex--)) {
          if (extIndex < 0) {
            // We matched the extension, so mark this as the end of our path
            // component
            end = index;
          }
        } else {
          // Extension does not match, so our result is the entire path
          // component
          extIndex = -1;
          end = firstNonSlashEnd;
        }
      }
    }
  }
  if (start === end) {
    end = firstNonSlashEnd;
  } else if (end < 0) {
    end = path.length;
  }
  return path.slice(start, end);
}
function $9479d8345b5241e1739ab4bdc2a70e0b$var$dirname(path) {
  var end;
  var unmatchedSlash;
  var index;
  $9479d8345b5241e1739ab4bdc2a70e0b$var$assertPath(path);
  if (!path.length) {
    return '.';
  }
  end = -1;
  index = path.length;
  // Prefix `--` is important to not run on `0`.
  while (--index) {
    if (path.charCodeAt(index) === 47) /*`/`*/
    {
      if (unmatchedSlash) {
        end = index;
        break;
      }
    } else if (!unmatchedSlash) {
      // We saw the first non-path separator
      unmatchedSlash = true;
    }
  }
  return end < 0 ? path.charCodeAt(0) === 47 ? /*`/`*/
  '/' : '.' : end === 1 && path.charCodeAt(0) === 47 ? /*`/`*/
  '//' : path.slice(0, end);
}
function $9479d8345b5241e1739ab4bdc2a70e0b$var$extname(path) {
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find.
  var preDotState = 0;
  var unmatchedSlash;
  var code;
  var index;
  $9479d8345b5241e1739ab4bdc2a70e0b$var$assertPath(path);
  index = path.length;
  while (index--) {
    code = path.charCodeAt(index);
    if (code === 47) /*`/`*/
    {
      // If we reached a path separator that was not part of a set of path
      // separators at the end of the string, stop now.
      if (unmatchedSlash) {
        startPart = index + 1;
        break;
      }
      continue;
    }
    if (end < 0) {
      // We saw the first non-path separator, mark this as the end of our
      // extension.
      unmatchedSlash = true;
      end = index + 1;
    }
    if (code === 46) /*`.`*/
    {
      // If this is our first dot, mark it as the start of our extension.
      if (startDot < 0) {
        startDot = index;
      } else if (preDotState !== 1) {
        preDotState = 1;
      }
    } else if (startDot > -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension.
      preDotState = -1;
    }
  }
  if (startDot < 0 || end < 0 || // We saw a non-dot character immediately before the dot.
  preDotState === 0 || // The (right-most) trimmed path component is exactly `..`.
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
}
function $9479d8345b5241e1739ab4bdc2a70e0b$var$join() {
  var index = -1;
  var joined;
  while (++index < arguments.length) {
    $9479d8345b5241e1739ab4bdc2a70e0b$var$assertPath(arguments[index]);
    if (arguments[index]) {
      joined = joined === undefined ? arguments[index] : joined + '/' + arguments[index];
    }
  }
  return joined === undefined ? '.' : $9479d8345b5241e1739ab4bdc2a70e0b$var$normalize(joined);
}
// Note: `normalize` is not exposed as `path.normalize`, so some code is
// manually removed from it.
function $9479d8345b5241e1739ab4bdc2a70e0b$var$normalize(path) {
  var absolute;
  var value;
  $9479d8345b5241e1739ab4bdc2a70e0b$var$assertPath(path);
  absolute = path.charCodeAt(0) === 47;
  /*`/`*/
  // Normalize the path according to POSIX rules.
  value = $9479d8345b5241e1739ab4bdc2a70e0b$var$normalizeString(path, !absolute);
  if (!value.length && !absolute) {
    value = '.';
  }
  if (value.length && path.charCodeAt(path.length - 1) === 47) /*/*/
  {
    value += '/';
  }
  return absolute ? '/' + value : value;
}
// Resolve `.` and `..` elements in a path with directory names.
function $9479d8345b5241e1739ab4bdc2a70e0b$var$normalizeString(path, allowAboveRoot) {
  var result = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var index = -1;
  var code;
  var lastSlashIndex;
  while (++index <= path.length) {
    if (index < path.length) {
      code = path.charCodeAt(index);
    } else if (code === 47) /*`/`*/
    {
      break;
    } else {
      code = 47;
    }
    if (code === 47) /*`/`*/
    {
      if (lastSlash === index - 1 || dots === 1) {} else if (lastSlash !== index - 1 && dots === 2) {
        if (result.length < 2 || lastSegmentLength !== 2 || result.charCodeAt(result.length - 1) !== 46 || /*`.`*/
        result.charCodeAt(result.length - 2) !== 46) /*`.`*/
        {
          if (result.length > 2) {
            lastSlashIndex = result.lastIndexOf('/');
            /*istanbul ignore else - No clue how to cover it.*/
            if (lastSlashIndex !== result.length - 1) {
              if (lastSlashIndex < 0) {
                result = '';
                lastSegmentLength = 0;
              } else {
                result = result.slice(0, lastSlashIndex);
                lastSegmentLength = result.length - 1 - result.lastIndexOf('/');
              }
              lastSlash = index;
              dots = 0;
              continue;
            }
          } else if (result.length) {
            result = '';
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          result = result.length ? result + '/..' : '..';
          lastSegmentLength = 2;
        }
      } else {
        if (result.length) {
          result += '/' + path.slice(lastSlash + 1, index);
        } else {
          result = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (code === 46 && /*`.`*/
    dots > -1) {
      dots++;
    } else {
      dots = -1;
    }
  }
  return result;
}
function $9479d8345b5241e1739ab4bdc2a70e0b$var$assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}
var $8d1a6784f59af5dcb7e7e62f70f5ac07$export$cwd = $8d1a6784f59af5dcb7e7e62f70f5ac07$var$cwd;
function $8d1a6784f59af5dcb7e7e62f70f5ac07$var$cwd() {
  return '/';
}
// ASSET: node_modules/vfile/node_modules/is-buffer/index.js
var $c2585d63896ca469b44e33b24b0904ff$exports = {};
/*!
* Determine if an object is a Buffer
*
* @author   Feross Aboukhadijeh <https://feross.org>
* @license  MIT
*/
$c2585d63896ca469b44e33b24b0904ff$exports = function isBuffer(obj) {
  return obj != null && obj.constructor != null && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj);
};
var $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$buffer = $c2585d63896ca469b44e33b24b0904ff$exports;
$9ec8a52fd5fa8ff709ca28bc89b4e9a3$exports = $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$VFile;
var $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$own = ({}).hasOwnProperty;
// Order of setting (least specific to most), we need this because otherwise
// `{stem: 'a', path: '~/b.js'}` would throw, as a path is needed before a
// stem can be set.
var $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$order = ['history', 'path', 'basename', 'stem', 'extname', 'dirname'];
$9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$VFile.prototype.toString = $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$toString;
// Access full path (`~/index.min.js`).
Object.defineProperty($9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$VFile.prototype, 'path', {
  get: $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$getPath,
  set: $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$setPath
});
// Access parent path (`~`).
Object.defineProperty($9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$VFile.prototype, 'dirname', {
  get: $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$getDirname,
  set: $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$setDirname
});
// Access basename (`index.min.js`).
Object.defineProperty($9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$VFile.prototype, 'basename', {
  get: $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$getBasename,
  set: $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$setBasename
});
// Access extname (`.js`).
Object.defineProperty($9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$VFile.prototype, 'extname', {
  get: $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$getExtname,
  set: $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$setExtname
});
// Access stem (`index.min`).
Object.defineProperty($9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$VFile.prototype, 'stem', {
  get: $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$getStem,
  set: $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$setStem
});
// Construct a new file.
function $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$VFile(options) {
  var prop;
  var index;
  if (!options) {
    options = {};
  } else if (typeof options === 'string' || $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$buffer(options)) {
    options = {
      contents: options
    };
  } else if (('message' in options) && ('messages' in options)) {
    return options;
  }
  if (!(this instanceof $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$VFile)) {
    return new $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$VFile(options);
  }
  this.data = {};
  this.messages = [];
  this.history = [];
  this.cwd = $8d1a6784f59af5dcb7e7e62f70f5ac07$export$cwd();
  // Set path related properties in the correct order.
  index = -1;
  while (++index < $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$order.length) {
    prop = $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$order[index];
    if ($9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$own.call(options, prop)) {
      this[prop] = options[prop];
    }
  }
  // Set non-path related properties.
  for (prop in options) {
    if ($9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$order.indexOf(prop) < 0) {
      this[prop] = options[prop];
    }
  }
}
function $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$getPath() {
  return this.history[this.history.length - 1];
}
function $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$setPath(path) {
  $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$assertNonEmpty(path, 'path');
  if (this.path !== path) {
    this.history.push(path);
  }
}
function $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$getDirname() {
  return typeof this.path === 'string' ? $9479d8345b5241e1739ab4bdc2a70e0b$export$dirname(this.path) : undefined;
}
function $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$setDirname(dirname) {
  $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$assertPath(this.path, 'dirname');
  this.path = $9479d8345b5241e1739ab4bdc2a70e0b$export$join(dirname || '', this.basename);
}
function $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$getBasename() {
  return typeof this.path === 'string' ? $9479d8345b5241e1739ab4bdc2a70e0b$export$basename(this.path) : undefined;
}
function $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$setBasename(basename) {
  $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$assertNonEmpty(basename, 'basename');
  $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$assertPart(basename, 'basename');
  this.path = $9479d8345b5241e1739ab4bdc2a70e0b$export$join(this.dirname || '', basename);
}
function $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$getExtname() {
  return typeof this.path === 'string' ? $9479d8345b5241e1739ab4bdc2a70e0b$export$extname(this.path) : undefined;
}
function $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$setExtname(extname) {
  $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$assertPart(extname, 'extname');
  $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$assertPath(this.path, 'extname');
  if (extname) {
    if (extname.charCodeAt(0) !== 46) /*`.`*/
    {
      throw new Error('`extname` must start with `.`');
    }
    if (extname.indexOf('.', 1) > -1) {
      throw new Error('`extname` cannot contain multiple dots');
    }
  }
  this.path = $9479d8345b5241e1739ab4bdc2a70e0b$export$join(this.dirname, this.stem + (extname || ''));
}
function $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$getStem() {
  return typeof this.path === 'string' ? $9479d8345b5241e1739ab4bdc2a70e0b$export$basename(this.path, this.extname) : undefined;
}
function $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$setStem(stem) {
  $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$assertNonEmpty(stem, 'stem');
  $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$assertPart(stem, 'stem');
  this.path = $9479d8345b5241e1739ab4bdc2a70e0b$export$join(this.dirname || '', stem + (this.extname || ''));
}
// Get the value of the file.
function $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$toString(encoding) {
  return (this.contents || '').toString(encoding);
}
// Assert that `part` is not a path (i.e., does not contain `p.sep`).
function $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$assertPart(part, name) {
  if (part && part.indexOf($9479d8345b5241e1739ab4bdc2a70e0b$export$sep) > -1) {
    throw new Error('`' + name + '` cannot be a path: did not expect `' + $9479d8345b5241e1739ab4bdc2a70e0b$export$sep + '`');
  }
}
// Assert that `part` is not empty.
function $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$assertNonEmpty(part, name) {
  if (!part) {
    throw new Error('`' + name + '` cannot be empty');
  }
}
// Assert `path` exists.
function $9ec8a52fd5fa8ff709ca28bc89b4e9a3$var$assertPath(path, name) {
  if (!path) {
    throw new Error('Setting `' + name + '` requires `path` to be set too');
  }
}
var $9e225faa8c06c4fc16bdb15be3ef2148$var$VFile = $9ec8a52fd5fa8ff709ca28bc89b4e9a3$exports;
$9e225faa8c06c4fc16bdb15be3ef2148$exports = $9e225faa8c06c4fc16bdb15be3ef2148$var$VFile;
$9e225faa8c06c4fc16bdb15be3ef2148$var$VFile.prototype.message = $9e225faa8c06c4fc16bdb15be3ef2148$var$message;
$9e225faa8c06c4fc16bdb15be3ef2148$var$VFile.prototype.info = $9e225faa8c06c4fc16bdb15be3ef2148$var$info;
$9e225faa8c06c4fc16bdb15be3ef2148$var$VFile.prototype.fail = $9e225faa8c06c4fc16bdb15be3ef2148$var$fail;
// Create a message with `reason` at `position`.
// When an error is passed in as `reason`, copies the stack.
function $9e225faa8c06c4fc16bdb15be3ef2148$var$message(reason, position, origin) {
  var message = new $9e225faa8c06c4fc16bdb15be3ef2148$var$VMessage(reason, position, origin);
  if (this.path) {
    message.name = this.path + ':' + message.name;
    message.file = this.path;
  }
  message.fatal = false;
  this.messages.push(message);
  return message;
}
// Fail: creates a vmessage, associates it with the file, and throws it.
function $9e225faa8c06c4fc16bdb15be3ef2148$var$fail() {
  var message = this.message.apply(this, arguments);
  message.fatal = true;
  throw message;
}
// Info: creates a vmessage, associates it with the file, and marks the fatality
// as null.
function $9e225faa8c06c4fc16bdb15be3ef2148$var$info() {
  var message = this.message.apply(this, arguments);
  message.fatal = null;
  return message;
}
$52c87acfaf081714af2cd0b9a36c45f7$exports = $9e225faa8c06c4fc16bdb15be3ef2148$exports;
var $0e83540398b72d6c7ff5b7960200199e$var$vfile = $52c87acfaf081714af2cd0b9a36c45f7$exports;
// Expose a frozen processor.
$0e83540398b72d6c7ff5b7960200199e$exports = $0e83540398b72d6c7ff5b7960200199e$var$unified().freeze();
var $0e83540398b72d6c7ff5b7960200199e$var$slice = [].slice;
var $0e83540398b72d6c7ff5b7960200199e$var$own = ({}).hasOwnProperty;
// Process pipeline.
var $0e83540398b72d6c7ff5b7960200199e$var$pipeline = $0e83540398b72d6c7ff5b7960200199e$var$trough().use($0e83540398b72d6c7ff5b7960200199e$var$pipelineParse).use($0e83540398b72d6c7ff5b7960200199e$var$pipelineRun).use($0e83540398b72d6c7ff5b7960200199e$var$pipelineStringify);
function $0e83540398b72d6c7ff5b7960200199e$var$pipelineParse(p, ctx) {
  ctx.tree = p.parse(ctx.file);
}
function $0e83540398b72d6c7ff5b7960200199e$var$pipelineRun(p, ctx, next) {
  p.run(ctx.tree, ctx.file, done);
  function done(error, tree, file) {
    if (error) {
      next(error);
    } else {
      ctx.tree = tree;
      ctx.file = file;
      next();
    }
  }
}
function $0e83540398b72d6c7ff5b7960200199e$var$pipelineStringify(p, ctx) {
  var result = p.stringify(ctx.tree, ctx.file);
  if (result === undefined || result === null) {} else if (typeof result === 'string' || $0e83540398b72d6c7ff5b7960200199e$var$buffer(result)) {
    ctx.file.contents = result;
  } else {
    ctx.file.result = result;
  }
}
// Function to create the first processor.
function $0e83540398b72d6c7ff5b7960200199e$var$unified() {
  var attachers = [];
  var transformers = $0e83540398b72d6c7ff5b7960200199e$var$trough();
  var namespace = {};
  var freezeIndex = -1;
  var frozen;
  // Data management.
  processor.data = data;
  // Lock.
  processor.freeze = freeze;
  // Plugins.
  processor.attachers = attachers;
  processor.use = use;
  // API.
  processor.parse = parse;
  processor.stringify = stringify;
  processor.run = run;
  processor.runSync = runSync;
  processor.process = process;
  processor.processSync = processSync;
  // Expose.
  return processor;
  // Create a new processor based on the processor in the current scope.
  function processor() {
    var destination = $0e83540398b72d6c7ff5b7960200199e$var$unified();
    var index = -1;
    while (++index < attachers.length) {
      destination.use.apply(null, attachers[index]);
    }
    destination.data($0e83540398b72d6c7ff5b7960200199e$var$extend(true, {}, namespace));
    return destination;
  }
  // Freeze: used to signal a processor that has finished configuration.
  //
  // For example, take unified itself: it’s frozen.
  // Plugins should not be added to it.
  // Rather, it should be extended, by invoking it, before modifying it.
  //
  // In essence, always invoke this when exporting a processor.
  function freeze() {
    var values;
    var transformer;
    if (frozen) {
      return processor;
    }
    while (++freezeIndex < attachers.length) {
      values = attachers[freezeIndex];
      if (values[1] === false) {
        continue;
      }
      if (values[1] === true) {
        values[1] = undefined;
      }
      transformer = values[0].apply(processor, values.slice(1));
      if (typeof transformer === 'function') {
        transformers.use(transformer);
      }
    }
    frozen = true;
    freezeIndex = Infinity;
    return processor;
  }
  // Data management.
  // Getter / setter for processor-specific informtion.
  function data(key, value) {
    if (typeof key === 'string') {
      // Set `key`.
      if (arguments.length === 2) {
        $0e83540398b72d6c7ff5b7960200199e$var$assertUnfrozen('data', frozen);
        namespace[key] = value;
        return processor;
      }
      // Get `key`.
      return $0e83540398b72d6c7ff5b7960200199e$var$own.call(namespace, key) && namespace[key] || null;
    }
    // Set space.
    if (key) {
      $0e83540398b72d6c7ff5b7960200199e$var$assertUnfrozen('data', frozen);
      namespace = key;
      return processor;
    }
    // Get space.
    return namespace;
  }
  // Plugin management.
  //
  // Pass it:
  // *   an attacher and options,
  // *   a preset,
  // *   a list of presets, attachers, and arguments (list of attachers and
  // options).
  function use(value) {
    var settings;
    $0e83540398b72d6c7ff5b7960200199e$var$assertUnfrozen('use', frozen);
    if (value === null || value === undefined) {} else if (typeof value === 'function') {
      addPlugin.apply(null, arguments);
    } else if (typeof value === 'object') {
      if (('length' in value)) {
        addList(value);
      } else {
        addPreset(value);
      }
    } else {
      throw new Error('Expected usable value, not `' + value + '`');
    }
    if (settings) {
      namespace.settings = $0e83540398b72d6c7ff5b7960200199e$var$extend(namespace.settings || ({}), settings);
    }
    return processor;
    function addPreset(result) {
      addList(result.plugins);
      if (result.settings) {
        settings = $0e83540398b72d6c7ff5b7960200199e$var$extend(settings || ({}), result.settings);
      }
    }
    function add(value) {
      if (typeof value === 'function') {
        addPlugin(value);
      } else if (typeof value === 'object') {
        if (('length' in value)) {
          addPlugin.apply(null, value);
        } else {
          addPreset(value);
        }
      } else {
        throw new Error('Expected usable value, not `' + value + '`');
      }
    }
    function addList(plugins) {
      var index = -1;
      if (plugins === null || plugins === undefined) {} else if (typeof plugins === 'object' && ('length' in plugins)) {
        while (++index < plugins.length) {
          add(plugins[index]);
        }
      } else {
        throw new Error('Expected a list of plugins, not `' + plugins + '`');
      }
    }
    function addPlugin(plugin, value) {
      var entry = find(plugin);
      if (entry) {
        if ($0e83540398b72d6c7ff5b7960200199e$var$plain(entry[1]) && $0e83540398b72d6c7ff5b7960200199e$var$plain(value)) {
          value = $0e83540398b72d6c7ff5b7960200199e$var$extend(true, entry[1], value);
        }
        entry[1] = value;
      } else {
        attachers.push($0e83540398b72d6c7ff5b7960200199e$var$slice.call(arguments));
      }
    }
  }
  function find(plugin) {
    var index = -1;
    while (++index < attachers.length) {
      if (attachers[index][0] === plugin) {
        return attachers[index];
      }
    }
  }
  // Parse a file (in string or vfile representation) into a unist node using
  // the `Parser` on the processor.
  function parse(doc) {
    var file = $0e83540398b72d6c7ff5b7960200199e$var$vfile(doc);
    var Parser;
    freeze();
    Parser = processor.Parser;
    $0e83540398b72d6c7ff5b7960200199e$var$assertParser('parse', Parser);
    if ($0e83540398b72d6c7ff5b7960200199e$var$newable(Parser, 'parse')) {
      return new Parser(String(file), file).parse();
    }
    return Parser(String(file), file);
  }
  // Run transforms on a unist node representation of a file (in string or
  // vfile representation), async.
  function run(node, file, cb) {
    $0e83540398b72d6c7ff5b7960200199e$var$assertNode(node);
    freeze();
    if (!cb && typeof file === 'function') {
      cb = file;
      file = null;
    }
    if (!cb) {
      return new Promise(executor);
    }
    executor(null, cb);
    function executor(resolve, reject) {
      transformers.run(node, $0e83540398b72d6c7ff5b7960200199e$var$vfile(file), done);
      function done(error, tree, file) {
        tree = tree || node;
        if (error) {
          reject(error);
        } else if (resolve) {
          resolve(tree);
        } else {
          cb(null, tree, file);
        }
      }
    }
  }
  // Run transforms on a unist node representation of a file (in string or
  // vfile representation), sync.
  function runSync(node, file) {
    var result;
    var complete;
    run(node, file, done);
    $0e83540398b72d6c7ff5b7960200199e$var$assertDone('runSync', 'run', complete);
    return result;
    function done(error, tree) {
      complete = true;
      result = tree;
      $0e83540398b72d6c7ff5b7960200199e$var$bail(error);
    }
  }
  // Stringify a unist node representation of a file (in string or vfile
  // representation) into a string using the `Compiler` on the processor.
  function stringify(node, doc) {
    var file = $0e83540398b72d6c7ff5b7960200199e$var$vfile(doc);
    var Compiler;
    freeze();
    Compiler = processor.Compiler;
    $0e83540398b72d6c7ff5b7960200199e$var$assertCompiler('stringify', Compiler);
    $0e83540398b72d6c7ff5b7960200199e$var$assertNode(node);
    if ($0e83540398b72d6c7ff5b7960200199e$var$newable(Compiler, 'compile')) {
      return new Compiler(node, file).compile();
    }
    return Compiler(node, file);
  }
  // Parse a file (in string or vfile representation) into a unist node using
  // the `Parser` on the processor, then run transforms on that node, and
  // compile the resulting node using the `Compiler` on the processor, and
  // store that result on the vfile.
  function process(doc, cb) {
    freeze();
    $0e83540398b72d6c7ff5b7960200199e$var$assertParser('process', processor.Parser);
    $0e83540398b72d6c7ff5b7960200199e$var$assertCompiler('process', processor.Compiler);
    if (!cb) {
      return new Promise(executor);
    }
    executor(null, cb);
    function executor(resolve, reject) {
      var file = $0e83540398b72d6c7ff5b7960200199e$var$vfile(doc);
      $0e83540398b72d6c7ff5b7960200199e$var$pipeline.run(processor, {
        file: file
      }, done);
      function done(error) {
        if (error) {
          reject(error);
        } else if (resolve) {
          resolve(file);
        } else {
          cb(null, file);
        }
      }
    }
  }
  // Process the given document (in string or vfile representation), sync.
  function processSync(doc) {
    var file;
    var complete;
    freeze();
    $0e83540398b72d6c7ff5b7960200199e$var$assertParser('processSync', processor.Parser);
    $0e83540398b72d6c7ff5b7960200199e$var$assertCompiler('processSync', processor.Compiler);
    file = $0e83540398b72d6c7ff5b7960200199e$var$vfile(doc);
    process(file, done);
    $0e83540398b72d6c7ff5b7960200199e$var$assertDone('processSync', 'process', complete);
    return file;
    function done(error) {
      complete = true;
      $0e83540398b72d6c7ff5b7960200199e$var$bail(error);
    }
  }
}
// Check if `value` is a constructor.
function $0e83540398b72d6c7ff5b7960200199e$var$newable(value, name) {
  return typeof value === 'function' && value.prototype && (// A function with keys in its prototype is probably a constructor.
  // Classes’ prototype methods are not enumerable, so we check if some value
  // exists in the prototype.
  $0e83540398b72d6c7ff5b7960200199e$var$keys(value.prototype) || (name in value.prototype));
}
// Check if `value` is an object with keys.
function $0e83540398b72d6c7ff5b7960200199e$var$keys(value) {
  var key;
  for (key in value) {
    return true;
  }
  return false;
}
// Assert a parser is available.
function $0e83540398b72d6c7ff5b7960200199e$var$assertParser(name, Parser) {
  if (typeof Parser !== 'function') {
    throw new Error('Cannot `' + name + '` without `Parser`');
  }
}
// Assert a compiler is available.
function $0e83540398b72d6c7ff5b7960200199e$var$assertCompiler(name, Compiler) {
  if (typeof Compiler !== 'function') {
    throw new Error('Cannot `' + name + '` without `Compiler`');
  }
}
// Assert the processor is not frozen.
function $0e83540398b72d6c7ff5b7960200199e$var$assertUnfrozen(name, frozen) {
  if (frozen) {
    throw new Error('Cannot invoke `' + name + '` on a frozen processor.\nCreate a new processor first, by invoking it: use `processor()` instead of `processor`.');
  }
}
// Assert `node` is a unist node.
function $0e83540398b72d6c7ff5b7960200199e$var$assertNode(node) {
  if (!node || typeof node.type !== 'string') {
    throw new Error('Expected node, got `' + node + '`');
  }
}
// Assert that `complete` is `true`.
function $0e83540398b72d6c7ff5b7960200199e$var$assertDone(name, asyncName, complete) {
  if (!complete) {
    throw new Error('`' + name + '` finished async. Use `' + asyncName + '` instead');
  }
}
var $0e83540398b72d6c7ff5b7960200199e$$interop$default = /*@__PURE__*/$parcel$interopDefault($0e83540398b72d6c7ff5b7960200199e$exports);
// ASSET: node_modules/remark-parse/index.js
var $78a0bd91eb53bef2323e6b0ada7545f7$exports = {};
$78a0bd91eb53bef2323e6b0ada7545f7$exports = $78a0bd91eb53bef2323e6b0ada7545f7$var$parse;
// ASSET: node_modules/mdast-util-from-markdown/index.js
var $e7e666dff6ee8cbe6aeaa3b6285d3fa9$exports = {};
// ASSET: node_modules/mdast-util-from-markdown/dist/index.js
var $dd5fd051794caf77c245ee698a159bd4$exports = {};
$dd5fd051794caf77c245ee698a159bd4$exports = $dd5fd051794caf77c245ee698a159bd4$var$fromMarkdown;
// ASSET: node_modules/mdast-util-to-string/index.js
var $3a73a0e8fbba6f2419d1df49438f0da8$exports = {};
$3a73a0e8fbba6f2419d1df49438f0da8$exports = $3a73a0e8fbba6f2419d1df49438f0da8$var$toString;
// Get the text content of a node.
// Prefer the node’s plain-text fields, otherwise serialize its children,
// and if the given value is an array, serialize the nodes in it.
function $3a73a0e8fbba6f2419d1df49438f0da8$var$toString(node) {
  return node && (node.value || node.alt || node.title || ('children' in node) && $3a73a0e8fbba6f2419d1df49438f0da8$var$all(node.children) || ('length' in node) && $3a73a0e8fbba6f2419d1df49438f0da8$var$all(node)) || '';
}
function $3a73a0e8fbba6f2419d1df49438f0da8$var$all(values) {
  var result = [];
  var index = -1;
  while (++index < values.length) {
    result[index] = $3a73a0e8fbba6f2419d1df49438f0da8$var$toString(values[index]);
  }
  return result.join('');
}
// These three are compiled away in the `dist/`
var $dd5fd051794caf77c245ee698a159bd4$var$toString = $3a73a0e8fbba6f2419d1df49438f0da8$exports;
// ASSET: node_modules/micromark/dist/constant/assign.js
var $2c15c0256904b2d61b47372cfe59f055$exports = {};
var $2c15c0256904b2d61b47372cfe59f055$var$assign = Object.assign;
$2c15c0256904b2d61b47372cfe59f055$exports = $2c15c0256904b2d61b47372cfe59f055$var$assign;
var $dd5fd051794caf77c245ee698a159bd4$var$assign = $2c15c0256904b2d61b47372cfe59f055$exports;
// ASSET: node_modules/micromark/dist/constant/has-own-property.js
var $1be1b063e9fa6a88634b3c76ad07318d$exports = {};
var $1be1b063e9fa6a88634b3c76ad07318d$var$own = ({}).hasOwnProperty;
$1be1b063e9fa6a88634b3c76ad07318d$exports = $1be1b063e9fa6a88634b3c76ad07318d$var$own;
// ASSET: node_modules/micromark/dist/util/normalize-identifier.js
var $ed7f6b5091aaca076e74b5e9acb0e3e0$exports = {};
function $ed7f6b5091aaca076e74b5e9acb0e3e0$var$normalizeIdentifier(value) {
  return value.// Collapse Markdown whitespace.
  replace(/[\t\n\r ]+/g, ' ').// Trim.
  replace(/^ | $/g, '').// Some characters are considered “uppercase”, but if their lowercase
  // counterpart is uppercased will result in a different uppercase
  // character.
  // Hence, to get that form, we perform both lower- and uppercase.
  // Upper case makes sure keys will not interact with default prototypal
  // methods: no object method is uppercase.
  toLowerCase().toUpperCase();
}
$ed7f6b5091aaca076e74b5e9acb0e3e0$exports = $ed7f6b5091aaca076e74b5e9acb0e3e0$var$normalizeIdentifier;
var $dd5fd051794caf77c245ee698a159bd4$var$normalizeIdentifier = $ed7f6b5091aaca076e74b5e9acb0e3e0$exports;
// ASSET: node_modules/micromark/dist/util/safe-from-int.js
var $e865eab91575c2440dac77dee9de1e67$exports = {};
// ASSET: node_modules/micromark/dist/constant/from-char-code.js
var $f8f98e619426b02ca259c6c84ae288cd$exports = {};
var $f8f98e619426b02ca259c6c84ae288cd$var$fromCharCode = String.fromCharCode;
$f8f98e619426b02ca259c6c84ae288cd$exports = $f8f98e619426b02ca259c6c84ae288cd$var$fromCharCode;
var $e865eab91575c2440dac77dee9de1e67$var$fromCharCode = $f8f98e619426b02ca259c6c84ae288cd$exports;
function $e865eab91575c2440dac77dee9de1e67$var$safeFromInt(value, base) {
  var code = parseInt(value, base);
  if (// C0 except for HT, LF, FF, CR, space
  code < 9 || code === 11 || code > 13 && code < 32 || // Control character (DEL) of the basic block and C1 controls.
  code > 126 && code < 160 || // Lone high surrogates and low surrogates.
  code > 55295 && code < 57344 || // Noncharacters.
  code > 64975 && code < 65008 || (code & 65535) === 65535 || (code & 65535) === 65534 || // Out of range
  code > 1114111) {
    return '\uFFFD';
  }
  return $e865eab91575c2440dac77dee9de1e67$var$fromCharCode(code);
}
$e865eab91575c2440dac77dee9de1e67$exports = $e865eab91575c2440dac77dee9de1e67$var$safeFromInt;
var $dd5fd051794caf77c245ee698a159bd4$var$safeFromInt = $e865eab91575c2440dac77dee9de1e67$exports;
// ASSET: node_modules/micromark/dist/parse.js
var $25aa31938ce75afaf8e06b8cadb964f3$exports = {};
// ASSET: node_modules/micromark/dist/initialize/content.js
var $4c6e12e42d5d5f2b606cb5121f9972d6$exports = {};
Object.defineProperty($4c6e12e42d5d5f2b606cb5121f9972d6$exports, '__esModule', {
  value: true
});
// ASSET: node_modules/micromark/dist/character/markdown-line-ending.js
var $16cd0200e709bd24480331e751413c02$exports = {};
function $16cd0200e709bd24480331e751413c02$var$markdownLineEnding(code) {
  return code < -2;
}
$16cd0200e709bd24480331e751413c02$exports = $16cd0200e709bd24480331e751413c02$var$markdownLineEnding;
var $4c6e12e42d5d5f2b606cb5121f9972d6$var$markdownLineEnding = $16cd0200e709bd24480331e751413c02$exports;
// ASSET: node_modules/micromark/dist/tokenize/factory-space.js
var $c9c5e694972b79db7836f58f99718475$exports = {};
// ASSET: node_modules/micromark/dist/character/markdown-space.js
var $4087d4a7eda9d3422d8ed53862be000e$exports = {};
function $4087d4a7eda9d3422d8ed53862be000e$var$markdownSpace(code) {
  return code === -2 || code === -1 || code === 32;
}
$4087d4a7eda9d3422d8ed53862be000e$exports = $4087d4a7eda9d3422d8ed53862be000e$var$markdownSpace;
var $c9c5e694972b79db7836f58f99718475$var$markdownSpace = $4087d4a7eda9d3422d8ed53862be000e$exports;
function $c9c5e694972b79db7836f58f99718475$var$spaceFactory(effects, ok, type, max) {
  var limit = max ? max - 1 : Infinity;
  var size = 0;
  return start;
  function start(code) {
    if ($c9c5e694972b79db7836f58f99718475$var$markdownSpace(code)) {
      effects.enter(type);
      return prefix(code);
    }
    return ok(code);
  }
  function prefix(code) {
    if ($c9c5e694972b79db7836f58f99718475$var$markdownSpace(code) && size++ < limit) {
      effects.consume(code);
      return prefix;
    }
    effects.exit(type);
    return ok(code);
  }
}
$c9c5e694972b79db7836f58f99718475$exports = $c9c5e694972b79db7836f58f99718475$var$spaceFactory;
var $4c6e12e42d5d5f2b606cb5121f9972d6$var$factorySpace = $c9c5e694972b79db7836f58f99718475$exports;
var $4c6e12e42d5d5f2b606cb5121f9972d6$var$tokenize = $4c6e12e42d5d5f2b606cb5121f9972d6$var$initializeContent;
function $4c6e12e42d5d5f2b606cb5121f9972d6$var$initializeContent(effects) {
  var contentStart = effects.attempt(this.parser.constructs.contentInitial, afterContentStartConstruct, paragraphInitial);
  var previous;
  return contentStart;
  function afterContentStartConstruct(code) {
    if (code === null) {
      effects.consume(code);
      return;
    }
    effects.enter('lineEnding');
    effects.consume(code);
    effects.exit('lineEnding');
    return $4c6e12e42d5d5f2b606cb5121f9972d6$var$factorySpace(effects, contentStart, 'linePrefix');
  }
  function paragraphInitial(code) {
    effects.enter('paragraph');
    return lineStart(code);
  }
  function lineStart(code) {
    var token = effects.enter('chunkText', {
      contentType: 'text',
      previous: previous
    });
    if (previous) {
      previous.next = token;
    }
    previous = token;
    return data(code);
  }
  function data(code) {
    if (code === null) {
      effects.exit('chunkText');
      effects.exit('paragraph');
      effects.consume(code);
      return;
    }
    if ($4c6e12e42d5d5f2b606cb5121f9972d6$var$markdownLineEnding(code)) {
      effects.consume(code);
      effects.exit('chunkText');
      return lineStart;
    }
    // Data.
    effects.consume(code);
    return data;
  }
}
var $4c6e12e42d5d5f2b606cb5121f9972d6$export$tokenize = $4c6e12e42d5d5f2b606cb5121f9972d6$var$tokenize;
$4c6e12e42d5d5f2b606cb5121f9972d6$exports.tokenize = $4c6e12e42d5d5f2b606cb5121f9972d6$export$tokenize;
var $25aa31938ce75afaf8e06b8cadb964f3$var$content = $4c6e12e42d5d5f2b606cb5121f9972d6$exports;
// ASSET: node_modules/micromark/dist/initialize/document.js
var $bb7497a7becdf8790a4447cb417b0011$exports = {};
Object.defineProperty($bb7497a7becdf8790a4447cb417b0011$exports, '__esModule', {
  value: true
});
var $bb7497a7becdf8790a4447cb417b0011$var$markdownLineEnding = $16cd0200e709bd24480331e751413c02$exports;
var $bb7497a7becdf8790a4447cb417b0011$var$factorySpace = $c9c5e694972b79db7836f58f99718475$exports;
// ASSET: node_modules/micromark/dist/tokenize/partial-blank-line.js
var $ebf3f90d1535e837678aaa6daf0871a4$exports = {};
var $ebf3f90d1535e837678aaa6daf0871a4$var$markdownLineEnding = $16cd0200e709bd24480331e751413c02$exports;
var $ebf3f90d1535e837678aaa6daf0871a4$var$factorySpace = $c9c5e694972b79db7836f58f99718475$exports;
var $ebf3f90d1535e837678aaa6daf0871a4$var$partialBlankLine = {
  tokenize: $ebf3f90d1535e837678aaa6daf0871a4$var$tokenizePartialBlankLine,
  partial: true
};
function $ebf3f90d1535e837678aaa6daf0871a4$var$tokenizePartialBlankLine(effects, ok, nok) {
  return $ebf3f90d1535e837678aaa6daf0871a4$var$factorySpace(effects, afterWhitespace, 'linePrefix');
  function afterWhitespace(code) {
    return code === null || $ebf3f90d1535e837678aaa6daf0871a4$var$markdownLineEnding(code) ? ok(code) : nok(code);
  }
}
$ebf3f90d1535e837678aaa6daf0871a4$exports = $ebf3f90d1535e837678aaa6daf0871a4$var$partialBlankLine;
var $bb7497a7becdf8790a4447cb417b0011$var$partialBlankLine = $ebf3f90d1535e837678aaa6daf0871a4$exports;
var $bb7497a7becdf8790a4447cb417b0011$var$tokenize = $bb7497a7becdf8790a4447cb417b0011$var$initializeDocument;
var $bb7497a7becdf8790a4447cb417b0011$var$containerConstruct = {
  tokenize: $bb7497a7becdf8790a4447cb417b0011$var$tokenizeContainer
};
var $bb7497a7becdf8790a4447cb417b0011$var$lazyFlowConstruct = {
  tokenize: $bb7497a7becdf8790a4447cb417b0011$var$tokenizeLazyFlow
};
function $bb7497a7becdf8790a4447cb417b0011$var$initializeDocument(effects) {
  var self = this;
  var stack = [];
  var continued = 0;
  var inspectConstruct = {
    tokenize: tokenizeInspect,
    partial: true
  };
  var inspectResult;
  var childFlow;
  var childToken;
  return start;
  function start(code) {
    if (continued < stack.length) {
      self.containerState = stack[continued][1];
      return effects.attempt(stack[continued][0].continuation, documentContinue, documentContinued)(code);
    }
    return documentContinued(code);
  }
  function documentContinue(code) {
    continued++;
    return start(code);
  }
  function documentContinued(code) {
    // If we’re in a concrete construct (such as when expecting another line of
    // HTML, or we resulted in lazy content), we can immediately start flow.
    if (inspectResult && inspectResult.flowContinue) {
      return flowStart(code);
    }
    self.interrupt = childFlow && childFlow.currentConstruct && childFlow.currentConstruct.interruptible;
    self.containerState = {};
    return effects.attempt($bb7497a7becdf8790a4447cb417b0011$var$containerConstruct, containerContinue, flowStart)(code);
  }
  function containerContinue(code) {
    stack.push([self.currentConstruct, self.containerState]);
    self.containerState = undefined;
    return documentContinued(code);
  }
  function flowStart(code) {
    if (code === null) {
      exitContainers(0, true);
      effects.consume(code);
      return;
    }
    childFlow = childFlow || self.parser.flow(self.now());
    effects.enter('chunkFlow', {
      contentType: 'flow',
      previous: childToken,
      _tokenizer: childFlow
    });
    return flowContinue(code);
  }
  function flowContinue(code) {
    if (code === null) {
      continueFlow(effects.exit('chunkFlow'));
      return flowStart(code);
    }
    if ($bb7497a7becdf8790a4447cb417b0011$var$markdownLineEnding(code)) {
      effects.consume(code);
      continueFlow(effects.exit('chunkFlow'));
      return effects.check(inspectConstruct, documentAfterPeek);
    }
    effects.consume(code);
    return flowContinue;
  }
  function documentAfterPeek(code) {
    exitContainers(inspectResult.continued, inspectResult && inspectResult.flowEnd);
    continued = 0;
    return start(code);
  }
  function continueFlow(token) {
    if (childToken) childToken.next = token;
    childToken = token;
    childFlow.lazy = inspectResult && inspectResult.lazy;
    childFlow.defineSkip(token.start);
    childFlow.write(self.sliceStream(token));
  }
  function exitContainers(size, end) {
    var index = stack.length;
    // Close the flow.
    if (childFlow && end) {
      childFlow.write([null]);
      childToken = childFlow = undefined;
    }
    // Exit open containers.
    while (index-- > size) {
      self.containerState = stack[index][1];
      stack[index][0].exit.call(self, effects);
    }
    stack.length = size;
  }
  function tokenizeInspect(effects, ok) {
    var subcontinued = 0;
    inspectResult = {};
    return inspectStart;
    function inspectStart(code) {
      if (subcontinued < stack.length) {
        self.containerState = stack[subcontinued][1];
        return effects.attempt(stack[subcontinued][0].continuation, inspectContinue, inspectLess)(code);
      }
      // If we’re continued but in a concrete flow, we can’t have more
      // containers.
      if (childFlow.currentConstruct && childFlow.currentConstruct.concrete) {
        inspectResult.flowContinue = true;
        return inspectDone(code);
      }
      self.interrupt = childFlow.currentConstruct && childFlow.currentConstruct.interruptible;
      self.containerState = {};
      return effects.attempt($bb7497a7becdf8790a4447cb417b0011$var$containerConstruct, inspectFlowEnd, inspectDone)(code);
    }
    function inspectContinue(code) {
      subcontinued++;
      return self.containerState._closeFlow ? inspectFlowEnd(code) : inspectStart(code);
    }
    function inspectLess(code) {
      if (childFlow.currentConstruct && childFlow.currentConstruct.lazy) {
        // Maybe another container?
        self.containerState = {};
        return effects.attempt($bb7497a7becdf8790a4447cb417b0011$var$containerConstruct, inspectFlowEnd, // Maybe flow, or a blank line?
        effects.attempt($bb7497a7becdf8790a4447cb417b0011$var$lazyFlowConstruct, inspectFlowEnd, effects.check($bb7497a7becdf8790a4447cb417b0011$var$partialBlankLine, inspectFlowEnd, inspectLazy)))(code);
      }
      // Otherwise we’re interrupting.
      return inspectFlowEnd(code);
    }
    function inspectLazy(code) {
      // Act as if all containers are continued.
      subcontinued = stack.length;
      inspectResult.lazy = true;
      inspectResult.flowContinue = true;
      return inspectDone(code);
    }
    // We’re done with flow if we have more containers, or an interruption.
    function inspectFlowEnd(code) {
      inspectResult.flowEnd = true;
      return inspectDone(code);
    }
    function inspectDone(code) {
      inspectResult.continued = subcontinued;
      self.interrupt = self.containerState = undefined;
      return ok(code);
    }
  }
}
function $bb7497a7becdf8790a4447cb417b0011$var$tokenizeContainer(effects, ok, nok) {
  return $bb7497a7becdf8790a4447cb417b0011$var$factorySpace(effects, effects.attempt(this.parser.constructs.document, ok, nok), 'linePrefix', this.parser.constructs.disable.null.indexOf('codeIndented') > -1 ? undefined : 4);
}
function $bb7497a7becdf8790a4447cb417b0011$var$tokenizeLazyFlow(effects, ok, nok) {
  return $bb7497a7becdf8790a4447cb417b0011$var$factorySpace(effects, effects.lazy(this.parser.constructs.flow, ok, nok), 'linePrefix', this.parser.constructs.disable.null.indexOf('codeIndented') > -1 ? undefined : 4);
}
var $bb7497a7becdf8790a4447cb417b0011$export$tokenize = $bb7497a7becdf8790a4447cb417b0011$var$tokenize;
$bb7497a7becdf8790a4447cb417b0011$exports.tokenize = $bb7497a7becdf8790a4447cb417b0011$export$tokenize;
var $25aa31938ce75afaf8e06b8cadb964f3$var$document = $bb7497a7becdf8790a4447cb417b0011$exports;
// ASSET: node_modules/micromark/dist/initialize/flow.js
var $0be9095eb20b40af4a9d785d8e19007f$exports = {};
Object.defineProperty($0be9095eb20b40af4a9d785d8e19007f$exports, '__esModule', {
  value: true
});
// ASSET: node_modules/micromark/dist/tokenize/content.js
var $b5e4b3aaeb62c1d9e56f8db3843cc3dc$exports = {};
var $b5e4b3aaeb62c1d9e56f8db3843cc3dc$var$markdownLineEnding = $16cd0200e709bd24480331e751413c02$exports;
// ASSET: node_modules/micromark/dist/util/prefix-size.js
var $d154556f03fbe11e6c8c9db4f5c0c203$exports = {};
// ASSET: node_modules/micromark/dist/util/size-chunks.js
var $149bcbbd820ecb308ec8f9dcd0ce0f78$exports = {};
// Counts tabs based on their expanded size, and CR+LF as one character.
function $149bcbbd820ecb308ec8f9dcd0ce0f78$var$sizeChunks(chunks) {
  var index = -1;
  var size = 0;
  while (++index < chunks.length) {
    size += typeof chunks[index] === 'string' ? chunks[index].length : 1;
  }
  return size;
}
$149bcbbd820ecb308ec8f9dcd0ce0f78$exports = $149bcbbd820ecb308ec8f9dcd0ce0f78$var$sizeChunks;
var $d154556f03fbe11e6c8c9db4f5c0c203$var$sizeChunks = $149bcbbd820ecb308ec8f9dcd0ce0f78$exports;
function $d154556f03fbe11e6c8c9db4f5c0c203$var$prefixSize(events, type) {
  var tail = events[events.length - 1];
  if (!tail || tail[1].type !== type) return 0;
  return $d154556f03fbe11e6c8c9db4f5c0c203$var$sizeChunks(tail[2].sliceStream(tail[1]));
}
$d154556f03fbe11e6c8c9db4f5c0c203$exports = $d154556f03fbe11e6c8c9db4f5c0c203$var$prefixSize;
var $b5e4b3aaeb62c1d9e56f8db3843cc3dc$var$prefixSize = $d154556f03fbe11e6c8c9db4f5c0c203$exports;
// ASSET: node_modules/micromark/dist/util/subtokenize.js
var $b65e7f1128cba8c762c0f54ddb541a5a$exports = {};
var $b65e7f1128cba8c762c0f54ddb541a5a$var$assign = $2c15c0256904b2d61b47372cfe59f055$exports;
// ASSET: node_modules/micromark/dist/util/chunked-splice.js
var $fe4e196242a629dfc7f8aaa44ed4e7a0$exports = {};
// ASSET: node_modules/micromark/dist/constant/splice.js
var $2adff465c97433e80740fa7ad2d66d93$exports = {};
var $2adff465c97433e80740fa7ad2d66d93$var$splice = [].splice;
$2adff465c97433e80740fa7ad2d66d93$exports = $2adff465c97433e80740fa7ad2d66d93$var$splice;
// causes a stack overflow in V8 when trying to insert 100k items for instance.
function $fe4e196242a629dfc7f8aaa44ed4e7a0$var$chunkedSplice(list, start, remove, items) {
  var end = list.length;
  var chunkStart = 0;
  var parameters;
  // Make start between zero and `end` (included).
  if (start < 0) {
    start = -start > end ? 0 : end + start;
  } else {
    start = start > end ? end : start;
  }
  remove = remove > 0 ? remove : 0;
  // No need to chunk the items if there’s only a couple (10k) items.
  if (items.length < 10000) {
    parameters = Array.from(items);
    parameters.unshift(start, remove);
    $2adff465c97433e80740fa7ad2d66d93$exports.apply(list, parameters);
  } else {
    // Delete `remove` items starting from `start`
    if (remove) $2adff465c97433e80740fa7ad2d66d93$exports.apply(list, [start, remove]);
    // Insert the items in chunks to not cause stack overflows.
    while (chunkStart < items.length) {
      parameters = items.slice(chunkStart, chunkStart + 10000);
      parameters.unshift(start, 0);
      $2adff465c97433e80740fa7ad2d66d93$exports.apply(list, parameters);
      chunkStart += 10000;
      start += 10000;
    }
  }
}
$fe4e196242a629dfc7f8aaa44ed4e7a0$exports = $fe4e196242a629dfc7f8aaa44ed4e7a0$var$chunkedSplice;
var $b65e7f1128cba8c762c0f54ddb541a5a$var$chunkedSplice = $fe4e196242a629dfc7f8aaa44ed4e7a0$exports;
// ASSET: node_modules/micromark/dist/util/shallow.js
var $541289fbe4aa92ce2fc0b3f29311bcb8$exports = {};
var $541289fbe4aa92ce2fc0b3f29311bcb8$var$assign = $2c15c0256904b2d61b47372cfe59f055$exports;
function $541289fbe4aa92ce2fc0b3f29311bcb8$var$shallow(object) {
  return $541289fbe4aa92ce2fc0b3f29311bcb8$var$assign({}, object);
}
$541289fbe4aa92ce2fc0b3f29311bcb8$exports = $541289fbe4aa92ce2fc0b3f29311bcb8$var$shallow;
var $b65e7f1128cba8c762c0f54ddb541a5a$var$shallow = $541289fbe4aa92ce2fc0b3f29311bcb8$exports;
function $b65e7f1128cba8c762c0f54ddb541a5a$var$subtokenize(events) {
  var jumps = {};
  var index = -1;
  var event;
  var lineIndex;
  var otherIndex;
  var otherEvent;
  var parameters;
  var subevents;
  var more;
  while (++index < events.length) {
    while ((index in jumps)) {
      index = jumps[index];
    }
    event = events[index];
    // Add a hook for the GFM tasklist extension, which needs to know if text
    // is in the first content of a list item.
    if (index && event[1].type === 'chunkFlow' && events[index - 1][1].type === 'listItemPrefix') {
      subevents = event[1]._tokenizer.events;
      otherIndex = 0;
      if (otherIndex < subevents.length && subevents[otherIndex][1].type === 'lineEndingBlank') {
        otherIndex += 2;
      }
      if (otherIndex < subevents.length && subevents[otherIndex][1].type === 'content') {
        while (++otherIndex < subevents.length) {
          if (subevents[otherIndex][1].type === 'content') {
            break;
          }
          if (subevents[otherIndex][1].type === 'chunkText') {
            subevents[otherIndex][1].isInFirstContentOfListItem = true;
            otherIndex++;
          }
        }
      }
    }
    // Enter.
    if (event[0] === 'enter') {
      if (event[1].contentType) {
        $b65e7f1128cba8c762c0f54ddb541a5a$var$assign(jumps, $b65e7f1128cba8c762c0f54ddb541a5a$var$subcontent(events, index));
        index = jumps[index];
        more = true;
      }
            // Exit.
} else // Exit.
    if (event[1]._container || event[1]._movePreviousLineEndings) {
      otherIndex = index;
      lineIndex = undefined;
      while (otherIndex--) {
        otherEvent = events[otherIndex];
        if (otherEvent[1].type === 'lineEnding' || otherEvent[1].type === 'lineEndingBlank') {
          if (otherEvent[0] === 'enter') {
            if (lineIndex) {
              events[lineIndex][1].type = 'lineEndingBlank';
            }
            otherEvent[1].type = 'lineEnding';
            lineIndex = otherIndex;
          }
        } else {
          break;
        }
      }
      if (lineIndex) {
        // Fix position.
        event[1].end = $b65e7f1128cba8c762c0f54ddb541a5a$var$shallow(events[lineIndex][1].start);
        // Switch container exit w/ line endings.
        parameters = events.slice(lineIndex, index);
        parameters.unshift(event);
        $b65e7f1128cba8c762c0f54ddb541a5a$var$chunkedSplice(events, lineIndex, index - lineIndex + 1, parameters);
      }
    }
  }
  return !more;
}
function $b65e7f1128cba8c762c0f54ddb541a5a$var$subcontent(events, eventIndex) {
  var token = events[eventIndex][1];
  var context = events[eventIndex][2];
  var startPosition = eventIndex - 1;
  var startPositions = [];
  var tokenizer = token._tokenizer || context.parser[token.contentType](token.start);
  var childEvents = tokenizer.events;
  var jumps = [];
  var gaps = {};
  var stream;
  var previous;
  var index;
  var entered;
  var end;
  var adjust;
  // Loop forward through the linked tokens to pass them in order to the
  // subtokenizer.
  while (token) {
    // Find the position of the event for this token.
    while (events[++startPosition][1] !== token) {}
    startPositions.push(startPosition);
    if (!token._tokenizer) {
      stream = context.sliceStream(token);
      if (!token.next) {
        stream.push(null);
      }
      if (previous) {
        tokenizer.defineSkip(token.start);
      }
      if (token.isInFirstContentOfListItem) {
        tokenizer._gfmTasklistFirstContentOfListItem = true;
      }
      tokenizer.write(stream);
      if (token.isInFirstContentOfListItem) {
        tokenizer._gfmTasklistFirstContentOfListItem = undefined;
      }
    }
    // Unravel the next token.
    previous = token;
    token = token.next;
  }
  // Now, loop back through all events (and linked tokens), to figure out which
  // parts belong where.
  token = previous;
  index = childEvents.length;
  while (index--) {
    // Make sure we’ve at least seen something (final eol is part of the last
    // token).
    if (childEvents[index][0] === 'enter') {
      entered = true;
    } else if (// Find a void token that includes a break.
    entered && childEvents[index][1].type === childEvents[index - 1][1].type && childEvents[index][1].start.line !== childEvents[index][1].end.line) {
      add(childEvents.slice(index + 1, end));
      // Help GC.
      token._tokenizer = token.next = undefined;
      token = token.previous;
      end = index + 1;
    }
  }
  // Help GC.
  tokenizer.events = token._tokenizer = token.next = undefined;
  // Do head:
  add(childEvents.slice(0, end));
  index = -1;
  adjust = 0;
  while (++index < jumps.length) {
    gaps[adjust + jumps[index][0]] = adjust + jumps[index][1];
    adjust += jumps[index][1] - jumps[index][0] - 1;
  }
  return gaps;
  function add(slice) {
    var start = startPositions.pop();
    jumps.unshift([start, start + slice.length - 1]);
    $b65e7f1128cba8c762c0f54ddb541a5a$var$chunkedSplice(events, start, 2, slice);
  }
}
$b65e7f1128cba8c762c0f54ddb541a5a$exports = $b65e7f1128cba8c762c0f54ddb541a5a$var$subtokenize;
var $b5e4b3aaeb62c1d9e56f8db3843cc3dc$var$subtokenize = $b65e7f1128cba8c762c0f54ddb541a5a$exports;
var $b5e4b3aaeb62c1d9e56f8db3843cc3dc$var$factorySpace = $c9c5e694972b79db7836f58f99718475$exports;
// No name because it must not be turned off.
var $b5e4b3aaeb62c1d9e56f8db3843cc3dc$var$content = {
  tokenize: $b5e4b3aaeb62c1d9e56f8db3843cc3dc$var$tokenizeContent,
  resolve: $b5e4b3aaeb62c1d9e56f8db3843cc3dc$var$resolveContent,
  interruptible: true,
  lazy: true
};
var $b5e4b3aaeb62c1d9e56f8db3843cc3dc$var$continuationConstruct = {
  tokenize: $b5e4b3aaeb62c1d9e56f8db3843cc3dc$var$tokenizeContinuation,
  partial: true
};
// Content is transparent: it’s parsed right now. That way, definitions are also
// parsed right now: before text in paragraphs (specifically, media) are parsed.
function $b5e4b3aaeb62c1d9e56f8db3843cc3dc$var$resolveContent(events) {
  $b5e4b3aaeb62c1d9e56f8db3843cc3dc$var$subtokenize(events);
  return events;
}
function $b5e4b3aaeb62c1d9e56f8db3843cc3dc$var$tokenizeContent(effects, ok) {
  var previous;
  return start;
  function start(code) {
    effects.enter('content');
    previous = effects.enter('chunkContent', {
      contentType: 'content'
    });
    return data(code);
  }
  function data(code) {
    if (code === null) {
      return contentEnd(code);
    }
    if ($b5e4b3aaeb62c1d9e56f8db3843cc3dc$var$markdownLineEnding(code)) {
      return effects.check($b5e4b3aaeb62c1d9e56f8db3843cc3dc$var$continuationConstruct, contentContinue, contentEnd)(code);
    }
    // Data.
    effects.consume(code);
    return data;
  }
  function contentEnd(code) {
    effects.exit('chunkContent');
    effects.exit('content');
    return ok(code);
  }
  function contentContinue(code) {
    effects.consume(code);
    effects.exit('chunkContent');
    previous = previous.next = effects.enter('chunkContent', {
      contentType: 'content',
      previous: previous
    });
    return data;
  }
}
function $b5e4b3aaeb62c1d9e56f8db3843cc3dc$var$tokenizeContinuation(effects, ok, nok) {
  var self = this;
  return startLookahead;
  function startLookahead(code) {
    effects.enter('lineEnding');
    effects.consume(code);
    effects.exit('lineEnding');
    return $b5e4b3aaeb62c1d9e56f8db3843cc3dc$var$factorySpace(effects, prefixed, 'linePrefix');
  }
  function prefixed(code) {
    if (code === null || $b5e4b3aaeb62c1d9e56f8db3843cc3dc$var$markdownLineEnding(code)) {
      return nok(code);
    }
    if (self.parser.constructs.disable.null.indexOf('codeIndented') > -1 || $b5e4b3aaeb62c1d9e56f8db3843cc3dc$var$prefixSize(self.events, 'linePrefix') < 4) {
      return effects.interrupt(self.parser.constructs.flow, nok, ok)(code);
    }
    return ok(code);
  }
}
$b5e4b3aaeb62c1d9e56f8db3843cc3dc$exports = $b5e4b3aaeb62c1d9e56f8db3843cc3dc$var$content;
var $0be9095eb20b40af4a9d785d8e19007f$var$content = $b5e4b3aaeb62c1d9e56f8db3843cc3dc$exports;
var $0be9095eb20b40af4a9d785d8e19007f$var$factorySpace = $c9c5e694972b79db7836f58f99718475$exports;
var $0be9095eb20b40af4a9d785d8e19007f$var$partialBlankLine = $ebf3f90d1535e837678aaa6daf0871a4$exports;
var $0be9095eb20b40af4a9d785d8e19007f$var$tokenize = $0be9095eb20b40af4a9d785d8e19007f$var$initializeFlow;
function $0be9095eb20b40af4a9d785d8e19007f$var$initializeFlow(effects) {
  var self = this;
  var initial = effects.attempt(// Try to parse a blank line.
  $0be9095eb20b40af4a9d785d8e19007f$var$partialBlankLine, atBlankEnding, // Try to parse initial flow (essentially, only code).
  effects.attempt(this.parser.constructs.flowInitial, afterConstruct, $0be9095eb20b40af4a9d785d8e19007f$var$factorySpace(effects, effects.attempt(this.parser.constructs.flow, afterConstruct, effects.attempt($0be9095eb20b40af4a9d785d8e19007f$var$content, afterConstruct)), 'linePrefix')));
  return initial;
  function atBlankEnding(code) {
    if (code === null) {
      effects.consume(code);
      return;
    }
    effects.enter('lineEndingBlank');
    effects.consume(code);
    effects.exit('lineEndingBlank');
    self.currentConstruct = undefined;
    return initial;
  }
  function afterConstruct(code) {
    if (code === null) {
      effects.consume(code);
      return;
    }
    effects.enter('lineEnding');
    effects.consume(code);
    effects.exit('lineEnding');
    self.currentConstruct = undefined;
    return initial;
  }
}
var $0be9095eb20b40af4a9d785d8e19007f$export$tokenize = $0be9095eb20b40af4a9d785d8e19007f$var$tokenize;
$0be9095eb20b40af4a9d785d8e19007f$exports.tokenize = $0be9095eb20b40af4a9d785d8e19007f$export$tokenize;
var $25aa31938ce75afaf8e06b8cadb964f3$var$flow = $0be9095eb20b40af4a9d785d8e19007f$exports;
// ASSET: node_modules/micromark/dist/initialize/text.js
var $4e25440774421029314bb5d592237bdb$exports = {};
Object.defineProperty($4e25440774421029314bb5d592237bdb$exports, '__esModule', {
  value: true
});
var $4e25440774421029314bb5d592237bdb$var$assign = $2c15c0256904b2d61b47372cfe59f055$exports;
var $4e25440774421029314bb5d592237bdb$var$shallow = $541289fbe4aa92ce2fc0b3f29311bcb8$exports;
var $4e25440774421029314bb5d592237bdb$var$text = $4e25440774421029314bb5d592237bdb$var$initializeFactory('text');
var $4e25440774421029314bb5d592237bdb$var$string = $4e25440774421029314bb5d592237bdb$var$initializeFactory('string');
var $4e25440774421029314bb5d592237bdb$var$resolver = {
  resolveAll: $4e25440774421029314bb5d592237bdb$var$createResolver()
};
function $4e25440774421029314bb5d592237bdb$var$initializeFactory(field) {
  return {
    tokenize: initializeText,
    resolveAll: $4e25440774421029314bb5d592237bdb$var$createResolver(field === 'text' ? $4e25440774421029314bb5d592237bdb$var$resolveAllLineSuffixes : undefined)
  };
  function initializeText(effects) {
    var self = this;
    var constructs = this.parser.constructs[field];
    var text = effects.attempt(constructs, start, notText);
    return start;
    function start(code) {
      return atBreak(code) ? text(code) : notText(code);
    }
    function notText(code) {
      if (code === null) {
        effects.consume(code);
        return;
      }
      effects.enter('data');
      effects.consume(code);
      return data;
    }
    function data(code) {
      if (atBreak(code)) {
        effects.exit('data');
        return text(code);
      }
      // Data.
      effects.consume(code);
      return data;
    }
    function atBreak(code) {
      var list = constructs[code];
      var index = -1;
      if (code === null) {
        return true;
      }
      if (list) {
        while (++index < list.length) {
          if (!list[index].previous || list[index].previous.call(self, self.previous)) {
            return true;
          }
        }
      }
    }
  }
}
function $4e25440774421029314bb5d592237bdb$var$createResolver(extraResolver) {
  return resolveAllText;
  function resolveAllText(events, context) {
    var index = -1;
    var enter;
    // A rather boring computation (to merge adjacent `data` events) which
    // improves mm performance by 29%.
    while (++index <= events.length) {
      if (enter === undefined) {
        if (events[index] && events[index][1].type === 'data') {
          enter = index;
          index++;
        }
      } else if (!events[index] || events[index][1].type !== 'data') {
        // Don’t do anything if there is one data token.
        if (index !== enter + 2) {
          events[enter][1].end = events[index - 1][1].end;
          events.splice(enter + 2, index - enter - 2);
          index = enter + 2;
        }
        enter = undefined;
      }
    }
    return extraResolver ? extraResolver(events, context) : events;
  }
}
// A rather ugly set of instructions which again looks at chunks in the input
// stream.
// The reason to do this here is that it is *much* faster to parse in reverse.
// And that we can’t hook into `null` to split the line suffix before an EOF.
// To do: figure out if we can make this into a clean utility, or even in core.
// As it will be useful for GFMs literal autolink extension (and maybe even
// tables?)
function $4e25440774421029314bb5d592237bdb$var$resolveAllLineSuffixes(events, context) {
  var eventIndex = -1;
  var chunks;
  var data;
  var chunk;
  var index;
  var bufferIndex;
  var size;
  var tabs;
  var token;
  while (++eventIndex <= events.length) {
    if ((eventIndex === events.length || events[eventIndex][1].type === 'lineEnding') && events[eventIndex - 1][1].type === 'data') {
      data = events[eventIndex - 1][1];
      chunks = context.sliceStream(data);
      index = chunks.length;
      bufferIndex = -1;
      size = 0;
      tabs = undefined;
      while (index--) {
        chunk = chunks[index];
        if (typeof chunk === 'string') {
          bufferIndex = chunk.length;
          while (chunk.charCodeAt(bufferIndex - 1) === 32) {
            size++;
            bufferIndex--;
          }
          if (bufferIndex) break;
          bufferIndex = -1;
                    // Number
} else // Number
        if (chunk === -2) {
          tabs = true;
          size++;
        } else if (chunk === -1) ; else {
          // Replacement character, exit.
          index++;
          break;
        }
      }
      if (size) {
        token = {
          type: eventIndex === events.length || tabs || size < 2 ? 'lineSuffix' : 'hardBreakTrailing',
          start: {
            line: data.end.line,
            column: data.end.column - size,
            offset: data.end.offset - size,
            _index: data.start._index + index,
            _bufferIndex: index ? bufferIndex : data.start._bufferIndex + bufferIndex
          },
          end: $4e25440774421029314bb5d592237bdb$var$shallow(data.end)
        };
        data.end = $4e25440774421029314bb5d592237bdb$var$shallow(token.start);
        if (data.start.offset === data.end.offset) {
          $4e25440774421029314bb5d592237bdb$var$assign(data, token);
        } else {
          events.splice(eventIndex, 0, ['enter', token, context], ['exit', token, context]);
          eventIndex += 2;
        }
      }
      eventIndex++;
    }
  }
  return events;
}
var $4e25440774421029314bb5d592237bdb$export$resolver = $4e25440774421029314bb5d592237bdb$var$resolver;
$4e25440774421029314bb5d592237bdb$exports.resolver = $4e25440774421029314bb5d592237bdb$export$resolver;
var $4e25440774421029314bb5d592237bdb$export$string = $4e25440774421029314bb5d592237bdb$var$string;
$4e25440774421029314bb5d592237bdb$exports.string = $4e25440774421029314bb5d592237bdb$export$string;
var $4e25440774421029314bb5d592237bdb$export$text = $4e25440774421029314bb5d592237bdb$var$text;
$4e25440774421029314bb5d592237bdb$exports.text = $4e25440774421029314bb5d592237bdb$export$text;
// ASSET: node_modules/micromark/dist/util/combine-extensions.js
var $5dab7f9aa14cddc5722cfa68368cfa9b$exports = {};
var $5dab7f9aa14cddc5722cfa68368cfa9b$var$chunkedSplice = $fe4e196242a629dfc7f8aaa44ed4e7a0$exports;
// ASSET: node_modules/micromark/dist/util/miniflat.js
var $57b9e502ba2b9afa5bb25d026939d0f7$exports = {};
function $57b9e502ba2b9afa5bb25d026939d0f7$var$miniflat(value) {
  return value === null || value === undefined ? [] : ('length' in value) ? value : [value];
}
$57b9e502ba2b9afa5bb25d026939d0f7$exports = $57b9e502ba2b9afa5bb25d026939d0f7$var$miniflat;
var $5dab7f9aa14cddc5722cfa68368cfa9b$var$miniflat = $57b9e502ba2b9afa5bb25d026939d0f7$exports;
function $5dab7f9aa14cddc5722cfa68368cfa9b$var$combineExtensions(extensions) {
  var all = {};
  var index = -1;
  while (++index < extensions.length) {
    $5dab7f9aa14cddc5722cfa68368cfa9b$var$extension(all, extensions[index]);
  }
  return all;
}
function $5dab7f9aa14cddc5722cfa68368cfa9b$var$extension(all, extension) {
  var hook;
  var left;
  var right;
  var code;
  for (hook in extension) {
    left = $1be1b063e9fa6a88634b3c76ad07318d$exports.call(all, hook) ? all[hook] : all[hook] = {};
    right = extension[hook];
    for (code in right) {
      left[code] = $5dab7f9aa14cddc5722cfa68368cfa9b$var$constructs($5dab7f9aa14cddc5722cfa68368cfa9b$var$miniflat(right[code]), $1be1b063e9fa6a88634b3c76ad07318d$exports.call(left, code) ? left[code] : []);
    }
  }
}
function $5dab7f9aa14cddc5722cfa68368cfa9b$var$constructs(list, existing) {
  var index = -1;
  var before = [];
  while (++index < list.length) {
    ;
    (list[index].add === 'after' ? existing : before).push(list[index]);
  }
  $5dab7f9aa14cddc5722cfa68368cfa9b$var$chunkedSplice(existing, 0, 0, before);
  return existing;
}
$5dab7f9aa14cddc5722cfa68368cfa9b$exports = $5dab7f9aa14cddc5722cfa68368cfa9b$var$combineExtensions;
var $25aa31938ce75afaf8e06b8cadb964f3$var$combineExtensions = $5dab7f9aa14cddc5722cfa68368cfa9b$exports;
// ASSET: node_modules/micromark/dist/util/create-tokenizer.js
var $2d3fa6812897e6878c3746c06ef75d17$exports = {};
var $2d3fa6812897e6878c3746c06ef75d17$var$assign = $2c15c0256904b2d61b47372cfe59f055$exports;
var $2d3fa6812897e6878c3746c06ef75d17$var$markdownLineEnding = $16cd0200e709bd24480331e751413c02$exports;
// ASSET: node_modules/micromark/dist/util/chunked-push.js
var $7d107b44ba7ea3f042c4834864b803d4$exports = {};
var $7d107b44ba7ea3f042c4834864b803d4$var$chunkedSplice = $fe4e196242a629dfc7f8aaa44ed4e7a0$exports;
function $7d107b44ba7ea3f042c4834864b803d4$var$chunkedPush(list, items) {
  if (list.length) {
    $7d107b44ba7ea3f042c4834864b803d4$var$chunkedSplice(list, list.length, 0, items);
    return list;
  }
  return items;
}
$7d107b44ba7ea3f042c4834864b803d4$exports = $7d107b44ba7ea3f042c4834864b803d4$var$chunkedPush;
var $2d3fa6812897e6878c3746c06ef75d17$var$chunkedPush = $7d107b44ba7ea3f042c4834864b803d4$exports;
var $2d3fa6812897e6878c3746c06ef75d17$var$chunkedSplice = $fe4e196242a629dfc7f8aaa44ed4e7a0$exports;
var $2d3fa6812897e6878c3746c06ef75d17$var$miniflat = $57b9e502ba2b9afa5bb25d026939d0f7$exports;
// ASSET: node_modules/micromark/dist/util/resolve-all.js
var $42ca53f135e913d4482f8287477c6404$exports = {};
function $42ca53f135e913d4482f8287477c6404$var$resolveAll(constructs, events, context) {
  var called = [];
  var index = -1;
  var resolve;
  while (++index < constructs.length) {
    resolve = constructs[index].resolveAll;
    if (resolve && called.indexOf(resolve) < 0) {
      events = resolve(events, context);
      called.push(resolve);
    }
  }
  return events;
}
$42ca53f135e913d4482f8287477c6404$exports = $42ca53f135e913d4482f8287477c6404$var$resolveAll;
var $2d3fa6812897e6878c3746c06ef75d17$var$resolveAll = $42ca53f135e913d4482f8287477c6404$exports;
// ASSET: node_modules/micromark/dist/util/serialize-chunks.js
var $52dc84f5ecbf41b074da465117fd4fe3$exports = {};
var $52dc84f5ecbf41b074da465117fd4fe3$var$fromCharCode = $f8f98e619426b02ca259c6c84ae288cd$exports;
function $52dc84f5ecbf41b074da465117fd4fe3$var$serializeChunks(chunks) {
  var index = -1;
  var result = [];
  var chunk;
  var value;
  var atTab;
  while (++index < chunks.length) {
    chunk = chunks[index];
    if (typeof chunk === 'string') {
      value = chunk;
    } else if (chunk === -5) {
      value = '\r';
    } else if (chunk === -4) {
      value = '\n';
    } else if (chunk === -3) {
      value = '\r' + '\n';
    } else if (chunk === -2) {
      value = '\t';
    } else if (chunk === -1) {
      if (atTab) continue;
      value = ' ';
    } else {
      // Currently only replacement character.
      value = $52dc84f5ecbf41b074da465117fd4fe3$var$fromCharCode(chunk);
    }
    atTab = chunk === -2;
    result.push(value);
  }
  return result.join('');
}
$52dc84f5ecbf41b074da465117fd4fe3$exports = $52dc84f5ecbf41b074da465117fd4fe3$var$serializeChunks;
var $2d3fa6812897e6878c3746c06ef75d17$var$serializeChunks = $52dc84f5ecbf41b074da465117fd4fe3$exports;
var $2d3fa6812897e6878c3746c06ef75d17$var$shallow = $541289fbe4aa92ce2fc0b3f29311bcb8$exports;
// ASSET: node_modules/micromark/dist/util/slice-chunks.js
var $8ba5645c48ca0629d5481624c49608f0$exports = {};
function $8ba5645c48ca0629d5481624c49608f0$var$sliceChunks(chunks, token) {
  var startIndex = token.start._index;
  var startBufferIndex = token.start._bufferIndex;
  var endIndex = token.end._index;
  var endBufferIndex = token.end._bufferIndex;
  var view;
  if (startIndex === endIndex) {
    view = [chunks[startIndex].slice(startBufferIndex, endBufferIndex)];
  } else {
    view = chunks.slice(startIndex, endIndex);
    if (startBufferIndex > -1) {
      view[0] = view[0].slice(startBufferIndex);
    }
    if (endBufferIndex > 0) {
      view.push(chunks[endIndex].slice(0, endBufferIndex));
    }
  }
  return view;
}
$8ba5645c48ca0629d5481624c49608f0$exports = $8ba5645c48ca0629d5481624c49608f0$var$sliceChunks;
var $2d3fa6812897e6878c3746c06ef75d17$var$sliceChunks = $8ba5645c48ca0629d5481624c49608f0$exports;
// Create a tokenizer.
// Tokenizers deal with one type of data (e.g., containers, flow, text).
// The parser is the object dealing with it all.
// `initialize` works like other constructs, except that only its `tokenize`
// function is used, in which case it doesn’t receive an `ok` or `nok`.
// `from` can be given to set the point before the first character, although
// when further lines are indented, they must be set with `defineSkip`.
function $2d3fa6812897e6878c3746c06ef75d17$var$createTokenizer(parser, initialize, from) {
  var point = from ? $2d3fa6812897e6878c3746c06ef75d17$var$shallow(from) : {
    line: 1,
    column: 1,
    offset: 0
  };
  var columnStart = {};
  var resolveAllConstructs = [];
  var chunks = [];
  var stack = [];
  var effects = {
    consume: consume,
    enter: enter,
    exit: exit,
    attempt: constructFactory(onsuccessfulconstruct),
    check: constructFactory(onsuccessfulcheck),
    interrupt: constructFactory(onsuccessfulcheck, {
      interrupt: true
    }),
    lazy: constructFactory(onsuccessfulcheck, {
      lazy: true
    })
  };
  // State and tools for resolving and serializing.
  var context = {
    previous: null,
    events: [],
    parser: parser,
    sliceStream: sliceStream,
    sliceSerialize: sliceSerialize,
    now: now,
    defineSkip: skip,
    write: write
  };
  // The state function.
  var state = initialize.tokenize.call(context, effects);
  // Track which character we expect to be consumed, to catch bugs.
  if (initialize.resolveAll) {
    resolveAllConstructs.push(initialize);
  }
  // Store where we are in the input stream.
  point._index = 0;
  point._bufferIndex = -1;
  return context;
  function write(slice) {
    chunks = $2d3fa6812897e6878c3746c06ef75d17$var$chunkedPush(chunks, slice);
    main();
    // Exit if we’re not done, resolve might change stuff.
    if (chunks[chunks.length - 1] !== null) {
      return [];
    }
    addResult(initialize, 0);
    // Otherwise, resolve, and exit.
    context.events = $2d3fa6812897e6878c3746c06ef75d17$var$resolveAll(resolveAllConstructs, context.events, context);
    return context.events;
  }
  //
  // Tools.
  //
  function sliceSerialize(token) {
    return $2d3fa6812897e6878c3746c06ef75d17$var$serializeChunks(sliceStream(token));
  }
  function sliceStream(token) {
    return $2d3fa6812897e6878c3746c06ef75d17$var$sliceChunks(chunks, token);
  }
  function now() {
    return $2d3fa6812897e6878c3746c06ef75d17$var$shallow(point);
  }
  function skip(value) {
    columnStart[value.line] = value.column;
    accountForPotentialSkip();
  }
  //
  // State management.
  //
  // Main loop (note that `_index` and `_bufferIndex` in `point` are modified by
  // `consume`).
  // Here is where we walk through the chunks, which either include strings of
  // several characters, or numerical character codes.
  // The reason to do this in a loop instead of a call is so the stack can
  // drain.
  function main() {
    var chunkIndex;
    var chunk;
    while (point._index < chunks.length) {
      chunk = chunks[point._index];
      // If we’re in a buffer chunk, loop through it.
      if (typeof chunk === 'string') {
        chunkIndex = point._index;
        if (point._bufferIndex < 0) {
          point._bufferIndex = 0;
        }
        while (point._index === chunkIndex && point._bufferIndex < chunk.length) {
          go(chunk.charCodeAt(point._bufferIndex));
        }
      } else {
        go(chunk);
      }
    }
  }
  // Deal with one code.
  function go(code) {
    state = state(code);
  }
  // Move a character forward.
  function consume(code) {
    if ($2d3fa6812897e6878c3746c06ef75d17$var$markdownLineEnding(code)) {
      point.line++;
      point.column = 1;
      point.offset += code === -3 ? 2 : 1;
      accountForPotentialSkip();
    } else if (code !== -1) {
      point.column++;
      point.offset++;
    }
    // Not in a string chunk.
    if (point._bufferIndex < 0) {
      point._index++;
    } else {
      point._bufferIndex++;
      // At end of string chunk.
      if (point._bufferIndex === chunks[point._index].length) {
        point._bufferIndex = -1;
        point._index++;
      }
    }
    // Expose the previous character.
    context.previous = code;
  }
  // Start a token.
  function enter(type, fields) {
    var token = fields || ({});
    token.type = type;
    token.start = now();
    context.events.push(['enter', token, context]);
    stack.push(token);
    return token;
  }
  // Stop a token.
  function exit(type) {
    var token = stack.pop();
    token.end = now();
    context.events.push(['exit', token, context]);
    return token;
  }
  // Use results.
  function onsuccessfulconstruct(construct, info) {
    addResult(construct, info.from);
  }
  // Discard results.
  function onsuccessfulcheck(construct, info) {
    info.restore();
  }
  // Factory to attempt/check/interrupt.
  function constructFactory(onreturn, fields) {
    return hook;
    // Handle either an object mapping codes to constructs, a list of
    // constructs, or a single construct.
    function hook(constructs, returnState, bogusState) {
      var listOfConstructs;
      var constructIndex;
      var currentConstruct;
      var info;
      return constructs.tokenize || ('length' in constructs) ? handleListOfConstructs($2d3fa6812897e6878c3746c06ef75d17$var$miniflat(constructs)) : handleMapOfConstructs;
      function handleMapOfConstructs(code) {
        if ((code in constructs) || (null in constructs)) {
          return handleListOfConstructs(constructs.null ? /*c8 ignore next*/
          $2d3fa6812897e6878c3746c06ef75d17$var$miniflat(constructs[code]).concat($2d3fa6812897e6878c3746c06ef75d17$var$miniflat(constructs.null)) : constructs[code])(code);
        }
        return bogusState(code);
      }
      function handleListOfConstructs(list) {
        listOfConstructs = list;
        constructIndex = 0;
        return handleConstruct(list[constructIndex]);
      }
      function handleConstruct(construct) {
        return start;
        function start(code) {
          // To do: not nede to store if there is no bogus state, probably?
          // Currently doesn’t work because `inspect` in document does a check
          // w/o a bogus, which doesn’t make sense. But it does seem to help perf
          // by not storing.
          info = store();
          currentConstruct = construct;
          if (!construct.partial) {
            context.currentConstruct = construct;
          }
          if (construct.name && context.parser.constructs.disable.null.indexOf(construct.name) > -1) {
            return nok();
          }
          return construct.tokenize.call(fields ? $2d3fa6812897e6878c3746c06ef75d17$var$assign({}, context, fields) : context, effects, ok, nok)(code);
        }
      }
      function ok(code) {
        onreturn(currentConstruct, info);
        return returnState;
      }
      function nok(code) {
        info.restore();
        if (++constructIndex < listOfConstructs.length) {
          return handleConstruct(listOfConstructs[constructIndex]);
        }
        return bogusState;
      }
    }
  }
  function addResult(construct, from) {
    if (construct.resolveAll && resolveAllConstructs.indexOf(construct) < 0) {
      resolveAllConstructs.push(construct);
    }
    if (construct.resolve) {
      $2d3fa6812897e6878c3746c06ef75d17$var$chunkedSplice(context.events, from, context.events.length - from, construct.resolve(context.events.slice(from), context));
    }
    if (construct.resolveTo) {
      context.events = construct.resolveTo(context.events, context);
    }
  }
  function store() {
    var startPoint = now();
    var startPrevious = context.previous;
    var startCurrentConstruct = context.currentConstruct;
    var startEventsIndex = context.events.length;
    var startStack = Array.from(stack);
    return {
      restore: restore,
      from: startEventsIndex
    };
    function restore() {
      point = startPoint;
      context.previous = startPrevious;
      context.currentConstruct = startCurrentConstruct;
      context.events.length = startEventsIndex;
      stack = startStack;
      accountForPotentialSkip();
    }
  }
  function accountForPotentialSkip() {
    if ((point.line in columnStart) && point.column < 2) {
      point.column = columnStart[point.line];
      point.offset += columnStart[point.line] - 1;
    }
  }
}
$2d3fa6812897e6878c3746c06ef75d17$exports = $2d3fa6812897e6878c3746c06ef75d17$var$createTokenizer;
var $25aa31938ce75afaf8e06b8cadb964f3$var$createTokenizer = $2d3fa6812897e6878c3746c06ef75d17$exports;
var $25aa31938ce75afaf8e06b8cadb964f3$var$miniflat = $57b9e502ba2b9afa5bb25d026939d0f7$exports;
// ASSET: node_modules/micromark/dist/constructs.js
var $066ede785a42c642ad66be353fcdb5fa$exports = {};
Object.defineProperty($066ede785a42c642ad66be353fcdb5fa$exports, '__esModule', {
  value: true
});
// ASSET: node_modules/micromark/dist/tokenize/attention.js
var $1bd0e45bf25a3bc73199cfd6064595a2$exports = {};
var $1bd0e45bf25a3bc73199cfd6064595a2$var$chunkedPush = $7d107b44ba7ea3f042c4834864b803d4$exports;
var $1bd0e45bf25a3bc73199cfd6064595a2$var$chunkedSplice = $fe4e196242a629dfc7f8aaa44ed4e7a0$exports;
// ASSET: node_modules/micromark/dist/util/classify-character.js
var $8a402968d2f43377911682d9bef13aee$exports = {};
// ASSET: node_modules/micromark/dist/character/markdown-line-ending-or-space.js
var $2197d3279e1964023d191737ef7bb821$exports = {};
function $2197d3279e1964023d191737ef7bb821$var$markdownLineEndingOrSpace(code) {
  return code < 0 || code === 32;
}
$2197d3279e1964023d191737ef7bb821$exports = $2197d3279e1964023d191737ef7bb821$var$markdownLineEndingOrSpace;
var $8a402968d2f43377911682d9bef13aee$var$markdownLineEndingOrSpace = $2197d3279e1964023d191737ef7bb821$exports;
// ASSET: node_modules/micromark/dist/character/unicode-punctuation.js
var $4fdd8d62372673155083afc7f7d5e4b9$exports = {};
// ASSET: node_modules/micromark/dist/constant/unicode-punctuation-regex.js
var $31007df3ae2a9ea15a01baffc6d305be$exports = {};
// This module is generated by `script/`.
//
// CommonMark handles attention (emphasis, strong) markers based on what comes
// before or after them.
// One such difference is if those characters are Unicode punctuation.
// This script is generated from the Unicode data.
var $31007df3ae2a9ea15a01baffc6d305be$var$unicodePunctuation = /[!-\/:-@\[-`\{-~\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/;
$31007df3ae2a9ea15a01baffc6d305be$exports = $31007df3ae2a9ea15a01baffc6d305be$var$unicodePunctuation;
var $4fdd8d62372673155083afc7f7d5e4b9$var$unicodePunctuationRegex = $31007df3ae2a9ea15a01baffc6d305be$exports;
// ASSET: node_modules/micromark/dist/util/regex-check.js
var $a6669147543c6254fb1a2728aa53bb47$exports = {};
var $a6669147543c6254fb1a2728aa53bb47$var$fromCharCode = $f8f98e619426b02ca259c6c84ae288cd$exports;
function $a6669147543c6254fb1a2728aa53bb47$var$regexCheck(regex) {
  return check;
  function check(code) {
    return regex.test($a6669147543c6254fb1a2728aa53bb47$var$fromCharCode(code));
  }
}
$a6669147543c6254fb1a2728aa53bb47$exports = $a6669147543c6254fb1a2728aa53bb47$var$regexCheck;
var $4fdd8d62372673155083afc7f7d5e4b9$var$regexCheck = $a6669147543c6254fb1a2728aa53bb47$exports;
// In fact adds to the bundle size.
var $4fdd8d62372673155083afc7f7d5e4b9$var$unicodePunctuation = $4fdd8d62372673155083afc7f7d5e4b9$var$regexCheck($4fdd8d62372673155083afc7f7d5e4b9$var$unicodePunctuationRegex);
$4fdd8d62372673155083afc7f7d5e4b9$exports = $4fdd8d62372673155083afc7f7d5e4b9$var$unicodePunctuation;
var $8a402968d2f43377911682d9bef13aee$var$unicodePunctuation = $4fdd8d62372673155083afc7f7d5e4b9$exports;
// ASSET: node_modules/micromark/dist/character/unicode-whitespace.js
var $47922a70fb204ba26a4e1f092a5a95a5$exports = {};
var $47922a70fb204ba26a4e1f092a5a95a5$var$regexCheck = $a6669147543c6254fb1a2728aa53bb47$exports;
var $47922a70fb204ba26a4e1f092a5a95a5$var$unicodeWhitespace = $47922a70fb204ba26a4e1f092a5a95a5$var$regexCheck(/\s/);
$47922a70fb204ba26a4e1f092a5a95a5$exports = $47922a70fb204ba26a4e1f092a5a95a5$var$unicodeWhitespace;
var $8a402968d2f43377911682d9bef13aee$var$unicodeWhitespace = $47922a70fb204ba26a4e1f092a5a95a5$exports;
// Classify whether a character is unicode whitespace, unicode punctuation, or
// anything else.
// Used for attention (emphasis, strong), whose sequences can open or close
// based on the class of surrounding characters.
function $8a402968d2f43377911682d9bef13aee$var$classifyCharacter(code) {
  if (code === null || $8a402968d2f43377911682d9bef13aee$var$markdownLineEndingOrSpace(code) || $8a402968d2f43377911682d9bef13aee$var$unicodeWhitespace(code)) {
    return 1;
  }
  if ($8a402968d2f43377911682d9bef13aee$var$unicodePunctuation(code)) {
    return 2;
  }
}
$8a402968d2f43377911682d9bef13aee$exports = $8a402968d2f43377911682d9bef13aee$var$classifyCharacter;
var $1bd0e45bf25a3bc73199cfd6064595a2$var$classifyCharacter = $8a402968d2f43377911682d9bef13aee$exports;
// ASSET: node_modules/micromark/dist/util/move-point.js
var $40cd1ac15687b513b64e3ac719cb8ad6$exports = {};
// chunks (replacement characters, tabs, or line endings).
function $40cd1ac15687b513b64e3ac719cb8ad6$var$movePoint(point, offset) {
  point.column += offset;
  point.offset += offset;
  point._bufferIndex += offset;
  return point;
}
$40cd1ac15687b513b64e3ac719cb8ad6$exports = $40cd1ac15687b513b64e3ac719cb8ad6$var$movePoint;
var $1bd0e45bf25a3bc73199cfd6064595a2$var$movePoint = $40cd1ac15687b513b64e3ac719cb8ad6$exports;
var $1bd0e45bf25a3bc73199cfd6064595a2$var$resolveAll = $42ca53f135e913d4482f8287477c6404$exports;
var $1bd0e45bf25a3bc73199cfd6064595a2$var$shallow = $541289fbe4aa92ce2fc0b3f29311bcb8$exports;
var $1bd0e45bf25a3bc73199cfd6064595a2$var$attention = {
  name: 'attention',
  tokenize: $1bd0e45bf25a3bc73199cfd6064595a2$var$tokenizeAttention,
  resolveAll: $1bd0e45bf25a3bc73199cfd6064595a2$var$resolveAllAttention
};
function $1bd0e45bf25a3bc73199cfd6064595a2$var$resolveAllAttention(events, context) {
  var index = -1;
  var open;
  var group;
  var text;
  var openingSequence;
  var closingSequence;
  var use;
  var nextEvents;
  var offset;
  // Walk through all events.
  //
  // Note: performance of this is fine on an mb of normal markdown, but it’s
  // a bottleneck for malicious stuff.
  while (++index < events.length) {
    // Find a token that can close.
    if (events[index][0] === 'enter' && events[index][1].type === 'attentionSequence' && events[index][1]._close) {
      open = index;
      // Now walk back to find an opener.
      while (open--) {
        // Find a token that can open the closer.
        if (events[open][0] === 'exit' && events[open][1].type === 'attentionSequence' && events[open][1]._open && // If the markers are the same:
        context.sliceSerialize(events[open][1]).charCodeAt(0) === context.sliceSerialize(events[index][1]).charCodeAt(0)) {
          // If the opening can close or the closing can open,
          // and the close size *is not* a multiple of three,
          // but the sum of the opening and closing size *is* multiple of three,
          // then don’t match.
          if ((events[open][1]._close || events[index][1]._open) && (events[index][1].end.offset - events[index][1].start.offset) % 3 && !((events[open][1].end.offset - events[open][1].start.offset + events[index][1].end.offset - events[index][1].start.offset) % 3)) {
            continue;
          }
          // Number of markers to use from the sequence.
          use = events[open][1].end.offset - events[open][1].start.offset > 1 && events[index][1].end.offset - events[index][1].start.offset > 1 ? 2 : 1;
          openingSequence = {
            type: use > 1 ? 'strongSequence' : 'emphasisSequence',
            start: $1bd0e45bf25a3bc73199cfd6064595a2$var$movePoint($1bd0e45bf25a3bc73199cfd6064595a2$var$shallow(events[open][1].end), -use),
            end: $1bd0e45bf25a3bc73199cfd6064595a2$var$shallow(events[open][1].end)
          };
          closingSequence = {
            type: use > 1 ? 'strongSequence' : 'emphasisSequence',
            start: $1bd0e45bf25a3bc73199cfd6064595a2$var$shallow(events[index][1].start),
            end: $1bd0e45bf25a3bc73199cfd6064595a2$var$movePoint($1bd0e45bf25a3bc73199cfd6064595a2$var$shallow(events[index][1].start), use)
          };
          text = {
            type: use > 1 ? 'strongText' : 'emphasisText',
            start: $1bd0e45bf25a3bc73199cfd6064595a2$var$shallow(events[open][1].end),
            end: $1bd0e45bf25a3bc73199cfd6064595a2$var$shallow(events[index][1].start)
          };
          group = {
            type: use > 1 ? 'strong' : 'emphasis',
            start: $1bd0e45bf25a3bc73199cfd6064595a2$var$shallow(openingSequence.start),
            end: $1bd0e45bf25a3bc73199cfd6064595a2$var$shallow(closingSequence.end)
          };
          events[open][1].end = $1bd0e45bf25a3bc73199cfd6064595a2$var$shallow(openingSequence.start);
          events[index][1].start = $1bd0e45bf25a3bc73199cfd6064595a2$var$shallow(closingSequence.end);
          nextEvents = [];
          // If there are more markers in the opening, add them before.
          if (events[open][1].end.offset - events[open][1].start.offset) {
            nextEvents = $1bd0e45bf25a3bc73199cfd6064595a2$var$chunkedPush(nextEvents, [['enter', events[open][1], context], ['exit', events[open][1], context]]);
          }
          // Opening.
          nextEvents = $1bd0e45bf25a3bc73199cfd6064595a2$var$chunkedPush(nextEvents, [['enter', group, context], ['enter', openingSequence, context], ['exit', openingSequence, context], ['enter', text, context]]);
          // Between.
          nextEvents = $1bd0e45bf25a3bc73199cfd6064595a2$var$chunkedPush(nextEvents, $1bd0e45bf25a3bc73199cfd6064595a2$var$resolveAll(context.parser.constructs.insideSpan.null, events.slice(open + 1, index), context));
          // Closing.
          nextEvents = $1bd0e45bf25a3bc73199cfd6064595a2$var$chunkedPush(nextEvents, [['exit', text, context], ['enter', closingSequence, context], ['exit', closingSequence, context], ['exit', group, context]]);
          // If there are more markers in the closing, add them after.
          if (events[index][1].end.offset - events[index][1].start.offset) {
            offset = 2;
            nextEvents = $1bd0e45bf25a3bc73199cfd6064595a2$var$chunkedPush(nextEvents, [['enter', events[index][1], context], ['exit', events[index][1], context]]);
          } else {
            offset = 0;
          }
          $1bd0e45bf25a3bc73199cfd6064595a2$var$chunkedSplice(events, open - 1, index - open + 3, nextEvents);
          index = open + nextEvents.length - offset - 2;
          break;
        }
      }
    }
  }
  // Remove remaining sequences.
  index = -1;
  while (++index < events.length) {
    if (events[index][1].type === 'attentionSequence') {
      events[index][1].type = 'data';
    }
  }
  return events;
}
function $1bd0e45bf25a3bc73199cfd6064595a2$var$tokenizeAttention(effects, ok) {
  var before = $1bd0e45bf25a3bc73199cfd6064595a2$var$classifyCharacter(this.previous);
  var marker;
  return start;
  function start(code) {
    effects.enter('attentionSequence');
    marker = code;
    return sequence(code);
  }
  function sequence(code) {
    var token;
    var after;
    var open;
    var close;
    if (code === marker) {
      effects.consume(code);
      return sequence;
    }
    token = effects.exit('attentionSequence');
    after = $1bd0e45bf25a3bc73199cfd6064595a2$var$classifyCharacter(code);
    open = !after || after === 2 && before;
    close = !before || before === 2 && after;
    token._open = marker === 42 ? open : open && (before || !close);
    token._close = marker === 42 ? close : close && (after || !open);
    return ok(code);
  }
}
$1bd0e45bf25a3bc73199cfd6064595a2$exports = $1bd0e45bf25a3bc73199cfd6064595a2$var$attention;
var $066ede785a42c642ad66be353fcdb5fa$var$attention = $1bd0e45bf25a3bc73199cfd6064595a2$exports;
// ASSET: node_modules/micromark/dist/tokenize/autolink.js
var $003a9c47292c095ea3fef58888c13da7$exports = {};
// ASSET: node_modules/micromark/dist/character/ascii-alpha.js
var $ccca3f3703525404049a304ea07fd1c7$exports = {};
var $ccca3f3703525404049a304ea07fd1c7$var$regexCheck = $a6669147543c6254fb1a2728aa53bb47$exports;
var $ccca3f3703525404049a304ea07fd1c7$var$asciiAlpha = $ccca3f3703525404049a304ea07fd1c7$var$regexCheck(/[A-Za-z]/);
$ccca3f3703525404049a304ea07fd1c7$exports = $ccca3f3703525404049a304ea07fd1c7$var$asciiAlpha;
var $003a9c47292c095ea3fef58888c13da7$var$asciiAlpha = $ccca3f3703525404049a304ea07fd1c7$exports;
// ASSET: node_modules/micromark/dist/character/ascii-alphanumeric.js
var $a2fcc652963823cf472ce7707e2000bf$exports = {};
var $a2fcc652963823cf472ce7707e2000bf$var$regexCheck = $a6669147543c6254fb1a2728aa53bb47$exports;
var $a2fcc652963823cf472ce7707e2000bf$var$asciiAlphanumeric = $a2fcc652963823cf472ce7707e2000bf$var$regexCheck(/[\dA-Za-z]/);
$a2fcc652963823cf472ce7707e2000bf$exports = $a2fcc652963823cf472ce7707e2000bf$var$asciiAlphanumeric;
var $003a9c47292c095ea3fef58888c13da7$var$asciiAlphanumeric = $a2fcc652963823cf472ce7707e2000bf$exports;
// ASSET: node_modules/micromark/dist/character/ascii-atext.js
var $da6906bd09d62f4bd17a57cdae00a02c$exports = {};
var $da6906bd09d62f4bd17a57cdae00a02c$var$regexCheck = $a6669147543c6254fb1a2728aa53bb47$exports;
var $da6906bd09d62f4bd17a57cdae00a02c$var$asciiAtext = $da6906bd09d62f4bd17a57cdae00a02c$var$regexCheck(/[#-'*+\--9=?A-Z^-~]/);
$da6906bd09d62f4bd17a57cdae00a02c$exports = $da6906bd09d62f4bd17a57cdae00a02c$var$asciiAtext;
var $003a9c47292c095ea3fef58888c13da7$var$asciiAtext = $da6906bd09d62f4bd17a57cdae00a02c$exports;
// ASSET: node_modules/micromark/dist/character/ascii-control.js
var $4bdaf3e1afe2b530971188f0e4ac0c5f$exports = {};
// Note: EOF is seen as ASCII control here, because `null < 32 == true`.
function $4bdaf3e1afe2b530971188f0e4ac0c5f$var$asciiControl(code) {
  return (
    // Special whitespace codes (which have negative values), C0 and Control
    // character DEL
    code < 32 || code === 127
  );
}
$4bdaf3e1afe2b530971188f0e4ac0c5f$exports = $4bdaf3e1afe2b530971188f0e4ac0c5f$var$asciiControl;
var $003a9c47292c095ea3fef58888c13da7$var$asciiControl = $4bdaf3e1afe2b530971188f0e4ac0c5f$exports;
var $003a9c47292c095ea3fef58888c13da7$var$autolink = {
  name: 'autolink',
  tokenize: $003a9c47292c095ea3fef58888c13da7$var$tokenizeAutolink
};
function $003a9c47292c095ea3fef58888c13da7$var$tokenizeAutolink(effects, ok, nok) {
  var size = 1;
  return start;
  function start(code) {
    effects.enter('autolink');
    effects.enter('autolinkMarker');
    effects.consume(code);
    effects.exit('autolinkMarker');
    effects.enter('autolinkProtocol');
    return open;
  }
  function open(code) {
    if ($003a9c47292c095ea3fef58888c13da7$var$asciiAlpha(code)) {
      effects.consume(code);
      return schemeOrEmailAtext;
    }
    return $003a9c47292c095ea3fef58888c13da7$var$asciiAtext(code) ? emailAtext(code) : nok(code);
  }
  function schemeOrEmailAtext(code) {
    return code === 43 || code === 45 || code === 46 || $003a9c47292c095ea3fef58888c13da7$var$asciiAlphanumeric(code) ? schemeInsideOrEmailAtext(code) : emailAtext(code);
  }
  function schemeInsideOrEmailAtext(code) {
    if (code === 58) {
      effects.consume(code);
      return urlInside;
    }
    if ((code === 43 || code === 45 || code === 46 || $003a9c47292c095ea3fef58888c13da7$var$asciiAlphanumeric(code)) && size++ < 32) {
      effects.consume(code);
      return schemeInsideOrEmailAtext;
    }
    return emailAtext(code);
  }
  function urlInside(code) {
    if (code === 62) {
      effects.exit('autolinkProtocol');
      return end(code);
    }
    if (code === 32 || code === 60 || $003a9c47292c095ea3fef58888c13da7$var$asciiControl(code)) {
      return nok(code);
    }
    effects.consume(code);
    return urlInside;
  }
  function emailAtext(code) {
    if (code === 64) {
      effects.consume(code);
      size = 0;
      return emailAtSignOrDot;
    }
    if ($003a9c47292c095ea3fef58888c13da7$var$asciiAtext(code)) {
      effects.consume(code);
      return emailAtext;
    }
    return nok(code);
  }
  function emailAtSignOrDot(code) {
    return $003a9c47292c095ea3fef58888c13da7$var$asciiAlphanumeric(code) ? emailLabel(code) : nok(code);
  }
  function emailLabel(code) {
    if (code === 46) {
      effects.consume(code);
      size = 0;
      return emailAtSignOrDot;
    }
    if (code === 62) {
      // Exit, then change the type.
      effects.exit('autolinkProtocol').type = 'autolinkEmail';
      return end(code);
    }
    return emailValue(code);
  }
  function emailValue(code) {
    if ((code === 45 || $003a9c47292c095ea3fef58888c13da7$var$asciiAlphanumeric(code)) && size++ < 63) {
      effects.consume(code);
      return code === 45 ? emailValue : emailLabel;
    }
    return nok(code);
  }
  function end(code) {
    effects.enter('autolinkMarker');
    effects.consume(code);
    effects.exit('autolinkMarker');
    effects.exit('autolink');
    return ok;
  }
}
$003a9c47292c095ea3fef58888c13da7$exports = $003a9c47292c095ea3fef58888c13da7$var$autolink;
var $066ede785a42c642ad66be353fcdb5fa$var$autolink = $003a9c47292c095ea3fef58888c13da7$exports;
// ASSET: node_modules/micromark/dist/tokenize/block-quote.js
var $d455c749149406709aeff0c9c02f5ac6$exports = {};
var $d455c749149406709aeff0c9c02f5ac6$var$markdownSpace = $4087d4a7eda9d3422d8ed53862be000e$exports;
var $d455c749149406709aeff0c9c02f5ac6$var$factorySpace = $c9c5e694972b79db7836f58f99718475$exports;
var $d455c749149406709aeff0c9c02f5ac6$var$blockQuote = {
  name: 'blockQuote',
  tokenize: $d455c749149406709aeff0c9c02f5ac6$var$tokenizeBlockQuoteStart,
  continuation: {
    tokenize: $d455c749149406709aeff0c9c02f5ac6$var$tokenizeBlockQuoteContinuation
  },
  exit: $d455c749149406709aeff0c9c02f5ac6$var$exit
};
function $d455c749149406709aeff0c9c02f5ac6$var$tokenizeBlockQuoteStart(effects, ok, nok) {
  var self = this;
  return start;
  function start(code) {
    if (code === 62) {
      if (!self.containerState.open) {
        effects.enter('blockQuote', {
          _container: true
        });
        self.containerState.open = true;
      }
      effects.enter('blockQuotePrefix');
      effects.enter('blockQuoteMarker');
      effects.consume(code);
      effects.exit('blockQuoteMarker');
      return after;
    }
    return nok(code);
  }
  function after(code) {
    if ($d455c749149406709aeff0c9c02f5ac6$var$markdownSpace(code)) {
      effects.enter('blockQuotePrefixWhitespace');
      effects.consume(code);
      effects.exit('blockQuotePrefixWhitespace');
      effects.exit('blockQuotePrefix');
      return ok;
    }
    effects.exit('blockQuotePrefix');
    return ok(code);
  }
}
function $d455c749149406709aeff0c9c02f5ac6$var$tokenizeBlockQuoteContinuation(effects, ok, nok) {
  return $d455c749149406709aeff0c9c02f5ac6$var$factorySpace(effects, effects.attempt($d455c749149406709aeff0c9c02f5ac6$var$blockQuote, ok, nok), 'linePrefix', this.parser.constructs.disable.null.indexOf('codeIndented') > -1 ? undefined : 4);
}
function $d455c749149406709aeff0c9c02f5ac6$var$exit(effects) {
  effects.exit('blockQuote');
}
$d455c749149406709aeff0c9c02f5ac6$exports = $d455c749149406709aeff0c9c02f5ac6$var$blockQuote;
var $066ede785a42c642ad66be353fcdb5fa$var$blockQuote = $d455c749149406709aeff0c9c02f5ac6$exports;
// ASSET: node_modules/micromark/dist/tokenize/character-escape.js
var $0d989c93c925d8e21c605e249acccfac$exports = {};
// ASSET: node_modules/micromark/dist/character/ascii-punctuation.js
var $1c504de9588dc9237d4cc0ce923bcfab$exports = {};
var $1c504de9588dc9237d4cc0ce923bcfab$var$regexCheck = $a6669147543c6254fb1a2728aa53bb47$exports;
var $1c504de9588dc9237d4cc0ce923bcfab$var$asciiPunctuation = $1c504de9588dc9237d4cc0ce923bcfab$var$regexCheck(/[!-/:-@[-`{-~]/);
$1c504de9588dc9237d4cc0ce923bcfab$exports = $1c504de9588dc9237d4cc0ce923bcfab$var$asciiPunctuation;
var $0d989c93c925d8e21c605e249acccfac$var$asciiPunctuation = $1c504de9588dc9237d4cc0ce923bcfab$exports;
var $0d989c93c925d8e21c605e249acccfac$var$characterEscape = {
  name: 'characterEscape',
  tokenize: $0d989c93c925d8e21c605e249acccfac$var$tokenizeCharacterEscape
};
function $0d989c93c925d8e21c605e249acccfac$var$tokenizeCharacterEscape(effects, ok, nok) {
  return start;
  function start(code) {
    effects.enter('characterEscape');
    effects.enter('escapeMarker');
    effects.consume(code);
    effects.exit('escapeMarker');
    return open;
  }
  function open(code) {
    if ($0d989c93c925d8e21c605e249acccfac$var$asciiPunctuation(code)) {
      effects.enter('characterEscapeValue');
      effects.consume(code);
      effects.exit('characterEscapeValue');
      effects.exit('characterEscape');
      return ok;
    }
    return nok(code);
  }
}
$0d989c93c925d8e21c605e249acccfac$exports = $0d989c93c925d8e21c605e249acccfac$var$characterEscape;
var $066ede785a42c642ad66be353fcdb5fa$var$characterEscape = $0d989c93c925d8e21c605e249acccfac$exports;
// ASSET: node_modules/micromark/dist/tokenize/character-reference.js
var $4f97e7b25e3596ef763a9ad91f23af46$exports = {};
// ASSET: node_modules/parse-entities/decode-entity.browser.js
var $14d0c44491d93e244c8a10aa7071477d$exports = {};
/*eslint-env browser*/
var $14d0c44491d93e244c8a10aa7071477d$var$el;
var $14d0c44491d93e244c8a10aa7071477d$var$semicolon = 59;
// ';'
$14d0c44491d93e244c8a10aa7071477d$exports = $14d0c44491d93e244c8a10aa7071477d$var$decodeEntity;
function $14d0c44491d93e244c8a10aa7071477d$var$decodeEntity(characters) {
  var entity = '&' + characters + ';';
  var char;
  $14d0c44491d93e244c8a10aa7071477d$var$el = $14d0c44491d93e244c8a10aa7071477d$var$el || document.createElement('i');
  $14d0c44491d93e244c8a10aa7071477d$var$el.innerHTML = entity;
  char = $14d0c44491d93e244c8a10aa7071477d$var$el.textContent;
  // Some entities do not require the closing semicolon (`&not` - for instance),
  // which leads to situations where parsing the assumed entity of &notit; will
  // result in the string `¬it;`.  When we encounter a trailing semicolon after
  // parsing and the entity to decode was not a semicolon (`&semi;`), we can
  // assume that the matching was incomplete
  if (char.charCodeAt(char.length - 1) === $14d0c44491d93e244c8a10aa7071477d$var$semicolon && characters !== 'semi') {
    return false;
  }
  // If the decoded string is equal to the input, the entity was not valid
  return char === entity ? false : char;
}
var $4f97e7b25e3596ef763a9ad91f23af46$var$decodeEntity = $14d0c44491d93e244c8a10aa7071477d$exports;
var $4f97e7b25e3596ef763a9ad91f23af46$var$asciiAlphanumeric = $a2fcc652963823cf472ce7707e2000bf$exports;
// ASSET: node_modules/micromark/dist/character/ascii-digit.js
var $6f6fef9e2cb662ee6050f40cc339dd19$exports = {};
var $6f6fef9e2cb662ee6050f40cc339dd19$var$regexCheck = $a6669147543c6254fb1a2728aa53bb47$exports;
var $6f6fef9e2cb662ee6050f40cc339dd19$var$asciiDigit = $6f6fef9e2cb662ee6050f40cc339dd19$var$regexCheck(/\d/);
$6f6fef9e2cb662ee6050f40cc339dd19$exports = $6f6fef9e2cb662ee6050f40cc339dd19$var$asciiDigit;
var $4f97e7b25e3596ef763a9ad91f23af46$var$asciiDigit = $6f6fef9e2cb662ee6050f40cc339dd19$exports;
// ASSET: node_modules/micromark/dist/character/ascii-hex-digit.js
var $4d3e1e25f5ad892e1ddc0d56dada52f9$exports = {};
var $4d3e1e25f5ad892e1ddc0d56dada52f9$var$regexCheck = $a6669147543c6254fb1a2728aa53bb47$exports;
var $4d3e1e25f5ad892e1ddc0d56dada52f9$var$asciiHexDigit = $4d3e1e25f5ad892e1ddc0d56dada52f9$var$regexCheck(/[\dA-Fa-f]/);
$4d3e1e25f5ad892e1ddc0d56dada52f9$exports = $4d3e1e25f5ad892e1ddc0d56dada52f9$var$asciiHexDigit;
var $4f97e7b25e3596ef763a9ad91f23af46$var$asciiHexDigit = $4d3e1e25f5ad892e1ddc0d56dada52f9$exports;
function $4f97e7b25e3596ef763a9ad91f23af46$var$_interopDefaultLegacy(e) {
  return e && typeof e === 'object' && ('default' in e) ? e : {
    default: e
  };
}
var $4f97e7b25e3596ef763a9ad91f23af46$var$decodeEntity__default = /*#__PURE__*/$4f97e7b25e3596ef763a9ad91f23af46$var$_interopDefaultLegacy($4f97e7b25e3596ef763a9ad91f23af46$var$decodeEntity);
var $4f97e7b25e3596ef763a9ad91f23af46$var$characterReference = {
  name: 'characterReference',
  tokenize: $4f97e7b25e3596ef763a9ad91f23af46$var$tokenizeCharacterReference
};
function $4f97e7b25e3596ef763a9ad91f23af46$var$tokenizeCharacterReference(effects, ok, nok) {
  var self = this;
  var size = 0;
  var max;
  var test;
  return start;
  function start(code) {
    effects.enter('characterReference');
    effects.enter('characterReferenceMarker');
    effects.consume(code);
    effects.exit('characterReferenceMarker');
    return open;
  }
  function open(code) {
    if (code === 35) {
      effects.enter('characterReferenceMarkerNumeric');
      effects.consume(code);
      effects.exit('characterReferenceMarkerNumeric');
      return numeric;
    }
    effects.enter('characterReferenceValue');
    max = 31;
    test = $4f97e7b25e3596ef763a9ad91f23af46$var$asciiAlphanumeric;
    return value(code);
  }
  function numeric(code) {
    if (code === 88 || code === 120) {
      effects.enter('characterReferenceMarkerHexadecimal');
      effects.consume(code);
      effects.exit('characterReferenceMarkerHexadecimal');
      effects.enter('characterReferenceValue');
      max = 6;
      test = $4f97e7b25e3596ef763a9ad91f23af46$var$asciiHexDigit;
      return value;
    }
    effects.enter('characterReferenceValue');
    max = 7;
    test = $4f97e7b25e3596ef763a9ad91f23af46$var$asciiDigit;
    return value(code);
  }
  function value(code) {
    var token;
    if (code === 59 && size) {
      token = effects.exit('characterReferenceValue');
      if (test === $4f97e7b25e3596ef763a9ad91f23af46$var$asciiAlphanumeric && !$4f97e7b25e3596ef763a9ad91f23af46$var$decodeEntity__default['default'](self.sliceSerialize(token))) {
        return nok(code);
      }
      effects.enter('characterReferenceMarker');
      effects.consume(code);
      effects.exit('characterReferenceMarker');
      effects.exit('characterReference');
      return ok;
    }
    if (test(code) && size++ < max) {
      effects.consume(code);
      return value;
    }
    return nok(code);
  }
}
$4f97e7b25e3596ef763a9ad91f23af46$exports = $4f97e7b25e3596ef763a9ad91f23af46$var$characterReference;
var $066ede785a42c642ad66be353fcdb5fa$var$characterReference = $4f97e7b25e3596ef763a9ad91f23af46$exports;
// ASSET: node_modules/micromark/dist/tokenize/code-fenced.js
var $20d45cb7cb1ba6e9767c559466336a28$exports = {};
var $20d45cb7cb1ba6e9767c559466336a28$var$markdownLineEnding = $16cd0200e709bd24480331e751413c02$exports;
var $20d45cb7cb1ba6e9767c559466336a28$var$markdownLineEndingOrSpace = $2197d3279e1964023d191737ef7bb821$exports;
var $20d45cb7cb1ba6e9767c559466336a28$var$prefixSize = $d154556f03fbe11e6c8c9db4f5c0c203$exports;
var $20d45cb7cb1ba6e9767c559466336a28$var$factorySpace = $c9c5e694972b79db7836f58f99718475$exports;
var $20d45cb7cb1ba6e9767c559466336a28$var$codeFenced = {
  name: 'codeFenced',
  tokenize: $20d45cb7cb1ba6e9767c559466336a28$var$tokenizeCodeFenced,
  concrete: true
};
function $20d45cb7cb1ba6e9767c559466336a28$var$tokenizeCodeFenced(effects, ok, nok) {
  var self = this;
  var closingFenceConstruct = {
    tokenize: tokenizeClosingFence,
    partial: true
  };
  var initialPrefix = $20d45cb7cb1ba6e9767c559466336a28$var$prefixSize(this.events, 'linePrefix');
  var sizeOpen = 0;
  var marker;
  return start;
  function start(code) {
    effects.enter('codeFenced');
    effects.enter('codeFencedFence');
    effects.enter('codeFencedFenceSequence');
    marker = code;
    return sequenceOpen(code);
  }
  function sequenceOpen(code) {
    if (code === marker) {
      effects.consume(code);
      sizeOpen++;
      return sequenceOpen;
    }
    effects.exit('codeFencedFenceSequence');
    return sizeOpen < 3 ? nok(code) : $20d45cb7cb1ba6e9767c559466336a28$var$factorySpace(effects, infoOpen, 'whitespace')(code);
  }
  function infoOpen(code) {
    if (code === null || $20d45cb7cb1ba6e9767c559466336a28$var$markdownLineEnding(code)) {
      return openAfter(code);
    }
    effects.enter('codeFencedFenceInfo');
    effects.enter('chunkString', {
      contentType: 'string'
    });
    return info(code);
  }
  function info(code) {
    if (code === null || $20d45cb7cb1ba6e9767c559466336a28$var$markdownLineEndingOrSpace(code)) {
      effects.exit('chunkString');
      effects.exit('codeFencedFenceInfo');
      return $20d45cb7cb1ba6e9767c559466336a28$var$factorySpace(effects, infoAfter, 'whitespace')(code);
    }
    if (code === 96 && code === marker) return nok(code);
    effects.consume(code);
    return info;
  }
  function infoAfter(code) {
    if (code === null || $20d45cb7cb1ba6e9767c559466336a28$var$markdownLineEnding(code)) {
      return openAfter(code);
    }
    effects.enter('codeFencedFenceMeta');
    effects.enter('chunkString', {
      contentType: 'string'
    });
    return meta(code);
  }
  function meta(code) {
    if (code === null || $20d45cb7cb1ba6e9767c559466336a28$var$markdownLineEnding(code)) {
      effects.exit('chunkString');
      effects.exit('codeFencedFenceMeta');
      return openAfter(code);
    }
    if (code === 96 && code === marker) return nok(code);
    effects.consume(code);
    return meta;
  }
  function openAfter(code) {
    effects.exit('codeFencedFence');
    return self.interrupt ? ok(code) : content(code);
  }
  function content(code) {
    if (code === null) {
      return after(code);
    }
    if ($20d45cb7cb1ba6e9767c559466336a28$var$markdownLineEnding(code)) {
      effects.enter('lineEnding');
      effects.consume(code);
      effects.exit('lineEnding');
      return effects.attempt(closingFenceConstruct, after, initialPrefix ? $20d45cb7cb1ba6e9767c559466336a28$var$factorySpace(effects, content, 'linePrefix', initialPrefix + 1) : content);
    }
    effects.enter('codeFlowValue');
    return contentContinue(code);
  }
  function contentContinue(code) {
    if (code === null || $20d45cb7cb1ba6e9767c559466336a28$var$markdownLineEnding(code)) {
      effects.exit('codeFlowValue');
      return content(code);
    }
    effects.consume(code);
    return contentContinue;
  }
  function after(code) {
    effects.exit('codeFenced');
    return ok(code);
  }
  function tokenizeClosingFence(effects, ok, nok) {
    var size = 0;
    return $20d45cb7cb1ba6e9767c559466336a28$var$factorySpace(effects, closingSequenceStart, 'linePrefix', this.parser.constructs.disable.null.indexOf('codeIndented') > -1 ? undefined : 4);
    function closingSequenceStart(code) {
      effects.enter('codeFencedFence');
      effects.enter('codeFencedFenceSequence');
      return closingSequence(code);
    }
    function closingSequence(code) {
      if (code === marker) {
        effects.consume(code);
        size++;
        return closingSequence;
      }
      if (size < sizeOpen) return nok(code);
      effects.exit('codeFencedFenceSequence');
      return $20d45cb7cb1ba6e9767c559466336a28$var$factorySpace(effects, closingSequenceEnd, 'whitespace')(code);
    }
    function closingSequenceEnd(code) {
      if (code === null || $20d45cb7cb1ba6e9767c559466336a28$var$markdownLineEnding(code)) {
        effects.exit('codeFencedFence');
        return ok(code);
      }
      return nok(code);
    }
  }
}
$20d45cb7cb1ba6e9767c559466336a28$exports = $20d45cb7cb1ba6e9767c559466336a28$var$codeFenced;
var $066ede785a42c642ad66be353fcdb5fa$var$codeFenced = $20d45cb7cb1ba6e9767c559466336a28$exports;
// ASSET: node_modules/micromark/dist/tokenize/code-indented.js
var $af12be31446cb4904c1e73a77bd8de01$exports = {};
var $af12be31446cb4904c1e73a77bd8de01$var$markdownLineEnding = $16cd0200e709bd24480331e751413c02$exports;
var $af12be31446cb4904c1e73a77bd8de01$var$chunkedSplice = $fe4e196242a629dfc7f8aaa44ed4e7a0$exports;
var $af12be31446cb4904c1e73a77bd8de01$var$prefixSize = $d154556f03fbe11e6c8c9db4f5c0c203$exports;
var $af12be31446cb4904c1e73a77bd8de01$var$factorySpace = $c9c5e694972b79db7836f58f99718475$exports;
var $af12be31446cb4904c1e73a77bd8de01$var$codeIndented = {
  name: 'codeIndented',
  tokenize: $af12be31446cb4904c1e73a77bd8de01$var$tokenizeCodeIndented,
  resolve: $af12be31446cb4904c1e73a77bd8de01$var$resolveCodeIndented
};
var $af12be31446cb4904c1e73a77bd8de01$var$indentedContentConstruct = {
  tokenize: $af12be31446cb4904c1e73a77bd8de01$var$tokenizeIndentedContent,
  partial: true
};
function $af12be31446cb4904c1e73a77bd8de01$var$resolveCodeIndented(events, context) {
  var code = {
    type: 'codeIndented',
    start: events[0][1].start,
    end: events[events.length - 1][1].end
  };
  $af12be31446cb4904c1e73a77bd8de01$var$chunkedSplice(events, 0, 0, [['enter', code, context]]);
  $af12be31446cb4904c1e73a77bd8de01$var$chunkedSplice(events, events.length, 0, [['exit', code, context]]);
  return events;
}
function $af12be31446cb4904c1e73a77bd8de01$var$tokenizeCodeIndented(effects, ok, nok) {
  return effects.attempt($af12be31446cb4904c1e73a77bd8de01$var$indentedContentConstruct, afterPrefix, nok);
  function afterPrefix(code) {
    if (code === null) {
      return ok(code);
    }
    if ($af12be31446cb4904c1e73a77bd8de01$var$markdownLineEnding(code)) {
      return effects.attempt($af12be31446cb4904c1e73a77bd8de01$var$indentedContentConstruct, afterPrefix, ok)(code);
    }
    effects.enter('codeFlowValue');
    return content(code);
  }
  function content(code) {
    if (code === null || $af12be31446cb4904c1e73a77bd8de01$var$markdownLineEnding(code)) {
      effects.exit('codeFlowValue');
      return afterPrefix(code);
    }
    effects.consume(code);
    return content;
  }
}
function $af12be31446cb4904c1e73a77bd8de01$var$tokenizeIndentedContent(effects, ok, nok) {
  var self = this;
  return $af12be31446cb4904c1e73a77bd8de01$var$factorySpace(effects, afterPrefix, 'linePrefix', 4 + 1);
  function afterPrefix(code) {
    if ($af12be31446cb4904c1e73a77bd8de01$var$markdownLineEnding(code)) {
      effects.enter('lineEnding');
      effects.consume(code);
      effects.exit('lineEnding');
      return $af12be31446cb4904c1e73a77bd8de01$var$factorySpace(effects, afterPrefix, 'linePrefix', 4 + 1);
    }
    return $af12be31446cb4904c1e73a77bd8de01$var$prefixSize(self.events, 'linePrefix') < 4 ? nok(code) : ok(code);
  }
}
$af12be31446cb4904c1e73a77bd8de01$exports = $af12be31446cb4904c1e73a77bd8de01$var$codeIndented;
var $066ede785a42c642ad66be353fcdb5fa$var$codeIndented = $af12be31446cb4904c1e73a77bd8de01$exports;
// ASSET: node_modules/micromark/dist/tokenize/code-text.js
var $5957c785af72aa1af7b38b585a9250f6$exports = {};
var $5957c785af72aa1af7b38b585a9250f6$var$markdownLineEnding = $16cd0200e709bd24480331e751413c02$exports;
var $5957c785af72aa1af7b38b585a9250f6$var$codeText = {
  name: 'codeText',
  tokenize: $5957c785af72aa1af7b38b585a9250f6$var$tokenizeCodeText,
  resolve: $5957c785af72aa1af7b38b585a9250f6$var$resolveCodeText,
  previous: $5957c785af72aa1af7b38b585a9250f6$var$previous
};
function $5957c785af72aa1af7b38b585a9250f6$var$resolveCodeText(events) {
  var tailExitIndex = events.length - 4;
  var headEnterIndex = 3;
  var index;
  var enter;
  // If we start and end with an EOL or a space.
  if ((events[headEnterIndex][1].type === 'lineEnding' || events[headEnterIndex][1].type === 'space') && (events[tailExitIndex][1].type === 'lineEnding' || events[tailExitIndex][1].type === 'space')) {
    index = headEnterIndex;
    // And we have data.
    while (++index < tailExitIndex) {
      if (events[index][1].type === 'codeTextData') {
        // Then we have padding.
        events[tailExitIndex][1].type = events[headEnterIndex][1].type = 'codeTextPadding';
        headEnterIndex += 2;
        tailExitIndex -= 2;
        break;
      }
    }
  }
  // Merge adjacent spaces and data.
  index = headEnterIndex - 1;
  tailExitIndex++;
  while (++index <= tailExitIndex) {
    if (enter === undefined) {
      if (index !== tailExitIndex && events[index][1].type !== 'lineEnding') {
        enter = index;
      }
    } else if (index === tailExitIndex || events[index][1].type === 'lineEnding') {
      events[enter][1].type = 'codeTextData';
      if (index !== enter + 2) {
        events[enter][1].end = events[index - 1][1].end;
        events.splice(enter + 2, index - enter - 2);
        tailExitIndex -= index - enter - 2;
        index = enter + 2;
      }
      enter = undefined;
    }
  }
  return events;
}
function $5957c785af72aa1af7b38b585a9250f6$var$previous(code) {
  // If there is a previous code, there will always be a tail.
  return code !== 96 || this.events[this.events.length - 1][1].type === 'characterEscape';
}
function $5957c785af72aa1af7b38b585a9250f6$var$tokenizeCodeText(effects, ok, nok) {
  var sizeOpen = 0;
  var size;
  var token;
  return start;
  function start(code) {
    effects.enter('codeText');
    effects.enter('codeTextSequence');
    return openingSequence(code);
  }
  function openingSequence(code) {
    if (code === 96) {
      effects.consume(code);
      sizeOpen++;
      return openingSequence;
    }
    effects.exit('codeTextSequence');
    return gap(code);
  }
  function gap(code) {
    // EOF.
    if (code === null) {
      return nok(code);
    }
    // Closing fence?
    // Could also be data.
    if (code === 96) {
      token = effects.enter('codeTextSequence');
      size = 0;
      return closingSequence(code);
    }
    // Tabs don’t work, and virtual spaces don’t make sense.
    if (code === 32) {
      effects.enter('space');
      effects.consume(code);
      effects.exit('space');
      return gap;
    }
    if ($5957c785af72aa1af7b38b585a9250f6$var$markdownLineEnding(code)) {
      effects.enter('lineEnding');
      effects.consume(code);
      effects.exit('lineEnding');
      return gap;
    }
    // Data.
    effects.enter('codeTextData');
    return data(code);
  }
  // In code.
  function data(code) {
    if (code === null || code === 32 || code === 96 || $5957c785af72aa1af7b38b585a9250f6$var$markdownLineEnding(code)) {
      effects.exit('codeTextData');
      return gap(code);
    }
    effects.consume(code);
    return data;
  }
  // Closing fence.
  function closingSequence(code) {
    // More.
    if (code === 96) {
      effects.consume(code);
      size++;
      return closingSequence;
    }
    // Done!
    if (size === sizeOpen) {
      effects.exit('codeTextSequence');
      effects.exit('codeText');
      return ok(code);
    }
    // More or less accents: mark as data.
    token.type = 'codeTextData';
    return data(code);
  }
}
$5957c785af72aa1af7b38b585a9250f6$exports = $5957c785af72aa1af7b38b585a9250f6$var$codeText;
var $066ede785a42c642ad66be353fcdb5fa$var$codeText = $5957c785af72aa1af7b38b585a9250f6$exports;
// ASSET: node_modules/micromark/dist/tokenize/definition.js
var $2f31246482567808694b5232ac79cf14$exports = {};
var $2f31246482567808694b5232ac79cf14$var$markdownLineEnding = $16cd0200e709bd24480331e751413c02$exports;
var $2f31246482567808694b5232ac79cf14$var$markdownLineEndingOrSpace = $2197d3279e1964023d191737ef7bb821$exports;
var $2f31246482567808694b5232ac79cf14$var$normalizeIdentifier = $ed7f6b5091aaca076e74b5e9acb0e3e0$exports;
// ASSET: node_modules/micromark/dist/tokenize/factory-destination.js
var $c0413598b6ccff066ffda580a963fe4f$exports = {};
var $c0413598b6ccff066ffda580a963fe4f$var$asciiControl = $4bdaf3e1afe2b530971188f0e4ac0c5f$exports;
var $c0413598b6ccff066ffda580a963fe4f$var$markdownLineEndingOrSpace = $2197d3279e1964023d191737ef7bb821$exports;
var $c0413598b6ccff066ffda580a963fe4f$var$markdownLineEnding = $16cd0200e709bd24480331e751413c02$exports;
// eslint-disable-next-line max-params
function $c0413598b6ccff066ffda580a963fe4f$var$destinationFactory(effects, ok, nok, type, literalType, literalMarkerType, rawType, stringType, max) {
  var limit = max || Infinity;
  var balance = 0;
  return start;
  function start(code) {
    if (code === 60) {
      effects.enter(type);
      effects.enter(literalType);
      effects.enter(literalMarkerType);
      effects.consume(code);
      effects.exit(literalMarkerType);
      return destinationEnclosedBefore;
    }
    if ($c0413598b6ccff066ffda580a963fe4f$var$asciiControl(code) || code === 41) {
      return nok(code);
    }
    effects.enter(type);
    effects.enter(rawType);
    effects.enter(stringType);
    effects.enter('chunkString', {
      contentType: 'string'
    });
    return destinationRaw(code);
  }
  function destinationEnclosedBefore(code) {
    if (code === 62) {
      effects.enter(literalMarkerType);
      effects.consume(code);
      effects.exit(literalMarkerType);
      effects.exit(literalType);
      effects.exit(type);
      return ok;
    }
    effects.enter(stringType);
    effects.enter('chunkString', {
      contentType: 'string'
    });
    return destinationEnclosed(code);
  }
  function destinationEnclosed(code) {
    if (code === 62) {
      effects.exit('chunkString');
      effects.exit(stringType);
      return destinationEnclosedBefore(code);
    }
    if (code === null || code === 60 || $c0413598b6ccff066ffda580a963fe4f$var$markdownLineEnding(code)) {
      return nok(code);
    }
    effects.consume(code);
    return code === 92 ? destinationEnclosedEscape : destinationEnclosed;
  }
  function destinationEnclosedEscape(code) {
    if (code === 60 || code === 62 || code === 92) {
      effects.consume(code);
      return destinationEnclosed;
    }
    return destinationEnclosed(code);
  }
  function destinationRaw(code) {
    if (code === 40) {
      if (++balance > limit) return nok(code);
      effects.consume(code);
      return destinationRaw;
    }
    if (code === 41) {
      if (!balance--) {
        effects.exit('chunkString');
        effects.exit(stringType);
        effects.exit(rawType);
        effects.exit(type);
        return ok(code);
      }
      effects.consume(code);
      return destinationRaw;
    }
    if (code === null || $c0413598b6ccff066ffda580a963fe4f$var$markdownLineEndingOrSpace(code)) {
      if (balance) return nok(code);
      effects.exit('chunkString');
      effects.exit(stringType);
      effects.exit(rawType);
      effects.exit(type);
      return ok(code);
    }
    if ($c0413598b6ccff066ffda580a963fe4f$var$asciiControl(code)) return nok(code);
    effects.consume(code);
    return code === 92 ? destinationRawEscape : destinationRaw;
  }
  function destinationRawEscape(code) {
    if (code === 40 || code === 41 || code === 92) {
      effects.consume(code);
      return destinationRaw;
    }
    return destinationRaw(code);
  }
}
$c0413598b6ccff066ffda580a963fe4f$exports = $c0413598b6ccff066ffda580a963fe4f$var$destinationFactory;
var $2f31246482567808694b5232ac79cf14$var$factoryDestination = $c0413598b6ccff066ffda580a963fe4f$exports;
// ASSET: node_modules/micromark/dist/tokenize/factory-label.js
var $5373bd42e316b894efeba9b26b8bc40e$exports = {};
var $5373bd42e316b894efeba9b26b8bc40e$var$markdownLineEnding = $16cd0200e709bd24480331e751413c02$exports;
var $5373bd42e316b894efeba9b26b8bc40e$var$markdownSpace = $4087d4a7eda9d3422d8ed53862be000e$exports;
// eslint-disable-next-line max-params
function $5373bd42e316b894efeba9b26b8bc40e$var$labelFactory(effects, ok, nok, type, markerType, stringType) {
  var self = this;
  var size = 0;
  var data;
  return start;
  function start(code) {
    effects.enter(type);
    effects.enter(markerType);
    effects.consume(code);
    effects.exit(markerType);
    effects.enter(stringType);
    return atBreak;
  }
  function atBreak(code) {
    if (code === null || code === 91 || code === 93 && !data || /*c8 ignore next*/
    code === 94 && /*c8 ignore next*/
    !size && /*c8 ignore next*/
    ('_hiddenFootnoteSupport' in self.parser.constructs) || size > 999) {
      return nok(code);
    }
    if (code === 93) {
      effects.exit(stringType);
      effects.enter(markerType);
      effects.consume(code);
      effects.exit(markerType);
      effects.exit(type);
      return ok;
    }
    if ($5373bd42e316b894efeba9b26b8bc40e$var$markdownLineEnding(code)) {
      effects.enter('lineEnding');
      effects.consume(code);
      effects.exit('lineEnding');
      return atBreak;
    }
    effects.enter('chunkString', {
      contentType: 'string'
    });
    return label(code);
  }
  function label(code) {
    if (code === null || code === 91 || code === 93 || $5373bd42e316b894efeba9b26b8bc40e$var$markdownLineEnding(code) || size++ > 999) {
      effects.exit('chunkString');
      return atBreak(code);
    }
    effects.consume(code);
    data = data || !$5373bd42e316b894efeba9b26b8bc40e$var$markdownSpace(code);
    return code === 92 ? labelEscape : label;
  }
  function labelEscape(code) {
    if (code === 91 || code === 92 || code === 93) {
      effects.consume(code);
      size++;
      return label;
    }
    return label(code);
  }
}
$5373bd42e316b894efeba9b26b8bc40e$exports = $5373bd42e316b894efeba9b26b8bc40e$var$labelFactory;
var $2f31246482567808694b5232ac79cf14$var$factorySpace = $c9c5e694972b79db7836f58f99718475$exports;
// ASSET: node_modules/micromark/dist/tokenize/factory-whitespace.js
var $7a0b01e9a6edda76d5add01fa38ff351$exports = {};
var $7a0b01e9a6edda76d5add01fa38ff351$var$markdownLineEnding = $16cd0200e709bd24480331e751413c02$exports;
var $7a0b01e9a6edda76d5add01fa38ff351$var$markdownSpace = $4087d4a7eda9d3422d8ed53862be000e$exports;
var $7a0b01e9a6edda76d5add01fa38ff351$var$factorySpace = $c9c5e694972b79db7836f58f99718475$exports;
function $7a0b01e9a6edda76d5add01fa38ff351$var$whitespaceFactory(effects, ok) {
  var seen;
  return start;
  function start(code) {
    if ($7a0b01e9a6edda76d5add01fa38ff351$var$markdownLineEnding(code)) {
      effects.enter('lineEnding');
      effects.consume(code);
      effects.exit('lineEnding');
      seen = true;
      return start;
    }
    if ($7a0b01e9a6edda76d5add01fa38ff351$var$markdownSpace(code)) {
      return $7a0b01e9a6edda76d5add01fa38ff351$var$factorySpace(effects, start, seen ? 'linePrefix' : 'lineSuffix')(code);
    }
    return ok(code);
  }
}
$7a0b01e9a6edda76d5add01fa38ff351$exports = $7a0b01e9a6edda76d5add01fa38ff351$var$whitespaceFactory;
var $2f31246482567808694b5232ac79cf14$var$factoryWhitespace = $7a0b01e9a6edda76d5add01fa38ff351$exports;
// ASSET: node_modules/micromark/dist/tokenize/factory-title.js
var $8c6e5188d8e878aa51f0c2982436fda7$exports = {};
var $8c6e5188d8e878aa51f0c2982436fda7$var$markdownLineEnding = $16cd0200e709bd24480331e751413c02$exports;
var $8c6e5188d8e878aa51f0c2982436fda7$var$factorySpace = $c9c5e694972b79db7836f58f99718475$exports;
function $8c6e5188d8e878aa51f0c2982436fda7$var$titleFactory(effects, ok, nok, type, markerType, stringType) {
  var marker;
  return start;
  function start(code) {
    effects.enter(type);
    effects.enter(markerType);
    effects.consume(code);
    effects.exit(markerType);
    marker = code === 40 ? 41 : code;
    return atFirstTitleBreak;
  }
  function atFirstTitleBreak(code) {
    if (code === marker) {
      effects.enter(markerType);
      effects.consume(code);
      effects.exit(markerType);
      effects.exit(type);
      return ok;
    }
    effects.enter(stringType);
    return atTitleBreak(code);
  }
  function atTitleBreak(code) {
    if (code === marker) {
      effects.exit(stringType);
      return atFirstTitleBreak(marker);
    }
    if (code === null) {
      return nok(code);
    }
    // Note: blank lines can’t exist in content.
    if ($8c6e5188d8e878aa51f0c2982436fda7$var$markdownLineEnding(code)) {
      effects.enter('lineEnding');
      effects.consume(code);
      effects.exit('lineEnding');
      return $8c6e5188d8e878aa51f0c2982436fda7$var$factorySpace(effects, atTitleBreak, 'linePrefix');
    }
    effects.enter('chunkString', {
      contentType: 'string'
    });
    return title(code);
  }
  function title(code) {
    if (code === marker || code === null || $8c6e5188d8e878aa51f0c2982436fda7$var$markdownLineEnding(code)) {
      effects.exit('chunkString');
      return atTitleBreak(code);
    }
    effects.consume(code);
    return code === 92 ? titleEscape : title;
  }
  function titleEscape(code) {
    if (code === marker || code === 92) {
      effects.consume(code);
      return title;
    }
    return title(code);
  }
}
$8c6e5188d8e878aa51f0c2982436fda7$exports = $8c6e5188d8e878aa51f0c2982436fda7$var$titleFactory;
var $2f31246482567808694b5232ac79cf14$var$factoryTitle = $8c6e5188d8e878aa51f0c2982436fda7$exports;
var $2f31246482567808694b5232ac79cf14$var$definition = {
  name: 'definition',
  tokenize: $2f31246482567808694b5232ac79cf14$var$tokenizeDefinition
};
var $2f31246482567808694b5232ac79cf14$var$titleConstruct = {
  tokenize: $2f31246482567808694b5232ac79cf14$var$tokenizeTitle,
  partial: true
};
function $2f31246482567808694b5232ac79cf14$var$tokenizeDefinition(effects, ok, nok) {
  var self = this;
  var identifier;
  return start;
  function start(code) {
    effects.enter('definition');
    return $5373bd42e316b894efeba9b26b8bc40e$exports.call(self, effects, labelAfter, nok, 'definitionLabel', 'definitionLabelMarker', 'definitionLabelString')(code);
  }
  function labelAfter(code) {
    identifier = $2f31246482567808694b5232ac79cf14$var$normalizeIdentifier(self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1));
    if (code === 58) {
      effects.enter('definitionMarker');
      effects.consume(code);
      effects.exit('definitionMarker');
      // Note: blank lines can’t exist in content.
      return $2f31246482567808694b5232ac79cf14$var$factoryWhitespace(effects, $2f31246482567808694b5232ac79cf14$var$factoryDestination(effects, effects.attempt($2f31246482567808694b5232ac79cf14$var$titleConstruct, $2f31246482567808694b5232ac79cf14$var$factorySpace(effects, after, 'whitespace'), $2f31246482567808694b5232ac79cf14$var$factorySpace(effects, after, 'whitespace')), nok, 'definitionDestination', 'definitionDestinationLiteral', 'definitionDestinationLiteralMarker', 'definitionDestinationRaw', 'definitionDestinationString'));
    }
    return nok(code);
  }
  function after(code) {
    if (code === null || $2f31246482567808694b5232ac79cf14$var$markdownLineEnding(code)) {
      effects.exit('definition');
      if (self.parser.defined.indexOf(identifier) < 0) {
        self.parser.defined.push(identifier);
      }
      return ok(code);
    }
    return nok(code);
  }
}
function $2f31246482567808694b5232ac79cf14$var$tokenizeTitle(effects, ok, nok) {
  return start;
  function start(code) {
    return $2f31246482567808694b5232ac79cf14$var$markdownLineEndingOrSpace(code) ? $2f31246482567808694b5232ac79cf14$var$factoryWhitespace(effects, before)(code) : nok(code);
  }
  function before(code) {
    if (code === 34 || code === 39 || code === 40) {
      return $2f31246482567808694b5232ac79cf14$var$factoryTitle(effects, $2f31246482567808694b5232ac79cf14$var$factorySpace(effects, after, 'whitespace'), nok, 'definitionTitle', 'definitionTitleMarker', 'definitionTitleString')(code);
    }
    return nok(code);
  }
  function after(code) {
    return code === null || $2f31246482567808694b5232ac79cf14$var$markdownLineEnding(code) ? ok(code) : nok(code);
  }
}
$2f31246482567808694b5232ac79cf14$exports = $2f31246482567808694b5232ac79cf14$var$definition;
var $066ede785a42c642ad66be353fcdb5fa$var$definition = $2f31246482567808694b5232ac79cf14$exports;
// ASSET: node_modules/micromark/dist/tokenize/hard-break-escape.js
var $6a4e290342b9419c4d366f058b170dd9$exports = {};
var $6a4e290342b9419c4d366f058b170dd9$var$markdownLineEnding = $16cd0200e709bd24480331e751413c02$exports;
var $6a4e290342b9419c4d366f058b170dd9$var$hardBreakEscape = {
  name: 'hardBreakEscape',
  tokenize: $6a4e290342b9419c4d366f058b170dd9$var$tokenizeHardBreakEscape
};
function $6a4e290342b9419c4d366f058b170dd9$var$tokenizeHardBreakEscape(effects, ok, nok) {
  return start;
  function start(code) {
    effects.enter('hardBreakEscape');
    effects.enter('escapeMarker');
    effects.consume(code);
    return open;
  }
  function open(code) {
    if ($6a4e290342b9419c4d366f058b170dd9$var$markdownLineEnding(code)) {
      effects.exit('escapeMarker');
      effects.exit('hardBreakEscape');
      return ok(code);
    }
    return nok(code);
  }
}
$6a4e290342b9419c4d366f058b170dd9$exports = $6a4e290342b9419c4d366f058b170dd9$var$hardBreakEscape;
var $066ede785a42c642ad66be353fcdb5fa$var$hardBreakEscape = $6a4e290342b9419c4d366f058b170dd9$exports;
// ASSET: node_modules/micromark/dist/tokenize/heading-atx.js
var $ae579d04b6f50b9bf764e8fea2ad1656$exports = {};
var $ae579d04b6f50b9bf764e8fea2ad1656$var$markdownLineEnding = $16cd0200e709bd24480331e751413c02$exports;
var $ae579d04b6f50b9bf764e8fea2ad1656$var$markdownLineEndingOrSpace = $2197d3279e1964023d191737ef7bb821$exports;
var $ae579d04b6f50b9bf764e8fea2ad1656$var$markdownSpace = $4087d4a7eda9d3422d8ed53862be000e$exports;
var $ae579d04b6f50b9bf764e8fea2ad1656$var$chunkedSplice = $fe4e196242a629dfc7f8aaa44ed4e7a0$exports;
var $ae579d04b6f50b9bf764e8fea2ad1656$var$factorySpace = $c9c5e694972b79db7836f58f99718475$exports;
var $ae579d04b6f50b9bf764e8fea2ad1656$var$headingAtx = {
  name: 'headingAtx',
  tokenize: $ae579d04b6f50b9bf764e8fea2ad1656$var$tokenizeHeadingAtx,
  resolve: $ae579d04b6f50b9bf764e8fea2ad1656$var$resolveHeadingAtx
};
function $ae579d04b6f50b9bf764e8fea2ad1656$var$resolveHeadingAtx(events, context) {
  var contentEnd = events.length - 2;
  var contentStart = 3;
  var content;
  var text;
  // Prefix whitespace, part of the opening.
  if (events[contentStart][1].type === 'whitespace') {
    contentStart += 2;
  }
  // Suffix whitespace, part of the closing.
  if (contentEnd - 2 > contentStart && events[contentEnd][1].type === 'whitespace') {
    contentEnd -= 2;
  }
  if (events[contentEnd][1].type === 'atxHeadingSequence' && (contentStart === contentEnd - 1 || contentEnd - 4 > contentStart && events[contentEnd - 2][1].type === 'whitespace')) {
    contentEnd -= contentStart + 1 === contentEnd ? 2 : 4;
  }
  if (contentEnd > contentStart) {
    content = {
      type: 'atxHeadingText',
      start: events[contentStart][1].start,
      end: events[contentEnd][1].end
    };
    text = {
      type: 'chunkText',
      start: events[contentStart][1].start,
      end: events[contentEnd][1].end,
      contentType: 'text'
    };
    $ae579d04b6f50b9bf764e8fea2ad1656$var$chunkedSplice(events, contentStart, contentEnd - contentStart + 1, [['enter', content, context], ['enter', text, context], ['exit', text, context], ['exit', content, context]]);
  }
  return events;
}
function $ae579d04b6f50b9bf764e8fea2ad1656$var$tokenizeHeadingAtx(effects, ok, nok) {
  var self = this;
  var size = 0;
  return start;
  function start(code) {
    effects.enter('atxHeading');
    effects.enter('atxHeadingSequence');
    return fenceOpenInside(code);
  }
  function fenceOpenInside(code) {
    if (code === 35 && size++ < 6) {
      effects.consume(code);
      return fenceOpenInside;
    }
    if (code === null || $ae579d04b6f50b9bf764e8fea2ad1656$var$markdownLineEndingOrSpace(code)) {
      effects.exit('atxHeadingSequence');
      return self.interrupt ? ok(code) : headingBreak(code);
    }
    return nok(code);
  }
  function headingBreak(code) {
    if (code === 35) {
      effects.enter('atxHeadingSequence');
      return sequence(code);
    }
    if (code === null || $ae579d04b6f50b9bf764e8fea2ad1656$var$markdownLineEnding(code)) {
      effects.exit('atxHeading');
      return ok(code);
    }
    if ($ae579d04b6f50b9bf764e8fea2ad1656$var$markdownSpace(code)) {
      return $ae579d04b6f50b9bf764e8fea2ad1656$var$factorySpace(effects, headingBreak, 'whitespace')(code);
    }
    effects.enter('atxHeadingText');
    return data(code);
  }
  function sequence(code) {
    if (code === 35) {
      effects.consume(code);
      return sequence;
    }
    effects.exit('atxHeadingSequence');
    return headingBreak(code);
  }
  function data(code) {
    if (code === null || code === 35 || $ae579d04b6f50b9bf764e8fea2ad1656$var$markdownLineEndingOrSpace(code)) {
      effects.exit('atxHeadingText');
      return headingBreak(code);
    }
    effects.consume(code);
    return data;
  }
}
$ae579d04b6f50b9bf764e8fea2ad1656$exports = $ae579d04b6f50b9bf764e8fea2ad1656$var$headingAtx;
var $066ede785a42c642ad66be353fcdb5fa$var$headingAtx = $ae579d04b6f50b9bf764e8fea2ad1656$exports;
// ASSET: node_modules/micromark/dist/tokenize/html-flow.js
var $ea9d182e63cc4cfb9e01f9824759be81$exports = {};
var $ea9d182e63cc4cfb9e01f9824759be81$var$asciiAlpha = $ccca3f3703525404049a304ea07fd1c7$exports;
var $ea9d182e63cc4cfb9e01f9824759be81$var$asciiAlphanumeric = $a2fcc652963823cf472ce7707e2000bf$exports;
var $ea9d182e63cc4cfb9e01f9824759be81$var$markdownLineEnding = $16cd0200e709bd24480331e751413c02$exports;
var $ea9d182e63cc4cfb9e01f9824759be81$var$markdownLineEndingOrSpace = $2197d3279e1964023d191737ef7bb821$exports;
var $ea9d182e63cc4cfb9e01f9824759be81$var$markdownSpace = $4087d4a7eda9d3422d8ed53862be000e$exports;
var $ea9d182e63cc4cfb9e01f9824759be81$var$fromCharCode = $f8f98e619426b02ca259c6c84ae288cd$exports;
// ASSET: node_modules/micromark/dist/constant/html-block-names.js
var $83726655a22438c44194ff200d820a08$exports = {};
// This module is copied from <https://spec.commonmark.org/0.29/#html-blocks>.
var $83726655a22438c44194ff200d820a08$var$basics = ['address', 'article', 'aside', 'base', 'basefont', 'blockquote', 'body', 'caption', 'center', 'col', 'colgroup', 'dd', 'details', 'dialog', 'dir', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html', 'iframe', 'legend', 'li', 'link', 'main', 'menu', 'menuitem', 'nav', 'noframes', 'ol', 'optgroup', 'option', 'p', 'param', 'section', 'source', 'summary', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'title', 'tr', 'track', 'ul'];
$83726655a22438c44194ff200d820a08$exports = $83726655a22438c44194ff200d820a08$var$basics;
// ASSET: node_modules/micromark/dist/constant/html-raw-names.js
var $7c9fd2ee5a571b3429860a31cdff8d2d$exports = {};
// This module is copied from <https://spec.commonmark.org/0.29/#html-blocks>.
var $7c9fd2ee5a571b3429860a31cdff8d2d$var$raws = ['pre', 'script', 'style', 'textarea'];
$7c9fd2ee5a571b3429860a31cdff8d2d$exports = $7c9fd2ee5a571b3429860a31cdff8d2d$var$raws;
var $ea9d182e63cc4cfb9e01f9824759be81$var$partialBlankLine = $ebf3f90d1535e837678aaa6daf0871a4$exports;
var $ea9d182e63cc4cfb9e01f9824759be81$var$htmlFlow = {
  name: 'htmlFlow',
  tokenize: $ea9d182e63cc4cfb9e01f9824759be81$var$tokenizeHtmlFlow,
  resolveTo: $ea9d182e63cc4cfb9e01f9824759be81$var$resolveToHtmlFlow,
  concrete: true
};
var $ea9d182e63cc4cfb9e01f9824759be81$var$nextBlankConstruct = {
  tokenize: $ea9d182e63cc4cfb9e01f9824759be81$var$tokenizeNextBlank,
  partial: true
};
function $ea9d182e63cc4cfb9e01f9824759be81$var$resolveToHtmlFlow(events) {
  var index = events.length;
  while (index--) {
    if (events[index][0] === 'enter' && events[index][1].type === 'htmlFlow') {
      break;
    }
  }
  if (index > 1 && events[index - 2][1].type === 'linePrefix') {
    // Add the prefix start to the HTML token.
    events[index][1].start = events[index - 2][1].start;
    // Add the prefix start to the HTML line token.
    events[index + 1][1].start = events[index - 2][1].start;
    // Remove the line prefix.
    events.splice(index - 2, 2);
  }
  return events;
}
function $ea9d182e63cc4cfb9e01f9824759be81$var$tokenizeHtmlFlow(effects, ok, nok) {
  var self = this;
  var kind;
  var startTag;
  var buffer;
  var index;
  var marker;
  return start;
  function start(code) {
    effects.enter('htmlFlow');
    effects.enter('htmlFlowData');
    effects.consume(code);
    return open;
  }
  function open(code) {
    if (code === 33) {
      effects.consume(code);
      return declarationStart;
    }
    if (code === 47) {
      effects.consume(code);
      return tagCloseStart;
    }
    if (code === 63) {
      effects.consume(code);
      kind = 3;
      // While we’re in an instruction instead of a declaration, we’re on a `?`
      // right now, so we do need to search for `>`, similar to declarations.
      return self.interrupt ? ok : continuationDeclarationInside;
    }
    if ($ea9d182e63cc4cfb9e01f9824759be81$var$asciiAlpha(code)) {
      effects.consume(code);
      buffer = $ea9d182e63cc4cfb9e01f9824759be81$var$fromCharCode(code);
      startTag = true;
      return tagName;
    }
    return nok(code);
  }
  function declarationStart(code) {
    if (code === 45) {
      effects.consume(code);
      kind = 2;
      return commentOpenInside;
    }
    if (code === 91) {
      effects.consume(code);
      kind = 5;
      buffer = 'CDATA[';
      index = 0;
      return cdataOpenInside;
    }
    if ($ea9d182e63cc4cfb9e01f9824759be81$var$asciiAlpha(code)) {
      effects.consume(code);
      kind = 4;
      return self.interrupt ? ok : continuationDeclarationInside;
    }
    return nok(code);
  }
  function commentOpenInside(code) {
    if (code === 45) {
      effects.consume(code);
      return self.interrupt ? ok : continuationDeclarationInside;
    }
    return nok(code);
  }
  function cdataOpenInside(code) {
    if (code === buffer.charCodeAt(index++)) {
      effects.consume(code);
      return index === buffer.length ? self.interrupt ? ok : continuation : cdataOpenInside;
    }
    return nok(code);
  }
  function tagCloseStart(code) {
    if ($ea9d182e63cc4cfb9e01f9824759be81$var$asciiAlpha(code)) {
      effects.consume(code);
      buffer = $ea9d182e63cc4cfb9e01f9824759be81$var$fromCharCode(code);
      return tagName;
    }
    return nok(code);
  }
  function tagName(code) {
    if (code === null || code === 47 || code === 62 || $ea9d182e63cc4cfb9e01f9824759be81$var$markdownLineEndingOrSpace(code)) {
      if (code !== 47 && startTag && $7c9fd2ee5a571b3429860a31cdff8d2d$exports.indexOf(buffer.toLowerCase()) > -1) {
        kind = 1;
        return self.interrupt ? ok(code) : continuation(code);
      }
      if ($83726655a22438c44194ff200d820a08$exports.indexOf(buffer.toLowerCase()) > -1) {
        kind = 6;
        if (code === 47) {
          effects.consume(code);
          return basicSelfClosing;
        }
        return self.interrupt ? ok(code) : continuation(code);
      }
      kind = 7;
      // Do not support complete HTML when interrupting.
      return self.interrupt ? nok(code) : startTag ? completeAttributeNameBefore(code) : completeClosingTagAfter(code);
    }
    if (code === 45 || $ea9d182e63cc4cfb9e01f9824759be81$var$asciiAlphanumeric(code)) {
      effects.consume(code);
      buffer += $ea9d182e63cc4cfb9e01f9824759be81$var$fromCharCode(code);
      return tagName;
    }
    return nok(code);
  }
  function basicSelfClosing(code) {
    if (code === 62) {
      effects.consume(code);
      return self.interrupt ? ok : continuation;
    }
    return nok(code);
  }
  function completeClosingTagAfter(code) {
    if ($ea9d182e63cc4cfb9e01f9824759be81$var$markdownSpace(code)) {
      effects.consume(code);
      return completeClosingTagAfter;
    }
    return completeEnd(code);
  }
  function completeAttributeNameBefore(code) {
    if (code === 47) {
      effects.consume(code);
      return completeEnd;
    }
    if (code === 58 || code === 95 || $ea9d182e63cc4cfb9e01f9824759be81$var$asciiAlpha(code)) {
      effects.consume(code);
      return completeAttributeName;
    }
    if ($ea9d182e63cc4cfb9e01f9824759be81$var$markdownSpace(code)) {
      effects.consume(code);
      return completeAttributeNameBefore;
    }
    return completeEnd(code);
  }
  function completeAttributeName(code) {
    if (code === 45 || code === 46 || code === 58 || code === 95 || $ea9d182e63cc4cfb9e01f9824759be81$var$asciiAlphanumeric(code)) {
      effects.consume(code);
      return completeAttributeName;
    }
    return completeAttributeNameAfter(code);
  }
  function completeAttributeNameAfter(code) {
    if (code === 61) {
      effects.consume(code);
      return completeAttributeValueBefore;
    }
    if ($ea9d182e63cc4cfb9e01f9824759be81$var$markdownSpace(code)) {
      effects.consume(code);
      return completeAttributeNameAfter;
    }
    return completeAttributeNameBefore(code);
  }
  function completeAttributeValueBefore(code) {
    if (code === null || code === 60 || code === 61 || code === 62 || code === 96) {
      return nok(code);
    }
    if (code === 34 || code === 39) {
      effects.consume(code);
      marker = code;
      return completeAttributeValueQuoted;
    }
    if ($ea9d182e63cc4cfb9e01f9824759be81$var$markdownSpace(code)) {
      effects.consume(code);
      return completeAttributeValueBefore;
    }
    marker = undefined;
    return completeAttributeValueUnquoted(code);
  }
  function completeAttributeValueQuoted(code) {
    if (code === marker) {
      effects.consume(code);
      return completeAttributeValueQuotedAfter;
    }
    if (code === null || $ea9d182e63cc4cfb9e01f9824759be81$var$markdownLineEnding(code)) {
      return nok(code);
    }
    effects.consume(code);
    return completeAttributeValueQuoted;
  }
  function completeAttributeValueUnquoted(code) {
    if (code === null || code === 34 || code === 39 || code === 60 || code === 61 || code === 62 || code === 96 || $ea9d182e63cc4cfb9e01f9824759be81$var$markdownLineEndingOrSpace(code)) {
      return completeAttributeNameAfter(code);
    }
    effects.consume(code);
    return completeAttributeValueUnquoted;
  }
  function completeAttributeValueQuotedAfter(code) {
    if (code === 47 || code === 62 || $ea9d182e63cc4cfb9e01f9824759be81$var$markdownSpace(code)) {
      return completeAttributeNameBefore(code);
    }
    return nok(code);
  }
  function completeEnd(code) {
    if (code === 62) {
      effects.consume(code);
      return completeAfter;
    }
    return nok(code);
  }
  function completeAfter(code) {
    if ($ea9d182e63cc4cfb9e01f9824759be81$var$markdownSpace(code)) {
      effects.consume(code);
      return completeAfter;
    }
    return code === null || $ea9d182e63cc4cfb9e01f9824759be81$var$markdownLineEnding(code) ? continuation(code) : nok(code);
  }
  function continuation(code) {
    if (code === 45 && kind === 2) {
      effects.consume(code);
      return continuationCommentInside;
    }
    if (code === 60 && kind === 1) {
      effects.consume(code);
      return continuationRawTagOpen;
    }
    if (code === 62 && kind === 4) {
      effects.consume(code);
      return continuationClose;
    }
    if (code === 63 && kind === 3) {
      effects.consume(code);
      return continuationDeclarationInside;
    }
    if (code === 93 && kind === 5) {
      effects.consume(code);
      return continuationCharacterDataInside;
    }
    if ($ea9d182e63cc4cfb9e01f9824759be81$var$markdownLineEnding(code) && (kind === 6 || kind === 7)) {
      return effects.check($ea9d182e63cc4cfb9e01f9824759be81$var$nextBlankConstruct, continuationClose, continuationAtLineEnding)(code);
    }
    if (code === null || $ea9d182e63cc4cfb9e01f9824759be81$var$markdownLineEnding(code)) {
      return continuationAtLineEnding(code);
    }
    effects.consume(code);
    return continuation;
  }
  function continuationAtLineEnding(code) {
    effects.exit('htmlFlowData');
    return htmlContinueStart(code);
  }
  function htmlContinueStart(code) {
    if (code === null) {
      return done(code);
    }
    if ($ea9d182e63cc4cfb9e01f9824759be81$var$markdownLineEnding(code)) {
      effects.enter('lineEnding');
      effects.consume(code);
      effects.exit('lineEnding');
      return htmlContinueStart;
    }
    effects.enter('htmlFlowData');
    return continuation(code);
  }
  function continuationCommentInside(code) {
    if (code === 45) {
      effects.consume(code);
      return continuationDeclarationInside;
    }
    return continuation(code);
  }
  function continuationRawTagOpen(code) {
    if (code === 47) {
      effects.consume(code);
      buffer = '';
      return continuationRawEndTag;
    }
    return continuation(code);
  }
  function continuationRawEndTag(code) {
    if (code === 62 && $7c9fd2ee5a571b3429860a31cdff8d2d$exports.indexOf(buffer.toLowerCase()) > -1) {
      effects.consume(code);
      return continuationClose;
    }
    if ($ea9d182e63cc4cfb9e01f9824759be81$var$asciiAlpha(code) && buffer.length < 8) {
      effects.consume(code);
      buffer += $ea9d182e63cc4cfb9e01f9824759be81$var$fromCharCode(code);
      return continuationRawEndTag;
    }
    return continuation(code);
  }
  function continuationCharacterDataInside(code) {
    if (code === 93) {
      effects.consume(code);
      return continuationDeclarationInside;
    }
    return continuation(code);
  }
  function continuationDeclarationInside(code) {
    if (code === 62) {
      effects.consume(code);
      return continuationClose;
    }
    return continuation(code);
  }
  function continuationClose(code) {
    if (code === null || $ea9d182e63cc4cfb9e01f9824759be81$var$markdownLineEnding(code)) {
      effects.exit('htmlFlowData');
      return done(code);
    }
    effects.consume(code);
    return continuationClose;
  }
  function done(code) {
    effects.exit('htmlFlow');
    return ok(code);
  }
}
function $ea9d182e63cc4cfb9e01f9824759be81$var$tokenizeNextBlank(effects, ok, nok) {
  return start;
  function start(code) {
    effects.exit('htmlFlowData');
    effects.enter('lineEndingBlank');
    effects.consume(code);
    effects.exit('lineEndingBlank');
    return effects.attempt($ea9d182e63cc4cfb9e01f9824759be81$var$partialBlankLine, ok, nok);
  }
}
$ea9d182e63cc4cfb9e01f9824759be81$exports = $ea9d182e63cc4cfb9e01f9824759be81$var$htmlFlow;
var $066ede785a42c642ad66be353fcdb5fa$var$htmlFlow = $ea9d182e63cc4cfb9e01f9824759be81$exports;
// ASSET: node_modules/micromark/dist/tokenize/html-text.js
var $92ecb9e2a292f96f6840fac5a77a1df4$exports = {};
var $92ecb9e2a292f96f6840fac5a77a1df4$var$asciiAlpha = $ccca3f3703525404049a304ea07fd1c7$exports;
var $92ecb9e2a292f96f6840fac5a77a1df4$var$asciiAlphanumeric = $a2fcc652963823cf472ce7707e2000bf$exports;
var $92ecb9e2a292f96f6840fac5a77a1df4$var$markdownLineEnding = $16cd0200e709bd24480331e751413c02$exports;
var $92ecb9e2a292f96f6840fac5a77a1df4$var$markdownLineEndingOrSpace = $2197d3279e1964023d191737ef7bb821$exports;
var $92ecb9e2a292f96f6840fac5a77a1df4$var$markdownSpace = $4087d4a7eda9d3422d8ed53862be000e$exports;
var $92ecb9e2a292f96f6840fac5a77a1df4$var$factorySpace = $c9c5e694972b79db7836f58f99718475$exports;
var $92ecb9e2a292f96f6840fac5a77a1df4$var$htmlText = {
  name: 'htmlText',
  tokenize: $92ecb9e2a292f96f6840fac5a77a1df4$var$tokenizeHtmlText
};
function $92ecb9e2a292f96f6840fac5a77a1df4$var$tokenizeHtmlText(effects, ok, nok) {
  var self = this;
  var marker;
  var buffer;
  var index;
  var returnState;
  return start;
  function start(code) {
    effects.enter('htmlText');
    effects.enter('htmlTextData');
    effects.consume(code);
    return open;
  }
  function open(code) {
    if (code === 33) {
      effects.consume(code);
      return declarationOpen;
    }
    if (code === 47) {
      effects.consume(code);
      return tagCloseStart;
    }
    if (code === 63) {
      effects.consume(code);
      return instruction;
    }
    if ($92ecb9e2a292f96f6840fac5a77a1df4$var$asciiAlpha(code)) {
      effects.consume(code);
      return tagOpen;
    }
    return nok(code);
  }
  function declarationOpen(code) {
    if (code === 45) {
      effects.consume(code);
      return commentOpen;
    }
    if (code === 91) {
      effects.consume(code);
      buffer = 'CDATA[';
      index = 0;
      return cdataOpen;
    }
    if ($92ecb9e2a292f96f6840fac5a77a1df4$var$asciiAlpha(code)) {
      effects.consume(code);
      return declaration;
    }
    return nok(code);
  }
  function commentOpen(code) {
    if (code === 45) {
      effects.consume(code);
      return commentStart;
    }
    return nok(code);
  }
  function commentStart(code) {
    if (code === null || code === 62) {
      return nok(code);
    }
    if (code === 45) {
      effects.consume(code);
      return commentStartDash;
    }
    return comment(code);
  }
  function commentStartDash(code) {
    if (code === null || code === 62) {
      return nok(code);
    }
    return comment(code);
  }
  function comment(code) {
    if (code === null) {
      return nok(code);
    }
    if (code === 45) {
      effects.consume(code);
      return commentClose;
    }
    if ($92ecb9e2a292f96f6840fac5a77a1df4$var$markdownLineEnding(code)) {
      returnState = comment;
      return atLineEnding(code);
    }
    effects.consume(code);
    return comment;
  }
  function commentClose(code) {
    if (code === 45) {
      effects.consume(code);
      return end;
    }
    return comment(code);
  }
  function cdataOpen(code) {
    if (code === buffer.charCodeAt(index++)) {
      effects.consume(code);
      return index === buffer.length ? cdata : cdataOpen;
    }
    return nok(code);
  }
  function cdata(code) {
    if (code === null) {
      return nok(code);
    }
    if (code === 93) {
      effects.consume(code);
      return cdataClose;
    }
    if ($92ecb9e2a292f96f6840fac5a77a1df4$var$markdownLineEnding(code)) {
      returnState = cdata;
      return atLineEnding(code);
    }
    effects.consume(code);
    return cdata;
  }
  function cdataClose(code) {
    if (code === 93) {
      effects.consume(code);
      return cdataEnd;
    }
    return cdata(code);
  }
  function cdataEnd(code) {
    if (code === 62) {
      return end(code);
    }
    if (code === 93) {
      effects.consume(code);
      return cdataEnd;
    }
    return cdata(code);
  }
  function declaration(code) {
    if (code === null || code === 62) {
      return end(code);
    }
    if ($92ecb9e2a292f96f6840fac5a77a1df4$var$markdownLineEnding(code)) {
      returnState = declaration;
      return atLineEnding(code);
    }
    effects.consume(code);
    return declaration;
  }
  function instruction(code) {
    if (code === null) {
      return nok(code);
    }
    if (code === 63) {
      effects.consume(code);
      return instructionClose;
    }
    if ($92ecb9e2a292f96f6840fac5a77a1df4$var$markdownLineEnding(code)) {
      returnState = instruction;
      return atLineEnding(code);
    }
    effects.consume(code);
    return instruction;
  }
  function instructionClose(code) {
    return code === 62 ? end(code) : instruction(code);
  }
  function tagCloseStart(code) {
    if ($92ecb9e2a292f96f6840fac5a77a1df4$var$asciiAlpha(code)) {
      effects.consume(code);
      return tagClose;
    }
    return nok(code);
  }
  function tagClose(code) {
    if (code === 45 || $92ecb9e2a292f96f6840fac5a77a1df4$var$asciiAlphanumeric(code)) {
      effects.consume(code);
      return tagClose;
    }
    return tagCloseBetween(code);
  }
  function tagCloseBetween(code) {
    if ($92ecb9e2a292f96f6840fac5a77a1df4$var$markdownLineEnding(code)) {
      returnState = tagCloseBetween;
      return atLineEnding(code);
    }
    if ($92ecb9e2a292f96f6840fac5a77a1df4$var$markdownSpace(code)) {
      effects.consume(code);
      return tagCloseBetween;
    }
    return end(code);
  }
  function tagOpen(code) {
    if (code === 45 || $92ecb9e2a292f96f6840fac5a77a1df4$var$asciiAlphanumeric(code)) {
      effects.consume(code);
      return tagOpen;
    }
    if (code === 47 || code === 62 || $92ecb9e2a292f96f6840fac5a77a1df4$var$markdownLineEndingOrSpace(code)) {
      return tagOpenBetween(code);
    }
    return nok(code);
  }
  function tagOpenBetween(code) {
    if (code === 47) {
      effects.consume(code);
      return end;
    }
    if (code === 58 || code === 95 || $92ecb9e2a292f96f6840fac5a77a1df4$var$asciiAlpha(code)) {
      effects.consume(code);
      return tagOpenAttributeName;
    }
    if ($92ecb9e2a292f96f6840fac5a77a1df4$var$markdownLineEnding(code)) {
      returnState = tagOpenBetween;
      return atLineEnding(code);
    }
    if ($92ecb9e2a292f96f6840fac5a77a1df4$var$markdownSpace(code)) {
      effects.consume(code);
      return tagOpenBetween;
    }
    return end(code);
  }
  function tagOpenAttributeName(code) {
    if (code === 45 || code === 46 || code === 58 || code === 95 || $92ecb9e2a292f96f6840fac5a77a1df4$var$asciiAlphanumeric(code)) {
      effects.consume(code);
      return tagOpenAttributeName;
    }
    return tagOpenAttributeNameAfter(code);
  }
  function tagOpenAttributeNameAfter(code) {
    if (code === 61) {
      effects.consume(code);
      return tagOpenAttributeValueBefore;
    }
    if ($92ecb9e2a292f96f6840fac5a77a1df4$var$markdownLineEnding(code)) {
      returnState = tagOpenAttributeNameAfter;
      return atLineEnding(code);
    }
    if ($92ecb9e2a292f96f6840fac5a77a1df4$var$markdownSpace(code)) {
      effects.consume(code);
      return tagOpenAttributeNameAfter;
    }
    return tagOpenBetween(code);
  }
  function tagOpenAttributeValueBefore(code) {
    if (code === null || code === 60 || code === 61 || code === 62 || code === 96) {
      return nok(code);
    }
    if (code === 34 || code === 39) {
      effects.consume(code);
      marker = code;
      return tagOpenAttributeValueQuoted;
    }
    if ($92ecb9e2a292f96f6840fac5a77a1df4$var$markdownLineEnding(code)) {
      returnState = tagOpenAttributeValueBefore;
      return atLineEnding(code);
    }
    if ($92ecb9e2a292f96f6840fac5a77a1df4$var$markdownSpace(code)) {
      effects.consume(code);
      return tagOpenAttributeValueBefore;
    }
    effects.consume(code);
    marker = undefined;
    return tagOpenAttributeValueUnquoted;
  }
  function tagOpenAttributeValueQuoted(code) {
    if (code === marker) {
      effects.consume(code);
      return tagOpenAttributeValueQuotedAfter;
    }
    if (code === null) {
      return nok(code);
    }
    if ($92ecb9e2a292f96f6840fac5a77a1df4$var$markdownLineEnding(code)) {
      returnState = tagOpenAttributeValueQuoted;
      return atLineEnding(code);
    }
    effects.consume(code);
    return tagOpenAttributeValueQuoted;
  }
  function tagOpenAttributeValueQuotedAfter(code) {
    if (code === 62 || code === 47 || $92ecb9e2a292f96f6840fac5a77a1df4$var$markdownLineEndingOrSpace(code)) {
      return tagOpenBetween(code);
    }
    return nok(code);
  }
  function tagOpenAttributeValueUnquoted(code) {
    if (code === null || code === 34 || code === 39 || code === 60 || code === 61 || code === 96) {
      return nok(code);
    }
    if (code === 62 || $92ecb9e2a292f96f6840fac5a77a1df4$var$markdownLineEndingOrSpace(code)) {
      return tagOpenBetween(code);
    }
    effects.consume(code);
    return tagOpenAttributeValueUnquoted;
  }
  // We can’t have blank lines in content, so no need to worry about empty
  // tokens.
  function atLineEnding(code) {
    effects.exit('htmlTextData');
    effects.enter('lineEnding');
    effects.consume(code);
    effects.exit('lineEnding');
    return $92ecb9e2a292f96f6840fac5a77a1df4$var$factorySpace(effects, afterPrefix, 'linePrefix', self.parser.constructs.disable.null.indexOf('codeIndented') > -1 ? undefined : 4);
  }
  function afterPrefix(code) {
    effects.enter('htmlTextData');
    return returnState(code);
  }
  function end(code) {
    if (code === 62) {
      effects.consume(code);
      effects.exit('htmlTextData');
      effects.exit('htmlText');
      return ok;
    }
    return nok(code);
  }
}
$92ecb9e2a292f96f6840fac5a77a1df4$exports = $92ecb9e2a292f96f6840fac5a77a1df4$var$htmlText;
var $066ede785a42c642ad66be353fcdb5fa$var$htmlText = $92ecb9e2a292f96f6840fac5a77a1df4$exports;
// ASSET: node_modules/micromark/dist/tokenize/label-end.js
var $24065e2676945debdca13ae9439cbbb1$exports = {};
var $24065e2676945debdca13ae9439cbbb1$var$markdownLineEndingOrSpace = $2197d3279e1964023d191737ef7bb821$exports;
var $24065e2676945debdca13ae9439cbbb1$var$chunkedPush = $7d107b44ba7ea3f042c4834864b803d4$exports;
var $24065e2676945debdca13ae9439cbbb1$var$chunkedSplice = $fe4e196242a629dfc7f8aaa44ed4e7a0$exports;
var $24065e2676945debdca13ae9439cbbb1$var$normalizeIdentifier = $ed7f6b5091aaca076e74b5e9acb0e3e0$exports;
var $24065e2676945debdca13ae9439cbbb1$var$resolveAll = $42ca53f135e913d4482f8287477c6404$exports;
var $24065e2676945debdca13ae9439cbbb1$var$shallow = $541289fbe4aa92ce2fc0b3f29311bcb8$exports;
var $24065e2676945debdca13ae9439cbbb1$var$factoryDestination = $c0413598b6ccff066ffda580a963fe4f$exports;
var $24065e2676945debdca13ae9439cbbb1$var$factoryTitle = $8c6e5188d8e878aa51f0c2982436fda7$exports;
var $24065e2676945debdca13ae9439cbbb1$var$factoryWhitespace = $7a0b01e9a6edda76d5add01fa38ff351$exports;
var $24065e2676945debdca13ae9439cbbb1$var$labelEnd = {
  name: 'labelEnd',
  tokenize: $24065e2676945debdca13ae9439cbbb1$var$tokenizeLabelEnd,
  resolveTo: $24065e2676945debdca13ae9439cbbb1$var$resolveToLabelEnd,
  resolveAll: $24065e2676945debdca13ae9439cbbb1$var$resolveAllLabelEnd
};
var $24065e2676945debdca13ae9439cbbb1$var$resourceConstruct = {
  tokenize: $24065e2676945debdca13ae9439cbbb1$var$tokenizeResource
};
var $24065e2676945debdca13ae9439cbbb1$var$fullReferenceConstruct = {
  tokenize: $24065e2676945debdca13ae9439cbbb1$var$tokenizeFullReference
};
var $24065e2676945debdca13ae9439cbbb1$var$collapsedReferenceConstruct = {
  tokenize: $24065e2676945debdca13ae9439cbbb1$var$tokenizeCollapsedReference
};
function $24065e2676945debdca13ae9439cbbb1$var$resolveAllLabelEnd(events) {
  var index = -1;
  var token;
  while (++index < events.length) {
    token = events[index][1];
    if (!token._used && (token.type === 'labelImage' || token.type === 'labelLink' || token.type === 'labelEnd')) {
      // Remove the marker.
      events.splice(index + 1, token.type === 'labelImage' ? 4 : 2);
      token.type = 'data';
      index++;
    }
  }
  return events;
}
function $24065e2676945debdca13ae9439cbbb1$var$resolveToLabelEnd(events, context) {
  var index = events.length;
  var offset = 0;
  var group;
  var label;
  var text;
  var token;
  var open;
  var close;
  var media;
  // Find an opening.
  while (index--) {
    token = events[index][1];
    if (open) {
      // If we see another link, or inactive link label, we’ve been here before.
      if (token.type === 'link' || token.type === 'labelLink' && token._inactive) {
        break;
      }
      // Mark other link openings as inactive, as we can’t have links in
      // links.
      if (events[index][0] === 'enter' && token.type === 'labelLink') {
        token._inactive = true;
      }
    } else if (close) {
      if (events[index][0] === 'enter' && (token.type === 'labelImage' || token.type === 'labelLink') && !token._balanced) {
        open = index;
        if (token.type !== 'labelLink') {
          offset = 2;
          break;
        }
      }
    } else if (token.type === 'labelEnd') {
      close = index;
    }
  }
  group = {
    type: events[open][1].type === 'labelLink' ? 'link' : 'image',
    start: $24065e2676945debdca13ae9439cbbb1$var$shallow(events[open][1].start),
    end: $24065e2676945debdca13ae9439cbbb1$var$shallow(events[events.length - 1][1].end)
  };
  label = {
    type: 'label',
    start: $24065e2676945debdca13ae9439cbbb1$var$shallow(events[open][1].start),
    end: $24065e2676945debdca13ae9439cbbb1$var$shallow(events[close][1].end)
  };
  text = {
    type: 'labelText',
    start: $24065e2676945debdca13ae9439cbbb1$var$shallow(events[open + offset + 2][1].end),
    end: $24065e2676945debdca13ae9439cbbb1$var$shallow(events[close - 2][1].start)
  };
  media = [['enter', group, context], ['enter', label, context]];
  // Opening marker.
  media = $24065e2676945debdca13ae9439cbbb1$var$chunkedPush(media, events.slice(open + 1, open + offset + 3));
  // Text open.
  media = $24065e2676945debdca13ae9439cbbb1$var$chunkedPush(media, [['enter', text, context]]);
  // Between.
  media = $24065e2676945debdca13ae9439cbbb1$var$chunkedPush(media, $24065e2676945debdca13ae9439cbbb1$var$resolveAll(context.parser.constructs.insideSpan.null, events.slice(open + offset + 4, close - 3), context));
  // Text close, marker close, label close.
  media = $24065e2676945debdca13ae9439cbbb1$var$chunkedPush(media, [['exit', text, context], events[close - 2], events[close - 1], ['exit', label, context]]);
  // Reference, resource, or so.
  media = $24065e2676945debdca13ae9439cbbb1$var$chunkedPush(media, events.slice(close + 1));
  // Media close.
  media = $24065e2676945debdca13ae9439cbbb1$var$chunkedPush(media, [['exit', group, context]]);
  $24065e2676945debdca13ae9439cbbb1$var$chunkedSplice(events, open, events.length, media);
  return events;
}
function $24065e2676945debdca13ae9439cbbb1$var$tokenizeLabelEnd(effects, ok, nok) {
  var self = this;
  var index = self.events.length;
  var labelStart;
  var defined;
  // Find an opening.
  while (index--) {
    if ((self.events[index][1].type === 'labelImage' || self.events[index][1].type === 'labelLink') && !self.events[index][1]._balanced) {
      labelStart = self.events[index][1];
      break;
    }
  }
  return start;
  function start(code) {
    if (!labelStart) {
      return nok(code);
    }
    // It’s a balanced bracket, but contains a link.
    if (labelStart._inactive) return balanced(code);
    defined = self.parser.defined.indexOf($24065e2676945debdca13ae9439cbbb1$var$normalizeIdentifier(self.sliceSerialize({
      start: labelStart.end,
      end: self.now()
    }))) > -1;
    effects.enter('labelEnd');
    effects.enter('labelMarker');
    effects.consume(code);
    effects.exit('labelMarker');
    effects.exit('labelEnd');
    return afterLabelEnd;
  }
  function afterLabelEnd(code) {
    // Resource: `[asd](fgh)`.
    if (code === 40) {
      return effects.attempt($24065e2676945debdca13ae9439cbbb1$var$resourceConstruct, ok, defined ? ok : balanced)(code);
    }
    // Collapsed (`[asd][]`) or full (`[asd][fgh]`) reference?
    if (code === 91) {
      return effects.attempt($24065e2676945debdca13ae9439cbbb1$var$fullReferenceConstruct, ok, defined ? effects.attempt($24065e2676945debdca13ae9439cbbb1$var$collapsedReferenceConstruct, ok, balanced) : balanced)(code);
    }
    // Shortcut reference: `[asd]`?
    return defined ? ok(code) : balanced(code);
  }
  function balanced(code) {
    labelStart._balanced = true;
    return nok(code);
  }
}
function $24065e2676945debdca13ae9439cbbb1$var$tokenizeResource(effects, ok, nok) {
  return start;
  function start(code) {
    effects.enter('resource');
    effects.enter('resourceMarker');
    effects.consume(code);
    effects.exit('resourceMarker');
    return $24065e2676945debdca13ae9439cbbb1$var$factoryWhitespace(effects, open);
  }
  function open(code) {
    if (code === 41) {
      return end(code);
    }
    return $24065e2676945debdca13ae9439cbbb1$var$factoryDestination(effects, destinationAfter, nok, 'resourceDestination', 'resourceDestinationLiteral', 'resourceDestinationLiteralMarker', 'resourceDestinationRaw', 'resourceDestinationString', 3)(code);
  }
  function destinationAfter(code) {
    return $24065e2676945debdca13ae9439cbbb1$var$markdownLineEndingOrSpace(code) ? $24065e2676945debdca13ae9439cbbb1$var$factoryWhitespace(effects, between)(code) : end(code);
  }
  function between(code) {
    if (code === 34 || code === 39 || code === 40) {
      return $24065e2676945debdca13ae9439cbbb1$var$factoryTitle(effects, $24065e2676945debdca13ae9439cbbb1$var$factoryWhitespace(effects, end), nok, 'resourceTitle', 'resourceTitleMarker', 'resourceTitleString')(code);
    }
    return end(code);
  }
  function end(code) {
    if (code === 41) {
      effects.enter('resourceMarker');
      effects.consume(code);
      effects.exit('resourceMarker');
      effects.exit('resource');
      return ok;
    }
    return nok(code);
  }
}
function $24065e2676945debdca13ae9439cbbb1$var$tokenizeFullReference(effects, ok, nok) {
  var self = this;
  return start;
  function start(code) {
    return $5373bd42e316b894efeba9b26b8bc40e$exports.call(self, effects, afterLabel, nok, 'reference', 'referenceMarker', 'referenceString')(code);
  }
  function afterLabel(code) {
    return self.parser.defined.indexOf($24065e2676945debdca13ae9439cbbb1$var$normalizeIdentifier(self.sliceSerialize(self.events[self.events.length - 1][1]).slice(1, -1))) < 0 ? nok(code) : ok(code);
  }
}
function $24065e2676945debdca13ae9439cbbb1$var$tokenizeCollapsedReference(effects, ok, nok) {
  return start;
  function start(code) {
    effects.enter('reference');
    effects.enter('referenceMarker');
    effects.consume(code);
    effects.exit('referenceMarker');
    return open;
  }
  function open(code) {
    if (code === 93) {
      effects.enter('referenceMarker');
      effects.consume(code);
      effects.exit('referenceMarker');
      effects.exit('reference');
      return ok;
    }
    return nok(code);
  }
}
$24065e2676945debdca13ae9439cbbb1$exports = $24065e2676945debdca13ae9439cbbb1$var$labelEnd;
var $066ede785a42c642ad66be353fcdb5fa$var$labelEnd = $24065e2676945debdca13ae9439cbbb1$exports;
// ASSET: node_modules/micromark/dist/tokenize/label-start-image.js
var $9b88bc56dec3fa1fc0314cebd3108bc2$exports = {};
var $9b88bc56dec3fa1fc0314cebd3108bc2$var$labelStartImage = {
  name: 'labelStartImage',
  tokenize: $9b88bc56dec3fa1fc0314cebd3108bc2$var$tokenizeLabelStartImage,
  resolveAll: $24065e2676945debdca13ae9439cbbb1$exports.resolveAll
};
function $9b88bc56dec3fa1fc0314cebd3108bc2$var$tokenizeLabelStartImage(effects, ok, nok) {
  var self = this;
  return start;
  function start(code) {
    effects.enter('labelImage');
    effects.enter('labelImageMarker');
    effects.consume(code);
    effects.exit('labelImageMarker');
    return open;
  }
  function open(code) {
    if (code === 91) {
      effects.enter('labelMarker');
      effects.consume(code);
      effects.exit('labelMarker');
      effects.exit('labelImage');
      return after;
    }
    return nok(code);
  }
  function after(code) {
    /*c8 ignore next*/
    return code === 94 && /*c8 ignore next*/
    ('_hiddenFootnoteSupport' in self.parser.constructs) ? /*c8 ignore next*/
    nok(code) : ok(code);
  }
}
$9b88bc56dec3fa1fc0314cebd3108bc2$exports = $9b88bc56dec3fa1fc0314cebd3108bc2$var$labelStartImage;
var $066ede785a42c642ad66be353fcdb5fa$var$labelStartImage = $9b88bc56dec3fa1fc0314cebd3108bc2$exports;
// ASSET: node_modules/micromark/dist/tokenize/label-start-link.js
var $7ac6964213c7ccc7d8c4f808900e3963$exports = {};
var $7ac6964213c7ccc7d8c4f808900e3963$var$labelStartLink = {
  name: 'labelStartLink',
  tokenize: $7ac6964213c7ccc7d8c4f808900e3963$var$tokenizeLabelStartLink,
  resolveAll: $24065e2676945debdca13ae9439cbbb1$exports.resolveAll
};
function $7ac6964213c7ccc7d8c4f808900e3963$var$tokenizeLabelStartLink(effects, ok, nok) {
  var self = this;
  return start;
  function start(code) {
    effects.enter('labelLink');
    effects.enter('labelMarker');
    effects.consume(code);
    effects.exit('labelMarker');
    effects.exit('labelLink');
    return after;
  }
  function after(code) {
    /*c8 ignore next*/
    return code === 94 && /*c8 ignore next*/
    ('_hiddenFootnoteSupport' in self.parser.constructs) ? /*c8 ignore next*/
    nok(code) : ok(code);
  }
}
$7ac6964213c7ccc7d8c4f808900e3963$exports = $7ac6964213c7ccc7d8c4f808900e3963$var$labelStartLink;
var $066ede785a42c642ad66be353fcdb5fa$var$labelStartLink = $7ac6964213c7ccc7d8c4f808900e3963$exports;
// ASSET: node_modules/micromark/dist/tokenize/line-ending.js
var $75179c0b78c7443edc63c272a724db0e$exports = {};
var $75179c0b78c7443edc63c272a724db0e$var$factorySpace = $c9c5e694972b79db7836f58f99718475$exports;
var $75179c0b78c7443edc63c272a724db0e$var$lineEnding = {
  name: 'lineEnding',
  tokenize: $75179c0b78c7443edc63c272a724db0e$var$tokenizeLineEnding
};
function $75179c0b78c7443edc63c272a724db0e$var$tokenizeLineEnding(effects, ok) {
  return start;
  function start(code) {
    effects.enter('lineEnding');
    effects.consume(code);
    effects.exit('lineEnding');
    return $75179c0b78c7443edc63c272a724db0e$var$factorySpace(effects, ok, 'linePrefix');
  }
}
$75179c0b78c7443edc63c272a724db0e$exports = $75179c0b78c7443edc63c272a724db0e$var$lineEnding;
var $066ede785a42c642ad66be353fcdb5fa$var$lineEnding = $75179c0b78c7443edc63c272a724db0e$exports;
// ASSET: node_modules/micromark/dist/tokenize/list.js
var $65f7e214865de382158958e7808b3da2$exports = {};
var $65f7e214865de382158958e7808b3da2$var$asciiDigit = $6f6fef9e2cb662ee6050f40cc339dd19$exports;
var $65f7e214865de382158958e7808b3da2$var$markdownSpace = $4087d4a7eda9d3422d8ed53862be000e$exports;
var $65f7e214865de382158958e7808b3da2$var$prefixSize = $d154556f03fbe11e6c8c9db4f5c0c203$exports;
var $65f7e214865de382158958e7808b3da2$var$sizeChunks = $149bcbbd820ecb308ec8f9dcd0ce0f78$exports;
var $65f7e214865de382158958e7808b3da2$var$factorySpace = $c9c5e694972b79db7836f58f99718475$exports;
var $65f7e214865de382158958e7808b3da2$var$partialBlankLine = $ebf3f90d1535e837678aaa6daf0871a4$exports;
// ASSET: node_modules/micromark/dist/tokenize/thematic-break.js
var $ba5ba53a16d326afe7355b08a231e062$exports = {};
var $ba5ba53a16d326afe7355b08a231e062$var$markdownLineEnding = $16cd0200e709bd24480331e751413c02$exports;
var $ba5ba53a16d326afe7355b08a231e062$var$markdownSpace = $4087d4a7eda9d3422d8ed53862be000e$exports;
var $ba5ba53a16d326afe7355b08a231e062$var$factorySpace = $c9c5e694972b79db7836f58f99718475$exports;
var $ba5ba53a16d326afe7355b08a231e062$var$thematicBreak = {
  name: 'thematicBreak',
  tokenize: $ba5ba53a16d326afe7355b08a231e062$var$tokenizeThematicBreak
};
function $ba5ba53a16d326afe7355b08a231e062$var$tokenizeThematicBreak(effects, ok, nok) {
  var size = 0;
  var marker;
  return start;
  function start(code) {
    effects.enter('thematicBreak');
    marker = code;
    return atBreak(code);
  }
  function atBreak(code) {
    if (code === marker) {
      effects.enter('thematicBreakSequence');
      return sequence(code);
    }
    if ($ba5ba53a16d326afe7355b08a231e062$var$markdownSpace(code)) {
      return $ba5ba53a16d326afe7355b08a231e062$var$factorySpace(effects, atBreak, 'whitespace')(code);
    }
    if (size < 3 || code !== null && !$ba5ba53a16d326afe7355b08a231e062$var$markdownLineEnding(code)) {
      return nok(code);
    }
    effects.exit('thematicBreak');
    return ok(code);
  }
  function sequence(code) {
    if (code === marker) {
      effects.consume(code);
      size++;
      return sequence;
    }
    effects.exit('thematicBreakSequence');
    return atBreak(code);
  }
}
$ba5ba53a16d326afe7355b08a231e062$exports = $ba5ba53a16d326afe7355b08a231e062$var$thematicBreak;
var $65f7e214865de382158958e7808b3da2$var$thematicBreak = $ba5ba53a16d326afe7355b08a231e062$exports;
var $65f7e214865de382158958e7808b3da2$var$list = {
  name: 'list',
  tokenize: $65f7e214865de382158958e7808b3da2$var$tokenizeListStart,
  continuation: {
    tokenize: $65f7e214865de382158958e7808b3da2$var$tokenizeListContinuation
  },
  exit: $65f7e214865de382158958e7808b3da2$var$tokenizeListEnd
};
var $65f7e214865de382158958e7808b3da2$var$listItemPrefixWhitespaceConstruct = {
  tokenize: $65f7e214865de382158958e7808b3da2$var$tokenizeListItemPrefixWhitespace,
  partial: true
};
var $65f7e214865de382158958e7808b3da2$var$indentConstruct = {
  tokenize: $65f7e214865de382158958e7808b3da2$var$tokenizeIndent,
  partial: true
};
function $65f7e214865de382158958e7808b3da2$var$tokenizeListStart(effects, ok, nok) {
  var self = this;
  var initialSize = $65f7e214865de382158958e7808b3da2$var$prefixSize(self.events, 'linePrefix');
  var size = 0;
  return start;
  function start(code) {
    var kind = self.containerState.type || (code === 42 || code === 43 || code === 45 ? 'listUnordered' : 'listOrdered');
    if (kind === 'listUnordered' ? !self.containerState.marker || code === self.containerState.marker : $65f7e214865de382158958e7808b3da2$var$asciiDigit(code)) {
      if (!self.containerState.type) {
        self.containerState.type = kind;
        effects.enter(kind, {
          _container: true
        });
      }
      if (kind === 'listUnordered') {
        effects.enter('listItemPrefix');
        return code === 42 || code === 45 ? effects.check($65f7e214865de382158958e7808b3da2$var$thematicBreak, nok, atMarker)(code) : atMarker(code);
      }
      if (!self.interrupt || code === 49) {
        effects.enter('listItemPrefix');
        effects.enter('listItemValue');
        return inside(code);
      }
    }
    return nok(code);
  }
  function inside(code) {
    if ($65f7e214865de382158958e7808b3da2$var$asciiDigit(code) && ++size < 10) {
      effects.consume(code);
      return inside;
    }
    if ((!self.interrupt || size < 2) && (self.containerState.marker ? code === self.containerState.marker : code === 41 || code === 46)) {
      effects.exit('listItemValue');
      return atMarker(code);
    }
    return nok(code);
  }
  function atMarker(code) {
    effects.enter('listItemMarker');
    effects.consume(code);
    effects.exit('listItemMarker');
    self.containerState.marker = self.containerState.marker || code;
    return effects.check($65f7e214865de382158958e7808b3da2$var$partialBlankLine, // Can’t be empty when interrupting.
    self.interrupt ? nok : onBlank, effects.attempt($65f7e214865de382158958e7808b3da2$var$listItemPrefixWhitespaceConstruct, endOfPrefix, otherPrefix));
  }
  function onBlank(code) {
    self.containerState.initialBlankLine = true;
    initialSize++;
    return endOfPrefix(code);
  }
  function otherPrefix(code) {
    if ($65f7e214865de382158958e7808b3da2$var$markdownSpace(code)) {
      effects.enter('listItemPrefixWhitespace');
      effects.consume(code);
      effects.exit('listItemPrefixWhitespace');
      return endOfPrefix;
    }
    return nok(code);
  }
  function endOfPrefix(code) {
    self.containerState.size = initialSize + $65f7e214865de382158958e7808b3da2$var$sizeChunks(self.sliceStream(effects.exit('listItemPrefix')));
    return ok(code);
  }
}
function $65f7e214865de382158958e7808b3da2$var$tokenizeListContinuation(effects, ok, nok) {
  var self = this;
  self.containerState._closeFlow = undefined;
  return effects.check($65f7e214865de382158958e7808b3da2$var$partialBlankLine, onBlank, notBlank);
  function onBlank(code) {
    self.containerState.furtherBlankLines = self.containerState.furtherBlankLines || self.containerState.initialBlankLine;
    // We have a blank line.
    // Still, try to consume at most the items size.
    return $65f7e214865de382158958e7808b3da2$var$factorySpace(effects, ok, 'listItemIndent', self.containerState.size + 1)(code);
  }
  function notBlank(code) {
    if (self.containerState.furtherBlankLines || !$65f7e214865de382158958e7808b3da2$var$markdownSpace(code)) {
      self.containerState.furtherBlankLines = self.containerState.initialBlankLine = undefined;
      return notInCurrentItem(code);
    }
    self.containerState.furtherBlankLines = self.containerState.initialBlankLine = undefined;
    return effects.attempt($65f7e214865de382158958e7808b3da2$var$indentConstruct, ok, notInCurrentItem)(code);
  }
  function notInCurrentItem(code) {
    // While we do continue, we signal that the flow should be closed.
    self.containerState._closeFlow = true;
    // As we’re closing flow, we’re no longer interrupting.
    self.interrupt = undefined;
    return $65f7e214865de382158958e7808b3da2$var$factorySpace(effects, effects.attempt($65f7e214865de382158958e7808b3da2$var$list, ok, nok), 'linePrefix', self.parser.constructs.disable.null.indexOf('codeIndented') > -1 ? undefined : 4)(code);
  }
}
function $65f7e214865de382158958e7808b3da2$var$tokenizeIndent(effects, ok, nok) {
  var self = this;
  return $65f7e214865de382158958e7808b3da2$var$factorySpace(effects, afterPrefix, 'listItemIndent', self.containerState.size + 1);
  function afterPrefix(code) {
    return $65f7e214865de382158958e7808b3da2$var$prefixSize(self.events, 'listItemIndent') === self.containerState.size ? ok(code) : nok(code);
  }
}
function $65f7e214865de382158958e7808b3da2$var$tokenizeListEnd(effects) {
  effects.exit(this.containerState.type);
}
function $65f7e214865de382158958e7808b3da2$var$tokenizeListItemPrefixWhitespace(effects, ok, nok) {
  var self = this;
  return $65f7e214865de382158958e7808b3da2$var$factorySpace(effects, afterPrefix, 'listItemPrefixWhitespace', self.parser.constructs.disable.null.indexOf('codeIndented') > -1 ? undefined : 4 + 1);
  function afterPrefix(code) {
    return $65f7e214865de382158958e7808b3da2$var$markdownSpace(code) || !$65f7e214865de382158958e7808b3da2$var$prefixSize(self.events, 'listItemPrefixWhitespace') ? nok(code) : ok(code);
  }
}
$65f7e214865de382158958e7808b3da2$exports = $65f7e214865de382158958e7808b3da2$var$list;
var $066ede785a42c642ad66be353fcdb5fa$var$list = $65f7e214865de382158958e7808b3da2$exports;
// ASSET: node_modules/micromark/dist/tokenize/setext-underline.js
var $0e3402d1c9443c38aee0fe72e27a5a0c$exports = {};
var $0e3402d1c9443c38aee0fe72e27a5a0c$var$markdownLineEnding = $16cd0200e709bd24480331e751413c02$exports;
var $0e3402d1c9443c38aee0fe72e27a5a0c$var$shallow = $541289fbe4aa92ce2fc0b3f29311bcb8$exports;
var $0e3402d1c9443c38aee0fe72e27a5a0c$var$factorySpace = $c9c5e694972b79db7836f58f99718475$exports;
var $0e3402d1c9443c38aee0fe72e27a5a0c$var$setextUnderline = {
  name: 'setextUnderline',
  tokenize: $0e3402d1c9443c38aee0fe72e27a5a0c$var$tokenizeSetextUnderline,
  resolveTo: $0e3402d1c9443c38aee0fe72e27a5a0c$var$resolveToSetextUnderline
};
function $0e3402d1c9443c38aee0fe72e27a5a0c$var$resolveToSetextUnderline(events, context) {
  var index = events.length;
  var content;
  var text;
  var definition;
  var heading;
  // Find the opening of the content.
  // It’ll always exist: we don’t tokenize if it isn’t there.
  while (index--) {
    if (events[index][0] === 'enter') {
      if (events[index][1].type === 'content') {
        content = index;
        break;
      }
      if (events[index][1].type === 'paragraph') {
        text = index;
      }
            // Exit
} else // Exit
    {
      if (events[index][1].type === 'content') {
        // Remove the content end (if needed we’ll add it later)
        events.splice(index, 1);
      }
      if (!definition && events[index][1].type === 'definition') {
        definition = index;
      }
    }
  }
  heading = {
    type: 'setextHeading',
    start: $0e3402d1c9443c38aee0fe72e27a5a0c$var$shallow(events[text][1].start),
    end: $0e3402d1c9443c38aee0fe72e27a5a0c$var$shallow(events[events.length - 1][1].end)
  };
  // Change the paragraph to setext heading text.
  events[text][1].type = 'setextHeadingText';
  // If we have definitions in the content, we’ll keep on having content,
  // but we need move it.
  if (definition) {
    events.splice(text, 0, ['enter', heading, context]);
    events.splice(definition + 1, 0, ['exit', events[content][1], context]);
    events[content][1].end = $0e3402d1c9443c38aee0fe72e27a5a0c$var$shallow(events[definition][1].end);
  } else {
    events[content][1] = heading;
  }
  // Add the heading exit at the end.
  events.push(['exit', heading, context]);
  return events;
}
function $0e3402d1c9443c38aee0fe72e27a5a0c$var$tokenizeSetextUnderline(effects, ok, nok) {
  var self = this;
  var index = self.events.length;
  var marker;
  var paragraph;
  // Find an opening.
  while (index--) {
    // Skip enter/exit of line ending, line prefix, and content.
    // We can now either have a definition or a paragraph.
    if (self.events[index][1].type !== 'lineEnding' && self.events[index][1].type !== 'linePrefix' && self.events[index][1].type !== 'content') {
      paragraph = self.events[index][1].type === 'paragraph';
      break;
    }
  }
  return start;
  function start(code) {
    if (!self.lazy && (self.interrupt || paragraph)) {
      effects.enter('setextHeadingLine');
      effects.enter('setextHeadingLineSequence');
      marker = code;
      return closingSequence(code);
    }
    return nok(code);
  }
  function closingSequence(code) {
    if (code === marker) {
      effects.consume(code);
      return closingSequence;
    }
    effects.exit('setextHeadingLineSequence');
    return $0e3402d1c9443c38aee0fe72e27a5a0c$var$factorySpace(effects, closingSequenceEnd, 'lineSuffix')(code);
  }
  function closingSequenceEnd(code) {
    if (code === null || $0e3402d1c9443c38aee0fe72e27a5a0c$var$markdownLineEnding(code)) {
      effects.exit('setextHeadingLine');
      return ok(code);
    }
    return nok(code);
  }
}
$0e3402d1c9443c38aee0fe72e27a5a0c$exports = $0e3402d1c9443c38aee0fe72e27a5a0c$var$setextUnderline;
var $066ede785a42c642ad66be353fcdb5fa$var$setextUnderline = $0e3402d1c9443c38aee0fe72e27a5a0c$exports;
var $066ede785a42c642ad66be353fcdb5fa$var$thematicBreak = $ba5ba53a16d326afe7355b08a231e062$exports;
var $066ede785a42c642ad66be353fcdb5fa$var$document = {
  42: $066ede785a42c642ad66be353fcdb5fa$var$list,
  // Asterisk
  43: $066ede785a42c642ad66be353fcdb5fa$var$list,
  // Plus sign
  45: $066ede785a42c642ad66be353fcdb5fa$var$list,
  // Dash
  48: $066ede785a42c642ad66be353fcdb5fa$var$list,
  // 0
  49: $066ede785a42c642ad66be353fcdb5fa$var$list,
  // 1
  50: $066ede785a42c642ad66be353fcdb5fa$var$list,
  // 2
  51: $066ede785a42c642ad66be353fcdb5fa$var$list,
  // 3
  52: $066ede785a42c642ad66be353fcdb5fa$var$list,
  // 4
  53: $066ede785a42c642ad66be353fcdb5fa$var$list,
  // 5
  54: $066ede785a42c642ad66be353fcdb5fa$var$list,
  // 6
  55: $066ede785a42c642ad66be353fcdb5fa$var$list,
  // 7
  56: $066ede785a42c642ad66be353fcdb5fa$var$list,
  // 8
  57: $066ede785a42c642ad66be353fcdb5fa$var$list,
  // 9
  62: $066ede785a42c642ad66be353fcdb5fa$var$blockQuote
};
var $066ede785a42c642ad66be353fcdb5fa$var$contentInitial = {
  91: $066ede785a42c642ad66be353fcdb5fa$var$definition
};
var $066ede785a42c642ad66be353fcdb5fa$var$flowInitial = {
  '-2': $066ede785a42c642ad66be353fcdb5fa$var$codeIndented,
  // Horizontal tab
  '-1': $066ede785a42c642ad66be353fcdb5fa$var$codeIndented,
  // Virtual space
  32: $066ede785a42c642ad66be353fcdb5fa$var$codeIndented
};
var $066ede785a42c642ad66be353fcdb5fa$var$flow = {
  35: $066ede785a42c642ad66be353fcdb5fa$var$headingAtx,
  // Number sign
  42: $066ede785a42c642ad66be353fcdb5fa$var$thematicBreak,
  // Asterisk
  45: [$066ede785a42c642ad66be353fcdb5fa$var$setextUnderline, $066ede785a42c642ad66be353fcdb5fa$var$thematicBreak],
  // Dash
  60: $066ede785a42c642ad66be353fcdb5fa$var$htmlFlow,
  // Less than
  61: $066ede785a42c642ad66be353fcdb5fa$var$setextUnderline,
  // Equals to
  95: $066ede785a42c642ad66be353fcdb5fa$var$thematicBreak,
  // Underscore
  96: $066ede785a42c642ad66be353fcdb5fa$var$codeFenced,
  // Grave accent
  126: $066ede785a42c642ad66be353fcdb5fa$var$codeFenced
};
var $066ede785a42c642ad66be353fcdb5fa$var$string = {
  38: $066ede785a42c642ad66be353fcdb5fa$var$characterReference,
  // Ampersand
  92: $066ede785a42c642ad66be353fcdb5fa$var$characterEscape
};
var $066ede785a42c642ad66be353fcdb5fa$var$text = {
  '-5': $066ede785a42c642ad66be353fcdb5fa$var$lineEnding,
  // Carriage return
  '-4': $066ede785a42c642ad66be353fcdb5fa$var$lineEnding,
  // Line feed
  '-3': $066ede785a42c642ad66be353fcdb5fa$var$lineEnding,
  // Carriage return + line feed
  33: $066ede785a42c642ad66be353fcdb5fa$var$labelStartImage,
  // Exclamation mark
  38: $066ede785a42c642ad66be353fcdb5fa$var$characterReference,
  // Ampersand
  42: $066ede785a42c642ad66be353fcdb5fa$var$attention,
  // Asterisk
  60: [$066ede785a42c642ad66be353fcdb5fa$var$autolink, $066ede785a42c642ad66be353fcdb5fa$var$htmlText],
  // Less than
  91: $066ede785a42c642ad66be353fcdb5fa$var$labelStartLink,
  // Left square bracket
  92: [$066ede785a42c642ad66be353fcdb5fa$var$hardBreakEscape, $066ede785a42c642ad66be353fcdb5fa$var$characterEscape],
  // Backslash
  93: $066ede785a42c642ad66be353fcdb5fa$var$labelEnd,
  // Right square bracket
  95: $066ede785a42c642ad66be353fcdb5fa$var$attention,
  // Underscore
  96: $066ede785a42c642ad66be353fcdb5fa$var$codeText
};
var $066ede785a42c642ad66be353fcdb5fa$var$insideSpan = {
  null: [$066ede785a42c642ad66be353fcdb5fa$var$attention, $4e25440774421029314bb5d592237bdb$exports.resolver]
};
var $066ede785a42c642ad66be353fcdb5fa$var$disable = {
  null: []
};
var $066ede785a42c642ad66be353fcdb5fa$export$contentInitial = $066ede785a42c642ad66be353fcdb5fa$var$contentInitial;
$066ede785a42c642ad66be353fcdb5fa$exports.contentInitial = $066ede785a42c642ad66be353fcdb5fa$export$contentInitial;
var $066ede785a42c642ad66be353fcdb5fa$export$disable = $066ede785a42c642ad66be353fcdb5fa$var$disable;
$066ede785a42c642ad66be353fcdb5fa$exports.disable = $066ede785a42c642ad66be353fcdb5fa$export$disable;
var $066ede785a42c642ad66be353fcdb5fa$export$document = $066ede785a42c642ad66be353fcdb5fa$var$document;
$066ede785a42c642ad66be353fcdb5fa$exports.document = $066ede785a42c642ad66be353fcdb5fa$export$document;
var $066ede785a42c642ad66be353fcdb5fa$export$flow = $066ede785a42c642ad66be353fcdb5fa$var$flow;
$066ede785a42c642ad66be353fcdb5fa$exports.flow = $066ede785a42c642ad66be353fcdb5fa$export$flow;
var $066ede785a42c642ad66be353fcdb5fa$export$flowInitial = $066ede785a42c642ad66be353fcdb5fa$var$flowInitial;
$066ede785a42c642ad66be353fcdb5fa$exports.flowInitial = $066ede785a42c642ad66be353fcdb5fa$export$flowInitial;
var $066ede785a42c642ad66be353fcdb5fa$export$insideSpan = $066ede785a42c642ad66be353fcdb5fa$var$insideSpan;
$066ede785a42c642ad66be353fcdb5fa$exports.insideSpan = $066ede785a42c642ad66be353fcdb5fa$export$insideSpan;
var $066ede785a42c642ad66be353fcdb5fa$export$string = $066ede785a42c642ad66be353fcdb5fa$var$string;
$066ede785a42c642ad66be353fcdb5fa$exports.string = $066ede785a42c642ad66be353fcdb5fa$export$string;
var $066ede785a42c642ad66be353fcdb5fa$export$text = $066ede785a42c642ad66be353fcdb5fa$var$text;
$066ede785a42c642ad66be353fcdb5fa$exports.text = $066ede785a42c642ad66be353fcdb5fa$export$text;
var $25aa31938ce75afaf8e06b8cadb964f3$var$constructs = $066ede785a42c642ad66be353fcdb5fa$exports;
function $25aa31938ce75afaf8e06b8cadb964f3$var$parse(options) {
  var settings = options || ({});
  var parser = {
    defined: [],
    constructs: $25aa31938ce75afaf8e06b8cadb964f3$var$combineExtensions([$25aa31938ce75afaf8e06b8cadb964f3$var$constructs].concat($25aa31938ce75afaf8e06b8cadb964f3$var$miniflat(settings.extensions))),
    content: create($25aa31938ce75afaf8e06b8cadb964f3$var$content),
    document: create($25aa31938ce75afaf8e06b8cadb964f3$var$document),
    flow: create($25aa31938ce75afaf8e06b8cadb964f3$var$flow),
    string: create($4e25440774421029314bb5d592237bdb$exports.string),
    text: create($4e25440774421029314bb5d592237bdb$exports.text)
  };
  return parser;
  function create(initializer) {
    return creator;
    function creator(from) {
      return $25aa31938ce75afaf8e06b8cadb964f3$var$createTokenizer(parser, initializer, from);
    }
  }
}
$25aa31938ce75afaf8e06b8cadb964f3$exports = $25aa31938ce75afaf8e06b8cadb964f3$var$parse;
var $dd5fd051794caf77c245ee698a159bd4$var$parser = $25aa31938ce75afaf8e06b8cadb964f3$exports;
// ASSET: node_modules/micromark/dist/preprocess.js
var $defc26d7b2c63eb21dc92da57f357dca$exports = {};
var $defc26d7b2c63eb21dc92da57f357dca$var$search = /[\0\t\n\r]/g;
function $defc26d7b2c63eb21dc92da57f357dca$var$preprocess() {
  var start = true;
  var column = 1;
  var buffer = '';
  var atCarriageReturn;
  return preprocessor;
  function preprocessor(value, encoding, end) {
    var chunks = [];
    var match;
    var next;
    var startPosition;
    var endPosition;
    var code;
    value = buffer + value.toString(encoding);
    startPosition = 0;
    buffer = '';
    if (start) {
      if (value.charCodeAt(0) === 65279) {
        startPosition++;
      }
      start = undefined;
    }
    while (startPosition < value.length) {
      $defc26d7b2c63eb21dc92da57f357dca$var$search.lastIndex = startPosition;
      match = $defc26d7b2c63eb21dc92da57f357dca$var$search.exec(value);
      endPosition = match ? match.index : value.length;
      code = value.charCodeAt(endPosition);
      if (!match) {
        buffer = value.slice(startPosition);
        break;
      }
      if (code === 10 && startPosition === endPosition && atCarriageReturn) {
        chunks.push(-3);
        atCarriageReturn = undefined;
      } else {
        if (atCarriageReturn) {
          chunks.push(-5);
          atCarriageReturn = undefined;
        }
        if (startPosition < endPosition) {
          chunks.push(value.slice(startPosition, endPosition));
          column += endPosition - startPosition;
        }
        if (code === 0) {
          chunks.push(65533);
          column++;
        } else if (code === 9) {
          next = Math.ceil(column / 4) * 4;
          chunks.push(-2);
          while (column++ < next) chunks.push(-1);
        } else if (code === 10) {
          chunks.push(-4);
          column = 1;
                    // Must be carriage return.
} else // Must be carriage return.
        {
          atCarriageReturn = true;
          column = 1;
        }
      }
      startPosition = endPosition + 1;
    }
    if (end) {
      if (atCarriageReturn) chunks.push(-5);
      if (buffer) chunks.push(buffer);
      chunks.push(null);
    }
    return chunks;
  }
}
$defc26d7b2c63eb21dc92da57f357dca$exports = $defc26d7b2c63eb21dc92da57f357dca$var$preprocess;
var $dd5fd051794caf77c245ee698a159bd4$var$preprocessor = $defc26d7b2c63eb21dc92da57f357dca$exports;
// ASSET: node_modules/micromark/dist/postprocess.js
var $54d67c5b32b0ebe1d5bc9d01d90aef70$exports = {};
var $54d67c5b32b0ebe1d5bc9d01d90aef70$var$subtokenize = $b65e7f1128cba8c762c0f54ddb541a5a$exports;
function $54d67c5b32b0ebe1d5bc9d01d90aef70$var$postprocess(events) {
  while (!$54d67c5b32b0ebe1d5bc9d01d90aef70$var$subtokenize(events)) {}
  return events;
}
$54d67c5b32b0ebe1d5bc9d01d90aef70$exports = $54d67c5b32b0ebe1d5bc9d01d90aef70$var$postprocess;
var $dd5fd051794caf77c245ee698a159bd4$var$postprocess = $54d67c5b32b0ebe1d5bc9d01d90aef70$exports;
var $dd5fd051794caf77c245ee698a159bd4$var$decode = $14d0c44491d93e244c8a10aa7071477d$exports;
var $dd5fd051794caf77c245ee698a159bd4$var$stringifyPosition = $4f36b95a30d2954da268e0c54f89babe$exports;
function $dd5fd051794caf77c245ee698a159bd4$var$fromMarkdown(value, encoding, options) {
  if (typeof encoding !== 'string') {
    options = encoding;
    encoding = undefined;
  }
  return $dd5fd051794caf77c245ee698a159bd4$var$compiler(options)($dd5fd051794caf77c245ee698a159bd4$var$postprocess($dd5fd051794caf77c245ee698a159bd4$var$parser(options).document().write($dd5fd051794caf77c245ee698a159bd4$var$preprocessor()(value, encoding, true))));
}
// Note this compiler only understand complete buffering, not streaming.
function $dd5fd051794caf77c245ee698a159bd4$var$compiler(options) {
  var settings = options || ({});
  var config = $dd5fd051794caf77c245ee698a159bd4$var$configure({
    transforms: [],
    canContainEols: ['emphasis', 'fragment', 'heading', 'paragraph', 'strong'],
    enter: {
      autolink: opener(link),
      autolinkProtocol: onenterdata,
      autolinkEmail: onenterdata,
      atxHeading: opener(heading),
      blockQuote: opener(blockQuote),
      characterEscape: onenterdata,
      characterReference: onenterdata,
      codeFenced: opener(codeFlow),
      codeFencedFenceInfo: buffer,
      codeFencedFenceMeta: buffer,
      codeIndented: opener(codeFlow, buffer),
      codeText: opener(codeText, buffer),
      codeTextData: onenterdata,
      data: onenterdata,
      codeFlowValue: onenterdata,
      definition: opener(definition),
      definitionDestinationString: buffer,
      definitionLabelString: buffer,
      definitionTitleString: buffer,
      emphasis: opener(emphasis),
      hardBreakEscape: opener(hardBreak),
      hardBreakTrailing: opener(hardBreak),
      htmlFlow: opener(html, buffer),
      htmlFlowData: onenterdata,
      htmlText: opener(html, buffer),
      htmlTextData: onenterdata,
      image: opener(image),
      label: buffer,
      link: opener(link),
      listItem: opener(listItem),
      listItemValue: onenterlistitemvalue,
      listOrdered: opener(list, onenterlistordered),
      listUnordered: opener(list),
      paragraph: opener(paragraph),
      reference: onenterreference,
      referenceString: buffer,
      resourceDestinationString: buffer,
      resourceTitleString: buffer,
      setextHeading: opener(heading),
      strong: opener(strong),
      thematicBreak: opener(thematicBreak)
    },
    exit: {
      atxHeading: closer(),
      atxHeadingSequence: onexitatxheadingsequence,
      autolink: closer(),
      autolinkEmail: onexitautolinkemail,
      autolinkProtocol: onexitautolinkprotocol,
      blockQuote: closer(),
      characterEscapeValue: onexitdata,
      characterReferenceMarkerHexadecimal: onexitcharacterreferencemarker,
      characterReferenceMarkerNumeric: onexitcharacterreferencemarker,
      characterReferenceValue: onexitcharacterreferencevalue,
      codeFenced: closer(onexitcodefenced),
      codeFencedFence: onexitcodefencedfence,
      codeFencedFenceInfo: onexitcodefencedfenceinfo,
      codeFencedFenceMeta: onexitcodefencedfencemeta,
      codeFlowValue: onexitdata,
      codeIndented: closer(onexitcodeindented),
      codeText: closer(onexitcodetext),
      codeTextData: onexitdata,
      data: onexitdata,
      definition: closer(),
      definitionDestinationString: onexitdefinitiondestinationstring,
      definitionLabelString: onexitdefinitionlabelstring,
      definitionTitleString: onexitdefinitiontitlestring,
      emphasis: closer(),
      hardBreakEscape: closer(onexithardbreak),
      hardBreakTrailing: closer(onexithardbreak),
      htmlFlow: closer(onexithtmlflow),
      htmlFlowData: onexitdata,
      htmlText: closer(onexithtmltext),
      htmlTextData: onexitdata,
      image: closer(onexitimage),
      label: onexitlabel,
      labelText: onexitlabeltext,
      lineEnding: onexitlineending,
      link: closer(onexitlink),
      listItem: closer(),
      listOrdered: closer(),
      listUnordered: closer(),
      paragraph: closer(),
      referenceString: onexitreferencestring,
      resourceDestinationString: onexitresourcedestinationstring,
      resourceTitleString: onexitresourcetitlestring,
      resource: onexitresource,
      setextHeading: closer(onexitsetextheading),
      setextHeadingLineSequence: onexitsetextheadinglinesequence,
      setextHeadingText: onexitsetextheadingtext,
      strong: closer(),
      thematicBreak: closer()
    }
  }, settings.mdastExtensions || []);
  var data = {};
  return compile;
  function compile(events) {
    var tree = {
      type: 'root',
      children: []
    };
    var stack = [tree];
    var tokenStack = [];
    var listStack = [];
    var index = -1;
    var handler;
    var listStart;
    var context = {
      stack: stack,
      tokenStack: tokenStack,
      config: config,
      enter: enter,
      exit: exit,
      buffer: buffer,
      resume: resume,
      setData: setData,
      getData: getData
    };
    while (++index < events.length) {
      // We preprocess lists to add `listItem` tokens, and to infer whether
      // items the list itself are spread out.
      if (events[index][1].type === 'listOrdered' || events[index][1].type === 'listUnordered') {
        if (events[index][0] === 'enter') {
          listStack.push(index);
        } else {
          listStart = listStack.pop(index);
          index = prepareList(events, listStart, index);
        }
      }
    }
    index = -1;
    while (++index < events.length) {
      handler = config[events[index][0]];
      if ($1be1b063e9fa6a88634b3c76ad07318d$exports.call(handler, events[index][1].type)) {
        handler[events[index][1].type].call($dd5fd051794caf77c245ee698a159bd4$var$assign({
          sliceSerialize: events[index][2].sliceSerialize
        }, context), events[index][1]);
      }
    }
    if (tokenStack.length) {
      throw new Error('Cannot close document, a token (`' + tokenStack[tokenStack.length - 1].type + '`, ' + $dd5fd051794caf77c245ee698a159bd4$var$stringifyPosition({
        start: tokenStack[tokenStack.length - 1].start,
        end: tokenStack[tokenStack.length - 1].end
      }) + ') is still open');
    }
    // Figure out `root` position.
    tree.position = {
      start: point(events.length ? events[0][1].start : {
        line: 1,
        column: 1,
        offset: 0
      }),
      end: point(events.length ? events[events.length - 2][1].end : {
        line: 1,
        column: 1,
        offset: 0
      })
    };
    index = -1;
    while (++index < config.transforms.length) {
      tree = config.transforms[index](tree) || tree;
    }
    return tree;
  }
  function prepareList(events, start, length) {
    var index = start - 1;
    var containerBalance = -1;
    var listSpread = false;
    var listItem;
    var tailIndex;
    var lineIndex;
    var tailEvent;
    var event;
    var firstBlankLineIndex;
    var atMarker;
    while (++index <= length) {
      event = events[index];
      if (event[1].type === 'listUnordered' || event[1].type === 'listOrdered' || event[1].type === 'blockQuote') {
        if (event[0] === 'enter') {
          containerBalance++;
        } else {
          containerBalance--;
        }
        atMarker = undefined;
      } else if (event[1].type === 'lineEndingBlank') {
        if (event[0] === 'enter') {
          if (listItem && !atMarker && !containerBalance && !firstBlankLineIndex) {
            firstBlankLineIndex = index;
          }
          atMarker = undefined;
        }
      } else if (event[1].type === 'linePrefix' || event[1].type === 'listItemValue' || event[1].type === 'listItemMarker' || event[1].type === 'listItemPrefix' || event[1].type === 'listItemPrefixWhitespace') {} else {
        atMarker = undefined;
      }
      if (!containerBalance && event[0] === 'enter' && event[1].type === 'listItemPrefix' || containerBalance === -1 && event[0] === 'exit' && (event[1].type === 'listUnordered' || event[1].type === 'listOrdered')) {
        if (listItem) {
          tailIndex = index;
          lineIndex = undefined;
          while (tailIndex--) {
            tailEvent = events[tailIndex];
            if (tailEvent[1].type === 'lineEnding' || tailEvent[1].type === 'lineEndingBlank') {
              if (tailEvent[0] === 'exit') continue;
              if (lineIndex) {
                events[lineIndex][1].type = 'lineEndingBlank';
                listSpread = true;
              }
              tailEvent[1].type = 'lineEnding';
              lineIndex = tailIndex;
            } else if (tailEvent[1].type === 'linePrefix' || tailEvent[1].type === 'blockQuotePrefix' || tailEvent[1].type === 'blockQuotePrefixWhitespace' || tailEvent[1].type === 'blockQuoteMarker' || tailEvent[1].type === 'listItemIndent') {} else {
              break;
            }
          }
          if (firstBlankLineIndex && (!lineIndex || firstBlankLineIndex < lineIndex)) {
            listItem._spread = true;
          }
          // Fix position.
          listItem.end = point(lineIndex ? events[lineIndex][1].start : event[1].end);
          events.splice(lineIndex || index, 0, ['exit', listItem, event[2]]);
          index++;
          length++;
        }
        // Create a new list item.
        if (event[1].type === 'listItemPrefix') {
          listItem = {
            type: 'listItem',
            _spread: false,
            start: point(event[1].start)
          };
          events.splice(index, 0, ['enter', listItem, event[2]]);
          index++;
          length++;
          firstBlankLineIndex = undefined;
          atMarker = true;
        }
      }
    }
    events[start][1]._spread = listSpread;
    return length;
  }
  function setData(key, value) {
    data[key] = value;
  }
  function getData(key) {
    return data[key];
  }
  function point(d) {
    return {
      line: d.line,
      column: d.column,
      offset: d.offset
    };
  }
  function opener(create, and) {
    return open;
    function open(token) {
      enter.call(this, create(token), token);
      if (and) and.call(this, token);
    }
  }
  function buffer() {
    this.stack.push({
      type: 'fragment',
      children: []
    });
  }
  function enter(node, token) {
    this.stack[this.stack.length - 1].children.push(node);
    this.stack.push(node);
    this.tokenStack.push(token);
    node.position = {
      start: point(token.start)
    };
    return node;
  }
  function closer(and) {
    return close;
    function close(token) {
      if (and) and.call(this, token);
      exit.call(this, token);
    }
  }
  function exit(token) {
    var node = this.stack.pop();
    var open = this.tokenStack.pop();
    if (!open) {
      throw new Error('Cannot close `' + token.type + '` (' + $dd5fd051794caf77c245ee698a159bd4$var$stringifyPosition({
        start: token.start,
        end: token.end
      }) + '): it’s not open');
    } else if (open.type !== token.type) {
      throw new Error('Cannot close `' + token.type + '` (' + $dd5fd051794caf77c245ee698a159bd4$var$stringifyPosition({
        start: token.start,
        end: token.end
      }) + '): a different token (`' + open.type + '`, ' + $dd5fd051794caf77c245ee698a159bd4$var$stringifyPosition({
        start: open.start,
        end: open.end
      }) + ') is open');
    }
    node.position.end = point(token.end);
    return node;
  }
  function resume() {
    return $dd5fd051794caf77c245ee698a159bd4$var$toString(this.stack.pop());
  }
  //
  // Handlers.
  //
  function onenterlistordered() {
    setData('expectingFirstListItemValue', true);
  }
  function onenterlistitemvalue(token) {
    if (getData('expectingFirstListItemValue')) {
      this.stack[this.stack.length - 2].start = parseInt(this.sliceSerialize(token), 10);
      setData('expectingFirstListItemValue');
    }
  }
  function onexitcodefencedfenceinfo() {
    var data = this.resume();
    this.stack[this.stack.length - 1].lang = data;
  }
  function onexitcodefencedfencemeta() {
    var data = this.resume();
    this.stack[this.stack.length - 1].meta = data;
  }
  function onexitcodefencedfence() {
    // Exit if this is the closing fence.
    if (getData('flowCodeInside')) return;
    this.buffer();
    setData('flowCodeInside', true);
  }
  function onexitcodefenced() {
    var data = this.resume();
    this.stack[this.stack.length - 1].value = data.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, '');
    setData('flowCodeInside');
  }
  function onexitcodeindented() {
    var data = this.resume();
    this.stack[this.stack.length - 1].value = data;
  }
  function onexitdefinitionlabelstring(token) {
    // Discard label, use the source content instead.
    var label = this.resume();
    this.stack[this.stack.length - 1].label = label;
    this.stack[this.stack.length - 1].identifier = $dd5fd051794caf77c245ee698a159bd4$var$normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
  }
  function onexitdefinitiontitlestring() {
    var data = this.resume();
    this.stack[this.stack.length - 1].title = data;
  }
  function onexitdefinitiondestinationstring() {
    var data = this.resume();
    this.stack[this.stack.length - 1].url = data;
  }
  function onexitatxheadingsequence(token) {
    if (!this.stack[this.stack.length - 1].depth) {
      this.stack[this.stack.length - 1].depth = this.sliceSerialize(token).length;
    }
  }
  function onexitsetextheadingtext() {
    setData('setextHeadingSlurpLineEnding', true);
  }
  function onexitsetextheadinglinesequence(token) {
    this.stack[this.stack.length - 1].depth = this.sliceSerialize(token).charCodeAt(0) === 61 ? 1 : 2;
  }
  function onexitsetextheading() {
    setData('setextHeadingSlurpLineEnding');
  }
  function onenterdata(token) {
    var siblings = this.stack[this.stack.length - 1].children;
    var tail = siblings[siblings.length - 1];
    if (!tail || tail.type !== 'text') {
      // Add a new text node.
      tail = text();
      tail.position = {
        start: point(token.start)
      };
      this.stack[this.stack.length - 1].children.push(tail);
    }
    this.stack.push(tail);
  }
  function onexitdata(token) {
    var tail = this.stack.pop();
    tail.value += this.sliceSerialize(token);
    tail.position.end = point(token.end);
  }
  function onexitlineending(token) {
    var context = this.stack[this.stack.length - 1];
    // If we’re at a hard break, include the line ending in there.
    if (getData('atHardBreak')) {
      context.children[context.children.length - 1].position.end = point(token.end);
      setData('atHardBreak');
      return;
    }
    if (!getData('setextHeadingSlurpLineEnding') && config.canContainEols.indexOf(context.type) > -1) {
      onenterdata.call(this, token);
      onexitdata.call(this, token);
    }
  }
  function onexithardbreak() {
    setData('atHardBreak', true);
  }
  function onexithtmlflow() {
    var data = this.resume();
    this.stack[this.stack.length - 1].value = data;
  }
  function onexithtmltext() {
    var data = this.resume();
    this.stack[this.stack.length - 1].value = data;
  }
  function onexitcodetext() {
    var data = this.resume();
    this.stack[this.stack.length - 1].value = data;
  }
  function onexitlink() {
    var context = this.stack[this.stack.length - 1];
    // To do: clean.
    if (getData('inReference')) {
      context.type += 'Reference';
      context.referenceType = getData('referenceType') || 'shortcut';
      delete context.url;
      delete context.title;
    } else {
      delete context.identifier;
      delete context.label;
      delete context.referenceType;
    }
    setData('referenceType');
  }
  function onexitimage() {
    var context = this.stack[this.stack.length - 1];
    // To do: clean.
    if (getData('inReference')) {
      context.type += 'Reference';
      context.referenceType = getData('referenceType') || 'shortcut';
      delete context.url;
      delete context.title;
    } else {
      delete context.identifier;
      delete context.label;
      delete context.referenceType;
    }
    setData('referenceType');
  }
  function onexitlabeltext(token) {
    this.stack[this.stack.length - 2].identifier = $dd5fd051794caf77c245ee698a159bd4$var$normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
  }
  function onexitlabel() {
    var fragment = this.stack[this.stack.length - 1];
    var value = this.resume();
    this.stack[this.stack.length - 1].label = value;
    // Assume a reference.
    setData('inReference', true);
    if (this.stack[this.stack.length - 1].type === 'link') {
      this.stack[this.stack.length - 1].children = fragment.children;
    } else {
      this.stack[this.stack.length - 1].alt = value;
    }
  }
  function onexitresourcedestinationstring() {
    var data = this.resume();
    this.stack[this.stack.length - 1].url = data;
  }
  function onexitresourcetitlestring() {
    var data = this.resume();
    this.stack[this.stack.length - 1].title = data;
  }
  function onexitresource() {
    setData('inReference');
  }
  function onenterreference() {
    setData('referenceType', 'collapsed');
  }
  function onexitreferencestring(token) {
    var label = this.resume();
    this.stack[this.stack.length - 1].label = label;
    this.stack[this.stack.length - 1].identifier = $dd5fd051794caf77c245ee698a159bd4$var$normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
    setData('referenceType', 'full');
  }
  function onexitcharacterreferencemarker(token) {
    setData('characterReferenceType', token.type);
  }
  function onexitcharacterreferencevalue(token) {
    var data = this.sliceSerialize(token);
    var type = getData('characterReferenceType');
    var value;
    var tail;
    if (type) {
      value = $dd5fd051794caf77c245ee698a159bd4$var$safeFromInt(data, type === 'characterReferenceMarkerNumeric' ? 10 : 16);
      setData('characterReferenceType');
    } else {
      value = $dd5fd051794caf77c245ee698a159bd4$var$decode(data);
    }
    tail = this.stack.pop();
    tail.value += value;
    tail.position.end = point(token.end);
  }
  function onexitautolinkprotocol(token) {
    onexitdata.call(this, token);
    this.stack[this.stack.length - 1].url = this.sliceSerialize(token);
  }
  function onexitautolinkemail(token) {
    onexitdata.call(this, token);
    this.stack[this.stack.length - 1].url = 'mailto:' + this.sliceSerialize(token);
  }
  //
  // Creaters.
  //
  function blockQuote() {
    return {
      type: 'blockquote',
      children: []
    };
  }
  function codeFlow() {
    return {
      type: 'code',
      lang: null,
      meta: null,
      value: ''
    };
  }
  function codeText() {
    return {
      type: 'inlineCode',
      value: ''
    };
  }
  function definition() {
    return {
      type: 'definition',
      identifier: '',
      label: null,
      title: null,
      url: ''
    };
  }
  function emphasis() {
    return {
      type: 'emphasis',
      children: []
    };
  }
  function heading() {
    return {
      type: 'heading',
      depth: undefined,
      children: []
    };
  }
  function hardBreak() {
    return {
      type: 'break'
    };
  }
  function html() {
    return {
      type: 'html',
      value: ''
    };
  }
  function image() {
    return {
      type: 'image',
      title: null,
      url: '',
      alt: null
    };
  }
  function link() {
    return {
      type: 'link',
      title: null,
      url: '',
      children: []
    };
  }
  function list(token) {
    return {
      type: 'list',
      ordered: token.type === 'listOrdered',
      start: null,
      spread: token._spread,
      children: []
    };
  }
  function listItem(token) {
    return {
      type: 'listItem',
      spread: token._spread,
      checked: null,
      children: []
    };
  }
  function paragraph() {
    return {
      type: 'paragraph',
      children: []
    };
  }
  function strong() {
    return {
      type: 'strong',
      children: []
    };
  }
  function text() {
    return {
      type: 'text',
      value: ''
    };
  }
  function thematicBreak() {
    return {
      type: 'thematicBreak'
    };
  }
}
function $dd5fd051794caf77c245ee698a159bd4$var$configure(config, extensions) {
  var index = -1;
  while (++index < extensions.length) {
    $dd5fd051794caf77c245ee698a159bd4$var$extension(config, extensions[index]);
  }
  return config;
}
function $dd5fd051794caf77c245ee698a159bd4$var$extension(config, extension) {
  var key;
  var left;
  for (key in extension) {
    left = $1be1b063e9fa6a88634b3c76ad07318d$exports.call(config, key) ? config[key] : config[key] = {};
    if (key === 'canContainEols' || key === 'transforms') {
      config[key] = [].concat(left, extension[key]);
    } else {
      Object.assign(left, extension[key]);
    }
  }
}
$e7e666dff6ee8cbe6aeaa3b6285d3fa9$exports = $dd5fd051794caf77c245ee698a159bd4$exports;
var $78a0bd91eb53bef2323e6b0ada7545f7$var$fromMarkdown = $e7e666dff6ee8cbe6aeaa3b6285d3fa9$exports;
function $78a0bd91eb53bef2323e6b0ada7545f7$var$parse(options) {
  var self = this;
  this.Parser = parse;
  function parse(doc) {
    return $78a0bd91eb53bef2323e6b0ada7545f7$var$fromMarkdown(doc, Object.assign({}, self.data('settings'), options, {
      // Note: these options are not in the readme.
      // The goal is for them to be set by plugins on `data` instead of being
      // passed by users.
      extensions: self.data('micromarkExtensions') || [],
      mdastExtensions: self.data('fromMarkdownExtensions') || []
    }));
  }
}
var $78a0bd91eb53bef2323e6b0ada7545f7$$interop$default = /*@__PURE__*/$parcel$interopDefault($78a0bd91eb53bef2323e6b0ada7545f7$exports);
// ASSET: ../remark-slate/node_modules/escape-html/index.js
var $aff676c8df1abcbe782bd3818f307006$exports = {};
/**
* Module variables.
* @private
*/
var $aff676c8df1abcbe782bd3818f307006$var$matchHtmlRegExp = /["'&<>]/;
/**
* Module exports.
* @public
*/
$aff676c8df1abcbe782bd3818f307006$exports = $aff676c8df1abcbe782bd3818f307006$var$escapeHtml;
/**
* Escape special characters in the given string of html.
*
* @param  {string} string The string to escape for inserting into HTML
* @return {string}
* @public
*/
function $aff676c8df1abcbe782bd3818f307006$var$escapeHtml(string) {
  var str = '' + string;
  var match = $aff676c8df1abcbe782bd3818f307006$var$matchHtmlRegExp.exec(str);
  if (!match) {
    return str;
  }
  var escape;
  var html = '';
  var index = 0;
  var lastIndex = 0;
  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34:
        // "
        escape = '&quot;';
        break;
      case 38:
        // &
        escape = '&amp;';
        break;
      case 39:
        // '
        escape = '&#39;';
        break;
      case 60:
        // <
        escape = '&lt;';
        break;
      case 62:
        // >
        escape = '&gt;';
        break;
      default:
        continue;
    }
    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }
    lastIndex = index + 1;
    html += escape;
  }
  return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
}
var $aff676c8df1abcbe782bd3818f307006$$interop$default = /*@__PURE__*/$parcel$interopDefault($aff676c8df1abcbe782bd3818f307006$exports);
function $ab4011b0d0b5b0b6530e1287638e9dc8$var$_extends() {
  $ab4011b0d0b5b0b6530e1287638e9dc8$var$_extends = Object.assign || (function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  });
  return $ab4011b0d0b5b0b6530e1287638e9dc8$var$_extends.apply(this, arguments);
}
var $ab4011b0d0b5b0b6530e1287638e9dc8$export$defaultNodeTypes = {
  paragraph: 'paragraph',
  block_quote: 'block_quote',
  code_block: 'code_block',
  link: 'link',
  ul_list: 'ul_list',
  ol_list: 'ol_list',
  listItem: 'list_item',
  heading: {
    1: 'heading_one',
    2: 'heading_two',
    3: 'heading_three',
    4: 'heading_four',
    5: 'heading_five',
    6: 'heading_six'
  },
  emphasis_mark: 'italic',
  strong_mark: 'bold',
  delete_mark: 'strikeThrough',
  inline_code_mark: 'code',
  thematic_break: 'thematic_break',
  image: 'image'
};
function $ab4011b0d0b5b0b6530e1287638e9dc8$export$deserialize(node, opts) {
  var _opts$nodeTypes, _opts$linkDestination, _opts$imageSourceKey, _opts$imageCaptionKey, _ref, _ref2, _node$value, _extends2, _extends3, _extends4, _extends5;
  var types = $ab4011b0d0b5b0b6530e1287638e9dc8$var$_extends({}, $ab4011b0d0b5b0b6530e1287638e9dc8$export$defaultNodeTypes, opts === null || opts === void 0 ? void 0 : opts.nodeTypes, {
    heading: $ab4011b0d0b5b0b6530e1287638e9dc8$var$_extends({}, $ab4011b0d0b5b0b6530e1287638e9dc8$export$defaultNodeTypes.heading, opts === null || opts === void 0 ? void 0 : (_opts$nodeTypes = opts.nodeTypes) === null || _opts$nodeTypes === void 0 ? void 0 : _opts$nodeTypes.heading)
  });
  var linkDestinationKey = (_opts$linkDestination = opts === null || opts === void 0 ? void 0 : opts.linkDestinationKey) !== null && _opts$linkDestination !== void 0 ? _opts$linkDestination : 'link';
  var imageSourceKey = (_opts$imageSourceKey = opts === null || opts === void 0 ? void 0 : opts.imageSourceKey) !== null && _opts$imageSourceKey !== void 0 ? _opts$imageSourceKey : 'link';
  var imageCaptionKey = (_opts$imageCaptionKey = opts === null || opts === void 0 ? void 0 : opts.imageCaptionKey) !== null && _opts$imageCaptionKey !== void 0 ? _opts$imageCaptionKey : 'caption';
  var children = [{
    text: ''
  }];
  if (node.children && Array.isArray(node.children) && node.children.length > 0) {
    // @ts-ignore
    children = node.children.map(function (c) {
      return $ab4011b0d0b5b0b6530e1287638e9dc8$export$deserialize($ab4011b0d0b5b0b6530e1287638e9dc8$var$_extends({}, c, {
        ordered: node.ordered || false
      }), opts);
    });
  }
  switch (node.type) {
    case 'heading':
      return {
        type: types.heading[node.depth || 1],
        children: children
      };
    case 'list':
      return {
        type: node.ordered ? types.ol_list : types.ul_list,
        children: children
      };
    case 'listItem':
      return {
        type: types.listItem,
        children: children
      };
    case 'paragraph':
      return {
        type: types.paragraph,
        children: children
      };
    case 'link':
      return (_ref = {
        type: types.link
      }, _ref[linkDestinationKey] = node.url, _ref.children = children, _ref);
    case 'image':
      return (_ref2 = {
        type: types.image,
        children: [{
          text: ''
        }]
      }, _ref2[imageSourceKey] = node.url, _ref2[imageCaptionKey] = node.alt, _ref2);
    case 'blockquote':
      return {
        type: types.block_quote,
        children: children
      };
    case 'code':
      return {
        type: types.code_block,
        language: node.lang,
        children: [{
          text: node.value
        }]
      };
    case 'html':
      if ((_node$value = node.value) !== null && _node$value !== void 0 && _node$value.includes('<br>')) {
        var _node$value2;
        return {
          "break": true,
          type: types.paragraph,
          children: [{
            text: ((_node$value2 = node.value) === null || _node$value2 === void 0 ? void 0 : _node$value2.replace(/<br>/g, '')) || ''
          }]
        };
      }
      return {
        type: 'paragraph',
        children: [{
          text: node.value || ''
        }]
      };
    case 'emphasis':
      return $ab4011b0d0b5b0b6530e1287638e9dc8$var$_extends((_extends2 = {}, _extends2[types.emphasis_mark] = true, _extends2), $ab4011b0d0b5b0b6530e1287638e9dc8$var$forceLeafNode(children), $ab4011b0d0b5b0b6530e1287638e9dc8$var$persistLeafFormats(children));
    case 'strong':
      return $ab4011b0d0b5b0b6530e1287638e9dc8$var$_extends((_extends3 = {}, _extends3[types.strong_mark] = true, _extends3), $ab4011b0d0b5b0b6530e1287638e9dc8$var$forceLeafNode(children), $ab4011b0d0b5b0b6530e1287638e9dc8$var$persistLeafFormats(children));
    case 'delete':
      return $ab4011b0d0b5b0b6530e1287638e9dc8$var$_extends((_extends4 = {}, _extends4[types.delete_mark] = true, _extends4), $ab4011b0d0b5b0b6530e1287638e9dc8$var$forceLeafNode(children), $ab4011b0d0b5b0b6530e1287638e9dc8$var$persistLeafFormats(children));
    case 'inlineCode':
      return $ab4011b0d0b5b0b6530e1287638e9dc8$var$_extends((_extends5 = {}, _extends5[types.inline_code_mark] = true, _extends5.text = node.value, _extends5), $ab4011b0d0b5b0b6530e1287638e9dc8$var$persistLeafFormats(children));
    case 'thematicBreak':
      return {
        type: types.thematic_break,
        children: [{
          text: ''
        }]
      };
    case 'text':
    default:
      return {
        text: node.value || ''
      };
  }
}
var $ab4011b0d0b5b0b6530e1287638e9dc8$var$forceLeafNode = function forceLeafNode(children) {
  return {
    text: children.map(function (k) {
      return k === null || k === void 0 ? void 0 : k.text;
    }).join('')
  };
};
// This function is will take any unknown keys, and bring them up a level
// allowing leaf nodes to have many different formats at once
// for example, bold and italic on the same node
function $ab4011b0d0b5b0b6530e1287638e9dc8$var$persistLeafFormats(children) {
  return children.reduce(function (acc, node) {
    Object.keys(node).forEach(function (key) {
      if (key === 'children' || key === 'type' || key === 'text') return;
      // @ts-ignore
      acc[key] = node[key];
    });
    return acc;
  }, {});
}
var $ab4011b0d0b5b0b6530e1287638e9dc8$var$isLeafNode = function isLeafNode(node) {
  return typeof node.text === 'string';
};
var $ab4011b0d0b5b0b6530e1287638e9dc8$var$VOID_ELEMENTS = ['thematic_break'];
var $ab4011b0d0b5b0b6530e1287638e9dc8$var$BREAK_TAG = '<br>';
function $ab4011b0d0b5b0b6530e1287638e9dc8$export$serialize(chunk, opts) {
  if (opts === void 0) {
    opts = {
      nodeTypes: $ab4011b0d0b5b0b6530e1287638e9dc8$export$defaultNodeTypes
    };
  }
  var _opts = opts, _opts$nodeTypes = _opts.nodeTypes, userNodeTypes = _opts$nodeTypes === void 0 ? $ab4011b0d0b5b0b6530e1287638e9dc8$export$defaultNodeTypes : _opts$nodeTypes, _opts$ignoreParagraph = _opts.ignoreParagraphNewline, ignoreParagraphNewline = _opts$ignoreParagraph === void 0 ? false : _opts$ignoreParagraph, _opts$listDepth = _opts.listDepth, listDepth = _opts$listDepth === void 0 ? 0 : _opts$listDepth;
  var text = chunk.text || '';
  var type = chunk.type || '';
  var nodeTypes = $ab4011b0d0b5b0b6530e1287638e9dc8$var$_extends({}, $ab4011b0d0b5b0b6530e1287638e9dc8$export$defaultNodeTypes, userNodeTypes, {
    heading: $ab4011b0d0b5b0b6530e1287638e9dc8$var$_extends({}, $ab4011b0d0b5b0b6530e1287638e9dc8$export$defaultNodeTypes.heading, userNodeTypes.heading)
  });
  var LIST_TYPES = [nodeTypes.ul_list, nodeTypes.ol_list];
  var children = text;
  if (!$ab4011b0d0b5b0b6530e1287638e9dc8$var$isLeafNode(chunk)) {
    children = chunk.children.map(function (c) {
      var isList = !$ab4011b0d0b5b0b6530e1287638e9dc8$var$isLeafNode(c) ? LIST_TYPES.includes(c.type || '') : false;
      var selfIsList = LIST_TYPES.includes(chunk.type || '');
      // Links can have the following shape
      // In which case we don't want to surround
      // with break tags
      // {
      // type: 'paragraph',
      // children: [
      // { text: '' },
      // { type: 'link', children: [{ text: foo.com }]}
      // { text: '' }
      // ]
      // }
      var childrenHasLink = false;
      if (!$ab4011b0d0b5b0b6530e1287638e9dc8$var$isLeafNode(chunk) && Array.isArray(chunk.children)) {
        childrenHasLink = chunk.children.some(function (f) {
          return !$ab4011b0d0b5b0b6530e1287638e9dc8$var$isLeafNode(f) && f.type === nodeTypes.link;
        });
      }
      return $ab4011b0d0b5b0b6530e1287638e9dc8$export$serialize($ab4011b0d0b5b0b6530e1287638e9dc8$var$_extends({}, c, {
        parentType: type
      }), {
        nodeTypes: nodeTypes,
        // WOAH.
        // what we're doing here is pretty tricky, it relates to the block below where
        // we check for ignoreParagraphNewline and set type to paragraph.
        // We want to strip out empty paragraphs sometimes, but other times we don't.
        // If we're the descendant of a list, we know we don't want a bunch
        // of whitespace. If we're parallel to a link we also don't want
        // to respect neighboring paragraphs
        ignoreParagraphNewline: (ignoreParagraphNewline || isList || selfIsList || childrenHasLink) && // if we have c.break, never ignore empty paragraph new line
        !c["break"],
        // track depth of nested lists so we can add proper spacing
        listDepth: LIST_TYPES.includes(c.type || '') ? listDepth + 1 : listDepth
      });
    }).join('');
  }
  // This is pretty fragile code, check the long comment where we iterate over children
  if (!ignoreParagraphNewline && (text === '' || text === '\n') && chunk.parentType === nodeTypes.paragraph) {
    type = nodeTypes.paragraph;
    children = $ab4011b0d0b5b0b6530e1287638e9dc8$var$BREAK_TAG;
  }
  if (children === '' && !$ab4011b0d0b5b0b6530e1287638e9dc8$var$VOID_ELEMENTS.find(function (k) {
    return nodeTypes[k] === type;
  })) return;
  // Never allow decorating break tags with rich text formatting,
  // this can malform generated markdown
  // Also ensure we're only ever applying text formatting to leaf node
  // level chunks, otherwise we can end up in a situation where
  // we try applying formatting like to a node like this:
  // "Text foo bar **baz**" resulting in "**Text foo bar **baz****"
  // which is invalid markup and can mess everything up
  if (children !== $ab4011b0d0b5b0b6530e1287638e9dc8$var$BREAK_TAG && $ab4011b0d0b5b0b6530e1287638e9dc8$var$isLeafNode(chunk)) {
    if (chunk.strikeThrough && chunk.bold && chunk.italic) {
      children = $ab4011b0d0b5b0b6530e1287638e9dc8$var$retainWhitespaceAndFormat(children, '~~***');
    } else if (chunk.bold && chunk.italic) {
      children = $ab4011b0d0b5b0b6530e1287638e9dc8$var$retainWhitespaceAndFormat(children, '***');
    } else {
      if (chunk.bold) {
        children = $ab4011b0d0b5b0b6530e1287638e9dc8$var$retainWhitespaceAndFormat(children, '**');
      }
      if (chunk.italic) {
        children = $ab4011b0d0b5b0b6530e1287638e9dc8$var$retainWhitespaceAndFormat(children, '_');
      }
      if (chunk.strikeThrough) {
        children = $ab4011b0d0b5b0b6530e1287638e9dc8$var$retainWhitespaceAndFormat(children, '~~');
      }
      if (chunk.code) {
        children = $ab4011b0d0b5b0b6530e1287638e9dc8$var$retainWhitespaceAndFormat(children, '`');
      }
    }
  }
  switch (type) {
    case nodeTypes.heading[1]:
      return "# " + children + "\n";
    case nodeTypes.heading[2]:
      return "## " + children + "\n";
    case nodeTypes.heading[3]:
      return "### " + children + "\n";
    case nodeTypes.heading[4]:
      return "#### " + children + "\n";
    case nodeTypes.heading[5]:
      return "##### " + children + "\n";
    case nodeTypes.heading[6]:
      return "###### " + children + "\n";
    case nodeTypes.block_quote:
      // For some reason, marked is parsing blockquotes w/ one new line
      // as contiued blockquotes, so adding two new lines ensures that doesn't
      // happen
      return "> " + children + "\n\n";
    case nodeTypes.code_block:
      return "```" + (chunk.language || '') + "\n" + children + "\n```\n";
    case nodeTypes.link:
      return "[" + children + "](" + (chunk.link || '') + ")";
    case nodeTypes.image:
      return "![" + chunk.caption + "](" + (chunk.link || '') + ")";
    case nodeTypes.ul_list:
    case nodeTypes.ol_list:
      return "\n" + children + "\n";
    case nodeTypes.listItem:
      var isOL = chunk && chunk.parentType === nodeTypes.ol_list;
      var spacer = '';
      for (var k = 0; listDepth > k; k++) {
        if (isOL) {
          // https://github.com/remarkjs/remark-react/issues/65
          spacer += '   ';
        } else {
          spacer += '  ';
        }
      }
      return "" + spacer + (isOL ? '1.' : '-') + " " + children;
    case nodeTypes.paragraph:
      return children + "\n";
    case nodeTypes.thematic_break:
      return "---\n";
    default:
      return $aff676c8df1abcbe782bd3818f307006$$interop$default(children);
  }
}
// This function handles the case of a string like this: "   foo   "
// Where it would be invalid markdown to generate this: "**   foo   **"
// We instead, want to trim the whitespace out, apply formatting, and then
// bring the whitespace back. So our returned string looks like this: "   **foo**   "
function $ab4011b0d0b5b0b6530e1287638e9dc8$var$retainWhitespaceAndFormat(string, format) {
  // we keep this for a comparison later
  var frozenString = string.trim();
  // children will be mutated
  var children = frozenString;
  // We reverse the right side formatting, to properly handle bold/italic and strikeThrough
  // formats, so we can create ~~***FooBar***~~
  var fullFormat = "" + format + children + $ab4011b0d0b5b0b6530e1287638e9dc8$var$reverseStr(format);
  // This conditions accounts for no whitespace in our string
  // if we don't have any, we can return early.
  if (children.length === string.length) {
    return fullFormat;
  }
  // if we do have whitespace, let's add our formatting around our trimmed string
  // We reverse the right side formatting, to properly handle bold/italic and strikeThrough
  // formats, so we can create ~~***FooBar***~~
  var formattedString = format + children + $ab4011b0d0b5b0b6530e1287638e9dc8$var$reverseStr(format);
  // and replace the non-whitespace content of the string
  return string.replace(frozenString, formattedString);
}
var $ab4011b0d0b5b0b6530e1287638e9dc8$var$reverseStr = function reverseStr(string) {
  return string.split('').reverse().join('');
};
function $ab4011b0d0b5b0b6530e1287638e9dc8$export$default(opts) {
  var compiler = function compiler(node) {
    return node.children.map(function (c) {
      return $ab4011b0d0b5b0b6530e1287638e9dc8$export$deserialize(c, opts);
    });
  };
  // @ts-ignore
  this.Compiler = compiler;
}
function $cae8a8fa0ab69904f3edf89f8901ad0d$var$addIds(children, lastId) {
  let currId = lastId;
  for (let node of children) {
    if (node.children) {
      currId++;
      node.id = currId;
      currId = $cae8a8fa0ab69904f3edf89f8901ad0d$var$addIds(node.children, currId);
    }
  }
  return currId;
}
function _default(markdownString) {
  // @ts-ignore
  let parsed = $0e83540398b72d6c7ff5b7960200199e$$interop$default().use($78a0bd91eb53bef2323e6b0ada7545f7$$interop$default).use($ab4011b0d0b5b0b6530e1287638e9dc8$export$default, {
    nodeTypes: {
      paragraph: "p",
      block_quote: "blockquote",
      link: "a",
      image: "img",
      code_block: "code_block",
      ul_list: "ul",
      ol_list: "ol",
      listItem: "li",
      heading: {
        1: "h2",
        2: "h3",
        3: "h4",
        4: "h5",
        5: "h6"
      }
    },
    linkDestinationKey: 'url',
    imageSourceKey: 'url'
  }).processSync(markdownString).result;
  $cae8a8fa0ab69904f3edf89f8901ad0d$var$addIds(parsed, 0);
  return parsed;
}
module.exports = _default;
