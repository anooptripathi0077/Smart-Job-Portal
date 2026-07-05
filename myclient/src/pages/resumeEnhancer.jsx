import React, { useState } from "react";
import axios from "axios";
import "./resumeEnhancer.css";

const ResumeEnhancer = () => {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult("");

    if (!file) {
      setError("Please upload a resume file.");
      return;
    }
    if (!targetRole.trim()) {
      setError("Please enter a target role.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("targetRole", targetRole);

    try {
      setLoading(true);
      const res = await axios.post("/api/resume/enhance", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(res.data.result);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-enhancer">
      <h2>Resume Enhancement</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Target Job Role</label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Full-stack Developer (Node + React)"
          />
        </div>

        <div>
          <label>Upload Resume (PDF / DOCX)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Enhance Resume"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div className="enhance-result">
          <h3>Suggestions</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default ResumeEnhancer;
