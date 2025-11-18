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

// Your API Ninjas key
const API_NINJAS_KEY = 'eKXOgAJVqBFi1Dl1p79AWQ==1hUCmgR3R92Eiv4X';

// Fallback quotes in case API fails
const fallbackQuotes = [
    {
        content: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        content: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs"
    },
    {
        content: "Your time is limited, so don't waste it living someone else's life.",
        author: "Steve Jobs"
    },
    {
        content: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
    },
    {
        content: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill"
    },
    {
        content: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney"
    },
    {
        content: "Life is what happens to you while you're busy making other plans.",
        author: "John Lennon"
    },
    {
        content: "The only impossible journey is the one you never begin.",
        author: "Tony Robbins"
    }
];

// Function to get quote from API Ninjas
async function getApiNinjasQuote() {
    try {
        const response = await fetch('https://api.api-ninjas.com/v1/quotes', {
            method: 'GET',
            headers: {
                'X-Api-Key': API_NINJAS_KEY,
                'Content-Type': 'application/json'
            }
        });

        // Check if the request was successful
        if (!response.ok) {
            throw new Error(`API Ninjas error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // API Ninjas returns an array with one quote object
        if (Array.isArray(data) && data.length > 0) {
            return {
                content: data[0].quote,
                author: data[0].author,
                category: data[0].category
            };
        } else {
            throw new Error('Invalid response from API Ninjas');
        }

    } catch (error) {
        console.error('API Ninjas failed:', error);
        throw error;
    }
}

// Function to get random quote from Type.fit API (fallback)
async function getTypeFitQuote() {
    try {
        const response = await fetch('https://type.fit/api/quotes');
        const quotes = await response.json();
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        return {
            content: randomQuote.text,
            author: randomQuote.author || 'Unknown'
        };
    } catch (error) {
        throw error;
    }
}

// Main function to fetch quotes
async function generateQuote() {
    // Show loading state
    quoteText.textContent = "Fetching an inspiring quote...";
    quoteAuthor.textContent = "";
    loadingSpinner.style.display = 'inline-block';
    btnText.textContent = 'Loading...';
    newQuoteBtn.disabled = true;

    let quoteData = null;
    let apiUsed = 'fallback';

    // Try APIs in order of preference
    const methods = [
        { name: 'API Ninjas', func: getApiNinjasQuote },
        { name: 'Type.fit', func: getTypeFitQuote }
    ];

    for (const method of methods) {
        try {
            console.log(`Trying ${method.name} API...`);
            const data = await method.func();
            
            if (data && data.content && data.author) {
                quoteData = data;
                apiUsed = method.name;
                console.log(`Success with ${method.name}`);
                break;
            }
        } catch (error) {
            console.warn(`${method.name} failed:`, error);
            continue;
        }
    }

    // If all APIs failed, use fallback
    if (!quoteData) {
        console.log('All APIs failed, using fallback');
        const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
        quoteData = fallbackQuotes[randomIndex];
        apiUsed = 'fallback';
    }

    // Update the display
    quoteText.textContent = `"${quoteData.content}"`;
    quoteAuthor.textContent = `— ${quoteData.author}`;
    
    // Show API source in console (optional visual indicator)
    if (apiUsed === 'API Ninjas') {
        quoteText.style.color = '#2c5aa0'; // Different color for premium API
    } else {
        quoteText.style.color = ''; // Reset to default
    }

    console.log(`Quote from: ${apiUsed}`);

    // Increment and update quote counter
    quoteCount++;
    quoteCountElement.textContent = quoteCount;

    // Reset button state
    loadingSpinner.style.display = 'none';
    btnText.textContent = 'New Quote';
    newQuoteBtn.disabled = false;
}

// Copy quote to clipboard
function copyQuoteToClipboard() {
    const quote = `${quoteText.textContent} ${quoteAuthor.textContent}`;
    
    if (!navigator.clipboard) {
        fallbackCopyToClipboard(quote);
        return;
    }
    
    navigator.clipboard.writeText(quote)
        .then(() => {
            showNotification("Quote copied to clipboard!");
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            fallbackCopyToClipboard(quote);
        });
}

// Fallback copy method
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification("Quote copied to clipboard!");
        } else {
            showNotification("Failed to copy quote!");
        }
    } catch (err) {
        console.error('Fallback copy failed: ', err);
        showNotification("Failed to copy quote!");
    }
    document.body.removeChild(textArea);
}

// Show notification
function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Tweet the current quote
function tweetQuote() {
    const quote = `${quoteText.textContent} ${quoteAuthor.textContent}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quote)}`;
    window.open(twitterUrl, '_blank');
}

// Add event listeners
newQuoteBtn.addEventListener('click', generateQuote);
copyQuoteBtn.addEventListener('click', copyQuoteToClipboard);
tweetQuoteBtn.addEventListener('click', tweetQuote);

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Quote Generator initialized with API Ninjas');
    generateQuote();
});