//Create the socket
let socket = io();

let player = {
    name: '',
    lastname: '',
    email: ''
};

let character = {
    x: 0,
    y: 0,
};


let screenPlayer;
let imgFondo0;
let imgFondo1;
let imgFondo2;
let imgFondo3;
let imgFondo4;
let imgFondo5;
let imgFondo6;
let imgArrows;

//Botones
let opacity;
let overButon = false;
let r;
let g;
let b;

let nameInput;
let lastnameInput;
let emailInput;
let buttonPetition = false;

let canvas;


function preload() {
    //Imagenes de fondo
    
   
    imgFondo4 = loadImage("data/fondo4.png");
    imgFondo5 = loadImage("data/fondo5.png");
    
}



function setup() {
    frameRate(16);
    canvas = createCanvas(390, 844);
    screenPlayer = 0;
    opacity = 255;
    r = 33;
    g = 228;
    b = 48;
    lifeCount = 60;

    nameInput = createInput('');
    nameInput.position(34.36, 306.77);
    nameInput.size(325, 54);
    nameInput.input(myInputEventName);

    lastnameInput = createInput('');
    lastnameInput.position(34.36, 411.1);
    lastnameInput.size(325, 54);
    lastnameInput.input(myInputEventNameLastName);

    emailInput = createInput('');
    emailInput.position(34.36, 515.43);
    emailInput.size(325, 54);
    emailInput.input(myInputEmailName);
}

function windowResized() {
    canvas = resizeCanvas(windowWidth, windowHeight);
}



function draw() {
    background(0);


    switch (screenPlayer) {

        case 0: //Sign up petition 
            image(imgFondo4, 0, 0);

            //Sign petition button
            noStroke();
            fill(r, g, b);
            rect(36.72, 710.42, 322.28, 42.31, 10);
            fill(0);
            textFont('Poppins');
            textSize(16);
            text('Sign petition', 149.09, 737);

            nameInput.style('display', 'block');
            lastnameInput.style('display', 'block');
            emailInput.style('display', 'block');
            break;

        case 1:
            //Check signed (Email confirmation)
            image(imgFondo5, 0, 0);
            nameInput.style('display', 'none');
            lastnameInput.style('display', 'none');
            emailInput.style('display', 'none');
            break;

    }
}

function changeScreen(screenNumber) {
    socket.emit('screens', screenNumber);
}

function sendData() { //REVISAR ESTO
    sendPlayer(player);
}

function myInputEventName() { //REVISAR ESTO
    player.name = this.value();
}

function myInputEventNameLastName() { //REVISAR ESTO
    player.lastname = this.value();
}

function myInputEmailName() { //REVISAR ESTO
    player.email = this.value();
}


function mousePressed() {

    switch (screenPlayer) {

        case 0: //Sign petition
            if (mouseX > 48.72 && mouseX < 364.59 &&
                mouseY > 710.42 && mouseY < 752.76) {
                console.log('Sign petition presionado');
                screenPlayer = 1;
                changeScreen(0);
                sendData();
            }
            break;

        case 1: //Thanks
            break;

    }
}

socket.on('screensController', (pantalla) => { //CAMBIAR, EL QR SE CONVIERTE EN EL BOTON

    switch (pantalla) {
        case 0:
            screenPlayer = 2;
            console.log('Pantalla', screenPlayer);
            break;

    }
});

async function sendPlayer(player) {
    let bodyJSON = JSON.stringify(player);
    const putRequest = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: bodyJSON
    }
    const request = await fetch(`http://localhost:5050/controller`, putRequest);
    const requestJson = await request.json();
    console.log(bodyJSON);

}