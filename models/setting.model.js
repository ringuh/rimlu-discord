module.exports = function(sequelize, type) {
    const Setting = sequelize.define('Setting', {
        id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        server: {
            type: type.STRING,
            allowNull: false,
        },
        key: {
            type: type.STRING,
            allowNull: false
        },
        value: {
            type: type.STRING,
            allowNull: false,
        },
        type: { // channel, user, guild
            type: type.STRING,
        }

    }, {
        timestamps: true,
    });

    return Setting;
}
