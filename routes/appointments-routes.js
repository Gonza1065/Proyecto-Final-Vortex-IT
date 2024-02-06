const express = require("express");
const router = express.Router();

const appointmentsController = require("../controllers/appointments-controller");

const authenticateToken = require("../middleware/authenticateToken");
const verifyTokenAdmin = require("../middleware/verifyTokenAdmin");
const verifyTokenPatient = require("../middleware/verifyTokenPatient");

router.use(authenticateToken);

router.get("/", verifyTokenAdmin, appointmentsController.getAppointments);
router.get("/:id", verifyTokenAdmin, appointmentsController.getAppointmentById);
router.post(
  "/add-appointment",
  verifyTokenAdmin,
  appointmentsController.addAppointment
);
router.patch(
  "/update-appointment/:id",
  verifyTokenAdmin,
  appointmentsController.updateAppointment
);
router.delete(
  "/delete-appointment/:id",
  verifyTokenAdmin,
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
  "/reserve-appointment",
  verifyTokenPatient,
  appointmentsController.reserveAppointment
);
router.post(
  "/cancel-appointment",
  verifyTokenPatient,
  appointmentsController.cancelAppointment
);
router.get(
  "/all-cancelations-by-patient/:id",
  verifyTokenAdmin,
  appointmentsController.allCancelationsByPatient
);

module.exports = router;
