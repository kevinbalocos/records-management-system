import { useState } from "react";
import axios from "axios";

export default function UserCorrectionForm() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  const [form, setForm] = useState({
    record_type: "users",
    record_id: "",
    description: "",
  });

  const [proofFile, setProofFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("user_id", userId);
    Object.entries(form).forEach(([key, value]) => {
      data.append(key, value);
    });
    data.append("proof_file", proofFile);

    try {
      await axios.post("http://localhost:5000/api/corrections", data);
      setMessage("Correction request submitted successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to submit request.");
    }
  };

  return (
    <div className="p-4 border rounded-md max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-2">Document Correction Request</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <select
          name="record_type"
          value={form.record_type}
          onChange={handleChange}
          className="p-2 border"
          required
        >
          <option value="">Select Record Type</option>
          <option value="indigency">Indigency Certificate</option>
          <option value="medical">Medical Assistance</option>
          <option value="guarantee_letter">Guarantee Letter</option>
          <option value="financial">Financial Assistance</option>
        </select>

        <input
          name="record_id"
          placeholder="Record ID"
          value={form.record_id}
          onChange={handleChange}
          className="p-2 border"
          required
        />

        <textarea
          name="description"
          placeholder="Describe what needs to be corrected"
          value={form.description}
          onChange={handleChange}
          className="p-2 border"
          rows={4}
          required
        />

        <input
          type="file"
          onChange={(e) => setProofFile(e.target.files[0])}
          className="p-2 border"
          required
        />

        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Submit
        </button>
      </form>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
