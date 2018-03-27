//Grab input variables
var shortUrlInput = document.querySelector("#short-input");
var longUrlInput = document.querySelector("#long-input");

//Grab button variables for tracking button presses
var shortenButton = document.querySelector("#long-url button");
var expandButton = document.querySelector("#short-url button");


//User presses submit button
document.addEventListener("click", function (e) {
  e.preventDefault();

  //Determine which action the user wants to complete
  if (e.target == shortenButton) {
    //Check that input value is not blank
    if (longUrlInput.value != "") {
      createShortUrl();
    //If blank show error message
    } else {
      createResponse("You haven't entered a long URL. Enter a long URL to create a short one.");
    }
  } else if (e.target == expandButton) {
    //Check that input value is not blank
    if (shortUrlInput.value != "") {
      expandUrl();
    //If blank show error message
    } else {
      createResponse("You haven't entered a short URL. Enter a short URL to expand it.");
    }
  }
});


//Function to create a paragraph to append to the document
function createResponse (message) {
  //If a message is currently on screen, remove it
  if (document.querySelector("span")) {
    var span = document.querySelector("span");
    container.removeChild(span);
  }

  //Create a span element
  var span = document.createElement("span");
  //Set the content of the span to the message
  span.innerHTML = message;
  //Find the element we want to insert the message after
  var intro = document.querySelector("#container p");
  //Insert the span message after that element
  intro.parentNode.insertBefore(span, intro.nextSibling);
}


function createShortUrl () {
  //Create XML HTTP request
  var shortReq = new XMLHttpRequest();
  //Set URL for request and include API key
  var url = "https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyBMRkeU0d9r8N42_El2L91CwNCfq-0vDyM";
  //Open our request
  shortReq.open("POST", url, true);
  //Set a header for the request with our content type as JSON
  shortReq.setRequestHeader("Content-type", "application/json");
  //Create the callback function when the response is ready
  shortReq.onreadystatechange = function () {
      //If request response is ready and status is clear
      if (shortReq.readyState === 4 && shortReq.status === 200) {
          //Parse json data returned by application
          var json = JSON.parse(shortReq.responseText);
          //Create a response on the page by grabbing the id property
          createResponse("Your new short URL:<br />" + json.id);
      }
  };
  //Stringify the data so it can be passed as JSON
  var data = JSON.stringify({"longUrl": longUrlInput.value}); //grab input value here
  //Send XML HTTP request with above data
  shortReq.send(data);
}


function expandUrl () {
  //Create XML HTTP request
  var expandReq = new XMLHttpRequest();
  //Set URL for request and include API key
  var url = "https://www.googleapis.com/urlshortener/v1/"
  + "url?key=AIzaSyBMRkeU0d9r8N42_El2L91CwNCfq-0vDyM"
  //add shortUrl to GET request
  + "&shortUrl=" + shortUrlInput.value; //grab input value
  //Open our request - GET this time
  expandReq.open("GET", url, true);
  //Set a header for the request with our content type as JSON
  expandReq.setRequestHeader("Content-type", "text/plain");
  //Create the callback function when the response is ready
  expandReq.onreadystatechange = function () {
      //Parse json data returned by application
      var json = JSON.parse(expandReq.responseText);

      //If request response is ready and status is clear
      if (expandReq.readyState === 4) {

        if (expandReq.status === 200) {
          //Create a response on the page by grabbing the id property
          createResponse("The expanded URL:<br />" + json.longUrl);
        } else {
          createResponse("There was an error: " + json.error.code + " " +
          json.error.message);
        }

      }
  };
  //Send XML HTTP request
  expandReq.send();
}
