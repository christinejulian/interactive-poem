// main.js
// ============================================================
// GAME CONSTANTS
// ============================================================
const MAX_STAGES = 15;
const DAMAGE_AMOUNT = 50; // 50% health loss
const SCORE_GOAL = 5;     // fewer correct words needed per stage

let currentStage = 1;
let score = 0;
let health = 100;

let highestUnlocked = Number(localStorage.getItem("highestUnlocked")) || 1;

// ============================================================
// ELEMENTS
// ============================================================
const attractScreen = document.getElementById("attractScreen");
const menuScreen = document.getElementById("menuScreen");
const levelSelect = document.getElementById("levelSelect");
const poemGrid = document.getElementById("poemGrid");
const levelComplete = document.getElementById("levelComplete");
const gameOver = document.getElementById("gameOver");
const gameComplete = document.getElementById("gameComplete");
const settingsScreen = document.getElementById("settingsScreen");
const creditsOverlay = document.getElementById("creditsOverlay");

const scoreboard = document.getElementById("scoreboard");
const levelIndicator = document.getElementById("levelIndicator");
const scoreIndicator = document.getElementById("scoreIndicator");
const healthIndicator = document.getElementById("healthIndicator");

const levelGrid = document.getElementById("levelGrid");

// ============================================================
// BUTTONS
// ============================================================
const startGameBtn = document.getElementById("startGameBtn");
const howToPlayBtn = document.getElementById("howToPlayBtn");
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

// ============================================================
// SETTINGS + MUSIC
// ============================================================
const volumeSlider = document.getElementById("volumeSlider");
const bgMusic = document.getElementById("bgMusic");

volumeSlider.value = localStorage.getItem("volume") || 0.4;
bgMusic.volume = volumeSlider.value;

volumeSlider.oninput = () => {
    bgMusic.volume = volumeSlider.value;
    localStorage.setItem("volume", volumeSlider.value);
};

// ============================================================
// WORD BANKS
// ============================================================
// Correct words: video‑game related
const gameWords = [
    "controller","console","pixel","arcade","quest",
    "level","boss","score","health","inventory",
    "joystick","respawn","checkpoint","combo","powerup"
];

// Wrong words: unrelated to video games
const nonGameWords = [
    "sunflower","teacup","pillow","laundry","garden",
    "cloud","notebook","candle","blanket","window",
    "spoon","river","mountain","pasta","library"
];

// ============================================================
// ATTRACT MODE → EXIT ON KEY OR CLICK
// ============================================================
document.addEventListener("keydown", exitAttract, { once: true });
document.addEventListener("click", exitAttract, { once: true });

function exitAttract() {
    attractScreen.classList.remove("active");
    menuScreen.classList.add("active");
}

// ============================================================
// MENU BUTTONS
// ============================================================
startGameBtn.onclick = () => {
    hideAll();
    levelSelect.classList.add("active");
    buildStageButtons();
};

howToPlayBtn.onclick = () => {
    alert(
        "Click ONLY video‑game related words.\n\n" +
        "Correct (game) word: +1 score.\n" +
        "Wrong (non‑game) word: -50% health.\n\n" +
        "If health reaches 0, the session ends.\n" +
        "Reach the score goal to clear the stage."
    );
};

settingsBtn.onclick = () => {
    hideAll();
    settingsScreen.classList.add("active");
};

returnMenuBtn.onclick = showMenu;
mainMenuBtn1.onclick = showMenu;
mainMenuBtn2.onclick = showMenu;
mainMenuBtn3.onclick = showMenu;
creditsMenuBtn.onclick = showMenu;
settingsBackBtn.onclick = showMenu;

// ============================================================
// BUILD STAGE SELECT GRID
// ============================================================
function buildStageButtons() {
    levelGrid.innerHTML = "";

    for (let i = 1; i <= MAX_STAGES; i++) {
        const b = document.createElement("button");
        b.textContent = "STAGE " + i;

        if (i <= highestUnlocked) {
            b.onclick = () => startStage(i);
        } else {
            b.disabled = true;
            b.textContent = "LOCKED";
        }

        levelGrid.appendChild(b);
    }
}

// ============================================================
// START STAGE
// ============================================================
function startStage(stage) {
    currentStage = stage;
    score = 0;
    health = 100;

    hideAll();

    scoreboard.style.display = "block";
    poemGrid.style.display = "grid";

    updateHUD();
    createWords();
}

// ============================================================
// UPDATE HUD
// ============================================================
function updateHUD() {
    levelIndicator.textContent = `STAGE ${currentStage} / ${MAX_STAGES}`;
    scoreIndicator.textContent = `SCORE: ${score}`;
    healthIndicator.textContent = `HEALTH: ${health}%`;
}

// ============================================================
// CREATE WORD GRID
// ============================================================
function createWords() {
    poemGrid.innerHTML = "";

    // mix game words and non‑game words
    const mixed = [
        ...gameWords.sort(() => Math.random() - 0.5).slice(0, 5),
        ...nonGameWords.sort(() => Math.random() - 0.5).slice(0, 5)
    ].sort(() => Math.random() - 0.5);

    mixed.forEach(word => {
        const div = document.createElement("div");
        div.className = "poemWord";
        div.textContent = word;

        div.onclick = () => {
            const isGameWord = gameWords.includes(word);

            if (isGameWord) {
                score++;
                div.style.opacity = 0.25;
                div.style.pointerEvents = "none";
            } else {
                div.classList.add("wrong");
                health -= DAMAGE_AMOUNT;
            }

            updateHUD();
            checkStage();
        };

        poemGrid.appendChild(div);
    });
}

// ============================================================
// CHECK STAGE STATUS
// ============================================================
function checkStage() {

    if (health <= 0) {
        hideAll();
        gameOver.classList.add("active");
        return;
    }

    if (score >= SCORE_GOAL) {

        if (currentStage > highestUnlocked) {
            highestUnlocked = currentStage;
            localStorage.setItem("highestUnlocked", highestUnlocked);
        }

        if (currentStage === MAX_STAGES) {
            creditsOverlay.style.display = "flex";

            setTimeout(() => {
                creditsOverlay.style.display = "none";
                hideAll();
                gameComplete.classList.add("active");
            }, 15000);

        } else {
            hideAll();
            document.getElementById("levelCompleteTitle").textContent =
                `STAGE ${currentStage} COMPLETE`;
            levelComplete.classList.add("active");
        }
    }
}

// ============================================================
// BUTTON ACTIONS
// ============================================================
nextLevelBtn.onclick = () => startStage(currentStage + 1);
retryLevelBtn.onclick = () => startStage(currentStage);
playAgainBtn.onclick = () => startStage(1);

// ============================================================
// SHOW MENU
// ============================================================
function showMenu() {
    hideAll();
    scoreboard.style.display = "none";
    creditsOverlay.style.display = "none";
    menuScreen.classList.add("active");
}

// ============================================================
// HIDE ALL SCREENS
// ============================================================
function hideAll() {
    attractScreen.classList.remove("active");
    menuScreen.classList.remove("active");
    levelSelect.classList.remove("active");
    poemGrid.style.display = "none";
    levelComplete.classList.remove("active");
    gameOver.classList.remove("active");
    gameComplete.classList.remove("active");
    settingsScreen.classList.remove("active");
    scoreboard.style.display = "none";
}

// ============================================================
// ESC KEY RETURNS TO MENU
// ============================================================
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") showMenu();
});

// ============================================================
// START IN ATTRACT MODE
// ============================================================
hideAll();
attractScreen.classList.add("active");
