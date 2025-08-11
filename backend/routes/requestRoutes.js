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
  markAsPaid,
  uploadPaymentReceipt,
} = require("../controllers/requestController");
const uploadReceipt = require("../middleware/uploadReceiptMiddleware");

router.post(
  "/",
  upload.fields([
    { name: "medical_abstract", maxCount: 1 },
    { name: "medical_request", maxCount: 1 },
    { name: "hospital_bill", maxCount: 1 },
    { name: "social_case_study", maxCount: 1 },
    { name: "patient_id_file", maxCount: 1 },
    { name: "representative_id_file", maxCount: 1 }
  ]),
  createRequest
);

router.get("/", getAllRequests);
router.get("/user/:id", getUserRequests);
router.post("/:id/status", updateRequestStatus);
router.get("/stats", getRequestStats);
router.post("/:id/upload", upload.single("file"), uploadAdminFile);
router.put("/:id/payment", markAsPaid);
router.post("/:id/receipt", uploadReceipt.single("file"), uploadPaymentReceipt);

module.exports = router;
