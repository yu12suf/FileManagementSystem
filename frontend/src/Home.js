import React, { useState, useEffect, useRef } from "react";
import "./Home.css"; // For styling
import logo from "./Images/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css"; // local import

import FilesView from "./FilesView"; // Adjust the path based on your file structure
import Report from "./Report"; // Adjust the path based on your file structure
import TaxForm from "./TaxForm";

const Home = () => {
  const [currentPage, setCurrentPage] = useState("home");

  const [file, setFile] = useState(null); // To store the selected file
  const [filePath, setFilePath] = useState(""); // To store the file path
  const [records, setRecords] = useState([]); // To store fetched records
  const [editedRow, setEditedRow] = useState(null);

  // New ref for the form section
  const formRef = useRef(null); // Create a ref

  const navigate = useNavigate();

  //ne code
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState("");

  const [navigationContext, setNavigationContext] = useState("search"); // "search" or "edit"
  const [editIndex, setEditIndex] = useState(null); // for index in general records when editing

  useEffect(() => {
    if (navigationContext === "edit" && editIndex !== null) {
      populateFormWithRecord(records[editIndex]);
    }
  }, [editIndex]);

  // State for form inputs
  const [formData, setFormData] = useState({
    PropertyOwnerName: "",
    ExistingArchiveCode: "",
    UPIN: "",
    ServiceOfEstate: "",
    placeLevel: "",
    possessionStatus: "",
    spaceSize: "",
    kebele: "",
    proofOfPossession: "",
    DebtRestriction: "",
    LastTaxPaymtDate: "",
    InvoiceNumber: "",
    lastDatePayPropTax: "",
    InvoiceNumber2: "",
    uploadedFile: null,
    filePath: "",
    EndLeasePayPeriod: "",
    InvoiceNumber3: "",
    FolderNumber: "",
    Row: "",
    ShelfNumber: "",
    NumberOfPages: 0,
  });

  const [editMode, setEditMode] = useState(false);
  const [editUpin, setEditUpin] = useState(null);

  // Fetch records from the API when the component mounts

  const fetchRecords = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/records");
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFilePath(selectedFile.name);
      setFormData((prevData) => ({
        ...prevData,
        uploadedFile: selectedFile,
      }));
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "NumberOfPages" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // ✅ Simple validation check
    /*if (!formData.upin || formData.upin.trim() === "") {
      alert("UPIN is required and cannot be empty.");
      return;
    }*/

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await fetch("http://localhost:5000/api/records", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        await fetchRecords(); // Re-fetch all records from server
        resetForm();
      }
    } catch (error) {
      console.error("Error saving record:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      PropertyOwnerName: "",
      ExistingArchiveCode: "",
      UPIN: "",
      ServiceOfEstate: "",
      placeLevel: "",
      possessionStatus: "",
      spaceSize: "",
      kebele: "",
      proofOfPossession: "",
      DebtRestriction: "",
      LastTaxPaymtDate: "",
      InvoiceNumber: "",
      lastDatePayPropTax: "",
      InvoiceNumber2: "",
      uploadedFile: null,
      filePath: "",
      EndLeasePayPeriod: "",
      InvoiceNumber3: "",
      FolderNumber: "",
      Row: "",
      ShelfNumber: "",
      NumberOfPages: 0,
    });
  };

  const handleEdit = (record) => {
    setFormData(record);
    setEditMode(true);
    setEditUpin(record.UPIN);

    const indexInRecords = records.findIndex((r) => r.UPIN === record.UPIN);
    setEditIndex(indexInRecords);
    setNavigationContext("edit");

    // Scroll to the form section after a short delay
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
    }, 10);
  };

  const handleDelete = async (UPIN) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/records/${UPIN}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setRecords((prevRecords) =>
          prevRecords.filter((record) => record.UPIN !== UPIN)
        );
      } else {
        console.error("Failed to delete record:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  // hanlde save

  const handleSaveClick = async () => {
    // ✅ Simple validation check
    /* if (!formData.upin || formData.upin.trim() === "") {
      alert("UPIN is required and cannot be empty.");
      return;
      
    }*/

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const response = await axios.put(
        `http://localhost:5000/api/records/${editUpin}`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        await fetchRecords(); // Re-fetch records to refresh the table
        resetForm();
        setEditMode(false);
        setEditUpin(null);
      }
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  const handleSearch = () => {
    const results = records.filter((row) =>
      row.UPIN.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (results.length > 0) {
      setSearchResults(results);
      setCurrentSearchIndex(0); // Set to 0 immediately after search
      populateFormWithRecord(results[0]);
      setNavigationContext("search");
    } else {
      setSearchResults([]);
      setCurrentSearchIndex(-1); // Or set to null if no results
      alert("No records found.");
    }

    setSearchQuery("");
  };

  const populateFormWithRecord = (record) => {
    if (!record) return;

    setFormData(record);
    setEditMode(true);
    setEditUpin(record.UPIN); //  Add this line
  };

  const handlePrev = () => {
    if (navigationContext === "search") {
      if (currentSearchIndex > 0) {
        const newIndex = currentSearchIndex - 1;
        setCurrentSearchIndex(newIndex);
        populateFormWithRecord(searchResults[newIndex]);
      }
    } else if (navigationContext === "edit") {
      if (editIndex > 0) {
        const newIndex = editIndex - 1;
        setEditIndex(newIndex);
        populateFormWithRecord(records[newIndex]);
      }
    }
  };

  const handleNext = () => {
    if (navigationContext === "search") {
      if (currentSearchIndex < searchResults.length - 1) {
        const newIndex = currentSearchIndex + 1;
        setCurrentSearchIndex(newIndex);
        populateFormWithRecord(searchResults[newIndex]);
      }
    } else if (navigationContext === "edit") {
      if (editIndex < records.length - 1) {
        const newIndex = editIndex + 1;
        setEditIndex(newIndex);
        populateFormWithRecord(records[newIndex]);
      }
    }
  };
  const filteredRecords = records.filter(
    (record) => record.UPIN && record.UPIN.trim() !== ""
  );

  // function for unpaid debt
  const handleBlur = (e) => {
    const value = e.target.value;
    const year = parseInt(value, 10);
    if (!isNaN(year)) {
      if (year < 1950 || year > 2017) {
        alert("Please insert a value between 1950 and 2017");
      }
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case "files":
        return <FilesView />;

      case "report":
        return <Report />;
      case "graph":
        return <div>Graph Content</div>;
      default:
        return (
          <div ref={formRef}>
            <div className="search-bar">
              <button className="search-button" onClick={handleSearch}>
                Search
              </button>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by UPIN"
              />
            </div>
            <form className="form" onSubmit={handleSubmit}>
              <div className="form-column">
                <div className="form-group">
                  <label>ይዞታው ባለቤት ስም</label>
                  <input
                    type="text"
                    name="PropertyOwnerName"
                    value={formData.PropertyOwnerName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>የነባር የማህደር ኮደ</label>
                  <input
                    type="text"
                    name="ExistingArchiveCode"
                    value={formData.ExistingArchiveCode}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>UPIN</label>
                  <input
                    type="text"
                    name="UPIN"
                    value={formData.UPIN}
                    onChange={handleChange}
                    disabled={editMode}
                  />
                </div>
                <div className="form-group">
                  <label>የይዞታው አገልግሎት</label>
                  <select
                    name="ServiceOfEstate"
                    value={formData.ServiceOfEstate}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option>ለመኖረያ</option>
                    <option>ለንግድ</option>
                    <option>የመንግስት</option>
                    <option>የሐይማኖት ተቋም</option>
                    <option>ኢንቨስትመንት</option>
                    <option>የቀበሌ</option>
                    <option>የኪይ ቤቶች</option>
                    <option>ኮንዲኒሚየም</option>
                    <option>መንገድ</option>
                    <option>የማሃበር</option>
                    <option>ሌሎች</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>የቦታው ደረጃ</label>
                  <select
                    name="placeLevel"
                    value={formData.placeLevel}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option>1ኛ</option>
                    <option>2ኛ</option>
                    <option>3ኛ</option>
                    <option>4ኛ</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>የይዞታየተገኘበት ሁኔታ</label>
                  <select
                    name="possessionStatus"
                    value={formData.possessionStatus}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option>ነባር</option>
                    <option>ሊዝ</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>የቦታ ስፋት</label>
                  <input
                    type="number"
                    name="spaceSize"
                    value={formData.spaceSize}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label>ቀበሌ</label>
                  <select
                    name="kebele"
                    value={formData.kebele}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option>01</option>
                    <option>02</option>
                    <option>03</option>
                    <option>04</option>
                    <option>05</option>
                    <option>06</option>
                    <option>07</option>
                    <option>08</option>
                    <option>09</option>
                    <option>10</option>
                    <option>11</option>
                    <option>12</option>
                    <option>13</option>
                    <option>14</option>
                    <option>15</option>
                    <option>16</option>
                    <option>17</option>
                    <option>18</option>
                    <option>19</option>
                  </select>
                </div>
              </div>
              <div className="form-column">
                <div className="form-group">
                  <label>የይዞታ ማራጋገጫ</label>
                  <select
                    name="proofOfPossession"
                    value={formData.proofOfPossession}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option>ካርታ</option>
                    <option>ሰነድ አልባ</option>
                    <option>ህገ-ውፕ</option>
                    <option>ምንም የሌለው</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>እዳና እገዳ</label>
                  <select
                    name="DebtRestriction"
                    value={formData.DebtRestriction}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option>እዳ</option>
                    <option>እገዳ</option>
                    <option>ነፃ</option>
                  </select>
                </div>
                {/* <div className="form-group">
                  <label>የግብር የመጨረሻ የተከፈለበት ዘመን</label>
                  <input
                    type="text"
                    name="LastTaxPaymtDate"
                    value={formData.LastTaxPaymtDate}
                    onChange={handleChange}
                  />
                </div> */}
                <div className="form-group">
                  <label>
                    የግብር የመጨረሻ የተከፈለበት ዘመን
                    <input
                      type="text"
                      name="LastTaxPaymtDate"
                      value={formData.LastTaxPaymtDate}
                      onChange={handleChange}
                      onBlur={handleBlur} // 👈 alert triggers on blur
                      placeholder="e.g., 2015"
                    />
                  </label>

                  <TaxForm LastTaxPaymtDate={formData.LastTaxPaymtDate} />
                </div>

                <div className="form-group">
                  <label>ደረሰኝ ቁጥር</label>
                  <input
                    type="number"
                    name="InvoiceNumber"
                    value={formData.InvoiceNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>
                    የንብረት ግብር የመጨረሻ የተከፈለበት ዘመን
                    <input
                      type="text"
                      name="lastDatePayPropTax"
                      value={formData.lastDatePayPropTax}
                      onChange={handleChange}
                      onBlur={handleBlur} // 👈 alert triggers on blur
                      placeholder="e.g., 2015"
                    />
                  </label>
                  <TaxForm lastDatePayPropTax={formData.lastDatePayPropTax} />
                </div>
                <div className="form-group">
                  <label>ደረሰኝ ቁጥር</label>
                  <input
                    type="number"
                    name="InvoiceNumber2"
                    value={formData.InvoiceNumber2}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="file-upload">Upload File</label>
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileChange}
                  />
                </div>
                {/* Field to display the file path */}
                {filePath && (
                  <div className="form-group">
                    <label>File Path:</label>
                    <input type="text" value={filePath} readOnly />
                  </div>
                )}
              </div>
              <div className="form-column">
                <div className="form-group">
                  <label>የሊዝ መጨረሻ የተከፈለበት ዘመን</label>
                  <input
                    type="text"
                    name="EndLeasePayPeriod"
                    value={formData.EndLeasePayPeriod}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>ደረሰኝ ቁጥር</label>
                  <input
                    type="text"
                    name="InvoiceNumber3"
                    value={formData.InvoiceNumber3}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>አቃፊ ቁጥር</label>
                  <input
                    type="number"
                    name="FolderNumber"
                    value={formData.FolderNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>ሮዉ</label>
                  <input
                    type="text"
                    name="Row"
                    value={formData.Row}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>የሼልፍ ቁጥር</label>
                  <input
                    type="number"
                    name="ShelfNumber"
                    value={formData.ShelfNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>የስነድ የገፅ ብዛት</label>
                  <input
                    type="number"
                    name="NumberOfPages"
                    value={formData.NumberOfPages}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="button-container">
                <button
                  type="button"
                  className="submit-button"
                  onClick={handlePrev}
                  disabled={
                    (navigationContext === "search" &&
                      currentSearchIndex === 0) ||
                    (navigationContext === "edit" &&
                      (editIndex === null || editIndex === 0))
                  }
                >
                  Previous
                </button>
                {!editMode ? (
                  <button type="submit" className="submit-button">
                    Add Record
                  </button>
                ) : (
                  <button
                    type="button"
                    className="submit-button"
                    onClick={() => {
                      handleSaveClick();
                      resetForm();
                      setEditMode(false);
                      setEditUpin(null);
                      setSearchResults([]);
                      setCurrentSearchIndex(0);
                    }}
                  >
                    Save
                  </button>
                )}
                <button
                  type="button"
                  className="submit-button"
                  onClick={resetForm}
                >
                  Clear
                </button>

                <button
                  type="button"
                  className="submit-button"
                  onClick={handleNext}
                  disabled={
                    (navigationContext === "search" &&
                      currentSearchIndex === searchResults.length - 1) ||
                    (navigationContext === "edit" &&
                      editIndex === records.length - 1)
                  }
                >
                  Next
                </button>
              </div>
            </form>
            {/* Render fetched records in a table */}

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ባለቤት ስም</th>
                    <th>የነባር የማህደር ኮደ</th>
                    <th>UPIN</th>
                    <th>የይዞታው አገልግሎት</th>
                    <th>የቦታው ደረጃ</th>
                    <th>የይዞታየተገኘበት ሁኔታ</th>
                    <th>የቦታ ስፋት</th>
                    <th>ቀበሌ</th>
                    <th>የይዞታ ማራጋገጫ</th>
                    <th>እዳና እገዳ</th>
                    <th>የግብር የመጨረሻ የተከፈለበት ዘመን</th>
                    <th>ደረሰኝ ቁጥር</th>
                    <th>የንብረት ግብር የመጨረሻ የተከፈለበት ዘመን</th>
                    <th>ደረሰኝ ቁጥር</th>
                    <th>Upload File</th>
                    <th>የሊዝ መጨረሻ የተከፈለበት ዘመን</th>
                    <th>ደረሰኝ ቁጥር</th>
                    <th>አቃፊ ቁጥር</th>
                    <th>ሮዉ</th>
                    <th>የሼልፍ ቁጥር</th>
                    <th>የስነድ የገፅ ብዛት</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.UPIN}>
                      <td>{record.PropertyOwnerName}</td>
                      <td>{record.ExistingArchiveCode}</td>
                      <td>{record.UPIN}</td>
                      <td>{record.ServiceOfEstate}</td>
                      <td>{record.placeLevel}</td>
                      <td>{record.possessionStatus}</td>
                      <td>{record.spaceSize}</td>
                      <td>{record.kebele}</td>
                      <td>{record.proofOfPossession}</td>
                      <td>{record.DebtRestriction}</td>
                      <td>{record.LastTaxPaymtDate}</td>
                      <td>{record.InvoiceNumber}</td>
                      <td>{record.lastDatePayPropTax}</td>
                      <td>{record.InvoiceNumber2}</td>
                      <td>{record.uploadedFile}</td>
                      <td>{record.EndLeasePayPeriod}</td>
                      <td>{record.InvoiceNumber3}</td>
                      <td>{record.FolderNumber}</td>
                      <td>{record.Row}</td>
                      <td>{record.ShelfNumber}</td>
                      <td>{record.NumberOfPages}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="row-action-button"
                            onClick={() => handleEdit(record)}
                          >
                            Edit
                          </button>
                          <button
                            className="row-action-button"
                            onClick={() => handleDelete(record.UPIN)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="home-container">
      <header className="header">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="project-title">ከተማ ልማትና ኮንስትራክሽን ቢሮ ፋይል ማንጅመንት ሲስተም</h1>
        <img src={logo} alt="Logo" className="logo" />
      </header>
      <nav className="menu-bar">
        <ul>
          <li onClick={() => setCurrentPage("home")}>ፋይል ቆጠራ</li>
          <li onClick={() => setCurrentPage("files")}>ማውጫ </li>
          <li onClick={() => setCurrentPage("report")}>ሪፖርት</li>
          <li onClick={() => setCurrentPage("graph")}>ግራፍ</li>
          <li onClick={() => navigate("/")} className="logout">
            Logout
          </li>
        </ul>
      </nav>
      <div className="content">{renderContent()}</div>
    </div>
  );
};

export default Home;
