function start(){
    //Creates the bear
    bear = new Bear();

    //Initiates bees array
    bees = []

    restartGame()

    //adds event listener on keydown
    document.addEventListener("keydown", moveBear, false)
    //changes bear speed whenever the input changes
    document.getElementById("speed").addEventListener('input', setSpeed, false)
    //Create bees after start is called
    document.getElementById("startbtn").addEventListener("click", makeBees, false)
    //Add bee event listener
    document.getElementById("addbee").addEventListener("click", addBee, false)
    //Restart game listener
    document.getElementById("restart").addEventListener("click", restartGame, false)


}



function Bear(){
    //Initialises bear's data
    this.sBear = 10;
    this.htmlElement = document.getElementById("bear")
    this.id = this.htmlElement.id;
    this.x = this.htmlElement.offsetLeft;
    this.y = this.htmlElement.offsetTop;

    //changes the bear's coordinates
    this.move = function (xDir, yDir){
        this.x += this.sBear * xDir;
        this.y += this.sBear * yDir;
        this.fitBounds();
        this.display();
    }

    //changes the bear's coordinates
    this.display = function (){
        this.htmlElement.style.left = this.x + "px";
        this.htmlElement.style.top = this.y + "px";
        this.htmlElement.style.display = "absolute";
    }

    //resets the bears position if it comes out of bounds from the parent element
    this.fitBounds = function (){
        let parent = this.htmlElement.parentElement;
        let pHeight = parent.offsetHeight;
        let pWidth = parent.offsetWidth;
        let wOffset = this.htmlElement.offsetWidth;
        let hOffset = this.htmlElement.offsetHeight;

        //checks if left side has left the parent
        if (this.x < 0) this.x = 0;
        //checks if left side has right the parent
        if (this.x > pWidth - wOffset) this.x = pWidth - wOffset;
        //checks if top side has left the parent
        if (this.y < 0) this.y = 0;
        //checks if bottom side has left the parent
        if (this.y > pHeight - hOffset) this.y = pHeight - hOffset;
    }

}

function moveBear(e){
    //codes for the four keys
    const KEYUP = 38;
    const KEYDOWN = 40;
    const KEYLEFT = 37;
    const KEYRIGHT = 39;

    //checks if it was the bear's first move
    if (firstMove && (e.keyCode === KEYUP || e.keyCode === KEYDOWN || e.keyCode === KEYLEFT || e.keyCode === KEYRIGHT)){
        lastTimeStung = new Date();
        firstMove = false;
    }

    if(e.keyCode === KEYRIGHT){
        bear.move(1, 0)
    } //moves right
    if(e.keyCode === KEYLEFT){
        bear.move(-1, 0)
    } //moves left
    if(e.keyCode === KEYUP){
        bear.move(0, -1)
    } //moves up
    if(e.keyCode === KEYDOWN){
        bear.move(0, 1)
    } //moves down
}

function setSpeed(s){
    bear.sBear = s.target.value;
}

class Bee {
    constructor(beeNumber) {
        //html element corresponding to the IMG of the bee
        this.htmlElement = createBeeImg(beeNumber);
        //html id
        this.id = this.htmlElement.id;
        //x coord
        this.x = this.htmlElement.offsetLeft;
        //y coord
        this.y = this.htmlElement.offsetTop;

        this.move = function (dx, dy){
            this.x += dx;
            this.y += dy;
            this.display();
        }

        //changes the bear's coordinates
        this.display = function (){
            this.fitBounds()
            this.htmlElement.style.left = this.x + "px";
            this.htmlElement.style.top = this.y + "px";
            this.htmlElement.style.display = "absolute";
        }

        //resets the bears position if it comes out of bounds from the parent element
        this.fitBounds = function (){
            let parent = this.htmlElement.parentElement;
            let pHeight = parent.offsetHeight;
            let pWidth = parent.offsetWidth;
            let wOffset = this.htmlElement.offsetWidth;
            let hOffset = this.htmlElement.offsetHeight;

            //checks if left side has left the parent
            if (this.x < 0) this.x = 0;
            //checks if left side has right the parent
            if (this.x > pWidth - wOffset) this.x = pWidth - wOffset;
            //checks if top side has left the parent
            if (this.y < 0) this.y = 0;
            //checks if bottom side has left the parent
            if (this.y > pHeight - hOffset) this.y = pHeight - hOffset;
        }

    }
}

