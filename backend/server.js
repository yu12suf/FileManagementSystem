const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path"); // ADDED for potential future use of static file path

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configure storage for multer
const storage = multer.memoryStorage(); // Use memory storage to handle files as buffers
const upload = multer({ storage });

// Create MySQL connection
const db = mysql.createPool({
  host: "localhost",
  user: "root", // Default XAMPP user
  password: "", // Default XAMPP password (usually empty)
  database: "file_management", // Your database name
  port: 3307, // Port where MySQL is running
});

// API Route to handle inserting records
app.post("/api/records", upload.single("uploadedFile"), (req, res) => {
  // Validate UPIN
  /*if (!req.body.upin || req.body.upin.trim() === "") {
    return res.status(400).json({ error: "UPIN is required" });
  }*/

  const {
    PropertyOwnerName,
    ExistingArchiveCode,
    UPIN,
    ServiceOfEstate,
    placeLevel,
    possessionStatus,
    spaceSize,
    kebele,
    proofOfPossession,
    DebtRestriction,
    LastTaxPaymtDate,
    unpaidTaxDebt,
    InvoiceNumber,
    lastDatePayPropTax,
    unpaidPropTaxDebt,
    InvoiceNumber2,
    EndLeasePayPeriod,
    unpaidLeaseDebt,
    InvoiceNumber3,
    FolderNumber,
    Row,
    ShelfNumber,
    NumberOfPages,
  } = req.body;

  const uploadedFileBuffer = req.file ? req.file.buffer : null; // Get the uploaded file as a buffer
  const uploadedFilePath = req.file ? req.file.originalname : null; // Get the original filename for FilePath

  const query = `
    INSERT INTO records (
      PropertyOwnerName, ExistingArchiveCode, UPIN, ServiceOfEstate, 
      placeLevel, possessionStatus, spaceSize,kebele, proofOfPossession, 
      DebtRestriction, LastTaxPaymtDate, unpaidTaxDebt, InvoiceNumber, lastDatePayPropTax, unpaidPropTaxDebt, 
      InvoiceNumber2, UploadedFile, FilePath, EndLeasePayPeriod, unpaidLeaseDebt, InvoiceNumber3, 
      FolderNumber, Row, ShelfNumber, NumberOfPages
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [
      PropertyOwnerName,
      ExistingArchiveCode,
      UPIN,
      ServiceOfEstate,
      placeLevel,
      possessionStatus,
      spaceSize,
      kebele,
      proofOfPossession,
      DebtRestriction,
      LastTaxPaymtDate,
      unpaidTaxDebt,
      InvoiceNumber,
      lastDatePayPropTax,
      unpaidPropTaxDebt,
      InvoiceNumber2,
      uploadedFileBuffer, // Insert the file buffer directly into the database
      uploadedFilePath, // Store the original filename in the database
      EndLeasePayPeriod,
      unpaidLeaseDebt,
      InvoiceNumber3,
      FolderNumber,
      Row,
      ShelfNumber,
      parseInt(NumberOfPages, 10), // Ensure this is an integer
    ],
    (err, result) => {
      if (err) {
        console.error("Database insert error:", err);
        return res.status(400).json(err);
      }
      res.status(201).json({ UPIN });
    }
  );
});

// API Route to update a record by ID
app.put("/api/records/:UPIN", upload.single("uploadedFile"), (req, res) => {
  const UPIN = req.params.UPIN;
  const {
    PropertyOwnerName,
    ExistingArchiveCode,
    ServiceOfEstate,
    placeLevel,
    possessionStatus,
    spaceSize,
    kebele,
    proofOfPossession,
    DebtRestriction,
    LastTaxPaymtDate,
    unpaidTaxDebt,
    InvoiceNumber,
    lastDatePayPropTax,
    unpaidPropTaxDebt,
    InvoiceNumber2,
    EndLeasePayPeriod,
    unpaidLeaseDebt,
    InvoiceNumber3,
    FolderNumber,
    Row,
    ShelfNumber,
    NumberOfPages,
  } = req.body;

  const uploadedFileBuffer = req.file ? req.file.buffer : null;
  const uploadedFilePath = req.file ? req.file.originalname : null;
  let query;
  let values;
  if (req.file) {
    // Update including new uploaded file
    query = `
    UPDATE records SET
      PropertyOwnerName = ?, ExistingArchiveCode = ?, ServiceOfEstate = ?, 
      placeLevel = ?, possessionStatus = ?, spaceSize = ?, kebele = ?, proofOfPossession = ?, 
      DebtRestriction = ?, LastTaxPaymtDate = ?, unpaidTaxDebt = ?, InvoiceNumber = ?, lastDatePayPropTax = ?, unpaidPropTaxDebt = ?, 
      InvoiceNumber2 = ?, UploadedFile = ?, FilePath = ?, EndLeasePayPeriod = ?, unpaidLeaseDebt = ?, 
      InvoiceNumber3 = ?, FolderNumber = ?, Row = ?, ShelfNumber = ?, NumberOfPages = ?
    WHERE UPIN = ?`;
    values = [
      PropertyOwnerName,
      ExistingArchiveCode,
      ServiceOfEstate,
      placeLevel,
      possessionStatus,
      spaceSize,
      kebele,
      proofOfPossession,
      DebtRestriction,
      LastTaxPaymtDate,
      unpaidTaxDebt,
      InvoiceNumber,
      lastDatePayPropTax,
      unpaidPropTaxDebt,
      InvoiceNumber2,
      uploadedFileBuffer,
      uploadedFilePath,
      EndLeasePayPeriod,
      unpaidLeaseDebt,
      InvoiceNumber3,
      FolderNumber,
      Row,
      ShelfNumber,
      parseInt(NumberOfPages, 10),
      UPIN,
    ];
  } else {
    // Update without touching uploaded file
    query = `
    UPDATE records SET
      PropertyOwnerName = ?, ExistingArchiveCode = ?, ServiceOfEstate = ?, 
      placeLevel = ?, possessionStatus = ?, spaceSize = ?, kebele = ?, proofOfPossession = ?, 
      DebtRestriction = ?, LastTaxPaymtDate = ?, unpaidTaxDebt = ?, InvoiceNumber = ?, lastDatePayPropTax = ?, unpaidPropTaxDebt = ?, 
      InvoiceNumber2 = ?,  EndLeasePayPeriod = ?, unpaidLeaseDebt = ?, 
      InvoiceNumber3 = ?, FolderNumber = ?, Row = ?, ShelfNumber = ?, NumberOfPages = ?
    WHERE UPIN = ?`;
    values = [
      PropertyOwnerName,
      ExistingArchiveCode,
      ServiceOfEstate,
      placeLevel,
      possessionStatus,
      spaceSize,
      kebele,
      proofOfPossession,
      DebtRestriction,
      LastTaxPaymtDate,
      unpaidTaxDebt,
      InvoiceNumber,
      lastDatePayPropTax,
      unpaidPropTaxDebt,
      InvoiceNumber2,
      EndLeasePayPeriod,
      unpaidLeaseDebt,
      InvoiceNumber3,
      FolderNumber,
      Row,
      ShelfNumber,
      parseInt(NumberOfPages, 10),
      UPIN,
    ];
  }

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Database update error:", err);
      return res.status(400).json(err);
    }
    res.json({ UPIN: UPIN, message: "Record updated successfully" });
  });
});

// API Route to delete a record by UPIN
app.delete("/api/records/:UPIN", (req, res) => {
  const UPIN = req.params.UPIN;
  const query = `DELETE FROM records WHERE UPIN = ?`;

  db.query(query, [UPIN], (err, result) => {
    if (err) {
      console.error("Database delete error:", err);
      return res.status(400).json(err);
    }
    res.status(204).send(); // No content to send back
  });
});

// API Route to retrieve all records
app.get("/api/records", (req, res) => {
  db.query("SELECT * FROM records", (err, results) => {
    if (err) return res.status(400).json(err);
    const mappedResults = results.map((row) => ({
      PropertyOwnerName: row.PropertyOwnerName,
      ExistingArchiveCode: row.ExistingArchiveCode,
      UPIN: row.UPIN,
      ServiceOfEstate: row.ServiceOfEstate,
      placeLevel: row.placeLevel,
      possessionStatus: row.possessionStatus,
      spaceSize: row.spaceSize,
      kebele: row.kebele,
      proofOfPossession: row.proofOfPossession,
      DebtRestriction: row.DebtRestriction,
      LastTaxPaymtDate: row.LastTaxPaymtDate,
      unpaidTaxDebt: row.unpaidTaxDebt,
      InvoiceNumber: row.InvoiceNumber,
      lastDatePayPropTax: row.lastDatePayPropTax,
      unpaidPropTaxDebt: row.unpaidPropTaxDebt,
      InvoiceNumber2: row.InvoiceNumber2,
      InvoiceNumber3: row.InvoiceNumber3,
      EndLeasePayPeriod: row.EndLeasePayPeriod,
      unpaidLeaseDebt: row.unpaidLeaseDebt,
      FolderNumber: row.FolderNumber,
      Row: row.Row,
      ShelfNumber: row.ShelfNumber,
      NumberOfPages: row.NumberOfPages,
      uploadedFile: row.FilePath, // optional if you want it
    }));

    res.json(mappedResults);
  });
});

// API Route to retrieve records by UPIN or File Code (ExistingArchiveCode)

/*app.get("/api/records/all", (req, res) => {
  const query = "SELECT * FROM records";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Failed to fetch records:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});*/

// === Search Records ===
app.get("/api/records/search", (req, res) => {
  const {
    UPIN,
    ExistingArchiveCode,
    proofOfPossession,
    ServiceOfEstate,
    kebele,
    possessionStatus,
  } = req.query;

  let query = "SELECT * FROM records WHERE ";
  const conditions = [];
  const params = [];

  if (UPIN) {
    conditions.push("UPIN = ?");
    params.push(UPIN);
  }
  if (ExistingArchiveCode) {
    conditions.push("ExistingArchiveCode = ?");
    params.push(ExistingArchiveCode);
  }
  if (proofOfPossession) {
    conditions.push("proofOfPossession = ?");
    params.push(proofOfPossession);
  }
  if (ServiceOfEstate) {
    conditions.push("ServiceOfEstate = ?");
    params.push(ServiceOfEstate);
  }
  if (kebele) {
    conditions.push("kebele = ?");
    params.push(kebele);
  }
  if (possessionStatus) {
    conditions.push("possessionStatus = ?");
    params.push(possessionStatus);
  }

  if (conditions.length === 0) {
    return res
      .status(400)
      .json({ error: "No valid search parameters provided." });
  }

  query += conditions.join(" AND ");

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Search error:", err);
      return res.status(500).json({ error: "Search failed.", details: err });
    }
    res.json(results);
  });
});

// file view route

app.get("/api/records/:UPIN/UploadedFile", (req, res) => {
  const UPIN = req.params.UPIN;
  const query = "SELECT UploadedFile, FilePath FROM records WHERE UPIN = ?";

  db.query(query, [UPIN], (err, results) => {
    if (err) return res.status(500).json({ error: "DB error" });
    if (results.length === 0)
      return res.status(404).json({ error: "File not found" });

    const file = results[0];
    res.set({
      "Content-Disposition": `attachment; filename="${file.FilePath}"`,
      "Content-Type": "application/octet-stream",
    });
    res.send(file.UploadedFile);
  });
});

// API Route to get percentage breakdown of ServiceOfEstate values
app.get("/api/statistics/service-of-estate", (req, res) => {
  const query = `
    SELECT ServiceOfEstate, COUNT(*) AS count
    FROM records
    WHERE ServiceOfEstate IS NOT NULL AND ServiceOfEstate != ''
    GROUP BY ServiceOfEstate
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching ServiceOfEstate stats:", err);
      return res.status(500).json({ error: "Failed to fetch statistics" });
    }

    res.json(results); // ✅ SEND THE DATA!
  });
});

// API Route to get percentage breakdown of proof of possession values
app.get("/api/statistics/proof-of-possession", (req, res) => {
  const query = `
    SELECT proofOfPossession, COUNT(*) AS count
    FROM records
    WHERE proofOfPossession IS NOT NULL AND proofOfPossession != ''
    GROUP BY proofOfPossession
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching proofOfPossession stats:", err);
      return res.status(500).json({ error: "Failed to fetch statistics" });
    }

    res.json(results); // ✅ SEND THE DATA!
  });
});

//login endpoint

const bcrypt = require("bcrypt"); // Make sure bcrypt is required

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ?`;
  db.query(query, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = results[0];

    // Use bcrypt to compare the password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // If authentication is successful
    res.json({ message: "Login successful", userId: user.id });
  });
});

// registration endpoint

app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

  const query = `INSERT INTO users (email, password) VALUES (?, ?)`;
  db.query(query, [email, hashedPassword], (err) => {
    if (err) {
      return res.status(500).json({ error: "Error registering user" });
    }
    res.status(201).json({ message: "User registered successfully" });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
