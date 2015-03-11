var zoom = require("./zoom");
var util = require("./util");
var Share = require("./lib/share.min");

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
  this.hintCounter = 0;
  this.state = Quiz.COMPLETE;
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
  hintCounter: null,
  state: null,
  render() {
    if (this.state == Quiz.COMPLETE) {
      this.view.innerHTML = completed(this);
      this.createShare();
      return;
    }
    var q = this.questions[this.qIndex];
    var html = template(q);
    this.view.innerHTML = html;
  },
  bind() {
    var self = this;
    //handle clicks on answers
    util.delegate(this.view, "click", ".answer-item", e => {
      var li = util.closest(e.target, ".answer-item");
      this.check(li.getAttribute("data-index") * 1, li);
    });
    //handle clicks on the next button
    util.delegate(this.view, "click", ".next-button", e => {
      this.next();
    })
    util.delegate(this.view, "click", ".hint-button", e => {
      var hintText = document.querySelector(".hint-text");
      if (!hintText.classList.contains("show")) {
        hintText.classList.add("show");
        this.hintCounter++;
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
    document.querySelector(".answers").classList.add("answered");
    document.querySelector(".its-the").classList.add(answer.correct ? "dexter" : "sinister");
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
      this.view.querySelector(".answers").classList.add("answered");
    });
  },
  createShare() {
    new Share(".share-completed");
  }
};

module.exports = Quiz;