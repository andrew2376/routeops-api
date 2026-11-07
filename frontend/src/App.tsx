
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Conductores from './pages/Conductores'

export type Seccion = 'Dashboard' | 'Conductores'

export default function App() {
  const [seccion, setSeccion] = useState<Seccion>('Dashboard')

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        seccionActual={seccion}
        onCambiarSeccion={setSeccion}
      />

      {seccion === 'Dashboard' ? <Dashboard /> : <Conductores />}
    </div>
  )
}