function createBeeImg(beeNum){
    //get data from board div
    let boardDiv = document.getElementById("board");
    let wBoard = boardDiv.offsetWidth;
    let hBoard = boardDiv.offsetHeight;
    let xBoard = boardDiv.offsetLeft;
    let yBoard = boardDiv.offsetTop;

    //create img element
    let img = document.createElement("img");
    img.setAttribute("src", "images/bee.gif")
    img.setAttribute("width", "15%")
    img.setAttribute("height", "30%")
    img.setAttribute("alt", "bruh")
    img.setAttribute("id", "bee" + beeNum)
    img.setAttribute("class", "bee")

    //add the img as a child to the board div
    img.style.position = "absolute"
    boardDiv.appendChild(img)

    //set initial position
    let x = getRandomInit(wBoard)
    let y = getRandomInit(hBoard)
    img.style.left = (xBoard + x) + "px";
    img.style.top = (y) + "px";

    return img;
}

function makeBees(){
    //get num of bees given by user
    let numBees = document.getElementById("bamount").value;
    //convert to number
    numBees = Number(numBees);
    //check if number
    if(isNaN(numBees)){
        window.alert("Invalid number of bees!");
        return;
    }

    //create the bees
    let i = 1;
    while (i <= numBees){
        var num = i;
        //Creates the bee object and gets the img
        var bee = new Bee(num);
        bee.display();
        //Add bee to array
        bees.push(bee)
        i++
    }
}

function addBee(){
    var bee = new Bee(bees.length + 1)
    bee.display()
    bees.push(bee)
}

function getRandomInit(max){
    return Math.round(max * Math.random())
}

function moveBees(){
    //get the speed
    let speed = document.getElementById("bspeed").value;

    //move each bee to random location depending on speed
    for (let i = 0; i < bees.length; i++){
        let dx = getRandomInit(speed * 2) - speed;
        let dy = getRandomInit( speed * 2) - speed;
        bees[i].move(dx, dy);
        isStung(bear, bees[i])
    }
}

//Update loop
function updateBees(){
    //move bees randomly
    moveBees();

    //get the update period
    let period = document.getElementById("refrate").value;

    //update timer for next move
    if(getScore() >= 1000){
        alert("Game Over!")
        restartGame()
    }else{
        updateTimer = setTimeout("updateBees()", period)
    }
}

function isStung(defender, offender){
    //Checks if it currently overlaps
    if(overlap(defender, offender)){
        let score = getScore()
        //increments the score if the defender gets hit
        score = Number(score) + 1;
        //outputs score
        stings.innerHTML = score;
        console.log(firstMove)
        if(!firstMove) calcDuration();
    }
}

//Gets the stung score
function getScore(){
    return score = stings.innerHTML;
}

function overlap(element1, element2) {
    //rectangle of the first element
    left1 = element1.htmlElement.offsetLeft;
    top1 = element1.htmlElement.offsetTop;
    right1 = element1.htmlElement.offsetLeft + element1.htmlElement.offsetWidth;
    bottom1 = element1.htmlElement.offsetTop + element1.htmlElement.offsetHeight;

    //rectangle of the second element
    left2 = element2.htmlElement.offsetLeft;
    top2 = element2.htmlElement.offsetTop;
    right2 = element2.htmlElement.offsetLeft + element2.htmlElement.offsetWidth;
    bottom2 = element2.htmlElement.offsetTop + element2.htmlElement.offsetHeight;

    //calculate the intersection of the two rectangles
    x_intersect = Math.max(0, Math.min(right1, right2) - Math.max(left1, left2));
    y_intersect = Math.max(0, Math.min(bottom1, bottom2) - Math.max(top1, top2));
    intersectArea = x_intersect * y_intersect;
    //if intersection is 0, no hit
    return !(intersectArea === 0 || isNaN(intersectArea));
}

function calcDuration(){
    let newStingTime = new Date();
    //Calculates the current duration between stings
    let currDuration = newStingTime - lastTimeStung;
    //Sets a new last time stung to the new stung
    lastTimeStung = newStingTime;
    let longestDuration = parseInt(duration.innerHTML);

    //Checks if the longest duration is currently either zero or smaller then the current duration
    if(longestDuration === 0) longestDuration = currDuration;
    else if (longestDuration < currDuration) longestDuration = currDuration;

    //Outputs the longest duration
    duration.innerHTML = longestDuration;
}

function reset(){
    //Clears the current timer
    clearTimeout(updateTimer)
    //Resets all data
    duration.innerHTML = 0;
    stings.innerHTML = 0;
    let element;
    //Deletes all bees
    for (let i = 0; i < bees.length; i++) {
        element = document.getElementById(bees[i].id)
        element.remove()
    }
    bees = []
    firstMove = true;
}

//Restarts the game
function restartGame(){
    reset()
    updateBees()
}


