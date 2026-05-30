import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminSidebar from './components/admin/AdminSidebar';

import Home from './pages/Home';
import Businesses from './pages/Businesses';
import BusinessDetail from './pages/BusinessDetail';
import Search from './pages/Search';
import CategoryPage from './pages/Category';
import Login from './pages/Login';
import Register from './pages/Register';

import SavedBusinesses from './pages/dashboard/SavedBusinesses';
import MyReviews from './pages/dashboard/MyReviews';
import ProfileSettings from './pages/dashboard/ProfileSettings';

import MyListings from './pages/owner/MyListings';
import AddBusiness from './pages/owner/AddBusiness';
import EditBusiness from './pages/owner/EditBusiness';
import Inquiries from './pages/owner/Inquiries';

import AdminOverview from './pages/admin/AdminOverview';
import ManageBusinesses from './pages/admin/ManageBusinesses';
import ManageUsers from './pages/admin/ManageUsers';
import ManageReviews from './pages/admin/ManageReviews';
import ManageCategories from './pages/admin/ManageCategories';

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-1">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function DashboardLayout() {
  const { user, loading } = useContext(AuthContext)!;
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="min-h-screen flex flex-col bg-surface-1">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function AdminLayout() {
  const { profile, loading } = useContext(AuthContext)!;
  if (loading) return null;
  if (!profile || profile.role !== 'admin') return <Navigate to="/" replace />;
  return (
    <div className="min-h-screen flex bg-surface-1">
      <Navbar />
      <AdminSidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="bottom-left"
          toastOptions={{
            style: {
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              borderRadius: '8px',
              borderLeft: '3px solid #E8470A',
              padding: '12px 16px',
            },
            duration: 3000,
          }}
        />

        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/businesses" element={<Businesses />} />
            <Route path="/businesses/:slug" element={<BusinessDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="saved" element={<SavedBusinesses />} />
            <Route path="reviews" element={<MyReviews />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route index element={<Navigate to="saved" replace />} />
          </Route>

          <Route path="/owner" element={<DashboardLayout />}>
            <Route path="listings" element={<MyListings />} />
            <Route path="listings/new" element={<AddBusiness />} />
            <Route path="listings/:id/edit" element={<EditBusiness />} />
            <Route path="inquiries" element={<Inquiries />} />
            <Route index element={<Navigate to="listings" replace />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="businesses" element={<ManageBusinesses />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="reviews" element={<ManageReviews />} />
            <Route path="categories" element={<ManageCategories />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
