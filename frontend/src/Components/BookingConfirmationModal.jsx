import React, { useState, useEffect } from "react";
import { X, CheckCircle, Shield, FileText, AlertCircle } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";
const formatINR = (n) => Number(n).toLocaleString("en-IN");

const formatDateTime = (dateStr, timeStr) => {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T${timeStr || "10:00"}`);
  return (
    d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) +
    " • " +
    d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  );
};

export const BookingConfirmationModal = ({
  vehicle,
  bookingData,
  onClose,
  onConfirmed,
}) => {
  const [step, setStep] = useState("preview"); // 'preview' | 'processing' | 'payment' | 'success'
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [paymentSettings, setPaymentSettings] = useState(null);

  useEffect(() => {
    // Fetch UPI settings when modal opens
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API_URL}/payment-settings`);
        setPaymentSettings(res.data);
      } catch (err) {
        console.error("Failed to fetch payment settings", err);
      }
    };
    fetchSettings();
  }, []);

  if (!vehicle || !bookingData) return null;
  const {
    pickupDate,
    pickupTime,
    returnDate,
    returnTime,
    breakdown,
    deposit,
  } = bookingData;
  const totalRental = breakdown?.totalRental || 0;
  const totalPayable = totalRental + (deposit || 0);

  const handleCheckout = async () => {
    setError("");
    setStep("processing");
    try {
      const token = localStorage.getItem("apexlease_token");

      // 1. Create Booking (Status will be "Pending Approval")
      const bookingRes = await axios.post(
        `${API_URL}/bookings`,
        {
          vehicleId: vehicle._id,
          startDate: new Date(`${pickupDate}T${pickupTime}`).toISOString(),
          endDate: new Date(`${returnDate}T${returnTime}`).toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const bId = bookingRes.data.bookingId || bookingRes.data._id;
      setBookingId(bId);
      
      // 2. Move to UPI Payment Screen
      setStep("payment");
      
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to process booking"
      );
      setStep("preview");
    }
  };

  const handleFinishPayment = () => {
    setStep("success");
    if (onConfirmed) onConfirmed();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#181B20",
          border: "1px solid #2D333F",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "480px",
          padding: "36px",
          position: "relative",
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#94A3B8",
          }}
        >
          <X size={20} />
        </button>

        {error && (
          <div
            style={{
              background: "rgba(255,46,84,0.1)",
              border: "1px solid rgba(255,46,84,0.4)",
              color: "#FF6B6B",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "0.85rem",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* STEP 1: PREVIEW */}
        {step === "preview" && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(135deg, rgba(255,122,0,0.15), rgba(255,122,0,0.3))",
                  border: "1px solid rgba(255,122,0,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileText size={18} color="#FF7A00" />
              </div>
              <div>
                <h2
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "700",
                    color: "#FFFFFF",
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  Review Booking
                </h2>
                <p style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
                  Confirm your ride details before payment
                </p>
              </div>
            </div>

            <div
              style={{
                background: "#20242B",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px",
                border: "1px solid #2D333F",
              }}
            >
              <h3
                style={{
                  color: "#FFF",
                  fontWeight: "600",
                  fontSize: "1.05rem",
                  marginBottom: "4px",
                }}
              >
                {vehicle.title}
              </h3>
              <p
                style={{
                  color: "#94A3B8",
                  fontSize: "0.85rem",
                  marginBottom: "16px",
                }}
              >
                {vehicle.locationBranch}
              </p>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.85rem",
                  }}
                >
                  <span style={{ color: "#94A3B8" }}>Pick-up</span>
                  <span style={{ color: "#FFF", fontWeight: "500" }}>
                    {formatDateTime(pickupDate, pickupTime)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.85rem",
                  }}
                >
                  <span style={{ color: "#94A3B8" }}>Return</span>
                  <span style={{ color: "#FFF", fontWeight: "500" }}>
                    {formatDateTime(returnDate, returnTime)}
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(255,122,0,0.05)",
                border: "1px solid rgba(255,122,0,0.2)",
                padding: "16px 20px",
                borderRadius: "12px",
                marginBottom: "24px",
              }}
            >
              <span
                style={{
                  color: "#FF7A00",
                  fontWeight: "600",
                  fontSize: "0.95rem",
                }}
              >
                Total Payable
              </span>
              <span
                style={{ color: "#FFF", fontWeight: "800", fontSize: "1.3rem" }}
              >
                ₹{formatINR(totalPayable)}
              </span>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "14px",
                  background: "transparent",
                  border: "1px solid #2D333F",
                  color: "#FFF",
                  borderRadius: "10px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                style={{
                  flex: 1,
                  padding: "14px",
                  background: "linear-gradient(135deg, #FF7A00, #FF5722)",
                  color: "#FFF",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Proceed to Pay
              </button>
            </div>
          </>
        )}

        {/* STEP 2: PROCESSING */}
        {step === "processing" && (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: "#FFF",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                border: "3px solid rgba(255,122,0,0.3)",
                borderTopColor: "#FF7A00",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 24px",
              }}
            />
            <h3 style={{ fontSize: "1.2rem", marginBottom: "8px" }}>
              Securing Your Booking...
            </h3>
            <p style={{ color: "#94A3B8", fontSize: "0.9rem" }}>
              Please do not close this window.
            </p>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* STEP 3: UPI PAYMENT */}
        {step === "payment" && (
          <div style={{ textAlign: "center" }}>
            <h3
              style={{
                fontSize: "1.3rem",
                fontWeight: "700",
                color: "#FFFFFF",
                marginBottom: "8px",
              }}
            >
              Complete Your Payment
            </h3>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#94A3B8",
                marginBottom: "24px",
              }}
            >
              Scan the QR code below using any UPI app
            </p>

            <div
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "16px",
                display: "inline-block",
                marginBottom: "24px",
              }}
            >
              {paymentSettings?.qrCodeImageUrl ? (
                <img
                  src={
                    paymentSettings.qrCodeImageUrl.startsWith("http")
                      ? paymentSettings.qrCodeImageUrl
                      : `http://localhost:5000${paymentSettings.qrCodeImageUrl}`
                  }
                  alt="UPI QR Code"
                  style={{ width: "200px", height: "200px", objectFit: "contain" }}
                />
              ) : (
                <div
                  style={{
                    width: "200px",
                    height: "200px",
                    background: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#666",
                  }}
                >
                  No QR Available
                </div>
              )}
            </div>

            <div
              style={{
                background: "#20242B",
                border: "1px solid #2D333F",
                padding: "16px",
                borderRadius: "12px",
                marginBottom: "24px",
                textAlign: "left",
              }}
            >
              <p
                style={{
                  color: "#94A3B8",
                  fontSize: "0.85rem",
                  marginBottom: "4px",
                }}
              >
                UPI ID:
              </p>
              <p
                style={{
                  color: "#FFF",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  marginBottom: "12px",
                }}
              >
                {paymentSettings?.upiId || "admin@upi"}
              </p>
              
              <p
                style={{
                  color: "#94A3B8",
                  fontSize: "0.85rem",
                  marginBottom: "4px",
                }}
              >
                Amount to Pay:
              </p>
              <p
                style={{
                  color: "#FF7A00",
                  fontWeight: "800",
                  fontSize: "1.4rem",
                }}
              >
                ₹{formatINR(totalPayable)}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(0,255,136,0.1)",
                color: "#00FF88",
                padding: "12px",
                borderRadius: "8px",
                fontSize: "0.85rem",
                marginBottom: "24px",
                textAlign: "left"
              }}
            >
              <Shield size={16} />
              <span>
                Your booking ID is <strong>#{bookingId.slice(-6).toUpperCase()}</strong>. It will be confirmed once payment is verified.
              </span>
            </div>

            <button
              onClick={handleFinishPayment}
              style={{
                width: "100%",
                padding: "14px",
                background: "linear-gradient(135deg, #00FF88, #00CC6A)",
                color: "#0F1115",
                border: "none",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              I Have Made The Payment
            </button>
          </div>
        )}

        {/* STEP 4: SUCCESS */}
        {step === "success" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <CheckCircle
              size={64}
              color="#00FF88"
              style={{ margin: "0 auto 20px" }}
            />
            <h2
              style={{
                color: "#FFF",
                fontSize: "1.5rem",
                fontWeight: "700",
                marginBottom: "10px",
                fontFamily: "Outfit, sans-serif",
              }}
            >
              Booking Request Sent!
            </h2>
            <p
              style={{
                color: "#94A3B8",
                fontSize: "0.95rem",
                lineHeight: "1.5",
                marginBottom: "24px",
              }}
            >
              Your booking ID is <strong>#{bookingId.slice(-6).toUpperCase()}</strong>.
              <br />
              An admin will review your payment and confirm the booking shortly.
            </p>
            <button
              onClick={onClose}
              style={{
                width: "100%",
                padding: "14px",
                background: "#2D333F",
                color: "#FFF",
                border: "none",
                borderRadius: "10px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Back to Fleet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
