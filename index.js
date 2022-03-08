const sprite = document.querySelector('#snake')
let intervalId;
let keyTarget;




// Change these for different effects on the game
let xPos = 200
let yPos = 500
const size = 20
const moveDistance = 20
const spd = 100



sprite.style.left   = xPos + 'px'
sprite.style.bottom = yPos + 'px'

sprite.style.width  = size + 'px'
sprite.style.height = size + 'px'



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
    sprite.style.left = xPos + 'px'
}
function moveLeft() {
    xPos -= moveDistance;
    sprite.style.left = xPos + 'px'
}
function moveUp() {
    yPos += moveDistance;
    sprite.style.bottom = yPos + 'px'
}
function moveDown() {
    yPos -= moveDistance;
    sprite.style.bottom = yPos + 'px'
}


// clears and restarts interval only if user pressed a different key
function moveInterval(moveDirection, speed) {
    if(keyTarget !== event.key) {
        keyTarget = event.key

        clearInterval(intervalId)
        intervalId = setInterval(moveDirection, speed)
    }
}