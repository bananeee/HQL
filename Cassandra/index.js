const cassandra = require('cassandra-driver');

const createHotelModel = require('./models/hotels');
const createRoomModel = require('./models/room_by_hotel_id');
const createAmenityModel = require('./models/amenity_by_hotel_id');

// createHotelModel();
// createRoomModel();
createAmenityModel();
