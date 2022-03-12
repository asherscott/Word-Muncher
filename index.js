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
let difficulty = 'easy'
let scoreValue = 0
let totalTime 

let intervalId;
let keyTarget;
let snakeBodyId = 0

const previousPos = [];
const snakePos = {x: 20, y: 240}
const bounds = {min: 0, max: 480}

const size = 20
let intervalSpeed = 100



window.onload = function() {
    endscreen.style.display = "none";
    charTile.style.display = 'none'

    displayList(defaultList)

    gameHead.querySelectorAll('.startBtn').forEach(btn => btn.addEventListener(`click`, onStart)) 

    document.querySelector('#theme-dropdown')       .addEventListener('change', chooseTheme)
    document.querySelector('#difficulty-dropdown')  .addEventListener('change', (event) => difficulty = event.target.value)
    document.querySelector(`select`)                .addEventListener(`change`, loadDropdownList)
    document.querySelector(`#new-words`)            .addEventListener(`submit`, submitWord)
}

/*****Settings Menu *******/
function increaseSpeed(difficulty) {
    (difficulty === 'medium' && intervalSpeed >= 50) ? intervalSpeed = intervalSpeed / 1.08 : null;
    (difficulty === 'hard'   && intervalSpeed >= 25) ? intervalSpeed = intervalSpeed / 1.12 : null;
}

const chooseTheme = (event) => document.querySelector("#style").href = `${event.target.value}.css`

//everything that needs to happen when start
function onStart() {
    //loads chosen list or default list if nothing is chosen
    if(loadedList) {
        gameWords = grabLetters(loadedList)
        displayList(loadedList)
    } else {
        gameWords = grabLetters(defaultList)
    }

    setPosition(snake, snakePos)
    setSize(snake)
    changeSnakeDirection()

    charTile.style.display = 'block'
    spawnTile(gameWords[0].shift())

    setInterval(count, 1000);

    // clears WordSpeller on start
    gameHead.innerHTML = ''
}

//everything that needs to happen when game ends
function endGame() {
    clearInterval(intervalId)

    endscreen.style.display = "flex"
    charTile.remove();

    const playAgain = document.querySelector("#playAgain")
    playAgain.addEventListener('submit', null);

    const finalScore = document.querySelector("#finalScore","span") 
    finalScore.innerText = scoreValue+" letters munched!";

    const finalTime = document.querySelector("#finalTime","span")
    finalTime.innerText = "in "+totalTime+" seconds!";

    const finalDifficulty = document.querySelector("#finalDifficulty","span")
    finalDifficulty.innerText = `Great job on ${difficulty}!`
}

/********GamePlay Features*******/
/******Word Lists ********/

/////Synonym Toast Munch/////
function submitWord(event) {
    event.preventDefault();
    const enteredWord = document.querySelector(`#w1`).value;
    getSyns(enteredWord);
}
 
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
  .catch(err => console.error(err));
}
 
/////Select a Word List (Dropdown)/////
function loadDropdownList(e){
    fetch(`http://localhost:3000/wordlist/${e.target.value}`)
    .then(returnlistJSON => returnlistJSON.json())
    .then(listObj => {
        loadedList = listObj.words
        displayList(loadedList)
    })
}
 
/****** Pull Words from loadedList ********/ 
//grabLetters + makeLettersArray creates a nested array of letters
function grabLetters(wordsArray){
    const grabLettersArray = []
    wordsArray.forEach(word => grabLettersArray.push(makeLetterArray(word)))
    gameWords = grabLettersArray;
    return gameWords;
}
 
function makeLetterArray(word){
    const lettersArray = []
    for(letter of word) {
        lettersArray.push(letter)
    }
    return lettersArray
}
 
/*****Score, Timer Display*******/

////*****SNAKE *******/
function changeSnakeDirection() {
    document.addEventListener('keydown', (event) => {
        if(!gameOver){
            switch(event.key) {
                case 'ArrowRight':
                    moveInterval('x', 'left', true)
                    break;
                case 'ArrowLeft':
                    moveInterval('x', 'left', false)
                    break;
                case 'ArrowUp':
                    moveInterval('y', 'bottom', true)
                    break;
                case 'ArrowDown':
                    moveInterval('y', 'bottom', false)
                    break;
            }
        }
    })
}

