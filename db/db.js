const mongoose = require("mongoose");

const MONGO_URL = "mongodb://127.0.0.1/system_doctors";

mongoose
  .connect(MONGO_URL)
  .then((db) => console.log("Data base connected"))
  .catch((err) => console.log("Error with the connection of the data base", err));
