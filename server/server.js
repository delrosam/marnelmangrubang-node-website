const path = require('path');
const http = require('http');
const https = require('https');
const request = require('request');
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const socketIO = require('socket.io');
const {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const partialPath = path.join(__dirname, '../views/partials');
const modPath = path.join(__dirname, '../views/widgets');
// const imagePath = path.join(__dirname, '../public/img');


const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);


hbs.registerPartials(partialPath);
hbs.registerPartials(modPath);


app.set('view engine', 'hbs');

app.use((req, res, next) => {//Middleware
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    // Appends to line, if file doesnt exist, it will create it.
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err){
            console.log('Unable to append to server.log');
        }
    });
    next();
});

//Uncomment if you want the site to be down for maintenance
// app.use((req, res, next) => {//Middleware
//     res.render('maintenance.hbs');
// });

app.use(express.static(publicPath));//Middleware


hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});


app.get('/', (request, response) => {
    response.render('home.hbs', {
        pageTitle: "Marnel",
        message: "Welcome to Marnel's Node.js website!"
    });
});


app.get('/contact', (request, response) => {
    response.render('contact.hbs', {
        pageTitle: "Contact"
    });
});


app.get('/about', (request, response) => {
    response.render('about.hbs', {
        pageTitle: "About"
    });
});

app.get('/cards', (request, response) => {
    response.render('cards.hbs', {
        pageTitle: "Card Widgets"
    });
});






app.get('/data', (request, response) => {
    response.send([
        {
            name: "Marnel",
            age: 29,
            likes: [
                "Longboarding",
                "Traveling",
                "Gaming",
                "Movies"
            ]
        },{
            name: "Chelsie",
            age: 28,
            likes: [
                "Puppies",
                "Reading",
                "Traveling",
                "Movies"
            ]   
        },{
            name: "Lexi",
            age: 2,
            likes: [
                "Barking",
                "Playing",
                "Eating",
                "Sleeping",
                "Fetching"
            ]
        }]);
});

app.get('/bad', (request, response) => {
    response.send({
        errorMessage: "Unable to handle request."
    });
});



// https.get('https://sitecore-cd-test-site-westus.azurewebsites.net/api/v1/SmokeTest/GetAllBaseItems?templateGiud=E59AEBB8-B654-40A9-991F-4D4BA4FEA2FB', (res) => {
//   console.log('statusCode:', res.statusCode);
//   console.log('headers:', res.headers);

//   res.on('data', (d) => {
//     process.stdout.write(d);
//     //console.log(d);
//   });

// }).on('error', (e) => {
//   console.error(e);
// });


// request.get({
//     url:'https://www.alaskaair.com/api/v1/AirportsLite/GetAllAirportsLite',
//     //url: 'https://sitecore-cd-test-site-westus.azurewebsites.net/api/v1/SmokeTest/GetAllBaseItems?templateGiud=E59AEBB8-B654-40A9-991F-4D4BA4FEA2FB',
//     json: true
// }, (error, response, body) => {

//     var bodyString = JSON.stringify(body, undefined, 2);

//     console.log(bodyString);



// });





//Socket IO
io.on('connection', (socket) =>{
    console.log('New user connected.');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);

        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is from the server.');

        // socket.broadcast.emit('newMessage', {
        //         from: message.from,
        //         text: message.text,
        //         createdAt: new Date().getTime()
        // });

    });



    socket.on('disconnect', () => {
        console.log('User was disconnected.');
    });



});





server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});