// FilesPage.js

import React, { useState } from "react";
import axios from "axios";

import { useEffect } from "react";

const FilesView = () => {
  const [records, setRecords] = useState([]);
  const [searchFileCode, setSearchFileCode] = useState("");
  const [searchUPIN, setSearchUPIN] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    PropertyOwnerName: "",
    ExistingArchiveCode: "",
    UPIN: "",
    ServiceOfEstate: "",
    placeLevel: "",
    possessionStatus: "",
    DebtRestriction: "",
    LastTaxPaymtDate: "",
    InvoiceNumber: "",
    FolderNumber: "",
    ShelfNumber: "",
    NumberOfPages: "",
    sortingNumber: "",
    spaceSize: "",
    proofOfPossession: "",
    kebele: "",
    EndLeasePayPeriod: "",
  });

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get("/api/records");
        setRecords(response.data);
      } catch (error) {
        console.error("Failed to fetch records:", error);
      }
    };
    fetchRecords();
  }, []);

  const handleFileCodeSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/records/search`,
        {
          params: { ExistingArchiveCode: searchFileCode },
        }
      );
      console.log("File Code Search Response:", response.data); // Log the response
      if (response.data?.length > 0) {
        setFormData(response.data[0]);
      } else {
        console.warn("No record found for the given file code.");
        alert("No record found for the given file code.");
      }
    } catch (error) {
      console.error("Error searching by file code:", error);
    } finally {
      setSearchFileCode(""); // Reset search input
    }
  };

  const handleUPISearch = async () => {
    console.log("Searching for UPIN:", searchUPIN); // Add this line

    try {
      const response = await axios.get(
        `http://localhost:5000/api/records/search`,
        {
          params: { UPIN: searchUPIN },
        }
      );
      if (response.data?.length > 0) {
        setFormData(response.data[0]);
      } else {
        console.warn("No record found for the given UPIN.");
        alert("No record found for the given UPIN.");
      }
    } catch (error) {
      console.error("Error searching by UPIN:", error);
    }
    setSearchUPIN(""); // Reset search input
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleResetForm = () => {
    setFormData({
      PropertyOwnerName: "",
      ExistingArchiveCode: "",
      UPIN: "",
      ServiceOfEstate: "",
      placeLevel: "",
      possessionStatus: "",
      DebtRestriction: "",
      LastTaxPaymtDate: "",
      InvoiceNumber: "",
      FolderNumber: "",
      ShelfNumber: "",
      NumberOfPages: "",
      sortingNumber: "",
      spaceSize: "",
      proofOfPossession: "",
      kebele: "",
      EndLeasePayPeriod: "",
    });
  };

  return (
    <div>
      <div
        className="cont-container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          gap: "1rem",
        }}
      >
        {/* Search by File Code */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <label style={{ marginRight: "0.5rem", whiteSpace: "nowrap" }}>
            Search by File Code
          </label>
          <div style={{ position: "relative", width: "200px" }}>
            <input
              type="text"
              placeholder="Search by File Code"
              value={searchFileCode}
              onChange={(e) => setSearchFileCode(e.target.value)}
              style={{
                width: "100%",
                height: "2rem",
                paddingRight: "2.5rem",
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={handleFileCodeSearch}
              style={{
                position: "absolute",
                top: "50%",
                right: "0.5rem",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                height: "1.5rem",
                width: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <i
                className="fas fa-search"
                style={{ fontSize: "1rem", color: "#555" }}
              ></i>
            </button>
          </div>
        </div>

        {/* Search by UPIN */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <label style={{ marginRight: "0.5rem", whiteSpace: "nowrap" }}>
            Search by UPIN
          </label>
          <div style={{ position: "relative", width: "200px" }}>
            <input
              type="text"
              placeholder="Search by UPIN"
              value={searchUPIN}
              onChange={(e) => setSearchUPIN(e.target.value)}
              style={{
                width: "100%",
                height: "2rem",
                paddingRight: "2.5rem",
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={handleUPISearch}
              style={{
                position: "absolute",
                top: "50%",
                right: "0.5rem",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                height: "1.5rem",
                width: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <i
                className="fas fa-search"
                style={{ fontSize: "1rem", color: "#555" }}
              ></i>
            </button>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="form-1">
        {/* Column 1 */}
        <div className="form-column-1">
          <h3 className="uniq-title">Unique information</h3>
          <div className="form-group-1">
            <label>ይዞታው ባለቤት ስም</label>
            <input
              type="text"
              name="PropertyOwnerName"
              value={formData.PropertyOwnerName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group-1">
            <label>የነባር የማህደር ኮደ</label>
            <input
              type="text"
              name="ExistingArchiveCode"
              value={formData.ExistingArchiveCode}
              onChange={handleChange}
            />
          </div>
          <div className="form-group-1">
            <label>UPIN</label>
            <input
              type="text"
              name="UPIN"
              value={formData.UPIN}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Column 2 */}
        <div className="form-column-2">
          <h3 className="uniq-title">የይዞታ መረጃ</h3>
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
        </div>

        {/* Column 3 */}
        <div className="form-column-3">
          <h3 className="uniq-title">የክፍያ መረጃ</h3>
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
          <div className="form-group">
            <label>የግብር የመጨረሻ የተከፈለበት ዘመን</label>
            <input
              type="text"
              name="LastTaxPaymtDate"
              value={formData.LastTaxPaymtDate}
              onChange={handleChange}
            />
          </div>
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
              type="number"
              name="InvoiceNumber"
              value={formData.InvoiceNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Column 4 */}
        <div className="form-column-4">
          <h3 className="uniq-title">የፋይሉ አድራሻ</h3>
          <div className="form-group-1">
            <label>አቃፊ ቁጥር</label>
            <input
              type="number"
              name="FolderNumber"
              value={formData.FolderNumber}
              onChange={handleChange}
            />
          </div>
          <div className="form-group-1">
            <label>የሼልፍ ቁጥር</label>
            <input
              type="number"
              name="ShelfNumber"
              value={formData.ShelfNumber}
              onChange={handleChange}
            />
          </div>
          <div className="form-group-1">
            <label>የስነድ የገፅ ብዛት</label>
            <input
              type="number"
              name="NumberOfPages"
              value={formData.NumberOfPages}
              onChange={handleChange}
            />
          </div>
          <div className="form-group-1">
            <label>መደርደረያ ቁፕር</label>
            <input
              type="number"
              name="sortingNumber"
              value={formData.sortingNumber}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-column-5">
          <div className="form-group-1">
            <label>የቦታ ስፋት</label>
            <input
              type="number"
              name="spaceSize"
              value={formData.spaceSize}
              onChange={handleChange}
            />
          </div>
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
          <div className="form-group-1">
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

        <div className="form-column-6">
          <div className="form-group-1">
            <label>አቃፊ ቁጥር</label>
            <input
              type="number"
              name="FolderNumber"
              value={formData.FolderNumber}
              onChange={handleChange}
            />
          </div>
          <div className="form-group-1">
            <label>የሼልፍ ቁጥር</label>
            <input
              type="number"
              name="ShelfNumber"
              value={formData.ShelfNumber}
              onChange={handleChange}
            />
          </div>
          <div className="form-group-1">
            <label>የስነድ የገፅ ብዛት</label>
            <input
              type="number"
              name="NumberOfPages"
              value={formData.NumberOfPages}
              onChange={handleChange}
            />
          </div>

          <div className="form-reset-container">
            <button onClick={handleResetForm} className="reset-button">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilesView;
