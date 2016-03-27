/*
 * Display questions in the 'questionlist'
 * For each question, add a handler which will delete the question when it is clicked
 */
function displayQuestions(questions) {
  var li = "";
  var score = 0;

  $("#questionlist").empty();

  for (var i in questions) {
    li += "<li id='" + i + "'>";
    li += "<a href='/questions/" + i + "' class='link'>"+ i + ": " + questions[i].question_title + "</a>";
    li += " <a class='delete'>X</a>";

    score = 0;
    $.each(questions[i].votes, function(i, vote) {
      score += vote.content;
    });
    li += ' (' + score + ' votes)';

    li += " <a class='voteUp'>Up</a>";
    li += " <a class='voteDown'>Down</a>";

    li += "</li>";
  }

  $("#questionlist").append(li);
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
function addQuestion(questionInfo) {
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
function addAnswer(id, answer) {
  var req = new XMLHttpRequest();
  req.open('POST', 'questions/' + id + '/answers');
  req.setRequestHeader("Content-Type", "text/plain");
  req.onreadystatechange = function(e) {
    if (e.target.readyState == 4 && e.target.status == 201) {
      $('#answerContent').val('');  // Reset the input
      getQuestion(id);
    }
  }
  req.send(JSON.stringify(answer));
}

/*
 * Add a new answer by making a POST request to the node server
 */
function addVote(id, score) {
  var req = new XMLHttpRequest();
  req.open('POST', 'questions/' + id + '/votes');
  req.setRequestHeader("Content-Type", "text/plain");
  req.onreadystatechange = function(e) {
    if (e.target.readyState == 4 && e.target.status == 201) {
      setTimeout(getQuestions, 10);
    }
  }
  req.send(JSON.stringify(score));
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

    addQuestion(entry);

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
    })
    .on('click', '.voteUp', function(e) {
      e.preventDefault();
      addVote($(this).parent().attr('id'), {
        content: 1
      });
    })
    .on('click', '.voteDown', function(e) {
      e.preventDefault();
      addVote($(this).parent().attr('id'), {
        content: -1
      });
    });

  $('#question')
    .on('click', '.back', function(e) {
      e.preventDefault();
      $('#questionlist').show();
      $('#question').hide();
    })
    .on('submit', '#newAnswer', function(e) {
      e.preventDefault();

      addAnswer($('#question').attr('rel'), {
        content: $('#answerContent').val()
      });
    });
}

$(init);
