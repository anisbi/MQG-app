var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	data : { },
	hash: String,
	salt: String
});

/*
	Hashes and sets the password for the user upon registeration/password reset
*/
UserSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

/*
	Validates given password against stored hash.
*/
UserSchema.methods.validPassword = function(password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
	return this.hash === hash;
};

UserSchema.methods.generateJwt = function() {
	var expiry = new Date();
	expiry.setDate(expiry.getDate() + 7);


	//console.log('in generate jwt');
	//console.log('setting expiry to : ',(expiry.getDate()/1000));

	return jwt.sign({
		_id: this._id,
		email: this.email,
		name: this.name,
		exp: parseInt(expiry.getTime() / 1000),
	}, "T0PPSY_KR!77S");
};

mongoose.model('User', UserSchema);