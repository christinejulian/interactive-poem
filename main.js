// main.js

const MAX_LEVELS = 15;

let currentLevel = 1;
let score = 0;
let health = 100;
let highestUnlocked = Number(localStorage.getItem("highestUnlocked")) || 1;

// Screens
const menuScreen = document.getElementById("menuScreen");
const levelSelect = document.getElementById("levelSelect");
const poemGrid = document.getElementById("poemGrid");
const levelComplete = document.getElementById("levelComplete");
const gameOver = document.getElementById("gameOver");
const gameComplete = document.getElementById("gameComplete");
const creditsOverlay = document.getElementById("creditsOverlay");

// HUD
const levelIndicator = document.getElementById("levelIndicator");
const scoreIndicator = document.getElementById("scoreIndicator");
const healthIndicator = document.getElementById("healthIndicator");

// Buttons
const startGameBtn = document.getElementById("startGameBtn");
const howToPlayBtn = document.getElementById("howToPlayBtn");
const creditsBtn = document.getElementById("creditsBtn");

const returnMenuBtn = document.getElementById("returnMenuBtn");
const nextLevelBtn = document.getElementById("nextLevelBtn");
const retryLevelBtn = document.getElementById("retryLevelBtn");

const playAgainBtn = document.getElementById("playAgainBtn");

const mainMenuBtn1 = document.getElementById("mainMenuBtn1");
const mainMenuBtn2 = document.getElementById("mainMenuBtn2");
const mainMenuBtn3 = document.getElementById("mainMenuBtn3");

const creditsMenuBtn = document.getElementById("creditsMenuBtn");

const levelGrid = document.getElementById("levelGrid");

const words = [
"arcade","pixel","dream","neon","controller",
"coin","hero","quest","poem","boss",
"level","victory","echo","light","future",
"hope","memory","code","game","play"
];

// ---------------------------
// Menu
// ---------------------------

startGameBtn.onclick = () => {

    if(levelSelect){
        menuScreen.classList.remove("active");
        levelSelect.classList.add("active");
        buildLevelButtons();
    }else{
        startLevel(1);
    }

};

howToPlayBtn.onclick = () => {

alert(
"Click every poem word.\n\n" +
"Each word gives 1 point.\n" +
"Finish every level.\n" +
"Clear all 15 levels to reveal the final poem."
);

};

creditsBtn.onclick = showCredits;

if(returnMenuBtn)
returnMenuBtn.onclick = showMenu;

mainMenuBtn1.onclick = showMenu;
mainMenuBtn2.onclick = showMenu;
mainMenuBtn3.onclick = showMenu;

creditsMenuBtn.onclick = showMenu;

// ---------------------------
// Build Level Select
// ---------------------------

function buildLevelButtons(){

    levelGrid.innerHTML="";

    for(let i=1;i<=MAX_LEVELS;i++){

        const b=document.createElement("button");

        b.textContent="LEVEL "+i;

        if(i<=highestUnlocked){

            b.onclick=()=>startLevel(i);

        }else{

            b.disabled=true;
            b.textContent="LOCKED";

        }

        levelGrid.appendChild(b);

    }

}

// ---------------------------
// Start Level
// ---------------------------

function startLevel(level){

    currentLevel=level;

    score=0;

    health=100;

    hideAll();

    poemGrid.style.display="grid";

    updateHUD();

    createWords();

}

// ---------------------------
// HUD
// ---------------------------

function updateHUD(){

    levelIndicator.textContent=
        `LEVEL ${currentLevel} / ${MAX_LEVELS}`;

    scoreIndicator.textContent=
        `SCORE: ${score}`;

    healthIndicator.textContent=
        `HEALTH: ${health}`;

}

// ---------------------------
// Create Words
// ---------------------------

function createWords(){

    poemGrid.innerHTML="";

    const levelWords=[...words].sort(()=>Math.random()-0.5).slice(0,10);

    levelWords.forEach(word=>{

        const div=document.createElement("div");

        div.className="poemWord";

        div.textContent=word;

        div.onclick=()=>{

            score++;

            div.style.opacity=.25;

            div.style.pointerEvents="none";

            updateHUD();

            checkLevel();

        };

        poemGrid.appendChild(div);

    });

}

// ---------------------------
// Check Win
// ---------------------------

function checkLevel(){

    if(score>=10){

        if(currentLevel>highestUnlocked){

            highestUnlocked=currentLevel;

            localStorage.setItem(
                "highestUnlocked",
                highestUnlocked
            );

        }

        if(currentLevel===MAX_LEVELS){

            showCredits();

            setTimeout(()=>{

                creditsOverlay.style.display="none";

                hideAll();

                gameComplete.classList.add("active");

            },35000);

        }else{

            hideAll();

            document.getElementById(
                "levelCompleteTitle"
            ).textContent=
            `LEVEL ${currentLevel} COMPLETE`;

            levelComplete.classList.add("active");

        }

    }

}

// ---------------------------
// Next Level
// ---------------------------

nextLevelBtn.onclick=()=>{

    startLevel(currentLevel+1);

};

// ---------------------------
// Retry
// ---------------------------

retryLevelBtn.onclick=()=>{

    startLevel(currentLevel);

};

// ---------------------------
// Credits
// ---------------------------

function showCredits(){

    creditsOverlay.style.display="flex";

}

// ---------------------------
// Menu
// ---------------------------

function showMenu(){

    hideAll();

    creditsOverlay.style.display="none";

    menuScreen.classList.add("active");

}

// ---------------------------
// Hide Screens
// ---------------------------

function hideAll(){

    menuScreen.classList.remove("active");

    if(levelSelect)
        levelSelect.classList.remove("active");

    poemGrid.style.display="none";

    levelComplete.classList.remove("active");

    gameOver.classList.remove("active");

    gameComplete.classList.remove("active");

}

// ---------------------------
// ESC
// ---------------------------

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        showMenu();

    }

});

// ---------------------------
// Start
// ---------------------------

showMenu();