function moveSnakeHead(snakeCoordinate, windowAxis, moveMaxy) {
    previousPos.push({...snakePos});

    snakeBodyId ? moveSnakeBody() : null;

    // moves up/right if true, down/left if false
    (moveMaxy === true) 
    ? snakePos[snakeCoordinate] += size
    : snakePos[snakeCoordinate] -= size;

    snake.style[windowAxis] = snakePos[snakeCoordinate] + 'px';

    stopAtBorder(windowAxis)
    munchTile()
} 

function stopAtBorder(windowAxis) {
    // stop movement if the snake is against the border AND trying to go outside 
    (snakePos.x === bounds.max && windowAxis === 'left')   ? clearInterval(intervalId) : null;
    (snakePos.x === bounds.min && windowAxis === 'left')   ? clearInterval(intervalId) : null;
    (snakePos.y === bounds.max && windowAxis === 'bottom') ? clearInterval(intervalId) : null;
    (snakePos.y === bounds.min && windowAxis === 'bottom') ? clearInterval(intervalId) : null;
}

function munchTile() {
    // checks if tile coordinates match snake coordinates
    const tileX = parseInt(charTile.style.left.replace('px', ''))
    const tileY = parseInt(charTile.style.bottom.replace('px', ''))

    if (snakePos.x === tileX && snakePos.y === tileY) {
        if(gameWords[0].length === 0 && gameWords.length === 1){
            gameOver = true;
            updateScore()
            munchFlash();
            spellWord(charTile.innerText);
            setTimeout(() => clearTiles(),700);
            endGame();
        }else if(gameWords[0].length === 0 && !gameOver) {
            gameWords.shift()
            setTimeout(() => clearTiles(),700);
            spawnNext(gameWords)
        }else if (!gameOver){
            spawnNext(gameWords)
        }
    }
}

function moveSnakeBody() {
    const snakeBodyArray = Array.from(document.querySelectorAll('.snake')).slice(1)
    snakeBodyArray.forEach((snakeBody, index) => setPosition(snakeBody, previousPos[previousPos.length - (index + 1)]))
}

function moveInterval(snakeCoordinate, windowAxis, moveMaxy) {
    if(keyTarget !== event.key) {   
        keyTarget = event.key

        clearInterval(intervalId)
        intervalId = setInterval(() => moveSnakeHead(snakeCoordinate, windowAxis, moveMaxy), intervalSpeed)
    }
}
/**********Rendering, Updating Display **********/
function count() {
    if(!gameOver) {
        const time = gamespace.querySelector('#timer > span')
        time.innerText = parseInt(time.innerText) + 1
        totalTime = parseInt(time.innerText)
        return totalTime
    }
}

function spawnNext(nestedArray) {
    spellWord(charTile.innerText);
    munchFlash();
    updateScore()
    spawnTile(nestedArray[0].shift())
    addSnake()
    increaseSpeed(difficulty)
}

function updateScore(){
    scoreValue++
    const score = gamespace.querySelector('#scoreboard > span')
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
    const munchedLetters = []
    while (gameHead.firstChild) {
        munchedLetters.push(gameHead.firstChild.textContent)
        gameHead.removeChild(gameHead.firstChild);
    }
    displayMunchedList(munchedLetters)
}

// TODO: (spawn location !== snake location)
function spawnTile(char) {
    // generates a random number between 0 and gamebounds, that is divisable by snake size (spawns on grid)
    let randSpawn = () => (Math.floor(Math.random() * (bounds.max / size + 1))) * size

    charTile.textContent = char

    setSize(charTile)
    setPosition(charTile, randSpawn(), 'left')
    setPosition(charTile, randSpawn(), 'bottom')

    gamespace.append(charTile)
}

function addSnake() {
    const snakeBody = document.createElement('div')
    snakeBodyId++
    snakeBody.id = snakeBodyId
    snakeBody.className = 'snake'

    setSize(snakeBody)
    setPosition(snakeBody, previousPos[previousPos.length - 1])

    gamespace.append(snakeBody)
}

function setSize(element) {
    element.style.height = size + 'px'
    element.style.width = size + 'px'
}

function setPosition(element, value, axis) {
    if(typeof(value) === 'object') {
        element.style.left   = value.x + 'px'
        element.style.bottom = value.y + 'px'
    } else {
        element.style[axis] = value + 'px'
    }
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
