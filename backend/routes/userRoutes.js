const express = require("express");
const router = express.Router();
const {
  getAllUsers, 
  updateUserStatus,
  getUserById
} = require("../controllers/userController");

router.get("/", getAllUsers); 
router.post("/:id/status", updateUserStatus); 
router.get("/:id", getUserById); 

module.exports = router;
