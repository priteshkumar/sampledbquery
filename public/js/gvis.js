var gvisapiKey = "AIzaSyA61FTMTWGKCwkTzf0IkCM78Edj9xNNoiQ";
var GVIS_URL = 'https://vision.googleapis.com/v1/images:annotate?key=' + gvisapiKey;
var gsearchapiKey = "AIzaSyCnfj0wY8BNRF-ycLyQIRcCdzoPH5950io"; 
var gsearchId = "013265839881010569053:kpoamhrulqo";
var GSEARCH_URL = "https://www.googleapis.com/customsearch/v1?key=" + gsearchapiKey + "&cx=" + gsearchId; 
var seatgeek_id = "OTY4MTUyNHwxNTEwOTg4NTM2LjA1";
var seatgeek_appid = "184216165545f82715a9ce5164f97b59bae40a1a698dfdf2a353e844f9f4010d";

$(function() {
    $('#fileform').on('submit', uploadFiles);
});


function uploadFiles(event) {
    event.preventDefault(); // Prevent the default form post

    // Grab the file and asynchronously convert to base64.
    var file = $('#fileform [name=fileField]')[0].files[0];
    var reader = new FileReader();
    reader.onloadend = processFile;
    reader.readAsDataURL(file);
}


function processFile(event) {
    var content = event.target.result;
    analyseinCloudVis(content.replace('data:image/jpeg;base64,', ''));
}


function analyseinCloudVis(content) {
    var type = $('#fileform [name=type]').val();

    // Strip out the file prefix when you convert to json.
    var request = {
        requests: [{
                image: {
                    content: content
                },
                features: [{
                        type: "LANDMARK_DETECTION",
                        maxResults: 5
                    }, {
                        type: "LABEL_DETECTION",
                        maxResults: 5
                    }, {
                        type: "WEB_DETECTION",
                        maxResults: 10
                    }, {
                        type: "SAFE_SEARCH_DETECTION",
                        maxResults: 5
                    }
                ]
            }
        ]
    };


    $.post({
            url: GVIS_URL,
            data: JSON.stringify(request),
            contentType: 'application/json'
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $('#results').text('ERRORS: ' + textStatus + ' ' + errorThrown);
        }).done(displayJSON);


}


function parseResults(data) {

   // console.log(data);
    //console.log(data.responses[0]);
    //console.log(data[0].labelAnnotations);




    var imgDesc = {};

    var labels = data.responses[0].labelAnnotations;
    for (var i = 0; i < labels.length; i++) {
        console.log(labels[i].description);
    }

    imgDesc.label = labels[0].description;

    if (data.responses[0].landmarkAnnotations !== undefined) {
        var landmarks = data.responses[0].landmarkAnnotations;
        for (var i = 0; i < landmarks.length; i++) {
            console.log(landmarks[i].description);
        }
        imgDesc.landmark = landmarks[0].description;
    }


    var webidentity = data.responses[0].webDetection.webEntities;
    for (var i = 0; i < webidentity.length; i++) {
        console.log(webidentity[i].description);
    }

    imgDesc.webinfo = webidentity[0].description;

    var matchingImages = data.responses[0].webDetection.fullMatchingImages;
    for (var i = 0; i < matchingImages.length; i++) {
        console.log(matchingImages[i].url);
    }

    imgDesc.matchingimage = matchingImages[0].url;

    console.log(imgDesc);

    var dbImgdesc = Object.assign({}, imgDesc);
    console.log(dbImgdesc);
    
    var searchReq = {};
    /* GET https://www.googleapis.com/customsearch/v1?key=INSERT_YOUR_API_KEY&cx=017576662512468239146:omuauf_lfve&q=lectures*/
    if(imgDesc.landmark !== undefined && imgDesc.landmark !== null){
       searchReq.q = imgDesc.landmark;
    }
    else{
      searchReq.q = imgDesc.webinfo;
    }
    
     
    console.log(searchReq);
    $.get(GSEARCH_URL,{q:searchReq.q,num:5}).fail(function(jqXHR, textStatus, errorThrown) {
            $('#results').text('ERRORS: ' + textStatus + ' ' + errorThrown);
        }).done(displaySearchResults);

}


function displaySearchResults(data){
  console.log(data);
  var searchres = data.items;
  for(var i=0;i < searchres.length;i++){
    console.log(searchres[i].displayLink);
    console.log(searchres[i].formattedUrl);
    console.log(searchres[i].htmlSnippet);
    console.log(searchres[i].htmlTitle);
    console.log(searchres[i].pagemap.cse_image[0].src);
    console.log(searchres[i].pagemap.cse_thumbnail[0].src);


  }
}


function displayJSON(data) {
    parseResults(data);
    var contents = JSON.stringify(data, null, 4);
    //parseResults(contents);
    $('#results').text(contents);
    var evt = new Event('results-displayed');
    evt.results = contents;
    document.dispatchEvent(evt);
}