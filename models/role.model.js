'use strict';

module.exports= (sequelize, Datatypes)=>{
    const Role = sequelize.define('Role', {
            id:{
                type: Datatypes.INTEGER,
                autoIncrement:true,
                primaryKey: true,
                allowNull:false,
                unique: true
            },
            permission_level:{
                unique: true,
                type:Datatypes.INTEGER,
                required:true,
                allowNull:false,
                validate: {
                    max: 20,
                    min: 1,
                }
            },
            permission_type:{
                type:Datatypes.STRING,
                required:true,
                allowNull:true,
                unique: true
            }
        },
        {
            timestamps:true,
            underscored:true,
            paranoid:true
        }
    );
    
    Role.associate = (models) => {
        models.Role.hasMany(models.User,{
            as: 'users',
        });
    };
    
    return Role
};