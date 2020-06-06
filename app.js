document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const highScoreDisplay = document.querySelector('#hi-score')
    const levelDisplay = document.querySelector('#level')
    const startBtn = document.querySelector('#start-btn')
    const restartBtn = document. querySelector('#restart-btn')
    const width = 10
    let nextRandom = 0
    let TimerId = 0
    var levelInterval = 500
    let score = 0
    let highScore = 0
    let level = 0
    let nextlevel = 1
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]
    const myMusic = new sound("src/music.mp3");
    const rotateSound = new sound("src/rotate.mp3");
    const rowSound = new sound("src/row_eliminated.mp3");
    const takenSound = new sound("src/taken.mp3");
    var i = 1;

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
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }
// undraw
    function undraw() {
        current.forEach(index =>{
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

// movedown
    timerId = setInterval(moveDown, levelInterval*100000)

    function moveDown() {
        undraw()
        currentPosition = currentPosition + width
        draw()
        freeze()
        console.log(levelInterval)
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
            takenSound.play()
            createLevel()
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
        rotateSound.play()
    }

//next tetromino on minigrid
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0

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
            square.style.backgroundColor = ''
        })

        upNextTetrominoes[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

//start button
    startBtn.addEventListener('click', () => {
        if (timerId){
            clearInterval(timerId)
            timerId = null
            myMusic.stop()
        } else{
            draw()
            timerId= setInterval(moveDown, levelInterval)
            nextRandom = Math.floor(Math.random()*theTetrominos.length)
            displayShape()
            myMusic.play()

        }
    })   
    
    
//add score function
    function addScore() {
        for (let i = 0; i< 199; i +=width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score +=10
                rowSound.play()
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
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
            if(score > highScore){
                highScore = score
                highScoreDisplay.innerHTML = highScore
            }
        i = 2

        }
    }


//function sound
    function sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function(){
        this.sound.play();
        }
        this.stop = function(){
        this.sound.pause();
        }
    }

//making levels
    function createLevel() {
        if(score >= 10){
            level = 1
            timerId= setInterval(moveDown, 500)
 }
        if (score >= 30){
            level = 2
            nextlevel = 2
            clearInterval(timerId)
            timerId = null
            timerId= setInterval(moveDown, 400)
  }
        if (score >= 50){
            level = 3
            nextlevel = 3
            timerId= setInterval(moveDown, 300)
}
        if (score >= 120){
            timerId= setInterval(moveDown, 200)
        }
    
        levelDisplay.innerHTML = level
    
    }

//increase level
function increaseLevel() {
        levelInterval -= 100
    }

//função restart
    restartBtn.addEventListener('click', () => {
        if(i == 2){
        score = 0
        let currentPosition = 4
        let currentRotation = 0
        let squares = Array.from(document.querySelectorAll('.grid div'))
        }
    })
})