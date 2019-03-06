const express = require('express');
const handlebars = require('express-handlebars'); 
const bodyParser = require('body-parser'); 
const app = express();
const connect = require('./models/connect');
app.use(bodyParser.urlencoded());

app.use('/static' , express.static('public'));

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.post('/portfolio/create', async (request, response) => {
    console.log('body', request.body)
    const skapaobjekt = {
        bildnamn: request.body.bild,
        länknamn: request.body.länk,
    }; 


    const db = await connect();
    const collection = db.collection('registrera');
    await collection.insertOne(registrera);
    response.sendstatus(204); 
    });

    app.get('/registrera', (request, response) => {
        response.render('registrera', {layout: "cp"});
        });

        app.post('/portfolio/registrera', async (request, response) => {
            const registrera = {
                förnamn: request.body.fnamn,
                efternamn: request.body.enamn,
                epostadress: request.body.epost ,
            }; 
    
        const db = await connect();
        const collection = db.collection('användare');
        await collection.insertOne(registrera);
        response.sendstatus(204); 
        }); 

app.get('/controlpanel/skapaobjekt', (request, response) => {
    response.render('skapaobjekt', {layout: "cp"});
    });

app.get('/controlpanel/loggin', (request, response) => {
    response.render('loggin', {layout: "cp"});
    });


app.get('/', (request, response) => {
    response.render('home');
});

app.get('/controlpanel/admin', (request, response) => {
    response.render('admin' , {layout: "cp"});
});

app.get('/ommig', (request, response) => {
    response.render('ommig');
});

app.get('/controlpanel', (request, response) => {
    response.render('controlpanel', {layout: "cp"});
});




app.listen(1111, () => console.log('application running on port 1111'));