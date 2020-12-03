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
})({"../../src/createElement.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTextElement = exports.createElement = exports.TEXT_ELEMENT_LITERAL = void 0;

var createElement = function createElement(type, props) {
  var children = [];

  for (var _i = 2; _i < arguments.length; _i++) {
    children[_i - 2] = arguments[_i];
  }

  return {
    type: type,
    props: __assign(__assign({}, props), {
      children: children.map(function (child) {
        return _typeof(child) === 'object' ? child : createTextElement(child);
      })
    })
  };
};

exports.createElement = createElement;
exports.TEXT_ELEMENT_LITERAL = "TEXT_ELEMENT";

var createTextElement = function createTextElement(text) {
  return {
    type: exports.TEXT_ELEMENT_LITERAL,
    props: {
      nodeValue: text,
      children: []
    }
  };
};

exports.createTextElement = createTextElement;
},{}],"../../src/fiberMeta.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWipRoot = exports.setWipRoot = exports.getNextUnitWork = exports.setNextUnitWork = exports.getCurrentRoot = exports.setCurrentRoot = exports.getDeletions = exports.setDeletions = void 0; // next fiber

var nextUnitWork = null; // root fiber

var wipRoot = null;
var currentRoot = null;
var deletions = [];

var setDeletions = function setDeletions(fibers) {
  deletions = fibers;
};

exports.setDeletions = setDeletions;

var getDeletions = function getDeletions() {
  return deletions;
};

exports.getDeletions = getDeletions;

var setCurrentRoot = function setCurrentRoot(root) {
  currentRoot = root;
};

exports.setCurrentRoot = setCurrentRoot;

var getCurrentRoot = function getCurrentRoot() {
  return currentRoot;
};

exports.getCurrentRoot = getCurrentRoot;

var setNextUnitWork = function setNextUnitWork(unitWork) {
  nextUnitWork = unitWork;
};

exports.setNextUnitWork = setNextUnitWork;

var getNextUnitWork = function getNextUnitWork() {
  return nextUnitWork;
};

exports.getNextUnitWork = getNextUnitWork;

var setWipRoot = function setWipRoot(root) {
  wipRoot = root;
};

exports.setWipRoot = setWipRoot;

var getWipRoot = function getWipRoot() {
  return wipRoot;
};

exports.getWipRoot = getWipRoot;
},{}],"../../src/createDOM.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateDOM = exports.createDOM = void 0;

var createElement_1 = require("./createElement");

var isProperty = function isProperty(key) {
  return key !== 'children' && !isEvent(key);
};

var isNew = function isNew(prev, next) {
  return function (key) {
    return prev[key] !== next[key];
  };
};

var isGone = function isGone(prev, next) {
  return function (key) {
    return !(key in next);
  };
};

var isEvent = function isEvent(key) {
  return key.startsWith("on");
};

var createDOM = function createDOM(fiber) {
  var dom;

  if (fiber.type === createElement_1.TEXT_ELEMENT_LITERAL) {
    dom = document.createTextNode(fiber.props.nodeValue);
  } else {
    var innerDom_1 = dom = document.createElement(fiber.type);
    Object.keys(fiber.props).filter(isProperty).forEach(function (name) {
      return innerDom_1.setAttribute(name, fiber.props[name]);
    });
  }

  return dom;
};

exports.createDOM = createDOM;

var updateDOM = function updateDOM(dom, prevProps, nextProps) {
  if (!prevProps || !nextProps) return; // remove old or changed event listeners

  Object.keys(prevProps).filter(isEvent).filter(function (key) {
    return !(key in nextProps) || isNew(prevProps, nextProps)(key);
  }).forEach(function (name) {
    var eventType = name.toLowerCase().substr(2);
    dom.removeEventListener(eventType, prevProps[name]);
  }); // add event listeners

  Object.keys(nextProps).filter(isEvent).filter(isNew(prevProps, nextProps)).forEach(function (name) {
    var eventType = name.toLowerCase().substring(2);
    dom.addEventListener(eventType, nextProps[name]);
  }); // remove old properties

  Object.keys(prevProps).filter(isProperty).filter(isGone(prevProps, nextProps)).forEach(function (name) {
    return dom[name] = "";
  }); // set new or changed properties

  Object.keys(nextProps).filter(isProperty).filter(isNew(prevProps, nextProps)).forEach(function (name) {
    dom[name] = nextProps[name];
  });
};

