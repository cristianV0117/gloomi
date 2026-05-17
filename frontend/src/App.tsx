import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { RequireAdmin } from './components/RequireAdmin'
import { AuthProvider } from './contexts/AuthContext'
import { UiPreferencesProvider } from './contexts/UiPreferencesContext'
import { About } from './pages/About'
import { AdminContactMessages } from './pages/AdminContactMessages'
import { AdminCreateGloomi } from './pages/AdminCreateGloomi'
import { AdminCustomizations } from './pages/AdminCustomizations'
import { AdminCustomizationViewer } from './pages/AdminCustomizationViewer'
import { AdminDashboard } from './pages/AdminDashboard'
import { AdminEditGloomi } from './pages/AdminEditGloomi'
import { AdminLogin } from './pages/AdminLogin'
import { Community } from './pages/Community'
import { Contact } from './pages/Contact'
import { Customize } from './pages/Customize'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { ProductDetail } from './pages/ProductDetail'
import { Shop } from './pages/Shop'
import { Upcycling } from './pages/Upcycling'

export default function App() {
  return (
    <UiPreferencesProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="tienda" element={<Shop />} />
            <Route path="tienda/:slug" element={<ProductDetail />} />
            <Route path="personalizar" element={<Customize />} />
            <Route path="comunidad" element={<Community />} />
            <Route path="quienes-somos" element={<About />} />
            <Route path="upcycling" element={<Upcycling />} />
            <Route path="contacto" element={<Contact />} />
            <Route path="admin/login" element={<AdminLogin />} />
            <Route
              path="admin/dashboard"
              element={
                <RequireAdmin>
                  <AdminDashboard />
                </RequireAdmin>
              }
            />
            <Route
              path="admin/mensajes"
              element={
                <RequireAdmin>
                  <AdminContactMessages />
                </RequireAdmin>
              }
            />
            <Route
              path="admin/personalizaciones"
              element={
                <RequireAdmin>
                  <AdminCustomizations />
                </RequireAdmin>
              }
            />
            <Route
              path="admin/personalizaciones/:id"
              element={
                <RequireAdmin>
                  <AdminCustomizationViewer />
                </RequireAdmin>
              }
            />
            <Route
              path="admin/gloomis/nuevo"
              element={
                <RequireAdmin>
                  <AdminCreateGloomi />
                </RequireAdmin>
              }
            />
            <Route
              path="admin/gloomis/:slug/edit"
              element={
                <RequireAdmin>
                  <AdminEditGloomi />
                </RequireAdmin>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </UiPreferencesProvider>
  )
}
