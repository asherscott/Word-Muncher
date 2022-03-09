// Global variables here
const snake = document.querySelector('#snake')
let intervalId;
let keyTarget;
const gamespace = document.querySelector(`#gamespace`);0
let maxLeft = gamespace.style.left; 

// Object because objects as passed parameters vs nums allow for
// more dynamic stuff. (had trouble creating move() with nums)
const snakePos = {
    x: 200,     
    y: 500,
}
const size = 20
const intervalSpeed = 100


// Initializes snake position and size
snake.style.left   = snakePos.x + 'px'
snake.style.bottom = snakePos.y + 'px'

snake.style.width  = size + 'px'
snake.style.height = size + 'px'



moveSnake(intervalSpeed)



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


// snakeCoordinate = x or y coordinate of the snake
// windowAxis = the axis the snake will move along
// movePositive = determines the direction along windowAxis the snake will move. up/down, left/right
function move(snakeCoordinate, windowAxis, movePositive) {
    
    (movePositive === true) 
    ? snakePos[snakeCoordinate] += size     // Moves either up or right
    : snakePos[snakeCoordinate] -= size;    // Moves either down or left

    snake.style[windowAxis] = snakePos[snakeCoordinate] + 'px'  // Displays movement on the DOM
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

 ////build your own word list/////

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

 //initial push to get