'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config.json');
let db = {};

const sequelize = new Sequelize(config.db.database, config.db.user, config.db.pass, config.db.options)

sequelize
    .authenticate()
    .then(function (err) {
        console.log('Connection has been established successfully.');
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });

fs.readdirSync(__dirname, { withFileTypes: true })
    .filter(file => file.name.endsWith('.model.js'))
    .forEach(function (file) {
        const model = sequelize['import'](path.join(__dirname, file.name));
        db[model.name] = model;
        if (db[model.name].associate) {
            db[model.name].associate(db);
        }
    });


db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.sequelize.sync({ force: false, logging: false })

module.exports = db;