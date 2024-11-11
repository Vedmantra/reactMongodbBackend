const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;
const uri = 'mongodb+srv://vedmantrabhosale:xwPRmEdTbD58pkJy@cluster0.qu28r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

app.use(cors());

async function connectDB() {
    try {
        const clustor = await MongoClient.connect(uri);
        const db = clustor.db('react-db');
        const collections = await db.listCollections().toArray();

        // Check if the collection exists
        if (collections.length > 0) {
            console.log('Collection exists');
        } else {
            console.log('Collection does not exist');
            clustor.close();
            return;
        }

        // If anybody calls "api/get-data" theyll get the items in return
        app.get('/api/get-data', async (req, res) => {
            try {
                const items = await db.collection('react-collection').find().toArray();
                res.json(items);
            } catch (error) {
                console.error('Error fetching items:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectDB();
