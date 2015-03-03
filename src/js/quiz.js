var zoom = require("./zoom");
var util = require("./util");

var dot = require("dot");
dot.templateSettings.varname = "data";
dot.templateSettings.evaluate = /<%([\s\S]+?)%>/g;
dot.templateSettings.interpolate = /<%=([\s\S]+?)%>/g;

var template = dot.compile(require("./_question.html"));
var completed = dot.compile(require("./_complete.html"));

var Quiz = function(data, view) {
  this.view = typeof view == "string" ? document.querySelector(view) : view;
  this.qIndex = 0;
  this.questions = data;
  this.score = 0;
  this.state = Quiz.READY;
  this.bind();
  this.render();
};

Quiz.READY = "waiting";
Quiz.ANSWERED = "answered";
Quiz.ANIMATING = "animating";
Quiz.COMPLETE = "complete";

Quiz.prototype = {
  qIndex: null,
  questions: null,
  score: null,
  state: null,
  render() {
    if (this.state == Quiz.COMPLETE) {
      this.view.innerHTML = completed(this);
      return;
    }
    var q = this.questions[this.qIndex];
    var html = template(q);
    this.view.innerHTML = html;
  },
  bind() {
    var self = this;
    this.view.addEventListener("click", (e) => {
      //handle clicks on answers
      if (e.target.className.indexOf("answer-item") > -1 && this.state == Quiz.READY) {
        this.check(e.target.getAttribute("data-index") * 1, e.target);
      }
      //handle clicks on the next button
      if (e.target.className == "next-button") {
        this.next();
      }
    });
  },
  check(answerIndex, li) {
    //switch states, run animation
    this.state = Quiz.ANSWERED;
    this.shrink();
    //check answers and apply styling
    var question = this.questions[this.qIndex];
    var answer = question.answers[answerIndex];
    if (answer.correct) {
      this.score++;
    }
    util.addClass(li, "picked");
    util.qsa(".answer-item", this.view).forEach(item => {
      var index = item.getAttribute("data-index") * 1;
      util.addClass(item, question.answers[index].correct ? "right" : "wrong");
    });
  },
  next() {
    if (this.state != Quiz.ANSWERED) return;
    this.qIndex++;
    if (this.qIndex >= this.questions.length) {
      return this.complete();
    }
    this.render();
    this.state = Quiz.READY;
  },
  complete() {
    this.state = Quiz.COMPLETE;
    this.render();
  },
  shrink(f) {
    f = f || function() {};
    if (this.block) return;
    var state = this.state;
    this.state = Quiz.ANIMATING;
    var small = document.querySelector(".small");
    var spec = this.questions[this.qIndex].image;
    zoom(small, spec, () => {
      this.state = state;
      util.addClass(this.view.querySelector(".answers"), "answered");
    });
  }
};

module.exports = Quiz;