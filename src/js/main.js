var $ = require("jquery");
var zoom = require("./zoom");

var template = require("./_question.html");
var ich = require("icanhaz");
ich.addTemplate("question", template);

var viewport = document.querySelector(".viewport");

var current = 0;

var render = function() {
  var spec = window.imageList[current];
  viewport.innerHTML = ich.question({
    large: spec.large.file,
    small: spec.small.file
  });
};

$(document.body).on("click", ".next", () => {
  current++;
  render();
});

render();

$(document.body).on("click", ".small", () => {
  var small = viewport.querySelector(".small");
  var spec = window.imageList[current];
  console.log(small, spec);
  zoom(small, spec);
});