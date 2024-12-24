const backendUrl = 'https://spam-detector-0t02.onrender.com';

document.getElementById('checkBtn').addEventListener('click', async () => {
    const userInput = document.getElementById('userInput').value;

    if (userInput.trim() === "") {
        alert("Please enter some text.");
        return;
    }

    // Show loading feedback
    const checkBtn = document.getElementById('checkBtn');
    checkBtn.textContent = 'Checking...';
    checkBtn.disabled = true;

    try {
        const response = await fetch(`${backendUrl}/api/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userInput }),
        });

        const result = await response.json();

        if (result.error) {
            alert("Error: " + result.error);
        } else {
            const message = result.prediction ? 
                "This message is likely spam." : 
                "This message is not spam.";
            
            document.querySelector('.popup-content p').textContent = message;
            document.getElementById('popup').classList.remove('hidden');
        }
    } catch (error) {
        console.error("Error:", error);
        alert(`Failed to connect to the backend: ${error.message}`);
    } finally {
        // Restore button state
        checkBtn.textContent = 'Check';
        checkBtn.disabled = false;
    }
});

document.getElementById('clearBtn').addEventListener('click', () => {
    document.getElementById('userInput').value = "";
});

document.getElementById('closePopup').addEventListener('click', () => {
    document.getElementById('popup').classList.add('hidden');
});

document.getElementById('copyText').addEventListener('click', () => {
    const popupText = document.querySelector('.popup-content p').textContent;
    navigator.clipboard.writeText(popupText).then(() => {
        alert("Copied to clipboard!");
    });
});

