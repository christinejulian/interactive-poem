/* ==========================================================================
   GAME STATE & PROGRESSION
   ========================================================================== */
let currentLevel = 1;
let unlockedLevel = 1;
const maxLevel = 15;
let score = 0;

const levelTargets = {};
for (let i = 1; i <= maxLevel; i++) {
  levelTargets[i] = i * 10; // Target score increases per level
}

/* ==========================================================================
   DOM ELEMENTS
   ========================================================================== */
const menuScreen = document.getElementById("menuScreen");
const characterSelect = document.getElementById("characterSelect");
const saveScreen = document.getElementById("saveScreen");
const levelSelectScreen = document.getElementById("levelSelectScreen");
const settingsOverlay = document.getElementById("settingsOverlay");
const creditsOverlay = document.getElementById("creditsOverlay");
const poemGrid = document.getElementById("poemGrid");
const scoreboard = document.getElementById("scoreboard");
const scoreValue = document.getElementById("scoreValue");
const levelValue = document.getElementById("levelValue");
const levelComplete = document.getElementById("levelComplete");
const gameComplete = document.getElementById("gameComplete");

const bgm = document.getElementById("bgm");
const voice = document.getElementById("voice");
const hitSfx = document.getElementById("hitSfx");

/* ==========================================================================
   NAVIGATION & MENUS
   ========================================================================== */
function openCharacterSelect() {  
  hideAllScreens();
  characterSelect.style.display = "flex";  
}  

function openSaveSlots() {  
  hideAllScreens();
  saveScreen.style.display = "flex";  
}  

function openLevelSelect() {
  hideAllScreens();
  levelSelectScreen.style.display = "flex";
  buildLevelSelectGrid();
}

function hideAllScreens() {
  menuScreen.style.display = "none";
  characterSelect.style.display = "none";
  saveScreen.style.display = "none";
  levelSelectScreen.style.display = "none";
  poemGrid.style.display = "none";
  scoreboard.style.display = "none";
  levelComplete.style.display = "none";
  gameComplete.style.display = "none";
}

function chooseCharacter(name) {  
  localStorage.setItem("character", name);  
  startLevel(1);  
}  

function loadSlot(slot) {  
  alert("Loaded Slot " + slot);  
  startLevel(1);  
}  

function showCredits() {  
  creditsOverlay.style.display = "block";  
  voice.play();  
  creditsOverlay.querySelector(".overlay-content").innerHTML = `
    <h2>Credits</h2>
    <p>Created by Christine Julian</p>
  `;  
  setTimeout(() => {  
    creditsOverlay.style.display = "none";  
  }, 18000);  
}  

function showInstructions() {  
  alert("Click poem words to gain score.\nReach the target score to complete each level.\nLevels 2-15 unlock sequentially as you complete previous levels.\nPress ESC for settings.");  
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
  const val = e.target.value;  
  const title = document.querySelector(".menu-title");  
  if (title) {  
    title.style.animationDuration = (0.25 + (1 - val) * 0.5) + "s";  
  }  
});  

document.getElementById("volumeRange").addEventListener("input", (e) => {  
  bgm.volume = e.target.value;  
});  

/* ==========================================================================
   LEVEL SELECTION & LOCKING SYSTEM
   ========================================================================== */
function buildLevelSelectGrid() {
  const gridContainer = document.getElementById("levelGridContainer");
  gridContainer.innerHTML = "";

  for (let i = 1; i <= maxLevel; i++) {
    const btn = document.createElement("button");
    btn.classList.add("level-btn");
    
    if (i <= unlockedLevel) {
      btn.textContent = `Level ${i}`;
      btn.onclick = () => startLevel(i);
    } else {
      btn.textContent = `🔒 Lvl ${i}`;
      btn.classList.add("locked");
      btn.disabled = true;
    }
    gridContainer.appendChild(btn);
  }
}

/* ==========================================================================
   GAMEPLAY & SCOREBOARD
   ========================================================================== */
function startLevel(levelNum) {  
  currentLevel = levelNum;
  score = 0;
  hideAllScreens();
  
  scoreboard.style.display = "flex";  
  bgm.volume = 0.6;  
  bgm.play();  
  voice.play();  
  
  loadPoemWords(currentLevel);  
  updateScoreboard();  
}  

function loadPoemWords(levelNum) {  
  poemGrid.innerHTML = "";  
  poemGrid.style.display = "grid";  
  
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

function completeLevel() {  
  poemGrid.style.display = "none";  
  scoreboard.style.display = "none";
  bgm.pause();  
  
  // Unlock next level progressively
  if (currentLevel >= unlockedLevel && unlockedLevel < maxLevel) {
    unlockedLevel = currentLevel + 1;
  }

  if (currentLevel < maxLevel) {  
    levelComplete.style.display = "flex";  
    levelComplete.querySelector("h1").textContent = `Level ${currentLevel} Complete!`;  
    
    const nextBtn = levelComplete.querySelector(".nextLevelBtn");  
    nextBtn.onclick = () => {  
      startLevel(currentLevel + 1);  
    };  
  } else {  
    gameComplete.style.display = "flex";  
  }  
}  

function replayGame() {  
  startLevel(1);  
}  

function returnToMenu() {  
  hideAllScreens();
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
