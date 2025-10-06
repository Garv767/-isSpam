// background.js

const API_ENDPOINT = 'http://localhost:5000/predict'; // **UPDATE THIS for production**

// 1. Listen for the extension button click
chrome.action.onClicked.addListener((tab) => {
    // Inject the content script into the active tab to start the process
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    });
});

// 2. Listen for a message coming back from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Background script received message:", request);
    if (request.action === "classifyEmail") {
        console.log("Received email text for classification:", request.emailText);
        if (!request.emailText) {
            console.error("Content Script failed to find email text.");
            return;
        }

        // Call the external Python API
        fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mail: request.emailText }) // Match API's expected key
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
        
        // Return true to indicate we will send an asynchronous response
        return true; 
    }
});