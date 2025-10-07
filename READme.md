# isSpam: ML-Powered Email Spam Classifier Extension

**isSpam** is a full-stack project designed to classify an open email as spam or safe (ham) by analyzing its content using a trained Machine Learning model hosted as a private API service. The system is wrapped in a lightweight Chrome extension for real-time, in-browser classification.

## ✨ Project Components

| Component | Technology | Role | Location |
| :--- | :--- | :--- | :--- |
| **ML Model** | Python, Scikit-learn (Logistic Regression) | Core logic: Predicts 0 (Ham) or 1 (Spam) based on text features. | `api/models/` |
| **API Backend** | Python, Flask, Gunicorn | Exposes the ML model as a secure, real-time HTTPS endpoint. | `api/` |
| **Browser Extension** | JavaScript (MV3) | UI wrapper: Extracts email text, calls the API, and displays the result as a banner. | `extension/` |

## 🚀 Deployment Status

| Service | Status | Endpoint / Location |
| :--- | :--- | :--- |
| **API Service** | **LIVE** | `https://isspam-ys1h.onrender.com/predict` |
| **Extension** | Ready for Web Store Submission | `extension/` folder |

## 🛠️ Setup and Installation

### 1. Browser Extension Installation

To use the extension, you must load it into your browser.

1.  **Package the Extension:** Create a ZIP file of the contents of the **`extension/`** directory. (The `manifest.json` file must be at the root of the ZIP).
2.  **Open Chrome Extensions:** Navigate to `chrome://extensions/`.
3.  **Enable Developer Mode:** Toggle the switch in the top right corner.
4.  **Load Unpacked:** Click the **"Load unpacked"** button and select the `extension/` folder.

### 2. Running the API Locally (Optional)

If you need to test or modify the Python backend locally, follow these steps:

1.  **Navigate to the `api/` directory.**
2.  **Install dependencies:** Ensure all packages are installed, including the production server Gunicorn.
    ```bash
    pip install -r requirements.txt
    ```
3.  **Run the API Server:** The server must be running before the extension can call it on localhost.
    ```bash
    gunicorn app:app --bind 0.0.0.0:5000
    ```
    *Note: Your live extension is configured to call the Render URL, so you must change the `API_ENDPOINT` in `extension/background.js` to `http://localhost:5000/predict` to test locally.*

## 💡 How to Use the Extension

1.  Open your preferred web-based email client (e.g., Gmail or Outlook).
2.  Open an individual email message so the full body content is visible.
3.  Click the **"Analyze Email"** extension icon in your Chrome toolbar.
4.  The extension extracts the text and injects a banner at the top of the email body showing the classification result:
    * **Spam:** `⚠️ ACTION REQUIRED: Classified as SPAM. Proceed with caution.`
    * **Ham:** `✨ Looks Good: Message classified as SAFE.`

## ⚙️ Project Architecture & Deployment

The project uses a clean separation of concerns for stability:

1.  **Extraction:** The `content.js` file is injected upon a toolbar click (`background.js`) to perform DOM queries and extract the raw email body text.
2.  **Communication:** The extracted text is passed to the `background.js` Service Worker.
3.  **Prediction:** `background.js` makes a secure JSON `POST` request to the **Render API** (`https://isspam-ys1h.onrender.com/predict`).
4.  **Deployment:** The Flask API is hosted by **Gunicorn** on **Render**, providing a stable, production-grade HTTPS endpoint.
5.  **Display:** The API's integer prediction (`0` or `1`) is sent back to `content.js`, which dynamically creates or updates the result banner on the live webpage.
