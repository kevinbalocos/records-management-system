import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

export default function AdminCorrectionList() {
  const [requests, setRequests] = useState([]);
  const [fileInputs, setFileInputs] = useState({}); // hold selected files per request

  useEffect(() => {
    axios.get(`${BASE_URL}/api/corrections`)
      .then((res) => setRequests(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleFileChange = (e, id) => {
    setFileInputs({ ...fileInputs, [id]: e.target.files[0] });
  };

  const approveRequest = async (id) => {
    const file = fileInputs[id];
    if (!file) {
      alert("Please upload the corrected file before approving.");
      return;
    }

    const formData = new FormData();
    formData.append("status", "completed");
    formData.append("admin_remarks", "Correction completed and file uploaded.");
    formData.append("admin_file", file);

    try {
      await axios.put(`${BASE_URL}/api/corrections/approve/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Correction completed!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to complete correction.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Correction Requests</h2>
      {requests.map((r) => (
        <div key={r.id} className="border p-3 mb-4 rounded shadow-sm bg-white">
          <p><strong>User ID:</strong> {r.user_id}</p>
          <p><strong>Record Type:</strong> {r.record_type}</p>
          <p><strong>Description:</strong> {r.description}</p>

          {r.proof_file && (
            <a
              href={`${BASE_URL}/uploads/proof/${r.proof_file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Submitted Proof
            </a>
          )}

          {r.status === "pending" ? (
            <div className="mt-2">
              <input
                type="file"
                onChange={(e) => handleFileChange(e, r.id)}
                className="mt-2"
              />
              <button
                onClick={() => approveRequest(r.id)}
                className="ml-2 bg-green-600 text-white px-3 py-1 rounded"
              >
                Upload & Approve
              </button>
            </div>
          ) : (
            <div className="mt-3">
              <p><strong>Status:</strong> {r.status}</p>
              <p><strong>Admin Remarks:</strong> {r.admin_remarks}</p>

              {r.admin_file && (
                <a
                  href={`${BASE_URL}/uploads/admin_files/${r.admin_file}`}
                  className="text-green-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Corrected File
                </a>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
