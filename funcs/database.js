module.exports = {
    connection: () => {
        const config = require('../config.json');

        const Sequelize = require('sequelize');
        const sequelize = new Sequelize(`postgres://${config.db.user}:${config.db.pass}@${config.db.url}`);
        sequelize
            .authenticate()
            .then(() => {
                console.log('Connection has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            });
        return sequelize
    },

    create: () => {
        
    }

}