import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Vans from "./pages/Vans";
import ProtectedRoute from "./components/ProtectedReact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Van from "./components/Van";
import MyVan from "./pages/MyVan";
import HostLayout from "./components/HostLayout";
import Dashboard from "./components/Dashboard";
import Income from "./components/Income";
import HostVans from "./components/HostVans";
import Reviews from "./components/Reviews";
import HostVan from "./components/HostVan";
import HostVanDetails from "./components/HostVanDetails";
import HostVanPrice from "./components/HostVanPrice";
import HostVanPhotos from "./components/HostVanPhotos";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="vans" element={<Vans />} />
        <Route path="vans/:id" element={<Van />} />
        <Route path="van/:id" element={<Van />} />

        {/* User Active Rental Route */}
        <Route
          path="my-van"
          element={
            <ProtectedRoute>
              <MyVan />
            </ProtectedRoute>
          }
        />

        {/* Protected Host routes (Admin only: mrasilbek3@gmail.com) */}
        <Route
          path="host"
          element={
            <ProtectedRoute requireAdmin={true}>
              <HostLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="income" element={<Income />} />
          <Route path="hostVans" element={<HostVans />} />
          <Route path="reviews" element={<Reviews />} />
        </Route>

        <Route
          path="hostVan/:id"
          element={
            <ProtectedRoute requireAdmin={true}>
              <HostVan />
            </ProtectedRoute>
          }
        >
          <Route index element={<HostVanDetails />} />
          <Route path="hostVanPrice" element={<HostVanPrice />} />
          <Route path="hostVanPhotos" element={<HostVanPhotos />} />
        </Route>

        {/* 404 Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}