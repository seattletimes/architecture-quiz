var Promise = require("rsvp").Promise;

module.exports = {
  wait: function(duration, immediate) {
    var delay = function() {
      return new Promise(function(ok) {
        window.setTimeout(ok, duration || 400);
      });
    };
    return immediate ? delay() : delay;
  }
};