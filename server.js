const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
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

app.use(express.static(__dirname + '/public'));//Middleware


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





app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});