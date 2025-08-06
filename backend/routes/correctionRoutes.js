const express = require("express");
const router = express.Router();
const correctionController = require("../controllers/correctionController");
const uploadProof = require("../middleware/uploadProof"); 
const uploadAdminFile = require("../middleware/uploadAdminFile"); 

router.post(
  "/corrections",
  uploadProof.single("proof_file"),
  correctionController.createCorrectionRequest
);

router.put(
  "/corrections/approve/:id",
  uploadAdminFile.single("admin_file"),
  correctionController.approveCorrectionRequest
);

router.get("/corrections/user/:user_id", correctionController.getUserCorrections);
router.get("/corrections", correctionController.getAllCorrectionRequests);

module.exports = router;
