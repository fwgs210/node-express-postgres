
'use strict';

module.exports = (sequelize, DataTypes) => {
    const Chatroom = sequelize.define('Chatroom', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      room_name:{
        type: DataTypes.STRING,
        required:true,
        allowNull:true,
        unique: true
      },
    }, {
      timestamps: true,
      underscored: true,
    });

    Chatroom.associate = (models) => {
      models.Chatroom.hasMany(models.Chat, {
        as: 'chatroom_chats'
      });

      models.Chatroom.belongsToMany(models.User, {
        through: 'users_to_chatrooms',
        as: 'users',
        foreignKey: 'user_id',
        otherKey: 'chatroom_id'
      });
    };
  
    return Chatroom; 
};