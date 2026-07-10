require("dotenv").config();

const Fastify = require("fastify");
const rateLimit = require('@fastify/rate-limit');

const cors = require('@fastify/cors');

const app = Fastify({
    logger: true
});

await app.register(cors, {
  origin: '*'
})

app.register(require("./plugins/auth"));
app.register(require("./plugins/clickhouse"));




// Apply rate limiting
app.register(rateLimit, {
    max: 10000,
    timeWindow: 5 * 60 * 1000 // 1 menit
});

app.register(require("./routes/locations"));
app.register(require("./routes/regions"));
app.register(require("./routes/maps"));

const start = async () => {
    try {
        await app.listen({
            port: process.env.PORT,
            host: process.env.HOST
        });

        console.log("Server berjalan");
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();