/* ------------- Physics Simulator Logic ---------- */

let velocity = [];
let launchAngle = [];
let gravity = [];
let airResistance = [];
let ballColors = [];

let x = [];
let y = [];
let vx = [];
let vy = [];

let minVelocity = document.getElementById("minVelo");
let maxVelocity = document.getElementById("maxVelo");
let minLaunchAngle = document.getElementById("minLaunch");
let maxLaunchAngle = document.getElementById("maxLaunch");
let minGravity = document.getElementById("minGrav");
let maxGravity = document.getElementById("maxGrav");
let minAirResistance = document.getElementById("minAir"); 
let maxAirResistance = document.getElementById("maxAir"); 
let xPos = document.getElementById("xPos");
let yPos = document.getElementById("yPos");
let numBallS = document.getElementById("numBalls");
let ballSize = document.getElementById("ballSize");

let xPosVal = document.getElementById("xPosition");
let yPosVal = document.getElementById("yPosition");
let minVelVal = document.getElementById("minVelVal");
let maxVelVal = document.getElementById("maxVelVal");
let minLaunchVal = document.getElementById("minLaunchVal");
let maxLaunchVal = document.getElementById("maxLaunchVal");
let minGravVal = document.getElementById("minGravVal");
let maxGravVal = document.getElementById("maxGravVal");
let minAirVal = document.getElementById("minAirVal");
let maxAirVal = document.getElementById("maxAirVal");
let numBallsVal = document.getElementById("numBallsVal");
let ballSizeVal = document.getElementById("ballSizeVal");

let velMin = document.getElementById("velMin");
let velMax = document.getElementById("velMax");
let gravMin = document.getElementById("gravMin");
let gravMax = document.getElementById("gravMax");
let dragMin  = document.getElementById("dragMin");
let dragMax  = document.getElementById("dragMax");
let ballMax = document.getElementById("maxBalls");

let canvas = document.getElementById("simulationCanvas");

minVelocity.addEventListener("input", checkValues);
maxVelocity.addEventListener("input", checkValues);
minLaunchAngle.addEventListener("input", checkValues);
maxLaunchAngle.addEventListener("input", checkValues);
minGravity.addEventListener("input", checkValues);
maxGravity.addEventListener("input", checkValues);
minAirResistance.addEventListener("input", checkValues);
maxAirResistance.addEventListener("input", checkValues);
xPos.addEventListener("input", checkValues);
yPos.addEventListener("input", checkValues);
numBallS.addEventListener("input", checkValues);
ballSize.addEventListener("input", checkValues);

xPosVal.addEventListener("input", checkRange);
yPosVal.addEventListener("input", checkRange);
minVelVal.addEventListener("input", checkRange);
maxVelVal.addEventListener("input", checkRange);
minLaunchVal.addEventListener("input", checkRange);
maxLaunchVal.addEventListener("input", checkRange);
minGravVal.addEventListener("input", checkRange);
maxGravVal.addEventListener("input", checkRange);
minAirVal.addEventListener("input", checkRange);
maxAirVal.addEventListener("input", checkRange);
numBallsVal.addEventListener("input", checkRange);
ballSizeVal.addEventListener("input", checkRange);

velMin.addEventListener("input", sliderRange);
velMax.addEventListener("input", sliderRange);
gravMin.addEventListener("input", sliderRange);
gravMax.addEventListener("input", sliderRange);
dragMin.addEventListener("input", sliderRange);
dragMax.addEventListener("input", sliderRange);
ballMax.addEventListener("input", sliderRange);

