require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Vehicle = require('./models/Vehicle');

async function seedFleet() {
  await connectDB();
  console.log('Dropping old vehicles...');
  await Vehicle.deleteMany({});
  console.log('Seeding new fleet with advanced schema...');

  const seedData = [
    {
      title: 'Yamaha MT-15 V2',
      name: 'MT-15 V2',
      brand: 'Yamaha',
      model: 'MT-15 V2',
      year: 2024,
      vehicleType: 'Superbike',
      category: '150cc - 250cc Sports',
      description: 'Experience the aggressive street styling and sporty performance of the Yamaha MT-15 V2. Powered by a 155cc liquid-cooled engine, the MT-15 combines responsive handling, lightweight construction and modern technology, making it suitable for city rides and weekend trips.',
      dailyRate: 1200,
      weekdayRate: 1200,
      weekendRate: 1500,
      weekendSurgeRate: 1500,
      securityDeposit: 3000,
      fuelType: 'Petrol',
      transmission: 'Manual',
      engineCC: 155,
      powerHP: 18.4,
      images: ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop'],
      features: ['Dual Channel ABS', 'LED Headlight', 'Tubeless Tyres', 'Digital Display', 'Bluetooth Connectivity'],
      specifications: {
        'Maximum Power': '18.4 PS @ 10000 rpm',
        'Maximum Torque': '14.1 Nm @ 7500 rpm',
        'Fuel Tank Capacity': '10 L',
        'Kerb Weight': '141 kg',
        'Seat Height': '810 mm'
      },
      includedItems: ['Vehicle rental', 'Valid vehicle documents', 'Basic roadside assistance', 'Helmet for bike rentals'],
      externalLinks: { officialWebsite: 'https://www.yamaha-motor-india.com/yamaha-mt-15-v2.html' },
      isAvailable: true,
      averageRating: 4.8,
      reviewCount: 124,
      reviews: [{ userName: 'Rahul K.', rating: 5, comment: 'Bike was clean and well maintained. Pickup process was very easy.' }]
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
      engineCC: 349,
      powerHP: 20.2,
      images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop'],
      features: ['J-Series Engine', 'Tripper Navigation', 'Dual Disc ABS'],
      specifications: {
        'Maximum Power': '20.2 bhp @ 6100 rpm',
        'Maximum Torque': '27 Nm @ 4000 rpm',
        'Fuel Tank Capacity': '13 L',
        'Kerb Weight': '181 kg'
      },
      includedItems: ['Vehicle rental', 'Valid vehicle documents', 'Helmet'],
      isAvailable: true,
      averageRating: 4.7,
      reviewCount: 89
    },
    {
      title: 'Mahindra Thar 4x4',
      name: 'Thar 4x4',
      brand: 'Mahindra',
      model: 'Thar',
      year: 2024,
      vehicleType: 'Car',
      category: 'Touring SUV',
      description: 'Experience adventure and comfort with the Mahindra Thar. Its bold SUV design, capable powertrain and commanding driving position make it suitable for city driving, highway trips and weekend adventures.',
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
      features: ['Air Conditioning', 'Power Steering', 'Airbags', 'ABS', 'Bluetooth', 'Android Auto', 'Apple CarPlay'],
      specifications: {
        'Engine Power': '150 bhp @ 5000 rpm',
        'Torque': '300 Nm @ 1250-3000 rpm',
        'Mileage': '15.2 kmpl',
        'Boot Space': '600 L',
        'Ground Clearance': '226 mm',
        'Drive Type': '4WD'
      },
      includedItems: ['Vehicle rental', 'Valid vehicle documents', 'Basic roadside assistance'],
      isAvailable: true,
      averageRating: 4.9,
      reviewCount: 210
    },
    {
      title: 'Hyundai i20 N Line',
      name: 'i20 N Line',
      brand: 'Hyundai',
      model: 'i20',
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
      features: ['Paddle Shifters', 'Sunroof', 'Bose 7-Speaker Sound', 'Drive Modes', 'Apple CarPlay'],
      specifications: {
        'Engine Power': '120 PS',
        'Mileage': '20.2 kmpl',
        'Boot Space': '311 L'
      },
      includedItems: ['Vehicle rental', 'Valid documents', 'Customer support'],
      isAvailable: true,
      averageRating: 4.5,
      reviewCount: 45
    },
    {
      title: 'BMW S1000RR M Package',
      name: 'S1000RR M Package',
      brand: 'BMW',
      model: 'S1000RR',
      year: 2024,
      vehicleType: 'Superbike',
      category: '1000cc+ Litre Class',
      description: 'The ultimate track-focused superbike with the M package. Carbon wheels, lightweight battery, and peak performance.',
      dailyRate: 5500,
      weekdayRate: 5500,
      weekendRate: 7500,
      weekendSurgeRate: 7500,
      securityDeposit: 25000,
      fuelType: 'Petrol',
      transmission: 'Quickshifter',
      engineCC: 999,
      powerHP: 210,
      images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop'],
      features: ['Carbon Wheels', 'Quickshifter Up/Down', 'Race Pro Modes', 'DDC Suspension'],
      specifications: {
        'Maximum Power': '210 hp @ 13750 rpm',
        'Maximum Torque': '113 Nm @ 11000 rpm'
      },
      isAvailable: true,
      averageRating: 5.0,
      reviewCount: 22
    },
    {
      title: 'Porsche 911 GT3 RS',
      name: '911 GT3 RS',
      brand: 'Porsche',
      model: '911 GT3 RS',
      year: 2024,
      vehicleType: 'Car',
      category: 'Supercar',
      description: 'A street-legal race car. Extreme aerodynamics, naturally aspirated flat-six engine, and uncompromised track performance.',
      dailyRate: 15000,
      weekdayRate: 15000,
      weekendRate: 20000,
      weekendSurgeRate: 20000,
      securityDeposit: 100000,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      seatingCapacity: 2,
      engineCC: 3996,
      powerHP: 525,
      images: ['https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800&auto=format&fit=crop'],
      features: ['Active Aerodynamics', 'PDK Transmission', 'Carbon Ceramic Brakes'],
      specifications: {
        'Engine Power': '525 PS @ 8500 rpm',
        '0-100 km/h': '3.2 seconds',
        'Drive Type': 'RWD'
      },
      isAvailable: true,
      averageRating: 5.0,
      reviewCount: 15
    }
  ];

  await Vehicle.insertMany(seedData);
  console.log('✅ Seeded new vehicles successfully!');
  process.exit(0);
}

seedFleet();
