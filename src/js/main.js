var $ = require("jquery");
var zoom = require("./zoom");

var spec = window.imageList[7];
var viewport = document.querySelector(".viewport");

var large = new Image();
large.src = "assets/large/" + spec.large.file;
viewport.appendChild(large);

var small = new Image();
small.src = "assets/small/" + spec.small.file;
small.className = "small";
viewport.appendChild(small);

$(document.body).one("click", function() {
  zoom(small, spec);
});