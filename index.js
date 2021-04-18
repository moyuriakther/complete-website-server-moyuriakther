const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require("cors");
const bodyParser = require("body-Parser");
require('dotenv').config()
console.log(process.env.DB_USER)

const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u5uel.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection error', err)
  const classCollection = client.db("yoga").collection("classes");

  app.get('/classes', (req, res) => {
    classCollection.find()
    .toArray((err, items) => {
      res.send(items)
      console.log('from database', items)
    })
  })


  app.post('/addClasses', (req, res) =>{
    const newClass = req.body;
    classCollection.insertOne(newClass).then((result) => {
        res.send(result.insertedCount > 0);
      });
  })


  console.log('connection success')
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})