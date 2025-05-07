import React, { useEffect, useState } from "react";

const TaxForm = ({ LastTaxPaymtDate }) => {
  const [unpaidDebt, setUnpaidDebt] = useState("");

  useEffect(() => {
    const year = parseInt(LastTaxPaymtDate, 10);
    if (!isNaN(year) && year >= 1950 && year <= 2017) {
      setUnpaidDebt(2017 - year);
    } else {
      setUnpaidDebt("");
    }
  }, [LastTaxPaymtDate]);

  return (
    <table
      style={{
        borderCollapse: "collapse",
        marginLeft: "10px",
        minWidth: "70px",
        textAlign: "center",
        fontSize: "12px",
      }}
    >
      <thead>
        <tr>
          <th
            style={{
              border: "1px solid #ccc",
              padding: "3px",
              backgroundColor: "#f2f2f2",
            }}
          >
            ውዝፍ
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            style={{
              border: "1px solid #ccc",
              padding: "4px",
              height: "20px",
            }}
          >
            {unpaidDebt}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default TaxForm;
