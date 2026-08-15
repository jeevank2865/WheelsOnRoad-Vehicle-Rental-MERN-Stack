import React, { useContext, useState } from "react";
import { ApexContext } from "../Context/ApexContext";
import { ApexNavbar } from "../Components/ApexNavbar";
import { VehicleCard } from "../Components/VehicleCard";

import {
  Gauge,
  Car,
  Filter,
  Check,
  Search,
  Sparkles,
  SlidersHorizontal,
  ArrowDown,
  Bike,
  ShieldCheck,
  Zap,
} from "lucide-react";

const CC_CATEGORIES_BIKES = [
  "150cc - 250cc Sports",
  "300cc - 500cc Supersport",
  "650cc - 900cc Middleweight",
  "1000cc+ Litre Class",
];

const CAR_CATEGORIES = ["Hatchback", "Sedan", "Luxury SUV", "Supercar"];

export const FleetPage = ({ onPageChange, onViewVehicle }) => {
  const { vehicles, loading, fetchVehicles } = useContext(ApexContext);

  const [vehicleType, setVehicleType] = useState("All");

  const [category, setCategory] = useState("All");

  const [search, setSearch] = useState("");

  /* =====================================================
     VEHICLE TYPE FILTER
  ===================================================== */

  const handleTypeFilter = (type) => {
    setVehicleType(type);
    setCategory("All");

    fetchVehicles(type !== "All" ? { vehicleType: type } : {});
  };

  /* =====================================================
     CATEGORY FILTER
  ===================================================== */

  const handleCategoryFilter = (cat) => {
    setCategory(cat);

    const params = {};

    if (vehicleType !== "All") {
      params.vehicleType = vehicleType;
    }

    if (cat !== "All") {
      params.category = cat;
    }

    fetchVehicles(params);
  };

  /* =====================================================
     SEARCH
  ===================================================== */

  const displayedVehicles = search
    ? vehicles.filter(
        (v) =>
          v.title?.toLowerCase().includes(search.toLowerCase()) ||
          v.brand?.toLowerCase().includes(search.toLowerCase()),
      )
    : vehicles;

  /* =====================================================
     CATEGORY LIST
  ===================================================== */

  const currentCategoryList =
    vehicleType === "Superbike"
      ? CC_CATEGORIES_BIKES
      : vehicleType === "Car"
        ? CAR_CATEGORIES
        : [...CC_CATEGORIES_BIKES, ...CAR_CATEGORIES];

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#080B10",
        color: "#FFFFFF",
      }}
    >
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <ApexNavbar onDashboard={onPageChange} activePage="fleet" />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        style={{
          position: "relative",
          minHeight: "510px",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "#080B10",
        }}
      >
        {/* YOUTUBE BACKGROUND VIDEO */}

        <iframe
          src="https://www.youtube.com/embed/PSHTkGHfSVo?autoplay=1&mute=1&loop=1&playlist=PSHTkGHfSVo&controls=0&rel=0&modestbranding=1&playsinline=1"
          title="Hero Background Video"
          allow="autoplay; encrypted-media"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100vw",
            height: "56.25vw",
            minWidth: "177.78vh",
            minHeight: "100vh",
            transform: "translate(-50%, -50%) scale(1.12)",
            border: "none",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* VIDEO OVERLAY */}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(5,8,12,0.62), rgba(5,8,12,0.20), rgba(5,8,12,0.45))",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(5,8,12,0.15), transparent 45%, rgba(5,8,12,0.65))",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* ORANGE GLOW */}

        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-80px",
            width: "520px",
            height: "520px",
            background:
              "radial-gradient(circle, rgba(255,122,0,0.16) 0%, transparent 68%)",
            borderRadius: "50%",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* DECORATIVE CIRCLES */}

        <div
          style={{
            position: "absolute",
            right: "8%",
            top: "18%",
            width: "180px",
            height: "180px",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "50%",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: "11%",
            top: "24%",
            width: "110px",
            height: "110px",
            border: "1px solid rgba(255,122,0,0.10)",
            borderRadius: "50%",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* =====================================================
            HERO CONTENT
        ===================================================== */}

        <div
          className="apex-container"
          style={{
            position: "relative",
            zIndex: 3,
            width: "100%",
            padding: "85px 24px 75px",
          }}
        >
          {/* BADGE */}

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "9px",
              padding: "8px 14px",
              borderRadius: "30px",
              background:
                "linear-gradient(135deg, rgba(255,122,0,0.14), rgba(255,122,0,0.05))",
              border: "1px solid rgba(255,122,0,0.28)",
              color: "#FF9A3D",
              fontSize: "0.72rem",
              fontWeight: "800",
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              marginBottom: "22px",
              backdropFilter: "blur(10px)",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#FF7A00",
                boxShadow: "0 0 12px rgba(255,122,0,0.9)",
              }}
            />
            <Sparkles size={13} />
            Premium Mobility Experience
          </div>

          {/* HEADING */}

          <h1
            style={{
              margin: 0,
              maxWidth: "850px",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              lineHeight: "1.02",
              fontWeight: "900",
              letterSpacing: "-2px",
              fontFamily: "Outfit, sans-serif",
              color: "#FFFFFF",
              textShadow: "0 5px 30px rgba(0,0,0,0.85)",
            }}
          >
            Find Your
            <br />
            <span
              style={{
                background:
                  "linear-gradient(90deg, #FFB15C 0%, #FF7A00 45%, #FF4D00 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Perfect Ride.
            </span>
          </h1>

          {/* DESCRIPTION */}

          <p
            style={{
              maxWidth: "650px",
              margin: "22px 0 30px",
              color: "#D0D7E2",
              fontSize: "1.05rem",
              lineHeight: "1.75",
              fontFamily: "Inter, sans-serif",
              textShadow: "0 2px 12px rgba(0,0,0,0.8)",
            }}
          >
            Explore premium motorcycles and cars available for your next
            journey. Compare categories, discover your favourite model and book
            your ride with confidence.
          </p>

          {/* SEARCH */}

          <div
            style={{
              position: "relative",
              maxWidth: "650px",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "17px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,122,0,0.10)",
                color: "#FF9A3D",
                pointerEvents: "none",
              }}
            >
              <Search size={18} />
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search BMW, Ducati, Porsche, Yamaha..."
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "17px 55px 17px 68px",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(10,13,18,0.78)",
                backdropFilter: "blur(18px)",
                color: "#FFFFFF",
                fontSize: "0.92rem",
                outline: "none",
                boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
              }}
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "rgba(255,255,255,0.08)",
                  color: "#94A3B8",
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            )}
          </div>

          {/* TRUST */}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "22px",
              marginTop: "28px",
              color: "#AAB5C5",
              fontSize: "0.76rem",
              fontWeight: "600",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <ShieldCheck size={15} color="#FF9A3D" />
              Verified Fleet
            </span>

            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <Zap size={15} color="#FF9A3D" />
              Fast Booking
            </span>

            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <Gauge size={15} color="#FF9A3D" />
              Premium Vehicles
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          PREMIUM EXPLORE FLEET FILTER
      ===================================================== */}

      <section
        style={{
          position: "relative",
          padding: "24px 0 20px",
          background:
            "linear-gradient(180deg, rgba(10,14,20,0.98), rgba(8,11,16,0.96))",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          className="apex-container"
          style={{
            padding: "0 24px",
          }}
        >
          {/* TOP ROW */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "20px",
              marginBottom: "18px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg, rgba(255,122,0,0.18), rgba(255,122,0,0.05))",
                  border: "1px solid rgba(255,122,0,0.25)",
                  color: "#FF9A3D",
                  boxShadow: "0 8px 25px rgba(255,122,0,0.08)",
                }}
              >
                <SlidersHorizontal size={19} />
              </div>

              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1rem",
                    fontWeight: "850",
                    color: "#FFFFFF",
                    letterSpacing: "-0.2px",
                  }}
                >
                  Explore Fleet
                </h3>

                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#64748B",
                    fontSize: "0.7rem",
                  }}
                >
                  Filter by vehicle type and category
                </p>
              </div>
            </div>

            {/* VEHICLE COUNT */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                padding: "9px 13px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.035)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#22C55E",
                  boxShadow: "0 0 10px rgba(34,197,94,0.65)",
                }}
              />

              <span
                style={{
                  color: "#FFFFFF",
                  fontWeight: "800",
                  fontSize: "0.78rem",
                }}
              >
                {displayedVehicles.length}
              </span>

              <span
                style={{
                  color: "#64748B",
                  fontSize: "0.72rem",
                }}
              >
                vehicles
              </span>
            </div>
          </div>

          {/* VEHICLE TYPE */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px",
              width: "fit-content",
              maxWidth: "100%",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.07)",
              overflowX: "auto",
            }}
          >
            {["All", "Superbike", "Car"].map((type) => {
              const active = vehicleType === type;

              return (
                <button
                  key={type}
                  onClick={() => handleTypeFilter(type)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    minWidth: type === "All" ? "75px" : "110px",
                    padding: "10px 17px",
                    borderRadius: "10px",
                    border: "none",
                    background: active
                      ? "linear-gradient(135deg, #FF8A1F, #F15A00)"
                      : "transparent",
                    color: active ? "#FFFFFF" : "#7F8B9B",
                    fontSize: "0.76rem",
                    fontWeight: "800",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    boxShadow: active
                      ? "0 6px 22px rgba(255,122,0,0.22)"
                      : "none",
                  }}
                >
                  {type === "All" && <Filter size={14} />}

                  {type === "Superbike" && <Bike size={14} />}

                  {type === "Car" && <Car size={14} />}

                  {type}

                  {active && <Check size={13} />}
                </button>
              );
            })}
          </div>

          {/* CATEGORY HEADER */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "20px",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                color: "#475569",
                fontSize: "0.65rem",
                fontWeight: "800",
                letterSpacing: "1.2px",
                textTransform: "uppercase",
              }}
            >
              Categories
            </span>

            <span
              style={{
                flex: 1,
                height: "1px",
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.08), transparent)",
              }}
            />

            {category !== "All" && (
              <button
                onClick={() => handleCategoryFilter("All")}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#FF9A3D",
                  fontSize: "0.65rem",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* CATEGORY CHIPS */}

          <div
            style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              paddingBottom: "3px",
              scrollbarWidth: "none",
            }}
          >
            {["All", ...currentCategoryList].map((cat) => {
              const active = category === cat;

              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryFilter(cat)}
                  style={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    padding: "9px 14px",
                    borderRadius: "22px",
                    border: active
                      ? "1px solid rgba(255,122,0,0.45)"
                      : "1px solid rgba(255,255,255,0.08)",
                    background: active
                      ? "rgba(255,122,0,0.11)"
                      : "rgba(255,255,255,0.025)",
                    color: active ? "#FF9A3D" : "#8B97A8",
                    fontSize: "0.7rem",
                    fontWeight: active ? "800" : "650",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s ease",
                  }}
                >
                  {active && <Check size={11} />}

                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          VEHICLE CONTENT
      ===================================================== */}

      <main
        className="apex-container"
        style={{
          padding: "42px 24px 90px",
          position: "relative",
        }}
      >
        {/* SECTION HEADING */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "20px",
            marginBottom: "28px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#FF9A3D",
                fontSize: "0.68rem",
                fontWeight: "800",
                letterSpacing: "1.4px",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  width: "24px",
                  height: "1px",
                  background: "#FF7A00",
                }}
              />
              Available Now
            </div>

            <h2
              style={{
                margin: 0,
                color: "#FFFFFF",
                fontSize: "1.75rem",
                fontWeight: "850",
                letterSpacing: "-0.5px",
                fontFamily: "Outfit, sans-serif",
              }}
            >
              Choose Your Ride
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 13px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.025)",
              color: "#7F8B9B",
              fontSize: "0.7rem",
            }}
          >
            <ArrowDown size={13} />
            Weekend surge pricing applies
          </div>
        </div>

        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "360px",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(12,16,22,0.72)",
            }}
          >
            <Gauge size={28} color="#FF9A3D" />

            <div
              style={{
                marginTop: "16px",
                color: "#FFFFFF",
                fontWeight: "750",
              }}
            >
              Finding your next ride
            </div>

            <div
              style={{
                marginTop: "6px",
                color: "#64748B",
                fontSize: "0.75rem",
              }}
            >
              Fetching live fleet data...
            </div>
          </div>
        ) : displayedVehicles.length === 0 ? (
          /* =====================================================
              EMPTY STATE
          ===================================================== */

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "350px",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(12,16,22,0.72)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "2rem",
                marginBottom: "15px",
              }}
            >
              🔎
            </div>

            <h3
              style={{
                margin: "0 0 8px",
                color: "#FFFFFF",
              }}
            >
              No vehicles found
            </h3>

            <p
              style={{
                margin: 0,
                color: "#64748B",
                fontSize: "0.78rem",
              }}
            >
              Try changing your filters or search.
            </p>
          </div>
        ) : (
          /* =====================================================
              IMPROVED VEHICLE GRID
          ===================================================== */

          <div className="vehicle-grid">
            {displayedVehicles.map((v) => (
              <div key={v._id} className="vehicle-grid-item">
                <VehicleCard vehicle={v} onViewDetails={onViewVehicle} />
              </div>
            ))}
          </div>
        )}

        {/* =====================================================
            TRUST STRIP
        ===================================================== */}

        {!loading && displayedVehicles.length > 0 && (
          <div
            style={{
              marginTop: "55px",
              padding: "18px 20px",
              borderRadius: "15px",
              border: "1px solid rgba(255,255,255,0.06)",
              background:
                "linear-gradient(90deg, rgba(255,122,0,0.05), rgba(255,255,255,0.025), rgba(0,160,255,0.04))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "28px",
              color: "#687587",
              fontSize: "0.7rem",
              fontWeight: "600",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <ShieldCheck size={14} color="#FF9A3D" />
              Verified vehicles
            </span>

            <span
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "#334155",
              }}
            />

            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <Zap size={14} color="#FF9A3D" />
              Fast booking
            </span>

            <span
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "#334155",
              }}
            />

            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
              }}
            >
              <Gauge size={14} color="#FF9A3D" />
              Premium fleet
            </span>
          </div>
        )}
      </main>

      {/* =====================================================
          RESPONSIVE + VEHICLE GRID CSS
      ===================================================== */}

      <style>
        {`
          input::placeholder {
            color: #64748B;
          }

          button {
            -webkit-tap-highlight-color: transparent;
          }

          /* ================================================
             VEHICLE GRID
          ================================================ */

          .vehicle-grid {
            display: grid;
            grid-template-columns:
              repeat(4, minmax(0, 1fr));

            gap: 24px;

            width: 100%;
            max-width: 1500px;

            margin: 0 auto;

            align-items: stretch;
          }

          /* ================================================
             EACH VEHICLE ITEM
          ================================================ */

          .vehicle-grid-item {
            min-width: 0;
            width: 100%;

            display: flex;
            flex-direction: column;

            height: 100%;
          }

          /* ================================================
             MAKE CARD FULL WIDTH / HEIGHT
          ================================================ */

          .vehicle-grid-item > * {
            width: 100%;
            height: 100%;
          }

          /* ================================================
             LARGE LAPTOP
          ================================================ */

          @media (max-width: 1250px) {
            .vehicle-grid {
              grid-template-columns:
                repeat(3, minmax(0, 1fr));

              gap: 22px;
            }
          }

          /* ================================================
             TABLET
          ================================================ */

          @media (max-width: 850px) {
            .vehicle-grid {
              grid-template-columns:
                repeat(2, minmax(0, 1fr));

              gap: 18px;
            }
          }

          /* ================================================
             MOBILE
          ================================================ */

          @media (max-width: 550px) {
            .vehicle-grid {
              grid-template-columns: 1fr;

              gap: 18px;
            }

            .vehicle-grid-item {
              width: 100%;
            }
          }

          /* ================================================
             MAIN CONTAINER
          ================================================ */

          @media (max-width: 768px) {
            .apex-container {
              padding-left: 18px !important;
              padding-right: 18px !important;
            }
          }

          @media (max-width: 520px) {
            .apex-container {
              padding-left: 14px !important;
              padding-right: 14px !important;
            }
          }

          /* ================================================
             HORIZONTAL SCROLLBAR
          ================================================ */

          * {
            scrollbar-width: thin;
            scrollbar-color:
              #303844 transparent;
          }
        `}
      </style>
    </div>
  );
};

export default FleetPage;
