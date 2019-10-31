
'use strict';

module.exports = (sequelize, DataTypes) => {
    const Chat = sequelize.define('Chat', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      from_user_id: {
        type: DataTypes.UUID,
        required:true,
        allowNull:true,
      },
      from_chatroom_id: {
        type: DataTypes.INTEGER,
        required:true,
        allowNull:true,
      },
      message:{
        type: DataTypes.STRING,
        required:true,
        allowNull:true,
      },
    }, {
      timestamps: true,
      underscored: true,
    });

    Chat.associate = (models) => {
      models.Chat.belongsTo(models.User, { // automatically uses the primary key from role model
        as: 'from_user', // this is the hide field to populate the foreign key data
        foreignKey: 'from_user_id' // this is the key for this user model
      });
      models.Chat.belongsTo(models.Chatroom, {
        as: 'from_chatroom', // this is the hide field to populate the foreign key data
        foreignKey: 'from_chatroom_id'
      });
    };
  
    return Chat;
};