import { useState, useEffect } from "react";
import axios from "axios";

const IndigencyRequest = () => {
  const [purpose, setPurpose] = useState("");
  const [file, setFile] = useState(null);
  const [requests, setRequests] = useState([]);
  const userId = localStorage.getItem("userId");

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/indigency/user/${userId}`
      );
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests", err);
    }
  };

  useEffect(() => {
    if (userId) fetchRequests();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("purpose", purpose);
    formData.append("proof_file", file);
    formData.append("user_id", userId);

    try {
      await axios.post("http://localhost:5000/api/indigency", formData);
      alert("Request submitted");
      setPurpose("");
      setFile(null);
      fetchRequests();
    } catch (err) {
      alert("Submission failed");
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-xl font-semibold">Request Indigency Certificate</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Purpose
          </label>
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded"
            placeholder="State the reason for your request..."
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Proof (optional)
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mt-1"
          />
        </div>
        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
        >
          Submit Request
        </button>
      </form>

      <hr />

      <h3 className="text-lg font-semibold mt-6">My Requests</h3>
      <ul className="space-y-2">
        {requests.map((req) => (
          <li
            key={req.id}
            className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">Purpose: {req.purpose}</p>
              <p className="text-sm text-gray-600">Status: {req.status}</p>

              {req.status === "approved" && (
                <button
                  onClick={() =>
                    window.open(
                      `http://localhost:5000/api/indigency/download/${req.id}`,
                      "_blank"
                    )
                  }
                  className="text-blue-600 underline text-sm mt-1"
                >
                  Download Certificate
                </button>
              )}
            </div>

            <span className="text-sm text-gray-500">
              {new Date(req.created_at).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IndigencyRequest;
