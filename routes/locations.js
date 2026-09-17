module.exports = async function (fastify) {

    fastify.get("/locations/:region", {
        preHandler: [fastify.authenticate]
    }, async (request, reply) => {

        if (!request.params.region || request.params.region === "") {
            return reply.status(400).send({ error: "Region is required" });
        }

        const maskPerKata = function (nama,jenis) {
            
            if (!nama) return nama;
            if (jenis!='keluarga') return nama;
            return nama
                .split(" ") // pisah per kata
                .map(kata => {
                    if (kata.length <= 2) return kata; // kata pendek biarkan
                    return kata[0] + '*'.repeat(kata.length - 2) + kata[kata.length - 1];
                })
                .join(" "); // gabungkan kembali
        }

        const { region } = request.params;

        if (region.length < 14) {
            return reply.status(400).send({ error: "Invalid region" });
        }

        const result = await fastify.clickhouse.query({
            query: `
                SELECT 
    id, 
    codeIdentity, 
    data1,
    data2, 
    data3,
    data6, 
    level_6_fullcode, 
    latitude, 
    longitude, 
    assignmentStatusAlias
FROM assignments_se
WHERE 
    level_6_fullcode LIKE '${region}%' and
    latitude IS NOT NULL 
    AND longitude IS NOT NULL 
    AND assignmentStatusAlias NOT LIKE '%OPEN%'
    AND (
        -- data3 berupa angka tunggal < 5000
        toUInt64OrNull(trim(data3)) < 5000

        OR

        -- data3 berupa format angka/angka
        match(trim(data3), '^[0-9]+[[:space:]]*/[[:space:]]*[0-9]+$')
    )
            `,
            format: "JSONEachRow"
        });

        const data = await result.json();
        //res.json(await rows.json());
        //lakukan mapping kolom
        const renamed = data.map(row => ({
            id: row.id,
            //codeIdentity: row.codeIdentity,
            nama: maskPerKata(row.data1,row.data6),
            alamat: row.data2,
            no_bangunan: row.data3,
            jenis: row.data6,
            kodeWilayah: row.level_6_fullcode,
            lat: row.latitude,
            long: row.longitude,
            status: row.assignmentStatusAlias
        }))

        return renamed;

    });
};