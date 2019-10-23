'use strict';
const bcrypt = require('bcryptjs')

const hashPassword = password => bcrypt.hash(password, 10)

module.exports = (sequelize, Datatypes)=>{
    const User=  sequelize.define('User', {
        id:{
            type: Datatypes.UUID,
            primaryKey: true,
            defaultValue: Datatypes.UUIDV4,
            unique: true,
            validate: {
                isUUID: 4
            }
        },
        username:{
            type:Datatypes.STRING,
            required:true,
            allowNull:true,
            unique: true,
            validate: {
                len:[5, 20],
            }
        },
        password:{
            type:Datatypes.STRING,
            required:true,
            allowNull:true,
            validate: {
                len:[8, 20],
            }
        },
        email:{
            type:Datatypes.STRING,
            required:true,
            allowNull:true,
            unique: true,
            validate: {
                isEmail: true,
                len:[7, 100],
            }
        },
        role_level:{
            //fk in permission table
            type:Datatypes.INTEGER,
            required:true,
            allowNull:false
        }
    },
    {
        underscored:true
    });

    // Method 3 via the direct method
    User.beforeCreate( async (user, options) => {
        const hash = await hashPassword(user.password)
        user.password = hash;
    });

    User.beforeUpdate( async (user, options) => {
        const hash = await hashPassword(user.password)
        user.password = hash;
    });

    User.associate = (models) => {
        models.User.belongsTo(models.Role, {
          as: 'permission_level',
          foreignKey: 'role_level'
        });
    };
    return User;
};