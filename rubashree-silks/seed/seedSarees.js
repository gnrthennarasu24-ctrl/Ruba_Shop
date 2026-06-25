// Run with: npm run seed
// Populates the "sarees" collection with 50 handloom + 50 powerloom sarees.
// Safe to re-run - it clears the collection first each time.

require('dotenv').config();
const mongoose = require('mongoose');
const Saree = require('../models/Saree');

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PALETTE = [
  { a: '#6B1E2B', b: '#C8932A' },
  { a: '#1F5C57', b: '#E3B655' },
  { a: '#3B2A6B', b: '#C8932A' },
  { a: '#8C2F1A', b: '#E3B655' },
  { a: '#1B4965', b: '#C8932A' },
  { a: '#5B2C6F', b: '#E3B655' },
  { a: '#2D6A4F', b: '#C8932A' },
  { a: '#7A2048', b: '#E3B655' },
  { a: '#9C4A1A', b: '#1F5C57' },
  { a: '#4A1420', b: '#C8932A' },
  { a: '#27496D', b: '#E3B655' },
  { a: '#6E5A1E', b: '#7A2048' },
];

const WEAVE_H = ['Kanjivaram', 'Banarasi', 'Mysore Silk', 'Pochampally Ikat', 'Chanderi', 'Sambalpuri', 'Bomkai', 'Jamdani', 'Gadwal', 'Uppada'];
const DESC_H = ['Temple Border', 'Peacock Motif', 'Checked Zari', 'Floral Butta', 'Rudraksha Border'];

const WEAVE_P = ['Printed Georgette', 'Chiffon', 'Crepe', 'Cotton Print', 'Linen', 'Tussar Print', 'Net', 'Satin', 'Organza', 'Synthetic Silk'];
const DESC_P = ['Floral Print', 'Polka Dot', 'Bandhani Print', 'Abstract Print', 'Geometric Print'];

function priceFor(type, rng) {
  if (type === 'handloom') {
    const base = 3499 + Math.floor(rng() * 9500);
    return Math.round(base / 50) * 50 - 1;
  }
  const base = 499 + Math.floor(rng() * 2000);
  return Math.round(base / 50) * 50 - 1;
}

function buildDocs() {
  const docs = [];
  let id = 1;
  let rng = mulberry32(7);

  WEAVE_H.forEach((weave, wi) => {
    DESC_H.forEach((desc, di) => {
      const colorSeed = (wi * 5 + di) % PALETTE.length;
      docs.push({
        sareeId: 'h' + id,
        type: 'handloom',
        weave,
        descriptor: desc,
        name: `${weave} ${desc} Saree`,
        price: priceFor('handloom', rng),
        colorA: PALETTE[colorSeed].a,
        colorB: PALETTE[colorSeed].b,
        seed: id,
      });
      id++;
    });
  });

  id = 1;
  WEAVE_P.forEach((weave, wi) => {
    DESC_P.forEach((desc, di) => {
      const colorSeed = (wi * 5 + di + 3) % PALETTE.length;
      docs.push({
        sareeId: 'p' + id,
        type: 'powerloom',
        weave,
        descriptor: desc,
        name: `${weave} ${desc} Saree`,
        price: priceFor('powerloom', rng),
        colorA: PALETTE[colorSeed].a,
        colorB: PALETTE[colorSeed].b,
        seed: id + 100,
      });
      id++;
    });
  });

  return docs;
}

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI. Add it to your .env file before seeding.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB. Clearing existing sarees...');

  await Saree.deleteMany({});
  const docs = buildDocs();
  await Saree.insertMany(docs);

  console.log(`Seeded ${docs.length} sarees (50 handloom + 50 powerloom).`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
