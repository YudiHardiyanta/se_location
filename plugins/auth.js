const fp = require("fastify-plugin");

async function authPlugin(fastify) {

    fastify.decorate("authenticate", async function (request, reply) {

        const auth = request.headers.authorization;

        if (!auth) {
            return reply.code(401).send({
                message: "Unauthorized"
            });
        }

        const [scheme, token] = auth.split(" ");

        if (scheme !== "Bearer" || token !== process.env.API_TOKEN) {
            return reply.code(401).send({
                message: "Invalid token"
            });
        }

    });

}

module.exports = fp(authPlugin);