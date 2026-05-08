import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { AdminRoute } from './components/AdminRoute';
import { HomePage } from './pages/public/HomePage';
import { EntradaDatosPage } from './pages/public/EntradaDatosPage';
import { LoginPage } from './pages/LoginPage';
import { WelcomePage } from './pages/WelcomePage';
import { UsersPage } from './pages/users/UsersPage';
import { UserFormPage } from './pages/users/UserFormPage';
import { ProfilePage } from './pages/ProfilePage';
import { AsistenciaPage } from './pages/admin/AsistenciaPage';
import { MaterialsPage } from './pages/admin/MaterialsPage';
import { MaterialFormPage } from './pages/admin/MaterialFormPage';
import { ProductsPage } from './pages/admin/ProductsPage';
import { ProductFormPage } from './pages/admin/ProductFormPage';
import { AsistenciaInformePage } from './pages/admin/AsistenciaInformePage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/entrada-datos" element={<EntradaDatosPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected */}
          <Route element={<PrivateRoute />}>
            <Route path="/admin/welcome" element={<WelcomePage />} />
            <Route path="/admin/asistencia" element={<AsistenciaPage />} />
            <Route path="/admin/profile" element={<ProfilePage />} />

            {/* Admin only */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/users/new" element={<UserFormPage />} />
              <Route path="/admin/users/:id/edit" element={<UserFormPage />} />
              <Route path="/admin/asistencia/informe" element={<AsistenciaInformePage />} />

              {/* Catálogo / Inventario */}
              <Route path="/admin/materials" element={<MaterialsPage />} />
              <Route path="/admin/materials/new" element={<MaterialFormPage />} />
              <Route path="/admin/materials/:id/edit" element={<MaterialFormPage />} />
              
              <Route path="/admin/products" element={<ProductsPage />} />
              <Route path="/admin/products/new" element={<ProductFormPage />} />
              <Route path="/admin/products/:id/edit" element={<ProductFormPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
