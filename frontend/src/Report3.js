import React, { useState } from "react";
import axios from "axios";
import "./Report3.css";

const Report3 = () => {
  const [selectedProof, setSelectedProof] = useState("");
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handlePreview = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/records/search?proofOfPossession=${selectedProof}`
      );
      setRecords(response.data);
      setShowModal(true); // Show the modal after data is fetched
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div className="form-group">
      <label>የይዞታ ማራጋገጫ</label>
      <select
        name="proofOfPossession"
        value={selectedProof}
        onChange={(e) => setSelectedProof(e.target.value)}
      >
        <option value="">Select</option>
        <option>ካርታ</option>
        <option>ሰነድ አልባ</option>
        <option>ህገ-ውፕ</option>
        <option>ምንም የሌለው</option>
      </select>
      <div className="button-group">
        <button onClick={handlePreview}>Preview</button>
        <button>Print</button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleClose}>
              &times;
            </button>
            <h2>የተመረጠው መረጃ</h2>
            <table className="preview-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>ይዞታው ባለቤት ስም</th>
                  <th>UPIN</th>
                  <th>ቀበሌ</th>
                  <th>የቦታው ደረጃ</th>
                  <th>የቦታ ስፋት</th>
                  <th>የይዞታ ማራጋገጫ</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{record.PropertyOwnerName}</td>
                    <td>{record.UPIN}</td>
                    <td>{record.kebele}</td>
                    <td>{record.placeLevel}</td>
                    <td>{record.spaceSize}</td>
                    <td>{record.proofOfPossession}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report3;
