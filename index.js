const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ryecn6e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const craftCollection = client.db("craftDB").collection('craft');
    const subCategoryCollection = client.db("craftDB").collection('subCategoryName');
    const secondSubcategoryColletion = client.db("craftDB").collection('secondCategoryName');


    //show the data from database
    app.get('/subCategories', async(req, res) => {
      const cursor = subCategoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    //show the data from the database
    app.get('/secondSubCategory', async(req, res) =>{
      const cursor = secondSubcategoryColletion.find();
      const result = await cursor.toArray();
      res.send(result);
    })



    //show the data from server 
    app.get('/addCrafts', async(req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    //Send the data from server for updated
    app.get('/addCrafts/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await craftCollection.findOne(query);
      res.send(result);
    })


    //send add craft item to the server
    app.post('/addCrafts', async(req, res) => {
      const newCraftItem = req.body;
      console.log(newCraftItem);
      const result = await craftCollection.insertOne(newCraftItem);
      res.send(result);
    })

    //Modified the data from the server
    app.put('/addCrafts/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updateCraftItem = req.body;

      const craftItem = {
        $set: {
          photo:updateCraftItem.name,
          item:updateCraftItem.item,
           subcategory:updateCraftItem.subcategory,
            short:updateCraftItem.short,
             price:updateCraftItem.price,
              rating:updateCraftItem.rating,
               customization:updateCraftItem.customization,
                processing:updateCraftItem.processing,
                 stock:updateCraftItem.stock,
        }
      }
      const result = await craftCollection.updateOne(filter, craftItem, options);
      res.send(result);
    })

    //Delete from the server
    app.delete('/addCrafts/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Assignment 10 server is making');
})

app.listen(port, () =>{
    console.log(`Assignment Server is running on port: ${port}`);
})