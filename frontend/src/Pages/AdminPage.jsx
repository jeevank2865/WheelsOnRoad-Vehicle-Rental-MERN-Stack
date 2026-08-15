import React, { useEffect, useState, useContext } from "react";
import { ApexContext } from "../Context/ApexContext";
import { ApexNavbar } from "../Components/ApexNavbar";
import axios from "axios";
import {
  PlusCircle,
  Trash2,
  Edit,
  Gauge,
  Car,
  Shield,
  Image,
  FileText,
  CheckCircle,
  RefreshCw,
  Filter,
  X,
  Download,
} from "lucide-react";

const STATUS_OPTIONS = [
  "Pending Approval",
  "Confirmed",
  "Active (Rented)",
  "Completed",
  "Cancelled",
];
const STATUS_COLOR = {
  Confirmed: "#E08E45",
  "Active (Rented)": "#00FF88",
  Completed: "#94A3B8",
  Cancelled: "#FF2E54",
  "Pending Approval": "#F59E0B",
};

const BIKE_CATEGORIES = ["650cc - 900cc Middleweight", "1000cc+ Litre Class"];
const CAR_CATEGORIES = [
  "Mid-Engine Supercars",
  "V12 Supercars",
  "Electric & Hybrid Supercars",
];

export const AdminPage = ({ onPageChange }) => {
  const { vehicles, fetchVehicles, addVehicle, updateVehicle, deleteVehicle } =
    useContext(ApexContext);
  const [activeTab, setActiveTab] = useState("bookings"); // 'bookings' | 'add-vehicle' | 'inventory' | 'payment-settings'
  const [inventoryFilter, setInventoryFilter] = useState("all"); // 'all' | 'bikes' | 'cars'
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // UPI / Payment Settings Form State
  const [paymentSettings, setPaymentSettings] = useState({
    upiId: "",
    upiName: "",
    upiDescription: "ApexLease Vehicle Rental",
    qrCodeImageUrl: "",
    paymentInstructions:
      "Scan the QR code or use the UPI ID to pay. Send a screenshot of the payment confirmation to complete your booking.",
    upiEnabled: true,
  });
  const [paymentSettingsLoading, setPaymentSettingsLoading] = useState(false);
  const [paymentSettingsSuccess, setPaymentSettingsSuccess] = useState("");
  const [paymentSettingsError, setPaymentSettingsError] = useState("");
  const [paymentQrPreview, setPaymentQrPreview] = useState("");

  // Form State for Adding New Vehicle
  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    vehicleType: "Superbike",
    category: BIKE_CATEGORIES[0],
    description: "",
    engineCC: 350,
    powerHP: 35,
    dailyRate: 2500,
    weekendSurgeRate: 3000,
    securityDeposit: 5000,
    transmission: "Manual",
    locationBranch: "Central Hub",
    imageUrl: "",
  });

  const [previewImage, setPreviewImage] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");
  const [searchInventory, setSearchInventory] = useState("");

  // EDIT MODAL STATE
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editPreviewImage, setEditPreviewImage] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editSuccess, setEditSuccess] = useState("");
  const [editError, setEditError] = useState("");

  useEffect(() => {
    fetchAllBookings();
    fetchVehicles();
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/payment-settings");
      if (res.data) {
        setPaymentSettings({
          upiId: res.data.upiId || "",
          upiName: res.data.upiName || "",
          upiDescription: res.data.upiDescription || "ApexLease Vehicle Rental",
          qrCodeImageUrl: res.data.qrCodeImageUrl || "",
          paymentInstructions: res.data.paymentInstructions || "",
          upiEnabled: res.data.upiEnabled !== false,
        });
        setPaymentQrPreview(res.data.qrCodeImageUrl || "");
      }
    } catch (err) {
      console.error("Failed to fetch payment settings:", err);
    }
  };

  const handlePaymentSettingsSubmit = async (e) => {
    e.preventDefault();
    setPaymentSettingsLoading(true);
    setPaymentSettingsSuccess("");
    setPaymentSettingsError("");
    try {
      const token = localStorage.getItem("apexlease_token");
      const res = await axios.put(
        "http://localhost:5000/api/payment-settings",
        paymentSettings,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.data.success) {
        setPaymentSettingsSuccess("Payment settings updated successfully!");
      }
    } catch (err) {
      setPaymentSettingsError(
        err.response?.data?.message || "Failed to update payment settings",
      );
    } finally {
      setPaymentSettingsLoading(false);
    }
  };

  const handleQrUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const localPreviewUrl = URL.createObjectURL(file);
    setPaymentQrPreview(localPreviewUrl);

    const body = new FormData();
    body.append("vehicleImage", file); // Use same backend /upload single handler
    try {
      const res = await axios.post("http://localhost:5000/upload", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data && res.data.image_url) {
        setPaymentSettings((prev) => ({
          ...prev,
          qrCodeImageUrl: res.data.image_url,
        }));
      }
    } catch (err) {
      console.error("File upload server error:", err);
      setPaymentSettings((prev) => ({
        ...prev,
        qrCodeImageUrl: localPreviewUrl,
      }));
    }
  };

  const fetchAllBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("apexlease_token");
      const res = await axios.get("http://localhost:5000/api/bookings/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (e) {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, status) => {
    try {
      const token = localStorage.getItem("apexlease_token");
      await axios.put(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status } : b)),
      );
    } catch (e) {
      alert("Status update failed");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "vehicleType") {
        updated.category =
          value === "Superbike" ? BIKE_CATEGORIES[0] : CAR_CATEGORIES[0];
      }
      return updated;
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const localPreviewUrl = URL.createObjectURL(file);
    setPreviewImage(localPreviewUrl);

    const body = new FormData();
    body.append("vehicleImage", file);
    try {
      const res = await axios.post("http://localhost:5000/upload", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data && res.data.image_url) {
        setFormData((prev) => ({ ...prev, imageUrl: res.data.image_url }));
      }
    } catch (err) {
      console.error("File upload server error:", err);
      setFormData((prev) => ({ ...prev, imageUrl: localPreviewUrl }));
    }
  };

  const handleAddVehicleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormSuccess("");
    setFormError("");

    if (!formData.title || !formData.brand || !formData.dailyRate) {
      setFormError("Please fill in Title, Brand, and Daily Rate.");
      setFormSubmitting(false);
      return;
    }

    const defaultImage =
      formData.vehicleType === "Superbike"
        ? "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800&auto=format&fit=crop"
        : "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=800&auto=format&fit=crop";

    const payload = {
      title: formData.title,
      brand: formData.brand,
      model: formData.model || formData.title,
      year: Number(formData.year),
      vehicleType: formData.vehicleType,
      category: formData.category,
      description: formData.description,
      engineCC: Number(formData.engineCC),
      powerHP: Number(formData.powerHP),
      dailyRate: Number(formData.dailyRate),
      weekendSurgeRate: Number(formData.weekendSurgeRate),
      securityDeposit: Number(formData.securityDeposit),
      transmission: formData.transmission,
      locationBranch: formData.locationBranch,
      images: [formData.imageUrl ? formData.imageUrl.trim() : defaultImage],
    };

    try {
      await addVehicle(payload);
      setFormSuccess(`Successfully added "${formData.title}" to the fleet!`);
      setPreviewImage("");
      setFormData({
        title: "",
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        vehicleType: "Superbike",
        category: BIKE_CATEGORIES[0],
        description: "",
        engineCC: 350,
        powerHP: 35,
        dailyRate: 2500,
        weekendSurgeRate: 3000,
        securityDeposit: 5000,
        transmission: "Manual",
        locationBranch: "Central Hub",
        imageUrl: "",
      });
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Failed to add vehicle to fleet.",
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  // EDIT VEHICLE HANDLERS
  const handleStartEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setEditFormData({
      title: vehicle.title || "",
      brand: vehicle.brand || "",
      model: vehicle.model || "",
      year: vehicle.year || new Date().getFullYear(),
      vehicleType: vehicle.vehicleType || "Superbike",
      category: vehicle.category || BIKE_CATEGORIES[0],
      description: vehicle.description || "",
      engineCC: vehicle.engineCC || 350,
      powerHP: vehicle.powerHP || 35,
      dailyRate: vehicle.dailyRate || 2500,
      weekendSurgeRate: vehicle.weekendSurgeRate || 3000,
      securityDeposit: vehicle.securityDeposit || 5000,
      transmission: vehicle.transmission || "Manual",
      locationBranch: vehicle.locationBranch || "Central Hub",
      imageUrl: vehicle.images?.[0] || "",
    });
    setEditPreviewImage(vehicle.images?.[0] || "");
    setEditSuccess("");
    setEditError("");
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setEditPreviewImage(localUrl);

    const body = new FormData();
    body.append("vehicleImage", file);
    try {
      const res = await axios.post("http://localhost:5000/upload", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data && res.data.image_url) {
        setEditFormData((prev) => ({ ...prev, imageUrl: res.data.image_url }));
      }
    } catch (err) {
      setEditFormData((prev) => ({ ...prev, imageUrl: localUrl }));
    }
  };

  const handleUpdateVehicleSubmit = async (e) => {
    e.preventDefault();
    if (!editingVehicle) return;
    setEditSubmitting(true);
    setEditSuccess("");
    setEditError("");

    const payload = {
      title: editFormData.title,
      brand: editFormData.brand,
      model: editFormData.model,
      year: Number(editFormData.year),
      vehicleType: editFormData.vehicleType,
      category: editFormData.category,
      description: editFormData.description,
      engineCC: Number(editFormData.engineCC),
      powerHP: Number(editFormData.powerHP),
      dailyRate: Number(editFormData.dailyRate),
      weekendSurgeRate: Number(editFormData.weekendSurgeRate),
      securityDeposit: Number(editFormData.securityDeposit),
      transmission: editFormData.transmission,
      locationBranch: editFormData.locationBranch,
      images: [
        editFormData.imageUrl
          ? editFormData.imageUrl.trim()
          : editingVehicle.images[0],
      ],
    };

    try {
      await updateVehicle(editingVehicle._id, payload);
      setEditSuccess("Vehicle updated successfully!");
      setTimeout(() => {
        setEditingVehicle(null);
      }, 1000);
    } catch (err) {
      setEditError(
        err.response?.data?.message || "Failed to update vehicle details",
      );
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteVehicle = async (id, title) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${title}" from the fleet?`,
      )
    ) {
      try {
        await deleteVehicle(id);
      } catch (err) {
        alert("Failed to delete vehicle");
      }
    }
  };

  const totalRevenue = bookings
    .filter((b) =>
      ["Confirmed", "Active (Rented)", "Completed"].includes(b.status),
    )
    .reduce((s, b) => s + b.totalCost, 0);
  const activeCount = bookings.filter(
    (b) => b.status === "Active (Rented)",
  ).length;
  const pendingCount = bookings.filter(
    (b) => b.status === "Pending Approval",
  ).length;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  const filteredInventory = searchInventory
    ? vehicles.filter(
        (v) =>
          v.title.toLowerCase().includes(searchInventory.toLowerCase()) ||
          v.brand.toLowerCase().includes(searchInventory.toLowerCase()),
      )
    : vehicles;

  const filteredBikes = filteredInventory.filter(
    (v) => v.vehicleType === "Superbike",
  );
  const filteredCars = filteredInventory.filter((v) => v.vehicleType === "Car");

  return (
    <div style={{ backgroundColor: "#0F1115", minHeight: "100vh" }}>
      <ApexNavbar onDashboard={onPageChange} activePage="admin" />

      <div className="apex-container" style={{ padding: "40px 24px 80px" }}>
        <div
          style={{
            marginBottom: "28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "800",
                color: "#FFFFFF",
                fontFamily: "Outfit, sans-serif",
                marginBottom: "6px",
              }}
            >
              ⚙️ Fleet Management Console
            </h1>
            <p style={{ color: "#ae3c1a" }}>
              Manage your fleet, pricing, availability, images, and reservations
              — all in one place.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              backgroundColor: "#181B20",
              border: "1px solid #2D333F",
              padding: "6px",
              borderRadius: "12px",
            }}
          >
            <button
              onClick={() => setActiveTab("bookings")}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                backgroundColor:
                  activeTab === "bookings" ? "#E08E45" : "transparent",
                color: activeTab === "bookings" ? "#0F1115" : "#94A3B8",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontFamily: "Outfit, sans-serif",
              }}
            >
              📋 Reservations ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab("add-vehicle")}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                backgroundColor:
                  activeTab === "add-vehicle" ? "#E08E45" : "transparent",
                color: activeTab === "add-vehicle" ? "#0F1115" : "#94A3B8",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontFamily: "Outfit, sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <PlusCircle size={14} /> Add Bike / Car
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                backgroundColor:
                  activeTab === "inventory" ? "#E08E45" : "transparent",
                color: activeTab === "inventory" ? "#0F1115" : "#94A3B8",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontFamily: "Outfit, sans-serif",
              }}
            >
              🏁 Manage Listings ({vehicles.length})
            </button>
            <button
              onClick={() => setActiveTab("payment-settings")}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                backgroundColor:
                  activeTab === "payment-settings" ? "#E08E45" : "transparent",
                color: activeTab === "payment-settings" ? "#0F1115" : "#94A3B8",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontFamily: "Outfit, sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              🪙 UPI & QR Settings
            </button>
          </div>
        </div>

        {/* TAB 1: RESERVATIONS OVERVIEW */}
        {activeTab === "bookings" && (
          <>
            {/* KPI Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "16px",
                marginBottom: "32px",
              }}
            >
              {[
                {
                  label: "Total Bookings",
                  value: bookings.length,
                  color: "#E08E45",
                },
                {
                  label: "Active Rentals",
                  value: activeCount,
                  color: "#00FF88",
                },
                {
                  label: "Pending Approval",
                  value: pendingCount,
                  color: "#F59E0B",
                },
                {
                  label: "Revenue (Est.)",
                  value: `₹${totalRevenue.toFixed(0)}`,
                  color: "#E08E45",
                },
              ].map((k) => (
                <div
                  key={k.label}
                  style={{
                    backgroundColor: "#181B20",
                    border: "1px solid #2D333F",
                    borderRadius: "12px",
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "#94A3B8",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: "10px",
                    }}
                  >
                    {k.label}
                  </div>
                  <div
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: "800",
                      color: k.color,
                      fontFamily: "Outfit, sans-serif",
                    }}
                  >
                    {k.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Bookings Table */}
            <div
              style={{
                backgroundColor: "#181B20",
                border: "1px solid #2D333F",
                borderRadius: "14px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "18px 22px",
                  borderBottom: "1px solid #2D333F",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3
                  style={{
                    color: "#FFFFFF",
                    fontWeight: "700",
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  All Reservations
                </h3>
                <button
                  onClick={fetchAllBookings}
                  style={{
                    background: "none",
                    border: "1px solid #2D333F",
                    color: "#94A3B8",
                    padding: "7px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <RefreshCw size={12} /> Refresh
                </button>
                <button
                  onClick={() => {
                    const csvHeaders = [
                      "Vehicle",
                      "Dates",
                      "Days",
                      "Cost (₹)",
                      "Status",
                      "Customer",
                    ];
                    const rows = bookings.map((b) =>
                      [
                        b.vehicle?.title || "",
                        `${formatDate(b.startDate)} → ${formatDate(b.endDate)}`,
                        b.totalDays,
                        b.totalCost,
                        b.status,
                        b.user?.name || b.user?.email || "",
                      ].join(","),
                    );
                    const csvContent = [csvHeaders.join(","), ...rows].join(
                      "\n",
                    );
                    const blob = new Blob([csvContent], {
                      type: "text/csv;charset=utf-8;",
                    });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "all_reservations.csv");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  style={{
                    background: "none",
                    border: "1px solid #2D333F",
                    color: "#94A3B8",
                    padding: "7px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Download size={12} /> CSV
                </button>
              </div>

              {loading ? (
                <div
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#94A3B8",
                  }}
                >
                  Loading fleet bookings...
                </div>
              ) : bookings.length === 0 ? (
                <div
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#94A3B8",
                  }}
                >
                  No bookings in system yet.
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "0.88rem",
                    }}
                  >
                    <thead>
                      <tr style={{ borderBottom: "1px solid #2D333F" }}>
                        {[
                          "Person Name",
                          "Vehicle",
                          "Dates",
                          "Days",
                          "Cost (₹)",
                          "Status",
                          "Update Status",
                        ].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: "12px 18px",
                              textAlign: "left",
                              color: "#94A3B8",
                              fontWeight: "600",
                              fontSize: "0.78rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr
                          key={b._id}
                          style={{ borderBottom: "1px solid #2D333F" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#20242B")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "transparent")
                          }
                        >
                          <td
                            style={{
                              padding: "14px 18px",
                              color: "#E08E45",
                              fontWeight: "600",
                            }}
                          >
                            {b.user?.name || b.user?.email || "Unknown"}
                          </td>
                          <td
                            style={{
                              padding: "14px 18px",
                              color: "#FFFFFF",
                              fontWeight: "600",
                            }}
                          >
                            {b.vehicle?.title || "—"}
                          </td>
                          <td
                            style={{ padding: "14px 18px", color: "#94A3B8" }}
                          >
                            {formatDate(b.startDate)} → {formatDate(b.endDate)}
                          </td>
                          <td
                            style={{ padding: "14px 18px", color: "#FFFFFF" }}
                          >
                            {b.totalDays}
                          </td>
                          <td
                            style={{
                              padding: "14px 18px",
                              color: "#E08E45",
                              fontWeight: "700",
                            }}
                          >
                            ₹{b.totalCost}
                          </td>
                          <td style={{ padding: "14px 18px" }}>
                            <span
                              style={{
                                backgroundColor: `${STATUS_COLOR[b.status]}15`,
                                color: STATUS_COLOR[b.status],
                                border: `1px solid ${STATUS_COLOR[b.status]}40`,
                                padding: "4px 10px",
                                borderRadius: "6px",
                                fontSize: "0.75rem",
                                fontWeight: "700",
                              }}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td style={{ padding: "14px 18px" }}>
                            <select
                              value={b.status}
                              onChange={(e) =>
                                updateStatus(b._id, e.target.value)
                              }
                              style={{
                                padding: "7px 12px",
                                borderRadius: "8px",
                                border: "1px solid #2D333F",
                                backgroundColor: "#20242B",
                                color: "#FFF",
                                fontSize: "0.82rem",
                                cursor: "pointer",
                              }}
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* TAB 2: ADD NEW VEHICLE FORM */}
        {activeTab === "add-vehicle" && (
          <div
            style={{
              backgroundColor: "#181B20",
              border: "1px solid #2D333F",
              borderRadius: "16px",
              padding: "32px",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <h2
              style={{
                color: "#FFFFFF",
                fontSize: "1.4rem",
                fontWeight: "700",
                fontFamily: "Outfit, sans-serif",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <PlusCircle color="#E08E45" /> Add New Bike or Car to Listings
            </h2>
            <p
              style={{
                color: "#94A3B8",
                fontSize: "0.9rem",
                marginBottom: "24px",
              }}
            >
              Manually add new motorcycles or cars with custom image,
              description, rates (₹), and tags.
            </p>

            {formSuccess && (
              <div
                style={{
                  backgroundColor: "rgba(224,142,69,0.1)",
                  border: "1px solid rgba(224,142,69,0.3)",
                  color: "#E08E45",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <CheckCircle size={18} /> {formSuccess}
              </div>
            )}

            {formError && (
              <div
                style={{
                  backgroundColor: "rgba(255,46,84,0.1)",
                  border: "1px solid rgba(255,46,84,0.3)",
                  color: "#FF2E54",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                  fontSize: "0.9rem",
                }}
              >
                ⚠️ {formError}
              </div>
            )}

            <form onSubmit={handleAddVehicleSubmit}>
              {/* Type and Brand Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      color: "#94A3B8",
                      fontSize: "0.78rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Item Type *
                  </label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "11px",
                      borderRadius: "8px",
                      backgroundColor: "#20242B",
                      border: "1px solid #2D333F",
                      color: "#FFF",
                      fontSize: "0.9rem",
                    }}
                  >
                    <option value="Superbike">🏍 Bike (Motorcycle)</option>
                    <option value="Car">🏎 Car</option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      color: "#94A3B8",
                      fontSize: "0.78rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Brand / Manufacturer *
                  </label>
                  <input
                    type="text"
                    name="brand"
                    placeholder="e.g. Royal Enfield, BMW, Mahindra"
                    value={formData.brand}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "11px",
                      borderRadius: "8px",
                      backgroundColor: "#20242B",
                      border: "1px solid #2D333F",
                      color: "#FFF",
                      fontSize: "0.9rem",
                    }}
                    required
                  />
                </div>

                <div>
                  <label
                    style={{
                      color: "#94A3B8",
                      fontSize: "0.78rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Category / Tag *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "11px",
                      borderRadius: "8px",
                      backgroundColor: "#20242B",
                      border: "1px solid #2D333F",
                      color: "#FFF",
                      fontSize: "0.9rem",
                    }}
                  >
                    {(formData.vehicleType === "Superbike"
                      ? BIKE_CATEGORIES
                      : CAR_CATEGORIES
                    ).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title, Model, Year Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      color: "#94A3B8",
                      fontSize: "0.78rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Title / Display Name *
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Royal Enfield Himalayan 450 Touring"
                    value={formData.title}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "11px",
                      borderRadius: "8px",
                      backgroundColor: "#20242B",
                      border: "1px solid #2D333F",
                      color: "#FFF",
                      fontSize: "0.9rem",
                    }}
                    required
                  />
                </div>

                <div>
                  <label
                    style={{
                      color: "#94A3B8",
                      fontSize: "0.78rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Model
                  </label>
                  <input
                    type="text"
                    name="model"
                    placeholder="e.g. Himalayan 450"
                    value={formData.model}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "11px",
                      borderRadius: "8px",
                      backgroundColor: "#20242B",
                      border: "1px solid #2D333F",
                      color: "#FFF",
                      fontSize: "0.9rem",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      color: "#94A3B8",
                      fontSize: "0.78rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "11px",
                      borderRadius: "8px",
                      backgroundColor: "#20242B",
                      border: "1px solid #2D333F",
                      color: "#FFF",
                      fontSize: "0.9rem",
                    }}
                  />
                </div>
              </div>

              {/* DESCRIPTION PART */}
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    color: "#94A3B8",
                    fontSize: "0.78rem",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  <FileText size={12} style={{ marginRight: "4px" }} />{" "}
                  Description (Full Details Visible to All Users)
                </label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Enter full description, touring features, highway range, specs, and inclusions..."
                  value={formData.description}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "11px",
                    borderRadius: "8px",
                    backgroundColor: "#20242B",
                    border: "1px solid #2D333F",
                    color: "#FFF",
                    fontSize: "0.9rem",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* IMAGE SELECTION */}
              <div
                style={{
                  backgroundColor: "#20242B",
                  border: "1px dashed #2D333F",
                  borderRadius: "12px",
                  padding: "18px",
                  marginBottom: "20px",
                }}
              >
                <label
                  style={{
                    color: "#E08E45",
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "10px",
                  }}
                >
                  <Image size={16} /> Vehicle Image (Upload File or Paste URL)
                </label>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "14px",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <label
                      style={{
                        color: "#94A3B8",
                        fontSize: "0.75rem",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Upload Image File from Device
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ color: "#94A3B8", fontSize: "0.82rem" }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        color: "#94A3B8",
                        fontSize: "0.75rem",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Or Paste Image Web URL
                    </label>
                    <input
                      type="url"
                      name="imageUrl"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        backgroundColor: "#181B20",
                        border: "1px solid #2D333F",
                        color: "#FFF",
                        fontSize: "0.85rem",
                      }}
                    />
                  </div>
                </div>

                {(formData.imageUrl || previewImage) && (
                  <div
                    style={{
                      marginTop: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <img
                      src={previewImage || formData.imageUrl}
                      alt="Preview"
                      style={{
                        width: "90px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        border: "1px solid #E08E45",
                      }}
                    />
                    <div>
                      <span
                        style={{
                          color: "#00FF88",
                          fontSize: "0.82rem",
                          fontWeight: "700",
                          display: "block",
                        }}
                      >
                        ✓ Live Image Preview
                      </span>
                      <span style={{ color: "#94A3B8", fontSize: "0.74rem" }}>
                        {formData.imageUrl.includes("/uploads/")
                          ? "Stored in local server uploads folder"
                          : "Web URL linked"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Rates Row in INR */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      color: "#94A3B8",
                      fontSize: "0.78rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Daily Rate (₹/day) *
                  </label>
                  <input
                    type="number"
                    name="dailyRate"
                    placeholder="e.g. 2500"
                    value={formData.dailyRate}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "11px",
                      borderRadius: "8px",
                      backgroundColor: "#20242B",
                      border: "1px solid #2D333F",
                      color: "#FFF",
                      fontSize: "0.9rem",
                    }}
                    required
                  />
                </div>

                <div>
                  <label
                    style={{
                      color: "#94A3B8",
                      fontSize: "0.78rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Weekend Surge Rate (₹/day)
                  </label>
                  <input
                    type="number"
                    name="weekendSurgeRate"
                    placeholder="e.g. 3000"
                    value={formData.weekendSurgeRate}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "11px",
                      borderRadius: "8px",
                      backgroundColor: "#20242B",
                      border: "1px solid #2D333F",
                      color: "#FFF",
                      fontSize: "0.9rem",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      color: "#94A3B8",
                      fontSize: "0.78rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Security Deposit (₹)
                  </label>
                  <input
                    type="number"
                    name="securityDeposit"
                    placeholder="e.g. 5000"
                    value={formData.securityDeposit}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "11px",
                      borderRadius: "8px",
                      backgroundColor: "#20242B",
                      border: "1px solid #2D333F",
                      color: "#FFF",
                      fontSize: "0.9rem",
                    }}
                  />
                </div>
              </div>

              {/* Specs & Branch Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <label
                    style={{
                      color: "#94A3B8",
                      fontSize: "0.78rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Engine CC
                  </label>
                  <input
                    type="number"
                    name="engineCC"
                    value={formData.engineCC}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "11px",
                      borderRadius: "8px",
                      backgroundColor: "#20242B",
                      border: "1px solid #2D333F",
                      color: "#FFF",
                      fontSize: "0.9rem",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      color: "#94A3B8",
                      fontSize: "0.78rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Power (HP)
                  </label>
                  <input
                    type="number"
                    name="powerHP"
                    value={formData.powerHP}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "11px",
                      borderRadius: "8px",
                      backgroundColor: "#20242B",
                      border: "1px solid #2D333F",
                      color: "#FFF",
                      fontSize: "0.9rem",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      color: "#94A3B8",
                      fontSize: "0.78rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Transmission
                  </label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "11px",
                      borderRadius: "8px",
                      backgroundColor: "#20242B",
                      border: "1px solid #2D333F",
                      color: "#FFF",
                      fontSize: "0.9rem",
                    }}
                  >
                    <option value="Manual">Manual</option>
                    <option value="Quickshifter">Quickshifter</option>
                    <option value="Automatic">Automatic</option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      color: "#94A3B8",
                      fontSize: "0.78rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Branch Hub
                  </label>
                  <select
                    name="locationBranch"
                    value={formData.locationBranch}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "11px",
                      borderRadius: "8px",
                      backgroundColor: "#20242B",
                      border: "1px solid #2D333F",
                      color: "#FFF",
                      fontSize: "0.9rem",
                    }}
                  >
                    <option value="Central Hub">Central Hub</option>
                    <option value="Downtown Apex Hub">Downtown Apex Hub</option>
                    <option value="Highway Express Terminal">
                      Highway Express Terminal
                    </option>
                    <option value="North Coast Hub">North Coast Hub</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={formSubmitting}
                style={{
                  width: "100%",
                  backgroundColor: "#E08E45",
                  color: "#0F1115",
                  border: "none",
                  padding: "14px",
                  borderRadius: "10px",
                  fontWeight: "700",
                  fontSize: "1rem",
                  cursor: "pointer",
                  fontFamily: "Outfit, sans-serif",
                  letterSpacing: "0.5px",
                }}
              >
                {formSubmitting
                  ? "Adding Vehicle to Fleet..."
                  : "🚀 Publish Item to Website Listings (in ₹)"}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: FLEET INVENTORY & EDIT LISTINGS */}
        {activeTab === "inventory" && (
          <div>
            {/* Search + Filter Buttons Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "28px",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => setInventoryFilter("all")}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "20px",
                    border:
                      inventoryFilter === "all"
                        ? "1px solid #E08E45"
                        : "1px solid #2D333F",
                    backgroundColor:
                      inventoryFilter === "all" ? "#E08E45" : "#20242B",
                    color: inventoryFilter === "all" ? "#0F1115" : "#94A3B8",
                    fontSize: "0.82rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    fontFamily: "Outfit, sans-serif",
                    transition: "all 0.2s",
                  }}
                >
                  ALL FLEET ({filteredInventory.length})
                </button>
                <button
                  onClick={() => setInventoryFilter("bikes")}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "20px",
                    border:
                      inventoryFilter === "bikes"
                        ? "1px solid #818CF8"
                        : "1px solid rgba(99,102,241,0.3)",
                    backgroundColor:
                      inventoryFilter === "bikes"
                        ? "#818CF8"
                        : "rgba(99,102,241,0.12)",
                    color: inventoryFilter === "bikes" ? "#0F1115" : "#818CF8",
                    fontSize: "0.82rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    fontFamily: "Outfit, sans-serif",
                    transition: "all 0.2s",
                  }}
                >
                  🏍 BIKES ({filteredBikes.length})
                </button>
                <button
                  onClick={() => setInventoryFilter("cars")}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "20px",
                    border:
                      inventoryFilter === "cars"
                        ? "1px solid #2DD4BF"
                        : "1px solid rgba(20,184,166,0.3)",
                    backgroundColor:
                      inventoryFilter === "cars"
                        ? "#2DD4BF"
                        : "rgba(20,184,166,0.12)",
                    color: inventoryFilter === "cars" ? "#0F1115" : "#2DD4BF",
                    fontSize: "0.82rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    fontFamily: "Outfit, sans-serif",
                    transition: "all 0.2s",
                  }}
                >
                  🏎 CARS ({filteredCars.length})
                </button>
              </div>
              <input
                type="text"
                placeholder="Search by title or brand..."
                value={searchInventory}
                onChange={(e) => setSearchInventory(e.target.value)}
                style={{
                  padding: "9px 16px",
                  borderRadius: "8px",
                  backgroundColor: "#20242B",
                  border: "1px solid #2D333F",
                  color: "#FFF",
                  fontSize: "0.88rem",
                  width: "260px",
                }}
              />
            </div>

            {/* ── BIKES SECTION ── */}
            {(inventoryFilter === "all" || inventoryFilter === "bikes") && (
              <div style={{ marginBottom: "36px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "18px",
                    paddingBottom: "12px",
                    borderBottom: "2px solid rgba(99,102,241,0.3)",
                  }}
                >
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "10px",
                      backgroundColor: "rgba(99,102,241,0.15)",
                      border: "1px solid rgba(99,102,241,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                    }}
                  >
                    🏍
                  </div>
                  <div>
                    <h3
                      style={{
                        color: "#818CF8",
                        fontWeight: "800",
                        fontSize: "1.1rem",
                        fontFamily: "Outfit, sans-serif",
                        margin: 0,
                      }}
                    >
                      Bikes / Superbikes
                    </h3>
                    <span style={{ color: "#64748B", fontSize: "0.78rem" }}>
                      {filteredBikes.length} listings in fleet
                    </span>
                  </div>
                </div>
                {filteredBikes.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "32px",
                      border: "1px dashed #2D333F",
                      borderRadius: "12px",
                      color: "#64748B",
                    }}
                  >
                    No bikes found
                    {searchInventory ? " matching your search" : ""}.
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(260px, 1fr))",
                      gap: "18px",
                    }}
                  >
                    {filteredBikes.map((v) => (
                      <VehicleCard
                        key={v._id}
                        v={v}
                        onEdit={handleStartEdit}
                        onDelete={handleDeleteVehicle}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── CARS SECTION ── */}
            {(inventoryFilter === "all" || inventoryFilter === "cars") && (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "18px",
                    paddingBottom: "12px",
                    borderBottom: "2px solid rgba(20,184,166,0.3)",
                  }}
                >
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "10px",
                      backgroundColor: "rgba(20,184,166,0.15)",
                      border: "1px solid rgba(20,184,166,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                    }}
                  >
                    🏎
                  </div>
                  <div>
                    <h3
                      style={{
                        color: "#2DD4BF",
                        fontWeight: "800",
                        fontSize: "1.1rem",
                        fontFamily: "Outfit, sans-serif",
                        margin: 0,
                      }}
                    >
                      Cars
                    </h3>
                    <span style={{ color: "#64748B", fontSize: "0.78rem" }}>
                      {filteredCars.length} listings in fleet
                    </span>
                  </div>
                </div>
                {filteredCars.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "32px",
                      border: "1px dashed #2D333F",
                      borderRadius: "12px",
                      color: "#64748B",
                    }}
                  >
                    No cars found
                    {searchInventory ? " matching your search" : ""}.
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(260px, 1fr))",
                      gap: "18px",
                    }}
                  >
                    {filteredCars.map((v) => (
                      <VehicleCard
                        key={v._id}
                        v={v}
                        onEdit={handleStartEdit}
                        onDelete={handleDeleteVehicle}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: UPI & QR CODE SETTINGS */}
        {activeTab === "payment-settings" && (
          <div
            style={{
              backgroundColor: "#181B20",
              border: "1px solid #2D333F",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "650px",
              margin: "0 auto",
            }}
          >
            <h3
              style={{
                color: "#FFFFFF",
                fontWeight: "800",
                fontSize: "1.25rem",
                fontFamily: "Outfit, sans-serif",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              🪙 UPI & QR Payment Gateway Configuration
            </h3>
            <p
              style={{
                color: "#94A3B8",
                fontSize: "0.85rem",
                marginBottom: "24px",
              }}
            >
              Configure your business UPI ID and upload a custom payment QR
              code. Customers will see these details at check-out to submit real
              payments.
            </p>

            {paymentSettingsSuccess && (
              <div
                style={{
                  backgroundColor: "rgba(0,255,136,0.1)",
                  border: "1px solid #00FF88",
                  color: "#00FF88",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                  fontSize: "0.88rem",
                  fontWeight: "600",
                }}
              >
                ✓ {paymentSettingsSuccess}
              </div>
            )}

            {paymentSettingsError && (
              <div
                style={{
                  backgroundColor: "rgba(255,46,84,0.1)",
                  border: "1px solid #FF2E54",
                  color: "#FF2E54",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                  fontSize: "0.88rem",
                  fontWeight: "600",
                }}
              >
                ⚠️ {paymentSettingsError}
              </div>
            )}

            <form onSubmit={handlePaymentSettingsSubmit}>
              {/* Toggle switch */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#20242B",
                  padding: "12px 18px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                  border: "1px solid #2D333F",
                }}
              >
                <div>
                  <span
                    style={{
                      color: "#FFFFFF",
                      fontSize: "0.9rem",
                      fontWeight: "700",
                      display: "block",
                    }}
                  >
                    Accept UPI Payments
                  </span>
                  <span style={{ color: "#94A3B8", fontSize: "0.76rem" }}>
                    Enable or disable UPI QR/ID scan option at checkout
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={paymentSettings.upiEnabled}
                  onChange={(e) =>
                    setPaymentSettings((prev) => ({
                      ...prev,
                      upiEnabled: e.target.checked,
                    }))
                  }
                  style={{
                    width: "20px",
                    height: "20px",
                    accentColor: "#E08E45",
                    cursor: "pointer",
                  }}
                />
              </div>

              {/* UPI ID */}
              <div style={{ marginBottom: "18px" }}>
                <label
                  style={{
                    color: "#94A3B8",
                    fontSize: "0.78rem",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  UPI ID (VPA) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. business@upi or merchant@okaxis"
                  value={paymentSettings.upiId}
                  onChange={(e) =>
                    setPaymentSettings((prev) => ({
                      ...prev,
                      upiId: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "11px",
                    borderRadius: "8px",
                    backgroundColor: "#20242B",
                    border: "1px solid #2D333F",
                    color: "#FFF",
                    fontSize: "0.9rem",
                  }}
                  required={paymentSettings.upiEnabled}
                />
              </div>

              {/* Merchant Display Name */}
              <div style={{ marginBottom: "18px" }}>
                <label
                  style={{
                    color: "#94A3B8",
                    fontSize: "0.78rem",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Merchant / Display Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. ApexLease Rentals Ltd."
                  value={paymentSettings.upiName}
                  onChange={(e) =>
                    setPaymentSettings((prev) => ({
                      ...prev,
                      upiName: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "11px",
                    borderRadius: "8px",
                    backgroundColor: "#20242B",
                    border: "1px solid #2D333F",
                    color: "#FFF",
                    fontSize: "0.9rem",
                  }}
                />
              </div>

              {/* Transaction Description */}
              <div style={{ marginBottom: "18px" }}>
                <label
                  style={{
                    color: "#94A3B8",
                    fontSize: "0.78rem",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Transaction Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vehicle Rental Deposit"
                  value={paymentSettings.upiDescription}
                  onChange={(e) =>
                    setPaymentSettings((prev) => ({
                      ...prev,
                      upiDescription: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "11px",
                    borderRadius: "8px",
                    backgroundColor: "#20242B",
                    border: "1px solid #2D333F",
                    color: "#FFF",
                    fontSize: "0.9rem",
                  }}
                />
              </div>

              {/* QR CODE FILE UPLOAD */}
              <div
                style={{
                  backgroundColor: "#20242B",
                  border: "1px dashed #2D333F",
                  borderRadius: "12px",
                  padding: "18px",
                  marginBottom: "20px",
                }}
              >
                <label
                  style={{
                    color: "#E08E45",
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "10px",
                  }}
                >
                  🖼 Payment QR Code Image
                </label>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: "14px",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <label
                      style={{
                        color: "#94A3B8",
                        fontSize: "0.75rem",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Upload QR Image from Device
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleQrUpload}
                      style={{ color: "#94A3B8", fontSize: "0.82rem" }}
                    />
                  </div>

                  {paymentQrPreview && (
                    <div
                      style={{
                        position: "relative",
                        border: "2px solid #E08E45",
                        padding: "4px",
                        borderRadius: "8px",
                        backgroundColor: "#FFF",
                      }}
                    >
                      <img
                        src={paymentQrPreview}
                        alt="QR Code Preview"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    color: "#94A3B8",
                    fontSize: "0.78rem",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Payment Instructions for Customers
                </label>
                <textarea
                  rows={3}
                  value={paymentSettings.paymentInstructions}
                  onChange={(e) =>
                    setPaymentSettings((prev) => ({
                      ...prev,
                      paymentInstructions: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "11px",
                    borderRadius: "8px",
                    backgroundColor: "#20242B",
                    border: "1px solid #2D333F",
                    color: "#FFF",
                    fontSize: "0.9rem",
                    resize: "vertical",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={paymentSettingsLoading}
                style={{
                  width: "100%",
                  backgroundColor: "#E08E45",
                  color: "#0F1115",
                  border: "none",
                  padding: "14px",
                  borderRadius: "10px",
                  fontWeight: "700",
                  fontSize: "1rem",
                  cursor: "pointer",
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                {paymentSettingsLoading
                  ? "Saving Settings..."
                  : "💾 Save Gateway Configuration"}
              </button>
            </form>
          </div>
        )}

        {/* EDIT VEHICLE MODAL */}
        {editingVehicle && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.85)",
              backdropFilter: "blur(5px)",
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
                border: "1px solid #E08E45",
                borderRadius: "16px",
                padding: "28px",
                maxWidth: "750px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                  borderBottom: "1px solid #2D333F",
                  paddingBottom: "12px",
                }}
              >
                <h3
                  style={{
                    color: "#FFF",
                    fontSize: "1.2rem",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Edit color="#E08E45" size={18} /> Edit Vehicle Listing: "
                  {editingVehicle.title}"
                </h3>
                <button
                  onClick={() => setEditingVehicle(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#94A3B8",
                    cursor: "pointer",
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {editSuccess && (
                <div
                  style={{
                    backgroundColor: "rgba(0,255,136,0.1)",
                    border: "1px solid #00FF88",
                    color: "#00FF88",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    marginBottom: "16px",
                    fontSize: "0.88rem",
                  }}
                >
                  ✓ {editSuccess}
                </div>
              )}

              {editError && (
                <div
                  style={{
                    backgroundColor: "rgba(255,46,84,0.1)",
                    border: "1px solid #FF2E54",
                    color: "#FF2E54",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    marginBottom: "16px",
                    fontSize: "0.88rem",
                  }}
                >
                  ⚠️ {editError}
                </div>
              )}

              <form onSubmit={handleUpdateVehicleSubmit}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "14px",
                    marginBottom: "14px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        color: "#94A3B8",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Type
                    </label>
                    <select
                      name="vehicleType"
                      value={editFormData.vehicleType}
                      onChange={handleEditInputChange}
                      style={{
                        width: "100%",
                        padding: "9px",
                        borderRadius: "6px",
                        backgroundColor: "#20242B",
                        border: "1px solid #2D333F",
                        color: "#FFF",
                      }}
                    >
                      <option value="Superbike">🏍 Bike</option>
                      <option value="Car">🏎 Car</option>
                    </select>
                  </div>
                  <div>
                    <label
                      style={{
                        color: "#94A3B8",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Brand
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={editFormData.brand}
                      onChange={handleEditInputChange}
                      style={{
                        width: "100%",
                        padding: "9px",
                        borderRadius: "6px",
                        backgroundColor: "#20242B",
                        border: "1px solid #2D333F",
                        color: "#FFF",
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        color: "#94A3B8",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Category / Tag
                    </label>
                    <select
                      name="category"
                      value={editFormData.category}
                      onChange={handleEditInputChange}
                      style={{
                        width: "100%",
                        padding: "9px",
                        borderRadius: "6px",
                        backgroundColor: "#20242B",
                        border: "1px solid #2D333F",
                        color: "#FFF",
                      }}
                    >
                      {(editFormData.vehicleType === "Superbike"
                        ? BIKE_CATEGORIES
                        : CAR_CATEGORIES
                      ).map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: "14px",
                    marginBottom: "14px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        color: "#94A3B8",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title}
                      onChange={handleEditInputChange}
                      style={{
                        width: "100%",
                        padding: "9px",
                        borderRadius: "6px",
                        backgroundColor: "#20242B",
                        border: "1px solid #2D333F",
                        color: "#FFF",
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        color: "#94A3B8",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Model
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={editFormData.model}
                      onChange={handleEditInputChange}
                      style={{
                        width: "100%",
                        padding: "9px",
                        borderRadius: "6px",
                        backgroundColor: "#20242B",
                        border: "1px solid #2D333F",
                        color: "#FFF",
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label
                    style={{
                      color: "#94A3B8",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    value={editFormData.description}
                    onChange={handleEditInputChange}
                    style={{
                      width: "100%",
                      padding: "9px",
                      borderRadius: "6px",
                      backgroundColor: "#20242B",
                      border: "1px solid #2D333F",
                      color: "#FFF",
                      resize: "vertical",
                    }}
                  />
                </div>

                {/* Edit Image Upload */}
                <div
                  style={{
                    backgroundColor: "#20242B",
                    border: "1px dashed #2D333F",
                    borderRadius: "8px",
                    padding: "12px",
                    marginBottom: "14px",
                  }}
                >
                  <label
                    style={{
                      color: "#E08E45",
                      fontSize: "0.78rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Update Image (Upload File or Edit URL)
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageUpload}
                      style={{ color: "#94A3B8", fontSize: "0.8rem" }}
                    />
                    <input
                      type="url"
                      name="imageUrl"
                      value={editFormData.imageUrl}
                      onChange={handleEditInputChange}
                      placeholder="Image URL..."
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "6px",
                        backgroundColor: "#181B20",
                        border: "1px solid #2D333F",
                        color: "#FFF",
                        fontSize: "0.8rem",
                      }}
                    />
                  </div>
                  {editPreviewImage && (
                    <img
                      src={editPreviewImage}
                      alt="Edit preview"
                      style={{
                        width: "80px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        marginTop: "8px",
                        border: "1px solid #E08E45",
                      }}
                    />
                  )}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "14px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        color: "#94A3B8",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Daily Rate (₹)
                    </label>
                    <input
                      type="number"
                      name="dailyRate"
                      value={editFormData.dailyRate}
                      onChange={handleEditInputChange}
                      style={{
                        width: "100%",
                        padding: "9px",
                        borderRadius: "6px",
                        backgroundColor: "#20242B",
                        border: "1px solid #2D333F",
                        color: "#FFF",
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        color: "#94A3B8",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Surge Rate (₹)
                    </label>
                    <input
                      type="number"
                      name="weekendSurgeRate"
                      value={editFormData.weekendSurgeRate}
                      onChange={handleEditInputChange}
                      style={{
                        width: "100%",
                        padding: "9px",
                        borderRadius: "6px",
                        backgroundColor: "#20242B",
                        border: "1px solid #2D333F",
                        color: "#FFF",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        color: "#94A3B8",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Deposit (₹)
                    </label>
                    <input
                      type="number"
                      name="securityDeposit"
                      value={editFormData.securityDeposit}
                      onChange={handleEditInputChange}
                      style={{
                        width: "100%",
                        padding: "9px",
                        borderRadius: "6px",
                        backgroundColor: "#20242B",
                        border: "1px solid #2D333F",
                        color: "#FFF",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    type="submit"
                    disabled={editSubmitting}
                    style={{
                      flex: 1,
                      backgroundColor: "#E08E45",
                      color: "#0F1115",
                      border: "none",
                      padding: "12px",
                      borderRadius: "8px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    {editSubmitting
                      ? "Saving Changes..."
                      : "💾 Save & Publish Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingVehicle(null)}
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid #2D333F",
                      color: "#94A3B8",
                      padding: "12px 20px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Reusable Inventory Card ───────────────────────────────────────────────
const VehicleCard = ({ v, onEdit, onDelete }) => (
  <div
    style={{
      backgroundColor: "#20242B",
      border: "1px solid #2D333F",
      borderRadius: "12px",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div style={{ position: "relative", height: "150px" }}>
      <img
        src={v.images?.[0]}
        alt={v.title}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={(e) => {
          e.target.src =
            "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=400";
        }}
      />
      <span
        style={{
          position: "absolute",
          top: "8px",
          left: "8px",
          backgroundColor: "rgba(0,0,0,0.8)",
          color: v.vehicleType === "Superbike" ? "#818CF8" : "#2DD4BF",
          padding: "3px 8px",
          borderRadius: "4px",
          fontSize: "0.68rem",
          fontWeight: "700",
          letterSpacing: "0.3px",
        }}
      >
        {v.vehicleType === "Superbike" ? "🏍 BIKE" : "🏎 CAR"}
      </span>
      <span
        style={{
          position: "absolute",
          bottom: "8px",
          right: "8px",
          backgroundColor: "rgba(15,17,21,0.88)",
          color: "#E08E45",
          padding: "2px 8px",
          borderRadius: "4px",
          fontSize: "0.7rem",
          fontWeight: "600",
        }}
      >
        {v.category}
      </span>
    </div>
    <div
      style={{
        padding: "14px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "0.7rem",
            color: "#E08E45",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {v.brand}
        </div>
        <h4
          style={{
            color: "#FFF",
            fontSize: "0.98rem",
            fontWeight: "700",
            marginTop: "3px",
            marginBottom: "6px",
            fontFamily: "Outfit, sans-serif",
          }}
        >
          {v.title}
        </h4>
        {v.description ? (
          <p
            style={{
              color: "#CBD5E1",
              fontSize: "0.78rem",
              marginBottom: "8px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: "1.5",
            }}
          >
            {v.description}
          </p>
        ) : (
          <p
            style={{
              color: "#64748B",
              fontSize: "0.75rem",
              fontStyle: "italic",
              marginBottom: "8px",
            }}
          >
            No description added
          </p>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #2D333F",
          paddingTop: "10px",
          marginTop: "8px",
        }}
      >
        <div>
          <span
            style={{ color: "#E08E45", fontWeight: "800", fontSize: "1rem" }}
          >
            ₹{Number(v.dailyRate).toLocaleString("en-IN")}
          </span>
          <span style={{ color: "#64748B", fontSize: "0.72rem" }}>/day</span>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            onClick={() => onEdit(v)}
            style={{
              backgroundColor: "rgba(224,142,69,0.12)",
              color: "#E08E45",
              border: "1px solid rgba(224,142,69,0.3)",
              padding: "6px 10px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.76rem",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              transition: "all 0.15s",
            }}
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => onDelete(v._id, v.title)}
            style={{
              backgroundColor: "rgba(255,46,84,0.1)",
              color: "#FF2E54",
              border: "1px solid rgba(255,46,84,0.3)",
              padding: "6px 10px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.76rem",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  </div>
);