let animationID;
// structure object from w3schools
let simulator = {
    minVelocity: 50,
    maxVelocity: 100,
    minLaunchAngle: 30,
    maxLaunchAngle: 60,
    minGravity: 9.8,
    maxGravity: 9.8,
    minAirResistance: 0,  
    maxAirResistance: 0.01,
    xPos: 300,
    yPos: 400,
    numBalls: 50,
    ballSize: 5
};
// colors list from w3schools
let color = ["red", "blue", "green", "orange", "purple", "cyan", "magenta", "yellow", "lime", "pink", "teal", "lavender", "brown", "beige", "maroon", "navy", "olive", "coral", "turquoise", "silver",
    "gold", "salmon", "plum", "orchid", "ivory", "khaki", "crimson", "indigo", "violet", "azure", "emerald",
    "amber", "cerulean", "fuchsia", "jade", "saffron", "sepia", "tan", "umber", "vermilion", "wisteria",
    "zucchini", "cobalt", "denim", "ecru", "flax", "garnet", "harlequin", "isabelline", "jasmine", "lilac"];

// function to check if the slider range textboxes have valid input, if yes then update slider values and restart simulation
function sliderRange(){
	let velMini = parseFloat(velMin.value);
	let velMaxi = parseFloat(velMax.value);
	let gravMini = parseFloat(gravMin.value);
	let gravMaxi = parseFloat(gravMax.value);
	let dragMini = parseFloat(dragMin.value);
	let dragMaxi = parseFloat(dragMax.value);
	let ballMaxi = parseFloat(ballMax.value);
	
	if (velMini > velMaxi){
		showError(2);
	}
	else if (velMini > velMaxi){
		showError(2);
	}
	else if (dragMini > dragMaxi){
		showError(2);
	}
	else if (ballMaxi < 1){
		showError(3);
	}
	else{
		updateSlider();
		updateParameters();
		cancelAnimationFrame(animationID);
		simulate();
	}
}

// function to change the min and max of sliders based on the text box input
function updateSlider(){
	let updateMinVel = velMin.value;
	let updateMaxVel = velMax.value;
	let updateMinGrav = gravMin.value;
	let updateMaxGrav = gravMax.value;
	let updateMinDrag = dragMin.value;
	let updateMaxDrag = dragMax.value;
	let updateBallCount = ballMax.value;
	
	minVelocity.min = updateMinVel;
	minVelocity.max = updateMaxVel;
	maxVelocity.min = updateMinVel;
	maxVelocity.max = updateMaxVel;
	minGravity.min = updateMinGrav;
	minGravity.max = updateMaxGrav;
	maxGravity.min = updateMinGrav;
	maxGravity.max = updateMaxGrav;
	minAirResistance.min = updateMinDrag;
	minAirResistance.max = updateMaxDrag;
	maxAirResistance.min = updateMinDrag;
	maxAirResistance.max = updateMaxDrag;
	numBallS.max = updateBallCount;
	changeValues();
}

// called when the randomize button is pressed, min and max range of randomize is hardcoded
function randomize(){
    let xPosition = Math.floor(Math.random() * (canvas.width + 1));
    let yPosition = Math.floor(Math.random() * (canvas.height + 1));
    
    let v1 = Math.floor(Math.random() * 100); 
    let v2 = Math.floor(Math.random() * 100);
    let minVel = Math.min(v1, v2);
    let maxVel = Math.max(v1, v2);

    let l1 = Math.floor(Math.random() * 360);
    let l2 = Math.floor(Math.random() * 360);
    let minLaunch = Math.min(l1, l2);
    let maxLaunch = Math.max(l1, l2);
    
    let g1 = (Math.random() * 19.6) - 9.8;
    let g2 = (Math.random() * 19.6) - 9.8;
    let minGrav = Math.min(g1, g2);
    let maxGrav = Math.max(g1, g2);

    let a1 = Math.random() * 0.1;
    let a2 = Math.random() * 0.1;
    let minAir = Math.min(a1, a2);
    let maxAir = Math.max(a1, a2);

    let numBalls = Math.floor(Math.random() * 100) + 1;
    let ballSizeRandom = Math.floor(Math.random() * 20) + 1;

    ballSize.value = ballSizeRandom;
    xPos.value = xPosition;
    yPos.value = yPosition;
    minVelocity.value = minVel;
    maxVelocity.value = maxVel;
    minLaunchAngle.value = minLaunch;
    maxLaunchAngle.value = maxLaunch;
    minGravity.value = minGrav.toFixed(1);
    maxGravity.value = maxGrav.toFixed(1);
    minAirResistance.value = minAir.toFixed(3);
    maxAirResistance.value = maxAir.toFixed(3);
    numBallS.value = numBalls;
    
    changeValues(); 
    updateParameters();
    cancelAnimationFrame(animationID);
    simulate();
}

