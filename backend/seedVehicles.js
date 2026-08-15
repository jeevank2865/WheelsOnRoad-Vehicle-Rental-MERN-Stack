const mongoose = require('mongoose');
const Vehicle = require('./src/models/Vehicle');
require('dotenv').config();

const bikeBrands = ['Ducati', 'BMW', 'Yamaha', 'Kawasaki', 'Honda', 'Suzuki', 'Triumph', 'KTM', 'Aprilia', 'MV Agusta'];
const carBrands = ['Porsche', 'Ferrari', 'Lamborghini', 'McLaren', 'Aston Martin', 'Audi', 'Mercedes', 'BMW', 'Nissan', 'Chevrolet'];

const bikeCategories = ["150cc - 250cc Sports", "300cc - 500cc Supersport", "650cc - 900cc Middleweight", "1000cc+ Litre Class"];
const carCategories = ["Hatchback", "Sedan", "Luxury SUV", "Supercar"];

const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateVehicles = () => {
  const vehicles = [];

  // Generate 100 Superbikes
  for (let i = 1; i <= 100; i++) {
    const brand = randomChoice(bikeBrands);
    const category = randomChoice(bikeCategories);
    const engineCC = randomNumber(300, 1200);
    const dailyRate = randomNumber(1500, 8000);
    vehicles.push({
      title: `${brand} Superbike ${i}`,
      name: `${brand} Superbike ${i}`,
      brand: brand,
      model: `Model-${i}`,
      year: randomNumber(2018, 2024),
      description: `Experience the thrill of the ${brand} Superbike ${i}. Perfect for weekend escapes and track days.`,
      vehicleType: 'Superbike',
      category: category,
      engineCC: engineCC,
      powerHP: Math.floor(engineCC * 0.15),
      dailyRate: dailyRate,
      weekendSurgeRate: Math.floor(dailyRate * 1.2),
      securityDeposit: randomNumber(5000, 20000),
      fuelType: 'Petrol',
      transmission: randomChoice(['Manual', 'Quickshifter']),
      images: ['/uploads/sample-bike.png'],
      locationBranch: 'Central Hub',
      isAvailable: true
    });
  }

  // Generate 100 Supercars
  for (let i = 1; i <= 100; i++) {
    const brand = randomChoice(carBrands);
    const category = randomChoice(carCategories);
    const engineCC = randomNumber(2000, 6000);
    const dailyRate = randomNumber(5000, 25000);
    vehicles.push({
      title: `${brand} Supercar ${i}`,
      name: `${brand} Supercar ${i}`,
      brand: brand,
      model: `Series-${i}`,
      year: randomNumber(2018, 2024),
      description: `The ${brand} Supercar ${i} combines extreme performance with unparalleled luxury.`,
      vehicleType: 'Car',
      category: category,
      engineCC: engineCC,
      powerHP: Math.floor(engineCC * 0.2),
      dailyRate: dailyRate,
      weekendSurgeRate: Math.floor(dailyRate * 1.2),
      securityDeposit: randomNumber(20000, 100000),
      fuelType: 'Petrol',
      transmission: 'Automatic',
      images: ['/uploads/sample-car.png'],
      locationBranch: 'Central Hub',
      isAvailable: true
    });
  }

  return vehicles;
};

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB.');

    const vehiclesToInsert = generateVehicles();
    
    console.log(`Inserting ${vehiclesToInsert.length} vehicles...`);
    await Vehicle.insertMany(vehiclesToInsert);
    
    console.log('Successfully seeded 100 bikes and 100 cars.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seedDB();
