const fs = require('fs/promises');
const path = require('path');

module.exports = async function (fastify) {

    fastify.get("/maps/:version/:filter_region", {
        preHandler: [fastify.authenticate]
    }, async (request, reply) => {

        const { version, filter_region } = request.params;

        let filePath = "";

        if (filter_region.length === 14) {
            filePath = path.join(
                process.cwd(),
                "data",
                version,
                `idsls_${filter_region}.geojson`
            );
        } else if (filter_region.length === 16) {
            filePath = path.join(
                process.cwd(),
                "data",
                version,
                `idsubsls_${filter_region}.geojson`
            );
        } else {
            return reply.code(400).send({
                success: false,
                message: "Format region tidak valid"
            });
        }

        console.log(filePath);

        try {
            await fs.access(filePath);

            const content = await fs.readFile(filePath, "utf8");

            return reply
                .type("application/json")
                .send(JSON.parse(content));

        } catch (err) {
            console.error(err);

            return reply.code(404).send({
                success: false,
                message: "File tidak ditemukan"
            });
        }
    });
};