var zoom = require("./zoom");

var template = require("./_question.html");
var ich = require("icanhaz");
ich.addTemplate("question", template);

var Quiz = function(data, images, view) {
  this.view = typeof view == "string" ? document.querySelector(view) : view;
  this.qIndex = 0;
  this.questions = data;
  this.images = images;
  this.correct = 0;
  this.bind();
  this.render();
};

Quiz.prototype = {
  qIndex: null,
  questions: null,
  correct: null,
  render: function() {
    var spec = this.images[this.qIndex];
    this.view.innerHTML = ich.question({
      large: spec.large.file,
      small: spec.small.file
    });
  },
  bind: function() {
    var self = this;
    document.querySelector(".next").addEventListener("click", this.next.bind(this));
    document.body.addEventListener("click", function(e) {
      if (!e.target.className.contains("small")) return;
      self.shrink();
    });
  },
  check: function() {

  },
  next: function() {
    this.qIndex++;
    if (this.qIndex >= this.questions.length) {
      return this.complete();
    }
    this.render();
  },
  complete: function() {
    console.log("ALL DONE");
  },
  shrink: function() {
    var small = document.querySelector(".small");
    var spec = this.images[this.qIndex];
    zoom(small, spec);
  }
};

module.exports = Quiz;