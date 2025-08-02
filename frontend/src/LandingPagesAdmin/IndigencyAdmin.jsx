import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:5000"; 

const IndigencyAdmin = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/indigency`);
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setRequests(data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load indigency requests");
      setRequests([]);
    }
  };

  const approveRequest = async (id) => {
    try {
      await axios.put(`${API_BASE}/api/indigency/approve/${id}`);
      toast.success("Request approved and certificate generated");
      fetchRequests();
    } catch (err) {
      console.error("Approve error:", err);
      toast.error("Failed to approve request");
    }
  };

  const downloadCertificate = (id) => {
    window.open(`${API_BASE}/api/indigency/download/${id}`, "_blank");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Indigency Certificate Requests</h2>

      {Array.isArray(requests) && requests.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="border p-4 rounded-md shadow bg-white space-y-2"
            >
              <p><strong>Name:</strong> {req.first_name} {req.last_name}</p>
              <p><strong>User ID:</strong> {req.user_id}</p>
              <p><strong>Purpose:</strong> {req.purpose}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={req.status === "approved" ? "text-green-600" : "text-yellow-600"}>
                  {req.status}
                </span>
              </p>

              {req.proof_file && (
                <a
                  href={`${API_BASE}/uploads/${req.proof_file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View Uploaded Proof
                </a>
              )}

              <div className="flex gap-3 mt-2">
                {req.status === "pending" && (
                  <button
                    onClick={() => approveRequest(req.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                )}
                {req.status === "approved" && (
                  <button
                    onClick={() => downloadCertificate(req.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Download Certificate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IndigencyAdmin;
