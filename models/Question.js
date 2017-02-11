var mongoose = require('mongoose');

var QuestionSchema = new mongoose.Schema({
	qtype: String,
	body: String,
	options: [],
	data: {},
	publicdata: {},
	questionnaire: { type: mongoose.Schema.Types.ObjectId, ref: 'Questionnaire' }
});

mongoose.model('Question', QuestionSchema);