exports.updateDOM = updateDOM;
},{"./createElement":"../../src/createElement.ts"}],"../../src/concurrent.ts":[function(require,module,exports) {
"use strict";

var __spreadArrays = this && this.__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.workLoop = void 0;

var createDOM_1 = require("./createDOM");

var fiberMeta_1 = require("./fiberMeta");

var commitWork = function commitWork(fiber) {
  var _a, _b;

  if (!fiber) return;
  var domParent = (_a = fiber.parent) === null || _a === void 0 ? void 0 : _a.dom;

  if (fiber.effectTag === "PLACEMENT" && !!fiber.dom) {
    domParent === null || domParent === void 0 ? void 0 : domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "DELETION" && !!fiber.dom) {
    domParent === null || domParent === void 0 ? void 0 : domParent.removeChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && !!fiber.dom) {
    createDOM_1.updateDOM(fiber.dom, (_b = fiber.alternate) === null || _b === void 0 ? void 0 : _b.props, fiber.props);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
};

var commitRoot = function commitRoot() {
  // add nodes to dom
  fiberMeta_1.getDeletions().forEach(commitWork);
  console.log("deletion", fiberMeta_1.getDeletions());
  var wipRoot = fiberMeta_1.getWipRoot();
  if (!wipRoot) return;
  if (!wipRoot.child) return;
  commitWork(wipRoot === null || wipRoot === void 0 ? void 0 : wipRoot.child);
  fiberMeta_1.setCurrentRoot(wipRoot);
  fiberMeta_1.setWipRoot(null);
};

if (!window.requestIdleCallback) {
  window.requestIdleCallback = function (callback) {
    callback({
      timeRemaining: function timeRemaining() {
        return Infinity;
      },
      didTimeout: false
    }); // fake handle

    return -1;
  };
}

var workLoop = function workLoop(deadline) {
  var shouldYield = false;

  while (fiberMeta_1.getNextUnitWork() && !shouldYield) {
    var unitWork = fiberMeta_1.getNextUnitWork();
    if (!unitWork) break;
    fiberMeta_1.setNextUnitWork(performUnitOfWork(unitWork));
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!fiberMeta_1.getNextUnitWork() && fiberMeta_1.getWipRoot()) {
    commitRoot();
    return;
  }

  requestIdleCallback(exports.workLoop);
};

exports.workLoop = workLoop; // react 内部已经不再使用 requestIdleCallback API， 使用了 scheduler package
// requestIdleCallback(workLoop)

var performUnitOfWork = function performUnitOfWork(fiber) {
  console.log("fiber", fiber); // add dom node

  if (!fiber.dom) {
    fiber.dom = createDOM_1.createDOM(fiber);
  } // 可能会看到残缺的 ui。 需要去监听 根 fiber,
  // if (fiber.parent) {
  //   fiber.parent.dom?.appendChild(fiber.dom)
  // }
  // create new fibers


  var elements = fiber.props.children;
  reconcileChildren(fiber, elements); // return next unit of work

  if (fiber.child) return fiber.child;
  var nextFiber = fiber;

  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }

    nextFiber = nextFiber.parent;
  }

  return nextFiber;
};

function reconcileChildren(wipFiber, elements) {
  var index = 0;
  var oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  var prevSibling = null;

  while (index < elements.length || !!oldFiber) {
    var element = elements[index];
    var newFiber = null; // compare old fiber to element

    var sameType = oldFiber && element && oldFiber.type === element.type;

    if (oldFiber && element && oldFiber.type === element.type) {
      // update the node
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
        child: null,
        sibling: null
      };
    } else {
      if (element && !sameType) {
        newFiber = {
          type: element.type,
          props: element.props,
          dom: null,
          parent: wipFiber,
          alternate: null,
          effectTag: "PLACEMENT",
          child: null,
          sibling: null
        };
      }

      if (oldFiber && !sameType) {
        // delete the old fiber node
        oldFiber.effectTag = "DELETION";
        fiberMeta_1.setDeletions(__spreadArrays(fiberMeta_1.getDeletions(), [oldFiber]));
      }
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element) {
      prevSibling && (prevSibling.sibling = newFiber);
    }

    prevSibling = newFiber; // set element to next

    index++; // set fiber to next

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }
  }
}
},{"./createDOM":"../../src/createDOM.ts","./fiberMeta":"../../src/fiberMeta.ts"}],"../../src/render.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = void 0;

var fiberMeta_1 = require("./fiberMeta");

var fiberMeta_2 = require("./fiberMeta");

var concurrent_1 = require("./concurrent");

var render = function render(element, containers) {
  var wipRoot = {
    dom: containers,
    parent: null,
    child: null,
    sibling: null,
    type: 'root',
    props: {
      children: [element]
    },
    alternate: fiberMeta_1.getCurrentRoot()
  };
  fiberMeta_2.setWipRoot(wipRoot);
  fiberMeta_2.setNextUnitWork(wipRoot);
  fiberMeta_1.setDeletions([]);
  requestIdleCallback(concurrent_1.workLoop);
};

exports.render = render;
},{"./fiberMeta":"../../src/fiberMeta.ts","./concurrent":"../../src/concurrent.ts"}],"../../src/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var createElement_1 = require("./createElement");

var render_1 = require("./render");

var Didact = {
  createElement: createElement_1.createElement,
  render: render_1.render
};
exports.default = Didact;
},{"./createElement":"../../src/createElement.ts","./render":"../../src/render.ts"}],"index.js":[function(require,module,exports) {
"use strict";

var _index = _interopRequireDefault(require("../../src/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index.default.render(_index.default.createElement("div", null, _index.default.createElement("p", null, _index.default.createElement("span", null, "1"))), document.getElementById("root"));

setTimeout(function () {
  _index.default.render(_index.default.createElement("div", null, _index.default.createElement("p", null, _index.default.createElement("span", null, "3")), _index.default.createElement("span", null)), document.getElementById("root"));
}, 1000 * 5);
},{"../../src/index":"../../src/index.ts"}],"../../../../../Users/kxzha/AppData/Roaming/npm-cache/_npx/6732/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55728" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../Users/kxzha/AppData/Roaming/npm-cache/_npx/6732/node_modules/parcel/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/first.e31bb0bc.js.map