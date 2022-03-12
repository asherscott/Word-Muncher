// Global variables here
const snake         = document.querySelector('#head')
const gamespace     = document.querySelector(`#gamespace`)
const gameHead      = document.querySelector('#gameHead')
const charTile      = document.querySelector('#charTile')
const munchedList   = document.querySelector('#munchedList')
const endscreen     = document.querySelector(`.endgame`)

let loadedList; //list loaded from database (internal or external API)
let gameWords //list that will be manipulated in spawnLetter

const defaultList = ['The', 'Magnificent', 'Word', 'Muncher', 'Munches', 'Many', 'Words']
let gameOver = false;
let dif = 'easy'
let scoreValue = 0
let totalTime 

let intervalId;
let keyTarget;
let bodyId = 0

const bounds = {min: 0, max: 480}
const previousPos = [];
const snakePos = {x: 20, y: 240}

const size = 20
let intervalSpeed = 100



window.onload = function() {
    endscreen.style.display = "none";
    charTile.style.display = 'none'

    displayList(defaultList)

    gameHead.querySelectorAll('.startBtn').forEach(btn => btn.addEventListener(`click`, onStart)) 

    document.querySelector('#theme-dropdown')       .addEventListener('change', (event) => chooseTheme(event))
    document.querySelector('#difficulty-dropdown')  .addEventListener('change', (event) => dif = event.target.value)
}

/*****Settings Menu *******/
function increaseSpeed(difficulty) {
    switch(difficulty) {
        case 'medium':
            intervalSpeed >= 60 ? intervalSpeed = intervalSpeed / 1.02 : null;
            break;
        case 'hard':
            intervalSpeed >= 35 ? intervalSpeed = intervalSpeed / 1.06 : null;
            break;
        case 'insane':
            intervalSpeed >= 25 ? intervalSpeed = intervalSpeed / 1.10 : null;
            break;
    }
    // Refactoring gone too far?
    // (difficulty === 'medium' && intervalSpeed >= 60) ? intervalSpeed = intervalSpeed / 1.02 : null;
    // (difficulty === 'hard'   && intervalSpeed >= 35) ? intervalSpeed = intervalSpeed / 1.06 : null;
    // (difficulty === 'insane' && intervalSpeed >= 25) ? intervalSpeed = intervalSpeed / 1.10 : null;
}

function chooseTheme(event) {
    const theme = event.target.value
    const style = document.querySelector("#style");
    style.href = `${theme}.css`
    debugger;
}
//everything that needs to happen when start
function onStart(){

//loads chosen list or default list if nothing is chosen
if(loadedList){
    gameWords = grabLetters(loadedList)
    displayList(loadedList)
} else {
    gameWords = grabLetters(defaultList)
}
//initializes snake position
    setPosOrSize(snake, 'left', snakePos.x)
    setPosOrSize(snake, 'bottom', snakePos.y)

    setPosOrSize(snake, 'width', size)
    setPosOrSize(snake, 'height', size)

//spawns initial tile
    charTile.style.display = 'block'
    spawnTile(gameWords[0].shift())
    moveSnake(intervalSpeed)

//initiates timer
    setInterval(count,1000);

// clears WordSpeller on start
    gameHead.innerHTML = ''
}

//everything that needs to happen when game ends
function endGame(){
    clearInterval(intervalId)

    endscreen.style.display = "flex"
    charTile.remove();

    const playAgain = document.querySelector("#playAgain")
    playAgain.addEventListener('submit',() => {});

    const finalScore = document.querySelector("#finalScore","span") 
    finalScore.innerText = scoreValue+" letters munched!";

    const finalTime = document.querySelector("#finalTime","span")
    finalTime.innerText = "in "+totalTime+" seconds!";

    const finalDifficulty = document.querySelector("#finalDifficulty","span")
    finalDifficulty.innerText = "Great job on "+dif+"!"

}

