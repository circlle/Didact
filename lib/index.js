function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

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

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var createElement = function createElement(type, props) {
  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return {
    type: type,
    props: _objectSpread2(_objectSpread2({}, props), {}, {
      children: children.map(function (child) {
        return _typeof(child) === 'object' ? child : createTextElement(child);
      })
    })
  };
};

var TEXT_ELEMENT_LITERAL = "TEXT_ELEMENT";

var createTextElement = function createTextElement(text) {
  return {
    type: TEXT_ELEMENT_LITERAL,
    props: {
      nodeValue: text,
      children: []
    }
  };
};

var isProperty = function isProperty(key) {
  return key !== 'children';
};

var render = function render(element, containers) {
  var dom;

  if (element.type === TEXT_ELEMENT_LITERAL) {
    dom = document.createTextNode('');
  } else {
    var innerDom = dom = document.createElement(element.type);
    Object.keys(element.props).filter(isProperty).forEach(function (name) {
      return innerDom.setAttribute(name, element.props[name]);
    });
    element.props.children.forEach(function (child) {
      return render(child, innerDom);
    });
  }

  containers.appendChild(dom);
};

var Didact = {
  createElement: createElement,
  render: render
};
var element = Didact("div", {
  id: "foo"
}, Didact("a", null, "bar"), Didact("b", null));

export { Didact };
