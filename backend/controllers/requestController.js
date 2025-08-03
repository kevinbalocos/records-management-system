const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware"); // Assuming this middleware is configured
const db = require("../db"); // Assuming the database connection is configured

// Controller to create a new request
const createRequest = (req, res) => {
  const { type, details, user_id } = req.body;
  const filePath = req.file ? req.file.filename : null;

  if (!type || !details || !user_id) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const query = `
    INSERT INTO requests (user_id, type, details, file_path, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [user_id, type, details, filePath, "pending"], (err, result) => {
    if (err) {
      console.error("Failed to insert request:", err);
      return res.status(500).json({ message: "Server error while saving request" });
    }

    const io = req.app.get("io");
    io.emit("newRequest", {
      id: result.insertId,
      user_id,
      type,
      details,
      file_path: filePath,
      status: "pending",
      created_at: new Date().toISOString()
    });

    res.status(201).json({ message: "Request submitted successfully", id: result.insertId });
  });
};

// Controller to get a user's requests
const getUserRequests = (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT id, type, details, file_path, status, created_at FROM requests WHERE user_id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Error fetching requests" });
      res.json(results);
    }
  );
};

// Controller to get all requests
const getAllRequests = (req, res) => {
  db.query("SELECT * FROM requests", (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching all requests" });
    res.json(results);
  });
};

// Controller to update a request status
const updateRequestStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query(
    "UPDATE requests SET status = ? WHERE id = ?",
    [status, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error updating status" });
      res.json({ message: "Status updated" });
    }
  );
};

// Controller to get global request statistics for the admin dashboard
const getAllRequestsStats = (req, res) => {
    const statsQuery = `
      SELECT
        (SELECT COUNT(*) FROM requests) AS total,
        (SELECT COUNT(*) FROM requests WHERE status = 'pending') AS pending,
        (SELECT COUNT(*) FROM requests WHERE status = 'completed') AS completed,
        (SELECT COUNT(*) FROM requests WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())) AS thisMonth
    `;

    db.query(statsQuery, (err, results) => {
      if (err) {
        console.error("Error fetching stats:", err);
        return res.status(500).json({ message: "Error fetching stats" });
      }
      res.json(results[0]);
    });
};

// Define the routes
router.post("/", upload.single("file"), createRequest);
router.get("/", getAllRequests); // Route for fetching all requests
router.get("/user/:id", getUserRequests);
router.post("/:id/status", updateRequestStatus);
router.get("/stats", getAllRequestsStats); // New route for fetching global stats

module.exports = router;
