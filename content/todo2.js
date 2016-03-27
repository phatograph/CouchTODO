/*
 * Display questions in the 'questionlist'
 * For each task, add a handler which will delete the task when it is clicked
 */
function displayQuestions(questions) {
  $("#content").empty();
  for(var i in questions) {
    var newdiv = "<div class='questionsList'\>" + "<font face='Courier New' size=+2>" + i + ": " + questions[i].question + "</font>";
    newdiv += "<div class='answer_section'><font face='Courier New' size=+2>Answers List</font>"
    newdiv += "<button class='addAnswer'><font face='Courier New' size=+2 color=#FFFFFF>Reply</font></button>"
    for (i in questions[i].answers)
      newdiv += "<div class='answers'\>" + i + ": " + "<font face='Courier New' size=+2>" +questions[i].answers[i].answer + "</font></div>"
    newdiv += "</div></div>";
    /*
       newli.click(
       function(event) {
       deleteQuestion(event.target.id);
       }
       );
       */

    $("#content").append(newdiv);
  }
  console.log("Done");
}

/*
 * Delete a task by making an AJAX request
 * Once complete, display the task list
 */
function deleteQuestion(questionId) {
  var req = new XMLHttpRequest();
  req.open("GET", "delete/"+questionId);

  req.setRequestHeader("Content-Type", "text/plain");
  req.onreadystatechange = function() {
    displayQuestions(JSON.parse(req.responseText));
  }
  req.send(null);
}

/*
 * Retrieve the task list by making an AJAX request
 */
function getQuestions() {
  var req = new XMLHttpRequest();
  req.open("GET", "questions_db");
  req.setRequestHeader("Content-Type", "application/json");
  req.onreadystatechange = function() {
    displayQuestions(JSON.parse(req.responseText));
  }
  req.send(null);
}

/*
 * Add a new task by making a POST request to the node server
 */
function setQuestion(questionInfo) {
  console.log(questionInfo);

  var req = new XMLHttpRequest();
  req.open("POST", "questions_db");
  req.setRequestHeader("Content-Type", "text/plain");
  req.onreadystatechange = function() {
    setTimeout(function () {
      getQuestions();
    }, 10);
  }
  req.send(questionInfo);
}

/*
 * Set up the text entry field so that when changed, it posts the content to
 * the server as a task
 */
function init() {
  $("#submitButton").click(function() {
    // Get data from the text box
    var entry = $("#question_text").val();
    // Send a post request to add it to the TODO list
    setQuestion(entry);
    $("#question_text").val("");
  });

  getQuestions();
}

$(init);
