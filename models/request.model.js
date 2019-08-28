module.exports = function(sequelize, type) {
    const Request = sequelize.define('Request', {
        id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        server: {
            type: type.STRING,
            allowNull: false,
        },
        user: {
            type: type.STRING,
            allowNull: false
        },
        role: {
            type: type.STRING,
            allowNull: false,
        }

    }, {
        timestamps: true,
    });

    return Request;
}
