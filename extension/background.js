// background.js

const API_ENDPOINT = 'https://isspam-ys1h.onrender.com/predict';

// Listen for the extension button click
chrome.action.onClicked.addListener((tab) => {
    // Injecting the content script
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    });
});

// Listen for a message coming from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    //console.log("Background script received message:", request);
    if (request.action === "classifyEmail") {
        //console.log("Received email text for classification:", request.emailText);
        if (!request.emailText) {
            console.error("Content Script failed to find email text.");
            return;
        }

        // Call the external API
        fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mail: request.emailText })
        })
        .then(response => response.json())
        .then(data => {
            // Send the API result back to the Content Script to display it on the page
            chrome.tabs.sendMessage(sender.tab.id, {
                action: "displayResult",
                prediction: data.prediction // The API should return { "prediction": ["0/1"] }
            });
            sendResponse({ status: "API call success" });
        })
        .catch(error => {
            console.error('API Call Failed:', error);
            sendResponse({ status: "API call failed" });
        });
        
        return true; 
    }
});