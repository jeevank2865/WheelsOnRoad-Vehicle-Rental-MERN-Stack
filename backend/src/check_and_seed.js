require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Vehicle = require('./models/Vehicle');

async function checkAndSeedVehicles() {
  await connectDB();
  const count = await Vehicle.countDocuments({});
  console.log(`CURRENT VEHICLES IN DB: ${count}`);

  if (count === 0) {
    console.log('Seeding initial vehicle fleet...');
    const seedData = [
      {
        title: 'Yamaha MT-15 V2',
        name: 'MT-15 V2',
        brand: 'Yamaha',
        model: 'MT-15 V2',
        year: 2024,
        vehicleType: 'Superbike',
        category: '150cc - 250cc Sports',
        description: 'Aggressive street styling, light agility and powerful liquid-cooled 155cc engine with Variable Valve Actuation (VVA). Perfect for city commutes and weekend twists.',
        dailyRate: 1200,
        weekdayRate: 1200,
        weekendRate: 1500,
        weekendSurgeRate: 1500,
        securityDeposit: 3000,
        fuelType: 'Petrol',
        transmission: 'Manual',
        seatingCapacity: 2,
        engineCC: 155,
        powerHP: 18.4,
        images: ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop'],
        locationBranch: 'Central Hub',
        isAvailable: true,
        features: ['VVA Engine', 'Assist & Slipper Clutch', 'Dual Channel ABS', 'Digital Speedo'],
        reviews: [{ userName: 'Rahul M.', rating: 5, comment: 'Amazing bike for city riding!' }]
      },
      {
        title: 'Royal Enfield Hunter 350',
        name: 'Hunter 350',
        brand: 'Royal Enfield',
        model: 'Hunter 350',
        year: 2024,
        vehicleType: 'Superbike',
        category: '300cc - 500cc Supersport',
        description: 'Compact, modern roadster design with punchy 349cc J-series engine. Smooth power delivery for city riding and highway cruises.',
        dailyRate: 1400,
        weekdayRate: 1400,
        weekendRate: 1800,
        weekendSurgeRate: 1800,
        securityDeposit: 3500,
        fuelType: 'Petrol',
        transmission: 'Manual',
        seatingCapacity: 2,
        engineCC: 349,
        powerHP: 20.2,
        images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop'],
        locationBranch: 'Central Hub',
        isAvailable: true,
        features: ['J-Series Engine', 'Tripper Navigation', 'Dual Disc ABS'],
        reviews: [{ userName: 'Anil K.', rating: 5, comment: 'Super comfortable exhaust rumble!' }]
      },
      {
        title: 'Mahindra Thar 4x4',
        name: 'Thar 4x4',
        brand: 'Mahindra',
        model: 'Thar LX Petrol AT',
        year: 2024,
        vehicleType: 'Car',
        category: 'Touring SUV',
        description: 'Iconic 4x4 SUV with convertible soft-top option, mStallion 150 TGDi Petrol engine and automatic transmission. Conquer every terrain with style.',
        dailyRate: 3500,
        weekdayRate: 3500,
        weekendRate: 4500,
        weekendSurgeRate: 4500,
        securityDeposit: 10000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        seatingCapacity: 4,
        engineCC: 1997,
        powerHP: 150,
        images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop'],
        locationBranch: 'Central Hub',
        isAvailable: true,
        features: ['4WD Shift-on-Fly', 'Touchscreen Infotainment', 'Convertible Top', 'Alloy Wheels'],
        reviews: [{ userName: 'Vikram S.', rating: 5, comment: 'Best SUV for Coorg weekend trip!' }]
      },
      {
        title: 'Hyundai i20 N Line',
        name: 'i20 N Line',
        brand: 'Hyundai',
        model: 'i20 N Line N8 DCT',
        year: 2024,
        vehicleType: 'Car',
        category: 'Hatchback',
        description: 'Sporty hot hatch powered by 1.0L Turbo GDi engine, paddle shifters, twin tip exhaust note, and sporty leather seats.',
        dailyRate: 2200,
        weekdayRate: 2200,
        weekendRate: 2800,
        weekendSurgeRate: 2800,
        securityDeposit: 6000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        seatingCapacity: 5,
        engineCC: 998,
        powerHP: 120,
        images: ['https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800&auto=format&fit=crop'],
        locationBranch: 'Downtown Apex Hub',
        isAvailable: true,
        features: ['Paddle Shifters', 'Sunroof', 'Bose 7-Speaker Sound', 'Drive Modes'],
        reviews: [{ userName: 'Priya R.', rating: 5, comment: 'Fun hatchback for city & highway!' }]
      }
    ];

    await Vehicle.insertMany(seedData);
    console.log('✅ Seeded 4 initial vehicles successfully!');
  }

  process.exit(0);
}

checkAndSeedVehicles();
