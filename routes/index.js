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
  		req.status = {
  			"result" : "failure",
  			"message" : "Unauthorized access."
  		}; 
		res.status(401).json({
			"result" : "failure",
			"message" : "UnauthorizedError"
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
	  	   	req.status = {
	  	   		"result" : "success",
	  	   		"user" : "user data in user field"
	  	   	}
	  	   	req.user = user;
	  	    next();
	  	   }
	
	  });
	}
};

module.exports.test2 = function(req, res) {
  res.status(200).json({"in next" : req.user});
};

router.get('/test', auth, this.verifyUser, this.test2);
//router.get('/test', auth, verifyUser, this.testRoute);

module.exports.getQuestionnaires = function(req, res) {

  if (req.user.type !== "teacher") {
    res.status(401).json({
      "result" : "failure",
      "message" : "Unauthorized Access."
	 });
  }

  else if (req.user.type === "teacher") {
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
 }


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
  	else {
	  	res.status(200).json({
	  	  "result" : "success",
	  	  "data" : questionnaire
	  	});
  	}
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
  if (req.status.result === "success" && 
  		req.questionnaire.author.id === req.payload._id) {
  	
  	req.questionnaire.populate('questions', function (err, questionnaire) {
		if (err) { 
			res.status(500).json({
  	  	      "result" : "failure",
	  	      "message" : err
	   		});
	   		return;
		}
		else {
			res.status(200).json({
				"result" : "success",
				"data" : questionnaire
			});
		}
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
  if (req.status.result === "success") {
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
	  	else {
		  	req.questionnaire.questions.push(question);
				req.questionnaire.save(function(err, questionnaire) {
				if (err) { 
					res.status(500).json({
		  	  	      "result" : "failure",
		  	  	      "message" : err
		  		  	}); 
					return;
		  		}
		  		else {
				    res.status(200).json({
			  	  	  "result" : "success",
			  	  	  "data" : question
			  		}); 
				}
			});
		}
	});
  }
  else if (req.status.result === "failure") {
		res.status(404).json({
			"result" : "failure",
			"message" : req.status.message
		});
  }
  else if (req.status.result === "error") {
		res.status(500).json({
			"result" : "error",
			"message" : req.status.message
		});
	}
};
router.post('/questionnaires/:questionnaire/questions', auth, this.verifyUser, this.saveQuestion);

module.exports.getQuestion = function(req, res) {
  if (req.status.result === "success" &&
  		req.question.author.id === req.payload._id) {

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
  if (req.status.result === "success" &&
  		req.question.author.id === req.payload._id) {

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

/*
	For the requesting user, we retrieve all available questionnaires, we also
	populate the 'Questions' field for each questionnaire.
*/
module.exports.getQuizzes = function(req, res, next) {
  if (req.status.result === "success") {
	var query = Questionnaire
					.find({
						"author.id" : req.user.data.referrer.id
					}).populate('questions', '-data');

	query.exec(function (err, questionnaires) {
		if (err) {
			res.status(500).json({
				"result" : "error",
				"message" : err
			});
		}
		else {
			res.json({
				"result" : "success",
				"message" : "Questionnaires in data field",
				"data" : questionnaires
			});
		}
		
	});
  }
  else if (req.status.result === "failure") {
		res.status(404).json({
			"result" : "failure",
			"message" : req.status.message
		});
	}
	else if (req.status.result === "error") {
		res.status(500).json({
			"result" : "error",
			"message" : req.status.message
		});
	}

};

/*
	After retrieving all questionnaires for the requesting user, we check which of the 
	questions in the questionnaires have already been answered by the user, and which
	haven't.

	!!!!!!NOT IN USE!!!!!!!!
*/
module.exports.getQuestionsAnswered = function(req, res, next) {
  if (req.status.result === "success") {
  	var question;
  	var finishedExec = false;
	for (var i = 0; i < req.status.data.length; i++) {
		for (var j=0; j < req.status.data[i].questions.length; j++) {
			question = req.status.data[i].questions[j].toJSON();
			
			var query = Solution.
							find({"solver.id" : req.user._id,
				   	    		  "question" : question._id});
			query.exec(function(err, solutions){
				if (err) {
					question["isAnswered"] = false;
				}
				else {
					question["isAnswered"] = (solutions.length > 0);
				}
			});	
			req.status.data[i].questions[j] = question;
			finishedExec = ((i === req.status.data.length -1) && 
							(j === req.status.data[i].questions.length -1));
		}

	}
	while(!finishedExec);
	next();
  }
  else { next(); }
};

module.exports.returnQuiz = function(req,res) {
	if (req.status.result === "success") {
		res.json(
	  	{
		  "result" : "success",
		  "message" : "Questionnaires in data field",
		  "data" : {"q" : req.status.data, "to" : typeof(question)},
		});
	}
	else if (req.status.result === "failure") {
		res.status(404).json({
			"result" : "failure",
			"message" : req.status.message
		});
	}
	else if (req.status.result === "error") {
		res.status(500).json({
			"result" : "error",
			"message" : req.status.message
		});
	}
};

router.get('/quiz', auth, this.verifyUser, this.getQuizzes);



/*
	In charge of checking eligibility of a student to solve a question.
*/
module.exports.verifyQuestion = function(req,res,next) {
/*
	req.status = {
		"result" : "failure",
		"message" : "Unauthorized Access (3)",
		"t" : typeof(req.user._id+""),
		"d" : typeof(req.question._id+""),
		"x" : req.user._id+"",
		"y" : req.question._id+""
	};
	next();
	*/

	if (req.status.result === "success") {
		
		if (req.user.data.referrer.id !== req.question.author.id) {
			req.status = {
				"result" : "failure",
				"message" : "Unauthorized Access"
			};
			next();
		}
		else {
			Solution.find({
				"solver.id" : req.user._id+"",
				"question.id" : req.question._id+""
			}).exec(function (err, solution) {

				if (err) {
					req.status = {
						"result" : "error",
						"message" : err
					};
					next();	
				}
				if (solution.length === 0) {
					req.status = {
						"result" : "success",
						"message" : "User eligible to solve this question"
					};
					next();
				}
				else {
					req.status = {
						"result" : "failure",
						"message" : "משתמש ענה על שאלה זו מקודם."
					};
					next();
				}
			});
		}
	}
};
/*
	Shuffles a given array. When a teacher writes a question, the positions
	of objects in arrays indicate the right answer. We shuffle these arrays when 
	returning the question for a quiz for a student to answer.
	(taken from: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array)
*/

var shuffleArray = function(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  var arrayCopy = array.slice(); //Copy array by value
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = arrayCopy[currentIndex];
    arrayCopy[currentIndex] = arrayCopy[randomIndex];
    arrayCopy[randomIndex] = temporaryValue;
  }
  return arrayCopy;
};
module.exports.returnQuizQuestion = function(req, res) {
	if (req.status.result === "success") {
		if (req.params.qtype === "pair_matching") {
			/*
				For pair matching we need to shuffle the arrays containing
				the 'cards' in the right order.
				Return to user following values: 
				{id, shuffledLists{A[],B[]}, publicdata, author, questionnaire}
			*/
			//this.shuffle(req.question.data.lists.A);
			var shuffledA = shuffleArray(req.question.data.lists.A);
			var shuffledB = shuffleArray(req.question.data.lists.B);
			var quizQuestionObj = {
				"id" : req.question._id,
				"author" : {
					"id" : req.question.author.id,
					"name" : req.question.name
				},
				"lists" : {
					"A" : shuffledA,
					"B" : shuffledB
				},
				"questionnaire" : req.question.questionnaire.id
			};
			res.json({
				"result" : "success",
				"message" : "Quiz data in 'data' field",
				"data" : quizQuestionObj
			});
		}


		/*
			For card matching, we would also like to shuffle the arrays before returning
			data to user.
			Output: {id, data{shuffledLists{A[],B[],C[]}, allowedTypes}, publicdata, author, questionnaire}
		*/
		else if (req.params.qtype === "card_matching") {
			var shuffledA = shuffleArray(req.question.data.lists.listA);
			var shuffledB = shuffleArray(req.question.data.lists.listB);
			var shuffledC = shuffleArray(req.question.data.lists.listC);
			var quizQuestionObj = {
				"id" : req.question._id,
				"author" : {
					"id" : req.question.author.id,
					"name" : req.question.name
				},
				"data" : {
					"lists" : {
						"A" : shuffledA,
						"B" : shuffledB,
						"C" : shuffledC
					},
					"allowedTypes" : req.question.data.allowedTypes,
					"qbody" : req.question.publicdata.qbody,
					"listNameA" : req.question.publicdata.list1,
					"listNameB" : req.question.publicdata.list2,
					"listNameC" : req.question.publicdata.list3
				},
				"questionnaire" : req.question.questionnaire.id
			};



			res.json({
				"result" : "success",
				"message" : "Quiz data in 'data' field",
				"data" : quizQuestionObj
			});

		}

		else if (req.params.qtype === "open_question") {
			var quizQuestionObj = {
				"id" : req.question._id,
				"author" : {
					"id" : req.question.author.id,
					"name" : req.question.name
				},
				"data" : {
					"body" : req.question.body,
					"equations" : req.question.publicdata.equations.equationsArray
				},
				"questionnaire" : req.question.questionnaire.id
			};

			res.json({
				"result" : "success",
				"message" : "Quiz data in 'data' field",
				"data" : quizQuestionObj
			});
		}

		else {
			res.status(404).json({
				"result" : "failure",
				"message" : "Unrecognized question type"
			});
		}
	}
	else if (req.status.result === "failure") {
		res.json({
			"result" : "failure",
			"message" : req.status.message,
			"alt" : req.status
		});
	}
	else if (req.status.result === "error") {
		res.status(500).json({
			"result" : "error",
			"message" : req.status.message
		});
	}
};

router.get('/quiz/:question/:qtype', auth, this.verifyUser, this.verifyQuestion, this.returnQuizQuestion);


module.exports.verifySolution = function(req,res,next) {
		
		//"question.id" : req.body.question.id
	
	Solution.find({
		"solver.id" : req.user._id+"",
		"question.id" : req.body.question.id
	}).exec(function (err, solution) {
		if (err) {
			req.status = {
				"result" : "error",
				"message" : err
			};
			next();	
		}
		if (solution.length === 0) {
			req.status = {
				"result" : "success",
				"message" : "User eligible to solve this question"
			};
			next();
		}
		else {
			req.status = {
				"result" : "failure",
				"message" : "User already answered this question."
			};
			next();
		}
	});




	/*
	var solution = new Solution(req.body);
	
	if (req.body.question)
		solution.question = req.body.question;


	solution.save(function(err, solution) {
		if (err) { return next(err); }
			res.json(solution);
	});
	*/


	/*if (req.status.result === "success") {
		if (req.user.data.referrer.id !== req.question.author.id) {
			req.status = {
				"result" : "failure",
				"message" : "Unauthorized Access"
			};
		}
		else {
			//Check if answered before
			var query = Solution.
							find({"solver.id" : req.user._id,
				   	    		  "question" : req.question._id});
			query.exec(function(err, solutions){
				if (err) {
					req.status = {
						"result" : "error",
						"message" : err
					};
					next();
				}
				else {
					if (solutions.length < 1) {
						req.status = {
							"result" : "failure",
							"message" : "User already answered this question"
						};
						next();
					}
				}
			});	


			req.status = {
				"result" : "success",
				"message" : "User authorized"
			};
		}
	}
	next();
	*/
};

module.exports.postSolution = function(req, res) {
	if (req.status.result === "success") {

		var solution = new Solution(req.body);
		solution.save(function(err, solution) {
			if (err) { 
				res.status(500).json({
					"result" : "error",
					"message" : err
				});
			}
			else {
				res.json({
					"result" : "success",
					"message" : "New solution successfuly posted."
				});
			}
		});

	}
	
	else if (req.status.result === "failure") {
		res.json({
			"result" : "failure",
			"message" : req.status.message
		});
	}
	else if (req.status.result === "error") {
		res.status(500).json({
			"result" : "error",
			"message" : req.status.message
		});
	}

};

router.post('/solutions', auth, this.verifyUser, this.verifySolution, this.postSolution);

/* POST new solution to a single question*/
router.post('/solutions_old/', function(req,res,next) {
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

router.param('quiz_question', function(req, res, next, id) {
	var query = Question
				.findById(id)
				.select('qtype body options publicdata questionnaire');
	query.exec(function (err, quiz_question) {
		if (err) { return next(err); }
		req.quiz_question = quiz_question;
		next();
	});
});

router.param('quiz_questionnaire', function(req, res, next, id) {
	var query = Questionnaire
				.find()
				.select('qtype body options publicdata questionnaire');
	query.exec(function (err, quiz_questionnaire) {
		if (err) { return next(err); }
		req.quiz_questionnaire = quiz_questionnaire;
		next();
	});
});
*/
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

var verifyReferrer = function(referrer) {
	User.find({
	  	"email" : referrer,
	  	"type" : "teacher"
	  }).exec(function (err, user) {
	  	if (err) {
	  		return {"result" : "error", "data": err};
	  	}
		if (user.length === 0) {
			return {
				"result" : "failure",
				"message" : "Referrer not found"
			};
		}
		else {
			return {"result" : "error", "data": user};
		}
	  });
	return {"reached" : "end"};
}

verifyRegistration = function(req, res, next) {
		if (req.body.type === "student") {
			User.find({
			  	"email" : req.body.data.referrer,
			  	"type" : "teacher"
			  }).exec(function (err, user) {
			  	if (err) {
			  		req.status = {"result" : "error", "message" : err};
			  		next();
			  	}
				if (user.length === 0) {
					req.status = {
						"result" : "failure",
						"message" : "Referrer not found"
					};
					next();
				}
				else {
					req.status = {
						"result" : "success",
						"message" : "user in referrer field",
						"referrer" : user
					}
					next();
				}
			  });
		}
		else if (req.body.type === "teacher") {
			if (req.body.regiserCode !== "mqg123") {
				req.status = {
					"result" : "failure",
					"message" : "Invalid registration code"
				};
				next();
			}
			else {
				req.status = {
					"result" : "success",
					"message" : "Valid code."
				};
				next();
			}
		}
}

register = function(req, res) {
	if (req.status.result === "success") {

		if (req.body.name.length === 0 || 
			req.body.email.length === 0 || 
			req.body.password.length === 0) {
		
			res.json({
				"result" : "failure",
				"message" : "Please fill all fields"
			});
			
		}
		else { //All fields set, begin registration
			
			var user = new User();
			user.name = req.body.name;
			user.email = req.body.email;
			user.password = req.body.password;
			user.type = req.body.type;

			if (req.body.type === "student") {
				user.data = {
					"referrer" : {
						"email" : req.status.referrer[0].email,
						"id" : req.status.referrer[0].id
					}
				};
			}
			else {
				user.data = {};
			}
			

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
					else {
						res.status(500).json({
							"result" : "failure",
							"error" : err
						});
						return;
					}
				}
				else {
					var token;
					token = user.generateJwt();
					res.status(200);
					res.json({
						"result": "success",
						"token": token
					});
				}
			}); //End of 'user.save'
		} //End of 'Else' for 'all fields set'
	} //End of result == success

	else if (req.status.result === "failure") {
		res.status(404).json({
			"result" : "failure",
			"message" : req.status.message
		});
	}
	else if (req.status.result === "error") {
		res.status(500).json({
			"result" : "error",
			"message" : req.status.message
		});
	}


	/*
	if (req.body.type === "student") {
		if (req.status.result === "error") {
			res.status(500).json({
				"result" : "error",
				"message" : req.status.message
			});
		}
		else if (req.status.result === "failure") {
			res.status(404).json({
				"result" : "failure",
				"message" : req.status.message
			});
		}
		else if (req.status.result === "success") {

		}
	}
	else if (req.body.type === "teacher") {

	}
	*/
};

//Handles registration for bot student and teacher.
register2 = function(req, res) {
/*
	//in case student registers, check that referrer exists 
	if (req.body.type === "student") {
	  User.find({
	  	"email" : req.body.data.referrer,
	  	"type" : "teacher"
	  }).exec(function (err, user) {
	  	if (err) {
	  		return res.json({
	  	  	    "result" : "failure",
		  	    "message" : err
		    });
	  	}
		return res.json({
  	  	    "result" : "user apparently found",
	  	    "message" : user
	    });

	  });
	}

	if (req.body.name.length === 0 || req.body.email.length === 0 || req.body.password.length === 0) {
		
		return res.json({
			"result" : "failure",
			"message" : "Please fill all fields"
		});
		
	}

	var user = new User();
	
	user.name = req.body.name;
	user.email = req.body.email;
	user.password = req.body.password;
	user.type = req.body.type;

	if (req.body.type === "teacher") {
		user.data = req.body.data;
	}
	
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
			else {
				res.status(500).json({
					"result" : "failure",
					"error" : err
				});
				return;
			}
		}
		var token;
		token = user.generateJwt();
		res.status(200);
		res.json({
			"result": "success",
			"token": token
		});
	});
*/
};

router.post('/register', verifyRegistration, register);

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


