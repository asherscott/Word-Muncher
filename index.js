const snake = document.querySelector('#snake')
let intervalId;
let keyTarget;




// Change these for different effects on the game
let xPos = 200
let yPos = 500
const size = 20
const moveDistance = 20
const spd = 100



snake.style.left   = xPos + 'px'
snake.style.bottom = yPos + 'px'

snake.style.width  = size + 'px'
snake.style.height = size + 'px'



startSnake(spd, moveDistance)



function startSnake(speed, moveDistance) {
    document.addEventListener('keydown', (event) => {
        switch(event.key) {
            case 'ArrowLeft':
                moveInterval(moveLeft, speed)
                break;
            case 'ArrowUp':
                moveInterval(moveUp, speed)
                break;
            case 'ArrowDown':
                moveInterval(moveDown, speed)
                break;
            default:
                moveInterval(moveRight, speed)
                break;
        }
    })
}


// move funcs, --condense to single func--
function moveRight() {
    xPos += moveDistance;
    snake.style.left = xPos + 'px'
}
function moveLeft() {
    xPos -= moveDistance;
    snake.style.left = xPos + 'px'
}
function moveUp() {
    yPos += moveDistance;
    snake.style.bottom = yPos + 'px'
}
function moveDown() {
    yPos -= moveDistance;
    snake.style.bottom = yPos + 'px'
}
// function move(axisPos, axisWindow, moveRighty) {
//     (moveRighty === true) 
//     ? axisPos += moveDistance
//     : axisPos -= moveDistance;

//     snake.style[axisWindow] = axisPos + 'px'
// }


// clears and restarts interval only if user pressed a different key
function moveInterval(moveFunc, speed) {
    if(keyTarget !== event.key) {
        keyTarget = event.key

        clearInterval(intervalId)
        intervalId = setInterval(moveFunc, speed)
    }
}