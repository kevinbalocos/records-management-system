const db = require("../db");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

exports.register = (req, res) => {
  const { firstName, lastName, email, password, phoneNumber, role } = req.body;

  if (!firstName || !lastName || !email || !password || !phoneNumber || !role) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const verification_token = uuidv4();

  const sql = `
    INSERT INTO users (first_name, last_name, email, password, phone_number, role, status, is_verified, verification_token)
    VALUES (?, ?, ?, ?, ?, ?, 'pending', 0, ?)
  `;

  db.query(
    sql,
    [firstName, lastName, email, hashedPassword, phoneNumber, role, verification_token],
    (err, result) => {
      if (err) {
        console.error("Error registering user:", err);
        return res.status(500).json({ message: "Registration failed." });
      }

      const verifyURL = `${process.env.BASE_URL}/verify?token=${verification_token}`;
      const mailOptions = {
        from: `"App Support" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: "Verify your email",
        html: `
          <h3>Verify your account</h3>
          <p>Hello ${firstName},</p>
          <p>Click the link below to verify your email address:</p>
          <a href="${verifyURL}">${verifyURL}</a>
          <p>If you did not request this, please ignore this email.</p>
        `,
      };

      transporter.sendMail(mailOptions, (mailErr) => {
        if (mailErr) {
          console.error("Error sending verification email:", mailErr);
          return res.status(500).json({ message: "Failed to send verification email." });
        }

        res.status(201).json({
          message: "Registration successful. Please verify your email.",
        });
      });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Login error." });
    if (results.length === 0)
      return res.status(401).json({ message: "Invalid credentials." });

    const user = results[0];

    if (user.role !== "superadmin" && Number(user.is_verified) !== 1) {
      return res.status(403).json({ message: "Email not verified." });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  });
};

exports.verifyEmail = (req, res) => {
  const token = req.query.token;

  if (!token) return res.status(400).json({ message: "Token is required." });

  db.query(
    "SELECT * FROM users WHERE verification_token = ?",
    [token],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Server error." });
      if (results.length === 0)
        return res.status(400).json({ message: "Invalid token." });

      const user = results[0];

      db.query(
        "UPDATE users SET is_verified = 1, status = 'active', verification_token = NULL WHERE id = ?",
        [user.id],
        (updateErr) => {
          if (updateErr)
            return res.status(500).json({ message: "Verification failed." });
          res.json({ message: "Email verified successfully." });
        }
      );
    }
  );
};

exports.resendVerification = (req, res) => {
  const { email } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = results[0];

    if (user.is_verified) {
      return res.status(400).json({ message: "Email already verified." });
    }

    const newToken = uuidv4();
    db.query(
      "UPDATE users SET verification_token = ? WHERE id = ?",
      [newToken, user.id],
      (updateErr) => {
        if (updateErr) {
          console.error("Failed to update verification token:", updateErr);
          return res.status(500).json({ message: "Failed to update token." });
        }

        const verifyURL = `${process.env.BASE_URL}/verify?token=${newToken}`;
        const mailOptions = {
          from: `"App Support" <${process.env.SMTP_EMAIL}>`,
          to: user.email,
          subject: "Resend: Verify your email",
          html: `
            <h3>Verify your account</h3>
            <p>Hello ${user.first_name},</p>
            <p>Click the link below to verify your email address:</p>
            <a href="${verifyURL}">${verifyURL}</a>
            <p>If you did not request this, please ignore this email.</p>
          `,
        };

        transporter.sendMail(mailOptions, (mailErr) => {
          if (mailErr) {
            console.error("Error sending verification email:", mailErr);
            return res.status(500).json({ message: "Failed to send verification email." });
          }

          res.status(200).json({ message: "New verification email sent." });
        });
      }
    );
  });
};
