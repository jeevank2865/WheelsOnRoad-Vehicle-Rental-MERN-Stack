require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');

async function checkUsers() {
  await connectDB();
  const users = await User.find({}, 'name email role');
  console.log('--- REGISTERED USERS ---');
  users.forEach(u => {
    console.log(`Name: ${u.name} | Email: ${u.email} | Role: ${u.role}`);
  });
  process.exit(0);
}

checkUsers();
