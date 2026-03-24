const mongoose = require('mongoose');
require('dotenv').config();

console.log("Attempting to connect to:", process.env.MONGO_URI.replace(/:([^:@]+)@/, ':<hidden_password>@'));

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("SUCCESSfully connected to MongoDB Atlas!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("ERROR Details:");
    console.error(err);
    process.exit(1);
  });
