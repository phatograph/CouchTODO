/**
 * todoServer.js
 * Author: ecb10@st-andrews.ac.uk
 *
 **/

var http = require('http');
var express = require('express');
var json = require('express-json');
var bodyParser = require('body-parser');
var path = require('path');

// TODO: Replace 'username' and 'password' with the username and password
// given by couchdb-setup
//
// You will also need to replace the server name with the details given by
// couchdb-setup
//
// NOTE: *NOT* your school/university username and password!
// var nano = require('nano')('http://cp217:M9FMMqFz@lyrane.cs.st-andrews.ac.uk:20141');

// var nano = require('nano')('http://cp217:TheOat-21186@localhost:5984');
var nano = require('nano')('http://127.0.0.1:5984');

var questiondb = nano.db.use('questions_db'); // Reference to the database storing the questions

// List all the question information as JSON
function listQuestions(req, res) {
  questiondb.get('questions_info', { revs_info : true }, function (err, questions) {
    console.log(questions);
    res.json(questions["questions_list"]);
  });
}

/*
 * Get the question with the given id req.id.
 */
function getQuestions(req, res) {
  questiondb.get('questions_info', { revs_info : true }, function (err, questions) {
    res.json(questions["questions_list"][req.params.id]);
  });
}

/*
 * Delete the question with the given id req.id.
 */
function deleteQuestions(req, res) {
  questiondb.get('questions_info', { revs_info : true }, function (err, questions) {
    delete questions["questions_list"][req.params.id];

    // Note that 'questions' already contains the _rev field we need to
    // update the data

    questiondb.insert(questions, 'questions_info', function (err, t) {
      res.json(questions["questions_list"]);
    });
  });
}

/*
 * Add updated question information to CouchDB
 */
function updateQuestionsDB(entryID, questions) {
  questiondb.insert(entryID, 'entryID', function(err_e, e) {
    questiondb.insert(questions, 'questions_info', function(err_t, t) {
      console.log("Added question to CouchDB");
      console.log(err_e);
      console.log(err_t);
    });
  });
}

/*
 * Add a new question with the next question id (entryID)
 */
function addQuestions(req, res) {
  questiondb.get('entryID', { revs_info : true }, function (err, entryID) {
    if (!err) {
      var next_entry = entryID["next_entry"];
      // var user = users_info.users_list[1].username
      questiondb.get('questions_info', { revs_info : true }, function (err, questions) {
        if (!err) {
          var data = JSON.parse(req.body);  // And here we deserialise the string to get the object back.

          questions["questions_list"][next_entry] = {
            question_title: data.title,
            question: data.des,
            user: "shit",
            date: Date.now(),
            category: "category strings",
            popularity: 1,
            answers:[]
          };

          entryID["next_entry"] = next_entry + 1;

          // Add the new data to CouchDB (separate function since
          // otherwise the callbacks get very deeply nested!)
          updateQuestionsDB(entryID, questions);

          res.writeHead(201, {'Location' : next_entry});
          res.end();
        }
      });
    }
  });
}

// main()
var app = express()

app.use(json());
app.use(express.query());
app.use(bodyParser.text()); // For parsing POST requests

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/questions_db', listQuestions);
app.get('/questions_db/:id', getQuestions);
app.post('/questions/:id/delete', deleteQuestions);
app.post('/questions_db', addQuestions);

app.get('/questions_db/:id', function (req, res) {
  res.render('index', { id: req.params.id });
});

app.use(express.static('content'));
app.listen(8080);
console.log('Server running at http://127.0.0.1:8080/');
