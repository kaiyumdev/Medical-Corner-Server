require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");

const port = process.env.PORT || 3000;
const userName = process.env.DB_USERNAME;
const userPassword = process.env.DB_PASSWORD;

app.use(cors());
app.use(express.json());

function createToken(user) {
    const token = jwt.sign(
        { email: user.email },
        "secret",
        { expiresIn: "7d" }
    );
    return token;
}

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send("Authorization header missing");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).send("Token missing in authorization header");
    }

    try {
        const verify = jwt.verify(token, "secret");
        if (!verify?.email) {
            return res.status(403).send("You are not authorized");
        }
        req.user = verify.email;
        next();
    } catch (error) {
        return res.status(401).send("Invalid token");
    }
}

const uri = `mongodb+srv://${userName}:${userPassword}@cluster0.40hja.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        // Services
        app.post("/services", verifyToken, async (req, res) => {
            const servicesData = req.body;
            const result = await serviceCollection.insertOne(servicesData);
            res.send(result);
        });

        app.get("/services", async (req, res) => {
            const servicesData = serviceCollection.find();
            const result = await servicesData.toArray();
            res.send(result);
        });

        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const result = await serviceCollection.findOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        app.patch("/services/:id", verifyToken, async (req, res) => {
            const id = req.params.id;
            const updateService = req.body;
            const result = await serviceCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updateService }
            );
            res.send(result);
        });

        app.delete("/services/:id", verifyToken, async (req, res) => {
            const id = req.params.id;
            const result = await serviceCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        // Users
        app.post("/user", async (req, res) => {
            const userData = req.body;
            const token = createToken(userData);
            const isUserExist = await userCollection.findOne({ email: userData?.email });
            if (isUserExist?._id) {
                return res.send({
                    status: "success",
                    message: "Login success",
                    token,
                });
            }
            await userCollection.insertOne(userData);
            return res.send({ token });
        });

        app.get("/user/get/:id", async (req, res) => {
            const id = req.params.id;
            const result = await userCollection.findOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        app.get("/user/:email", async (req, res) => {
            const email = req.params.email;
            const result = await userCollection.findOne({ email });
            res.send(result);
        });

        app.patch("/user/:email", verifyToken, async (req, res) => {
            const email = req.params.email;
            const userData = req.body;
            const result = await userCollection.updateOne(
                { email },
                { $set: userData },
                { upsert: true }
            );
            res.send(result);
        });

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensure proper cleanup
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('This is Medical-Corner Server by Mine Seriously!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
