
module.exports = function(sequelize, DataTypes) {
  var Image = sequelize.define("Image", {
    imageurl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true, 
      }
    },
    body:{
      type:DataTypes.JSON,
      allowNull:true,
      defaultValue:null
    }   
  });

  Image.associate = function(models) {
    Image.belongsTo(models.Taglist, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Image;
};
