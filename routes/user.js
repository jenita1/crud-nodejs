var express = require('express');
var router = express.Router();
var userModel = require('./../models/users');

var passwordHash= require('password-hash')

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

	module.exports =function(){
		// update user by id
	router.put('/:id',function(req,res,next){
		console.log('hello update')
		var userId =req.params.id;

		var err =validate(req);
		if(err){
			return next(err);
		}
		userModel.findById(userId,function(err,user){
			if(err){
				return next(err);
			}
			if(user){
				console.log('user found');
				var updateUser = map_user_req(user,req.body);
				updateUser.save(function(err,done){
					if(err){
						console.log('error');
						return next(err);
					}else{
						console.log('User successfully updated');
						res.status(200).json(done);
					}
				})
			}else{
				console.log('user not found');
				res.status(204);
			}
		});
	});
	// get all users
	router.get('/',function(err,res,next){
		userModel.find({}).exec(function(err,result){
			if(err){
				console.log(err);
				return next(err);
			}else{
				console.log('here all users');
				res.status(200).json(result);
			}
		})
	})
	// delete user
	router.delete('/:id', (req, res, next) => {
	  	userModel.findOne({userId: req.params.id})
	  	.then(() => {
	      res.status(200).json({
	        message: 'User successfully deleted!'
	      });
	    }).catch(
		    (error) => {
		      res.status(400).json({
		        error: error
		      });
		    }
		);
	});
	return router;
}

	



