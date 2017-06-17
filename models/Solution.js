var mongoose = require('mongoose');

var SolutionSchema = new mongoose.Schema({
	solver: {},
  question: {},
	data: {},
  createdon: { type: Date, default: Date.now },
});

mongoose.model('Solution', SolutionSchema);