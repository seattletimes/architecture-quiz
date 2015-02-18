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

document.querySelector(".next").addEventListener("click", () => {
  current++;
  render();
});

render();

document.body.addEventListener("click", e => {
  if (!e.target.className.contains("small")) return;
  var small = e.target;
  var spec = window.imageList[current];
  zoom(small, spec);
});