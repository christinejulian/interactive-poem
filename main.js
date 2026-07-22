// main.js

/* ==========================================================================
   GAME STATE
   ========================================================================== */
let currentLevel = 1;
const maxLevel = 15;
let score = 0;
let health = 100;

let unlockedLevels = 1;

/* Score required per level */
const levelTargets = {};
for (let i = 1; i <= maxLevel; i++) {
  levelTargets[i] = i * 10; // Level 1 = 10 points, Level 15 = 150 points
}

/* ==========================================================================
   DOM ELEMENTS
   ========================================================================== */
const bootIntro = document.getElementById("bootIntro");

const menuScreen = document.getElementById("menuScreen");
const levelSelect = document.getElementById("levelSelect");
const poemGrid = document.getElementById("poemGrid");

const scoreboard = document.getElementById("scoreboard");
const levelIndicator = document.getElementById("levelIndicator");
const scoreIndicator = document.getElementById("scoreIndicator");

const levelComplete = document.getElementById("levelComplete");
const gameOver = document.getElementById("gameOver");
const gameComplete = document.getElementById("gameComplete");

const settingsOverlay = document.getElementById("settingsOverlay");
const creditsOverlay = document.getElementById("creditsOverlay");

const bgm = document.getElementById("bgm");
const hitSfx = document.getElementById("hitSfx");
const damageSfx = document.getElementById("damageSfx");

/* ==========================================================================
   BOOT INTRO → MENU
   ========================================================================== */
setTimeout(() => {
  bootIntro.style.display = "none";
  menuScreen.style.display = "flex";
}, 3500);

/* ==========================================================================
   MENU BUTTONS
   ========================================================================== */
document.getElementById("startGameBtn").onclick = () => {
  bgm.play();
  openLevelSelect();
};

document.getElementById("howToPlayBtn").onclick = () => {
  alert("Click poem words to gain score.\nAvoid losing health.\nReach the target score to complete each level.\nLevels unlock sequentially.\nPress ESC for settings.");
};

document.getElementById("creditsBtn").onclick = () => {
  creditsOverlay.style.display = "flex";
};

document.getElementById("returnMenuBtn").onclick = () => {
  returnToMenu();
};

/* ==========================================================================
   SETTINGS BUTTONS
   ========================================================================== */
document.getElementById("resumeBtn").onclick = () => {
  settingsOverlay.style.display = "none";
};

document.getElementById("escMenuBtn").onclick = () => {
  returnToMenu();
};

/* ==========================================================================
   CREDITS BUTTON
   ========================================================================== */
document.getElementById("creditsMenuBtn").onclick = () => {
  creditsOverlay.style.display = "none";
  returnToMenu();
};

/* ==========================================================================
   LEVEL SELECT
   ========================================================================== */
function openLevelSelect() {
  menuScreen.style.display = "none";
  levelSelect.style.display = "flex";
  renderLevelButtons();
}

function renderLevelButtons() {
  const grid = document.getElementById("levelGrid");
  grid.innerHTML = "";

  for (let i = 1; i <= maxLevel; i++) {
    const btn = document.createElement("button");
    btn.textContent = `LEVEL ${i}`;
    btn.classList.add("level-btn");

    if (i > unlockedLevels) {
      btn.classList.add("level-locked");
    } else {
      btn.onclick = () => startLevel(i);
    }

    grid.appendChild(btn);
  }
}

/* ==========================================================================
   START LEVEL
   ========================================================================== */
function startLevel(level) {
  currentLevel = level;
  score = 0;
  health = 100;

  levelSelect.style.display = "none";
  levelComplete.style.display = "none";
  gameOver.style.display = "none";
  gameComplete.style.display = "none";

  scoreboard.style.display = "block";
  poemGrid.style.display = "grid";

  updateHUD();
  loadPoemWords();
}

/* ==========================================================================
   LOAD POEM WORDS
   ========================================================================== */
function loadPoemWords() {
  poemGrid.innerHTML = "";

  for (let i = 0; i < 12; i++) {
    const word = document.createElement("div");
    word.classList.add("poemWord");
    word.textContent = `WORD ${i + 1}`;

    word.addEventListener("click", () => {
      score++;
      updateHUD();
      hitSfx.play();

      word.style.opacity = "0";
      word.style.transform = "scale(0.5)";
      word.style.pointerEvents = "none";

      if (score >= levelTargets[currentLevel]) {
        completeLevel();
      }
    });

    poemGrid.appendChild(word);
  }

  /* Random health loss events */
  setInterval(() => {
    if (poemGrid.style.display !== "grid") return;

    if (Math.random() < 0.15) {
      health -= 10;
      damageSfx.play();
      updateHUD();

      if (health <= 0) {
        triggerGameOver();
      }
    }
  }, 1500);
}

/* ==========================================================================
   UPDATE HUD
   ========================================================================== */
function updateHUD() {
  levelIndicator.textContent = `LEVEL ${currentLevel} / ${maxLevel}`;
  scoreIndicator.textContent = `SCORE: ${score}`;
}

/* ==========================================================================
   LEVEL COMPLETE
   ========================================================================== */
document.getElementById("nextLevelBtn").onclick = () => {
  startLevel(currentLevel + 1);
};

function completeLevel() {
  poemGrid.style.display = "none";
  scoreboard.style.display = "none";

  unlockedLevels = Math.max(unlockedLevels, currentLevel + 1);

  levelComplete.style.display = "flex";
  document.getElementById("levelCompleteTitle").textContent =
    `LEVEL ${currentLevel} COMPLETE!`;
}

/* ==========================================================================
   GAME OVER
   ========================================================================== */
document.getElementById("retryLevelBtn").onclick = () => {
  startLevel(currentLevel);
};

function triggerGameOver() {
  poemGrid.style.display = "none";
  scoreboard.style.display = "none";

  gameOver.style.display = "flex";
}

/* ==========================================================================
   GAME COMPLETE
   ========================================================================== */
document.getElementById("playAgainBtn").onclick = () => {
  unlockedLevels = 1;
  startLevel(1);
};

/* ==========================================================================
   RETURN TO MENU
   ========================================================================== */
function returnToMenu() {
  poemGrid.style.display = "none";
  scoreboard.style.display = "none";
  levelSelect.style.display = "none";
  levelComplete.style.display = "none";
  gameOver.style.display = "none";
  gameComplete.style.display = "none";
  creditsOverlay.style.display = "none";
  settingsOverlay.style.display = "none";

  menuScreen.style.display = "flex";

  bgm.pause();
  bgm.currentTime = 0;
}

/* ==========================================================================
   ESC KEY → SETTINGS
   ========================================================================== */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    settingsOverlay.style.display = "flex";
  }
});

