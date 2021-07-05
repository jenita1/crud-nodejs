var mongoose =require("mongoose");

module.exports =function(config){
	mongoose.connect(config.mongodb.dbUrl + '/' + config.mongodb.dbName, {useNewUrlParser: true, useUnifiedTopology: true});
	mongoose.connection.on('error',function(err){
		console.log('error in connecting',err);
	})
	mongoose.connection.once('open', function(){
		console.log('Successfull connecting to database')
	})
};
