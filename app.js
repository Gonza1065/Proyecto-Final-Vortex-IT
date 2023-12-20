const express = require("express");
const app = express();
const cors = require("cors");
require("./db/db");

const usersRoutes = require("./routes/users-routes");
const doctorsRoutes = require("./routes/doctors-routes");
const specialtiesRoutes = require("./routes/specialties-routes");
const appointmentRoutes = require("./routes/appointments-routes");

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", usersRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/specialty", specialtiesRoutes);
app.use("/api/appointment", appointmentRoutes);

app.listen(5000);
console.log("Listening on port 5000");
