var db = require("../models");

module.exports = function(app) {


 

  app.get("/api/imagelists", function(req, res) {
    var query = {};
 
    function getTagimagelists() {

    	db.Image.findAll({
      		where: query,
      		include: [db.Taglist]
    	}).then(function(dbImagelist) {
      		res.json(dbImagelist);
    	});  
    }

    if (req.query.tag_id) {
      query.taglistId = req.query.tag_id;
      getTagimagelists();
    }
    else if(req.query.tagname){
    	db.Taglist.findOne({
    		where :{tagname:req.query.tagname}
		}).then(function(dbTag){
			query.taglistId = parseInt(dbTag.id);
			getTagimagelists();
		});
    } 
    else {
    	getTagimagelists();
    }
    
  });





  app.get("/api/imagelists/latest", function(req, res) {
    db.Image.count().then(function(imageCount) {
     	console.log(imageCount);
     	db.Image.findAll({
     		offset:imageCount - 5
     	}).then(function(dbImagelist){
           res.json(dbImagelist);
     	}); 
    });
  
  });

 

/*
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


*/

  // POST route for saving a new post
  app.post("/api/imagelists", function(req, res) {
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
