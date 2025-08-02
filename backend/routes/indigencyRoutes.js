const express = require("express");
const router = express.Router();
const indigencyController = require("../controllers/indigencyController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

router.post("/", upload.single("proof_file"), indigencyController.createIndigencyRequest);
router.get("/", indigencyController.getAllIndigencyRequests);
router.get("/user/:userId", indigencyController.getUserIndigencyRequests);
router.put("/approve/:id", indigencyController.approveIndigencyRequest);
router.get("/download/:id", indigencyController.downloadCertificate);

module.exports = router;
