const express = require('express');
const { createClient } = require('@clickhouse/client');
const rateLimit = require('@fastify/rate-limit');

const path = require('path');

const app = express();
app.use(rateLimit({
    max: 10, // limit each IP to 10 requests per windowMs
    windowMs: 1 * 60 * 1000 // 1 minute
}));
require('dotenv').config();

const PORT = process.env.PORT;

const client = createClient({
    host: `http://${process.env.DB_HOST}:8123`,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

const isNumber = (val) => /^[0-9]+$/.test(val);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Example GET endpoint: fetch all rows from a table
app.get('/api/geoloc', async (req, res) => {
    try {
        const { region } = req.query; // read ?region=XYZ
        const rows = await client.query({
           query: `
                SELECT id, codeIdentity, data1, data3, level_6_fullcode, latitude, longitude
                FROM assignments_se
                WHERE level_6_fullcode LIKE '%${region}%'
            `,
            format: 'JSONEachRow'
           
        });
        res.json(await rows.json());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
