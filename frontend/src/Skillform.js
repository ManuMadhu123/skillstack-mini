import React, { useState } from "react";
import axios from "axios";

function Skillform({ fetchSkills, fetchDashboard }) {
  const [skill, setSkill] = useState({
    skill_name: "",
    resource_type: "Video",
    platform: "YouTube",
    progress: "started",
    hours_spent: 0,
    notes: "",
    difficulty_rating: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSkill({ ...skill, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:5000/skills", skill);
      // Reset form
      setSkill({
        skill_name: "",
        resource_type: "Video",
        platform: "YouTube",
        progress: "started",
        hours_spent: 0,
        notes: "",
        difficulty_rating: 1
      });

      fetchSkills(); // Refresh skills
      if (fetchDashboard) fetchDashboard(); // Refresh dashboard if visible
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        name="skill_name"
        placeholder="Skill Name"
        value={skill.skill_name}
        onChange={handleChange}
        required
        style={{ padding: "5px", marginRight: "10px" }}
      />

      <select name="resource_type" value={skill.resource_type} onChange={handleChange} style={{ marginRight: "10px" }}>
        <option value="Video">Video</option>
        <option value="Course">Course</option>
        <option value="Article">Article</option>
      </select>

      <select name="platform" value={skill.platform} onChange={handleChange} style={{ marginRight: "10px" }}>
        <option value="YouTube">YouTube</option>
        <option value="Udemy">Udemy</option>
        <option value="Coursera">Coursera</option>
      </select>

      <select name="progress" value={skill.progress} onChange={handleChange} style={{ marginRight: "10px" }}>
        <option value="started">Started</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <input
        type="number"
        name="hours_spent"
        placeholder="Hours Spent"
        value={skill.hours_spent}
        onChange={handleChange}
        min="0"
        step="0.5"
        style={{ padding: "5px", marginRight: "10px", width: "100px" }}
      />

      <input
        name="notes"
        placeholder="Notes"
        value={skill.notes}
        onChange={handleChange}
        style={{ padding: "5px", marginRight: "10px" }}
      />

      <input
        type="number"
        name="difficulty_rating"
        placeholder="Difficulty (1-5)"
        value={skill.difficulty_rating}
        onChange={handleChange}
        min="1"
        max="5"
        style={{ padding: "5px", marginRight: "10px", width: "80px" }}
      />

      <button type="submit" style={{ padding: "5px 10px" }}>Add Skill</button>
    </form>
  );
}

export default Skillform;
