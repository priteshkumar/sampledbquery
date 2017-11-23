var db = require("../models");

module.exports = function(app) {
  app.get("/api/users", function(req, res) {
    db.User.findAll({
      attributes : {exclude:["email","password"]},
      include: [db.Bucketlist]
    }).then(function(dbUser) {
      console.log(dbUser);
      res.json(dbUser);
    });
  });


  app.get("/api/users/userinfo/:username",function(req,res){
      db.User.findOne({
        attributes: {exclude:["email","password"]},
        where:{username:req.params.username}
      }).then(function(dbUser){
        console.log(dbUser);
        res.json(dbUser);
      });

  });



  app.get("/api/users/:username", function(req, res) {
    
    db.User.findOne({
      where: {
        username: req.params.username
	}
      }).then(function(dbuser){ 
	db.User.findOne({
         where: {
	 id:dbuser.id},
      	include: [db.Bucketlist]
    }).then(function(dbUser) {
      console.log(dbUser);
      res.json(dbUser);
    });
  });
 
  });


  app.post("/api/users", function(req, res) {
    db.User.create(req.body).then(function(dbUser) {
      console.log(dbUser);
      res.json(dbUser);
    });
  });


  app.delete("/api/users/:username", function(req, res) {
    db.User.findOne({
     where:{
	     username:req.params.username
	    }
    }).then(function(dbuser){
    db.User.destroy({
      where: {
        id: dbuser.id
      }
    }).then(function(dbUser) {
      console.log(dbUser);
      res.json(dbUser);
    });
  });
 });

};
