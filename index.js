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
    //for show data
    app.get('/products', (req,res)=>{
        productCollection.find({})
        .toArray((err, documents) =>{
            res.send(documents);
        })
    })
    //for show update product
    app.get('/product/:id', (req,res)=>{
        productCollection.find({_id:ObjectId(req.params.id)})
        .toArray((err, documents)=>{
            res.send(documents[0]);
        })
    })
    //for add
    app.post("/addProduct",(req , res)=>{
        const product = req.body;
        productCollection.insertOne(product)
        .then(result => {
            console.log('data added successfully');
            // res.send('success');
            res.redirect('/')

        })
    })
    //for update product
    app.patch('/update/:id',(req,res)=>{
        productCollection.updateOne({_id:ObjectId(req.params.id)},
        {
            $set:{price:req.body.price, quantity:req.body.quantity}
        })
        .then(result => {
            res.send(result.modifiedCount > 0)
        })
    })

    //for delete
    app.delete('/delete/:id', (req,res)=>{
        productCollection.deleteOne({_id:ObjectId(req.params.id)})
        .then(result=>{
            res.send(result.deletedCount > 0);
        })
    })
});


app.listen(3000, () => console.log('Listening to port 3000'));