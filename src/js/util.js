module.exports = {
  wait: function(duration, callback) {
    setTimeout(callback, duration || 400);
  },
  addClass: function(element, name) {
    element.className += " " + name;
  },
  removeClass: function(element, name) {
    var re = new RegExp(name, "g");
    element.className = element.className.replace(re, "");
  },
  qsa: function(s, element) {
    return Array.prototype.slice.call((element || document).querySelectorAll(s));
  },
  closest: function(element, f) {
    while (!f(element) && element !== document.body) {
      element = element.parentElement;
    }
    if (element == document.body) return null;
    return element;
  }
};