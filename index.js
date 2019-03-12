const express = require('express');
const handlebars = require('express-handlebars'); 
const bodyParser = require('body-parser'); 
const app = express();
const connect = require('./models/connect');
app.use(bodyParser.urlencoded());

app.use('/static' , express.static('public'));

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.post('/controlpanel/loggin', async (request, response) => {
const db = await connect();
const collection = db.collection("users");
const login = await collection.find({losenord: request.body.losenord, UserName: request.body.UserName}).toArray();
if (login.length < 1 ) {
response.set('Set-Cookie', 'admin=true;');
response.redirect("/controlpanel");
}
})



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

    app.get('/controlpanel/registrera', (request, response) => {
        response.render('registrera', {layout: "cp"});
        response.set()
        console.log('request.headers.cookie', request.headers.cookie);
        console.log('request.cookies', request.cookies);
        });

        app.post('/portfolio/registrera', async (request, response) => {
            const registrera = {
                UserName: request.body.UserName,
                epostadress: request.body.epost ,
                losenord: request.body.losenord ,
            }; 
    
        const db = await connect();
        const collection = await db.collection('användare');
        await collection.insertOne(registrera);
        response.redirect("/controlpanel/loggin");
        }); 

app.get('/controlpanel/skapaobjekt', (request, response) => {
    response.render('skapaobjekt', {layout: "cp"});
    });

    app.post('/controlpanel/skapaobjekt', async (request, response) => {
        const skapaobjekt = {laddaupplank: request.body.laddaupplank,
            laddauppbild: request.body.laddauppbild,};
        response.render('skapaobjekt', {layout: "cp"});
        response.redirect("/controlpanel/skapaobjekt");
        });

const db = await connect();
const collection = db.collection('skapaobjekt');
await collection.insertOne(skapaobjekt);
response.redirect("/controlpanel/skapaobjekt");
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