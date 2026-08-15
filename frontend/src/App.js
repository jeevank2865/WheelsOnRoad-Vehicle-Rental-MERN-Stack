import React, { useState, useContext } from "react";
import { ApexProvider, ApexContext } from "./Context/ApexContext";
import BusinessIntroPage from "./Pages/BusinessIntroPage";
import FleetPage from "./Pages/HomePage";
import { DashboardPage } from "./Pages/DashboardPage";
import { AdminPage } from "./Pages/AdminPage";
import { VehicleDetails } from "./Pages/VehicleDetails";
import "./index.css";

const AppRoutes = () => {
  const [activePage, setActivePage] = useState("intro"); // starts on intro page with bg video
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const { user } = useContext(ApexContext);

  const handlePageChange = (page) => {
    setActivePage(page);
    setSelectedVehicleId(null);
    window.scrollTo(0, 0);
  };

  const handleViewVehicle = (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    setActivePage("vehicleDetails");
    window.scrollTo(0, 0);
  };

  const handleBackToFleet = () => {
    setSelectedVehicleId(null);
    setActivePage("fleet");
    window.scrollTo(0, 0);
  };

  if (activePage === "intro") {
    return (
      <BusinessIntroPage
        onExploreWheelsOnRoad={() => handlePageChange("fleet")}
      />
    );
  }

  if (activePage === "vehicleDetails" && selectedVehicleId) {
    return (
      <VehicleDetails
        vehicleId={selectedVehicleId}
        onBack={handleBackToFleet}
        onViewSimilar={handleViewVehicle}
      />
    );
  }

  if (activePage === "dashboard") {
    return <DashboardPage onPageChange={handlePageChange} />;
  }

  if (activePage === "admin") {
    return <AdminPage onPageChange={handlePageChange} />;
  }

  // Default: Fleet / Home page (bikes & cars)
  return (
    <FleetPage
      onNavigate={handlePageChange}
      onPageChange={handlePageChange}
      onViewVehicle={handleViewVehicle}
    />
  );
};

function App() {
  return (
    <ApexProvider>
      <AppRoutes />
    </ApexProvider>
  );
}

export default App;
