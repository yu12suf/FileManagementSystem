import React, { useState } from "react";
import "./Report.css"; // For styling
import Report3 from "./Report3";

const Report = ({ title, kebele, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="report-item">
      <button className="report-button" onClick={toggleOpen}>
        <span>{title}</span>
        <span className="kebele-label">{kebele}</span>
      </button>
      {isOpen && <div className="report-content">{content}</div>}
    </div>
  );
};

const App = () => {
  const reports = [
    {
      title: "Report 1",
      kebele: "19 kebele",
      content: (
        <div className="form-group">
          <label>የይዞታው አገልግሎት</label>
          <select name="ServiceOfEstate">
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
          <div className="button-group">
            <button>Preview</button>

            <button>Print</button>
          </div>
        </div>
      ),
    },
    {
      title: "Report 2",
      kebele: "19 kebele",
      content: (
        <div className="form-group">
          <label>ቀበሌ</label>
          <select name="kebele">
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
          <div className="button-group">
            <button>Preview</button>

            <button>Print</button>
          </div>
        </div>
      ),
    },
    {
      title: "Report 3",
      kebele: "19 kebele",
      content: <Report3 />,
    },
    {
      title: "Report 4",
      kebele: "19 kebele",
      content: (
        <div>
          <p>Report 4 content with map data.</p>
          <img src="map-placeholder.png" alt="Map" />
        </div>
      ),
    },
    {
      title: "Report 5",
      kebele: "19 kebele",
      content: <p>Special notes and remarks unique to Report 5.</p>,
    },
  ];

  return (
    <div className="app">
      <h1>Reports</h1>
      {reports.map((report, index) => (
        <Report
          key={index}
          title={report.title}
          kebele={report.kebele}
          content={report.content}
        />
      ))}
    </div>
  );
};

export default App;
