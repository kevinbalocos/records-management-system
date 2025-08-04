const db = require("../db");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const createCorrectionRequest = (req, res) => {
  const {
    user_id,
    record_type,
    record_id,
    field_to_correct,
    current_value,
    requested_value,
  } = req.body;
  const proof_file = req.file ? req.file.filename : null;

  if (!field_to_correct || !requested_value || !proof_file) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql = `INSERT INTO correction_requests 
    (user_id, record_type, record_id, field_to_correct, current_value, requested_value, proof_file)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [
      user_id,
      record_type,
      record_id,
      field_to_correct,
      current_value,
      requested_value,
      proof_file,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res
        .status(201)
        .json({ message: "Correction request submitted successfully." });
    }
  );
};

const approveCorrectionRequest = (req, res) => {
  const { id } = req.params;
  const { status, admin_remarks } = req.body;

  const allowedTables = ["users", "indigency_requests"];
  const allowedFields = ["first_name", "address", "birthdate", "contact_number"];

  const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  };

  const getSql = "SELECT * FROM correction_requests WHERE id = ?";
  db.query(getSql, [id], (err, results) => {
    if (err || results.length === 0) {
      console.error("Fetch error:", err);
      return res.status(404).json({ message: "Request not found" });
    }

    const correction = results[0];
    const {
      record_type,
      record_id,
      field_to_correct,
      requested_value,
      current_value,
    } = correction;

    if (
      !allowedTables.includes(record_type) ||
      !allowedFields.includes(field_to_correct)
    ) {
      return res.status(400).json({ message: "Invalid record type or field" });
    }

    const updateSql = `UPDATE ${record_type} SET ${field_to_correct} = ? WHERE id = ?`;
    db.query(updateSql, [requested_value, record_id], (err2) => {
      if (err2) {
        console.error("DB update error:", err2);
        return res.status(500).json({ message: "Failed to update record" });
      }

      ensureDir("uploads/certificates");
      ensureDir("uploads/originals");

      const certPath = `uploads/certificates/correction-${Date.now()}.pdf`;
      const updatedPath = `uploads/originals/updated-record-${Date.now()}.pdf`;

      try {
        const certDoc = new PDFDocument();
        certDoc.pipe(fs.createWriteStream(certPath));
        certDoc
          .fontSize(16)
          .text("Correction Certificate", { align: "center" });
        certDoc
          .moveDown()
          .fontSize(12)
          .text(
            `This certifies that the ${field_to_correct} for record #${record_id} has been corrected from "${current_value}" to "${requested_value}".`
          );
        certDoc.end();

        const recordDoc = new PDFDocument();
        recordDoc.pipe(fs.createWriteStream(updatedPath));
        recordDoc.fontSize(14).text("Updated Record");
        recordDoc.moveDown().text(`Field: ${field_to_correct}`);
        recordDoc.text(`Corrected Value: ${requested_value}`);
        recordDoc.end();
      } catch (pdfError) {
        console.error("PDF generation error:", pdfError);
        return res.status(500).json({ message: "Failed to generate PDFs" });
      }

      const updateRequestSql = `
        UPDATE correction_requests 
        SET status = ?, admin_remarks = ?, pdf_path = ?, original_pdf_path = ? 
        WHERE id = ?
      `;
      db.query(
        updateRequestSql,
        [status, admin_remarks, certPath, updatedPath, id],
        (err3) => {
          if (err3) {
            console.error("Final update error:", err3);
            return res
              .status(500)
              .json({ message: "Failed to finalize approval" });
          }

          res.status(200).json({
            message: "Correction approved and updated",
            certPath,
            updatedPath,
          });
        }
      );
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
  const query = "SELECT * FROM correction_requests ORDER BY created_at DESC";
  db.query(query, (err, results) => {
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
