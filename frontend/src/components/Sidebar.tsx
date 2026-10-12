
import {
  LayoutDashboard,
  Users,
  Truck,
  MapPinned,
  ClipboardList,
  Settings,
  Route,
} from 'lucide-react'

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Conductores', icon: Users },
  { label: 'Vehículos', icon: Truck },
  { label: 'Rutas', icon: MapPinned },
  { label: 'Operaciones', icon: ClipboardList },
]

export default function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-5">
      <div className="mb-10 flex items-center gap-3">
        <div className="rounded-xl bg-blue-600 p-2 text-white">
          <Route size={25} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">RouteOps</h1>
          <p className="text-xs text-slate-500">Logística inteligente</p>
        </div>
      </div>

      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Menú principal
      </p>

      <nav className="flex-1 space-y-2">
        {menuItems.map(({ label, icon: Icon }, index) => (
          <button
            key={label}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
              index === 0
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Icon size={19} />
            {label}
          </button>
        ))}
      </nav>

      <div className="border-t border-slate-200 pt-4">
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600 hover:bg-slate-50">
          <Settings size={19} />
          Configuración
        </button>
        <p className="mt-4 text-xs text-slate-400">RouteOps · Versión 1.0</p>
      </div>
    </aside>
  )
}
