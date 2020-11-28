const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
    contactPoints: ['127.0.0.1'],
    keyspace: 'hotel',
    localDataCenter: 'datacenter1'
});

const create_hotel = async () => {
    try {
        let query = "CREATE TABLE hotel (hotel_id int, name text, phone text, PRIMARY KEY (hotel_id));";
        await client.execute(query);
        console.log("hotel table created!!!");
        client.shutdown();
    } catch (error) {
        console.log(error);
    }
}

module.exports = create_hotel;