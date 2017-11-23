
module.exports = function(sequelize, DataTypes) {
  var Bucketlist = sequelize.define("Bucketlist", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1,50]
      }
    },
    info: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1,300]
      }
    },
    body: {
      type:DataTypes.JSON,
      allowNull:true,
      defaultValue:null

    },
    completed :{
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:false
    }
  });

  Bucketlist.associate = function(models) {
    Bucketlist.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Bucketlist;
};
