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
                len:[7, 50],
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
        timestamps:true,
        underscored:true,
        paranoid: true,
    });

    // Method 3 via the direct method
    User.beforeCreate( async (user, options) => {
        const hash = await hashPassword(user.password)
        user.password = hash;
        user.username = user.username.toLowerCase()
        user.email = user.email.toLowerCase()
    });

    User.beforeUpdate( async (user, options) => {
        const hash = await hashPassword(user.password)
        user.password = hash;
        user.username = user.username.toLowerCase()
        user.email = user.email.toLowerCase()
    });

    User.beforeFind( async (user, options) => {
        user.password = null;
    });

    User.associate = (models) => {
        models.User.belongsTo(models.Role, { // automatically uses the primary key from role model
            as: 'access_level', // this is the hide field to populate the foreign key data
            foreignKey: 'role_level' // this is the key for this user model
        });

        // VideoclipPlaylistMap.belongsTo(Videoclip, { foreignKey: 'videoclipId', targetKey: 'videoId' });
        // By default, in a belongsTo association, the model's primary key is used as the target key. You need to use the targetKey option in the association.



        // models.User.belongsToMany(models.Post, {
        //     as: 'posts', through: models.Post
        // });

        models.User.hasMany(models.Post, { as: 'posts' });
        models.User.hasMany(models.Comment, { as: 'user_comments' });
    };

    // hide password on find
    User.prototype.toJSON = function() {
        const values = Object.assign({}, this.get());
      
        delete values.password;
        return values;
    }

    return User;
};