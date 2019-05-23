const express = require('express');
const handlebars = require('express-handlebars'); 
const bodyParser = require('body-parser'); 
const app = express();
const connect = require('./models/connect');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
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
        if(request.headers.cookie) {
            response.render('registrera', {layout: "cp"});
            
           }else {
               response.redirect('/home/loggin')
           }
       
        response.set()
        });

        app.post('/controlpanel/registrera', async (request, response) => {
            const saltRounds = 10;
            const myPlaintextPassword = request.body.losenord;
          
            bcrypt.genSalt(saltRounds, function(err, salt) {
              bcrypt.hash(myPlaintextPassword, salt, async function(err, hash) {
            const registrera = {
                UserName: request.body.UserName,
                epostadress: request.body.epost ,
                losenord: hash,
            }; 

    
        const db = await connect();
        const collection = await db.collection('användare');
        await collection.insertOne(registrera);
        response.redirect("/home/loggin");
        }); 
    });
});
        
app.get('/controlpanel/skapaobjekt', (request, response) => {
    if(request.headers.cookie) {
        response.render('skapaobjekt', {layout: "cp"});
        
       }else {
           response.redirect('/home/loggin')
       }
    
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

        bcrypt.compare(request.body.losenord, loggin[0].losenord, function(
           err,
           match 
        ){
            if (match) {
                response.cookie('admin', 'true');
                response.redirect("/controlpanel/");
                } else {
                    response.render('loggin', {layout:  "main", meddelande: 'fel lösenord'});
                }
        });
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
   if(request.headers.cookie) {
    response.render('controlpanel', {layout: "cp"});
    
   }else {
       response.redirect('/home/loggin')
   }
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


app.get('/controlpanel/loggout', (request, response) => {
   response.set(
    'Set-Cookie','admin=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
   );
    response.redirect('/' ); 
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

    

  
app.listen(5054, () => console.log('application running on port 5054'));