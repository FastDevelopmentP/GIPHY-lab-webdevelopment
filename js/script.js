/**********************
 * Step 1 — Sanity check
 **********************/
console.log("script.js loaded");

/************************************
 * Step 2 — Cache DOM element handles
 ************************************/
const gifContainer = document.querySelector("#gif-container");
const fetchButton  = document.querySelector("#fetch-gif-btn");
const searchInput  = document.querySelector("#search-input");

/***********************************************
 * Step 4 — Temporary API key in client-side JS
 ***********************************************/
const API_KEY = "kRB3yQVxhHG7HfBAwbWk1eFfBTpMHdP3";

/***************************************************************
 * Step 5 — Endpoint from Giphy API Explorer (hardcoded query)
 * Use /v1/gifs/search (returns GIF objects with image URLs).
 ***************************************************************/
const LIMIT  = 25;
const RATING = "g";
const LANG   = "en";
const DEFAULT_QUERY = "cats"; // <-- hardcoded for Step 5e

const endpoint =
  `https://api.giphy.com/v1/gifs/search` +
  `?api_key=${API_KEY}` +
  `&q=${encodeURIComponent(DEFAULT_QUERY)}` +
  `&limit=${LIMIT}` +
  `&offset=0` +
  `&rating=${RATING}` +
  `&lang=${LANG}` +
  `&bundle=messaging_non_clips`;

/******************************************************
 * Step 6 — Read the "Sending API Requests" resource
 * (no code change; moving on to implementation)
 ******************************************************/

/******************************************************************
 * Step 7 — Fetch GIFs and collect original image URLs in an array
 ******************************************************************/
async function fetchGifs(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const data = await res.json();

  // Map to original-sized image URLs
  const images = data.data
    .filter(item => item?.images?.original?.url)
    .map(item => item.images.original.url);

  // Preview in console for verification
  console.log("Fetched image URLs:", images);

  return images;
}

/*****************************************************************************************
 * Step 8 — Display GIFs on the page when the button is clicked (uses Step 7 function)
 * Also includes Extra Credit (Step 10): dynamic search if the input has a value
 *****************************************************************************************/
fetchButton.addEventListener("click", async function () {
  // If the input is empty, we use the hardcoded endpoint from Step 5e.
  const term = searchInput.value.trim();

  // Build a dynamic endpoint if a search term exists (Extra Credit)
  const url = term
    ? (
        `https://api.giphy.com/v1/gifs/search` +
        `?api_key=${API_KEY}` +
        `&q=${encodeURIComponent(term)}` +
        `&limit=${LIMIT}` +
        `&offset=0` +
        `&rating=${RATING}` +
        `&lang=${LANG}` +
        `&bundle=messaging_non_clips`
      )
    : endpoint;

  try {
    const images = await fetchGifs(url);

    // Clear previous results
    gifContainer.innerHTML = "";

    // Render images in a Bootstrap grid
    for (const src of images) {
      gifContainer.innerHTML += `
        <div class="col-6 col-md-3">
          <img src="${src}" class="img-fluid" alt="GIF">
        </div>`;
    }
  } catch (err) {
    console.error("Error fetching GIFs:", err);
    gifContainer.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger" role="alert">
          Failed to fetch GIFs. Check the console for details.
        </div>
      </div>`;
  }
});

