// Get references to the elements
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote-btn');
const copyQuoteBtn = document.getElementById('copy-quote-btn');
const tweetQuoteBtn = document.getElementById('tweet-quote-btn');
const loadingSpinner = document.getElementById('loading-spinner');
const btnText = document.getElementById('btn-text');
const notification = document.getElementById('notification');
const quoteCountElement = document.getElementById('quote-count');

let quoteCount = 0;

// This function fetches a quote from the Quotable API
async function generateQuote() {
    // Show loading state
    quoteText.textContent = "Fetching an inspiring quote...";
    quoteAuthor.textContent = "";
    loadingSpinner.style.display = 'inline-block';
    btnText.textContent = 'Loading...';
    newQuoteBtn.disabled = true;

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
        
        // Increment and update quote counter
        quoteCount++;
        quoteCountElement.textContent = quoteCount;

    } catch (error) {
        // Handle any errors (network issues, API server down, etc.)
        console.error("Error fetching quote:", error);
        quoteText.textContent = "Error: Could not load quote. Please check your connection.";
        quoteAuthor.textContent = "";
    } finally {
        // Reset button state
        loadingSpinner.style.display = 'none';
        btnText.textContent = 'New Quote';
        newQuoteBtn.disabled = false;
    }
}

// Copy quote to clipboard
function copyQuoteToClipboard() {
    const quote = `${quoteText.textContent} ${quoteAuthor.textContent}`;
    
    navigator.clipboard.writeText(quote)
        .then(() => {
            // Show notification
            notification.textContent = "Quote copied to clipboard!";
            notification.classList.add('show');
            
            // Hide notification after 3 seconds
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            notification.textContent = "Failed to copy quote!";
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        });
}

// Tweet the current quote
function tweetQuote() {
    const quote = `${quoteText.textContent} ${quoteAuthor.textContent}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quote)}`;
    window.open(twitterUrl, '_blank');
}

// Add event listeners to the buttons
newQuoteBtn.addEventListener('click', generateQuote);
copyQuoteBtn.addEventListener('click', copyQuoteToClipboard);
tweetQuoteBtn.addEventListener('click', tweetQuote);

// Display the first quote when the page loads
generateQuote();