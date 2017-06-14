var mongoose = require('mongoose');

var QuestionSchema = new mongoose.Schema({
	author: {},
	qtype: String,
	body: String,
	options: [],
	data: {},
	publicdata: {},
	questionnaire: { }
});

mongoose.model('Question', QuestionSchema);