
var topics = ["sports", "books", "cars", "people", "technology"];

$(document).ready(function () {
    renderButtons();
})

function renderButtons() {
    $("#topics").empty();
    var rowItems =0 ;
    for (i = 0; i < topics.length; i++) {
        rowItems++
        if (rowItems % 12 === 0) {
            newRow = $("<div>");
            newRow.addClass("row");
            $("#topics").append(newRow);
            rowItems =0 ;
        }
        newDiv = $("<button>");
        newDiv.addClass("col-sm-1");
        btn = $("<button>");
        btn.addClass("btn btn-info btn-md topic");
        btn.text(topics[i]);
        console.log("topic value",i);
        newDiv = newDiv.prepend(btn);
        $("#topics").append(newDiv);
    }
}

// Add a new topic button 
$(document.body).on("click", "#btn-add", function () {
    var topic = $("#text-add").val().trim();
    console.log("topic ", topic);
    topics.push(topic);
    renderButtons()
    getApiData(topic);
});

// Query topic button 
$(document.body).on("click", ".topic", function () {
    var topic = $(this).text().trim();
    console.log("topic button", topic);
    getApiData(topic);
});

// build API query
function buildQueryURL(tp) {
    var queryURL = "https://api.giphy.com/v1/gifs/search?";
    var apiKey = "Df9MsomLRjbMOrMmCM0UTxSNocVYa8no";
    var queryParams = "q=" + tp + "&api_key=" + apiKey + "&limit=12";
    return queryURL + queryParams;
}

// Click event on image
$(document.body).on("click", ".gif", function (event) {
    event.preventDefault();
    var state = $(this).attr("data-state");
    if (state === "still") {
      $(this).attr("src", $(this).attr("data-animate"));
      $(this).attr("data-state", "animate");
    } else {
      $(this).attr("src", $(this).attr("data-still"));
      $(this).attr("data-state", "still");
    }
});

// call API to get results from query
function getApiData(tp) {
    $("#images").empty();
    // Build the query URL for the ajax request 
    var queryURL = buildQueryURL(tp);
    var rowItems =0 ;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log("Data : ", response);
        var results = response.data;
        // Looping through each result item
        for (var i = 0; i < results.length; i++) {
            if (i === 0 || i === 6) {
                rowId = "row-" + String(i);
                newRow = $("<div>");
                newRow.attr("id",rowId);
                newRow.addClass("row");
                $("#images").append(newRow);
            }
            // Creating and storing a div tag
            var div = $("<div>");
            div.addClass("col-sm-2");
            // Creating a paragraph tag with the result item's rating
            var p = $("<p>").text("Rating: " + results[i].rating.toUpperCase());

            // Creating and storing an image tag
            var img = $("<img>");
            // Setting the src attribute of the image to a property pulled off the result item
            img.attr("src", results[i].images.fixed_height.url);
            img.attr("data-still",results[i].images.fixed_width_still.url);
            img.attr("data-animate",results[i].images.fixed_height.url);
            img.attr("data-state","still");
            img.addClass("img-rounded img-responsive gif");
            // Appending the paragraph and image tag to the Div
            div.append(img);
            div.append(p);
            $("#"+rowId).append(div);
        }
    });
}