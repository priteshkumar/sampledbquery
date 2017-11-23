var db = require("../models");

module.exports = function(app) {


 

  app.get("/api/bucketlists", function(req, res) {
    var query = {};
 
    function getUserbktlists() {

    	db.Bucketlist.findAll({
      		where: query,
      		include: [db.User]
    	}).then(function(dbBucketlist) {
      		res.json(dbBucketlist);
    	});  
    }

    if (req.query.user_id) {
      query.userId = req.query.user_id;
      getUserbktlists();
    }
    else if(req.query.username){
    	db.User.findOne({
    		attributes:{exclude:["email","password"]},
    		where :{username:req.query.username}
		}).then(function(dbUser){
			query.userId = parseInt(dbUser.id);
			getUserbktlists();
		});
    } 
    else {
    	getUserbktlists();
    }
    
  });





  app.get("/api/bucketlists/latest", function(req, res) {
    db.Bucketlist.count().then(function(bktCount) {
     	console.log(bktCount);
     	db.Bucketlist.findAll({
     		offset:bktCount - 5
     	}).then(function(dbBucketlist){
           res.json(dbBucketlist);
     	}); 
    });
  
  });

 


  app.get("/api/bucketlists/:id", function(req, res) {
    db.Bucketlist.findOne({
      where: {
        id: req.params.id
      },
      include: [db.User]
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });




  // POST route for saving a new post
  app.post("/api/bucketlists", function(req, res) {
  	db.User.findOne({
        where:{username:req.body.username}
      }).then(function(dbUser){
      	console.log("####create post###");
        console.log(dbUser);
        req.body.UserId = parseInt(dbUser.id);
        db.Bucketlist.create(req.body).then(function(dbBucketlist) {
      	res.json(dbBucketlist);
    });
  });

    
});



/*
  // DELETE route for deleting posts
  app.delete("/api/bucketlists/:id", function(req, res) {
    db.Bucketlist.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });

*/


  // PUT route for updating posts
  app.put("/api/bucketlists", function(req, res) {
    db.Bucketlist.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(dbPost) {
        res.json(dbPost);
      });
  });
};
