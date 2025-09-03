const mongoose = require("mongoose");


const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB !!");
  } catch (e) {
    console.error(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;
