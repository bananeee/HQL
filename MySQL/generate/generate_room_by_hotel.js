const mysql = require('mysql')
const faker = require('faker')

const TOTAL_RECORD = 5000000;
const TOTAL_ROOM_EACH_HOTEL = 100;
const LOOP = 5;

const randomBoolean = () => {
    if (Math.floor(Math.random() * (2 - 0)) === 0)
        return false;
    return true;
}

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

const exe = async (connection, query) => {
    connection.query(query)
}

const mainFuction = (async () => {
    try {
        let connection = mysql.createPool({
            connectionLimit: 100,
            host: 'localhost',
            user: 'root',
            database: 'hotel',
            port: 3307,
            multipleStatements: true,
            connectTimeout: 3600000
        })
        

        let query = "START TRANSACTION;";
        let i = 0, j = 0;
        for (i = 0; i <= TOTAL_RECORD / TOTAL_ROOM_EACH_HOTEL; i++) {
            for (j = 0; j < TOTAL_ROOM_EACH_HOTEL; j++) {
                timer(startTime, (i * TOTAL_ROOM_EACH_HOTEL + j));

                if ((i * TOTAL_ROOM_EACH_HOTEL + j) % 3000 === 0) {
                    query += "COMMIT;";
                    await exe(connection, query);
                    query = "START TRANSACTION;"
                } else if ((i * TOTAL_ROOM_EACH_HOTEL + j) === TOTAL_RECORD) {
                    query += "COMMIT;";
                    await exe(connection, query);
                }
                // query += `INSERT INTO room_by_hotel (hotel_id , room_number , is_vailable ) values(${i + x * (TOTAL_RECORD / LOOP)}, ${j}, ${randomBoolean()});`;
                query += `INSERT INTO room_by_hotel (hotel_id , room_number , is_vailable ) values(${i}, ${j}, ${randomBoolean()});`;
            }
        }
        
        await connection.end();
        
    } catch (error) {

    }
});

// (async () => {
//     for (let x = 0; x < LOOP; x++)
//         await mainFuction(x);
// })();
const startTime = process.hrtime();
mainFuction().then(() => {
    console.log("Generate room successfully!!!");
    const executeTime = process.hrtime(startTime);
    console.log("Execute time: " + (executeTime[0] + executeTime[1] / 1000000000) + "s");
})