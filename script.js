const scriptUrl = "https://script.google.com/macros/s/AKfycbwxxnxzJpks8pVut-V7Bo0trevVQlj321ToCnuc_4ZOyQcF_8cv8Z9xNEkjDZf3uMVh/exec";
const loader = document.getElementById("loader");
const dashboard = document.getElementById("dashboard");
const matchesPage = document.getElementById("matchesPage");
const matchesContainer = document.getElementById("matchesContainer");
const battleButton = document.getElementById("battleButton");
const playButton = document.getElementById("playButton");
const quizButton = document.getElementById("quizButton");
const backButton = document.getElementById("backButton");
const userInfo = document.getElementById("userInfo");

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
    } else {
        localStorage.removeItem("quiz_local");
        window.location.href = "signup.html";
    }
});

battleButton.addEventListener("click", () => {
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
                    <button onclick="joinMatch(${match.entryFee})" class="play"><i class="fa-solid fa-play"></i></button>
                </div>
                <hr class="disco-hr">
            `;
        });
        matchesContainer.innerHTML = matchesHtml;
    });
});

playButton.addEventListener("click", () => {
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
                    <button onclick="joinMatch(${match.entryFee})" class="play"><i class="fa-solid fa-play"></i></button>
                </div>
                <hr class="disco-hr">
            `;
        });
        matchesContainer.innerHTML = matchesHtml;
    });
});

quizButton.addEventListener("click", () => {
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
                    <button onclick="quizMatch(${match.entryFee})" class="play"><i class="fa-solid fa-play"></i></button>
                </div>
                <hr class="disco-hr">
            `;
        });
        matchesContainer.innerHTML = matchesHtml;
    });
});

backButton.addEventListener("click", () => {
    matchesPage.style.display = "none";
    dashboard.style.display = "none";
    userInfo.style.display = "flex";
    loader.style.display = "flex";
});

function joinMatch(entryFee) {
    if (confirm(`Are you sure you want to join this match for ${entryFee} coins?`)) {
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
                alert("Successfully joined the match!");
                window.location.href = "play.html";
            } else {
                alert("Not enough coins!");
            }
        });
    }
}

function quizMatch(entryFee) {
    if (confirm(`Are you sure you want to join this match for ${entryFee} coins?`)) {
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
                alert("Successfully joined the match!");
                window.location.href = "quiz.html";
            } else {
                alert("Not enough coins!");
            }
        });
    }
}