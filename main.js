// main.js

// ===============================
// GAME CONSTANTS
// ===============================

const MAX_LEVELS = 15;
const DAMAGE_AMOUNT = 10;
const SCORE_GOAL = 10;

let currentLevel = 1;
let score = 0;
let health = 100;

let highestUnlocked = Number(localStorage.getItem("highestUnlocked")) || 1;

const menuScreen = document.getElementById("menuScreen");
const levelSelect = document.getElementById("levelSelect");
const poemGrid = document.getElementById("poemGrid");
const levelComplete = document.getElementById("levelComplete");
const gameOver = document.getElementById("gameOver");
const gameComplete = document.getElementById("gameComplete");
const creditsOverlay = document.getElementById("creditsOverlay");
const settingsScreen = document.getElementById("settingsScreen");

const levelIndicator = document.getElementById("levelIndicator");
const scoreIndicator = document.getElementById("scoreIndicator");
const healthIndicator = document.getElementById("healthIndicator");

const startGameBtn = document.getElementById("startGameBtn");
const howToPlayBtn = document.getElementById("howToPlayBtn");
const creditsBtn = document.getElementById("creditsBtn");
const settingsBtn = document.getElementById("settingsBtn");

const returnMenuBtn = document.getElementById("returnMenuBtn");
const nextLevelBtn = document.getElementById("nextLevelBtn");
const retryLevelBtn = document.getElementById("retryLevelBtn");

const playAgainBtn = document.getElementById("playAgainBtn");

const mainMenuBtn1 = document.getElementById("mainMenuBtn1");
const mainMenuBtn2 = document.getElementById("mainMenuBtn2");
const mainMenuBtn3 = document.getElementById("mainMenuBtn3");

const creditsMenuBtn = document.getElementById("creditsMenuBtn");
const settingsBackBtn = document.getElementById("settingsBackBtn");

const levelGrid = document.getElementById("levelGrid");

const volumeSlider = document.getElementById("volumeSlider");
const bgMusic = document.getElementById("bgMusic");

volumeSlider.value = localStorage.getItem("volume") || 0.4;
bgMusic.volume = volumeSlider.value;

volumeSlider.oninput = () => {
    bgMusic.volume = volumeSlider.value;
    localStorage.setItem("volume", volumeSlider.value);
};

const words = [
    "arcade","pixel","dream","neon","controller",
    "coin","hero","quest","poem","boss",
    "level","victory","echo","light","future",
    "hope","memory","code","game","play"
];

startGameBtn.onclick = () => {
    hideAll();
    levelSelect.classList.add("active");
    buildLevelButtons();
};

howToPlayBtn.onclick = () => {
    alert("Correct words = +1 score\nWrong words = -10 health\nHealth = 0 → GAME OVER");
};

creditsBtn.onclick = showCredits;
settingsBtn.onclick = showSettings;

returnMenuBtn.onclick = showMenu;
mainMenuBtn1.onclick = showMenu;
mainMenuBtn2.onclick = showMenu;
mainMenuBtn3.onclick = showMenu;

creditsMenuBtn.onclick = showMenu;
settingsBackBtn.onclick = showMenu;

function buildLevelButtons() {
    levelGrid.innerHTML = "";
    for (let i = 1; i <= MAX_LEVELS; i++) {
        const b = document.createElement("button");
        b.textContent = "LEVEL " + i;
        if (i <= highestUnlocked) {
            b.onclick = () => startLevel(i);
        } else {
            b.disabled = true;
            b.textContent = "LOCKED";
        }
        levelGrid.appendChild(b);
    }
}

function startLevel(level) {
    currentLevel = level;
    score = 0;
    health = 100;

    hideAll();

    scoreboard.style.display = "block"; // FIXED
    poemGrid.style.display = "grid";

    updateHUD();
    createWords();
}

function updateHUD() {
    levelIndicator.textContent = `LEVEL ${currentLevel} / ${MAX_LEVELS}`;
    scoreIndicator.textContent = `SCORE: ${score}`;
    healthIndicator.textContent = `HEALTH: ${health}`;
}

function createWords() {
    poemGrid.innerHTML = "";

    const levelWords = [...words].sort(() => Math.random() - 0.5).slice(0, 10);

    levelWords.forEach(word => {
        const div = document.createElement("div");
        div.className = "poemWord";
        div.textContent = word;

        div.onclick = () => {
            const isCorrect = Math.random() > 0.3;

            if (isCorrect) {
                score++;
                div.style.opacity = 0.25;
                div.style.pointerEvents = "none";
            } else {
                div.classList.add("wrong");
                health -= DAMAGE_AMOUNT;
            }

            updateHUD();
            checkLevel();
        };

        poemGrid.appendChild(div);
    });
}

function checkLevel() {
    if (health <= 0) {
        hideAll();
        gameOver.classList.add("active");
        return;
    }

    if (score >= SCORE_GOAL) {
        if (currentLevel > highestUnlocked) {
            highestUnlocked = currentLevel;
            localStorage.setItem("highestUnlocked", highestUnlocked);
        }

        if (currentLevel === MAX_LEVELS) {
            showCredits();
            setTimeout(() => {
                creditsOverlay.style.display = "none";
                hideAll();
                gameComplete.classList.add("active");
            }, 35000);
        } else {
            hideAll();
            document.getElementById("levelCompleteTitle").textContent =
                `LEVEL ${currentLevel} COMPLETE`;
            levelComplete.classList.add("active");
        }
    }
}

nextLevelBtn.onclick = () => startLevel(currentLevel + 1);
retryLevelBtn.onclick = () => startLevel(currentLevel);
playAgainBtn.onclick = () => startLevel(1);

function showCredits() {
    creditsOverlay.style.display = "flex";
}

function showSettings() {
    hideAll();
    settingsScreen.classList.add("active");
}

function showMenu() {
    hideAll();
    scoreboard.style.display = "none"; // FIXED
    creditsOverlay.style.display = "none";
    settingsScreen.classList.remove("active");
    menuScreen.classList.add("active");
}

function hideAll() {
    menuScreen.classList.remove("active");
    levelSelect.classList.remove("active");
    poemGrid.style.display = "none";
    levelComplete.classList.remove("active");
    gameOver.classList.remove("active");
    gameComplete.classList.remove("active");
    settingsScreen.classList.remove("active");
    scoreboard.style.display = "none"; // FIXED
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") showMenu();
});

showMenu();
