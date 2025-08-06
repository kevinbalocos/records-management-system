const express = require("express");
const router = express.Router();
const requestTypeController = require("../controllers/requestTypeController");

router.post("/", requestTypeController.createRequestType);
router.get("/", requestTypeController.getAllRequestTypes);
router.get("/:id", requestTypeController.getRequestTypeById);
router.put("/:id", requestTypeController.updateRequestType);
router.delete("/:id", requestTypeController.deleteRequestType);

module.exports = router;
