const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadRecordsRequestMiddleware");
const {
  createRequest,
  getUserRequests,
  getAllRequests,
  updateRequestStatus,
  getRequestStats,
  uploadAdminFile,
} = require("../controllers/requestController");

router.post("/", upload.single("file"), createRequest);
router.get("/", getAllRequests);
router.get("/user/:id", getUserRequests);
router.post("/:id/status", updateRequestStatus);
router.get("/stats", getRequestStats); // This is the global stats endpoint
router.post("/:id/upload", upload.single("file"), uploadAdminFile);

module.exports = router;
