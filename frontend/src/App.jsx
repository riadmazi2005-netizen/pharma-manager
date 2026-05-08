import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Sidebar } from './components/common/Sidebar'
import DashboardPage from './pages/DashboardPage'
import CategoriesPage from './pages/CategoriesPage'
import MedicamentsPage from './pages/MedicamentsPage'
import VentesPage from './pages/VentesPage'
import HistoriqueVentesPage from './pages/HistoriqueVentesPage'

function Layout() {
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-gray-900 dark:text-white">
      <Sidebar currentPath={location.pathname} />
      <main className="flex flex-1 flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/medicaments" element={<MedicamentsPage />} />
          <Route path="/ventes" element={<VentesPage />} />
          <Route path="/historique" element={<HistoriqueVentesPage />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

export default App
