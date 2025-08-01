const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const {
  createRequest,
  getUserRequests,
  getAllRequests,
  updateRequestStatus,
  getRequestStats,
} = require("../controllers/requestController");

router.post("/", upload.single("file"), createRequest);
router.get("/user/:id", getUserRequests);
router.get("/", getAllRequests);
router.post("/:id/status", updateRequestStatus);
router.get("/stats/:id", getRequestStats);

module.exports = router;
