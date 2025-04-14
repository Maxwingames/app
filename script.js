const scriptUrl = "https://script.google.com/macros/s/AKfycbz3raaRwLeb09AFaNimpxIuIwAa8KZTwGjYn24XUrmc3_NeMwtdBD1dwyD5mOKvuhd6/exec";
const loader = document.getElementById("loader");
const dashboard = document.getElementById("dashboard");
const matchesPage = document.getElementById("matchesPage");
const matchesContainer = document.getElementById("matchesContainer");
const battleButton = document.getElementById("battleButton");
const playButton = document.getElementById("playButton");
const quizButton = document.getElementById("quizButton");
const backButton = document.getElementById("backButton");
const userInfo = document.getElementById("userInfo");
const bonusDisplay = document.getElementById("bonusDisplay");

// Create custom alert styles
const alertStyles = document.createElement('style');
alertStyles.textContent = `
    .custom-alert-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    .custom-alert-box {
        background-color: #0e1621;
        border-radius: 10px;
        width: 300px;
        max-width: 90%;
        padding: 20px;
        text-align: center;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
    .custom-alert-title {
        color: white;
        font-size: 24px;
        margin-bottom: 10px;
        font-weight: bold;
    }
    .custom-alert-message {
        color: #aaa;
        font-size: 16px;
        margin-bottom: 25px;
    }
    .custom-alert-buttons {
        display: flex;
        justify-content: space-between;
    }
    .custom-alert-button {
        padding: 12px 0;
        border-radius: 50px;
        border: none;
        width: 48%;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
    }
    .custom-alert-button.primary {
        background-color: #009b22;
        color: white;
    }
    .custom-alert-button.secondary {
        background-color: transparent;
        border: 1px solid #444;
        color: white;
    }
    .custom-alert-icon {
        width: 60px;
        height: 60px;
        margin: 0 auto 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #1e2a38;
        border-radius: 50%;
    }
    .custom-alert-icon svg {
        width: 30px;
        height: 30px;
        fill: none;
        stroke: white;
        stroke-width: 2;
    }
`;
document.head.appendChild(alertStyles);

// Custom alert functions
function showCustomAlert(message, callback) {
    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';
    
    overlay.innerHTML = `
        <div class="custom-alert-box">
            <div class="custom-alert-icon">
                <svg viewBox="0 0 24 24">
                    <path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10zm0-18c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 13h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
                </svg>
            </div>
            <div class="custom-alert-title">Alert</div>
            <div class="custom-alert-message">${message}</div>
            <div class="custom-alert-buttons">
                <button class="custom-alert-button secondary" id="alert-ok">OK</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    document.getElementById('alert-ok').addEventListener('click', () => {
        document.body.removeChild(overlay);
        if (typeof callback === 'function') callback(true);
    });
}

function showCustomConfirm(title, message, callback) {
    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';
    
    overlay.innerHTML = `
        <div class="custom-alert-box">
            <div class="custom-alert-icon">
                <svg viewBox="0 0 24 24">
                    <path d="M14 12v7.88c.04.3-.06.62-.29.83a.996.996 0 01-1.41 0l-2.01-2.01a.989.989 0 01-.29-.83V12h-.03L4.21 4.62a1 1 0 01.17-1.4c.19-.14.4-.22.62-.22h14c.22 0 .43.08.62.22a1 1 0 01.17 1.4L14.03 12H14z"></path>
                </svg>
            </div>
            <div class="custom-alert-title">${title}</div>
            <div class="custom-alert-message">${message}</div>
            <div class="custom-alert-buttons">
                <button class="custom-alert-button secondary" id="confirm-cancel">Back</button>
                <button class="custom-alert-button primary" id="confirm-ok">Play</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    document.getElementById('confirm-ok').addEventListener('click', () => {
        document.body.removeChild(overlay);
        if (typeof callback === 'function') callback(true);
    });
    
    document.getElementById('confirm-cancel').addEventListener('click', () => {
        document.body.removeChild(overlay);
        if (typeof callback === 'function') callback(false);
    });
}

function showLoader() {
    loader.style.display = "flex";
}

function hideLoader() {
    loader.style.display = "none";
}

const userEmail = localStorage.getItem("quiz_local");

if (!userEmail) {
    window.location.href = "signup.html";
}

document.getElementById("userEmail").textContent = userEmail;

showLoader();

fetch(scriptUrl, {
    method: "POST",
    body: JSON.stringify({ action: "getUserData", email: userEmail })
})
.then(response => response.json())
.then(data => {
    hideLoader();
    if (data.status === "success") {
        document.getElementById("userCoins").textContent = "₹" + data.coins;
        bonusDisplay.innerHTML = '<img src="https://cdn-icons-png.flaticon.com/512/668/668090.png"> <span>' + "₹" +  data.bonus + '</span>';
    } else {
        localStorage.removeItem("quiz_local");
        window.location.href = "signup.html";
    }
});

function loadMatches(buttonCallback) {
    dashboard.style.display = "none";
    userInfo.style.display = "none";
    loader.style.display = "none";
    matchesPage.style.display = "block";
    showLoader();

    fetch(scriptUrl, {
        method: "POST",
        body: JSON.stringify({ action: "getMatches" })
    })
    .then(response => response.json())
    .then(matches => {
        hideLoader();
        let matchesHtml = "";
        matches.forEach(match => {
            matchesHtml += `
                <div class="match-card">
                    <p class="win">Win: <span> ₹${match.winningAmount}</span></p>
                    <p class="entry">Entry <span> ₹${match.entryFee}</span></p>
                    <button onclick="${buttonCallback}(${match.entryFee})" class="play"><i class="fa-solid fa-play"></i></button>
                </div>
                <hr class="disco-hr">
            `;
        });
        matchesContainer.innerHTML = matchesHtml;
    });
}

battleButton.addEventListener("click", () => {
    loadMatches("joinMatch");
});

playButton.addEventListener("click", () => {
    loadMatches("joinMatch");
});

quizButton.addEventListener("click", () => {
    loadMatches("quizMatch");
});

backButton.addEventListener("click", () => {
    matchesPage.style.display = "none";
    dashboard.style.display = "none";
    userInfo.style.display = "flex";
    loader.style.display = "flex";
});

function joinMatch(entryFee) {
    showCustomConfirm("Lets Play", `Are you sure you want to join this match for ₹${entryFee} coins?`, (result) => {
        if (result) {
            showLoader();
            fetch(scriptUrl, {
                method: "POST",
                body: JSON.stringify({ action: "deductCoins", email: userEmail, entryFee: entryFee })
            })
            .then(response => response.json())
            .then(data => {
                hideLoader();
                if (data.status === "success") {
                    localStorage.setItem("match_entry_fee", entryFee);
                    showCustomAlert("Successfully joined the match!", () => {
                        window.location.href = "play.html";
                    });
                } else {
                    showCustomAlert("Not enough coins!");
                }
            });
        }
    });
}

function quizMatch(entryFee) {
    showCustomConfirm("Lets Play", `Are you sure you want to join this match for ₹${entryFee} coins?`, (result) => {
        if (result) {
            showLoader();
            fetch(scriptUrl, {
                method: "POST",
                body: JSON.stringify({ action: "deductCoins", email: userEmail, entryFee: entryFee })
            })
            .then(response => response.json())
            .then(data => {
                hideLoader();
                if (data.status === "success") {
                    localStorage.setItem("match_entry_fee", entryFee);
                    showCustomAlert("Successfully joined the match!", () => {
                        window.location.href = "quiz.html";
                    });
                } else {
                    showCustomAlert("Not enough coins!");
                }
            });
        }
    });
}
