const express = require('express');
const handlebars = require('express-handlebars'); 
const bodyParser = require('body-parser'); 
const app = express();
const connect = require('./models/connect');
app.use(bodyParser.urlencoded());
const ObjectId = require('mongodb').ObjectId;
const formidable = require('formidable');
var multer = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '.jpg') //Appending .jpg
    }
  })
var upload = multer({ storage: storage })
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
});

app.post('/controlpanel/visaobjekt/edit/:_id', async (request,  response) => {
    const edit = request.params.id; 
    const db = await connect();
    const collection = db.collection('skapaobjekt');
    await collection.findOneAndUpdate({ _id: ObjectId(edit)}, 
        { $set: {
            bildnamn: request.body.bild,
            länknamn: request.body.länk,  
            }
         } 
    );
    response.redirect("/controlpanel/listaobjekt");
        });
        
app.post('/portfolio/create', upload.single('bild'), async  (request, response) => {

    const skapaobjekt = {
        title1: request.file.title1,
        bildnamn: request.file.filename,
        länknamn: request.body.länk,
        content: request.body.content, 
    }; 
    console.log(request.body);
    const db = await connect();
    const collection = db.collection('skapaobjekt');
    await collection.insertOne(skapaobjekt);
    response.sendStatus(204); 
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
        console.log(request.body);
        const skapaobjekt = {
        title1: request.body.title1,
            laddaupplank: request.body.laddaupplank,
            laddauppbild: request.body.laddauppbild,
            content: request.body.content
        };
            const db = await connect();
            const collection = db.collection('skapaobjekt');
            await collection.insertOne(skapaobjekt);
            response.redirect("/controlpanel/skapaobjekt");
        });



app.get('/controlpanel/loggin', (request, response) => {
    response.render('loggin', {layout: "cp"});
    });


app.get('/', async(request, response) => {
const db = await connect();
const collection = db.collection('skapaobjekt');
const objekt = await collection.find().toArray();
    response.render('home',{
        objekt:objekt
    });
});

app.get('/controlpanel/admin', (request, response) => {
    response.render('admin' , {layout: "cp"});
});


app.get('/controlpanel/visaobjekt/tabort/:id', async (request, response) => {
    const tabort = request.params.id; 
    const db = await connect();
    const collection = db.collection('listaobjekt');
    await collection.findOneAndDelete({_id: ObjectId(tabort) });
    response.redirect("/controlpanel/listaobjekt");
});

app.get('/controlpanel/visaobjekt/edit/:id', async (request, response) => {
    const edit = request.params.id; 
    const db = await connect();
    const collection = db.collection('skapaobjekt');
    const skapaobjekt = await collection.find({_id: ObjectId(edit)}).toArray();
    console.log(skapaobjekt);
    response.render('edit', {layout: "cp", skapaobjekt: skapaobjekt[0]});
});


app.get('/ommig', (request, response) => {
    response.render('ommig');
});

app.get('/controlpanel', (request, response) => {
    response.render('controlpanel', {layout: "cp"});
});

app.get('/portfolio/visa/:id', async (request, response) => {
    const id = request.params.id;
    const db = await connect();
    const collection = db.collection ("skapaobjekt");
    const visaportfolio = await collection.find({_id: ObjectId(id)}).toArray();
 
    response.render('visaportfolio',{objekt:visaportfolio});
});

app.get('/portfolio/visa/chat1/:id', async (request, response) => {
    const id = request.params.id;
    const db = await connect();
    const collection = db.collection ("skapaobjekt");
    const chat1 = await collection.find({_id: ObjectId(id)}).toArray();
 
    response.render('chat1',{objekt:chat1});
});



app.get('/controlpanel/visaobjekt', (request, response) => {
    response.render('visaobjekt', {layout: "cp"});
});

app.get('/controlpanel/edit', (request, response) => {
    response.render('edit', {layout: "cp"});
});


app.get('/controlpanel/visaobjekt/:id', async (request, response) => {

const id = request.params.id;
const db = await connect();
const collection = db.collection("skapaobjekt");
const skapaobjekt = await collection.find({_id: ObjectId(id)}).toArray();
console.log(skapaobjekt);
response.render('visaobjekt' , {
   objekt: skapaobjekt[0]
})
});

app.get('/controlpanel/listaobjekt', async (request, response) => {
        const db = await connect();
        const collection = db.collection('skapaobjekt');
       const listaobjekt = await collection.find().toArray();
       response.render('listaobjekt' , {
        objekt: listaobjekt,
       });
      
    });

  
app.listen(1111, () => console.log('application running on port 1111'));