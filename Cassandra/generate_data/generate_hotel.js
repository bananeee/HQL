const cassandra = require('cassandra-driver');
const faker = require('faker');

const client = new cassandra.Client({
    contactPoints: ['127.0.0.1'],
    keyspace: 'hotel',
    localDataCenter: 'datacenter1'
});
const TOTAL_RECORD = 999990;

const validName = (name) => {
    for (let i = 0; i < name.length; i++) {
        if (name[i] === "'") {
            name = name.slice(0, i) + "'" + name.slice(i);
            i++;
        }
    }
    return name;
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

        let randomName, randomPhone, query = 'BEGIN UNLOGGED BATCH ';
        for (let i = 0; i <= TOTAL_RECORD; i++) {
            timer(startTime, i);
            
            if (i % 3000 === 0) {
                query += ' APPLY BATCH;';
                await client.execute(query);
                query = 'BEGIN UNLOGGED BATCH '
            } else if (i === TOTAL_RECORD) {
                query += ' APPLY BATCH;';
                await client.execute(query);
            }
            randomName = validName(faker.company.companyName());
            randomPhone = validName(faker.phone.phoneNumber());
            query += `INSERT INTO hotel(hotel_id, name, phone) values(${i}, \'${randomName}\', \'${randomPhone}\')`;
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

