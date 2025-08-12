import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Bell,
  ArrowLeft,
  Banknote,
  LogOut,
  FileText,
  Clock,
  CalendarDays,
  UploadCloud,
} from "lucide-react";
import { io } from "socket.io-client";
import PaymentMethod from "../PaymentLandingPage/PaymentMethod";

const socket = io("http://localhost:5000");
const API_BASE = "http://localhost:5000";
const BASE_URL = "http://localhost:5000";

const SystemAlert = ({ message, type, onClose, isVisible }) => {
  const getAlertStyles = () => {
    const baseStyles =
      "flex items-center p-4 rounded-lg shadow-md border max-w-lg w-full transition-all duration-300";
    switch (type) {
      case "success":
        return `${baseStyles} bg-green-50 border-green-200 text-green-800`;
      case "error":
        return `${baseStyles} bg-red-50 border-red-200 text-red-800`;
      case "warning":
        return `${baseStyles} bg-yellow-50 border-yellow-200 text-yellow-800`;
      case "info":
        return `${baseStyles} bg-blue-50 border-blue-200 text-blue-800`;
      default:
        return `${baseStyles} bg-gray-50 border-gray-200 text-gray-800`;
    }
  };

  const getIcon = () => {
    const iconClass = "w-6 h-6 mr-3 flex-shrink-0";
    switch (type) {
      case "success":
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case "error":
        return <XCircle className={`${iconClass} text-red-500`} />;
      case "warning":
        return <AlertCircle className={`${iconClass} text-yellow-500`} />;
      case "info":
        return <Bell className={`${iconClass} text-blue-500`} />;
      default:
        return <AlertCircle className={`${iconClass} text-gray-500`} />;
    }
  };

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out
          ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0"
          }`}
    >
      <div className={getAlertStyles()}>
        {getIcon()}
        <div className="flex-1">
          <p className="font-semibold text-sm">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const useSystemAlert = () => {
  const [alertState, setAlertState] = useState(null);

  const showAlert = useCallback(
    (message, type = "success", duration = 4000) => {
      setAlertState({ message, type, isVisible: true });
      setTimeout(() => {
        setAlertState((prev) => (prev ? { ...prev, isVisible: false } : null));
      }, duration);
      setTimeout(() => {
        setAlertState(null);
      }, duration + 300);
    },
    []
  );

  const hideAlert = useCallback(() => {
    setAlertState((prev) => (prev ? { ...prev, isVisible: false } : null));
    setTimeout(() => {
      setAlertState(null);
    }, 300);
  }, []);

  return { alert: alertState, showAlert, hideAlert };
};

const RecordsLandingPage = () => {
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [details, setDetails] = useState("");
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const userId = localStorage.getItem("userId");
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState([]);
  const [requestTypes, setRequestTypes] = useState([]);
  const { alert: systemAlert, showAlert, hideAlert } = useSystemAlert();
  const [isPaymentViewOpen, setIsPaymentViewOpen] = useState(false);
  const [requestToPay, setRequestToPay] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [street, setStreet] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [hospitalAdmitted, setHospitalAdmitted] = useState("");
  const [medicalAbstract, setMedicalAbstract] = useState(null);
  const [medicalRequest, setMedicalRequest] = useState(null);
  const [hospitalBill, setHospitalBill] = useState(null);
  const [socialCaseStudy, setSocialCaseStudy] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [representativeId, setRepresentativeId] = useState(null);

  // --- NEW STATE FOR PLACE SUGGESTIONS ---
  const [municipalitySuggestions, setMunicipalitySuggestions] = useState([]);
  const [streetSuggestions, setStreetSuggestions] = useState([]);
  const [isMunicipalityLoading, setIsMunicipalityLoading] = useState(false);
  const [isStreetLoading, setIsStreetLoading] = useState(false);

  // --- CORRECTED DEBOUNCED API CALL FUNCTION ---
  const fetchSuggestions = useCallback(
    async (query, searchType, updater) => {
      if (query.length < 3) {
        updater([]);
        return;
      }

      const setLoader =
        searchType === "municipality"
          ? setIsMunicipalityLoading
          : setIsStreetLoading;
      setLoader(true);

      const url = `https://nominatim.openstreetmap.org/search?q=${query}, Laguna, Philippines&format=json&limit=5&addressdetails=1&countrycodes=ph`;

      try {
        const res = await axios.get(url);

        const suggestions = res.data
          .filter(
            (item) =>
              item.address.state === "Laguna" &&
              (searchType === "municipality"
                ? item.address.city || item.address.town || item.address.village
                : item.address.suburb ||
                  item.address.village ||
                  item.address.road)
          )
          .map((item) => ({
            display: item.display_name,
            municipality:
              item.address.city || item.address.town || item.address.village,
            barangay:
              item.address.suburb || item.address.village || item.address.road,
          }));
        updater(suggestions);
      } catch (err) {
        console.error(`Failed to fetch ${searchType} suggestions:`, err);
        showAlert(`Failed to fetch ${searchType} suggestions.`, "error");
        updater([]);
      } finally {
        setLoader(false);
      }
    },
    [showAlert]
  );

  // --- NEW useEffect hooks for debouncing ---
  useEffect(() => {
    const handler = setTimeout(() => {
      if (municipality.length > 0) {
        fetchSuggestions(
          municipality,
          "municipality",
          setMunicipalitySuggestions
        );
      } else {
        setMunicipalitySuggestions([]);
      }
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [municipality, fetchSuggestions]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (street.length > 0 && municipality.length > 0) {
        fetchSuggestions(
          `${street}, ${municipality}`,
          "street",
          setStreetSuggestions
        );
      } else {
        setStreetSuggestions([]);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [street, municipality, fetchSuggestions]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/requests/stats`);
      const data = res.data;
      setStats([
        { title: "Total Requests", value: data.total, icon: FileText },
        { title: "Pending Requests", value: data.pending, icon: Clock },
        {
          title: "Completed Requests",
          value: data.completed,
          icon: CheckCircle,
        },
        { title: "This Month", value: data.thisMonth, icon: CalendarDays },
      ]);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      showAlert("Failed to load statistics.", "error");
    }
  };

  const handleProceedToPayment = (requestId) => {
    const request = activities.find((a) => a.id === requestId);
    if (request) {
      const requestType = requestTypes.find((req) => req.name === request.type);
      if (requestType) {
        setRequestToPay({
          ...request,
          price: requestType.price,
        });
        setIsPaymentViewOpen(true);
      } else {
        showAlert(
          "Price information not found for this request type.",
          "error"
        );
      }
    } else {
      showAlert("Request details not found.", "error");
    }
  };

  const handleClosePaymentView = () => {
    setIsPaymentViewOpen(false);
    setRequestToPay(null);
    fetchRequests();
  };

  const fetchRequestTypes = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/request-types?status=published`
      );
      setRequestTypes(res.data);
      if (res.data.length > 0 && !type) {
        setType(res.data[0].name);
      } else if (res.data.length === 0) {
        setType("");
      }
    } catch (err) {
      console.error("Failed to fetch request types:", err);
      showAlert("Failed to load available request types.", "error");
    }
  }, [showAlert, type]);

  useEffect(() => {
    if (!userId) return;
    fetchStats();
    fetchRequestTypes();

    const storedNotification = sessionStorage.getItem("loginNotification");
    if (storedNotification) {
      try {
        const { message, type } = JSON.parse(storedNotification);
        showAlert(message, type);
        sessionStorage.removeItem("loginNotification");
      } catch (e) {
        console.error("Failed to parse stored notification:", e);
      }
    }

    socket.on("newRequest", (data) => {
      fetchStats();
      if (data.user_id == userId) {
        setActivities((prev) => [data, ...prev]);
        showAlert("Your request status has been updated!", "info");
      }
    });
    return () => {
      socket.off("newRequest");
    };
  }, [userId, fetchStats, fetchRequestTypes, showAlert]);

  const fetchRequests = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_BASE}/api/requests/user/${userId}`);
      setActivities(res.data);
    } catch (error) {
      console.error("Failed to fetch user requests:", error);
      showAlert("Failed to load your past requests.", "error");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [userId, showAlert]);

  useEffect(() => {
    if (!userId) return;
    fetch(`${API_BASE}/api/users/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then((data) => setUserInfo(data))
      .catch((err) => {
        console.error("Failed to fetch user info", err);
        showAlert("Failed to load user information.", "error");
      });
  }, [userId, showAlert]);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (!userId) {
      showAlert("User not logged in.", "error");
      setIsSubmitting(false);
      return;
    }

    const noFilesUploaded =
      !medicalAbstract &&
      !medicalRequest &&
      !hospitalBill &&
      !socialCaseStudy &&
      !patientId &&
      !representativeId;

    if (!type || !details || noFilesUploaded || requestTypes.length === 0) {
      showAlert("Please fill in all fields and upload a document.", "warning");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("type", type);
    formData.append("details", details);
    formData.append("user_id", userId);
    formData.append("patient_name", patientName);
    formData.append("age", age);
    formData.append("gender", gender);
    formData.append("street", street);
    formData.append("municipality", municipality);
    formData.append("hospital_admitted", hospitalAdmitted);

    if (medicalAbstract) formData.append("medical_abstract", medicalAbstract);
    if (medicalRequest) formData.append("medical_request", medicalRequest);
    if (hospitalBill) formData.append("hospital_bill", hospitalBill);
    if (socialCaseStudy) formData.append("social_case_study", socialCaseStudy);
    if (patientId) formData.append("patient_id_file", patientId);
    if (representativeId)
      formData.append("representative_id_file", representativeId);

    try {
      const res = await fetch(`${API_BASE}/api/requests`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to submit request");

      showAlert("Request submitted successfully!", "success");

      setType(requestTypes.length > 0 ? requestTypes[0].name : "");
      setDetails("");
      setPatientName("");
      setAge("");
      setGender("");
      setStreet("");
      setMunicipality("");
      setHospitalAdmitted("");

      setMedicalAbstract(null);
      setMedicalRequest(null);
      setHospitalBill(null);
      setSocialCaseStudy(null);
      setPatientId(null);
      setRepresentativeId(null);
      setFile(null);

      fetchRequests();
    } catch (error) {
      console.error(error);
      showAlert("Failed to submit request.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userStatus");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "approved":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const selectedRequestType = requestTypes.find((req) => req.name === type);
  const selectedPrice = selectedRequestType ? selectedRequestType.price : null;
  const fileName = file ? file.name : "No file selected";

  if (isPaymentViewOpen && requestToPay) {
    return (
      <PaymentMethod
        requestDetails={requestToPay}
        onClose={handleClosePaymentView}
        showAlert={showAlert}
        fetchRequests={fetchRequests}
        userData={userInfo}
        price={requestToPay.price}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {systemAlert && (
        <SystemAlert
          message={systemAlert.message}
          type={systemAlert.type}
          onClose={hideAlert}
          isVisible={systemAlert.isVisible}
        />
      )}

      <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900 ml-2">
            Resident Records
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-600 hidden sm:block">
            Hi,{" "}
            <span className="font-semibold">
              {userInfo.first_name || "Resident"}
            </span>
            !
          </p>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-gray-100"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="p-6 md:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Create New Request
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  disabled={isSubmitting || requestTypes.length === 0}
                  className="w-full border border-gray-300 rounded-lg shadow-sm text-sm p-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {requestTypes.length === 0 ? (
                    <option value="">No request types available</option>
                  ) : (
                    requestTypes.map((reqType) => (
                      <option key={reqType.id} value={reqType.name}>
                        {reqType.name}
                      </option>
                    ))
                  )}
                </select>
                {requestTypes.length === 0 && (
                  <p className="text-xs text-red-500 mt-2">
                    No request types are currently published.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full border border-gray-300 rounded-lg shadow-sm text-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full border border-gray-300 rounded-lg shadow-sm text-sm p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full border border-gray-300 rounded-lg shadow-sm text-sm p-2.5"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                {/* --- MUNICIPALITY/CITY INPUT WITH SUGGESTIONS --- */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Municipality/City
                  </label>
                  <input
                    type="text"
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full border border-gray-300 rounded-lg shadow-sm text-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {isMunicipalityLoading && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 p-2 text-center text-sm text-gray-500">
                      Loading...
                    </div>
                  )}
                  {!isMunicipalityLoading &&
                    municipalitySuggestions.length > 0 && (
                      <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
                        {municipalitySuggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            onClick={() => {
                              setMunicipality(suggestion.municipality);
                              setMunicipalitySuggestions([]);
                            }}
                            className="p-2 cursor-pointer hover:bg-blue-50 transition-colors text-sm"
                          >
                            {suggestion.municipality}, Laguna, Philippines
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              </div>

              {/* --- STREET/BARANGAY INPUT WITH SUGGESTIONS --- */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street/Barangay
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full border border-gray-300 rounded-lg shadow-sm text-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {isStreetLoading && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 p-2 text-center text-sm text-gray-500">
                    Loading...
                  </div>
                )}
                {!isStreetLoading && streetSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
                    {streetSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          setStreet(suggestion.barangay || suggestion.street);
                          setStreetSuggestions([]);
                        }}
                        className="p-2 cursor-pointer hover:bg-blue-50 transition-colors text-sm"
                      >
                        {suggestion.barangay}, {suggestion.municipality},
                        Laguna, Philippines
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hospital Admitted
                </label>
                <input
                  type="text"
                  value={hospitalAdmitted}
                  onChange={(e) => setHospitalAdmitted(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full border border-gray-300 rounded-lg shadow-sm text-sm p-2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Details
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full border border-gray-300 rounded-lg shadow-sm text-sm p-2.5 resize-none h-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Provide detailed information about your request..."
                />
              </div>

              {[
                {
                  label: "Medical Abstract/Medical Certificate",
                  state: medicalAbstract,
                  set: setMedicalAbstract,
                },
                {
                  label: "Medical Request/Prescription",
                  state: medicalRequest,
                  set: setMedicalRequest,
                },
                {
                  label: "Hospital Final Bill/Quotation",
                  state: hospitalBill,
                  set: setHospitalBill,
                },
                {
                  label: "Social Case Study Report",
                  state: socialCaseStudy,
                  set: setSocialCaseStudy,
                },
                { label: "Patient ID", state: patientId, set: setPatientId },
                {
                  label: "Representative ID",
                  state: representativeId,
                  set: setRepresentativeId,
                },
              ].map((doc, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {doc.label}
                  </label>
                  <label className="relative w-full flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center">
                      <UploadCloud className="w-8 h-8 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-600">
                        {doc.state
                          ? doc.state.name
                          : `Click to upload ${doc.label}`}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        (Max file size 5MB)
                      </span>
                    </div>
                    <input
                      type="file"
                      onChange={(e) => doc.set(e.target.files[0])}
                      disabled={isSubmitting}
                      className="sr-only absolute"
                    />
                  </label>
                </div>
              ))}

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || requestTypes.length === 0}
                  className={`px-6 py-2 rounded-lg text-white text-sm font-semibold flex items-center justify-center space-x-2 transition-colors ${
                    isSubmitting || requestTypes.length === 0
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Submit Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
                   {" "}
            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent activity yet.</p>
              ) : (
                activities
                  .slice()
                  .reverse()
                  .map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full flex-shrink-0 ${getStatusColor(
                            activity.status
                          )}`}
                        ></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">
                            {activity.type}
                          </p>
                          <p className="text-xs text-gray-500 capitalize mt-1">
                            Status: {activity.status}
                          </p>
                          {activity.status === "approved" &&
                            activity.payment_status === "unpaid" && (
                              <button
                                onClick={() =>
                                  handleProceedToPayment(activity.id)
                                }
                                className="mt-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-green-700 transition-colors"
                              >
                                <div className="flex items-center space-x-1">
                                  <Banknote className="w-3 h-3" />
                                  <span>Proceed to Payment</span>
                                </div>
                              </button>
                            )}
                          {activity.status === "approved" &&
                            activity.payment_status === "paid" && (
                              <p className="mt-2 text-green-600 text-xs font-medium">
                                Payment submitted, awaiting confirmation.
                              </p>
                            )}
                          {activity.status === "completed" &&
                            activity.approval_file && (
                              <div className="mt-2 flex items-center gap-4 text-green-600 text-xs font-semibold">
                                {activity.approval_type === "cash_payment" &&
                                  activity.cash_amount && (
                                    <span className="whitespace-nowrap">
                                      Amount Released: ₱
                                      {Number(
                                        activity.cash_amount
                                      ).toLocaleString()}
                                    </span>
                                  )}
                                <a
                                  href={`${API_BASE}/uploads/${activity.approval_file}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="whitespace-nowrap hover:text-green-800 hover:underline"
                                >
                                  Download Document
                                </a>
                              </div>
                            )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecordsLandingPage;
