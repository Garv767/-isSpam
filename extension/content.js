// contentScript.js
(function() {
    function getEmailBodySelector(url) {
        if (url.includes("mail.google.com")) {
            // Gmail selector for the main message body.
            //console.log("Gmail detected");
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
            if (bodyElement) {
                return bodyElement.innerText; 
            }
        }
        return null;
    }

    // Extract the text and send it to the Service Worker
    //console.log("Content script injected");
    const extractedText = extractEmailText();
    console.log("Extracted Email Text:", extractedText);

    if (extractedText) {
        chrome.runtime.sendMessage({ 
            action: "classifyEmail", 
            emailText: extractedText 
        });
        //console.log("Request sent");
    } else {
        alert("Could not find the email body. Make sure an email is open.");
    }


    // Listen for the result coming back from the Service Worker/API
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "displayResult") {
            const prediction = request.prediction;
            const resultText = (prediction === 1) 
                ? "⚠️ ACTION REQUIRED: Classified as SPAM. Proceed with caution." 
                : "✨ Looks Good: Message classified as SAFE.";
            
            let resultBanner = document.getElementById('ispam-result-banner');
            const displayArea = document.querySelector('div[role="main"]'); 

            if (!displayArea) {
                console.warn("Could not find the main display area to insert the banner.");
                return;
            }

            if (!resultBanner) {
                resultBanner = document.createElement('div');
                resultBanner.style.cssText = 'background: #fcc; color: black; padding: 10px; font-weight: bold; text-align: center;';
                resultBanner.id = 'ispam-result-banner';
                displayArea.prepend(resultBanner); 
            }
            
            resultBanner.textContent = resultText;
        }
    });
})();