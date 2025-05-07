const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");

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

// Connect to MySQL
/*db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected on port 3307");
});
*/
// API Route to handle inserting records
app.post("/api/records", upload.single("uploadedFile"), (req, res) => {
  // Validate UPIN
  /* if (!req.body.upin || req.body.upin.trim() === "") {
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
    InvoiceNumber,
    lastDatePayPropTax,
    InvoiceNumber2,
    EndLeasePayPeriod,
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
      DebtRestriction, LastTaxPaymtDate, InvoiceNumber, lastDatePayPropTax, 
      InvoiceNumber2, UploadedFile, FilePath, EndLeasePayPeriod, InvoiceNumber3, 
      FolderNumber, Row, ShelfNumber, NumberOfPages
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
      InvoiceNumber,
      lastDatePayPropTax,
      InvoiceNumber2,
      uploadedFileBuffer, // Insert the file buffer directly into the database
      uploadedFilePath, // Store the original filename in the database
      EndLeasePayPeriod,
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
    InvoiceNumber,
    lastDatePayPropTax,
    InvoiceNumber2,
    EndLeasePayPeriod,
    InvoiceNumber3,
    FolderNumber,
    Row,
    ShelfNumber,
    NumberOfPages,
  } = req.body;

  const uploadedFileBuffer = req.file ? req.file.buffer : null;
  const uploadedFilePath = req.file ? req.file.originalname : null;

  const query = `
    UPDATE records SET
      PropertyOwnerName = ?, ExistingArchiveCode = ?, ServiceOfEstate = ?, 
      placeLevel = ?, possessionStatus = ?, spaceSize = ?, kebele = ?, proofOfPossession = ?, 
      DebtRestriction = ?, LastTaxPaymtDate = ?, InvoiceNumber = ?, lastDatePayPropTax = ?, 
      InvoiceNumber2 = ?, UploadedFile = ?, FilePath = ?, EndLeasePayPeriod = ?, 
      InvoiceNumber3 = ?, FolderNumber = ?, Row = ?, ShelfNumber = ?, NumberOfPages = ?
    WHERE UPIN = ?`;

  db.query(
    query,
    [
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
      InvoiceNumber,
      lastDatePayPropTax,
      InvoiceNumber2,
      uploadedFileBuffer,
      uploadedFilePath,
      EndLeasePayPeriod,
      InvoiceNumber3,
      FolderNumber,
      Row,
      ShelfNumber,
      parseInt(NumberOfPages, 10),
      UPIN,
    ],
    (err, result) => {
      if (err) {
        console.error("Database update error:", err);
        return res.status(400).json(err);
      }
      res.json({ UPIN: UPIN, message: "Record updated successfully" });
    }
  );
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
      InvoiceNumber: row.InvoiceNumber,
      lastDatePayPropTax: row.lastDatePayPropTax,
      InvoiceNumber2: row.InvoiceNumber2,
      InvoiceNumber3: row.InvoiceNumber3,
      EndLeasePayPeriod: row.EndLeasePayPeriod,
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
  const { UPIN, ExistingArchiveCode, proofOfPossession } = req.query;

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
