const bcrypt = require("bcrypt");
const db = require("../db");

const createDefaultSuperadmin = () => {
  const superadminEmail = "superadmin@example.com";
  const superadminPassword = "superadminpassword";
  const hashedPassword = bcrypt.hashSync(superadminPassword, 10);

  const query = "SELECT * FROM users WHERE email = ? AND role = 'superadmin'";
  db.query(query, [superadminEmail], (err, results) => {
    if (err) {
      console.error("Error checking superadmin:", err);
      return;
    }

    if (results.length === 0) {
      const insertQuery = `
        INSERT INTO users (first_name, last_name, email, password, phone_number, role, status, verified)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(
        insertQuery,
        ["Super", "Admin", superadminEmail, hashedPassword, "0000000000", "superadmin", "approved", 1],
        (insertErr) => {
          if (insertErr) console.error("Error creating superadmin:", insertErr);
          else console.log("Default superadmin created.");
        }
      );
    }
  });
};

module.exports = { createDefaultSuperadmin };
