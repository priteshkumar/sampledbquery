$(document).ready(function() {
  

  // Getting jQuery references to the post body, title, form, and author select
  var bodyInput = $("#body");
  var titleInput = $("#title");
  var cmsForm = $("#cms");
  var user = $("#user");



  // Adding an event listener for when the form is submitted
  $(cmsForm).on("submit", handleFormSubmit);
  // Gets the part of the url that comes after the "?" (which we have if we're updating a post)
  var url = window.location.search;
  var postId;
  var authorId;
  // Sets a flag for whether or not we're updating a post to be false initially
  var updating = false;
  var webinfo = "tesla";
  var wikilink = "wikipedia.org/tesla";
  var youtubelink = "youtube.com/tesla";
  var twitterlink = "twitter.com/tesla";
  var imagelink = "image.com/tesla";
  var likes = 1;
  var tag = "tech";
  var comments = [{"text":"new bucketlist"}];
  

  // If we have this section in our url, we pull out the post id from the url
  // In '?post_id=1', postId is 1
  if (url.indexOf("?bucketlist_id=") !== -1) {
    console.log("update bucketlist");
    postId = url.split("=")[1];
    getPostData(postId, "post");
  }

  // Otherwise if we have an author_id in our url, preset the author select box to be our Author
  else if (url.indexOf("?username=") !== -1) {
    authorId = url.split("=")[1];
  }

  // Getting the authors, and their posts
  getAuthors();

  // A function for handling what happens when the form to create a new post is submitted
  function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the post if we are missing a body, title, or author
    if (!titleInput.val().trim() || !bodyInput.val().trim() || !user.val()) {
      return;
    }
    // Constructing a newPost object to hand to the database
    var newPost = {
      title: titleInput
        .val()
        .trim(),
      info: bodyInput
        .val()
        .trim(),
      body:{"webinfo":webinfo,
            "wikilink":wikilink,
            "videolink":youtubelink,
            "twitterlink":twitterlink,
            "imagelink":imagelink,
            "likes":likes,
            "tag":tag,
            "comments":comments
          },
      username: user.val().trim()
    };

    // If we're updating a post run updatePost to update a post
    // Otherwise run submitPost to create a whole new post
    if (updating) {
      newPost.id = postId;
      newPost.completed = true;
      newPost.body.likes = parseInt(likes) + 1;
      comments.push({"text":"your bucketlist is awesome"});
      newPost.body.comments = comments
      console.log("updating post");
      updatePost(newPost);
    }
    else {
      console.log(newPost);
      submitPost(newPost);
    }
  }

  // Submits a new post and brings user to blog page upon completion
  function submitPost(post) {
    $.post("/api/bucketlists", post, function() {
      window.location.href = "/blog";
    });
  }

  // Gets post data for the current post if we're editing, or if we're adding to an author's existing posts
  function getPostData(id, type) {
    var queryUrl;
    switch (type) {
      case "post":
        queryUrl = "/api/bucketlists/" + id;
        break;
      case "author":
        queryUrl = "/api/users/" + id;
        break;
      default:
        return;
    }
    $.get(queryUrl, function(data) {
      if (data) {
        console.log(data.UserId || data.id);
        // If this post exists, prefill our cms forms with its data
        titleInput.val(data.title);
        bodyInput.val(data.info);
        authorId = data.UserId || data.id;
        // If we have a post with this id, set a flag for us to know to update the post
        // when we hit submit
        if(data.body !== undefined && data.body !== null){
          webinfo = data.body.webinfo;
          wikilink = data.body.wikilink;
          videolink = data.body.videolink;
          twitterlink = data.body.twitterlink;
          imagelink = data.body.imagelink;
          likes = parseInt(data.body.likes);
          tag = data.body.tag;
          comments = data.body.comments;

        }
        updating = true;
      }
    });
  }

  // A function to get Authors and then render our list of Authors
  function getAuthors() {
    $.get("/api/users", renderAuthorList);
  }
  // Function to either render a list of authors, or if there are none, direct the user to the page
  // to create an author first
  function renderAuthorList(data) {
    if (!data.length) {
      window.location.href = "/users";
    }
    $(".hidden").removeClass("hidden");
    var rowsToAdd = [];
    for (var i = 0; i < data.length; i++) {
      rowsToAdd.push(createAuthorRow(data[i]));
    }
    user.empty();
    console.log(rowsToAdd);
    console.log(user);
   // authorSelec.append(rowsToAdd);
   // authorSelect.val(authorId);
  }

  // Creates the author options in the dropdown
  function createAuthorRow(author) {
    var listOption = $("<option>");
    listOption.attr("value", author.id);
    listOption.text(author.username);
    return listOption;
  }

  // Update a given post, bring user to the blog page when done
  function updatePost(post) {
    console.log("update post ajax");
    $.ajax({
      method: "PUT",
      url: "/api/bucketlists",
      data: post
    })
    .done(function() {
      window.location.href = "/blog";
    });
  }
});
