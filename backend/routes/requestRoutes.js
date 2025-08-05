const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadRecordsRequestMiddleware");
const { uploadAdminFile } = require("../controllers/requestController");


const {
  createRequest,
  getUserRequests,
  getAllRequests,
  updateRequestStatus,
  getRequestStats,
} = require("../controllers/requestController");

router.post("/", upload.single("file"), createRequest);
router.get("/", getAllRequests);
router.get("/user/:id", getUserRequests);
router.post("/:id/status", updateRequestStatus);
router.get("/stats", getRequestStats);
router.post("/:id/upload", upload.single("file"), uploadAdminFile);

module.exports = router;
