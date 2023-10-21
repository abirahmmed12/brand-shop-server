const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const dotenv = require('dotenv');
dotenv.config();

// middleware 
app.use(cors());
app.use(express.json());

// mongouri 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_pass}@cluster0.x8pzcmr.mongodb.net/?retryWrites=true&w=majority`;
const brands = [
  {
    "id": 1,
    "name": "Coca-Cola",
    "image": "https://i.ibb.co/pnfPrsG/Coca-Cola-Decal-Red-Disc-Bottle-Distressed-Vinyl-Decal-Peel-and-Stick-Decal-Self-Stick-Decal-Removab.jpg"
  },
  {
    "id": 2,
    "name": "McDonald's",
    "image": "https://i.ibb.co/J2BHDCL/ngh-a-logo-c-a-c-c-c-ng-ty-l-n-Khatech-Academy.jpg"
  },
  {
    "id": 3,
    "name": "Starbucks",
    "image": "https://i.ibb.co/TYBbmHZ/download-1.jpg"
  },
  {
    "id": 4,
    "name": "KFC",
    "image": "https://i.ibb.co/ZdY2Zdh/KFC-Logo-Vector.jpg"
  },
  {
    "id": 5,
    "name": "Nestlé",
    "image": "https://i.ibb.co/xShBP5Q/Nestle-Corporate-Storytelling-Powered-by-Data-ID-Nederland.jpg"
  },
  {
    "id": 6,
    "name": "Burger King",
    "image": "https://i.ibb.co/rkkvtHR/Norte-en-L-nea-Burger-King-estrena-su-nuevo-logo-un-hito-en-la-trayector-a-de-la-marca.jpg"
  }
]

app.get('/brands', (req, res) => {
  res.json(brands);
});

// mongoClient 
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
});

async function run() {
  try {
    // collection 
    const servicesCollection = client
      .db('foodiePie')
      .collection('services')
    const cartCollection = client
      .db('foodiePie')
      .collection('services')

    // initial api 
    app.get('/', (req, res) => {
      res.send('hello')
    })

    // post data to db(create)
    app.post('/create-service', async (req, res) => {
      const data = req.body;
      const result = await servicesCollection.insertOne(data);
      console.log(result, 'result');
      res.send(result)
    })

    // get all data from db(read)
    app.get('/create-service', async (req, res) => {

      const query = {};
      const cursor = await servicesCollection.find(query).toArray();
      res.send(cursor)
    })
    // get all data from db(read)
    app.get('/create-service/:id', async (req, res) => {
      const id = req.params.id;

      try {
        const query = { _id: new ObjectId(id) };
        const product = await servicesCollection.findOne(query);

        if (product) {
          res.json(product);
        } else {
          res.status(404).json({ message: 'Product not found' });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    });
    app.get('/create-service/:name', async (req, res) => {
      console.log(req.params);
      const query = { brand: req.params.name };
      const cursor = await servicesCollection.find(query).toArray();
      res.send(cursor)
    })

    // get all brand from service collections 
    app.get("/brands", async (req, res) => {
      const brands = await servicesCollection.find({}).project({ brand: 1 }).toArray()
      res.send(brands);
    })

    const cartItems = [];

    app.post('/add-to-cart', async (req, res) => {
      const item = req.body;
      const result = await cartCollection.insertOne(item)

      res.send(result)
      // cartItems.push(item);
      // res.status(200).json({ message: 'Item added to cart' });
    });
    app.delete('/add-to-cart/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await cartCollection.deleteOne(query)
      res.send(result)
    })


    // Retrieve the user's cart items
    app.get('/get-cart', async (req, res) => {
      const id = req.query.id;
      const query = {
        userId: id
      }
      const result = await cartCollection.find(query).toArray()
      res.send(result)
    });



    // update details 
    app.put('/student/:id', async (req, res) => {
      const id = req.params.id;
      const doc = req.body;
      console.log(doc);
      const filter = { _id: new ObjectId(id) }
      const option = { upsert: true };
      const updatedDoc = {
        $set: doc
      }
      const result = await studentDetailsCollection.updateOne(filter, updatedDoc, option)
      res.send(result);
    })

    // delete a student form db 
  
  }
  catch {

  }
}
run().catch(err => { })

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
})