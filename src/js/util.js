var $ = require("jquery");

module.exports = {
  wait: function(duration, immediate) {
    var delay = function() {
      var deferred = $.Deferred();
      setTimeout(function() {
        deferred.resolve();
      }, duration || 400);
      return deferred.promise();
    };
    return immediate ? delay() : delay;
  }
};