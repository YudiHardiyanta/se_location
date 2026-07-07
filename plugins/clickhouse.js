const fp = require("fastify-plugin");
const { createClient } = require("@clickhouse/client");

module.exports = fp(async function (fastify) {

    const client = createClient({
        url: process.env.CLICKHOUSE_URL,
        username: process.env.CLICKHOUSE_USERNAME,
        password: process.env.CLICKHOUSE_PASSWORD,
        database: process.env.CLICKHOUSE_DATABASE
    });

    fastify.decorate("clickhouse", client);

});