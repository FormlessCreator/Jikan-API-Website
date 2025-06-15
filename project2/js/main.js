// Using the past GIYPY as a reference.
// ---------------------------------------------------------------------------------------------------------------------------------------------------
window.onload = (e) => 
    {
        document.querySelector("#search").onclick = SearchButtonClicked;

        // Check if the catergory type is change by user and call the method.
        // Using the onchange event, call the Change Catergory Type function.;
        document.querySelector("#category").onchange = ChangeCategoryType;

        // Get the state change of the previous and next button.
        // Get the state of the previous and next page button on click.
        document.querySelector("#next").onclick = (e) => NextAndPreviousPage(1);
        document.querySelector("#prev").onclick = (e) => NextAndPreviousPage(-1);
    }

    // Get the current page and the total page number.
    let currentPage = 1;
    let totalPages = 0;

    function NextAndPreviousPage(clickAmount)
    {
        // Scroll to the top of the page by calling the move page method.
        movePageTop();

        // Add the click amount to the current page.
        currentPage = currentPage + clickAmount;

        // If the current page is less than 1 set it to 1.
        if(currentPage < 1)
        {
            currentPage = 1;
        }

        // If the current page is greater than the total page set it to the totalpage.
        if(currentPage > totalPages)
        {
            currentPage = totalPages;
        }

        // Console.log;
        console.log(`Current page is: ${currentPage}`);

        // Call the search button click function.
        SearchButtonClicked();
    }

    // This update the visibility of the next and previous page.
    // Depending on the first and last page.
    function UpdatePaginationButtons()
    {
        // Get the state of the previous and next page button on click.
        let prev = document.querySelector("#prev");
        let next = document.querySelector("#next");
    
        // If the page is the first page disable the previous button.
        // My approach not work it seems.
        if(currentPage === 1)
        {
            prev.disabled === true;
        }

        // If the page is the last page disable the next button.
        if(currentPage === totalPages)
        {
            next.disabled === true;
        }
    }

    // Create a Change Catergory Type function. 
    function ChangeCategoryType()
    {
        // Create an array of manga type objects that holds the value and name of a new option.
        const mangaType = [
            {value: "", text: "Any type"},
            {value: "manga", text: "Manga"},
            {value: "novel", text: "Novel"},
            {value: "oneshot", text: "One-shot"},
            {value: "doujin", text: "Doujin"},
            {value: "manhwa", text: "Manhwa"},
            {value: "manhua", text: "Manhua"}
        ]

        // Create an array of anime type objects that holds the value and name of a new option.
        const animeType = [
            {value: "", text: "Any type"},
            {value: "tv", text: "TV"},
            {value: "ova", text: "OVA"},
            {value: "movie", text: "Movie"},
            {value: "special", text: "Special"},
            {value: "ona", text: "ONA"},
            {value: "music", text: "Music"}
        ]

        // Get the catergory type of the current catergory.
        let categoryType = document.querySelector("#category").value;

        // Get the current media type.
        let mediaType = document.querySelector("#media_type");

        // Clear the inner html options for the media type.
        mediaType.innerHTML = "";

        // Create a variable that stores the type of catergory to use.
        // Using a tenary operator for if conditinal check.
        const currentCategoryType = 
        categoryType === "anime" ? animeType : mangaType;

        // Use a for each loop to create new options for the catergory.
        currentCategoryType.forEach(current => {

            // Create a new option element.
            const option = document.createElement("option");

            // Set the option value and text to the current loop types.
            option.value = current.value;
            option.text = current.text;

            // Add or apppend the new option and value for the media type.
            mediaType.appendChild(option);
        });

        // Get the search button inner html.
        let searchButtonLetters = document.querySelector(".green");

        if(categoryType === "anime")
        {
            // Change the inner html of the search button to Anime.
            searchButtonLetters.innerHTML = "Tap for Anime";
        }
        else
        {
            // Change the inner html of the search button to manga.
            searchButtonLetters.innerHTML = "Tap for Manga";
        }
    }
    
    // Create a variable to display the search term
    let displayTerm = "";
    let searchedWord = null;
    
    // Update the search button clicked function
    function SearchButtonClicked()
    {
        // Get the current category.
        // Get the other user URL input for the manga or anime.
        let category = document.querySelector("#category").value;

        // Get the type.
        let type = document.querySelector("#media_type").value;

        // Create a pulldown that search based on type, order_by, gerne, type.
        // Create a Jikan API URL for top anime or manga search.
        // Using the current catergory.
        let JIKAN_URL = null;
        if(category === "anime")
        {
            // Change the url to anime.
            JIKAN_URL = "https://api.jikan.moe/v4/anime";
        }
        else
        {
            // Change the url to manga.
            JIKAN_URL = "https://api.jikan.moe/v4/manga";
        }
    
        // Get the user input search term
        let term = document.querySelector("#searchterm").value;
        
        displayTerm = term;

        // Get the search term.
        let savedTerm = localStorage.getItem('searchedWord');

        // If the term is null load the saved term.
        // Remove whitespace from the search term.
        if (term)
        {
            term = term.trim();
        }
        else
        {
            term = savedTerm;
        }
    
        // Encode spaces and special characters in the term
        term = encodeURIComponent(term);

        // Get the other user URL input for the manga or anime.
        // let genre = document.querySelector("#genre").value;
        let orderBy = document.querySelector("#order_by").value;

        // Create NSFW genres to be excluded from search.
        // For safe search.
        // Hentia = Number 12.
        // Erotica = Number 49.
        // Does not work.
        const NSFW_GENRES = "12,49";

        // If the term is empty, stop execution
        if(term.length < 1) {
            // Get the document status and update to ask user for search term.
            document.querySelector("#status").innerHTML = "Please enter a search term first."
            return;
        }
    
        // Construct the URL with the search term
        let url = `${JIKAN_URL}?q=${term}`;

        // Add page pagination.
        url += `&page=${currentPage}`;

        // Add the other search related types if available.
        // Use a true or false if conditional.
        if(orderBy)
        {
            url += `&order_by=${orderBy}`;
        }

        // Due to many request I remove genre.
        /*if(genre)
        {
            url += `&genre=${genre}`;
        } */

        // Add the excluded NSFW numbers for exclusion.
        url += `&genre_exclude=12,49`;

        if(type)
        {
            url += `&type=${type}`;
        }

        // Get and append the user-chosen search limit if applicable
        let limit = document.querySelector("#limit").value;
        url += `&limit=${limit}`;
        
        // Update the UI status to display the loading message
        document.querySelector("#status").innerHTML = `<b>Searching for '${searchedWord}'</b>`;
    
        // Check to see what the full URL looks like
        console.log(url);
    
        // Request the data using the GetData function
        GetData(url);

        // Save the search word to the local storage.
        localStorage.setItem('searchedWord', term);
    }
    
    // Create the GetData function to fetch data from the API
    function GetData(url)
    {
        let xhr = new XMLHttpRequest();
    
        // Set the onload handler
        xhr.onload = DataLoaded;
    
        // Set the onerror handler
        xhr.onerror = DataError;
    
        // Open a connection and send the request
        xhr.open("GET", url);
        xhr.send();
    }
    
    // Error handling function
    function DataError(e)
    {
        console.log("An error has occurred");
    }
    
    // Data processing function
    function DataLoaded(e)
    {
        let xhr = e.target;
        console.log(xhr.responseText);
    
        let obj = JSON.parse(xhr.responseText);
    
        if(!obj.data || obj.data.length === 0) {
            document.querySelector("#status").innerHTML = `<b>No results found for '${displayTerm}'</b>`;
            return;
        }
        
        // Make the total pages set to the total result lenght.
        // If the pagination or page is undefined, set to 1. 
        totalPages = obj.pagination?.last_visible_page || 1;

        // Call the update.
        UpdatePaginationButtons();

        let results = obj.data;
        console.log("results.length = " + results.length);

        // Store the result here.
        let showResult = `<p><i>Here are ${results.length} results for '${displayTerm}'</i></p>`;

        let bigString = " ";
        
        for(let i = 0; i < results.length; i++) {
            let result = results[i];
    
            // Get the title and synopsis of the anime
            let title = result.title || "No title available";
            let synopsis = result.synopsis || "No synopsis available";
            let imageUrl = result.images.jpg.image_url || "images/no-image-found.png";

            // Get the other information for displaying.
            let airing = result.status ? `${result.status}` : "Unknown";
            let rating = result.rating || "Not Rated";
            let ranking = result.rank ? `#${result.rank}` : "No ranking";
            let episodes = result.episodes ? `${result.episodes}` : "N/A";
            let type = result.type ? `${result.type}` : "Unknown";

            // If the genre length is not null and the gerne lenght > 0;
            let genre = result.genres && result.genres.length > 0 ? 
            result.genres.map(genre => genre.name).join(", ") : "No genre listed";
    
            // Construct the HTML for each result.
            // A class for the image and the details.
            let line = `
            <div class="result">
            <img src="${imageUrl}" class="card-img" alt="${title}" />
            <div class="details">
            <h3 class="card-title">${title}</h3>
            <p class="card-detail"><strong>Info:</strong> ${synopsis}</p>
            <p class="card-status"><strong>Status:</strong> ${airing}</p>
            <p class="card-rating"><strong>Rating:</strong> ${rating}</p>
            <p class="card-ranking"><strong>Ranking:</strong> ${ranking}</p>
            <p class="card-episodes"><strong>Episodes:</strong> ${episodes}</p>
            <p class="card-type"><strong>Type:</strong> ${type}</p>
            <p class="card-gerne"><strong>Genres:</strong> ${genre}</p>
             </div>
            </div>`;
            
        //document.querySelector("#details").innerHTML = details;
            bigString += line;
        }
    
        // Display the result to user.
        document.querySelector("#displayResult").innerHTML = showResult;

        // Display results to the user
        document.querySelector("#content").innerHTML = bigString;
    
        // Update the status
        document.querySelector("#status").innerHTML = "<b>Success!</b>";

    }

    function movePageTop()
    {
        // Scroll to top of the page.
        window.scrollTo
        (
            {
                top: 0,
                behavior: 'smooth',
            }
        );
    }

    