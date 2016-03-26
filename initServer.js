/// Run this first, to initialise the data in CouchDB

// WARNING: It will delete any existing database called 'tasks'!

// TODO: Replace 'username' and 'password' with the username and password
// given by couchdb-setup
//
// You will also need to replace the server name with the details given by
// couchdb-setup
//
// NOTE: *NOT* your school/university username and password!
// var nano = require('nano')('http://cp217:M9FMMqFz@lyrane.cs.st-andrews.ac.uk:20141');
var nano = require('nano')('http://cp217:TheOat-21186@localhost:5984');

// our application's model, populated with one entry
var entryID = { "next_entry" : 3 };
var user_info = { "users_list" :
					{"1": {"username":"test", "password": "test", "account_type": "moderator"}} };
var question_info = { "questions_list" :
                    {"1": {"question_id": "q-" + Date.now(), "question_title": "Fill TODO list", "question": "question description strings", "user": user_info.users_list[1].username , "date": Date.now(), "category": "category strings", "popularity": 1},
                     "2": {"question_id": "q-" + Date.now(), "question_title": "Complete TODO list", "question": "question description strings", "user": user_info.users_list[1].username , "date": Date.now(), "category": "category strings", "popularity": 1 }} };
var answer_info = { "answer_list" :
					{"1": {"question_id": question_info.questions_list[1].question_id, "answers":
						{"1": {"answer":"test", "date": Date.now(), "user": user_info.users_list[1].username, "popularity": "1"},
						"2": {"answer":"test", "date": Date.now(), "user": user_info.users_list[1].username, "popularity": "1"}
					}}
					}}
nano.db.destroy('questions_db', function (err, body) {
   console.log(err);
});

nano.db.create('questions_db', function (err, body) {
    questions_db = nano.db.use('questions_db');
    if (!err) {
	
        // Database didn't exist, so populate it with some initial data
        questions_db.insert(question_info, 'questions_info', function(err, body) {
            if (!err) {
                console.log("Initialised questions:");
                console.log(body);
            } else {
                console.log("Error when initialising questions info");
                console.log(err);
            }
        });

        questions_db.insert(entryID, 'entryID', function(err, body) {
            if (!err) {
                console.log("Initialised Entry ID:");
                console.log(body);
            } else {
                console.log("Error when initialising entry ID");
                console.log(err);
            }
        })
		
		questions_db.insert(user_info, 'users_info', function(err, body) {
            if (!err) {
                console.log("Initialised Users:");
                console.log(body);
            } else {
                console.log("Error when initialising users");
                console.log(err);
            }
        })
		   
		questions_db.insert(answer_info, 'answer_info', function(err, body) {
            if (!err) {
                console.log("Initialised answers:");
                console.log(body);
            } else {
                console.log("Error when initialising answers info");
                console.log(err);
            }
        });
    }
});

