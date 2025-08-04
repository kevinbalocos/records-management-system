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
      .get(`http://localhost:5000/api/corrections/user/${userId}`)
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
          <div key={r.id} className="border p-2 mb-2 rounded">
            <p>
              <strong>Field:</strong> {r.field_to_correct}
            </p>
            <p>
              <strong>Status:</strong> {r.status}
            </p>
            {r.status === "approved" && (
              <div className="mt-2">
                <a
                  href={`${BASE_URL}/${r.pdf_path}`}
                  className="text-green-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Certificate
                </a>
                <br />
                <a
                  href={`${BASE_URL}/${r.original_pdf_path}`}
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
