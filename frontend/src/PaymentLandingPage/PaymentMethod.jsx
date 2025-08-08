import { useState, useEffect } from "react";
import axios from "axios";
import {
  CheckCircle,
  ArrowLeft,
  Banknote,
  FileText,
  Wallet,
} from "lucide-react";
import qrImage from "../qr_pic/qr_code_sample.jfif";

// Assuming a local QR code image for demonstration
// In a real application, this should be a dynamically loaded resource
// const qrImage = "path/to/your/qr_code_sample.png";

// Assume these are correctly defined elsewhere or can be replaced with your actual values
const BASE_URL = "http://localhost:5000";

const PaymentMethod = ({
  requestDetails,
  onClose,
  showAlert,
  fetchRequests,
  userData,
}) => {
  const [paymentStep, setPaymentStep] = useState("billing");
  const [receiptFile, setReceiptFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    fullName: "",
    address: "",
    email: "",
    contactNumber: "",
  });

  // Use a useEffect hook to populate the billing details when userData is available
  useEffect(() => {
    if (userData) {
      setBillingDetails({
        fullName: `${userData.first_name || ""} ${
          userData.last_name || ""
        }`.trim(),
        address: userData.address || "Address not provided",
        email: userData.email || "",
        contactNumber: userData.phone || "",
      });
    }
  }, [userData]);

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    switch (paymentStep) {
      case "billing":
        if (!billingDetails.fullName || !billingDetails.address) {
          showAlert("Please fill in all required billing details.", "warning");
          return;
        }
        setPaymentStep("summary");
        break;
      case "summary":
        setPaymentStep("payment");
        break;
      default:
        break;
    }
  };

  const prevStep = () => {
    switch (paymentStep) {
      case "summary":
        setPaymentStep("billing");
        break;
      case "payment":
        setPaymentStep("summary");
        break;
      default:
        break;
    }
  };

  const handleReceiptUpload = async () => {
    if (!receiptFile || !requestDetails) {
      showAlert("Please select a receipt file.", "warning");
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("file", receiptFile);

    try {
      await axios.post(
        `${BASE_URL}/api/requests/${requestDetails.id}/receipt`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      await axios.put(`${BASE_URL}/api/requests/${requestDetails.id}/payment`);

      showAlert("Receipt uploaded and request marked as paid.", "success");
      setPaymentStep("confirmation");
      fetchRequests();
    } catch (err) {
      console.error("Error during receipt upload or marking as paid:", err);
      showAlert("Upload failed. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!requestDetails) {
    onClose();
    return null;
  }

  const steps = [
    { id: "billing", title: "Billing Details" },
    { id: "summary", title: "Summary" },
    { id: "payment", title: "Payment" },
    { id: "confirmation", title: "Confirmation" },
  ];

  const getStepStatus = (stepId) => {
    const currentStepIndex = steps.findIndex((s) => s.id === paymentStep);
    const stepIndex = steps.findIndex((s) => s.id === stepId);
    if (stepIndex < currentStepIndex) return "completed";
    if (stepIndex === currentStepIndex) return "current";
    return "pending";
  };

  const Stepper = () => (
    <div className="flex justify-between items-center w-full mb-8">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className="flex-1 flex flex-col items-center relative"
        >
          <div className="relative z-10 flex items-center justify-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
              ${
                getStepStatus(step.id) === "completed"
                  ? "bg-green-500"
                  : getStepStatus(step.id) === "current"
                  ? "bg-blue-600"
                  : "bg-gray-300"
              }`}
            >
              {getStepStatus(step.id) === "completed" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </div>
          </div>
          <p
            className={`text-center text-sm mt-2 font-medium ${
              getStepStatus(step.id) === "current"
                ? "text-blue-600"
                : "text-gray-500"
            }`}
          >
            {step.title}
          </p>
          {index < steps.length - 1 && (
            <div
              className={`absolute left-1/2 -right-1/2 top-5 transform -translate-y-1/2 h-0.5
              ${
                getStepStatus(steps[index + 1].id) === "completed" ||
                getStepStatus(steps[index + 1].id) === "current"
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (paymentStep) {
      case "billing":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Billing Details
            </h3>
            <p className="text-gray-600 text-sm">
              Please fill out your billing information to proceed with the
              payment.
            </p>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={billingDetails.fullName}
                  onChange={handleBillingChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  value={billingDetails.address}
                  onChange={handleBillingChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 resize-none"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={billingDetails.email}
                  onChange={handleBillingChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                />
              </div>
              <div>
                <label
                  htmlFor="contactNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contact Number
                </label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={billingDetails.contactNumber}
                  onChange={handleBillingChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md font-semibold hover:bg-blue-700 transition"
              >
                Next
              </button>
            </div>
          </div>
        );
      case "summary":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Order Summary
            </h3>
            <p className="text-gray-600 text-sm">
              Please review your order and billing details before proceeding to
              payment.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg shadow-inner space-y-2">
              <div className="flex justify-between border-b pb-2">
                <p className="text-gray-600 font-medium">Request Type:</p>
                <p className="font-semibold text-gray-900">
                  {requestDetails.type}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600 font-medium">Payment Amount:</p>
                <p className="font-bold text-blue-600">
                  ₱{requestDetails.price}
                </p>
              </div>
            </div>
            <h4 className="text-lg font-semibold text-gray-800">
              Billing Information
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg shadow-inner space-y-2">
              <p className="text-sm font-medium text-gray-900">
                {billingDetails.fullName}
              </p>
              <p className="text-sm text-gray-600">{billingDetails.address}</p>
              <p className="text-sm text-gray-600">{billingDetails.email}</p>
              <p className="text-sm text-gray-600">
                {billingDetails.contactNumber}
              </p>
            </div>
            <div className="flex justify-between pt-4">
              <button
                onClick={prevStep}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-md font-semibold hover:bg-gray-300 transition"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md font-semibold hover:bg-blue-700 transition"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        );
      case "payment":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Choose Payment Method
            </h3>
            <div className="bg-blue-50 p-6 rounded-lg shadow-inner text-center">
              <h4 className="text-lg font-bold text-blue-800 flex items-center justify-center gap-2 mb-4">
                <Banknote className="w-6 h-6" />
                GCash Payment
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Scan the QR code below using your GCash app to pay.
              </p>
              <img
                src={qrImage}
                alt="GCash QR Code"
                className="w-48 h-48 border-4 border-blue-400 rounded-lg mx-auto mb-4"
              />
              <div>
                <label
                  htmlFor="receipt"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Upload Receipt
                </label>
                <input
                  type="file"
                  id="receipt"
                  accept="image/*"
                  onChange={(e) => setReceiptFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
                />
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <button
                onClick={prevStep}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-md font-semibold hover:bg-gray-300 transition"
              >
                Back
              </button>
              <button
                onClick={handleReceiptUpload}
                disabled={isSubmitting || !receiptFile}
                className={`px-6 py-2 rounded-lg text-white font-semibold flex items-center gap-2 transition ${
                  isSubmitting || !receiptFile
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
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
                    <span>Submit Receipt</span>
                  </>
                )}
              </button>
            </div>
          </div>
        );
      case "confirmation":
        return (
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <CheckCircle className="w-20 h-20 text-green-500" />
            <h3 className="text-2xl font-bold text-gray-800">
              Payment Submitted!
            </h3>
            <p className="text-gray-600">
              Thank you for your payment. Your receipt has been uploaded and is
              awaiting confirmation. You may now close this page.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md font-semibold hover:bg-blue-700 transition"
            >
              Back to Dashboard
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full ">
        <header className="flex items-center justify-between mb-8 border-b pb-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800 flex-1 text-center">
            Payment Transaction
          </h2>
          <div className="w-6 h-6"></div>
        </header>
        <Stepper />
        {renderContent()}
      </div>
    </div>
  );
};

export default PaymentMethod;
