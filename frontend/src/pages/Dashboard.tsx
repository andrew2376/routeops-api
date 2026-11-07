
import {
  Users,
  Truck,
  Route,
  Activity,
  ArrowUpRight,
} from 'lucide-react'

const metrics = [
  {
    title: 'Conductores',
    value: '—',
    description: 'Total registrado',
    icon: Users,
  },
  {
    title: 'Vehículos',
    value: '—',
    description: 'Flota registrada',
    icon: Truck,
  },
  {
    title: 'Rutas activas',
    value: '—',
    description: 'En operación',
    icon: Route,
  },
  {
    title: 'Operaciones',
    value: '—',
    description: 'Actividad del sistema',
    icon: Activity,
  },
]

export default function Dashboard() {
  return (
    <main className="min-w-0 flex-1 p-6 lg:p-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-sm text-slate-500">
            Panel de control / General
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Bienvenido a RouteOps. Este es el resumen de tu operación.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />
          Panel de gestión
        </div>
      </header>

      <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ title, value, description, icon: Icon }) => (
          <article
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                {title}
              </span>
              <div className="rounded-xl bg-blue-50 p-2 text-blue-700">
                <Icon size={20} />
              </div>
            </div>

            <p className="text-3xl font-bold text-slate-900">{value}</p>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Centro de operaciones
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Accesos principales del sistema
              </p>
            </div>
            <ArrowUpRight className="text-slate-400" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-5">
              <Users className="mb-3 text-blue-600" size={24} />
              <h4 className="font-semibold text-slate-800">Conductores</h4>
              <p className="mt-2 text-sm text-slate-500">
                Administra los registros y estados de tus conductores.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <Truck className="mb-3 text-blue-600" size={24} />
              <h4 className="font-semibold text-slate-800">Vehículos</h4>
              <p className="mt-2 text-sm text-slate-500">
                Prepara el espacio para gestionar la flota logística.
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Estado del proyecto
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            La interfaz inicial está preparada. Las métricas se conectarán a
            los datos reales del backend en los siguientes pasos.
          </p>

          <div className="mt-6 rounded-xl bg-emerald-50 p-4">
            <p className="font-medium text-emerald-800">
              Backend de conductores
            </p>
            <p className="mt-1 text-sm text-emerald-700">
              API desarrollada con Spring Boot.
            </p>
          </div>
        </article>
      </section>
    </main>
  )
}
