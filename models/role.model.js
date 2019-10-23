'use strict';

module.exports= (sequelize, Datatypes)=>{
    const Role = sequelize.define('Role', {
            id:{
                type: Datatypes.INTEGER,
                autoIncrement:true,
                primaryKey: true,
                allowNull:false,
            },
            permission_level:{
                type:Datatypes.INTEGER,
                required:true,
                allowNull:false,
                validate: {
                    max: 20,
                    min: 1,
                }
            }
        },
        {
            timestamps:true,
            underscored:true,
            paranoid:true
        });
    
    return Role
};