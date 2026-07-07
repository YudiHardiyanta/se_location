module.exports = async function (fastify) {

    fastify.get("/regions/:level/:filter_region", {
        preHandler: [fastify.authenticate]
    }, async (request, reply) => {

        if (!request.params.level || request.params.level === "") {
            return reply.status(400).send({ error: "Level is required" });
        }

        const { level, filter_region } = request.params;

        if (level == 2) {
            //level kab
            const result = await fastify.clickhouse.query({
                query: `
                select level_1_fullcode,level_2_fullcode,level_1_name,level_2_name from 
                master_subsls_fasih
                WHERE level_2_fullcode LIKE '${filter_region}%'
                group by level_1_fullcode,level_2_fullcode,level_1_name,level_2_name
                ORDER BY level_2_fullcode
            `,
                format: "JSONEachRow"
            });
            return await result.json();
        }
        if (level == 3) {
            //level kec
            const result = await fastify.clickhouse.query({
                query: `
                select level_1_fullcode,level_2_fullcode,level_3_fullcode,level_1_name,level_2_name,level_3_name from 
                master_subsls_fasih
                WHERE level_3_fullcode LIKE '${filter_region}%'
                group by level_1_fullcode,level_2_fullcode,level_3_fullcode,level_1_name,level_2_name,level_3_name
                ORDER BY level_3_fullcode
            `,
                format: "JSONEachRow"
            });
            return await result.json();
        }
        if (level == 4) {
            //level desa
            const result = await fastify.clickhouse.query({
                query: `
                select level_1_fullcode,level_2_fullcode,level_3_fullcode,level_4_fullcode,level_1_name,level_2_name,level_3_name,level_4_name from 
                master_subsls_fasih
                WHERE level_4_fullcode LIKE '${filter_region}%'
                group by level_1_fullcode,level_2_fullcode,level_3_fullcode,level_4_fullcode,level_1_name,level_2_name,level_3_name,level_4_name
                ORDER BY level_4_fullcode
            `,
                format: "JSONEachRow"
            });
            return await result.json();
        }
        if (level == 5) {
            //level desa
            const result = await fastify.clickhouse.query({
                query: `
                select level_1_fullcode,level_2_fullcode,level_3_fullcode,level_4_fullcode,level_5_fullcode,level_1_name,level_2_name,level_3_name,level_4_name,level_5_name from 
                master_subsls_fasih
                WHERE level_5_fullcode LIKE '${filter_region}%'
                group by level_1_fullcode,level_2_fullcode,level_3_fullcode,level_4_fullcode,level_5_fullcode,level_1_name,level_2_name,level_3_name,level_4_name,level_5_name
                ORDER BY level_5_fullcode
            `,
                format: "JSONEachRow"
            });
            return await result.json();
        }
        if (level == 6) {
            //level desa
            const result = await fastify.clickhouse.query({
                query: `
                select level_1_fullcode,level_2_fullcode,level_3_fullcode,level_4_fullcode,level_5_fullcode,level_6_fullcode,level_1_name,level_2_name,level_3_name,level_4_name,level_5_name,level_6_name from 
                master_subsls_fasih
                WHERE level_6_fullcode LIKE '${filter_region}%'
                group by level_1_fullcode,level_2_fullcode,level_3_fullcode,level_4_fullcode,level_5_fullcode,level_6_fullcode,level_1_name,level_2_name,level_3_name,level_4_name,level_5_name,level_6_name
                ORDER BY level_6_fullcode
            `,
                format: "JSONEachRow"
            });
            return await result.json();
        }

        return reply.status(400).send({ error: "Invalid level and region" });


    });
};