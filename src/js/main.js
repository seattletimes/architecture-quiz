require("./lib/ads");

var Quiz = require("./quiz");

var init = function() {
  window.quiz = new Quiz(window.quizData, ".quiz-frame");
};

init();

//restart link
document.querySelector(".quiz-frame").addEventListener("click", function(e) {
  if (!e.target.classList.contains("restart-button")) return;
  init();
});