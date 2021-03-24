const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

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
    
    app.post("/addProduct",(req , res)=>{
        const product = req.body;
        productCollection.insertOne(product)
        .then(result => {
            console.log('data added successfully');
            res.send('success');
        })
    })
});


app.listen(3000, () => console.log('Listening to port 3000'));