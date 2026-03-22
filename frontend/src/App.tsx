import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/public/Home";
import Equipment from "./pages/public/Equipment";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import EquipmentDetails from "./pages/public/EquipmentDetails";
import FarmerDashboard from "./pages/farmer/Dashboard";
import OwnerDashboard from "./pages/owner/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import BookingDetails from "./pages/farmer/BookingDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/equipment/:id" element={<EquipmentDetails />} />
          <Route path="/booking/:id" element={<BookingDetails />} />
          <Route
  path="/login"
  element={
    <PublicRoute>
      <Login />
    </PublicRoute>
  }
/>
<Route
  path="/signup"
  element={
    <PublicRoute>
      <Signup />
    </PublicRoute>
  }
/>
<Route
  path="/farmer/dashboard"
  element={
    <ProtectedRoute>
      <FarmerDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/owner/dashboard"
  element={
    <ProtectedRoute>
      <OwnerDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;