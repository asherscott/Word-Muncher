// Global variables here
const snake         = document.querySelector('#head')
const gamespace     = document.querySelector(`#gamespace`)
const gameHead      = document.querySelector('#gameHead')
const charTile      = document.querySelector('#charTile')
const munchedList   = document.querySelector('#munchedList')
let scoreValue = 0
//TODO: pull words list up here -> decide how to finalize, replace testArray with variable name;
let loadedList; //list loaded from internal database
let gameWords //list that will be manipulated in spawnLetter
const defaultList = ['The', 'Magnificent', 'Word', 'Muncher', 'Munches', 'Many', 'Words']
let gameOver = false;
//TEST VARIABLES//
//const testNestedArray = grabLetters(['hi','yes','ok']);
const testChar = 'T'

let intervalId;
let keyTarget;
let bodyId = 0



const snakePos = {x: 20, y: 240}
const size = 20
let intervalSpeed = 100

const bounds = {min: 0, max: 480}
const previousPos = [];



window.onload = function(){
    const startBttn = document.querySelector(`#startBttn`)
    startBttn.addEventListener(`click`, onStart)

    charTile.style.display = 'none'

    displayList(defaultList)
}
//TODO: add start button
//everything that needs to happen when start

function onStart(){
    // chooseList();
    chooseList();

    setPosOrSize(snake, 'left', snakePos.x)
    setPosOrSize(snake, 'bottom', snakePos.y)

    setPosOrSize(snake, 'width', size)
    setPosOrSize(snake, 'height', size)

    charTile.style.display = 'block'
    spawnTile(gameWords[0].shift())
    moveSnake(intervalSpeed)

    setInterval(count,1000);

    // clears WordSpeller on start
    gameHead.innerHTML = ''
}

if(endGame){endGame()}
function endGame(){
    //make endscreen visible 
    //add event listener to playAgain button
    //clear out "words munched list"
    //push score/time to scorelist
}

function reload(){

}
/*****Timer*******/
function count(){
    if(!gameOver) {
        const timer = document.querySelector("#timer")
        const time = timer.querySelector('span')
        time.innerText = parseInt(time.innerText)+1
    };
}

////*****SNAKE *******/
function moveSnake(speed) {

    document.addEventListener('keydown', (event) => {
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

  function spawnNext(nestedArray) {
    spellWord(charTile.innerText);
    // const poppedLetter = 
    munch();
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

    //TODO: refactor this
    if (snakePos.x === tileX && snakePos.y === tileY) {
        //if testNestedArray is 
        if(gameWords[0].length === 0 && gameWords.length === 1){
            updateScore()
            munch();
            spellWord(charTile.innerText);
            clearTiles();
            gameOver = true;
            //endGame();
        }
        else if(gameWords[0].length===0 && !gameOver) {
            gameWords.shift()
            spawnNext(gameWords)
            //call to function -> populating to munchedList 
            clearTiles();
        }
        else if (!gameOver){
        spawnNext(gameWords)
        }
    }
} 
// function addToMunchedList(){
//     const munchedList = document.querySelector(`#munchedList`);
//     const li = document.createElement('li');
//     // li.innerText = 
//     munchedList.append(li)
// }

function displayMunched(letterArray) {
    const li = document.createElement('li')
    li.textContent = letterArray.join('')
    munchedList.querySelector('ul').append(li)
}

function clearTiles() {
   gameHead.innerHTML =""
    const munchedWord = []
    displayMunched(munchedWord)
}

// doesn't executes if user presses same button in a row.
// Ex: repeatedly press ArrowDown then Arrowmax super quick. 
// You'll notice the snake moves more slowly, because you're 
// rapidly clearing and restarting the interval. if statement's 
// purpose is to limit that sluggish movement when spamming one key

// clearing and restarting the interval is needed to prevent 
// multiple intervals from existing at once, which screws stuff up.
function moveInterval(snakeCoordinate, windowAxis, movemaxy, speed) {
    if(keyTarget !== event.key) {   
        keyTarget = event.key

        clearInterval(intervalId)
        intervalId = setInterval(() => move(snakeCoordinate, windowAxis, movemaxy), intervalSpeed)
    }
}

function munch(){
    snake.style.backgroundColor = "pink";
    setTimeout(() => snake.style.backgroundColor = "black",500);
 }

 /******Word Lists ********/

 /////build your own word list/////

const form = document.querySelector(`#new-words`)
let userlistCounter = 0

form.addEventListener(`submit`,(e) => {
    e.preventDefault();
    const w1 = document.querySelector(`#w1`).value;

    // newUserList = [w1,w2,w3,w4,w5];
    // userlistCounter+=1;
})

//construct new list object 
// function constructUserList(){
//     if(userlistCounter!== 0) {
//         const userlist = {
//          name:"userlist"+userlistCounter,
//          words:newUserList,
//      }
//      return userlist;
//     }
//  }

//push object to database
// fetch(`http://localhost:3000/wordlist`,{
//     method:`POST`,
//     headers:{"Content-Type":"application/json",
//     "Accept":"application/json"},
//     body:JSON.stringify(constructUserList())
// })

 /////select a wordlist/////
const dropdown = document.querySelector(`select`);
dropdown.addEventListener(`change`,(e) => loadSelectList(e))


function loadSelectList(e){
    const selectedListId = e.target.value;
    fetch(`http://localhost:3000/wordlist/${selectedListId}`)
    .then(returnlistJSON => returnlistJSON.json())
    .then(listObj => {
        loadedList = listObj.words
        grabLetters(loadedList)
        displayList(loadedList)
    })
    return loadedList
}

 ////external API ////////////
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
     debugger;
     grabLetters(words.synonyms)})
 .catch(err => {
     console.error(err);
 });
 }000


 /****** Pull Words from Wordlist ********/ 
