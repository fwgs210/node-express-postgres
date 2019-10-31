'use strict';

module.exports = (sequelize, DataTypes) => {
    const UsersToChatrooms = sequelize.define('UsersToChatrooms', {
        userId: {
            type: DataTypes.INTEGER,
            field: 'user_id',
            allowNull: false,
            primaryKey: true,
        },
        chatroomId: {
            type: DataTypes.INTEGER,
            field: 'chatroom_id',
            allowNull: false,
            primaryKey: true,
        },
    }, {
        tableName: 'users_to_chatrooms',
        underscored: true,
        paranoid: true,
    });

    return UsersToChatrooms;
};