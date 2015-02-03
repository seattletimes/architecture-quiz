/* esnext:true */

var $ = require("jquery");
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

var freezeAsTransform = function(image, spec) {
  var bounds = image.getBoundingClientRect();
  var ratio = bounds.width / spec.small.width;
  $(image).css({
    transform: transform(0, 0, ratio),
    width: "auto"
  });
};

var zoomToScale = function(image, spec) {
  var keyframe = spec.keyframe;
  var rescaled = {
    x: keyframe.x / keyframe.original * spec.large.width,
    y: keyframe.y / keyframe.original * spec.large.height,
    width: keyframe.w / keyframe.original * spec.large.width,
    height: keyframe.h / keyframe.original * spec.large.height
  };
  var ratio = rescaled.width / spec.small.width;
  var t = transform(rescaled.x, rescaled.y, ratio);
  $(image).css("transform", t);
};

var freezeAsWidth = function(image) {
  var bounds = image.getBoundingClientRect();
  var parent = image.parentElement;
  var parentBounds = parent.getBoundingClientRect();
  var width = bounds.width / parent.offsetWidth;
  $(image).removeClass("animated-transform");
  $(image).css({
    transform: "",
    width: width * 100 + "%",
    top: bounds.top - parentBounds.top,
    left: bounds.left - parentBounds.left,
    position: "absolute"
  });
};

module.exports = function(image, spec) {
  //figure out the current size, and apply transformation
  freezeAsTransform(image, spec);
  wait(10, true)
    .then(() => $(image).addClass("animated-transform"))
    .then(wait(10))
    .then(() => zoomToScale(image, spec))
    .then(wait(1000))
    .then(function() {
      freezeAsWidth(image, spec);
      $(image).addClass("animated-fadeout");
    });
};