//grabLetters + makeLettersArray creates a nested array of letters
function grabLetters(wordsArray){
    const grabLettersArray = []
    for (const word of wordsArray) {
        grabLettersArray.push(makeLetterArray(word))
      };
    gameWords = grabLettersArray;
    return grabLettersArray;
}

function makeLetterArray(word){
    const lettersArray = []
    for(letter of word){
    lettersArray.push(letter)
    }
    return lettersArray
}

////Choose List///////

function chooseList(){
    // debugger;
if (loadedList) {
        gameWords = grabLetters(loadedList)
    } else {
        gameWords = grabLetters(defaultList)
    }
    return gameWords
}

/******Work Through Array of Words, Spawn Tiles  ********/ 

// TODO: (spawn location !== snake location)
function spawnTile(char) {

    // generates a random number between 0 and gamebounds, that is divisable by snake size (spawns on grid)
    let randSpawn = (range) => {
        const snakeBodyArray = Array.from(document.querySelectorAll('.snake'))

        const randNum = (Math.floor(Math.random() * (range / size + 1))) * size
        
        // snakeBodyArray.forEach(snakePart => {
        //     if(randNum === (parseInt(snakePart.style.left.replace('px', '')) || parseInt(snakePart.style.bottom.replace('px', '')))) {
        //         randSpawn(range)
        // })
        return randNum
    }

    charTile.textContent = char
    // set div dimensions
    setPosOrSize(charTile, 'width', size)
    setPosOrSize(charTile, 'height', size)
    // set div coordinates to random x/y and display on DOM
    setPosOrSize(charTile, 'left', randSpawn(bounds.max))
    setPosOrSize(charTile, 'bottom', randSpawn(bounds.max))

    // console.log(randSpawn(bounds.max), randSpawn(bounds.top), charTile)
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

// tile dimensions

// const tileWidth = document.querySelector('.tiles').offsetWidth
// let tileHeight = document.querySelector('.tiles').offsetHeight

// document.querySelector('.tiles').offsetHeight = tileWidth

function displayList(list) {
    const ul = wordList.querySelector('ul')
    ul.innerHTML =''
    list.forEach(word => {
        const li = document.createElement('li')
        li.textContent = word
        ul.append(li)
    })
}

function increaseSpeed(difficulty) {
    // difficulty modes will probably be changed from strings to variables
    if(intervalSpeed >= 60 && difficulty === 'medium') {
        // regular mode --- minimum speed = 60
        intervalSpeed = intervalSpeed / 1.02
    }else if(intervalSpeed >= 35 && difficulty === 'hard') {
        // hard mode --- minimum speed = 35
        intervalSpeed = intervalSpeed / 1.06
    }else if(intervalSpeed >= 25 && difficulty === 'insane') {
        // insane mode --- minimum speed = 25
        intervalSpeed = intervalSpeed / 1.1
    }
    // if difficulty === easy, then do nothing
}
const difDropdown = document.querySelector('#difficulty-dropdown')
difDropdown.addEventListener('change', (event) => chooseDifficulty(event))

let dif = 'easy'
function chooseDifficulty(event) {
    dif = event.target.value
    return dif
}