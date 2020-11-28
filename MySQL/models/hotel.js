const mysql = require('mysql')
const faker = require('faker')

const TOTAL_RECORD = 100000000;
const TOTAL_ROOM_EACH_HOTEL = 100;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'hotel',
    port: 3307,
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
    var query = "CREATE TABLE hotel(hotel_id int PRIMARY KEY, name varchar(255), phone varchar(255));";
    // var query = 'INSERT INTO hotel(hotel_id, name, phone) VALUES(0, "minh", "0123");INSERT INTO hotel(hotel_id, name, phone) VALUES(1, "minh", "0123");'
    connection.query(query);
    console.log("done!")

    connection.end();
} catch (error) {

}