import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

export default function AdminCorrectionList() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/corrections`)
      .then((res) => setRequests(res.data))
      .catch((err) => console.error(err));
  }, []);

  const approveRequest = async (id) => {
    try {
      await axios.put(`${BASE_URL}/api/corrections/approve/${id}`, {
        status: "approved",
        admin_remarks: "Correction approved",
      });
      alert("Approved!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to approve");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Correction Requests</h2>
      {requests.map((r) => (
        <div key={r.id} className="border p-2 mb-2 rounded shadow-sm">
          <p><strong>User ID:</strong> {r.user_id}</p>
          <p><strong>Field:</strong> {r.field_to_correct}</p>
          <p><strong>From:</strong> {r.current_value}</p>
          <p><strong>To:</strong> {r.requested_value}</p>

          <a
            href={`${BASE_URL}/uploads/proof/${r.proof_file}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View Proof
          </a>

          {r.status === "pending" ? (
            <button
              onClick={() => approveRequest(r.id)}
              className="ml-4 bg-green-600 text-white px-3 py-1 rounded"
            >
              Approve
            </button>
          ) : (
            <div className="mt-2">
              <a
                href={`${BASE_URL}/${r.pdf_path}`}
                className="text-green-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Certificate
              </a><br />
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
      ))}
    </div>
  );
}
