import React, { useContext } from "react";
import { ApexContext } from "../Context/ApexContext";
import { ApexNavbar } from "../Components/ApexNavbar";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bike,
  Car,
  ChevronRight,
} from "lucide-react";

const STATUS_COLORS = {
  Confirmed: { bg: "rgba(255,122,0,0.12)", color: "#FF7A00", border: "rgba(255,122,0,0.3)" },
  "Active (Rented)": { bg: "rgba(0,255,136,0.1)", color: "#00FF88", border: "rgba(0,255,136,0.3)" },
  Completed: { bg: "rgba(100,100,255,0.1)", color: "#8B8BFF", border: "rgba(100,100,255,0.3)" },
  Cancelled: { bg: "rgba(255,46,84,0.1)", color: "#FF4444", border: "rgba(255,46,84,0.3)" },
  "Pending Approval": { bg: "rgba(255,200,0,0.1)", color: "#FFC800", border: "rgba(255,200,0,0.3)" },
};

const StatusIcon = ({ status }) => {
  if (status === "Confirmed" || status === "Active (Rented)")
    return <CheckCircle size={14} />;
  if (status === "Cancelled") return <XCircle size={14} />;
  return <AlertCircle size={14} />;
};

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const DashboardPage = ({ onPageChange }) => {
  const { user, myBookings, logout } = useContext(ApexContext);

  const active = myBookings.filter((b) =>
    ["Confirmed", "Active (Rented)", "Pending Approval"].includes(b.status)
  );
  const past = myBookings.filter((b) =>
    ["Completed", "Cancelled"].includes(b.status)
  );
  const totalSpent = myBookings
    .filter((b) => ["Confirmed", "Active (Rented)", "Completed"].includes(b.status))
    .reduce((s, b) => s + (b.totalCost || 0), 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0D1117 0%, #0F1419 60%, #140F0A 100%)",
        color: "#fff",
        fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
      }}
    >
      <ApexNavbar
        onPageChange={onPageChange}
        onDashboard={onPageChange}
        activePage="dashboard"
      />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "100px 24px 60px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "40px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <p style={{ color: "#FF7A00", fontWeight: "700", fontSize: "0.82rem", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>
              MY ACCOUNT
            </p>
            <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#FFFFFF", fontFamily: "Outfit, sans-serif", lineHeight: 1.2 }}>
              Welcome back, {user?.name?.split(" ")[0] || "Rider"} 👋
            </h1>
            <p style={{ color: "#64748B", marginTop: "6px", fontSize: "0.9rem" }}>
              {user?.email}
            </p>
          </div>
          <button
            onClick={() => { logout(); onPageChange("home"); }}
            style={{
              padding: "10px 22px",
              border: "1px solid rgba(255,68,68,0.3)",
              background: "rgba(255,68,68,0.08)",
              color: "#FF4444",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.85rem",
              transition: "all 0.2s",
            }}
          >
            Logout
          </button>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          {[
            { label: "Total Bookings", value: myBookings.length, icon: "📋" },
            { label: "Active Rides", value: active.length, icon: "🏍" },
            { label: "Completed", value: past.filter(b => b.status === "Completed").length, icon: "✅" },
            { label: "Total Spent", value: `₹${totalSpent.toLocaleString("en-IN")}`, icon: "💰" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "linear-gradient(135deg, #181B20, #1E2128)",
                border: "1px solid #2D333F",
                borderRadius: "14px",
                padding: "22px 24px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <span style={{ fontSize: "1.8rem" }}>{stat.icon}</span>
              <div>
                <p style={{ color: "#64748B", fontSize: "0.78rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {stat.label}
                </p>
                <p style={{ color: "#FFFFFF", fontSize: "1.5rem", fontWeight: "800", marginTop: "2px" }}>
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Active Bookings */}
        <section style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#FFFFFF", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#FF7A00", display: "inline-block", boxShadow: "0 0 8px rgba(255,122,0,0.8)" }} />
            Active Reservations
          </h2>

          {active.length === 0 ? (
            <div style={{ background: "#181B20", border: "1px solid #2D333F", borderRadius: "14px", padding: "48px", textAlign: "center" }}>
              <p style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🏍</p>
              <p style={{ color: "#94A3B8", fontWeight: "600" }}>No active bookings</p>
              <p style={{ color: "#64748B", fontSize: "0.85rem", marginTop: "4px" }}>Ready for your next ride?</p>
              <button
                onClick={() => onPageChange("home")}
                style={{
                  marginTop: "20px",
                  padding: "10px 24px",
                  background: "linear-gradient(135deg, #FF7A00, #FF5722)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "0.88rem",
                }}
              >
                Explore Fleet →
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {active.map((b) => (
                <BookingCard key={b._id} booking={b} onPageChange={onPageChange} />
              ))}
            </div>
          )}
        </section>

        {/* Past Bookings */}
        {past.length > 0 && (
          <section>
            <h2 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#FFFFFF", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#64748B", display: "inline-block" }} />
              Past Bookings
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {past.map((b) => (
                <BookingCard key={b._id} booking={b} onPageChange={onPageChange} />
              ))}
            </div>
          </section>
        )}

        {myBookings.length === 0 && (
          <div style={{ background: "#181B20", border: "1px solid #2D333F", borderRadius: "16px", padding: "80px 40px", textAlign: "center" }}>
            <p style={{ fontSize: "3rem", marginBottom: "16px" }}>🛣️</p>
            <h3 style={{ color: "#FFFFFF", fontWeight: "700", fontSize: "1.3rem", marginBottom: "8px" }}>No Bookings Yet</h3>
            <p style={{ color: "#64748B", fontSize: "0.9rem" }}>Start your journey by exploring our premium fleet.</p>
            <button
              onClick={() => onPageChange("home")}
              style={{
                marginTop: "24px",
                padding: "12px 32px",
                background: "linear-gradient(135deg, #FF7A00, #FF5722)",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "0.95rem",
              }}
            >
              Explore Fleet →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const BookingCard = ({ booking: b, onPageChange }) => {
  const s = STATUS_COLORS[b.status] || STATUS_COLORS["Pending Approval"];
  const isVehicleBike = b.vehicle?.vehicleType === "Superbike";

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #181B20, #1E2128)",
        border: "1px solid #2D333F",
        borderRadius: "14px",
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,122,0,0.3)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2D333F")}
    >
      {/* Vehicle Icon */}
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "12px",
          background: "rgba(255,122,0,0.08)",
          border: "1px solid rgba(255,122,0,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: "1.6rem",
        }}
      >
        {isVehicleBike ? "🏍" : "🚗"}
      </div>

      {/* Vehicle Info */}
      <div style={{ flex: 1, minWidth: "200px" }}>
        <p style={{ color: "#FFFFFF", fontWeight: "700", fontSize: "1rem", marginBottom: "4px" }}>
          {b.vehicle?.title || "Vehicle"}
        </p>
        <p style={{ color: "#64748B", fontSize: "0.82rem" }}>
          {b.vehicle?.brand} · {b.vehicle?.category}
        </p>
      </div>

      {/* Dates */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "160px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#94A3B8", fontSize: "0.82rem" }}>
          <Calendar size={13} />
          {formatDate(b.startDate)} → {formatDate(b.endDate)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748B", fontSize: "0.8rem" }}>
          <Clock size={13} />
          {b.totalDays} {b.totalDays === 1 ? "day" : "days"}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748B", fontSize: "0.8rem" }}>
          <MapPin size={13} />
          {b.vehicle?.locationBranch || "Central Hub"}
        </div>
      </div>

      {/* Cost */}
      <div style={{ textAlign: "right", minWidth: "100px" }}>
        <p style={{ color: "#FF7A00", fontWeight: "800", fontSize: "1.1rem" }}>
          ₹{(b.totalCost || 0).toLocaleString("en-IN")}
        </p>
        <p style={{ color: "#64748B", fontSize: "0.75rem", marginTop: "2px" }}>total cost</p>
      </div>

      {/* Status Badge */}
      <div
        style={{
          background: s.bg,
          color: s.color,
          border: `1px solid ${s.border}`,
          padding: "6px 14px",
          borderRadius: "8px",
          fontSize: "0.75rem",
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          whiteSpace: "nowrap",
        }}
      >
        <StatusIcon status={b.status} />
        {b.status}
      </div>
    </div>
  );
};
