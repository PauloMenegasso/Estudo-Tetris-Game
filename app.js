document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-btn')
    const width = 10
    let nextRandom = 0
    let TimerId = 0
    let levelInterval = 1000
    let score = 0

    // Defining Tetrominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]    
    ]

    const zTetromino=[
        [width*2, width*2+1, width+1, width+2],
        [0, width, width+1, width*2+1],
        [width*2, width*2+1, width+1, width+2],
        [0, width, width+1, width*2+1]
    ]

    const tTetromino=[
        [width, width+1, width+2, 1],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width+1, width*2+1, width]
    ]

    const oTetromino=[
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]

    const iTetromino=[
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

    const theTetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let currentPosition = 4
    let currentRotation = 0

//randomize the tetrominos

    let random = Math.floor(Math.random()*theTetrominos.length)
    let current = theTetrominos[random][currentRotation]

// assign functions to keycodes
    function control(e) {
        if(e.keyCode === 37){
            moveLeft()
        } else if(e.keyCode === 39){
            moveRight()
        } else if(e.keyCode === 38){
            rotate()
        } else if(e.keyCode === 40){
            moveDown()
        }
    }
    document.addEventListener('keyup', control)


    
//draw
    function draw() {
        current.forEach(index =>{
            squares[currentPosition + index].classList.add('tetromino')
        })
    }
// undraw
    function undraw() {
        current.forEach(index =>{
            squares[currentPosition + index].classList.remove('tetromino')
        })
    }

// movedown
    timerId = setInterval(moveDown, levelInterval*100000)

    function moveDown() {
        undraw()
        currentPosition = currentPosition + width
        draw()
        freeze()
    } 

//freeze function
    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        //draw new    
            random = nextRandom 
            nextRandom = Math.floor(Math.random()*theTetrominos.length)
            current = theTetrominos[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }
    //move the tetromino left, unless on the edge
    function moveLeft(){
        undraw()
        const isALeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if(!isALeftEdge) currentPosition -= 1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition +=1
        }
        draw()
    }


    //move the tetromino right, unless on the edge
    function moveRight(){
        undraw()
        const isALeftEdge = current.some(index => (currentPosition + index) % width === 9) //could be width -1 instead a hard coded 9

        if(!isALeftEdge) currentPosition += 1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition -=1
        }
        draw()
    }

//rotate the tetromino
    function rotate() {
        undraw()
        currentRotation ++
        if(currentRotation === current.length) {
            currentRotation = 0
        }
        current = theTetrominos[random][currentRotation]
        draw()
    }

//next tetromino on minigrid
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0

//the Tetromino without rotations
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], //l
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //z
        [1, displayWidth, displayWidth+1, displayWidth+2], //t
        [0, 1, displayWidth, displayWidth+1], //o
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]//i
    ]
//display the shape on minigrid

    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
        })

        upNextTetrominoes[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
        })
    }

//start button
    startBtn.addEventListener('click', () => {
        if (timerId){
            clearInterval(timerId)
            timerId = null
        } else{
            draw()
            timerId= setInterval(moveDown, levelInterval)
            nextRandom = Math.floor(Math.random()*theTetrominos.length)
            displayShape()
        }
    })   
    
    
//add score function
    function addScore() {
        for (let i = 0; i< 199; i +=width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score +=10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

//gameover
    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            scoreDisplay.innerHTML = 'end'
            levelInterval = 111111515151
            alert('Game Over')
        }
    }

})