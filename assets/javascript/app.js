$(document).ready(function () {

    var appData = {
        animal: null,
        gifData: null,
        queryURL: null,
        iOffset: 0
    }

    // Add ten more images
    $("#addTen").on("click", function () {
        appData.iOffset += 10;
        displayImages();
    });

    // Event listener for all button elements
    // Revised this event handler to allow for dynamically created buttons
    // $("button").on("click", function () {
    $('#buttons-appear-here').on("click", ".animalButton", function () {

        // Clear gif div
        $("#gifs-appear-here").empty();

        // Reset offset
        appData.iOffset = 0;

        // In this case, the "this" keyword refers to the button that was clicked
        appData.animal = $(this).attr("data-animal");

        // Display images
        displayImages();

    });

    // Create and display image objects
    function displayImages() {

        // Constructing a URL to search Giphy for the type of the animal
        // Build a new queryURL incorporating the animal selected into the 
        // Giphy search parameter (q="Search Pattern")
        // We also limit the response to 10 gifs using limit=10.
        // We include my API key in the query.
        // Use https instead of http
        appData.queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            appData.animal + "&api_key=pMBqTQ3Iw2LTMDyV2fmtQs7YYbFOr7K3&limit=10";

        // Performing our AJAX GET request
        appData.queryURL += "&offset=" + appData.iOffset;

        $.ajax({
            url: appData.queryURL,
            method: "GET"
        }).then(function (response) {

            // Store the response
            appData.gifData = response;

            // Storing an array of results in the results variable
            var results = response.data;

            // Looping over every result item
            for (var i = 0; i < results.length; i++) {

                // Only taking action if the photo has an appropriate rating
                if (results[i].rating !== "r" && results[i].rating !== "pg-13") {

                    // Creating a div for the gif
                    var gifDiv = $("<div>");

                    // Storing the result item's rating
                    var rating = results[i].rating;

                    // Storing the result item's title
                    var title = results[i].title;

                    // Creating a paragraph tag with the result item's rating
                    var p = $("<p>").html("Rating: " + rating + "<br>" + "Title: " + title);

                    // Creating an image tag with class of "gif"
                    var animalImage = $("<img>").addClass("gif");

                    // Giving the image tag an src attribute of a property pulled off the
                    // result item
                    // Why do this versus below
                    animalImage.attr("src", results[i].images.fixed_height.url);

                    // I add these attributes to the image: 
                    //   src, data-still, data-animate, data-state, class
                    // data-still is the still image version
                    // data-animate is the animated image version
                    // data-state is the current image state still/animate
                    // Note: Custom attributes prefixed with "data-" will be completely ignored by the user agent.
                    // From: https://www.w3schools.com/tags/att_global_data.asp
                    animalImage.attr({
                        "src": results[i].images.original_still.url,
                        "data-still": results[i].images.original_still.url,
                        "data-animate": results[i].images.original.url,
                        "data-state": "still"
                    });

                    // Appending the paragraph and animalImage we created to the "gifDiv" div we created
                    gifDiv.append(animalImage);
                    gifDiv.append(p);

                    // Appending the gifDiv to the "#gifs-appear-here" div in the HTML
                    $("#gifs-appear-here").append(gifDiv);
                }
            }
        });

    }

    // This function handles all elements with the "gif" class inside 
    // the "#gifs-appear-here" div and adds
    // an event handler for the "click" event
    $('#gifs-appear-here').on("click", ".gif", function () {

        console.log("gif-appear-here");
        console.log($(this))

        // $(this) is the element with class 'gif' that was clicked on
        var state = $(this).attr("data-state");

        // $(this).attr("data-state") will either be "still" or "animate"
        // If still, we change it to animate
        if (state === "still") {

            var newSrc = $(this).attr("data-animate");
            $(this).attr("src", newSrc);
            $(this).attr("data-state", "animate");

            // OTHERWISE it's animate already, so we change it to still
        } else {
            var newSrc = $(this).attr("data-still");
            $(this).attr("src", newSrc);
            $(this).attr("data-state", "still");
        }
    });

    // Get a new animal on submit click
    // This function handles all elements with the "gif" class inside 
    // the "#gifs-appear-here" div and adds
    // an event handler for the "click" event
    $('#newButton').on("click", function () {
        console.log($(this));
        console.log($("#newAnimal").val());
        var animalName = $("#newAnimal").val()
        console.log($(typeof (animalName) + " " + animalName));

        var newButton = $("<button>").text($("#newAnimal").val()).attr("data-animal", $("#newAnimal").val());
        newButton.addClass("animalButton");
        var buttonDiv = $("#buttons-appear-here");
        buttonDiv.append(newButton);
    });


});