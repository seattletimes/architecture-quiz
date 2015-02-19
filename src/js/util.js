module.exports = {
  wait: function(duration, callback) {
    setTimeout(callback, duration || 400);
  }
};