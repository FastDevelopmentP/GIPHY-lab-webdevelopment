/******************************************************************************
 * Step 1 — Initial Setup and Sanity Check
 * Purpose: Verify that our JavaScript file is properly linked to our HTML
 * This helps debug loading issues early in development
 ******************************************************************************/
console.log("script.js loaded");

/******************************************************************************
 * Step 2 — DOM Element Caching
 * Purpose: Store references to frequently accessed DOM elements
 * Benefits: 
 * - Improves performance by avoiding repeated DOM queries
 * - Provides centralized access to important page elements
 * - Makes code more maintainable by using meaningful variable names
 *
 * Elements cached:
 * - gifContainer: Where we'll display our GIF grid
 * - fetchButton: The button that triggers GIF fetching
 * - searchInput: The search box for custom GIF queries
 ******************************************************************************/
const gifContainer = document.querySelector("#gif-container");
const fetchButton  = document.querySelector("#fetch-gif-btn");
const searchInput  = document.querySelector("#search-input");

/******************************************************************************
 * Step 4 — API Configuration
 * Purpose: Store the Giphy API key for authentication
 * 
 * Security Note: In a production environment, this API key should NEVER be
 * stored in client-side code. It should be kept secure on a backend server
 * and accessed through a secure API endpoint.
 * 
 * Current Implementation: Using a temporary API key for development/testing
 ******************************************************************************/
const API_KEY = "kRB3yQVxhHG7HfBAwbWk1eFfBTpMHdP3";

/******************************************************************************
 * Step 5 — API Endpoint Configuration
 * Purpose: Define the Giphy API endpoint and its parameters
 * 
 * API Endpoint Details:
 * - Using: /v1/gifs/search
 * - Returns: Array of GIF objects containing various image formats and metadata
 * 
 * Parameters Explained:
 * LIMIT: Maximum number of GIFs to return (25 is a good balance for performance)
 * RATING: Content rating filter ('g' = general audience)
 * LANG: Language filter for results ('en' = English)
 * DEFAULT_QUERY: Initial search term used when no user input is provided
 * 
 * URL Parameters:
 * - api_key: Authentication token for Giphy API
 * - q: Search query (URL-encoded to handle special characters)
 * - limit: Maximum number of results
 * - offset: Starting position in results (0 = beginning)
 * - rating: Content rating filter
 * - lang: Language filter
 * - bundle: Type of content to return
 ******************************************************************************/
const LIMIT  = 25;          // Number of GIFs to fetch per request
const RATING = "g";         // Keep content family-friendly
const LANG   = "en";        // Filter for English language content
const DEFAULT_QUERY = "cats"; // Default search term if none provided

// Construct the API endpoint URL using template literals for better readability
const endpoint =
  `https://api.giphy.com/v1/gifs/search` +
  `?api_key=${API_KEY}` +
  `&q=${encodeURIComponent(DEFAULT_QUERY)}` + // URL encode to handle special characters
  `&limit=${LIMIT}` +
  `&offset=0` +           // Start from the beginning of results
  `&rating=${RATING}` +
  `&lang=${LANG}` +
  `&bundle=messaging_non_clips`; // Specific content type filter

/******************************************************
 * Step 6 — Read the "Sending API Requests" resource
 * (no code change; moving on to implementation)
 ******************************************************/

/******************************************************************************
 * Step 7 — GIF Fetching Function
 * Purpose: Retrieve GIFs from Giphy API and extract their URLs
 * 
 * Function: fetchGifs
 * Parameters:
 * - url: Complete Giphy API endpoint URL with all query parameters
 * 
 * Process:
 * 1. Makes an asynchronous HTTP request to the Giphy API
 * 2. Checks for successful response
 * 3. Parses JSON response
 * 4. Extracts and processes image URLs
 * 
 * Error Handling:
 * - Throws error for non-200 HTTP responses
 * - Uses optional chaining (?.) to safely handle missing data
 * 
 * Returns: Array of original-size GIF URLs
 ******************************************************************************/
async function fetchGifs(url) {
  // Make the API request and await response
  const res = await fetch(url);
  
  // Check if the request was successful
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  
  // Parse the JSON response
  const data = await res.json();

  // Extract and process image URLs
  // 1. Filter out any items with missing image data using optional chaining
  // 2. Map the filtered results to just the original image URLs
  const images = data.data
    .filter(item => item?.images?.original?.url)
    .map(item => item.images.original.url);

  // Log results for debugging and verification
  console.log("Fetched image URLs:", images);

  return images;
}

/******************************************************************************
 * Step 8 — Event Handler for GIF Display
 * Purpose: Handle button clicks and manage the display of GIFs
 * 
 * Features:
 * 1. Dynamic Search Support (Step 10 Extra Credit)
 *    - Uses user input if available
 *    - Falls back to default query if input is empty
 * 
 * 2. Responsive Grid Layout
 *    - Uses Bootstrap's grid system
 *    - 2 GIFs per row on mobile (col-6)
 *    - 4 GIFs per row on medium+ screens (col-md-3)
 * 
 * 3. Error Handling
 *    - Displays user-friendly error message
 *    - Logs detailed errors to console for debugging
 * 
 * Process Flow:
 * 1. Get search term (if any)
 * 2. Build appropriate API URL
 * 3. Fetch GIFs
 * 4. Clear previous results
 * 5. Display new GIFs or error message
 ******************************************************************************/
fetchButton.addEventListener("click", async function () {
  // Get and clean up user input, removing leading/trailing whitespace
  const term = searchInput.value.trim();

  // Determine which URL to use:
  // - If there's a search term, create a new URL with that term
  // - If no search term, use the default endpoint
  const url = term
    ? (
        `https://api.giphy.com/v1/gifs/search` +
        `?api_key=${API_KEY}` +
        `&q=${encodeURIComponent(term)}` + // Encode search term for URL safety
        `&limit=${LIMIT}` +
        `&offset=0` +
        `&rating=${RATING}` +
        `&lang=${LANG}` +
        `&bundle=messaging_non_clips`
      )
    : endpoint;

  try {
    // Fetch GIF URLs using our fetchGifs function
    const images = await fetchGifs(url);

    // Clear any existing content from the container
    gifContainer.innerHTML = "";

    // Create and append GIF elements to the container
    // Using Bootstrap's grid system for responsive layout
    for (const src of images) {
      gifContainer.innerHTML += `
        <div class="col-6 col-md-3">
          <img src="${src}" class="img-fluid" alt="GIF">
        </div>`;
    }
  } catch (err) {
    // Log the full error to console for debugging
    console.error("Error fetching GIFs:", err);
    
    // Display user-friendly error message in the UI
    gifContainer.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger" role="alert">
          Failed to fetch GIFs. Check the console for details.
        </div>
      </div>`;
  }
});

