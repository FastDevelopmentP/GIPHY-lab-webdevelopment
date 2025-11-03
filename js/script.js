// Confirm the script has loaded
console.log("script.js loaded");

// Select key page elements
const gifContainer = document.querySelector("#gif-container");
const fetchButton = document.querySelector("#fetch-gif-btn");
const searchInput = document.querySelector("#search-input");

// Add a click event listener to the button
fetchButton.addEventListener("click", async function () {
  // Get the user's search term and remove extra spaces
  const searchTerm = searchInput.value.trim();

  // Stop if the input is empty
  if (!searchTerm) {
    alert("Please enter a search term!");
    return;
  }

  // Build the Giphy API URL dynamically using the user's search term
  const endpoint = `https://api.giphy.com/v1/gifs/search/tags?api_key=kRB3yQVxhHG7HfBAwbWk1eFfBTpMHdP3&q=${searchTerm}&limit=25&offset=0`;

  try {
    // Fetch data from the Giphy API
    const response = await fetch(endpoint);
    const data = await response.json();

    // Extract image URLs
    const images = data.data.map(gif => gif.images.original.url);

    // Clear old GIFs
    gifContainer.innerHTML = "";

    // Display new GIFs
    for (let url of images) {
      gifContainer.innerHTML += `<img src="${url}" class="col-3 mb-3 img-fluid" alt="GIF">`;
    }

    // Log useful info for debugging
    console.log(`Search term: ${searchTerm}`);
    console.log(images);
  } catch (error) {
    console.error("Error fetching GIFs:", error);
  }
});
