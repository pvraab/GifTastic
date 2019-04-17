// ToDo
// Don't allow duplicate favorites
// Do Download
// Do responsive display
// Integrate this search with additional APIs such as OMDB, or Bands in Town. Be creative and build something you are proud to showcase in your portfolio
// Persist favorites with localStorage
// Improve README.md
// Improve style
$(document).ready(function () {

    var appData = {
        item: null,
        gifData: null,
        queryURL: null,
        isShowGifs: true,
        currentAnimal: null,
        currentAnimal: null,
        favoritesStill: [],
        favoritesAnimate: [],
        favPointer: 0,
        iOffset: 0
    }

    init();

    // Initialize
    function init() {
        $("#gifs-appear-here").show();
        isShowGifs = true;
        console.log("Init favDiv");
        console.log($("#favDiv"));
        $("#favDiv").hide();
    }

    // Add ten more images
    $("#addTen").on("click", function () {
        appData.iOffset += 10;
        displayImages();
    });

    // Show favorites
    $("#showFav").on("click", function () {
        console.log("Fav ");
        console.log($(this));
        if (appData.isShowGifs) {
            appData.isShowGifs = false;
            $("#gifs-appear-here").hide();
            $("#favDiv").show();
            // $("#favDiv").style.visibility = "visible"
            $("#showFav").text("Hide Favorites");
        } else {
            appData.isShowGifs = true;
            $("#gifs-appear-here").show();
            $("#favDiv").hide();
            // $("#favDiv").style.visibility = "hidden"
            $("#showFav").text("Show Favorites");

        }
    });

    // Event listener for all .itemButton elements
    // Revised this event handler to allow for dynamically created buttons
    // $("button").on("click", function () {
    $('#buttons-appear-here').on("click", ".itemButton", function () {

        // Show GIF display
        appData.isShowGifs = true;
        $("#gifs-appear-here").show();
        $("#favDiv").hide();
        $("#showFav").text("Show Favorites");

        // In this case, the "this" keyword refers to the button that was clicked
        // Store the appData.item clicked
        appData.item = $(this).attr("data-item");

        // Display images if new item
        // If not just return
        if (appData.currentItem === null ||
            (appData.currentItem !== appData.item)) {

            // Clear gif div
            $("#gifs-appear-here").empty();

            // Reset offset
            appData.iOffset = 0;

            // Show the gid div
            appData.showGifs = true;
            $("#gifs-appear-here").show();

            console.log("Here 1 " + appData.currentItem + " " + appData.item);

            // Upate the current item and display images
            appData.currentItem = appData.item;
            displayImages();

        } else {
            console.log("Here 2 " + appData.currentItem + " " + appData.item);


            return;
        }

    });

    // Get a new item on submit click
    // This function handles all elements with the "gif" class inside 
    // the "#gifs-appear-here" div and adds
    // an event handler for the "click" event
    $('#newButton').on("click", function () {
        console.log($(this));
        console.log($("#newItem").val());
        var itemName = $("#newItem").val()
        console.log($(typeof (itemName) + " " + itemName));

        var newButton = $("<button>").text($("#newItem").val()).attr("data-item", $("#newItem").val());
        newButton.addClass("itemButton");
        var buttonDiv = $("#buttons-appear-here");
        buttonDiv.append(newButton);
    });

    // Create and display image objects
    function displayImages() {

        // Constructing a URL to search Giphy for the type of the item
        // Build a new queryURL incorporating the item selected into the 
        // Giphy search parameter (q="Search Pattern")
        // We also limit the response to 10 gifs using limit=10.
        // We include my API key in the query.
        // Use https instead of http
        appData.queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            appData.item.toLowerCase() + "&api_key=pMBqTQ3Iw2LTMDyV2fmtQs7YYbFOr7K3&limit=10";

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

            // console.log(JSON.stringify(results[0]));

            // Looping over every result item
            for (var i = 0; i < results.length; i++) {

                // Only taking action if the photo has an appropriate rating
                if (results[parseInt(i)].rating !== "r" && results[parseInt(i)].rating !== "pg-13") {

                    // Creating a div for the gif
                    var gifDiv = $("<div>");

                    // Creating an image tag with class of "gif"
                    var itemImage = $("<img>").addClass("gif");

                    // Giving the image tag an src attribute of a property pulled off the
                    // result item
                    // Why do this versus below
                    itemImage.attr("src", results[parseInt(i)].images.fixed_height.url);

                    // I add these attributes to the image: 
                    //   src, data-still, data-animate, data-state, class
                    // data-still is the still image version
                    // data-animate is the animated image version
                    // data-state is the current image state still/animate
                    // Note: Custom attributes prefixed with "data-" will be completely ignored by the user agent.
                    // From: https://www.w3schools.com/tags/att_global_data.asp
                    itemImage.attr({
                        "src": results[parseInt(i)].images.original_still.url,
                        "data-still": results[parseInt(i)].images.original_still.url,
                        "data-animate": results[parseInt(i)].images.original.url,
                        "data-state": "still"
                    });

                    // Append itemImage, image buttons, and image info to 
                    // the "gifDiv" div created
                    gifDiv.append(itemImage);

                    // Create a download button
                    var downButton = $('<button>').text("Download");
                    downButton.addClass('action-option btn btn-primary');
                    downButton.attr("data-action", "download");
                    downButton.attr("data-url-still", results[parseInt(i)].images.original_still.url);
                    downButton.attr("data-url-animate", results[parseInt(i)].images.original.url);

                    // Create a favorite button
                    var favButton = $('<button>').text("Favorite");
                    favButton.addClass('action-option btn btn-primary');
                    favButton.attr("data-action", "favorite");
                    favButton.attr("data-url-still", results[parseInt(i)].images.original_still.url);
                    favButton.attr("data-url-animate", results[parseInt(i)].images.original.url);

                    $(gifDiv).append(downButton);
                    $(gifDiv).append(favButton);

                    // Storing the result item's rating
                    var rating = results[parseInt(i)].rating;

                    // Storing the result item's title
                    var title = results[parseInt(i)].title;

                    // Creating a paragraph tag with the result item's rating
                    var p = $("<p>").html("Rating: " + rating + "<br>" + "Title: " + title);
                    $(gifDiv).append(p);

                    // Appending the gifDiv to the "#gifs-appear-here" div in the HTML
                    $("#gifs-appear-here").append(gifDiv);
                }
            }
        });

    }

    // Start/Stop animation of images on a mouse click
    // This function handles all elements with the "gif" class inside 
    // the "#gifs-appear-here" div'
    $('#gifs-appear-here').on("click", ".gif", function () {

        console.log("Click on Reg Image");
        console.log(JSON.stringify($(this)));

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

    // Favorite and Download button click handler
    // This function handles all elements with the "action-option" class inside 
    // the "#gifs-appear-here" div
    $('#gifs-appear-here').on("click", ".action-option", function () {

        console.log($(this))

        // $(this) is the element with class 'action-option' that was clicked on
        // Get which button clicked by id
        var action = $(this).attr("data-action");
        console.log("Action " + action)

        // Handle favorite action
        if (action === "favorite") {
            appData.favPointer = appData.favoritesStill.length;
            appData.favoritesStill.push($(this).attr("data-url-still"));
            appData.favoritesAnimate.push($(this).attr("data-url-animate"));
            updateFavorites();
        }

        // Handle download action
        if (action === "download") {
            console.log("Download");
            console.log($(this).attr("data-url-still"));
        }
    });

    // Update favorites
    function updateFavorites() {

        // Creating a div for the gif
        var gifDiv = $("<div>");

        // Creating an image tag with class of "gif"
        var itemImage = $("<img>").addClass("fav");

        // Giving the image tag an src attribute of a property pulled off the
        // result item
        // Why do this versus below
        itemImage.attr("src", appData.favoritesStill[appData.favPointer]);

        // I add these attributes to the image: 
        //   src, data-still, data-animate, data-state, class
        // data-still is the still image version
        // data-animate is the animated image version
        // data-state is the current image state still/animate
        // Note: Custom attributes prefixed with "data-" will be completely ignored by the user agent.
        // From: https://www.w3schools.com/tags/att_global_data.asp
        itemImage.attr({
            "src": appData.favoritesStill[appData.favPointer],
            "data-still": appData.favoritesStill[appData.favPointer],
            "data-animate": appData.favoritesAnimate[appData.favPointer],
            "data-index": appData.favPointer,
            "data-state": "still"
        });

        // Append itemImage, image buttons, and image info to 
        // the "gifDiv" div created
        gifDiv.append(itemImage);

        // Create a delete button
        var deleteButton = $('<button>').text("Delete");
        deleteButton.addClass('action-option btn btn-primary');
        deleteButton.attr("data-action", "delete");
        deleteButton.attr("data-index", appData.favPointer);

        $(gifDiv).append(deleteButton);

        // Appending the gifDiv to the "#gifs-appear-here" div in the HTML
        $("#favorites").append(gifDiv);

    }

    // Clear favorites
    $('#clearFav').on("click", function () {
        appData.favoritesStill = [];
        appData.favoritesAnimate = [];
        appData.favPointer = 0;
        $("#favorites").empty();
    });

    // Start/Stop animation of favorite images
    $("#favorites").on("click", ".fav", function () {

        console.log("Click on Fav Image");
        console.log(JSON.stringify($(this)));

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

    // Delete favorite image
    $("#favorites").on("click", ".action-option", function () {

        console.log("Delete Fav Image");
        console.log($(this));

        // $(this) is the element with class 'action-option' that was clicked on
        // Get which button clicked by id
        var action = $(this).attr("data-action");
        console.log("Action " + action)

        // Handle delete action
        if (action === "delete") {

            if (appData.favoritesStill.length === 0) {
                return;
            }

            // $(this) is the element with class 'gif' that was clicked on
            // We get the index of that image the favoritesStill 
            // and favoritesAnimate arrays
            var indexImg = $(this).attr("data-index");

            // Delete that image
            for (var i = indexImg; i < appData.favoritesStill.length - 1; i++) {
                appData.favoritesStill[parseInt(i)] = appData.favoritesStill[parseInt(i + 1)];
                appData.favoritesAnimate[parseInt(i)] = appData.favoritesAnimate[parseInt(i + 1)];
            }
            appData.favoritesStill.length = appData.favoritesStill.length - 1;
            appData.favoritesAnimate.length = appData.favoritesAnimate.length - 1;
            console.log(appData.favoritesStill);

            // Rebuild favorites from new array
            rebuildFavorites();

            // Refresh page
            // location.reload();
        }
    });

    // Rebuild favorites
    function rebuildFavorites() {

        $("#favorites").empty();

        // Creating a div for the gif
        var gifDiv = $("<div>");

        // Creating an image tag with class of "gif"
        var itemImage = $("<img>").addClass("fav");

        for (var i = 0; i < appData.favoritesStill.length; i++) {


            // Giving the image tag an src attribute of a property pulled off the
            // result item
            // Why do this versus below
            itemImage.attr("src", appData.favoritesStill[parseInt(i)]);

            // I add these attributes to the image: 
            //   src, data-still, data-animate, data-state, class
            // data-still is the still image version
            // data-animate is the animated image version
            // data-state is the current image state still/animate
            // Note: Custom attributes prefixed with "data-" will be completely ignored by the user agent.
            // From: https://www.w3schools.com/tags/att_global_data.asp
            itemImage.attr({
                "src": appData.favoritesStill[parseInt(i)],
                "data-still": appData.favoritesStill[parseInt(i)],
                "data-animate": appData.favoritesAnimate[parseInt(i)],
                "data-index": i,
                "data-state": "still"
            });

            // Append itemImage, image buttons, and image info to 
            // the "gifDiv" div created
            gifDiv.append(itemImage);

            // Create a delete button
            var deleteButton = $('<button>').text("Delete");
            deleteButton.addClass('action-option btn btn-primary');
            deleteButton.attr("data-action", "delete");
            deleteButton.attr("data-index", i);

            appData.favPointer = i;

            $(gifDiv).append(deleteButton);

            // Appending the gifDiv to the "#gifs-appear-here" div in the HTML
            $("#favorites").append(gifDiv);
        }

    }



});