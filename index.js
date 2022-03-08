const snake = document.querySelector('#snake')
let intervalId;
let keyTarget;



// Change these for different effects on the game
const snakePos = {
    x: 200,
    y: 500,
}
const size = 20
const moveDistance = 20
const spd = 100



snake.style.left   = snakePos.x + 'px'
snake.style.bottom = snakePos.y + 'px'

snake.style.width  = size + 'px'
snake.style.height = size + 'px'



startSnake(spd, moveDistance)



function startSnake(speed, moveDistance) {
    document.addEventListener('keydown', (event) => {
        switch(event.key) {
            case 'ArrowLeft':
                moveInterval('x', 'left', false, speed)
                break;
            case 'ArrowUp':
                moveInterval('y', 'bottom', true, speed)
                break;
            case 'ArrowDown':
                moveInterval('y', 'bottom', false, speed)
                break;
            default:
                moveInterval('x', 'left', true, speed)
                break;
        }
    })
}



function move(axisPos, axisWindow, moveRighty) {
    
    (moveRighty === true) 
    ? snakePos[axisPos] += moveDistance
    : snakePos[axisPos] -= moveDistance;

    snake.style[axisWindow] = snakePos[axisPos] + 'px'
}



// clears and restarts interval only if user pressed a different key
function moveInterval(axisPos, axisWindow, moveRighty, speed) {
    if(keyTarget !== event.key) {
        keyTarget = event.key

        clearInterval(intervalId)
        intervalId = setInterval(() => move(axisPos, axisWindow, moveRighty), speed)
    }
}