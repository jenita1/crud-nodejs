var jwt = require('jsonwebtoken');
var config = require('./../config');
var userModel = require('./../models/users');

module.exports = function(req, res, next) {
	var token;
	if (req.headers['x-access-token']) {
		token = req.headers['x-access-token'];
	}
	if (req.headers['Authorization']) {
		token = req.headers['Authorization'];
	}
	if (req.query.token) {
		token = req.query.token
	}
	if (token) {
		jwt.verify(token, config.app.jwtSecret, function(err, done) {
			if (err) {
				next({
					status: 400,
					message: 'invalid token'
				})
			} else {
				// console.log('token valid', done);
				userModel.findOne({
					_id: done.user
				}, function(err, result) {
					if (err) {
						return next(err);
					} else {
						// console.log('user found from token', user);
						req.user = result;
						return next();
					}
				})
			}
		})
	} else {
		next({
			status: 401,
			message: 'Token Not Provided'
		})
	}


}
