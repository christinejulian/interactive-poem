// main.js

// ===============================
// GAME CONSTANTS
// ===============================
const MAX_LEVELS = 15;
const DAMAGE_AMOUNT = 10;   // wrong word damage
const SCORE_GOAL = 10;      // words needed to complete level

let currentLevel = 1;
let score = 0;
let health = 100;

// Save progress
let highestUnlocked = Number(localStorage.getItem("highestUnlocked")) || 1;

// ===============================
// SCREEN ELEMENTS
// ===============================
const menuScreen = document.getElementById("menuScreen");
const levelSelect = document.getElementById("levelSelect");
const poemGrid = document.getElementById("poemGrid");
const levelComplete = document.getElementById("levelComplete");
const gameOver = document.getElementById("gameOver");
const gameComplete = document.getElementById("gameComplete");
const creditsOverlay = document.getElementById("creditsOverlay");
const settingsScreen = document.getElementById("settingsScreen");

// ===============================
// HUD ELEMENTS
// ===============================
const levelIndicator = document.getElementById("levelIndicator");
const scoreIndicator = document.getElementById("scoreIndicator");
const healthIndicator = document.getElementById("healthIndicator");

// ===============================
// BUTTONS
// ===============================
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

// ===============================
// SETTINGS ELEMENTS
// ===============================
const volumeSlider = document.getElementById("volumeSlider");
const bgMusic = document.getElementById("bgMusic");

// Load saved volume
volumeSlider.value = localStorage.getItem("volume") || 0.4;
bgMusic.volume = volumeSlider.value;

// Update volume
volumeSlider.oninput = () => {
    bgMusic.volume = volumeSlider.value;
    localStorage.setItem("volume", volumeSlider.value);
};

// ===============================
// WORD BANK
// ===============================
const words = [
    "arcade","pixel","dream","neon","controller",
    "coin","hero","quest","poem","boss",
    "level","victory","echo","light","future",
    "hope","memory","code","game","play"
];

// ===============================
// MENU BUTTONS
// ===============================
startGameBtn.onclick = () => {
    hideAll();
    levelSelect.classList.add("active");
    buildLevelButtons();
};

howToPlayBtn.onclick = () => {
    alert(
        "Correct words = +1 score\n" +
        "Wrong words = -10 health\n" +
        "Health reaches 0 = GAME OVER\n\n" +
        "Clear all 15 levels to reveal the final poem."
    );
};

creditsBtn.onclick = showCredits;
settingsBtn.onclick = showSettings;

returnMenuBtn.onclick = showMenu;
mainMenuBtn1.onclick = showMenu;
mainMenuBtn2.onclick = showMenu;
mainMenuBtn3.onclick = showMenu;

creditsMenuBtn.onclick = showMenu;
settingsBackBtn.onclick = showMenu;

// ===============================
// BUILD LEVEL SELECT GRID
// ===============================
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

// ===============================
// START LEVEL
// ===============================
function startLevel(level) {
    currentLevel = level;
    score = 0;
    health = 100;

    hideAll();

    poemGrid.style.display = "grid";

    updateHUD();
    createWords();
}

// ===============================
// HUD UPDATE
// ===============================
function updateHUD() {
    levelIndicator.textContent = `LEVEL ${currentLevel} / ${MAX_LEVELS}`;
    scoreIndicator.textContent = `SCORE: ${score}`;
    healthIndicator.textContent = `HEALTH: ${health}`;
}

// ===============================
// CREATE WORD GRID
// ===============================
function createWords() {
    poemGrid.innerHTML = "";

    const levelWords = [...words]
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);

    levelWords.forEach(word => {
        const div = document.createElement("div");
        div.className = "poemWord";
        div.textContent = word;

        div.onclick = () => {
            const isCorrect = Math.random() > 0.3; // 70% chance correct

            if (isCorrect) {
                score++;
                div.style.opacity = 0.25;
                div.style.pointerEvents = "none";
            } else {
                health -= DAMAGE_AMOUNT;
                div.style.background = "#300";
                div.style.borderColor = "#f00";
            }

            updateHUD();
            checkLevel();
        };

        poemGrid.appendChild(div);
    });
}

// ===============================
// CHECK LEVEL COMPLETION
// ===============================
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

// ===============================
// NEXT LEVEL
// ===============================
nextLevelBtn.onclick = () => {
    startLevel(currentLevel + 1);
};

// ===============================
// RETRY LEVEL
// ===============================
retryLevelBtn.onclick = () => {
    startLevel(currentLevel);
};

// ===============================
// SHOW CREDITS
// ===============================
function showCredits() {
    creditsOverlay.style.display = "flex";
}

// ===============================
// SHOW SETTINGS
// ===============================
function showSettings() {
    hideAll();
    settingsScreen.classList.add("active");
}

// ===============================
// SHOW MENU
// ===============================
function showMenu() {
    hideAll();
    creditsOverlay.style.display = "none";
    settingsScreen.classList.remove("active");
    menuScreen.classList.add("active");
}

// ===============================
// HIDE ALL SCREENS
// ===============================
function hideAll() {
    menuScreen.classList.remove("active");
    levelSelect.classList.remove("active");
    poemGrid.style.display = "none";
    levelComplete.classList.remove("active");
    gameOver.classList.remove("active");
    gameComplete.classList.remove("active");
    settingsScreen.classList.remove("active");
}

// ===============================
// ESC KEY RETURNS TO MENU
// ===============================
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        showMenu();
    }
});

// ===============================
// START GAME IN MENU
// ===============================
showMenu();
