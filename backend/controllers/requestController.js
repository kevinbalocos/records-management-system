const db = require("../db");

exports.createRequest = (req, res) => {
  const { type, details, user_id } = req.body;
  const filePath = req.file ? req.file.filename : null;

  if (!type || !details || !user_id || !filePath) {
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

exports.getUserRequests = (req, res) => {
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

exports.getAllRequests = (req, res) => {
  db.query("SELECT * FROM requests", (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching all requests" });
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
      if (err) return res.status(500).json({ message: "Error updating status" });
      res.json({ message: "Status updated" });
    }
  );
};

exports.getRequestStats = (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const statsQuery = `
    SELECT
      (SELECT COUNT(*) FROM requests WHERE user_id = ?) AS total,
      (SELECT COUNT(*) FROM requests WHERE status = 'pending' AND user_id = ?) AS pending,
      (SELECT COUNT(*) FROM requests WHERE status = 'completed' AND user_id = ?) AS completed,
      (SELECT COUNT(*) FROM requests WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE()) AND user_id = ?) AS thisMonth
  `;

  db.query(statsQuery, [userId, userId, userId, userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching stats" });
    res.json(results[0]);
  });
};


