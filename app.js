//require all the modules you need
const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const mongodb = require('mongodb').MongoClient;
const methodOverride = require('method-override');

app.set('port',process.env.PORT || 3000);
app.engine('handlebars',hbs({defaultLayout:'main',extname:'handlebars'}));
app.set('view engine','handlebars');

//handle application/json
app.use(bodyParser.json());

//handle appliaction/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));

//handle fileuploads(I have no file uploads here)
app.use(upload.array());

//to enable use of PUT and DELETE methods in html form
app.use(methodOverride("_method"));

//serving static files(images and css)
app.use(express.static('css'));
//route to render home page
app.get('/',(req,res)=>{
    res.render('index');
});

//insert into the db
app.post('/insert',(req,res)=>{
    let person = {
        userName:req.body.userName,
        firstName:req.body.firstName,
        middleName:req.body.middleName,
        lastName:req.body.lastName,
        age:req.body.age,
        gender:req.body.gender
    };

    mongodb.connect("mongodb://127.0.0.1:27017",{useNewUrlParser:true},(err,client)=>{
        if(err){
            console.error(err);
            res.send('Error in database');
            return;
        }else{
            let db = client.db('practice');
            db.collection('people').insertOne(person);
            console.log('Insert was successfull');
           res.send('Successfull');
        }
    })
});
//updating users
app.put('/update',(req,res)=>{
    mongodb.connect("mongodb://127.0.0.1:27017",{useNewUrlParser:true},(err,client)=>{
        if(err){
            console.error(err);
            res.send('Error in database');
            return;
        }else{
            let db = client.db('practice');
           db.collection('people').update(
               {userName:req.body.userName},{
                   userName:req.body.newUserName,
                firstName:req.body.firstName,
                middleName:req.body.middleName,
                lastName:req.body.lastName,
                age:req.body.age,
                gender:req.body.gender
               }
           )
            res.send('Succesffull')
        }
    })
});

//deleting users
app.delete('/delete',(req,res)=>{
    mongodb.connect("mongodb://127.0.0.1:27017",{useNewUrlParser:true},(err,client)=>{
        if(err){
            console.error(err);
            res.send('Error in the database');
            return;
        }else{
            let db = client.db('practice');
            db.collection('people').remove({
                userName:req.body.userName
            });
            console.log('Deletion successfull');
            res.send('Successfull');
        }
    });
});

app.get('/get',(req,res)=>{
    mongodb.connect("mongodb://127.0.0.1:27017",{useNewUrlParser:true},(err,client)=>{
        if(err){
            console.error(err);
            res.send('Error in database');
            return;
        }else{
            let db = client.db('practice');
            db.collection('people').find({
                userName:req.query.userName
            }).toArray().then((docs)=>{
                console.log(JSON.stringify(docs,undefined));
                res.render('index',{
                    result:JSON.stringify(docs,undefined)
                })

            })
        }
    })
})


//handle all invalid routes
app.get("*",(req,res)=>{
    res.status(404);
    res.type('text/html');
    res.send('Cannot find the page you requested');
})

app.listen(app.get('port'));