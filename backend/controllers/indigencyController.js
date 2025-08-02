const db = require("../db");
const path = require("path");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const createIndigencyRequest = (req, res) => {
  const { purpose, user_id } = req.body;
  const filePath = req.file ? req.file.filename : null;

  if (!purpose || !user_id || !filePath) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const query = `
    INSERT INTO indigency_requests (user_id, purpose, proof_file)
    VALUES (?, ?, ?)
  `;

  db.query(query, [user_id, purpose, filePath], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    res.status(201).json({ message: "Request submitted successfully" });
  });
};

const getUserIndigencyRequests = (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT * FROM indigency_requests
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err)
      return res.status(500).json({ message: "Failed to fetch requests" });

    res.json(results);
  });
};

const approveIndigencyRequest = (req, res) => {
  const requestId = req.params.id;

  const fetchRequest = `
    SELECT ir.*, u.first_name, u.last_name
    FROM indigency_requests ir
    JOIN users u ON ir.user_id = u.id
    WHERE ir.id = ?
  `;

  db.query(fetchRequest, [requestId], (err, results) => {
    if (err || results.length === 0)
      return res.status(500).json({ message: "Request not found" });

    const request = results[0];
    const fullName = `${request.first_name} ${request.last_name}`;
    const dateIssued = new Date().toLocaleDateString();
    const pdfFilename = `certificate_${request.id}.pdf`;
    const pdfPath = path.join(__dirname, "../certificates", pdfFilename);

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));

    doc
      .fontSize(20)
      .text("Barangay Certificate of Indigency", { align: "center" });
    doc.moveDown();
    doc
      .fontSize(12)
      .text(
        `This certifies that ${fullName}, a resident of Barangay [YourBarangay], is classified as indigent and this certificate is issued upon their request for the purpose of ${request.purpose}.`
      );
    doc.moveDown();
    doc.text(`Issued on ${dateIssued}`);
    doc.end();

    const updateQuery = `
    UPDATE indigency_requests
    SET is_approved = 1, status = 'approved', approved_at = NOW(), pdf_path = ?
    WHERE id = ?
    `;

    db.query(updateQuery, [pdfFilename, requestId], (err2) => {
      if (err2) return res.status(500).json({ message: "Update failed" });
      res.json({
        message: "Request approved and certificate generated",
        pdf_path: pdfFilename,
      });
    });
  });
};

const downloadCertificate = (req, res) => {
  const { id } = req.params;

  const query = `SELECT pdf_path FROM indigency_requests WHERE id = ? AND is_approved = 1`;
  db.query(query, [id], (err, results) => {
    if (err || results.length === 0)
      return res.status(404).json({ message: "No certificate available" });

    const filePath = path.join(
      __dirname,
      "../certificates",
      results[0].pdf_path
    );
    res.download(filePath);
  });
};

const getAllIndigencyRequests = (req, res) => {
  const query = `
    SELECT ir.*, u.first_name, u.last_name
    FROM indigency_requests ir
    JOIN users u ON ir.user_id = u.id
    ORDER BY ir.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching indigency requests:", err);
      return res.status(500).json({ message: "Failed to fetch requests" });
    }

    res.json(results);
  });
};

module.exports = {
  createIndigencyRequest,
  getUserIndigencyRequests,
  approveIndigencyRequest,
  downloadCertificate,
  getAllIndigencyRequests,
};
