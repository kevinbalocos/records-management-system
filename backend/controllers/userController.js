const db = require("../db");

exports.getAllUsers = (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching users" });
    res.json(results);
  });
};

exports.getUserById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Error fetching user" });
    res.json(result[0]);
  });
};

exports.updateUserStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query("UPDATE users SET status = ? WHERE id = ?", [status, id], (err) => {
    if (err) return res.status(500).json({ message: "Error updating user status" });
    res.json({ message: "User status updated" });
  });
};
