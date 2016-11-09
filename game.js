var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//ball
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var ballRadius = 10;

//paddle
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth)/2;

//blocks
var blockRowCount = 3;
var blockColumnCount = 5;
var blockWidth = 75;
var blockHeight = 20;
var blockPadding = 10;
var blockOffsetTop = 30;
var blockOffsetLeft = 30;
var blocks = [];
for(var c=0; c<blockColumnCount; c++){
    blocks[c] = [];
    for(var r=0; r<blockRowCount; r++){
        blocks[c][r] = {x: 0, y: 0, status: 1 };
    }
}

var score = 0;

//control
var rightPressed = false;
var leftPressed = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e){
    if(e.keyCode == 39){
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e){
    if(e.keyCode == 39){
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

function mouseMoveHandler(e){
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width){
        paddleX = relativeX - paddleWidth/2;
    }
}



function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBlocks() {
    for (c = 0; c < blockColumnCount; c++) {
        for (r = 0; r < blockRowCount; r++) {
            if(blocks[c][r].status == 1) {
                var blockX = (c * (blockWidth + blockPadding)) + blockOffsetLeft;
                var blockY = (r * (blockHeight + blockPadding)) + blockOffsetTop;
                blocks[c][r].x = blockX;
                blocks[c][r].y = blockY;
                ctx.beginPath();
                ctx.rect(blockX, blockY, blockWidth, blockHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection(){
    for(c=0; c<blockColumnCount; c++){
        for(r=0; r<blockRowCount; r++){
            var b = blocks[c][r];
            if(b.status == 1) {
                if (x > b.x && x < b.x + blockWidth && y > b.y && y < b.y + blockHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == blockColumnCount*blockRowCount){
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBlocks();
    //ball
    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    } else if(y + dy > canvas.height - ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth){
            dy = -dy*1.1;
            dx = (x-paddleX) * 8 / paddleWidth - 4;
        } else {
            alert('GAME OVER');
            document.location.reload();
        }
    }

    y += dy;
    x += dx;
    drawBall();

    //paddle
    if(rightPressed && paddleX < canvas.width-paddleWidth){
        paddleX += 7
    }
    if(leftPressed && paddleX > 0){
        paddleX -= 7
    }
    collisionDetection();
    drawPaddle();
    drawScore();

    requestAnimationFrame(draw);
}

draw();