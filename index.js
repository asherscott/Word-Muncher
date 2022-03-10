// Global variables here
const snake     = document.querySelector('#head')
const gamespace = document.querySelector(`#gamespace`)
const gameHead  = document.querySelector('#gameHead')
const charTile  = document.querySelector('#charTile')


const testChar = 'T'

let intervalId;
let keyTarget;
let bodyId = 0



// Object because objects as passed parameters vs nums allow for
// more dynamic stuff. (had trouble creating move() with nums)
const snakePos = {x: 0, y: 300}
const size = 20
const intervalSpeed = 100

const bounds = {left: 0, right: 480, top: 520, bottom: 0}
const previousPos = [];     // an array of objects that contain the snakes past coordinates


// Initializes snake position and size
setPosOrSize(snake, 'left', snakePos.x)
setPosOrSize(snake, 'bottom', snakePos.y)

setPosOrSize(snake, 'width', size)
setPosOrSize(snake, 'height', size)



moveSnake(intervalSpeed)



function moveSnake(speed) {

    spawnTile(testChar)

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


// snakeCoordinate = x or y coordinate of the snake
// windowAxis = the axis the snake will move along
// movePositive = determines the direction along windowAxis the snake will move. up/down, left/right
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
    ? snakePos[snakeCoordinate] += size     // Moves either up or right
    : snakePos[snakeCoordinate] -= size;    // Moves either down or left

    snake.style[windowAxis] = snakePos[snakeCoordinate] + 'px'  // Displays movement on the DOM



    // stop movement if the snake is against the border AND trying to go outside 
    // TODO: make hardcoded conditionals work with "bounds"
    if(snakePos.x === 480 && windowAxis === 'left') {
        clearInterval(intervalId)
    }else if(snakePos.x === 0 && windowAxis === 'left') {
        clearInterval(intervalId)
    }else if(snakePos.y === 520 && windowAxis === 'bottom') {
        clearInterval(intervalId)
    }else if(snakePos.y === 0 && windowAxis === 'bottom') {
        clearInterval(intervalId)
    }



    // checks if tile coordinates match snake coordinates
    const tileX = parseInt(charTile.style.left.replace('px', ''))
    const tileY = parseInt(charTile.style.bottom.replace('px', ''))

    if (snakePos.x === tileX && snakePos.y === tileY) {
        spawnTile(testChar)
        addSnake()
        spellWord(testChar)
    }
}



// doesn't executes if user presses same button in a row.
// Ex: repeatedly press ArrowDown then ArrowRight super quick. 
// You'll notice the snake moves more slowly, because you're 
// rapidly clearing and restarting the interval. if statement's 
// purpose is to limit that sluggish movement when spamming one key

// clearing and restarting the interval is needed to prevent 
// multiple intervals from existing at once, which screws stuff up.
function moveInterval(snakeCoordinate, windowAxis, moveRighty, speed) {
    if(keyTarget !== event.key) {   
        keyTarget = event.key

        clearInterval(intervalId)
        intervalId = setInterval(() => move(snakeCoordinate, windowAxis, moveRighty), speed)
    }
}

function munch(e){
    snake.style.backgroundColor = "pink";
    setTimeout(() => snake.style.backgroundColor = "black",500);
 }

 /******Word Lists ********/

 /////build your own word list/////

const form = document.querySelector(`#new-words`)
let userlistCounter = 0
let newUserList

form.addEventListener(`submit`,(e) => {
    e.preventDefault();
    const w1 = document.querySelector(`#w1`).value;
    const w2 = document.querySelector(`#w2`).value;
    const w3 = document.querySelector(`#w3`).value;
    const w4 = document.querySelector(`#w4`).value;
    const w5 = document.querySelector(`#w5`).value;
    newUserList = [w1,w2,w3,w4,w5];
    userlistCounter+=1;
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
let loadedList

function loadSelectList(e){
    const selectedListId = e.target.value;
    fetch(`http://localhost:3000/wordlist/${selectedListId}`)
    .then(returnlistJSON => returnlistJSON.json())
    .then(listObj => {
        loadedList = listObj.words
        grabLetters(loadedList)
    })
}


 /****** Pull Words from Wordlist ********/

////// if list loaded from db.json /////////

//grabLetters + makeLettersArray creates a nested array of letters
function grabLetters(wordsArray){
    //grab word
    const grabLettersArray = []
    for (const word of wordsArray) {
        grabLettersArray.push(makeLetterArray(word))
      }
    return grabLettersArray;
}

function makeLetterArray(word){
    const lettersArray = []
    for(letter of word){
    lettersArray.push(letter)
    }
    return lettersArray
}
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
    setPosOrSize(charTile, 'left', randSpawn(bounds.right))
    setPosOrSize(charTile, 'bottom', randSpawn(bounds.right))

    // console.log(randSpawn(bounds.right), randSpawn(bounds.top), charTile)
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
    // debugger;

}

function setPosOrSize(var1, var2, var3) {
    var1.style[var2] = var3 + 'px'
}

function spellWord(char) {
    console.log('tt')

    const newTile = document.createElement('div')
    newTile.className = 'tiles'
    newTile.textContent = char
    gameHead.append(newTile)
}