// update slider value based on the number input through textbox
function checkRange(){
    xPos.value = parseFloat(xPosVal.value);
    yPos.value = parseFloat(yPosVal.value);
    minVelocity.value = parseFloat(minVelVal.value);
    maxVelocity.value = parseFloat(maxVelVal.value);
    minLaunchAngle.value = parseFloat(minLaunchVal.value);
    maxLaunchAngle.value = parseFloat(maxLaunchVal.value);
    minGravity.value = parseFloat(minGravVal.value);
    maxGravity.value = parseFloat(maxGravVal.value);
    minAirResistance.value = parseFloat(minAirVal.value);
    maxAirResistance.value = parseFloat(maxAirVal.value);
    numBallS.value = parseFloat(numBallsVal.value);
    ballSize.value = parseFloat(ballSizeVal.value);
    checkValues();
}

// check if the slider values are in range; min < max, if not call showError with the error 'tag', if values range is valid then update simulation
function checkValues() {
    let minVelo = parseFloat(minVelocity.value);
    let maxVelo = parseFloat(maxVelocity.value);
    let minLaunch = parseFloat(minLaunchAngle.value);
    let maxLaunch = parseFloat(maxLaunchAngle.value);
    let minGrav = parseFloat(minGravity.value);
    let maxGrav = parseFloat(maxGravity.value);
    let minAir = parseFloat(minAirResistance.value);
    let maxAir = parseFloat(maxAirResistance.value);

    changeValues();

    if (minVelo > maxVelo){
        showError(1);
    }
    else if (minLaunch > maxLaunch){
        showError(1);
    }
    else if (minGrav > maxGrav){
        showError(1);
    }
    else if (minAir > maxAir){
        showError(1);
    }
    else{
        updateParameters();
        cancelAnimationFrame(animationID);
        simulate();
    }
}

// update textbox value to slider value
function changeValues() {
    xPosVal.value = xPos.value;
    yPosVal.value = yPos.value;
    minVelVal.value = minVelocity.value;
    maxVelVal.value = maxVelocity.value;
    minLaunchVal.value = minLaunchAngle.value;
    maxLaunchVal.value = maxLaunchAngle.value;
    minGravVal.value = minGravity.value;
    maxGravVal.value = maxGravity.value;
    minAirVal.value = minAirResistance.value;
    maxAirVal.value = maxAirResistance.value;
    numBallsVal.value = numBallS.value;
    ballSizeVal.value = ballSize.value;
}

// function to show errors; errorId tells the function what error message to show
function showError(errorId){
    cancelAnimationFrame(animationID);
    let ctx = canvas.getContext("2d");
    
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '20px Arial';
    ctx.fillStyle = 'red'; 
    ctx.textAlign = 'center';
	if (errorId == 1){
		ctx.fillText('Invalid Range: Min cannot be greater than Max!', canvas.width/2, canvas.height/2);
	}
	else if (errorId == 2){
		ctx.fillText('Invalid Range: Slider Min cannot be greater than Slider Max', canvas.width/2, canvas.height/2);
	}
	else if (errorId == 3){
		ctx.fillText('Invalid Entry: Number of balls cannot be less than 1', canvas.width/2, canvas.height/2);
	}
	else if (errorId == 4){
		ctx.fillText('Invalid Entry: Size of balls cannot be less than 1', canvas.width/2, canvas.height/2);
	}
}

// update the simulation structure's value
function updateParameters() {
    simulator.minVelocity = parseFloat(minVelocity.value);
    simulator.maxVelocity = parseFloat(maxVelocity.value);
    simulator.minLaunchAngle = parseFloat(minLaunchAngle.value);
    simulator.maxLaunchAngle = parseFloat(maxLaunchAngle.value);
    simulator.minGravity = parseFloat(minGravity.value);
    simulator.maxGravity = parseFloat(maxGravity.value);
    simulator.minAirResistance = parseFloat(minAirResistance.value);
    simulator.maxAirResistance = parseFloat(maxAirResistance.value);
    simulator.numBalls = parseFloat(numBallS.value);
    simulator.ballSize = parseFloat(ballSize.value);
    updateArray();
}

