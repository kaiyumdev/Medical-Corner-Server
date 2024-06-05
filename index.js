require('dotenv').config();
const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const jwt = require("jsonwebtoken");
const cors = require('cors')

const port = process.env.PORT || 3000;
const userName = process.env.DB_USERNAME
const userPassword = process.env.DB_PASSWORD

app.use(cors())
app.use(express.json())


function createToken(user) {
    const token = jwt.sign(
      {
        email: user.email,
      },
      "secret",
      { expiresIn: "7d" }
    );
    return token;
  }

  function verifyToken(req, res, next) {
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, "secret");
    if (!verify?.email) {
      return res.send("You are not authorized");
    }
    req.user = verify.email;
    next();
  }

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
        app.post("/services", verifyToken, async (req, res) => {
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

        app.patch("/services/:id", verifyToken, async (req, res) => {
            const id = req.params.id;
            const updateService = req.body;
            const result = await serviceCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateService })
            res.send(result)
        })

        app.delete("/services/:id", verifyToken, async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const result = await serviceCollection.deleteOne({ _id: new ObjectId(id) })
            console.log(result)
            res.send(result)
        })


        //   users
        app.post("/user", async (req, res) => {
            const userData = req.body;
            const token = createToken(userData)
            console.log(token)
            const isUserExist = await userCollection.findOne({ email: userData?.email })
            // if (isUserExist?._id) {
            //     return res.send({
            //         status: "success",
            //         message: "Login Success",
            //         // token
            //     })
            // }
            // const result = await userCollection.insertOne(userData)
            // res.send(result)
            if (isUserExist?._id) {
                return res.send({
                  statu: "success",
                  message: "Login success",
                  token,
                });
              }
              await userCollection.insertOne(user);
              return res.send({ token });
        })

        app.get("/user/get/:id", async (req, res) => {
            const id = req.params.id;
            const result = await userCollection.findOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        app.get("/user/:email", async (req, res) => {
            const email = req.params.email;
            console.log(email)
            const result = await userCollection.findOne({ email });
            res.send(result);
        });

        app.patch("/user/:email", async (req, res) => {
            const email = req.params.email;
            const userData = req.body;
            const result = await userCollection.updateOne(
                { email },
                { $set: userData },
                { upsert: true }
            );
            console.log(result)
            res.send(result);
        });

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



