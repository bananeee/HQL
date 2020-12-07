const mysql = require('mysql')
const faker = require('faker')

const TOTAL_RECORD = 100000000;
const TOTAL_ROOM_EACH_HOTEL = 100;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'hotel',
    port: 3306,
    multipleStatements: true
})
const timer = (startTime, curRow) => {
    if (curRow % (TOTAL_RECORD / 10) === 0) {
        let timePassed = process.hrtime(startTime);
        timePassed = timePassed[0] + timePassed[1] / 1000000000;
        let timeLeft = timePassed * (TOTAL_RECORD - curRow) / curRow;
        console.log(curRow / (TOTAL_RECORD / 100) + "%. Time left: " + timeLeft + "s");
    }
}
try {
    connection.connect();
    let query = "CREATE TABLE amenity (amenity_id int, amenity_name varchar(255), PRIMARY KEY (amenity_id));";
    connection.query(query);
    console.log("amenity table created!!!");

    connection.end();
} catch (error) {

}