// initialize each ball's properties; random values are chosen going from min to max, inclusive 
function updateArray() {
    for (let i = 0; i < simulator.numBalls; i++) {
        velocity[i] = Math.random() * (simulator.maxVelocity - simulator.minVelocity) + simulator.minVelocity;
        launchAngle[i] = Math.random() * (simulator.maxLaunchAngle - simulator.minLaunchAngle) + simulator.minLaunchAngle;
        gravity[i] = Math.random() * (simulator.maxGravity - simulator.minGravity) + simulator.minGravity;
        airResistance[i] = Math.random() * (simulator.maxAirResistance - simulator.minAirResistance) + simulator.minAirResistance;
        ballColors[i] = color[i % color.length];
    }
    initalSetup();
}

// set position and starting x and y velocity
// x and y velocity is calculated based on velocity and launch angle
function initalSetup() {

    for (let i = 0; i < simulator.numBalls; i++) {
        x[i] = simulator.xPos = parseFloat(xPos.value);
        y[i] = simulator.yPos = parseFloat(yPos.value);
        vx[i] = -velocity[i] * Math.cos(launchAngle[i] * Math.PI / 180);
        vy[i] = -velocity[i] * Math.sin(launchAngle[i] * Math.PI / 180);
    }
}

// t=function for animation, for loop updates each balls position based on velocity and accereration. requestAnimationFrame allows animation at browsers frame per second rate
function simulate() {
    let ctx = canvas.getContext("2d");
    
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < simulator.numBalls; i++) {
        vx[i] *= (1 - airResistance[i]);
        vy[i] *= (1 - airResistance[i]); 
        
        x[i] += vx[i];
        y[i] += vy[i];
        vy[i] -= gravity[i] * 0.1;

        if (x[i] > canvas.width || x[i] < 0 || y[i] > canvas.height || y[i] < 0) {
            resetBall(i, canvas);
            
        }
        
        ctx.fillStyle = ballColors[i];
        ctx.beginPath();                
        ctx.arc(x[i], y[i], simulator.ballSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
    animationID = requestAnimationFrame(simulate);
}

// called when a ball is out of the screen, the new vall is assigned new random properties
function resetBall(i, canvas) {
    velocity[i] = Math.random() * (simulator.maxVelocity - simulator.minVelocity) + simulator.minVelocity;
    launchAngle[i] = Math.random() * (simulator.maxLaunchAngle - simulator.minLaunchAngle) + simulator.minLaunchAngle;
    gravity[i] = Math.random() * (simulator.maxGravity - simulator.minGravity) + simulator.minGravity;
    airResistance[i] = Math.random() * (simulator.maxAirResistance - simulator.minAirResistance) + simulator.minAirResistance;
    ballColors[i] = color[Math.floor(Math.random() * color.length)];

    x[i] = simulator.xPos = parseFloat(xPos.value);
    y[i] = simulator.yPos = parseFloat(yPos.value);
    vx[i] = -velocity[i] * Math.cos(launchAngle[i] * Math.PI / 180);
    vy[i] = -velocity[i] * Math.sin(launchAngle[i] * Math.PI / 180);
}

function pauseplay(){
    if(animationID)
    {
        cancelAnimationFrame(animationID);
        animationID = null;
    }
    else{
        animationID = requestAnimationFrame(simulate);
    }
   

}



let themes = ['theme1', 'theme2','theme3'];
let themeidx = 2;
function changetheme(){
    document.body.classList.remove(themes[themeidx]);
    themeidx += 1;
    if (themeidx >= 3){
        themeidx = 0;
    }
    document.body.classList.add(themes[themeidx]);

}

// called to start simulation
updateArray();
checkValues();
