const db = require("../db");
const fs = require("fs");
const path = require("path");

const createCorrectionRequest = (req, res) => {
  const { user_id, record_type, record_id, description } = req.body;
  const proof_file = req.file ? req.file.filename : null;

  if (!record_type || !proof_file || !description) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql = `
    INSERT INTO correction_requests 
    (user_id, record_type, record_id, description, proof_file, status)
    VALUES (?, ?, ?, ?, ?, 'pending')`;

  db.query(sql, [user_id, record_type, record_id, description, proof_file], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: "Correction request submitted successfully." });
  });
};

const approveCorrectionRequest = (req, res) => {
  const { id } = req.params;
  const { status, admin_remarks } = req.body;
  const admin_file = req.file ? req.file.filename : null;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  const getSql = "SELECT * FROM correction_requests WHERE id = ?";
  db.query(getSql, [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    const updateSql = `
      UPDATE correction_requests 
      SET status = ?, admin_remarks = ?, admin_file = ?
      WHERE id = ?`;

    db.query(updateSql, [status, admin_remarks, admin_file, id], (err2) => {
      if (err2) {
        return res.status(500).json({ message: "Failed to approve correction" });
      }

      res.status(200).json({
        message: "Correction request updated successfully",
        admin_file,
      });
    });
  });
};

const getUserCorrections = (req, res) => {
  const userId = req.params.user_id;
  const sql = "SELECT * FROM correction_requests WHERE user_id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user corrections:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(results);
  });
};

const getAllCorrectionRequests = (req, res) => {
  const sql = "SELECT * FROM correction_requests ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching all corrections:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(results);
  });
};

module.exports = {
  createCorrectionRequest,
  approveCorrectionRequest,
  getUserCorrections,
  getAllCorrectionRequests,
};
