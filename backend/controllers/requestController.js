const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadRecordsRequestMiddleware");
const db = require("../db");

exports.createRequest = (req, res) => {
  const { type, details, user_id } = req.body;
  const filePath = req.file ? `records_request/${req.file.filename}` : null;

  if (!type || !details || !user_id) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const query = `
    INSERT INTO requests (user_id, type, details, file_path, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [user_id, type, details, filePath, "pending"],
    (err, result) => {
      if (err) {
        console.error("Failed to insert request:", err);
        return res
          .status(500)
          .json({ message: "Server error while saving request" });
      }

      const io = req.app.get("io");
      io.emit("newRequest", {
        id: result.insertId,
        user_id,
        type,
        details,
        file_path: filePath,
        status: "pending",
        created_at: new Date().toISOString(),
      });

      res
        .status(201)
        .json({
          message: "Request submitted successfully",
          id: result.insertId,
        });
    }
  );
};

exports.getUserRequests = (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT id, type, details, file_path, status, created_at, admin_file_path FROM requests WHERE user_id = ?",
    [id],
    (err, results) => {
      if (err)
        return res.status(500).json({ message: "Error fetching requests" });
      res.json(results);
    }
  );
};

exports.getAllRequests = (req, res) => {
  const query = `
    SELECT 
      r.*, 
      u.first_name, 
      u.last_name,
      CONCAT(u.first_name, ' ', u.last_name) AS resident_name
    FROM requests r
    JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err)
      return res.status(500).json({ message: "Error fetching all requests" });
    res.json(results);
  });
};

exports.updateRequestStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query(
    "UPDATE requests SET status = ? WHERE id = ?",
    [status, id],
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "Error updating status" });
      res.json({ message: "Status updated" });
    }
  );
};

exports.uploadAdminFile = (req, res) => {
  const { id } = req.params;
  const filePath = req.file ? `records_request/${req.file.filename}` : null;

  if (!filePath) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const query = `
    UPDATE requests 
    SET admin_file_path = ?, status = 'completed'
    WHERE id = ?
  `;

  db.query(query, [filePath, id], (err, result) => {
    if (err) {
      console.error("Error updating request with admin file:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ message: "File uploaded and request marked as completed" });
  });
};

exports.getRequestStats = (req, res) => {
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
