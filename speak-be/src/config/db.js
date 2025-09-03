const mongoose = require("mongoose");

const MONGOURI = "mongodb+srv://manisandeep369:m6a3n0i0@cluster-2.nryry.mongodb.net/Speaks?retryWrites=true&w=majority&appName=Cluster-2";

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB");
  } catch (e) {
    console.error(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;
