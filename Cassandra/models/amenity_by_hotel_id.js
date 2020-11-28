const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
    contactPoints: ['127.0.0.1'],
    keyspace: 'hotel',
    localDataCenter: 'datacenter1'
});

const create_amenity_by_hotel_id = async () => {
    try {
        let query = "CREATE TABLE amenity_by_hotel (hotel_id int, amenity_name text, PRIMARY KEY (hotel_id, amenity_name));";
        await client.execute(query);
        console.log("amenity table created!!!");
        client.shutdown();
    } catch (error) {
        console.log(error);
    }
}

module.exports = create_amenity_by_hotel_id;