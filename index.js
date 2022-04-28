const express = require('express');
//Bring the socket.io module
const app = express();
const PORT = 5050;
//Create a httpServer

const httpServer = app.listen(PORT);
const { Server} = require('socket.io');

//Create a new instance of Socket.io Server
const ioServer = new Server(httpServer);

const staticController = express.static('public-controller');
const staticDisplay = express.static('public-display');

app.use('/controller', staticController);
app.use('/display', staticDisplay);
app.use(express.json());

const { SerialPort, ReadlineParser } = require('serialport');

//Set the ioServer to listen to new connections
//Set the socket to listen to an event and the message from controller
//Broadcast the message to the display

let players = [];
let action = 0;

let characterMessage = {
    x: 48,
    y: 50,
};

app.post('/controller', (request, response) => {
    console.log(request.body);
   players.push(request.body);
    response.send({msn: 'Se envio tu usuario'});
   console.log('players', players);
});

ioServer.on('connection', (socket) => {
    console.log(`Connected`, socket.id);

   //Sends the player's moves
    socket.broadcast.emit('directions', characterMessage);
    //socket.broadcast.emit('action', action );

    socket.on('screens', (pantalla) => {
        console.log(pantalla)
        socket.broadcast.emit('screens', pantalla);
    });

   socket.on('screensController', (pantalla) => {
    console.log('controler', pantalla)
    socket.broadcast.emit('screensController', pantalla);
    });

    socket.on('damage', (eventMessage) => {
        console.log(eventMessage);
        port.write(eventMessage);
    });
});

//Opens up the port
const protocolConfiguration = {   
    path: '/dev/cu.usbserial-143230', 
    baudRate: 9600
}

const port = new SerialPort(protocolConfiguration);
const parser = port.pipe(new ReadlineParser());

parser.on('data', (data) => { 

    let dataArray = data.split(" ");  
    dataArray.splice(-1);
    console.log(dataArray);

    //Convert the array into numbers

    let dataArrayInt = dataArray.map(i =>
        parseInt(i)
    );
    // Parse the Strings to Integer (Cambio de color y tamaño)
    action = dataArrayInt[0];
    console.log(dataArrayInt, action);

    //Movimiento del personaje
    characterMessage.x = dataArrayInt[1];
    characterMessage.y = dataArrayInt[2];

    // Emit the message using WebSocket to the client
    ioServer.emit('directions', characterMessage);

    if(action == 1){
        //send make action
        console.log('Entro');
        ioServer.emit('action');
    }

   

});


