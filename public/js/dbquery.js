
  //Get bucketlists for all users or for a specific user . 
  //in case of specific user , username is specified in req.query
  function getBucketlists() {
    var user = "kevq";
    var userName = user || "";
    if (userName) {
      userName = "/?username=" + userName;
    }
    $.get("/api/bucketlists" + userName, function(data) {
      console.log("Bucketlists", data);
      var posts = data;
      
    });
  }


//Add user
  function addUser(){
  
    upsertUser({
      username:"kav"
      email:"kva@gmail.com",
      password:"kavajk"
    });
  
  }

  // A function for adding a user. Calls getUsers upon completion
  function upsertUser(authorData) {
    $.post("/api/users", authorData)
      .then(function(data){
        console.log(data);
      });
  }



function getUsers() {
    $.get("/api/users", function(data) {
      console.log(data);
      for(var i=0;i < data.length;i++){
        console.log(data[i].username);
      }
    });
}




 function createBucketlist(){
     // Constructing a newPost object to hand to the database
    
    var webinfo = "tesla";
    var wikilink = "wikipedia.org/tesla";
    var videolink = "youtube.com/tesla";
    var twitterlink = "twitter.com/tesla";
    var imagelink = "instagram.com/tesla.jpg";
    var likes = "1";
    var tag = "tech";
    var comments = [{"text":"new bucketlist"}];

    var newBucketlist = {
      title: "teslanews",
      info: "visit tesla this weekend and will have teavana tea",
      body:{"webinfo":webinfo,
            "wikilink":wikilink,
            "videolink":youtubelink,
            "twitterlink":twitterlink,
            "imagelink":imagelink,
            "likes":likes,
            "tag":tag,
            "comments":comments
          },
      username: "kevq"
    };

    submitBucketlist(newBucketlist);
 }


 //add a new bucketlist for a user, the username is specified in req.body
 function submitBucketlist(newBucketlist) {
    $.post("/api/bucketlists", newBucketlist, function() {
      console.log("bucketlist added");
    });
  }





//ajax call for updating a bucketlist. bucketlist id is in the req.body
function updateBucketlist(bucketlist){
  $.ajax({
    url:"/api/bucketlists",
    method:"PUT",
    data:bucketlist
  }).done(function(data){
    console.log(data);
  });

}




//update a bucketlist given its id.
function updateBucketlist(){
  var bucketlistId = 1;
  var queryUrl = "/api/bucketlists/" + bucketlistId;
  
  $.get(queryUrl,function(data){
    console.log(data);
    var updateBucketlist = Object.assign({},data);
    console.log(updateBucketlist);
    updateBucketlist.id = bucketlistId;
    updateBucketlist.completed = true;
    updateBucketlist.body.likes = parseInt(updateBucketlist.body.likes) + 1;
    
    var comments = updateBucketlist.body.comments;
    comments.push({"text":"i like your bucketlist"});
    updateBucketlist.body.comments = comments;
    updateBucketlist(updateBucketlist); 

  });

}


//get last five added bucketlists
function getLatestbucketlist(){

  $.get("/api/bucketlists/latest",function(data){
    console.log(data);
  });

}

  
