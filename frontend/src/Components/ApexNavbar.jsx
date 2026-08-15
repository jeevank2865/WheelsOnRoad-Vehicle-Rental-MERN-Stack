import React, { useContext, useState } from "react";
import { ApexContext } from "../Context/ApexContext";
import { Gauge, User, LogOut } from "lucide-react";
import { AuthModal } from "./ApexAuthModal";

export const ApexNavbar = ({ onDashboard, activePage }) => {
  const { user, logout } = useContext(ApexContext);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <>
      <header
        style={{
          background:
            "linear-gradient(180deg, rgba(13, 18, 25, 0.95) 0%, rgba(10,14,20,0.98) 100%)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255, 122, 0, 0.12)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          className="apex-container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "72px",
          }}
        >
          {/* Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
            }}
            onClick={() => onDashboard && onDashboard("fleet")}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "linear-gradient(135deg, #FF7A00, #FF5722)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  "0 4px 14px rgba(255, 122, 0, 0.35), inset 0 1px 0 rgba(255,255,255,0.25)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <Gauge size={22} color="#0F1115" strokeWidth={2.5} />
            </div>
            <div>
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "800",
                  color: "#FFFFFF",
                  fontFamily: "Outfit, sans-serif",
                  letterSpacing: "-0.5px",
                }}
              >
                Wheels<span style={{ color: "#FF7A00" }}>OnRoad</span>
              </span>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "#94A3B8",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  fontWeight: "600",
                }}
              >
                Premium Fleet Rental
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav
            style={{
              display: "flex",
              gap: "28px",
              fontSize: "0.88rem",
              fontWeight: "600",
            }}
          >
            <button
              onClick={() => onDashboard("fleet")}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background:
                  activePage === "fleet"
                    ? "linear-gradient(135deg, rgba(255,122,0,0.15), rgba(255,87,34,0.08))"
                    : "transparent",
                border:
                  activePage === "fleet"
                    ? "1px solid rgba(255,122,0,0.3)"
                    : "1px solid transparent",
                color: activePage === "fleet" ? "#FF7A00" : "#94A3B8",
                cursor: "pointer",
                fontSize: "0.88rem",
                fontWeight: "600",
                fontFamily: "Plus Jakarta Sans, sans-serif",
                padding: "9px 18px",
                borderRadius: "10px",
                letterSpacing: "0.02em",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow:
                  activePage === "fleet"
                    ? "0 0 20px rgba(255,122,0,0.15), inset 0 1px 0 rgba(255,255,255,0.05)"
                    : "none",
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="18.5" cy="17.5" r="3.5" />
                <circle cx="5.5" cy="17.5" r="3.5" />
                <path d="M15 6a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v9M2 17.5h3.5M12 17.5h4.5M9 6l4 4-4.5 5.5" />
              </svg>
              Fleet Hub
              {activePage === "fleet" && (
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "#FF7A00",
                    boxShadow: "0 0 6px rgba(255, 122, 0, 0.8)",
                    marginLeft: "2px",
                  }}
                />
              )}
            </button>
            {user && user.role !== "admin" && (
              <button
                onClick={() => onDashboard("dashboard")}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background:
                    activePage === "dashboard"
                      ? "linear-gradient(135deg, rgba(255, 122, 0, 0.15), rgba(255, 87, 34, 0.08))"
                      : "transparent",
                  border:
                    activePage === "dashboard"
                      ? "1px solid rgba(255, 122, 0, 0.3)"
                      : "1px solid transparent",
                  color: activePage === "dashboard" ? "#FF7A00" : "#94A3B8",
                  cursor: "pointer",
                  fontSize: "0.88rem",
                  fontWeight: "600",
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  padding: "9px 18px",
                  borderRadius: "10px",
                  letterSpacing: "0.02em",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow:
                    activePage === "dashboard"
                      ? "0 0 20px rgba(255, 122, 0, 0.15), inset 0 1px 0 rgba(255,255,255,0.05)"
                      : "none",
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                  <path d="M8 14l2 2 4-4" />
                </svg>
                My Bookings
                {activePage === "dashboard" && (
                  <span
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      background: "#FF7A00",
                      boxShadow: "0 0 6px rgba(255, 122, 0, 0.8)",
                      marginLeft: "2px",
                    }}
                  />
                )}
              </button>
            )}
            {user?.role === "admin" && (
              <button
                onClick={() => onDashboard("admin")}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background:
                    activePage === "admin"
                      ? "linear-gradient(135deg, rgba(255, 122, 0, 0.15), rgba(255, 87, 34, 0.08))"
                      : "transparent",
                  border:
                    activePage === "admin"
                      ? "1px solid rgba(255, 122, 0, 0.3)"
                      : "1px solid transparent",
                  color: activePage === "admin" ? "#FF7A00" : "#94A3B8",
                  cursor: "pointer",
                  fontSize: "0.88rem",
                  fontWeight: "600",
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  padding: "9px 18px",
                  borderRadius: "10px",
                  letterSpacing: "0.02em",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow:
                    activePage === "admin"
                      ? "0 0 20px rgba(255, 122, 0, 0.15), inset 0 1px 0 rgba(255,255,255,0.05)"
                      : "none",
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                Fleet Admin
                {activePage === "admin" && (
                  <span
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      background: "#FF7A00",
                      boxShadow: "0 0 6px rgba(255, 122, 0, 0.8)",
                      marginLeft: "2px",
                    }}
                  />
                )}
              </button>
            )}
          </nav>

          {/* Auth Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #FF7A0022, #FF572233)",
                      border: "1px solid rgba(255, 122, 0, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <User size={16} color="#FF7A00" />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#FFFFFF" }}>
                      {user.name}
                    </div>
                    <span className="badge-cc" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
                      {user.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  style={{
                    background: "rgba(148,163,184,0.05)",
                    border: "1px solid rgba(148,163,184,0.2)",
                    color: "#94A3B8",
                    cursor: "pointer",
                    padding: "8px 16px",
                    borderRadius: "10px",
                    fontSize: "0.82rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontWeight: "600",
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                  }}
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                style={{
                  background: "linear-gradient(135deg, #FF9800, #FF5722)",
                  color: "#07090e",
                  border: "none",
                  padding: "10px 24px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "0.88rem",
                  fontFamily: "Outfit, sans-serif",
                  letterSpacing: "0.3px",
                  boxShadow: "0 4px 16px rgba(255, 122, 0, 0.3)",
                }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};
