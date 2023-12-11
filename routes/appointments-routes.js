const express = require("express");
const router = express.Router();

const appointmentsController = require("../controllers/appointments-controller");

router.post("/add-appointment", appointmentsController.addAppointment);
router.patch(
  "/update-appointment/:id",
  appointmentsController.updateAppointment
);
router.delete(
  "/delete-appointment/:id",
  appointmentsController.deleteAppointment
);
router.get(
  "/get-appointments-by-doctor/:id",
  appointmentsController.getAppointmentsByDoctor
);
router.get(
  "/get-appointments-by-patients/:id",
  appointmentsController.getAppointmentsByPatient
);
router.post(
  "/reserve-appointment/:id",
  appointmentsController.reserveAppointment
);
router.delete(
  "/cancel-appointment/:id",
  appointmentsController.cancelAppointment
);
router.get("/all-cancelations", appointmentsController.allCancelations);

module.exports = router;
