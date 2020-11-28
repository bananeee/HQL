const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
    contactPoints: ['127.0.0.1'],
    keyspace: 'hotel',
    localDataCenter: 'datacenter1'
});

const create_room_by_hotel_id = async () => {
    try {
        let query = "CREATE TABLE room_by_hotel (hotel_id int, room_number int, is_vailable boolean, PRIMARY KEY (hotel_id, room_number));";
        await client.execute(query);
        console.log("room table created!!!");
        client.shutdown();
    } catch (error) {
        console.log(error);
    }
}

module.exports = create_room_by_hotel_id;