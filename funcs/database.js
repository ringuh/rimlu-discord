module.exports = {
    connection: () => {
        const mongoose = require('mongoose');
        mongoose.Promise = require('bluebird'); // removes deprecated messages
        const config = require('../config.json');

        if (mongoose.connection.readyState === 1)
            return mongoose.connection

        mongoose.connect(config.database, config.db_options);

        mongoose.connection.on('connected', function () {
            console.log("Mongoose default connection is open to ", config.database)
        });

        mongoose.connection.on('error', function (err) {
            console.log("Mongoose default connection has occured " + err + " error")
        });

        mongoose.connection.on('disconnected', function () {
            console.log("Mongoose default connection is disconnected")
        });

        // program exit
        process.on('SIGINT', function () {
            mongoose.connection.close(function () {
                console.log("Mongoose default connection is disconnected due to application termination")
                process.exit(0)
            });
        });


        return mongoose.connection
    }

}