const mysql = require("mysql");
const faker = require("faker");

const TOTAL_RECORD = 1000000;

const connection = mysql.createPool({
    connectionLimit: 100,
    host: "localhost",
    user: "root",
    database: "hotel",
    port: 3306,
    multipleStatements: true,
    connectTimeout: 3600000,
});

const generateRandomNumber = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
};

const timer = (startTime, curRow) => {
    if (curRow % (TOTAL_RECORD / 10) === 0) {
        let timePassed = process.hrtime(startTime);
        timePassed = timePassed[0] + timePassed[1] / 1000000000;
        let timeLeft = (timePassed * (TOTAL_RECORD - curRow)) / curRow;
        console.log(
            curRow / (TOTAL_RECORD / 100) + "%. Time left: " + timeLeft + "s"
        );
    }
};

const mainFuction = async () => {
    try {
        let query = "START TRANSACTION;";
        let i = 0,
            j = 0;
        for (i = 0; i <= TOTAL_RECORD; i++) {
            timer(startTime, i);

            if (i % 1000 === 0) {
                query += "COMMIT;";
                await new Promise((resolve) => {
                    connection.query(query, function (error, results, fields) {
                        if (error) throw error;
                        resolve();
                    });
                });
                query = "START TRANSACTION;";
            } else if (i === TOTAL_RECORD) {
                query += "COMMIT;";
                await new Promise((resolve) => {
                    connection.query(query, function (error, results, fields) {
                        if (error) throw error;
                        resolve();
                    });
                });

            }
            query += `INSERT INTO amenity_by_hotel (amenity_id, hotel_id) values(${i}, ${generateRandomNumber(99990)});`;
        }
    } catch (error) {}
};

const startTime = process.hrtime();

mainFuction().then(() => {
    connection.end();
    console.log("Generate amenity by hotel successfully!!!");
    const executeTime = process.hrtime(startTime);
    console.log(
        "Execute time: " + (executeTime[0] + executeTime[1] / 1000000000) + "s"
    );
});
