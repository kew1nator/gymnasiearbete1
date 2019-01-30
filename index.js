const express = require('express');
const handlebars = require('express-handlebars'); 

const app = express();

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', (request, response) => {
    response.render('home');
});

app.get('/', (request, response) => {
    response.render('second');
});

app.listen(1111, () => console.log('application running on port 1111'));