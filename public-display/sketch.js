//Create the socket
let socket = io();
let screenDisplay;

//Turtle
let lifeCount;
let imgLife;
let imgTurtle;
let imgRedTurtle;

//Obstaculos
let obstacles = [];
let imgObstaculo1;
let imgObstaculo2;
let imgObstaculo3;
let imgObstaculo4;
let imgObstaculo5;


//Imagenes pantallas
let imgInstrucciones;
let imgGanar;
let imgPerder;
let imgThanks;
let imgPrize;
let imgJuego;
let imgFondo0;

// 1 normal y 0 inmune
let character = {
    x: 0,
    y: 0,
    lifes: 3,
    state: 1

};
let speed = 1;
let action = 0;
let moveStateX = '';
let moveStateY = '';
let checkSound;
let principalSound;

function preload() {
    //Imagenes de fondo
    imgFondo0 = loadImage("data/fondo0.gif");
    imgInstrucciones = loadImage("data/instrucciones.png");
    imgGanar = loadImage("data/Ganar.png");
    imgPerder = loadImage("data/Perder.png");
    imgThanks = loadImage("data/Thanks.png");
    imgPrize = loadImage("data/Prize.png");
    imgJuego = loadImage("data/Juego.png");

    //Turtle
    imgTurtle = loadImage("data/turtle.gif");
    imgLife = loadImage("data/life.png");
    imgRedTurtle = loadImage("data/TurtleRed.png");

    //Obstaculos
    imgObstaculo1 = loadImage("data/Obstaculo1.png");
    imgObstaculo2 = loadImage("data/Obstaculo2.png");
    imgObstaculo3 = loadImage("data/Obstaculo3.png");
    imgObstaculo4 = loadImage("data/Obstaculo4.png");
    imgObstaculo5 = loadImage("data/Obstaculo4.png");
    
    
    //Sonidos
    soundFormats('mp3', 'ogg', 'wav');
    checkSound = loadSound('data/checkSound.wav');
    principalSound = loadSound('data/principalSound.wav');

}

function setup() {
    screenDisplay = 0;
  //  frameRate(60);
    createCanvas(600, 766);
    character.x = 307,04;
    character.y = 690;
    lifeCount = 60;

    //Enemigos
     obstacles.push(new Obstacle (imgObstaculo1,  73.77, 203.24));
     obstacles.push(new Obstacle (imgObstaculo2, 531.39, 312.24));
     obstacles.push(new Obstacle (imgObstaculo3, 73.77, 421.24));
     obstacles.push( new Obstacle (imgObstaculo4, 531.39, 530.24));
     obstacles.push(new Obstacle   (imgObstaculo1, 73.7, 639.24));   

     console.log(checkSound);
  
     }
    
function draw() {
    background(0);

    if (lifeCount > 0) {
        lifeCount--;
    }else{
       character.state = 1;
    }

   
    switch (screenDisplay) {


        case 0: //QR screen
           principalSound.play();
            image(imgFondo0, 0,0);
            break;

        case 1: //How to play 
           
            image(imgInstrucciones, 0, 0);
            
            break;

        case 2: //Game screen
            image(imgJuego, 600/2, 766/2);
            fill(255);
            noStroke();
            imageMode(CENTER);

            image(imgTurtle, character.x, character.y);

            impact();

            showLifes();

            for (let i = 0; i < obstacles.length; i++) {
                obstacles[i].paint();
               obstacles[i].move();
              }
              hits('damage', 'd1');  //REVISAR ESTO---------

            switch(moveStateX){
                case 'RIGHT':
                    character.x += speed;
                    break;
                case 'LEFT':
                    character.x -= speed;
                    break;
                default:
                    break;
            }

            switch(moveStateY){
                
                case 'UP':
                     character.y += speed;
                    break;
                case 'DOWN':
                    character.y -= speed;
                    break;
                default: 
                    break;
            }

            console.log(character.x, character.y);
                
            //Limites
            if (character.y >= 766) {
                character.y = 766;
            }

            if (character.x < 0) {
                character.x = 0;
            }

            if (character.x > 600) {
                character.x = 600;
            }

            //Superficie
            if (character.y <= 0) {
                screenDisplay = 3;
            }
            break;

        case 3: //Winner screen (QR)
            image(imgGanar,600/2, 766/2);
            break;

        case 4: //Game over screen (QR)
            image(imgPerder, 600/2, 766/2);
            break;

        case 5: //Thanks - no sign
            image(imgThanks, 600/2, 766/2);
            console.log('Gracias, no quieres firmar');
            break;

        case 6: //Claim prize
            image(imgPrize, 600/2, 766/2);
            console.log('Claim prize');
            break;
        }
    }


function paintObstacles(refImage){
   image(refImage, x, y);
   
}

function impact (){
    if(character.state == 0 && frameCount % 15){
        
    image(imgRedTurtle, character.x, character.y);
    
    console.log('impacto');
}
}

function hits(event, eventMessage) {

    for (let i = 0; i < obstacles.length; i++) {
        const element = obstacles[i];
        let obstacleX = element.getX();
        let obstacleY = element.getY();
        if ((dist(character.x, character.y, obstacleX, obstacleY) < 67) && lifeCount == 0) {
            
    
            if(character.state != 0){
                character.lifes = character.lifes - 1;
                
            }
            character.state = 0;
            lifeCount = 120;
            console.log('Impacto');
            socket.emit(event,eventMessage); 
           // impact();


            if (character.lifes === 0) {
                screenDisplay = 4;
            }
        }
    }
}

function showLifes() {

    for (let i = 0; i < character.lifes; i++) {
        image(imgLife, 27.05 + (i * 35),103);
    }
}

function changeScreen(screenNumber) { //revisar esto
    socket.emit('screensController', screenNumber);
}

//REVISAR ESTO
socket.on('screens', (pantalla) => {

    switch (pantalla) {
        case 0:
            screenDisplay = 6;
            break;
    }
})

socket.on('action', () => { //REVISAR ESTO

    console.log('HOLA');
   
    switch (screenDisplay){
        case 0:
            principalSound.stop();
            screenDisplay = 1;
            checkSound.play();
          
            break;
        case 1:
            checkSound.play();
            screenDisplay = 2;
           
            break;
        case 2:
            break;
        case 3:
            checkSound.play();
            screenDisplay = 5;
         
            break;

        case 4:
            checkSound.play();
           screenDisplay = 5;
         
        break;
    }
   
});

socket.on('directions', (positions) => { // REVISAR ESTO 


    if(positions.x > 60 ){
        moveStateX = 'RIGHT'
      
    };
    if(positions.x < 40 ){
        moveStateX = 'LEFT'
       
    };
    if(positions.x > 40 && positions.x < 60){
        moveStateX = '';
    };
    if(positions.y > 60 ){
        moveStateY = 'UP'
      
    };
    if(positions.y < 40 ){
        moveStateY = 'DOWN'
       
    };
    if(positions.y > 40 && positions.y < 60){
        moveStateY = '';
    };
    

});

