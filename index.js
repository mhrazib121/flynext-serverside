const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// qGiMK8dbEDmBzgM1


const uri = "mongodb+srv://flynext:qGiMK8dbEDmBzgM1@cluster0.xvulc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   console.log('hitting')
//   client.close();
// });

// app.post('/bookings', (req, res)=>{
//     const bookings = req.body;
//     const result = insertOne(bookings);
//     res.json(result);
// })

async function run(){
    try{
        await client.connect();
        console.log('connected');
        const database = client.db("flynext");
        const allBookingCollection = database.collection("allBooking");

        
        // Booking get 
        app.get('/bookings', async(req, res) =>{
            const cursor = allBookingCollection.find({});
            const booking = await cursor.toArray();
            res.send(booking);
        })

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await allBookingCollection.insertOne(booking);
            res.json(result);
        })



    }
    finally{

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log('listening on port', port)
  })