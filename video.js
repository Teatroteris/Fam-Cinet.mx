/**
 * @license
 * Video.js 7.2.3 <http://videojs.com/>
 * Copyright Brightcove, Inc. <https://www.brightcove.com/>
 * Available under Apache License Version 2.0
 * <https://github.com/videojs/video.js/blob/master/LICENSE>
 *
 * Includes vtt.js <https://github.com/mozilla/vtt.js>
 * Available under Apache License Version 2.0
 * <https://github.com/mozilla/vtt.js/blob/master/LICENSE>
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.videojs = factory());
}(this, (function () {
  var version = "7.2.3";

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var win;

  if (typeof window !== "undefined") {
      win = window;
  } else if (typeof commonjsGlobal !== "undefined") {
      win = commonjsGlobal;
  } else if (typeof self !== "undefined") {
      win = self;
  } else {
      win = {};
  }

  var window_1 = win;

  var empty = {};

  var empty$1 = /*#__PURE__*/Object.freeze({
    default: empty
  });

  var minDoc = ( empty$1 && empty ) || empty$1;

  var topLevel = typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof window !== 'undefined' ? window : {};

  var doccy;

  if (typeof document !== 'undefined') {
      doccy = document;
  } else {
      doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

      if (!doccy) {
          doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
      }
  }

  var document_1 = doccy;

  /**
   * @file log.js
   * @module log
   */

  var log = void 0;

  // This is the private tracking variable for logging level.
  var level = 'info';

  // This is the private tracking variable for the logging history.
  var history = [];

  /**
   * Log messages to the console and history based on the type of message
   *
   * @private
   * @param  {string} type
   *         The name of the console method to use.
   *
   * @param  {Array} args
   *         The arguments to be passed to the matching console method.
   */
  var logByType = function logByType(type, args) {
    var lvl = log.levels[level];
    var lvlRegExp = new RegExp('^(' + lvl + ')$');

    if (type !== 'log') {

      // Add the type to the front of the message when it's not "log".
      args.unshift(type.toUpperCase() + ':');
    }

    // Add a clone of the args at this point to history.
    if (history) {
      history.push([].concat(args));
    }

    // Add console prefix after adding to history.
    args.unshift('VIDEOJS:');

    // If there's no console then don't try to output messages, but they will
    // still be stored in history.
    if (!window_1.console) {
      return;
    }

    // Was setting these once outside of this function, but containing them
    // in the function makes it easier to test cases where console doesn't exist
    // when the module is executed.
    var fn = window_1.console[type];

    if (!fn && type === 'debug') {
      // Certain browsers don't have support for console.debug. For those, we
      // should default to the closest comparable log.
      fn = window_1.console.info || window_1.console.log;
    }

    // Bail out if there's no console or if this type is not allowed by the
    // current logging level.
    if (!fn || !lvl || !lvlRegExp.test(type)) {
      return;
    }

    fn[Array.isArray(args) ? 'apply' : 'call'](window_1.console, args);
  };

  /**
   * Logs plain debug messages. Similar to `console.log`.
   *
   * @class
   * @param    {Mixed[]} args
   *           One or more messages or objects that should be logged.
   */
  log = function log() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    logByType('log', args);
  };

  /**
   * Enumeration of available logging levels, where the keys are the level names
   * and the values are `|`-separated strings containing logging methods allowed
   * in that logging level. These strings are used to create a regular expression
   * matching the function name being called.
   *
   * Levels provided by video.js are:
   *
   * - `off`: Matches no calls. Any value that can be cast to `false` will have
   *   this effect. The most restrictive.
   * - `all`: Matches only Video.js-provided functions (`debug`, `log`,
   *   `log.warn`, and `log.error`).
   * - `debug`: Matches `log.debug`, `log`, `log.warn`, and `log.error` calls.
   * - `info` (default): Matches `log`, `log.warn`, and `log.error` calls.
   * - `warn`: Matches `log.warn` and `log.error` calls.
   * - `error`: Matches only `log.error` calls.
   *
   * @type {Object}
   */
  log.levels = {
    all: 'debug|log|warn|error',
    off: '',
    debug: 'debug|log|warn|error',
    info: 'log|warn|error',
    warn: 'warn|error',
    error: 'error',
    DEFAULT: level
  };

  /**
   * Get or set the current logging level. If a string matching a key from
   * {@link log.levels} is provided, acts as a setter. Regardless of argument,
   * returns the current logging level.
   *
   * @param  {string} [lvl]
   *         Pass to set a new logging level.
   *
   * @return {string}
   *         The current logging level.
   */
  log.level = function (lvl) {
    if (typeof lvl === 'string') {
      if (!log.levels.hasOwnProperty(lvl)) {
        throw new Error('"' + lvl + '" in not a valid log level');
      }
      level = lvl;
    }
    return level;
  };

  /**
   * Returns an array containing everything that has been logged to the history.
   *
   * This array is a shallow clone of the internal history record. However, its
   * contents are _not_ cloned; so, mutating objects inside this array will
   * mutate them in history.
   *
   * @return {Array}
   */
  log.history = function () {
    return history ? [].concat(history) : [];
  };

  /**
   * Clears the internal history tracking, but does not prevent further history
   * tracking.
   */
  log.history.clear = function () {
    if (history) {
      history.length = 0;
    }
  };

  /**
   * Disable history tracking if it is currently enabled.
   */
  log.history.disable = function () {
    if (history !== null) {
      history.length = 0;
      history = null;
    }
  };

  /**
   * Enable history tracking if it is currently disabled.
   */
  log.history.enable = function () {
    if (history === null) {
      history = [];
    }
  };

  /**
   * Logs error messages. Similar to `console.error`.
   *
   * @param {Mixed[]} args
   *        One or more messages or objects that should be logged as an error
   */
  log.error = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return logByType('error', args);
  };

  /**
   * Logs warning messages. Similar to `console.warn`.
   *
   * @param {Mixed[]} args
   *        One or more messages or objects that should be logged as a warning.
   */
  log.warn = function () {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return logByType('warn', args);
  };

  /**
   * Logs debug messages. Similar to `console.debug`, but may also act as a comparable
   * log if `console.debug` is not available
   *
   * @param {Mixed[]} args
   *        One or more messages or objects that should be logged as debug.
   */
  log.debug = function () {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return logByType('debug', args);
  };

  var log$1 = log;

  function clean(s) {
    return s.replace(/\n\r?\s*/g, '');
  }

  var tsml = function tsml(sa) {
    var s = '',
        i = 0;

    for (; i < arguments.length; i++) {
      s += clean(sa[i]) + (arguments[i + 1] || '');
    }return s;
  };

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  var taggedTemplateLiteralLoose = function (strings, raw) {
    strings.raw = raw;
    return strings;
  };

  /**
   * @file obj.js
   * @module obj
   */

  /**
   * @callback obj:EachCallback
   *
   * @param {Mixed} value
   *        The current key for the object that is being iterated over.
   *
   * @param {string} key
   *        The current key-value for object that is being iterated over
   */

  /**
   * @callback obj:ReduceCallback
   *
   * @param {Mixed} accum
   *        The value that is accumulating over the reduce loop.
   *
   * @par…
