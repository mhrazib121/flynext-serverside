const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const cors = require('cors');
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

// const corsConfig = {
//     origin: "*",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
// };
// app.use(cors(corsConfig));
// app.options("*", cors(corsConfig));
// app.use(express.json());
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept,authorization"
//     );
//     next();
// });


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xvulc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        // await client.connect();
        console.log('connected');
        const database = client.db("flynext");
        const allServiceCollection = database.collection("allService");
        const allBookingCollection = database.collection("allBooking");
        //service
        app.get('/services', async (req, res) => {
            const cursor = allServiceCollection.find({});
            const service = await cursor.toArray();
            res.send(service);
        })

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await allServiceCollection.insertOne(service);
            res.send(result);
        })
        // single api 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getin single', id)
            const query = { _id: ObjectId(id) };
            const package = await allServiceCollection.findOne(query);
            res.json(package);
        })

        // Booking get data
        app.get('/bookings', async (req, res) => {
            const cursor = allBookingCollection.find({});
            const booking = await cursor.toArray();
            res.send(booking);
        })

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await allBookingCollection.insertOne(booking);
            res.json(result);
        })

        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await allBookingCollection.deleteOne(query);
            res.json(result);
        })

        app.put('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const updateBookingStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updateBookingStatus.status
                }
            };
            const result = await allBookingCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        })
    }
    finally {

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log('listening on port', port)
})