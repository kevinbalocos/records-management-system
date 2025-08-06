import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

export default function UserCorrectionHistory() {
  const [requests, setRequests] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser?.id);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`${BASE_URL}/api/corrections/user/${userId}`)
      .then((res) => setRequests(res.data))
      .catch((err) => console.error(err));
  }, [userId]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">My Correction Requests</h2>
      {requests.length === 0 ? (
        <p className="text-sm text-gray-500">No requests found.</p>
      ) : (
        requests.map((r) => (
          <div key={r.id} className="border p-2 mb-2 rounded shadow-sm">
            <p>
              <strong>Description:</strong> {r.description}
            </p>
            <p>
              <strong>Record Type:</strong> {r.record_type}
            </p>
            <p>
              <strong>Record ID:</strong> {r.record_id}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`${
                  r.status === "approved"
                    ? "text-green-600"
                    : r.status === "rejected"
                    ? "text-red-600"
                    : r.status === "completed"
                    ? "text-blue-600"
                    : "text-yellow-600"
                } font-semibold`}
              >
                {r.status}
              </span>
            </p>

            {r.admin_remarks && (
              <p>
                <strong>Admin Remarks:</strong> {r.admin_remarks}
              </p>
            )}

            {r.status === "completed" && r.admin_file && (
              <div className="mt-2">
                <a
                  href={`${BASE_URL}/uploads/admin_files/${r.admin_file}`}
                  className="text-green-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Updated Record
                </a>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
