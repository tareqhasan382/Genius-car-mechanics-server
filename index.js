const { response } = require('express');
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = 5000
//user:genius-car-mechanis2 
//Pass:cnROtbB0Y7Qe6gX2

//2ta MiddleWare call korte hobe 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mjyz2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    //console.log('connected to database');
    const database = client.db("carMechanictDB");
   const servicesCollection = database.collection("services");
    //GET API all data
    app.get('/services',async(req, res)=>{
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
    });

    //GET SINGLE SERVICE
    app.get('/services/:id',async(req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const service = await servicesCollection.findOne(query);
        res.json(service);

    })


    // POST API
    app.post('/services',async(req, res)=>{
        const service = req.body;
        //console.log('hit the post API', service);
        const result = await servicesCollection.insertOne(service);
        //console.log(result);
        res.json(result);
    });

    //DELETE API
    app.delete('/services/:id',async(req, res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await servicesCollection.deleteOne(query);
        res.json(result);
    })

    
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req, res)=>{
    res.send('GINIUS CAR RUNNING SERVER');
});
app.listen(port,()=>{
    console.log('RUNNING GENIUS CAR ON PORT',port);
})