var mongoose = require('mongoose');

var SolutionSchema = new mongoose.Schema({
	qtype: String,
	solver: String, 
	data: {},
	question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }
});

mongoose.model('Solution', SolutionSchema);