/********GamePlay Features*******/
 /******Word Lists ********/

 /////Synonym Toast Munch/////

 const wordForm = document.querySelector(`#new-words`)

 wordForm.addEventListener(`submit`,(e) => {
     e.preventDefault();
     const enteredWord = document.querySelector(`#w1`).value;
     getSyns(enteredWord);
})
 
  ////access Words API to get synonyms ////////
function getSyns(inputWord) {
     fetch(`https://wordsapiv1.p.rapidapi.com/words/${inputWord}/synonyms`, {
      "method": "GET",
      "headers": {
          "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
          "x-rapidapi-key": "ed0843a013mshf0322f372ebf2e4p1c7f9bjsnfb7909794c3d"
      }
  })
  .then(res => res.json())
  .then(words => {
      loadedList = words.synonyms
      displayList(loadedList)})
  .catch(err => {
      console.error(err);
  });
}
 
  /////Select a Word List (Dropdown)/////
 const dropdown = document.querySelector(`select`);
 dropdown.addEventListener(`change`,(e) => loadSelectList(e))
 
function loadSelectList(e){
     const selectedListId = e.target.value;
     fetch(`http://localhost:3000/wordlist/${selectedListId}`)
     .then(returnlistJSON => returnlistJSON.json())
     .then(listObj => {
         loadedList = listObj.words
         displayList(loadedList)
     })
     return loadedList;
}
 
  /****** Pull Words from loadedList ********/ 
 //grabLetters + makeLettersArray creates a nested array of letters
function grabLetters(wordsArray){
     const grabLettersArray = []
     for (const word of wordsArray) {
         grabLettersArray.push(makeLetterArray(word))
       };
     gameWords = grabLettersArray;
     return gameWords;
}
 
function makeLetterArray(word){
     const lettersArray = []
     for(letter of word){
     lettersArray.push(letter)
     }
     return lettersArray
}
 
/*****Score, Timer Display*******/

////*****SNAKE *******/
function moveSnake(speed) {
    document.addEventListener('keydown', (event) => {
        if(!gameOver){
        switch(event.key) {
            case 'ArrowRight':
                moveInterval('x', 'left', true, speed)
                break;
            case 'ArrowLeft':
                moveInterval('x', 'left', false, speed)
                break;
            case 'ArrowUp':
                moveInterval('y', 'bottom', true, speed)
                break;
            case 'ArrowDown':
                moveInterval('y', 'bottom', false, speed)
                break;
        }
    }
})
}

// movePositive = determines the direction along windowAxis the snake will move. up/down, left/max
function move(snakeCoordinate, windowAxis, movePositive) {
    // an array of objects that contain the snakes past coordinates
    previousPos.push({...snakePos})
    // Controls positions of the snake body divs
    if(bodyId > 0) {
        const snakeBodyArray = Array.from(document.querySelectorAll('.snake')).slice(1)
        snakeBodyArray.forEach((snakeBody, index) => {
            setPosOrSize(snakeBody, 'left', previousPos[previousPos.length - (index + 1)].x)
            setPosOrSize(snakeBody, 'bottom', previousPos[previousPos.length - (index + 1)].y)
        })
    }


    
    (movePositive === true) 
    ? snakePos[snakeCoordinate] += size     // Moves either up or max
    : snakePos[snakeCoordinate] -= size;    // Moves either down or left

    snake.style[windowAxis] = snakePos[snakeCoordinate] + 'px'  // Displays movement on the DOM



    // stop movement if the snake is against the border AND trying to go outside 
    // TODO: make hardcoded conditionals work with "bounds"
    if(snakePos.x === 480 && windowAxis === 'left') {
        clearInterval(intervalId)
    }else if(snakePos.x === 0 && windowAxis === 'left') {
        clearInterval(intervalId)
    }else if(snakePos.y === 480 && windowAxis === 'bottom') {
        clearInterval(intervalId)
    }else if(snakePos.y === 0 && windowAxis === 'bottom') {
        clearInterval(intervalId)
    }


    // checks if tile coordinates match snake coordinates
    const tileX = parseInt(charTile.style.left.replace('px', ''))
    const tileY = parseInt(charTile.style.bottom.replace('px', ''))

function munch(snakeX,snakeY,tileX,tileY){
    if (snakeX === tileX && snakeY === tileY) {
        //if testNestedArray is 
        if(gameWords[0].length === 0 && gameWords.length === 1){
            gameOver = true;
            updateScore()
            munchFlash();
            spellWord(charTile.innerText);
            setTimeout(() => clearTiles(),700);
            endGame();
        }
        else if(gameWords[0].length===0 && !gameOver) {
            gameWords.shift()
            setTimeout(() => clearTiles(),700);
            spawnNext(gameWords)
        }
        else if (!gameOver){
        spawnNext(gameWords)
        }
    }
}

munch(snakePos.x,snakePos.y,tileX,tileY)
} 

