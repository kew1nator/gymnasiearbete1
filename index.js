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



app.post('/controlpanel/visaobjekt/edit/:id',upload.single('bild'), async (request,  response) => {
    console.log(request.file)
    const newobjekt =  {
           
            länknamn: request.body.länk,  
            title1: request.body.title1,
            content: request.body.content,
            }
            if(request.file){
newobjekt.bildnamn = request.file.filename



            }
    const edit = request.params.id; 
    const db = await connect();
    const collection = db.collection('skapaobjekt');
    await collection.findOneAndUpdate({ _id: ObjectId(edit)}, 
        { $set: newobjekt
         } 
    );
    response.redirect("/controlpanel/listaobjekt");
        });
        
app.post('/portfolio/create', upload.single('bild'), async  (request, response) => {

    const skapaobjekt = {
        title1: request.body.title1,
        bildnamn: request.file.filename,
        länknamn: request.body.länk,
        content: request.body.content, 
    }; 
    console.log(request.body);
    const db = await connect();
    const collection = db.collection('skapaobjekt');
    await collection.insertOne(skapaobjekt);
    response.redirect("/controlpanel/listaobjekt")
    
    });

    app.get('/controlpanel/registrera', (request, response) => {
        response.render('registrera', {layout: "cp"});
        response.set()
        });

        app.post('/controlpanel/registrera', async (request, response) => {
            const registrera = {
                UserName: request.body.UserName,
                epostadress: request.body.epost ,
                losenord: request.body.losenord,
            }; 

    
        const db = await connect();
        const collection = await db.collection('användare');
        await collection.insertOne(registrera);
        response.redirect("/home/loggin");
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



    app.post('/home/loggin', async (request, response) => {
        const id = request.params.id; 
        const db = await connect();
        const collection = await db.collection('användare');

        const loggin = await collection.find({epostadress: request.body.epostadress}).toArray();

if (loggin[0].losenord === request.body.losenord ) {
    response.set('Set-Cookie', 'admin=true;');
    response.redirect("/controlpanel/");
    } else {
        response.render('loggin', {layout:  "main", meddelande: 'fel lösenord'});
    }
   
    });
    
    app.get('/home/loggin', (request, response) => {
        response.render('loggin', {layout: "main"});
        response.set()
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
    const collection = db.collection('skapaobjekt');
    await collection.findOneAndDelete({_id: ObjectId(tabort) });
    response.redirect("/controlpanel/listaobjekt");
});

app.get('/controlpanel/visaobjekt/edit/:id',  async (request, response) => {
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
   objekt: skapaobjekt[0],
   layout: "cp"
})
});

app.get('/controlpanel/listaobjekt', async (request, response) => {
        const db = await connect();
        const collection = db.collection('skapaobjekt');
       const listaobjekt = await collection.find().toArray();
       response.render('listaobjekt' , {
        objekt: listaobjekt,
        layout: "cp"
       });
      
    });

  
app.listen(1111, () => console.log('application running on port 1111'));