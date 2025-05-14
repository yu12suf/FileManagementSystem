/*import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import axios from "axios";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AA46BE",
  "#EA5455",
  "#FFD460",
  "#2D4059",
  "#6A2C70",
  "#4E944F",
  "#FF6B6B",
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return percent > 0 ? (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor="middle"
      dominantBaseline="central"
    >
      {(percent * 100).toFixed(1)}%
    </text>
  ) : null;
};

const ProofOfPossessionPieChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    axios
      .get("/api/statistics/proof-of-possession")
      .then((response) => {
        const stats = response.data;
        const formatted = stats.map((item) => ({
          name: item.proofOfPossession,
          value: item.count,
        }));
        setChartData(formatted);
      })
      .catch((error) => {
        console.error("Error fetching chart data:", error);

        if (error.response) {
          console.error("Status:", error.response.status);
          console.error("Data:", error.response.data);
          console.error("Headers:", error.response.headers);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Axios error message:", error.message);
        }
      });
  }, []);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <PieChart width={500} height={400}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) =>
            `${((value / total) * 100).toFixed(1)}% (${value})`
          }
        />
        <Legend />
      </PieChart>
    </div>
  );
};

export default ProofOfPossessionPieChart;
*/

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import axios from "axios";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const validProofs = ["ካርታ", "ሰነድ አልባ", "ህገ-ውፕ", "ምንም የሌለው"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return percent > 0 ? (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor="middle"
      dominantBaseline="central"
    >
      {(percent * 100).toFixed(1)}%
    </text>
  ) : null;
};

const ProofOfPossessionPieChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    axios
      .get("/api/statistics/proof-of-possession")
      .then((response) => {
        const stats = response.data;
        const filtered = stats.filter((item) =>
          validProofs.includes(item.proofOfPossession)
        );
        const formatted = filtered.map((item) => ({
          name: item.proofOfPossession,
          value: item.count,
        }));
        setChartData(formatted);
      })
      .catch((error) => {
        console.error("Error fetching chart data:", error);

        if (error.response) {
          console.error("Status:", error.response.status);
          console.error("Data:", error.response.data);
          console.error("Headers:", error.response.headers);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Axios error message:", error.message);
        }
      });
  }, []);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <PieChart width={500} height={400}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) =>
            `${((value / total) * 100).toFixed(1)}% (${value})`
          }
        />
        <Legend />
      </PieChart>
    </div>
  );
};

export default ProofOfPossessionPieChart;
