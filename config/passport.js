var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
	usernameField: 'email'
},
function(username, password, done) {
	User.findOne({ email: username }, function (err, user) {
		if (err) { return done (err); }
		//If given email isn't registered => return
		if (!user) {
			return done(null, false, {
				message: 'User not found'
			});
		}
		//If given password is wrong => return
		if (!user.validPassword(password)) {
			return done(null, false, {
				message: 'Password is wrong'
			});
		}
		//Return the User object if given credentials are correct
		return done(null, user);
	});
}
));