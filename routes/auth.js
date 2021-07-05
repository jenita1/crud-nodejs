var express = require('express');
var router = express.Router();
var userModel= require('./../models/users');
var passwordHash= require('password-hash');
var jwt = require('jsonwebtoken');

	function createToken(data,config){
		var token =jwt.sign({
			user:data._id
		},config.app.jwtSecret);
		return token;
	}
function validate(req) {
	req.checkBody('user_name', 'username is required').notEmpty();
	req.checkBody('password', 'password is required').notEmpty();
	req.checkBody('password', 'password should not exceed more than 12 characters').isLength({
		max: 12
	});
	req.checkBody('password', 'password must be 8 characters long').isLength({
		min: 8
	});

	var error = req.validationErrors();
	if (error) {
		return error;
	} else {
		return null;
	}
	
}

function map_user_req(user, userDetails) {

	if (userDetails.first_name) {
		user.first_name = userDetails.first_name
	}
	if (userDetails.last_name) {
		user.last_name = userDetails.last_name
	}
	if (userDetails.email) {
		user.email = userDetails.email
	}
	if (userDetails.phone_number) {
		user.phone_number = userDetails.phone_number
	}
	if (userDetails.user_name) {
		user.user_name = userDetails.user_name
	}
	if (userDetails.password) {
		user.password = passwordHash.generate(userDetails.password)
	}
	return user;

}

module.exports = function(express,config){
	// signup user
	router.post('/signup',function(req,res,next){
		var err = validate(req);
		if(err){
			return next(err);
		}

		var newUser = new userModel();

		var mappedUser = map_user_req(newUser, req.body)
			mappedUser.save(function(err, done) {
			if (err) {
				console.log('here');
				return next(err);
			} else {
				console.log('user saved');
				res.status(200).json(done);
			}
		});
	});
		// login user
	router.post('/login', function(req,res,next){
		var err =validate(req);
		if(err){
			return next(err);
		};
		userModel.findOne({
					user_name: req.body.user_name
			}).exec(function(err, user) {
				if (err) {
					return next(err);
				} else {
					console.log('user found', user);
					if(user) {
						var match = passwordHash.verify(req.body.password,user.password)
						if(match){
							var token = createToken(user,config);
							res.status(200).json({
								user:user,
								token:token
							})
						}else{
							next({
								status:401,
								message:'Unauthorized access'
							});
						}

					}else{
						res.status(200);
					}
				}
			});
	});
	

	router.post('/changePassword',function(req,res,next){

		
	});
	return router;

}
