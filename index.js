const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const password = 'G!ZCNU4xVVgBy!-';

const uri = "mongodb+srv://organicUser:G!ZCNU4xVVgBy!-@cluster0.wp8tr.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


client.connect(err => {
    const productCollection = client.db("organicdb").collection("products");

    app.get('/products', (req,res)=>{
        productCollection.find({})
        .toArray((err, documents) =>{
            res.send(documents);
        })
    })

    app.get('/product/:id', (req,res)=>{
        productCollection.find({_id:ObjectId(req.params.id)})
        .toArray((err, documents)=>{
            res.send(documents[0]);
        })
    })
    
    app.post("/addProduct",(req , res)=>{
        const product = req.body;
        productCollection.insertOne(product)
        .then(result => {
            console.log('data added successfully');
            res.send('success');
        })
    })

    app.delete('/delete/:id', (req,res)=>{
        productCollection.deleteOne({_id:ObjectId(req.params.id)})
        .then(result=>{
            console.log(result);
        })
    })
});


app.listen(3000, () => console.log('Listening to port 3000'));