var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Questionnaire = mongoose.model('Questionnaire');
var Question = mongoose.model('Question');
var Solution = mongoose.model('Solution');





/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET all questionnaires. */
router.get('/questionnaires', function(req, res, next) {
	Questionnaire.find(function(err, questionnaires) {
		if (err) { return next(err); }
		
		res.json(questionnaires);
	});
});

/*
	Gets all solutions (questions solved by students) from db.
*/
router.get('/solutions', function(req, res, next) {
	Solution.find(function(err, solutions) {
		if (err) { return next(err); }
		
		res.json(solutions);
	});
});

/* post new questionnaire */
router.post('/questionnaires', function(req, res, next) {
	var questionnaire = new Questionnaire(req.body);

	questionnaire.save(function(err, questionnaire) {
		if (err) { return next(err); }

		res.json(questionnaire);
	});
});


/* GET questionnaire with associated questions. */
router.get('/questionnaires/:questionnaire', function(req, res, next) {

	
	/*
	We populate 'questions' thus exposing sensitive data (such as answer to question)
	Should add a form of authentication in the future.
	*/
	
	req.questionnaire.populate('questions', function (err, questionnaire) {
		if (err) { return next(err); }

		res.json(questionnaire);
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

/* GET question */
router.get('/question/:question', function(req, res, next) {
	/**IMPORTANT!
	At the moment this is very unsecure since the solution
	to the question can be seen. => Would allow cheating
	*/
	res.json(req.question);
});

/* PUT question */
router.put('/question/:question', function(req, res, next) {

	
	//Copy fields
	if (req.body.body) req.question.body = req.body.body;
	if (req.body.options) req.question.options = req.body.options;
	if (req.body.data) req.question.data = req.body.data;
	if (req.body.publicdata) req.question.publicdata = req.body.publicdata;
	//Save
	req.question.save(function(err, newq) {
		if (err) { return next(err); }
		res.json(newq);
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


/* POST new question to questionnaire */
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





module.exports = router;


