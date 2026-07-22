/* ==========================================================================
   GAME STATE
   ========================================================================== */
let currentLevel = 1;
const maxLevel = 15;
let score = 0;

/* Score required per level */
const levelTargets = {};
for (let i = 1; i <= maxLevel; i++) {
  levelTargets[i] = i * 10; // Level 1 = 10 points, Level 15 = 150 points
}

/* Track unlocked levels */
let unlockedLevels = 1;

/* ==========================================================================
   DOM ELEMENTS
   ========================================================================== */
const menuScreen = document.getElementById("menuScreen");
const levelSelect = document.getElementById("levelSelect");
const settingsOverlay = document.getElementById("settingsOverlay");
const creditsOverlay = document.getElementById("creditsOverlay");

const poemGrid = document.getElementById("poemGrid");

const scoreboard = document.getElementById("scoreboard");
const scoreValue = document.getElementById("scoreValue");
const levelValue = document.getElementById("levelValue");

const levelComplete = document.getElementById("levelComplete");
const gameComplete = document.getElementById("gameComplete");

const bgm = document.getElementById("bgm");
const hitSfx = document.getElementById("hitSfx");

/* ==========================================================================
   MENU NAVIGATION
   ========================================================================== */
function openLevelSelect() {
  menuScreen.style.display = "none";
  levelSelect.style.display = "flex";
  renderLevelButtons();
}

function showCredits() {
  creditsOverlay.style.display = "block";
  creditsOverlay.querySelector(".overlay-content").innerHTML = `
    <h2>Credits</h2>
    <p>Created by Christine Julian</p>
  `;
  setTimeout(() => {
    creditsOverlay.style.display = "none";
  }, 18000);
}

function showInstructions() {
  alert("Click poem words to gain score.\nReach the target score to complete each level.\nLevels unlock sequentially.\nPress ESC for settings and return to menu.");
}

function openSettings() {
  settingsOverlay.style.display = "flex";
}

function closeSettings() {
  settingsOverlay.style.display = "none";
}

/* ==========================================================================
   SETTINGS INPUTS
   ========================================================================== */
document.getElementById("crtRange").addEventListener("input", (e) => {
  document.body.style.opacity = e.target.value;
});

document.getElementById("glitchRange").addEventListener("input", (e) => {
  const title = document.querySelector(".menu-title");
  if (title) {
    title.style.animationDuration = (0.25 + (1 - e.target.value) * 0.5) + "s";
  }
});

document.getElementById("volumeRange").addEventListener("input", (e) => {
  bgm.volume = e.target.value;
});

/* ==========================================================================
   LEVEL SELECT RENDERING
   ========================================================================== */
function renderLevelButtons() {
  const grid = document.querySelector(".level-grid");
  grid.innerHTML = "";

  for (let i = 1; i <= maxLevel; i++) {
    const btn = document.createElement("button");
    btn.textContent = `Level ${i}`;
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
   GAMEPLAY
   ========================================================================== */
function startLevel(level) {
  currentLevel = level;
  score = 0;

  levelSelect.style.display = "none";
  levelComplete.style.display = "none";
  gameComplete.style.display = "none";

  scoreboard.style.display = "flex";
  poemGrid.style.display = "grid";

  bgm.play();

  updateScoreboard();
  loadPoemWords();
}

function loadPoemWords() {
  poemGrid.innerHTML = "";

  for (let i = 0; i < 10; i++) {
    const word = document.createElement("div");
    word.classList.add("poemWord");
    word.textContent = `word ${i + 1}`;

    word.addEventListener("click", () => {
      score++;
      updateScoreboard();
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
}

function updateScoreboard() {
  scoreValue.textContent = score;
  levelValue.textContent = currentLevel;
}

/* ==========================================================================
   LEVEL COMPLETE
   ========================================================================== */
function completeLevel() {
  poemGrid.style.display = "none";
  scoreboard.style.display = "none";
  bgm.pause();

  if (currentLevel < maxLevel) {
    unlockedLevels = Math.max(unlockedLevels, currentLevel + 1);

    levelComplete.style.display = "flex";
    levelComplete.querySelector("h1").textContent = `Level ${currentLevel} Complete!`;

    const nextBtn = levelComplete.querySelector(".nextLevelBtn");
    nextBtn.onclick = () => {
      levelComplete.style.display = "none";
      startLevel(currentLevel + 1);
    };

  } else {
    gameComplete.style.display = "flex";
  }
}

/* ==========================================================================
   GAME COMPLETE
   ========================================================================== */
function replayGame() {
  unlockedLevels = 1;
  currentLevel = 1;
  score = 0;

  gameComplete.style.display = "none";
  openLevelSelect();
}

/* ==========================================================================
   RETURN TO MENU
   ========================================================================== */
function returnToMenu() {
  poemGrid.style.display = "none";
  scoreboard.style.display = "none";
  levelComplete.style.display = "none";
  gameComplete.style.display = "none";
  levelSelect.style.display = "none";

  menuScreen.style.display = "flex";

  bgm.pause();
  bgm.currentTime = 0;
}

/* ==========================================================================
   KEYBOARD SHORTCUTS
   ========================================================================== */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    openSettings();
  }
});