function moveInterval(snakeCoordinate, windowAxis, movemaxy, speed) {
    if(keyTarget !== event.key) {   
        keyTarget = event.key

        clearInterval(intervalId)
        intervalId = setInterval(() => move(snakeCoordinate, windowAxis, movemaxy), intervalSpeed)
    }
}
/**********Rendering, Updating Display **********/
function count(){
    if(!gameOver) {
        const timer = document.querySelector("#timer")
        const time = timer.querySelector('span')
        time.innerText = parseInt(time.innerText)+1
        totalTime = parseInt(time.innerText)
        return totalTime
    };
}

function spawnNext(nestedArray) {
    spellWord(charTile.innerText);
    munchFlash();
    updateScore()
    spawnTile(nestedArray[0].shift())
    addSnake()
    increaseSpeed(dif)
}

function updateScore(){
    scoreValue+=1
    const scoreboard = document.querySelector("#scoreboard")
    const score = scoreboard.querySelector('span')
    score.innerText = scoreValue
}

function munchFlash(){
snake.style.backgroundColor = "pink";
setTimeout(() => snake.style.backgroundColor = "black",500);
}

function displayMunchedList(letterArray) {
    const li = document.createElement('li')
    li.textContent = letterArray.join('')
    munchedList.querySelector('ul').append(li)
}

function clearTiles() {
    const munchedWord = []
    while (gameHead.firstChild) {
        munchedWord.push(gameHead.firstChild.textContent)
        gameHead.removeChild(gameHead.firstChild);
    }
    displayMunchedList(munchedWord)
}

// TODO: (spawn location !== snake location)
function spawnTile(char) {

    // generates a random number between 0 and gamebounds, that is divisable by snake size (spawns on grid)
    let randSpawn = (range) => (Math.floor(Math.random() * (range / size + 1))) * size

    charTile.textContent = char
    // set div dimensions
    setPosOrSize(charTile, 'width', size)
    setPosOrSize(charTile, 'height', size)
    // set div coordinates to random x/y and display on DOM
    setPosOrSize(charTile, 'left', randSpawn(bounds.max))
    setPosOrSize(charTile, 'bottom', randSpawn(bounds.max))

    gamespace.append(charTile)
}

function addSnake() {
    const snakeBody = document.createElement('div')
    snakeBody.className = 'snake'
    bodyId++
    snakeBody.id = bodyId
    setPosOrSize(snakeBody, 'left', previousPos[previousPos.length - 1].x)
    setPosOrSize(snakeBody, 'bottom', previousPos[previousPos.length - 1].y)
    
    setPosOrSize(snakeBody, 'width', size)
    setPosOrSize(snakeBody, 'height', size)

    gamespace.append(snakeBody)
}

function setPosOrSize(var1, var2, var3) {
    var1.style[var2] = var3 + 'px'
}

function spellWord(char) {
    const newTile = document.createElement('div')
    newTile.className = 'tiles'
    newTile.textContent = char
    gameHead.append(newTile)
}

function displayList(list) {
    const ul = wordList.querySelector('ul')
    ul.innerHTML =''
    list.forEach(word => {
        const li = document.createElement('li')
        li.textContent = word
        ul.append(li)
    })
}


