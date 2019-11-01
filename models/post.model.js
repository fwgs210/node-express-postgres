'use strict';

module.exports = (sequelize, Datatypes)=>{
    const Post=  sequelize.define('Post', {
        id:{
            type: Datatypes.UUID,
            primaryKey: true,
            defaultValue: Datatypes.UUIDV4,
            validate: {
                isUUID: 4
            }
        },
        title:{
            type:Datatypes.STRING,
            required:true,
            allowNull:true,
            unique: true
        },
        slug:{
            type:Datatypes.STRING,
            required:true,
            allowNull:true,
            unique: true
        },
        content:{
            type:Datatypes.STRING,
            required:true,
            allowNull:true,
        },
        feature_img: {
            type: Datatypes.STRING,
            allowNull:true,
            required:false
        },
    },
    {
        timestamps:true,
        underscored:true,
        paranoid: true,
    });

    // Method 3 via the direct method
    Post.beforeCreate( (post, options) => {
        const slug = post.slug.startsWith('/') ? post.slug : `/${post.slug}`
        post.title = post.title.toLowerCase()
        post.slug = slug.toLowerCase().replace(/\s+/g, '-')
    });

    Post.beforeUpdate( (post, options) => {
        const slug = post.slug.startsWith('/') ? post.slug : `/${post.slug}`
        post.title = post.title.toLowerCase()
        post.slug = slug.toLowerCase().replace(/\s+/g, '-')
    });

    Post.associate = (models) => {
        models.Post.belongsTo(models.User, {
            as: 'author',
            foreignKey: 'user_id'
        });
        models.Post.belongsTo(models.Category);
        models.Post.hasMany(models.Comment, { as: 'comments' });
    };

    Post.prototype.toJSON =  function () {
        var values = Object.assign({}, this.get());
      
        delete values.author.password;
        return values;
    }
    
    return Post;
};