const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const methodOverride = require('method-override');
let mongodb = require('mongodb').MongoClient;

app.set('port',process.env.PORT || 3000);
app.engine('handlebars',hbs({defaultLayout:'main',extname:'handlebars'}));
app.set('view engine','handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(upload.array());

app.use(methodOverride('_method'));

app.get('/',(req,res)=>{
    res.render('index');
});
app.get('/update',(req,res)=>{
    res.render('update');
});

app.get('/get',(req,res)=>{
    res.render('get');
});

app.get('/delete',(req,res)=>{
    res.render('delete');
});



app.post('/insert',(req,res)=>{
    let user = {
        userName:req.body.userName,
        firstName:req.body.firstName,
        middleName:req.body.middleName,
        lastName:req.body.lastName,
        userAge:req.body.age,
        gender:req.body.gender
    };
    mongodb.connect('mongodb://127.0.0.1:27017',{useNewUrlParser:true},(err,client)=>{
        if(err){
            console.error(err);
            res.send('Error in database');
            return;
        }else{
            let db = client.db('practice');
            db.collection('people').insert(user);
            res.send('Insert successful');
            console.log('Insert successful');
        }
    })

});

app.put('/update',(req,res)=>{
    mongodb.connect('mongodb://127.0.0.1:27017',{useNewUrlParser:true},(err,client)=>{
        if(err){
            console.error(err);
            res.send('Error in database');
            return;
        }else{
            let db = client.db('practice');
            db.collection('people').update(
                {userName:req.body.userName},
                {$set:{
                    userName:req.body.newUserName,
                    firstName:req.body.firstName,
                    middleName:req.body.middleName,
                    lastName:req.body.lastName,
                    userAge:req.body.age,
                    gender:req.body.gender
                }}
            );
            res.send('Successful');
        }
    })
});

app.delete('/delete',(req,res)=>{
    mongodb.connect('mongodb://127.0.0.1:27017',{useNewUrlParser:true},(err,client)=>{
        if(err){
            console.error(err);
            res.send('Error in database');
            return;
        }else{
            let db = client.db('practice');
            db.collection('people').remove({userName:req.body.userName});
            res.send('Successful');
        }
    })
});

app.get('/getUsers',(req,res)=>{
    mongodb.connect('mongodb://127.0.0.1:27017',{useNewUrlParser:true},(err,client)=>{
        if(err){
            console.error(err);
            res.send('Error in database');
            return;
        }else{
            let db = client.db('practice');
            db.collection('people').find(
                {userName:req.query.userName}
            ).toArray().then((docs)=>{
                console.log(JSON.stringify(docs,undefined));
                res.render('get',{
                    result:JSON.stringify(docs,undefined)
                });
            })
        }
    })
})

app.get('*',(req,res)=>{
    res.status(404);
    res.type('text/html');
    res.send('Cannot find the page you are looking for');
})

app.listen(app.get('port'));