const cassandra = require('cassandra-driver');
const faker = require('faker');

const client = new cassandra.Client({
    contactPoints: ['127.0.0.1'],
    keyspace: 'hotel',
    localDataCenter: 'datacenter1'
});
const TOTAL_RECORD = 1000;

const generateRandomAmenity = () => {
    const amenities = ['Personal care', 'Coffee Kit', 'Free breakfast', 'Free WiFi internet access', 'Free parking', 'Fitness center', 'Room Purification', 'Pool', 'Kid-friendly Rooms and Products', 'Pet-friendly Rooms', 'Champagne Bar', 'Daily Newspaper', 'Laundry Services', 'Spa', 'Cribs & Cots for Children', '24-Hour Guest Reception', 'Onsite Dining']
    return amenities[Math.floor(Math.random() * amenities.length)];
}

const generateRandomNumber = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}

const timer = (startTime, curRow) => {
    if (curRow % (TOTAL_RECORD / 10) === 0) {
        let timePassed = process.hrtime(startTime);
        timePassed = timePassed[0] + timePassed[1] / 1000000000;
        let timeLeft = timePassed * (TOTAL_RECORD - curRow) / curRow;
        console.log(curRow / (TOTAL_RECORD / 100) + "%. Time left: " + timeLeft + "s");
    }
}

const mainFunction = async () => {
    try {
        const startTime = process.hrtime();

        let randomAmenity, randomNumber, query = 'BEGIN UNLOGGED BATCH ';
        for (let i = 0; i <= TOTAL_RECORD; i++) {
            timer(startTime, i);
            
            if (i % 1000 === 0) {
                query += ' APPLY BATCH;';
                await client.execute(query);
                query = 'BEGIN UNLOGGED BATCH '
            } else if (i === TOTAL_RECORD) {
                query += ' APPLY BATCH;';
                await client.execute(query);
            }
            randomAmenity = generateRandomAmenity();
            randomNumber = generateRandomNumber(999990),
            query += `INSERT INTO amenity_by_hotel (hotel_id, amenity_name) values(${randomNumber}, \'${randomAmenity}\')`;
        }
        console.log("Generate hotel successfully!!!");
        const executeTime = process.hrtime(startTime);
        console.log('Execute time: ' + (executeTime[0] + executeTime[1] / 1000000000) + 's');
        client.shutdown();
    } catch (error) {
        console.log(error);
    }

}

mainFunction();

