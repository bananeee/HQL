const mysql = require("mysql");
const faker = require("faker");

const TOTAL_RECORD = 1000000;
const TOTAL_ROOM_EACH_HOTEL = 100;

const connection = mysql.createPool({
    connectionLimit: 100,
    host: "localhost",
    user: "root",
    database: "hotel",
    port: 3306,
    multipleStatements: true,
    connectTimeout: 3600000,
});

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

const exeQuery = async (connection, query) => {
    await connection.query(query, function (error, results, fields) {
        if (error) throw error;
    });
};

const generateRandomAmenity = () => {
    const amenities = [
        "Personal care",
        "Coffee Kit",
        "Free breakfast",
        "Free WiFi internet access",
        "Free parking",
        "Fitness center",
        "Room Purification",
        "Pool",
        "Kid-friendly Rooms and Products",
        "Pet-friendly Rooms",
        "Champagne Bar",
        "Daily Newspaper",
        "Laundry Services",
        "Spa",
        "Cribs & Cots for Children",
        "24-Hour Guest Reception",
        "Onsite Dining",
    ];
    return amenities[Math.floor(Math.random() * amenities.length)];
};

const generateRandomNumber = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
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
            randomAmenity = generateRandomAmenity();

            query += `INSERT INTO amenity_by_hotel (amenity_id, amenity_name) values(${i}, \'${randomAmenity}\');`;
        }
    } catch (error) {}
};

const startTime = process.hrtime();

mainFuction().then(() => {
    connection.end();
	console.log("Generate amenity successfully!!!");
    const executeTime = process.hrtime(startTime);
    console.log(
        "Execute time: " + (executeTime[0] + executeTime[1] / 1000000000) + "s"
    );
});
