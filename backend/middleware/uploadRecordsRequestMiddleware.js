const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure this directory exists relative to your server.js
    cb(null, "uploads/records_request/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadProof = multer({ storage });

module.exports = uploadProof;
