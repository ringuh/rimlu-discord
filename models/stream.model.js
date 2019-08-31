module.exports = function(sequelize, type) {
    const Stream = sequelize.define('Stream', {
        id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        server: {
            type: type.STRING,
            allowNull: false,
        },
        channel: {
            type: type.STRING,
            allowNull: true
        },
        account: {
            type: type.STRING,
            allowNull: false
        },
        platform: {
            type: type.STRING, // TWITCH, YOUTUBE
            allowNull: false,
        }

    }, {
        timestamps: true,
    });

    return Stream;
}
