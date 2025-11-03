const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;
const MONGO_ATLAS_URL =process.env.MONGO_URL;

const MONGO_URI_LOCAL=process.env.MONGO_URI_LOCAL
async function mongoConnect() {
  try {
    await mongoose.connect(MONGO_URI_LOCAL);
    console.log('connected to MongoDB successfully ✅');

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    // طباعة تفاصيل الخطأ لتسهيل التصحيح
    console.error(error.message); 
    // يمكنك إنهاء العملية إذا كان الاتصال ضرورياً
    // process.exit(1); 
  }
}
async function mongoDisconnect(){
  await mongoose.disconnect() ; 
}
module.exports = {
  mongoConnect,mongoDisconnect
};