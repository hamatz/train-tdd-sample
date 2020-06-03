const mongoose = require("mongoose");
const debug = require("debug")("tdd-train:mongodb-connecter");

const connect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://<you should use your own information for this>",
      { useUnifiedTopology: true,  useNewUrlParser: true  } 
    );
  } catch (err) {
    debug("Error connectiong to mongodb");
    debug(err);
  }
};

module.exports = { connect };
