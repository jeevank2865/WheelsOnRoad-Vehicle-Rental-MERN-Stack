const mongoose = require('mongoose');
const connectDB = require('./backend/src/config/db');
const Vehicle = require('./backend/src/models/Vehicle');
async function test() {
  await connectDB();
  const count = await Vehicle.countDocuments();
  console.log("Total Vehicles in DB:", count);
  const v = await Vehicle.findOne();
  console.log("Sample Vehicle:", v);
  process.exit();
}
test();
