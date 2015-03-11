var matches =
  "msMatchesSelector" in Element.prototype ? "msMatchesSelector" :
  "webkitMatchesSelector" in Element.prototype ? "webkitMatchesSelector" :
  "matches";

var util = module.exports = {
  wait(duration, callback) {
    setTimeout(callback, duration || 400);
  },
  addClass(element, name) {
    element.className += " " + name;
  },
  removeClass(element, name) {
    var re = new RegExp(name, "g");
    element.className = element.className.replace(re, "");
  },
  qsa(s, element) {
    return Array.prototype.slice.call((element || document).querySelectorAll(s));
  },
  closest(element, f) {
    if (typeof f == "function") {
      while (element && !f(element) && element !== document.documentElement) {
        element = element.parentElement;
      }
    } else {
      while (element && !element[matches](f) && element !== document.documentElement) {
        element = element.parentElement;
      }
    }
    if (element == document.documentElement) return null;
    return element;
  },
  delegate(element, event, selector, fn) {
    element.addEventListener(event, function(e) {
      var closest = util.closest(e.target, selector);
      if (closest) {
        fn(e);
      }
    });
  }
};