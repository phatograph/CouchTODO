/*
 * Display tasks in the 'tasklist'
 * For each task, add a handler which will delete the task when it is clicked
 */
function displayTasks(tasks) {
  $("#tasklist").empty();

  for(var i in tasks) {
    var newli = $("<li id=\"" + i + "\"><a href='/task/" + i + "'>" + i + ": " + tasks[i].question_title + "</a></li>");
    $("#tasklist").append(newli);
  }
}

/*
 * Delete a task by making an AJAX request
 * Once complete, display the task list
 */
function deleteTask(taskid) {
  var req = new XMLHttpRequest();
  req.open("GET", "delete/"+taskid);

  req.setRequestHeader("Content-Type", "text/plain");
  req.onreadystatechange = function() {
    displayTasks(JSON.parse(req.responseText));
  }
  req.send(null);
}

/*
 * Retrieve the task list by making an AJAX request
 */
function getTasks() {
  var req = new XMLHttpRequest();
  req.open("GET", "questions_db");
  req.setRequestHeader("Content-Type", "application/json");
  req.onreadystatechange = function(e) {
    if (e.target.readyState == 4 && e.target.status == 200) {
      displayTasks(JSON.parse(req.responseText));
    }
  }
  req.send(null);
}

/*
 * Add a new task by making a POST request to the node server
 */
function setTask(questionInfo) {
  var req = new XMLHttpRequest();
  req.open("POST", "questions_db");
  req.setRequestHeader("Content-Type", "text/plain");
  req.onreadystatechange = function() {
    setTimeout(function () {
      // getTasks();
    }, 10);
  }
  req.send(JSON.stringify(questionInfo));  // Posting an object directly does not work, we need to serialise it first by converting it to string.
}

/*
 * Set up the text entry field so that when changed, it posts the content to
 * the server as a task
 */
function init() {
  $("#submitButton").click(function() {
    // Get data from the text box
    var entry = {
      title: $("#question_title").val(),
      des: $("#question_des").val()
    };

    setTask(entry);

    $("#question_title").val("");
  });

  getTasks();
}

$(init);
