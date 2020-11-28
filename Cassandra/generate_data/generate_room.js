const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
    contactPoints: ['127.0.0.1'],
    keyspace: 'hotel',
    localDataCenter: 'datacenter1'
});
const TOTAL_RECORD = 100000000;
const TOTAL_ROOM_EACH_HOTEL = 100;

const randomBoolean = () => {
    if (Math.floor(Math.random() * (2 - 0)) === 0)
        return false;
    return true;
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
        let query = 'BEGIN UNLOGGED BATCH ';
        let i = 0, j = 0;
        for (i = 0; i <= TOTAL_RECORD / TOTAL_ROOM_EACH_HOTEL; i++) {
            for (j = 0; j < TOTAL_ROOM_EACH_HOTEL; j++) {
                timer(startTime, (i * TOTAL_ROOM_EACH_HOTEL + j));

                if ((i * TOTAL_ROOM_EACH_HOTEL + j) % 3000 === 0) {
                    query += ' APPLY BATCH;';
                    await client.execute(query);
                    query = 'BEGIN UNLOGGED BATCH '
                } else if (i === TOTAL_RECORD) {
                    query += ' APPLY BATCH;';
                    await client.execute(query);
                }
                query += `INSERT INTO room_by_hotel (hotel_id , room_number , is_vailable ) values(${i}, ${j}, ${randomBoolean()})`;
            }
        }
        console.log("Generate room successfully!!!");
        const executeTime = process.hrtime(startTime);
        console.log('Execute time: ' + (executeTime[0] + executeTime[1] / 1000000000) + 's');
        client.shutdown();
    } catch (error) {
        console.log(error);
    }

}

mainFunction();

