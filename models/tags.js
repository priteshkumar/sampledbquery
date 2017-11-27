module.exports = function(sequelize, DataTypes) {
  var Tag = sequelize.define("Tag", {
    tagname: {
    type: DataTypes.STRING,
    unique:true,
    allowNull:false,
    validate:{
      len:[1,50]
    }

   }
});

  Tag.associate = function(models) {
     Tag.hasMany(models.Imagelist, {
      onDelete: "cascade"
    });
  };

  return Tag;
};
