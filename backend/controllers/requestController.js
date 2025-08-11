const db = require("../db");
const axios = require("axios");
require("dotenv").config();

exports.createRequest = (req, res) => {
  const {
    type,
    details = null,
    user_id,
    patient_name,
    age,
    gender,
    street,
    municipality,
    hospital_admitted,
  } = req.body;

  // files from multer.fields()
  const files = req.files || {};
  const medicalAbstractPath = files.medical_abstract ? `records_request/${files.medical_abstract[0].filename}` : null;
  const medicalRequestPath = files.medical_request ? `records_request/${files.medical_request[0].filename}` : null;
  const hospitalBillPath = files.hospital_bill ? `records_request/${files.hospital_bill[0].filename}` : null;
  const socialCaseStudyPath = files.social_case_study ? `records_request/${files.social_case_study[0].filename}` : null;
  const patientIdPath = files.patient_id_file ? `records_request/${files.patient_id_file[0].filename}` : null;
  const representativeIdPath = files.representative_id_file ? `records_request/${files.representative_id_file[0].filename}` : null;

  // basic validation
  if (!type || !user_id || !patient_name || !age || !gender || !street || !municipality || !hospital_admitted) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const query = `
    INSERT INTO requests (
      user_id, type, details, patient_name, age, gender, street, municipality, hospital_admitted,
      medical_abstract_path, medical_request_path, hospital_bill_path,
      social_case_study_path, patient_id_path, representative_id_path, status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    user_id, type, details, patient_name, age, gender, street, municipality, hospital_admitted,
    medicalAbstractPath, medicalRequestPath, hospitalBillPath,
    socialCaseStudyPath, patientIdPath, representativeIdPath, "pending"
  ];

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Failed to insert request:", err);
      return res.status(500).json({ message: "Server error while saving request" });
    }

    const io = req.app.get("io");
    if (io) {
      io.emit("newRequest", {
        id: result.insertId,
        user_id,
        type,
        patient_name,
        age,
        gender,
        street,
        municipality,
        hospital_admitted,
        medical_abstract_path: medicalAbstractPath,
        medical_request_path: medicalRequestPath,
        hospital_bill_path: hospitalBillPath,
        social_case_study_path: socialCaseStudyPath,
        patient_id_path: patientIdPath,
        representative_id_path: representativeIdPath,
        status: "pending",
        created_at: new Date().toISOString(),
      });
    }

    res.status(201).json({
      message: "Request submitted successfully",
      id: result.insertId,
    });
  });
};

exports.getUserRequests = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      id,
      type,
      details,
      patient_name,
      age,
      gender,
      street,
      municipality,
      hospital_admitted,
      medical_abstract_path,
      medical_request_path,
      hospital_bill_path,
      social_case_study_path,
      patient_id_path,
      representative_id_path,
      status,
      created_at
    FROM requests
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching user requests:", err);
      return res.status(500).json({ message: "Error fetching requests" });
    }
    res.json(results);
  });
};

exports.getAllRequests = (req, res) => {
  const query = `
    SELECT
      r.id,
      r.type,
      r.details,
      r.patient_name,
      r.age,
      r.gender,
      r.street,
      r.municipality,
      r.hospital_admitted,
      r.medical_abstract_path,
      r.medical_request_path,
      r.hospital_bill_path,
      r.social_case_study_path,
      r.patient_id_path,
      r.representative_id_path,
      r.status,
      r.created_at,
      u.first_name,
      u.last_name,
      CONCAT(u.first_name, ' ', u.last_name) AS resident_name
    FROM requests r
    JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching all requests:", err);
      return res.status(500).json({ message: "Error fetching all requests" });
    }
    res.json(results);
  });
};

exports.updateRequestStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query("UPDATE requests SET status = ? WHERE id = ?", [status, id], (err, result) => {
    if (err) {
      console.error("Error updating status:", err);
      return res.status(500).json({ message: "Error updating status" });
    }
    res.json({ message: "Status updated" });
  });
};

exports.uploadAdminFile = (req, res) => {
  const { id } = req.params;
  const filePath = req.file ? `records_request/${req.file.filename}` : null;

  if (!filePath) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const query = `
    UPDATE requests
    SET admin_file_path = ?, status = 'completed', payment_status = 'verified'
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

exports.markAsPaid = (req, res) => {
  const { id } = req.params;

  db.query("UPDATE requests SET payment_status = 'paid' WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error updating payment status:", err);
      return res.status(500).json({ message: "Error updating payment status" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: "Payment marked as paid" });
  });
};

exports.uploadPaymentReceipt = (req, res) => {
  const { id } = req.params;
  const filePath = req.file ? `payment_receipts/${req.file.filename}` : null;

  if (!filePath) {
    return res.status(400).json({ message: "No receipt uploaded" });
  }

  const query = `
    UPDATE requests
    SET receipt_path = ?, payment_status = 'receipt_submitted'
    WHERE id = ?
  `;

  db.query(query, [filePath, id], (err) => {
    if (err) {
      console.error("Error uploading receipt:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.status(200).json({ message: "Receipt uploaded successfully" });
  });
};
