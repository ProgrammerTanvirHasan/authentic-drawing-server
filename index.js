const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USERS}:${process.env.DB_PASS}@cluster0.7xgoc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const dataCollection = client.db("itemsDB").collection("items");
    app.post("/items", async (req, res) => {
      const item = req.body;
      const result = await dataCollection.insertOne(item);
      res.send(result);
    });
    app.get("/items", async (req, res) => {
      const cursor = dataCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/items/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await dataCollection.findOne(query);
      res.send(result);
    });

    app.put("/items/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedItems = req.body;
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          item: updatedItems.item,
          email: updatedItems.email,
          name: updatedItems.name,
          Subcategory: updatedItems.Subcategory,
          customization: updatedItems.customization,
          Time: updatedItems.Time,
          Price: updatedItems.Price,
          rating: updatedItems.rating,
          stock: updatedItems.stock,
          Description: updatedItems.Description,
        },
      };

      const result = await dataCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    app.delete("/items/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await dataCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!vaiii3");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
