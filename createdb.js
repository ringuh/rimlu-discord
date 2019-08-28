const mongoose = require('mongoose');
mongoose.Promise = require('bluebird'); // removes deprecated messages
var chalk = require('chalk'); // colors




const config = require('./config.json');

//require database URL from properties file
//var dbURL = require('./property').db;

var connected = chalk.bold.cyan;
var error = chalk.bold.yellow;
var disconnected = chalk.bold.red;
var termination = chalk.bold.magenta;




mongoose.connect(config.database, config.db_options);

mongoose.connection.on('connected', function () {
	console.log(connected("Mongoose default connection is open to ", config.database));
	createDB();
});

mongoose.connection.on('error', function (err) {
	console.log(error("Mongoose default connection has occured " + err + " error"));
});

mongoose.connection.on('disconnected', function () {
	console.log(disconnected("Mongoose default connection is disconnected"));
});

// program exit
process.on('SIGINT', function () {
	mongoose.connection.close(function () {
		console.log(termination("Mongoose default connection is disconnected due to application termination"));
		process.exit(0)
	});
});

var createDB = () => {
	console.log("creating db")
	let Role = require('./models/role.model')
	let Record = require('./models/record.model')
	Role.collection.drop()
	Record.collection.drop();
	
	console.log("dropped tables")



	setTimeout(() => {
		mongoose.disconnect();
	}, 10000);
};

