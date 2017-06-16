var mongoose = require('mongoose');

var SolutionSchema = new mongoose.Schema({
	qtype: String,
	solver: {}, 
	data: {},
	question: String,
});

mongoose.model('Solution', SolutionSchema);