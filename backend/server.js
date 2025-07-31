const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
require("dotenv").config();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const transporter = require("./mailer");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const createDefaultSuperadmin = async () => {
  const superadminEmail = "superadmin@example.com";
  const superadminPassword = "superadminpassword"; 
  const hashedPassword = bcrypt.hashSync(superadminPassword, 10);

  const query = "SELECT * FROM users WHERE email = ? AND role = 'superadmin'";
  db.query(query, [superadminEmail], (err, results) => {
    if (err) {
      console.error("Error checking for superadmin:", err);
      return;
    }

    if (results.length === 0) {
      const insertQuery = `INSERT INTO users (first_name, last_name, email, password, phone_number, role, status, verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      db.query(
        insertQuery,
        [
          "Super",
          "Admin",
          superadminEmail,
          hashedPassword,
          "0000000000", 
          "superadmin",
          "approved", 
          1, 
        ],
        (insertErr) => {
          if (insertErr) {
            console.error("Error creating default superadmin:", insertErr);
          } else {
            console.log("✅ Default superadmin account created.");
          }
        }
      );
    } else {
      console.log("Superadmin account already exists.");
    }
  });
};

createDefaultSuperadmin();

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Database error during login:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.verified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in." });
    }

    if (user.role === "superadmin") {
      return res.json({
        message: "Login successful",
        role: user.role,
        status: user.status,
      });
    }

    if (user.status === "pending") {
      return res.status(403).json({ message: "Your account is pending approval." });
    }

    if (user.status === "denied") {
      return res.status(403).json({ message: "Your account was denied." });
    }

    res.json({
      message: "Login successful",
      role: user.role,
      status: user.status,
    });
  });
});

app.post("/api/register", (req, res) => {
  const { firstName, lastName, email, password, phoneNumber, role } = req.body; 

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role specified." });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const verificationToken = crypto.randomBytes(32).toString("hex");

  const initialStatus = "pending";

  const query = `INSERT INTO users (first_name, last_name, email, password, phone_number, role, status, verified, verification_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [
      firstName,
      lastName,
      email,
      hashedPassword,
      phoneNumber,
      role,
      initialStatus, 
      0, 
      verificationToken,
    ],
    (err, result) => {
      if (err) {
        console.error("Registration failed:", err);
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "Email already registered." });
        }
        return res
          .status(500)
          .json({ message: "Registration failed due to server error." });
      }

      const verifyURL = `${process.env.BASE_URL}/verify?token=${verificationToken}`;

      transporter
        .sendMail({
          from: `"App Support" <${process.env.SMTP_EMAIL}>`,
          to: email,
          subject: "Verify your email",
          html: `<h3>Verify your account</h3>
                     <p>Hello ${firstName},</p>
                     <p>Click the link to verify your email address for your account: <a href="${verifyURL}">${verifyURL}</a></p>
                     <p>If you did not request this, please ignore this email.</p>`,
        })
        .then(() => {
          res.status(201).json({
            message: "Registered. Check your email for verification.",
          });
        })
        .catch((mailErr) => {
          console.error("Error sending verification email:", mailErr);
          res.status(201).json({
            message:
              "Registered, but failed to send verification email. Please contact support.",
          });
        });
    }
  );
});

app.get("/api/verify", (req, res) => {
  const { token } = req.query;

  const query =
    "UPDATE users SET verified = 1, verification_token = NULL WHERE verification_token = ?";
  db.query(query, [token], (err, result) => {
    if (err || result.affectedRows === 0) {
      return res.status(400).send("Invalid or expired token.");
    }
    res.send("Email verified successfully.");
  });
});

app.post("/api/resend-verification", (req, res) => {
  const { email } = req.body; 

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    const user = results[0];

    if (user.verified) {
      return res.status(400).json({ message: "Email already verified." });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const updateTokenQuery =
      "UPDATE users SET verification_token = ? WHERE id = ?";
    db.query(updateTokenQuery, [verificationToken, user.id], (updateErr) => {
      if (updateErr) {
        console.error("Failed to update verification token:", updateErr);
        return res
          .status(500)
          .json({ message: "Failed to update verification token." });
      }

      const verifyURL = `${process.env.BASE_URL}/verify?token=${verificationToken}`;
      transporter
        .sendMail({
          from: `"App Support" <${process.env.SMTP_EMAIL}>`,
          to: user.email,
          subject: "Verify your email",
          html: `<h3>Verify your account</h3>
                     <p>Hello ${user.first_name},</p>
                     <p>Click the link to verify your email address for your account: <a href="${verifyURL}">${verifyURL}</a></p>
                     <p>If you did not request this, please ignore this email.</p>`,
        })
        .then(() => {
          res.status(200).json({
            message: "New verification email sent.",
          });
        })
        .catch((mailErr) => {
          console.error("Error sending verification email:", mailErr);
          res.status(500).json({
            message: "Failed to send verification email.",
          });
        });
    });
  });
});

app.get("/api/users", (req, res) => {
  const requestingUserRole = req.query.role; 
  const requestingUserId = req.query.userId; 

  let query = "SELECT id, first_name, last_name, email, phone_number, status, role, created_at, updated_at FROM users";
  let params = [];

  if (requestingUserRole === "admin") {
  
    query += " WHERE role = 'user'";
  } else if (requestingUserRole === "superadmin") {
    query += " WHERE id != ?";
    params.push(requestingUserId); 
  } else {
    return res.status(403).json({ message: "Unauthorized to view users." });
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Failed to fetch users:", err);
      return res.status(500).json({ message: "Failed to fetch users" });
    }
    res.json(results);
  });
});

app.post("/api/users/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, requestingUserRole } = req.body; 

  if (!["approved", "denied"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const getUserRoleQuery = "SELECT role FROM users WHERE id = ?";
  db.query(getUserRoleQuery, [id], (err, userResults) => {
    if (err || userResults.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    const targetUserRole = userResults[0].role;

    // Authorization logic
    if (requestingUserRole === "admin") {
      if (targetUserRole !== "user") {
        return res.status(403).json({
          message: "Admins can only change the status of regular users.",
        });
      }
    } else if (requestingUserRole === "superadmin") {

    } else {
      return res.status(403).json({ message: "Unauthorized to perform this action." });
    }

    const updateQuery = "UPDATE users SET status = ? WHERE id = ?";
    db.query(updateQuery, [status, id], (updateErr, result) => {
      if (updateErr) {
        console.error("Failed to update status:", updateErr);
        return res.status(500).json({ message: "Failed to update status" });
      }
      res.json({ message: `User status updated to ${status}` });
    });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
