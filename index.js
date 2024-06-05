require('dotenv').config();
const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const cors = require('cors')

const port = process.env.PORT || 3000;
const userName = process.env.DB_USERNAME
const userPassword = process.env.DB_PASSWORD

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${userName}:${userPassword}@cluster0.40hja.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        await client.connect();
        const serviceDB = client.db("serviceDB");
        const userDB = client.db("userDB");
        const serviceCollection = serviceDB.collection("serviceCollection");
        const userCollection = userDB.collection("userCollection");

        //services
        app.post("/services", async (req, res) => {
            const servicesData = req.body;
            const result = await serviceCollection.insertOne(servicesData)
            res.send(result)
        })


        app.get("/services", async (req, res) => {
            const servicesData = serviceCollection.find();
            const result = await servicesData.toArray()
            res.send(result)
        })

        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const result = await serviceCollection.findOne({ _id: new ObjectId(id) })
            res.send(result)
          })

        app.patch("/services/:id", async (req, res) => {
            const id = req.params.id;
            const updateService = req.body;
            const result = await serviceCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateService })
            res.send(result)
        })

        app.delete("/services/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const result = await serviceCollection.deleteOne({ _id: new ObjectId(id) })
            console.log(result)
            res.send(result)
          })


        //   users
        app.post("/user", async (req, res) => {
            const userData = req.body;
            const isUserExist = await userCollection.findOne({displayName: user?.displayName})
            if(isUserExist?._id){
                return res.send({
                    status: "success",
                    message: "Login Success"
                })
            }
            const result = await userCollection.insertOne(userData)
            res.send(result)
        })
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



