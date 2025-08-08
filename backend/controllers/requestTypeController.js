const db = require("../db"); // Assuming db.js is in the parent directory

exports.createRequestType = (req, res) => {
  const { name, description, price } = req.body; // Added price
  const status = 'draft';

  if (!name) {
    return res.status(400).json({ message: "Request type name is required." });
  }

  const query = `
    INSERT INTO request_types (name, description, price, status)
    VALUES (?, ?, ?, ?)
  `;

  // Added price to the query parameters
  db.query(query, [name, description, price || 0, status], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: "Request type with this name already exists." });
      }
      console.error("Failed to insert request type:", err);
      return res.status(500).json({ message: "Server error while saving request type." });
    }
    res.status(201).json({
      message: "Request type created successfully as draft.",
      id: result.insertId,
    });
  });
};

exports.getAllRequestTypes = (req, res) => {
  const { status } = req.query; // Optional filter by status (e.g., ?status=published)
  let query = "SELECT * FROM request_types";
  const params = [];

  if (status && (status === 'draft' || status === 'published')) {
    query += " WHERE status = ?";
    params.push(status);
  }
  query += " ORDER BY name ASC";

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching request types:", err);
      return res.status(500).json({ message: "Error fetching request types." });
    }
    res.json(results);
  });
};

exports.getRequestTypeById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM request_types WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error fetching request type:", err);
      return res.status(500).json({ message: "Error fetching request type." });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Request type not found." });
    }
    res.json(results[0]);
  });
};
exports.updateRequestType = (req, res) => {
  const { id } = req.params;
  const { name, description, status, price } = req.body; // Added price

  if (!name || !status) {
    return res.status(400).json({ message: "Name and status are required." });
  }
  if (status !== 'draft' && status !== 'published') {
    return res.status(400).json({ message: "Invalid status value. Must be 'draft' or 'published'." });
  }

  const query = `
    UPDATE request_types
    SET name = ?, description = ?, price = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  // Added price to the query parameters
  db.query(query, [name, description, price, status, id], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: "Request type with this name already exists." });
      }
      console.error("Failed to update request type:", err);
      return res.status(500).json({ message: "Server error while updating request type." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Request type not found." });
    }
    res.json({ message: "Request type updated successfully." });
  });
};

exports.deleteRequestType = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM request_types WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Failed to delete request type:", err);
      return res.status(500).json({ message: "Server error while deleting request type." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Request type not found." });
    }
    res.json({ message: "Request type deleted successfully." });
  });
};
