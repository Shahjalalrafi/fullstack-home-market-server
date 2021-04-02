const express = require('express')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fltsf.mongodb.net/${process.env.DB_USERNAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(express.json())
app.use(cors())
const port = 5050


client.connect(err => {
  const collection = client.db("bookShop").collection("product");
  const bookCollection = client.db("bookShop").collection("bookProduct");

  app.post('/newEvent', (req, res) => {
    const newProduct = req.body
    collection.insertOne(newProduct)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/events', (req, res) => {
    collection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.post('/newBook', (req, res) => {
    const newBook = req.body
    bookCollection.insertOne(newBook)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/newBookings', (req, res) => {
    console.log(req.query.email)
    bookCollection.find({ LogedInUserEmail: req.query.email })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })


  app.delete('/delete/:id', (req, res) => {
    console.log(req.params.id)
    collection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0)
      })
  })

  // app.delete('/delete/:id', (req, res) => {
  //   console.log(req.params.id)
  //   collection.deleteOne({ _id: ObjectId(req.params.id) })
  //     .then(result => {
  //       console.log(result)
  //       res.send(result.deletedCount > 0);
  //     })
  // })


});


app.get('/', (req, res) => {
  res.send('hello everyOne')
})

app.listen(process.env.PORT || port, () => console.log('listening to port 5050'))