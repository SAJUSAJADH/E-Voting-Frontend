const mongoose = require('mongoose')
require('dotenv').config()

async function Connect() {
  const db = process.env.MONGO_URL
  try {
    await mongoose.connect(db)
  } catch (e) {
    console.log(`can't connect to Database - ${e}`)
  }
}

module.exports = Connect
