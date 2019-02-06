const express = require('express');
const handlebars = require('express-handlebars'); 

const app = express();

app.use('/static' , express.static('public'));

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/skapaobjekt', (request, response) => {
    response.render('skapaobjekt')
    });

app.get('/loggin', (request, response) => {
    response.render('loggin')
    });

app.get('/registrera', (request, response) => {
response.render('registrera')
});

app.get('/', (request, response) => {
    response.render('home');
});

app.get('/sida2', (request, response) => {
    response.render('second');
});

app.listen(1111, () => console.log('application running on port 1111'));