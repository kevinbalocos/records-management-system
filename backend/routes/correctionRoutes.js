const express = require("express");
const router = express.Router();
const correctionController = require("../controllers/correctionController");
const uploadProof = require("../middleware/uploadProof");

router.post("/corrections", uploadProof.single("proof_file"), correctionController.createCorrectionRequest);
router.put("/corrections/approve/:id", correctionController.approveCorrectionRequest);

router.get("/corrections/user/:user_id", correctionController.getUserCorrections);
router.get("/corrections", correctionController.getAllCorrectionRequests);

module.exports = router;
