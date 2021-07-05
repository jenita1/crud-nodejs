var express = require('express')
var app = express();
var port = 7070;
var bodyParser =require ('body-parser');
var morgan =require('morgan');
var path =require('path');
var config = require('./config');
var db =require('./db')(config);
var expressValidators = require('express-validator');
var authentication = require ('./middlewares/authorize');
var second =require ('./middlewares/aMiddleware');


var file = require('./file')();
var authRoute = require ('./routes/auth')(express,config);
var userRoute =require('./routes/user')();



app.use(morgan('dev'));
// third party middleware
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());
// inbuilt middleware
// app.use('/images', express.static(path.join(_dirname,'images')))
app.use(expressValidators({
	  usernameExists: function( username ) { // Create a validator with the name of 'usernameExists' and make it a function
          User.getUserByUsername(user_name, function(err, user) { // Call the model function to find a user by their username
            if ( err ) throw err; // If there is an error throw it
            if(!user_name) { // If the user doesn't exist
                // Return false
            }
            // Otherwise Return true
        });
    }   
}));


// routing middleware under auth route
app.use('/', authRoute);
app.use('/user', authentication, userRoute);


app.use(function(err,req,res,next){
	console.log('error handling middleware');
	res.status(err.status || 500).json({
		status: err.status || 500,
		message: err.message || 'err'
	})
	console.log('err',err)
});


app.get('/create',function(req,res){
	file.write('test.txt',function(err,result){
		if(err){
			console.log('err in writing file',err);
			res.send('error');
		} else{
			console.log('successfull',result);
			res.send('success');
		}
	})
	
})


app.listen(7070, function(err,result){
	if(err){
		console.log('err',err);
	}
	else{
		console.log('server listeining at port ' + port);
	}
})