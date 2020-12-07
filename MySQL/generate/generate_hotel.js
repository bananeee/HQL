const mysql = require('mysql')
const faker = require('faker')

const TOTAL_RECORD = 1000000;

const connection = mysql.createConnection({
    // connectionLimit: 1000,
    host: 'localhost',
    user: 'root',
    database: 'hotel',
    port: 3306,
    multipleStatements: true,
    connectTimeout: 3600000
})
const validName = (name) => {
    for (let i = 0; i < name.length; i++) {
        if (name[i] === "'") {
            name = name.slice(0, i) + "'" + name.slice(i);
            i++;
        }
        if (i >= 20)
            return name;
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
const mainFuction = (async () => {
    try {
        const startTime = process.hrtime();

        let randomName, randomPhone, query = "START TRANSACTION;";
        for (let i = 0; i <= TOTAL_RECORD; i++) {
            timer(startTime, i);

            if (i % 10000 === 0) {
                query += "COMMIT;";
                connection.query(query);
                
                query = "START TRANSACTION;"
            } else if (i === TOTAL_RECORD) {
                query += "COMMIT;";
                connection.query(query);
            }
            randomName = validName(faker.company.companyName());
            randomPhone = validName(faker.phone.phoneNumber());
            query += `INSERT INTO hotel(hotel_id, name, phone) values(${i}, \"${randomName}\", \"${randomPhone}\");`;
        }
        console.log("Generate hotel successfully!!!");
        const executeTime = process.hrtime(startTime);
        connection.end();
        console.log("Execute time: " + (executeTime[0] + executeTime[1] / 1000000000) + "s");
    } catch (error) {

    }
})

mainFuction();