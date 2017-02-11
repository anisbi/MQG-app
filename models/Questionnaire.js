var mongoose = require('mongoose');

var QuestionnaireSchema = new mongoose.Schema({
	title: String,
	author: String,
	questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question'}]
});

mongoose.model('Questionnaire', QuestionnaireSchema);