'use strict';

module.exports= (sequelize, Datatypes)=>{
    const Category = sequelize.define('Category', {
            id:{
                type: Datatypes.INTEGER,
                autoIncrement:true,
                primaryKey: true,
                allowNull:false,
                unique: true
            },
            category_name:{
                unique: true,
                type:Datatypes.STRING,
                required:true,
                allowNull:true
            }
        },
        {
            timestamps:true,
            underscored:true,
            paranoid:true
        }
    );

    Category.beforeCreate( async (cat, options) => {
        cat.category_name = cat.category_name.toLowerCase().replace(/\s+/g, '-')
    });

    Category.beforeUpdate( async (cat, options) => {
        cat.category_name = cat.category_name.toLowerCase().replace(/\s+/g, '-')
    });

    Category.associate = (models) => {
        models.Category.hasMany(models.Post, { as: 'posts' });
    };
    
    return Category
};