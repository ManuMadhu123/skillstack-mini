import React, { useState, useEffect } from "react";
import axios from "axios";
import Skillform from "./Skillform";

function App() {
  const [skills, setSkills] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const fetchSkills = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/skills");
      setSkills(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/dashboard");
      setDashboard(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleShowDashboard = async () => {
    if (!showDashboard) {
      await fetchDashboard(); // fetch latest dashboard data before showing
    }
    setShowDashboard(prev => !prev); // toggle
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>SkillStack Tracker</h1>

      <Skillform
        fetchSkills={fetchSkills}
        fetchDashboard={showDashboard ? fetchDashboard : null} // fetch only if dashboard is visible
      />

      <button
        onClick={handleShowDashboard}
        style={{ marginBottom: "20px", padding: "5px 10px" }}
      >
        {showDashboard ? "Hide Dashboard" : "Show Dashboard"}
      </button>

      <h2>Your Skills</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {skills.map((s) => (
          <li
            key={s.id}
            style={{
              marginBottom: "15px",
              borderBottom: "1px solid #ddd",
              paddingBottom: "10px",
            }}
          >
            <strong>{s.skill_name}</strong> ({s.resource_type}) - {s.platform} <br />
            Progress: {s.progress} | Hours: {s.hours_spent} | Difficulty: {s.difficulty_rating} <br />
            Notes: {s.notes ? s.notes : "-"} <br />
            <strong>Category:</strong> {s.category} {/* AI-categorized skill */}
          </li>
        ))}
      </ul>

      {showDashboard && dashboard && (
        <div style={{ marginTop: "30px", border: "1px solid #ccc", padding: "15px" }}>
          <h2>Dashboard</h2>
          <p><strong>Total Skills:</strong> {dashboard.total_skills}</p>
          <p><strong>Total Hours Spent:</strong> {dashboard.total_hours_spent}</p>

          <h3>Progress Breakdown</h3>
          <ul>
            {Object.entries(dashboard.progress_count).map(([key, value]) => (
              <li key={key}>{key}: {value}</li>
            ))}
          </ul>

          <h3>Category Breakdown</h3>
          <ul>
            {Object.entries(dashboard.category_count).map(([key, value]) => (
              <li key={key}>{key}: {value}</li>
            ))}
          </ul>

          <h3>Platform Breakdown</h3>
          <ul>
            {Object.entries(dashboard.platform_count).map(([key, value]) => (
              <li key={key}>{key}: {value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
