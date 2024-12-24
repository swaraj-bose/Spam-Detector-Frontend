// Selecting DOM elements
const userInput = document.getElementById("userInput");
const checkBtn = document.getElementById("checkBtn");
const clearBtn = document.getElementById("clearBtn");
const popup = document.getElementById("popup");
const resultText = document.getElementById("resultText");
const closePopup = document.getElementById("closePopup");
const copyText = document.getElementById("copyText");

// Backend API URL
const apiUrl = "https://spam-detector-0t02.onrender.com/api/predict";

// Show popup with result
function showPopup(result) {
  resultText.textContent = result ? "Spam" : "Not Spam";
  popup.classList.remove("hidden");
  popup.setAttribute("aria-hidden", "false");
}

// Hide popup
function hidePopup() {
  popup.classList.add("hidden");
  popup.setAttribute("aria-hidden", "true");
}

// Copy result to clipboard
function copyToClipboard() {
  const text = resultText.textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert("Result copied to clipboard!");
  });
}

// Event listener for "Check" button
checkBtn.addEventListener("click", async () => {
  const message = userInput.value.trim();

  if (!message) {
    alert("Please enter some text to check!");
    return;
  }

  try {
    // Sending request to backend
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (response.ok) {
      const data = await response.json();
      showPopup(data.prediction);
    } else {
      alert("Error: Unable to process the request!");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while connecting to the server.");
  }
});

// Event listener for "Clear" button
clearBtn.addEventListener("click", () => {
  userInput.value = "";
});

// Event listener for "Close" button in popup
closePopup.addEventListener("click", hidePopup);

// Event listener for "Copy" button in popup
copyText.addEventListener("click", copyToClipboard);

