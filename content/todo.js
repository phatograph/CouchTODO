/*
 * Display questions in the 'questionlist'
 * For each question, add a handler which will delete the question when it is clicked
 */
function displayQuestions(questions) {
  $("#questionlist").empty();

  for(var i in questions) {
    var li = "";
    li += "<li id='" + i + "'>";
    li += "<a href='/questions/" + i + "' class='link'>"+ i + ": " + questions[i].question_title + "</a>";
    li += " ";
    li += "<a class='delete'>X</a>";
    li += "</li>";
    $("#questionlist").append(li);
  }
}

function displayQuestion(question) {
  $('#questionlist').hide();

  var questionEl = '';
  questionEl += '<h2>' + question.question.question_title + '</h2>';
  questionEl += '<p>' + question.question.question + '</p>';

  var answersEl = '';
  answersEl += '<ul>';

  $.each(question.question.answers, function(i, answer) {
    answersEl += '<li rel="' + answer.id + '">' + answer.content + ' (' + answer.user + ')</li>';
  });

  answersEl += '</ul>';

  $('#question .content').html(questionEl)
  $('#question .answers').html(answersEl)
  $('#question').attr('rel', question.id).show();
}

/*
 * Delete a question by making an AJAX request
 * Once complete, display the question list
 */
function deleteQuestion(id) {
  var req = new XMLHttpRequest();
  req.open("POST", 'questions/' + id + '/delete');  // Use `href` attribute from each question that we created in `displayQuestions` function.
  req.setRequestHeader("Content-Type", "text/plain");
  req.onreadystatechange = function(e) {
    if (e.target.readyState == 4 && e.target.status == 200) {
      setTimeout(getQuestions, 10);
    }
  }
  req.send();
}

/*
 * Retrieve a single question by making an AJAX request
 */
function getQuestion(id) {
  var req = new XMLHttpRequest();
  req.open("GET", 'questions/' + id);
  req.setRequestHeader("Content-Type", "text/plain");
  req.onreadystatechange = function(e) {
    if (e.target.readyState == 4 && e.target.status == 200) {  // Wait until XHR finishes loading, see http://stackoverflow.com/questions/13763219/javascript-json-parse-responsetext-unexpected-end-of-input
      displayQuestion(JSON.parse(req.responseText));
    }
  }
  req.send(null);
}

/*
 * Retrieve the question list by making an AJAX request
 */
function getQuestions() {
  var req = new XMLHttpRequest();
  req.open("GET", "questions");
  req.setRequestHeader("Content-Type", "text/plain");
  req.onreadystatechange = function(e) {
    if (e.target.readyState == 4 && e.target.status == 200) {  // Wait until XHR finishes loading, see http://stackoverflow.com/questions/13763219/javascript-json-parse-responsetext-unexpected-end-of-input
      displayQuestions(JSON.parse(req.responseText));
    }
  }
  req.send(null);
}

/*
 * Add a new question by making a POST request to the node server
 */
function setQuestion(questionInfo) {
  var req = new XMLHttpRequest();
  req.open("POST", "questions");
  req.setRequestHeader("Content-Type", "text/plain");
  req.onreadystatechange = function(e) {
    if (e.target.readyState == 4 && e.target.status == 201) {  // Watch out for the usage of `201` status here, normal success status is `200`, `201` means 'created' which is correct in this context.
      setTimeout(getQuestions, 10);
    }
  }
  req.send(JSON.stringify(questionInfo));  // Posting an object directly does not work, we need to serialise it first by converting it to string.
}

/*
 * Add a new answer by making a POST request to the node server
 */
function setAnswer() {
  var $question = $('#question');
  var qId = $question.attr('rel');
  var answer = {
    content: $('#answerContent').val()
  };

  $('#answerContent').val('');  // Reset the input

  var req = new XMLHttpRequest();
  req.open('POST', 'questions/' + qId + '/answers');
  req.setRequestHeader("Content-Type", "text/plain");
  req.onreadystatechange = function(e) {
    if (e.target.readyState == 4 && e.target.status == 201) {
      getQuestion(qId);
    }
  }
  req.send(JSON.stringify(answer));
}

/*
 * Set up the text entry field so that when changed, it posts the content to
 * the server as a question
 */
function init() {
  $("#submitButton").click(function() {
    // Get data from the text box
    var entry = {
      title: $("#question_title").val(),
      des: $("#question_des").val()
    };

    setQuestion(entry);

    $("#question_title").val("");
  });

  getQuestions();

  // Watch for a click event
  $('#questionlist')
    .on('click', '.delete', function(e) {
      e.preventDefault();
      if (confirm('Are you sure?')) deleteQuestion($(this).parent().attr('id'));
    })
    .on('click', '.link', function(e) {
      e.preventDefault();
      getQuestion($(this).parent().attr('id'));
    });

  $('#question')
    .on('click', '.back', function(e) {
      e.preventDefault();
      $('#questionlist').show();
      $('#question').hide();
    })
    .on('submit', '#newAnswer', function(e) {
      e.preventDefault();
      setAnswer();
    });
}

$(init);
