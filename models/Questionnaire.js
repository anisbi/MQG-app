var mongoose = require('mongoose');

var QuestionnaireSchema = new mongoose.Schema({
	title: String,
	author: {},
	createdon: { type: Date, default: Date.now },
	questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question'}]
});

mongoose.model('Questionnaire', QuestionnaireSchema);