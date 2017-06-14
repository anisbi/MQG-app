var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var Questionnaire = mongoose.model('Questionnaire');
var Question = mongoose.model('Question');
var Solution = mongoose.model('Solution');
var User 	 = mongoose.model('User');

var jwt = require('express-jwt');
var auth = jwt({
	secret: 'T0PPSY_KR!77S',
	userProperty: 'payload'
});

var verifyId = function(id) {
  
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



module.exports.profileRead = function(req, res) {
	if (!req.payload._id) {
		res.status(401).json({
			"result" : "failure",
			"message" : "UnauthorizedError: private profile"
		});
	} 
	else {
		/*
		User
			.findById(req.payload._id)
			.exec(function(err, user) {
				if (err) {
				  res.status(404).json({
					"result" : "failure",
					"message" : "User not found"
				  });
				}
				else {
				  res.status(200).json(user);
				}
			});
		*/
		var user = verifyId(req.payload._id);
		if (user === undefined) {
		  res.status(404).json({
			"result" : "failure",
			"message" : "User not found"
		  });
		}
		else {

			res.status(200).json({
								  "result" : "success2",
								  "tyepeof" : user
								});
		}
	}

};

router.get('/profile', auth, this.profileRead);

module.exports.verifyUser = function(req, res, next) {
  //res.status(200).json({"req body" : req.payload._id});
  //next.send(req.payload._id);
  //req.id = req.payload._id;
  //next();

  	if (!req.payload._id) {
		res.status(401).json({
			"result" : "failure",
			"message" : "UnauthorizedError: private profile"
		});
	}
	else {
	  var id = req.payload._id;

      User
         .findById(id)
	     .exec(function(err, user) { 
	  	   if (err) {
	  	     res.status(401).json({
			   "result" : "failure",
			   "message" : "User not found."
			 });
	  	   }
	  	   else {
	  	   	//User with valid ID.
	  	     next();
	  	   }
	
	  });
	}
};

module.exports.test2 = function(req, res) {
  res.status(200).json({"in next" : req.payload});
};

router.get('/test', auth, this.verifyUser, this.test2);
//router.get('/test', auth, verifyUser, this.testRoute);

module.exports.getQuestionnaires = function(req, res) {


  Questionnaire.find({
  	"author.id" : req.payload._id
  }).exec(function (err, questionnaires) {
  	if (err) {
  		res.status(500).json({
  	  	    "result" : "failure",
	  	    "message" : err
	    });
  	}
  	else {
	  res.status(200).json({
    	"result" : "success",
    	"data" : questionnaires
	  });
  	}
  });


};
router.get('/questionnaires', auth, this.verifyUser, this.getQuestionnaires);

module.exports.newQuestionnaire = function(req, res) {
  var questionnaire = new Questionnaire(req.body);
  questionnaire.save(function(err, questionnaire) {
  	if (err) { 
  		res.status(500).json({
  	  	    "result" : "failure",
	  	    "message" : err
	    });
	    return;
  	}
  	res.status(200).json({
  	  "result" : "success",
  	  "data" : questionnaire
  	});
  });
  
};
router.post('/questionnaires', auth, this.verifyUser, this.newQuestionnaire);

/*
	function(req, res, next) {
	var questionnaire = new Questionnaire(req.body);

	questionnaire.save(function(err, questionnaire) {
		if (err) { return next(err); }

		res.json(questionnaire);
	});
});
*/
/* GET all questionnaires. 
router.get('/questionnaires', function(req, res, next) {
	Questionnaire.find(function(err, questionnaires) {
		if (err) { return next(err); }
		
		res.json(questionnaires);
	});
});
*/

module.exports.verifyQuestionnaire = function(req, res) {
  if (req.questionnaire.author.id === req.payload._id) {
  	req.questionnaire.populate('questions', function (err, questionnaire) {
		if (err) { 
			res.status(500).json({
  	  	      "result" : "failure",
	  	      "message" : err
	   		});
	   		return;
		}

		res.status(200).json({
			"result" : "successful",
			"data" : questionnaire
		});
	});
  }
  else {
  	res.status(401).json({
      "result" : "failure",
      "message" : "Unauthorized Access."
	 });
  }
};
router.get('/questionnaires/:questionnaire', auth, this.verifyUser, this.verifyQuestionnaire);


module.exports.saveQuestion = function(req, res) {
  var question = new Question(req.body);
  question.questionnaire = { "id" : req.questionnaire._id };
  question.save(function(err, question) {
  	if (err) { 
  		res.status(500).json({
  	  	    "result" : "failure",
	  	    "message" : err
	    });
	    return;
  	}

  	req.questionnaire.questions.push(question);
		req.questionnaire.save(function(err, questionnaire) {
		if (err) { 
			res.status(500).json({
  	  	      "result" : "failure",
  	  	      "message" : err
  		  	}); 
			return;
  		}
	    res.status(200).json({
  	  	  "result" : "success",
  	  	  "data" : question
  		}); 
	});
	
  });
};
router.post('/questionnaires/:questionnaire/questions', auth, this.verifyUser, this.saveQuestion);

module.exports.getQuestion = function(req, res) {
  if (req.question.author.id === req.payload._id) {
  	res.status(200).json({
  		"result" : "success",
  		"data" : req.question
  	});
  }
  else {
  	res.status(401).json({
      "result" : "failure",
      "message" : "Unauthorized Access."
	 });
  }
};
router.get('/question/:question', auth, this.verifyUser, this.getQuestion);

module.exports.editQuestion = function(req, res) {
  if (req.question.author.id === req.payload._id) {
  	req.question.body = req.body.body;
  	req.question.options = req.body.options;
  	req.question.data = req.body.data;
  	req.question.publicdata = req.body.publicdata;
  	req.question.save(function(err, question) {
  		if (err) { return next(err); }
  		res.status(200).json({
  			"result" : "success",
  			"data" : question
  		});
  	});
  }
  else {
  	res.status(401).json({
      "result" : "failure",
      "message" : "Unauthorized Access."
	 });
  }
};
router.put('/question/:question', auth, this.verifyUser, this.editQuestion);




/* POST new question to questionnaire 
router.post('/questionnaires/:questionnaire/questions', function(req, res, next) {
	var question = new Question(req.body);
	question.questionnaire = req.questionnaire;

	question.save(function(err, question) {
		if (err) { return next(err); }

		req.questionnaire.questions.push(question);
		req.questionnaire.save(function(err, questionnaire) {
			if (err) { return next(err); }

			res.json(question);
		});
	});
});
*/



/* GET questionnaire with associated questions. 
router.get('/questionnaires/:questionnaire', function(req, res, next) {
	
	req.questionnaire.populate('questions', function (err, questionnaire) {
		if (err) { return next(err); }

		res.json(questionnaire);
	});


	

});
*/

/*
	Gets all solutions (questions solved by students) from db.
*/
router.get('/solutions', function(req, res, next) {
	Solution.find(function(err, solutions) {
		if (err) { return next(err); }
		
		res.json(solutions);
	});
});




/* GET questionnaire with associated questions. (w/o answer)*/
router.get('/quiz/:questionnaire', function(req, res, next) {
	/*
		Same as the request above, except we don't populate the 
		questions with the answers. 
	*/
	req.questionnaire.populate('questions', 'qtype body options publicdata', function(err, questionnaire) {
			if (err) { return next(err); }

			res.json(questionnaire);
		});
	//res.json(req.questionnaire);
});






//Delete a question
router.delete('/question/:question', function(req, res, next) {

	/* Must add authentication in the future!! */

	Question.findById(req.question._id, function(err, question) {
		if (err) { return next(err); }
		if (!question) { return res.json({Error: 'Question doesn\'t exist'}); }
		question.remove(function(err) {
			if (err) { return next(err); }
			Questionnaire.update(

				{_id: question.questionnaire},
				{$pull: {"questions" : question._id}},
				{upsert: true},
				function(err) {
					if (err) { return next(err); }

						res.json({Message: 'successfuly deleted'});

						
				});
		});
	});
});

//Get a question in quiz form (excluding private data)
router.get('/quiz/question/:quiz', function(req, res, next) {
	res.json(req.quiz);
});




/* POST new solution to a single question*/
router.post('/solutions/', function(req,res,next) {
	/**IMPORTANT!
		At some point will need to check if user is eligible to
		solve this question before posting a new solution
	*/
	var solution = new Solution(req.body);
	
	if (req.body.question)
		solution.question = req.body.question;


	solution.save(function(err, solution) {
		if (err) { return next(err); }
		res.json(solution);
	});
});



/*
	Used to determine whether a user has answered a question.
	Very early implementation, relevant to multi_choice questions only.
	(not part of prototype).
*/
router.get('/solutions/:uid/:question/', function(req,res,next) {

	if (req.question) {
		if (req.question.qtype == 'multi_choice') 
		{
			Solution.findOne({
				'solver' : req.params.uid,
				'question' : req.question._id
			}, function(err, solution) {
				if (err) { return next(err); }
				//res.json(solution);
				if (solution && solution.data && solution.data.answer) {
					var answer = solution.data.answer;
					res.json({
						Solved: 'true',
						Comment: req.question.options[answer].comment
					}); 
				}
				else { res.json({Solved: 'false'}); }
			});
		}
	}
	else { res.json({Error: 'Question not found'}); }

});


/* define ':questionnaire' in URL */
router.param('questionnaire', function(req, res, next, id) {
	var query = Questionnaire.findById(id);

	query.exec(function (err, questionnaire) {
		if (err) { return next(err); }
		if (!questionnaire) { 
			req.questionnaire = { Error: 'Questionnaire not found. Invalid ID.' };
		}
		else {
			req.questionnaire = questionnaire;
		}
		return next();
	});
});

/* define ':question' in URL */
router.param('question', function(req, res, next, id) {
	var query = Question.findById(id);

	query.exec(function (err, question) {
		if (err) { return next(err); }
		if (!question) { 
			req.question = null;
		}
		else {
			req.question = question;
		}
		return next();
	});
});

/*  Define ':quiz' in URL.
	A quiz is a question document without the solution (private data field)
*/
router.param('quiz', function(req, res, next, id) {
	var query = Question
				.findById(id)
				.select('qtype body options publicdata questionnaire');
	query.exec(function (err, quiz) {
		if (err) { return next(err); }
		req.quiz = quiz;
		return next();
	});

});

/* define ':solution' in URL */
router.param('solution', function(req, res, next, id) {
	var query = Solution.findById(id);

	query.exec(function (err, solution) {
		if (err) { return next(err); }
		if (!solution) {
			req.solution = { Error: 'Solution ID not found.' };
		}
		else {
			req.solution = solution;
		}
		return next();
	});

});



register = function(req, res) {
	/**
		TODO: Input checks.
	*/
	var user = new User();
	
	user.name = req.body.name;
	user.email = req.body.email;
	user.password = req.body.password;

	if (user.name.length === 0 || user.email.length === 0 || user.password.length === 0) {
		res.status(200);
		res.json({
			"result" : "failure",
			"message" : "Please fill all fields"
		});
		return;
	}

	else {
		user.setPassword(req.body.password);

		user.save(function(err) {
			if (err) {
				if (err.code === 11000) {
				  res.status(200).json({
				    "result" : "failure",
				    "message": "User exists with given email address.",
				    "errcode": err.code
				  });
				  return;
				}
			}
			var token;
			token = user.generateJwt();
			res.status(200);
			res.json({
				"result": "successful",
				"token": token
			});
		});
	}
};

router.post('/register', register);

login = function(req, res) {

	passport.authenticate('local', function(err, user, info){
		if (err) { res.status(404).json(err); return; }
		
		var token;
		if (user) {
			token = user.generateJwt();
			res.status(200);
			res.json({
				"result" : "success",
				"token" : token
			});
		} else {
			//Case user not found
			res.status(401).json(info);
		}
	})(req, res);

};

router.post('/login', login);



module.exports = router;


