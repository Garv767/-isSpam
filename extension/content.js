// contentScript.js

/**
 * Maps common email service URLs to their main email body selectors.
 * This is the brittle part—selectors often change.
 */
function getEmailBodySelector(url) {
    if (url.includes("mail.google.com")) {
        // Gmail selector for the main message body. You may need to refine this.
        console.log("Gmail detected");
        return 'div[role="listitem"] div.a3s.aiL'; 
    } else if (url.includes("outlook.live.com") || url.includes("outlook.office.com")) {
        // Outlook selector (simplified example)
        return 'div[aria-label="Message body"]';
    }
    // Add selectors for Apple Mail, Yahoo, etc., here
    return null; 
}

function extractEmailText() {
    const selector = getEmailBodySelector(window.location.href);

    if (selector) {
        const bodyElement = document.querySelector(selector);
        
        // Use innerText to get clean, readable text, ignoring HTML tags
        if (bodyElement) {
            return bodyElement.innerText; 
        }
    }
    return null;
}

// 1. Extract the text and send it to the Service Worker
//console.log("Content script injected");
const extractedText = extractEmailText();
console.log("Extracted Email Text:", extractedText);

if (extractedText) {
    chrome.runtime.sendMessage({ 
        action: "classifyEmail", 
        emailText: extractedText 
    });
    console.log("Request sent");
} else {
    alert("Could not find the email body. Make sure an email is open.");
}


// 2. Listen for the result coming back from the Service Worker/API
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "displayResult") {
        const prediction = request.prediction[0];
        const resultText = (prediction === 'spam') ? "🚨 SPAM DETECTED 🚨" : "✅ HAM (Not Spam) ✅";
        
        // Find a place to display the result (e.g., inject a banner at the top of the email)
        const displayArea = document.querySelector('div[role="main"]'); // Example selector
        if (displayArea) {
            const resultBanner = document.createElement('div');
            resultBanner.style.cssText = 'background: #fcc; color: black; padding: 10px; font-weight: bold; text-align: center;';
            resultBanner.textContent = `Classification Result: ${resultText}`;
            displayArea.prepend(resultBanner); // Add the banner at the top
        }
    }
});