module.exports = async function (fastify) {

    fastify.get("/locations/:region", {
        preHandler: [fastify.authenticate]
    }, async (request, reply) => {

        if (!request.params.region || request.params.region === "") {
            return reply.status(400).send({ error: "Region is required" });
        }

        const { region } = request.params;

        if (region.length < 14) {
            return reply.status(400).send({ error: "Invalid region" });
        }

        const result = await fastify.clickhouse.query({
            query: `
                SELECT id, codeIdentity, data1, data3, level_6_fullcode, latitude, longitude
                FROM assignments_se
                WHERE latitude is not null and longitude is not null and assignmentStatusId != '0' and match(data3, '^[0-9]') and level_6_fullcode LIKE '${region}%'
            `,
            format: "JSONEachRow"
        });

        const data = await result.json();
        //res.json(await rows.json());
        //lakukan mapping kolom
        const renamed = data.map(row => ({
            id: row.id,
            codeIdentity: row.codeIdentity,
            nama: row.data1,
            no_bangunan: row.data3,
            kodeWilayah: row.level_6_fullcode,
            lat: row.latitude,
            long: row.longitude
        }))

        return renamed;

    });
};