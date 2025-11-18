// Get references to the elements
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote-btn');

// This function fetches a quote from the Quotable API
async function generateQuote() {
    // Show a loading state while fetching
    quoteText.textContent = "Fetching an inspiring quote...";
    quoteAuthor.textContent = "";

    // The API endpoint for a random quote
    const apiUrl = 'https://api.quotable.io/random';

    try {
        // 1. Fetch the data from the API
        const response = await fetch(apiUrl);

        // Check if the request was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 2. Parse the JSON response
        const data = await response.json(); 
        
        // 3. The Quotable API returns a single object where:
        //    'content' is the quote text
        //    'author' is the author name

        // 4. Update the content of the HTML elements
        quoteText.textContent = data.content;
        quoteAuthor.textContent = `— ${data.author}`;

    } catch (error) {
        // Handle any errors (network issues, API server down, etc.)
        console.error("Error fetching quote:", error);
        quoteText.textContent = "Error: Could not load quote. Please check your connection.";
        quoteAuthor.textContent = "";
    }
}

// Add an event listener to the button
newQuoteBtn.addEventListener('click', generateQuote);

// Display the first quote when the page loads
generateQuote();