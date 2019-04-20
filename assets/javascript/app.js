// ToDo
// DONE - Don't allow duplicate favorites
// Allow user to set how many images per row
// Pop up a modal window with full JSON for an image
// Integrate this search with additional APIs such as OMDB, 
//   or Bands in Town. Be creative and build something you are 
//   proud to showcase in your portfolio
// Persist favorites with localStorage
// Improve README.md
// Improve style
// Do responsive display
// More info button only works now with first 10
// Fix problem with creating a new search button where search keyword is empty
//    Also test for case where search returns 0 items
// Do Download function
// Allow user to set a file name on download
// Find a better initial file name - maybe use title
$(document).ready(function () {

    var appData = {
        item: null,
        gifData: null,
        queryURL: null,
        isShowGifs: true,
        currentItem: null,
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
    // This is done by incrementing by ten the offset variable
    // used in the Giphy query and getting the next set of images
    $("#addTen").on("click", function () {
        appData.iOffset += 10;
        displayImages();
    });

    // Show gifs/favorites
    $("#showFav").on("click", function () {

        // If gifs on then switch to favs
        if (appData.isShowGifs) {
            appData.isShowGifs = false;
            $("#gifs-appear-here").hide();
            $("#favDiv").show();
            $("#showFav").text("Hide Favorites");
        }

        // If favs on then switch to gifs
        else {
            appData.isShowGifs = true;
            $("#gifs-appear-here").show();
            $("#favDiv").hide();
            // $("#favDiv").style.visibility = "hidden"
            $("#showFav").text("Show Favorites");
        }

    });

    // Event listener for all .itemButton elements
    // This function will grab a new set of gifs
    // Revised this event handler to allow for dynamically created buttons
    // looking for clicks in the parent div
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

            // Reset offset when a new category is chosen
            appData.iOffset = 0;

            // Upate the current item
            appData.currentItem = appData.item;

            // Display images
            displayImages();

        }

        // Return if button selected matches the current set displayed
        else {
            return;
        }

    });

    // Create a new itemButton on submit click
    $('#newButton').on("click", function () {
        var itemName = $("#newItem").val().trim();

        // Return if no entry in text field
        if (itemName === null ||
            itemName.length === 0) {
            return;
        }

        // Create a new button
        var newButton = $("<button>").text($("#newItem").val()).attr("data-item", $("#newItem").val());
        newButton.addClass("btn btn-primary itemButton");
        $("#buttons-appear-here").append(newButton);
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

            // Create a new row for this set of Gifs
            var newRow = $("<div>").addClass("row align-items-center");

            // Looping over every result item
            for (var i = 0; i < results.length; i++) {

                // Only take further action if the photo has an appropriate rating
                if (results[parseInt(i)].rating !== "r" && results[parseInt(i)].rating !== "pg-13") {

                    // Creating a div for the gif
                    var gifDiv = $("<div>").addClass("col-sm-12 col-md-6 col-lg-4 d-flex align-items-stretch");

                    // // Creating a div for the gif
                    // var gifDiv = $("<div>");

                    // Create a card for image
                    var newCard = $("<div>").addClass("card gifCard");
                    var newCardBody = $("<div>").addClass("card-body");

                    // Creating an image tag with class of "gif"
                    var itemImage = $("<img>").addClass("gif gifImage card-img-top img-fluid");

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
                    newCardBody.append(itemImage);

                    // gifDiv.append(itemImage);

                    // Storing the result item's rating
                    var rating = results[parseInt(i)].rating;

                    // Storing the result item's title
                    var title = results[parseInt(i)].title;

                    // Creating a paragraph tag with the result item's rating
                    var p = $("<p>").html("Rating: " + rating + "<br>" + "Title: " + title);
                    p.addClass("card-text");
                    newCardBody.append(p);
                    // $(gifDiv).append(p);

                    // Create a moreInfo button
                    var moreInfoButton = $('<button>').text("More Info");
                    moreInfoButton.addClass('action-option btn btn-info btn-lg');
                    moreInfoButton.attr("data-toggle", "modal");
                    moreInfoButton.attr("data-target", "#moreInfoModal");
                    moreInfoButton.attr("data-action", "moreInfo");
                    moreInfoButton.attr("data-results", results[parseInt(i)]);
                    moreInfoButton.attr("data-index", parseInt(i));

                    // Create a favorite button
                    var favButton = $('<button>').text("Favorite");
                    favButton.addClass('action-option btn btn-primary');
                    favButton.attr("data-action", "favorite");
                    favButton.attr("data-url-still", results[parseInt(i)].images.original_still.url);
                    favButton.attr("data-url-animate", results[parseInt(i)].images.original.url);

                    // Create a download button
                    var downButton = $('<button>').text("Download");
                    downButton.addClass('action-option btn btn-primary');
                    downButton.attr("data-action", "download");
                    downButton.attr("data-url-still", results[parseInt(i)].images.original_still.url);
                    downButton.attr("data-url-animate", results[parseInt(i)].images.original.url);

                    newCardBody.append(moreInfoButton);
                    newCardBody.append(favButton);
                    newCardBody.append(downButton);


                    // Appending the gifDiv to the "#gifs-appear-here" div in the HTML
                    newCard.append(newCardBody);
                    gifDiv.append(newCard);
                    newRow.append(gifDiv);

                    $("#gifs-appear-here").append(newRow);
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

        // Handle moreInfo action
        if (action === "moreInfo") {
            console.log("MoreInfo");
            var result = $(this).attr("data-results");
            var index = $(this).attr("data-index");

            var data = appData.gifData.data[parseInt(index)];
            console.log(data);
            console.log(JSON.stringify(data));
            var jsonString = JSON.stringify(data);
            var jsonPretty = JSON.stringify(JSON.parse(jsonString),null,2);  
            var preElem = $("<pre>");
            preElem.html(jsonPretty);
            $("#modalText").html(preElem);
        }

        // Handle favorite action
        // Look for dups
        if (action === "favorite") {
            console.log("Favorite");
            console.log($(this).attr("data-url-still"));
            for (var i = 0; i < appData.favoritesStill.length; i++) {
                if (appData.favoritesStill[i] === $(this).attr("data-url-still")) {
                    console.log("Dup match");
                    return;
                }
            }
            appData.favPointer = appData.favoritesStill.length;
            appData.favoritesStill.push($(this).attr("data-url-still"));
            appData.favoritesAnimate.push($(this).attr("data-url-animate"));
            updateFavorites();
        }

        // Handle download action
        if (action === "download") {
            var urlDown = $(this).attr("data-url-still");
            var parts = urlDown.split('/');
            var lastSegment = parts.pop() || parts.pop();
            var fileStill = "giphy_still.gif"
            $.ajax({
                url: urlDown,
                method: 'GET',
                xhrFields: {
                    responseType: 'blob'
                },
                success: function (data) {
                    var a = document.createElement('a');
                    var url = window.URL.createObjectURL(data);
                    a.href = url;
                    a.download = fileStill;
                    a.click();
                    window.URL.revokeObjectURL(url);
                }
            });

            urlDown = $(this).attr("data-url-animate");
            parts = urlDown.split('/');
            lastSegment = parts.pop() || parts.pop();
            console.log(lastSegment);
            var fileAnimate = "giphy_animate.gif"
            $.ajax({
                url: urlDown,
                method: 'GET',
                xhrFields: {
                    responseType: 'blob'
                },
                success: function (data) {
                    var a = document.createElement('a');
                    var url = window.URL.createObjectURL(data);
                    a.href = url;
                    a.download = fileAnimate;
                    a.click();
                    window.URL.revokeObjectURL(url);
                }
            });
        }

    });

    // Update favorites
    function updateFavorites() {

        // Creating a div for the gif
        var gifDiv = $("<div>");

        // Creating an image tag with class of "fav"
        var itemImage = $("<img>").addClass("fav img-fluid");

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

        // Creating an image tag with class of "fav"
        var itemImage = $("<img>").addClass("fav img-fluid");

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