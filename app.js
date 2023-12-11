const express = require("express");
const app = express();
require("./db/db");

const doctorsRoutes = require("./routes/doctors-routes");
const patientsRoutes = require("./routes/patients-routes");
const specialtiesRoutes = require("./routes/specialties-routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/patients", patientsRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/specialty", specialtiesRoutes);

app.listen(5000);
console.log("Listening on port 5000");
