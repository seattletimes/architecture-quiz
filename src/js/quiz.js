var zoom = require("./zoom");
var util = require("./util");

var dot = require("dot");
dot.templateSettings.varname = "data";
dot.templateSettings.evaluate = /<%([\s\S]+?)%>/g;
dot.templateSettings.interpolate = /<%=([\s\S]+?)%>/g;

var template = dot.compile(require("./_question.html"));

var Quiz = function(data, view) {
  this.view = typeof view == "string" ? document.querySelector(view) : view;
  this.qIndex = 0;
  this.questions = data;
  this.correct = 0;
  this.block = false;
  this.bind();
  this.render();
};

Quiz.prototype = {
  qIndex: null,
  questions: null,
  correct: null,
  block: null,
  render() {
    var q = this.questions[this.qIndex];
    var html = template(q);
    this.view.innerHTML = html;
  },
  bind() {
    var self = this;
    this.view.addEventListener("click", function(e) {
      //handle clicks on answers
      if (e.target.className.indexOf("answer-item") > -1) {
        self.check(e.target.getAttribute("data-index") * 1, e.target);
      }
      //handle clicks on the next button
      if (e.target.className == "next-button") {
        self.next();
      }
    });
  },
  check(answerIndex, li) {
    //check for question results, trigger the animation, call next() after finish
    this.shrink();
    var question = this.questions[this.qIndex];
    var answer = question.answers[answerIndex];
    util.addClass(li, "picked");
    util.qsa(".answer-item", this.view).forEach(item => {
      var index = item.getAttribute("data-index") * 1;
      util.addClass(item, question.answers[index].correct ? "right" : "wrong");
    });
  },
  next() {
    if (this.block) return;
    this.qIndex++;
    if (this.qIndex >= this.questions.length) {
      return this.complete();
    }
    this.render();
  },
  complete() {
    console.log("ALL DONE");
  },
  shrink(f) {
    f = f || function() {};
    if (this.block) return;
    this.block = true;
    var small = document.querySelector(".small");
    var spec = this.questions[this.qIndex].image;
    zoom(small, spec, () => {
      this.block = false;
      util.addClass(this.view.querySelector(".answers"), "answered");
    });
  }
};

module.exports = Quiz;