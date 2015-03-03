/* esnext:true */

var transProp = 
  "msTransform" in document.body.style ? "msTransform" :
  "webkitTransform" in document.body.style ? "webkitTransform" :
  "transform";
var wait = require("./util").wait;

/*
Transforming the small image to the big one is a three-stage process:

1. Figure out the transforms necessary for the small image to retain its
current size when width: 100% is removed

2. Figure out the transform that should be applied so that the small image
will move to the correct position over the big image

2a. (Remember, the big image will not be at its native size either)

3. After the transition plays, remove the transforms and apply percentage
width/top/left to the small image to freeze it in place responsively

*/

var transform = function(x, y, s) {
  return `translate( ${x}px, ${y}px) scale(${s})`;
};

var triggerLayout = function() {
  return document.body.offsetTop;
};

var freezeAsTransform = function(image, spec) {
  var bounds = image.getBoundingClientRect();
  var ratio = bounds.width / spec.small.width;
  var t = transform(0, 0, ratio);
  image.style[transProp] = t;
  image.classList.add("transformed");
  triggerLayout();
};

var zoomToScale = function(image, spec) {
  var keyframe = spec.keyframe;
  var size = image.getBoundingClientRect().width;
  var rescaled = {
    x: keyframe.x / keyframe.original * size,
    y: keyframe.y / keyframe.original * size,
    width: keyframe.w / keyframe.original * size,
    height: keyframe.h / keyframe.original * size
  };
  var ratio = rescaled.width / size;
  var t = transform(rescaled.x, rescaled.y, ratio);
  image.style[transProp] = t;
  triggerLayout();
};

var freezeAsWidth = function(image) {
  var bounds = image.getBoundingClientRect();
  var parent = image.parentElement;
  var parentBounds = parent.getBoundingClientRect();
  var width = bounds.width / parent.offsetWidth;
  image.style[transProp] = "";
  image.style.width = width * 100 + "%";
  image.style.top = bounds.top - parentBounds.top + "px";
  image.style.left = bounds.left - parentBounds.left + "px";
  image.style.position = "absolute";
  image.classList.remove("animated-transform");
  image.classList.remove("transformed");
  triggerLayout();
};

module.exports = function(image, spec, callback) {
  callback = callback || function() {};
  //figure out the current size, and apply transformation
  freezeAsTransform(image, spec);
  image.classList.add("animated-transform");
  zoomToScale(image, spec);
  wait(1000, function() {
    freezeAsWidth(image, spec);
    image.classList.add("animated-fadeout");
    //wait for fade to complete
    image.addEventListener("transitionend", callback);
  });
};