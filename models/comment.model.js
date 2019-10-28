'use strict';

module.exports= (sequelize, Datatypes)=>{
    const Comment = sequelize.define('Comment', {
            id:{
                type: Datatypes.INTEGER,
                autoIncrement:true,
                primaryKey: true,
                allowNull:false,
                unique: true
            },
            rating:{
                type:Datatypes.INTEGER,
                required:false,
                allowNull:true,
                validate: {
                    max: 5,
                    min: 1,
                }
            },
            text: {
                type: Datatypes.STRING,
                allowNull:true,
                required:true,
            }
        },
        {
            timestamps:true,
            underscored:true,
            paranoid:true
        }
    );

    Comment.beforeCreate( async (comment, options) => {
        comment.text = comment.text.toLowerCase()
    });

    Comment.beforeUpdate( async (comment, options) => {
        comment.text = comment.text.toLowerCase()
    });

    Comment.associate = (models) => {
        models.Comment.belongsTo(models.User);
        models.Comment.belongsTo(models.Post);
    };
    
    return Comment
};