import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  Search,
  Users,
  RefreshCw,
  UserRound,
  Mail,
  Phone,
  Plus,
  X,
  Pencil,
} from 'lucide-react'

import {
  obtenerConductores,
  crearConductor,
  actualizarConductor,
  cambiarEstadoConductor,
  type Conductor,
  type ConductorRequest,
} from '../services/conductorService'

const formularioInicial: ConductorRequest = {
  nombres: '',
  apellidos: '',
  numeroDocumento: '',
  telefono: '',
  correo: '',
}

export default function Conductores() {
  const [conductores, setConductores] = useState<Conductor[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [formulario, setFormulario] =
    useState<ConductorRequest>(formularioInicial)
  const [guardando, setGuardando] = useState(false)
  const [errorFormulario, setErrorFormulario] = useState('')
  const [mensajeExito, setMensajeExito] = useState('')
  const [conductorEditando, setConductorEditando] =
    useState<Conductor | null>(null)

  const cargarConductores = useCallback(async () => {
    setCargando(true)
    setError('')

    try {
      const datos = await obtenerConductores()
      setConductores(datos)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible consultar los conductores. Comprueba que el backend esté activo.',
      )
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    void cargarConductores()
  }, [cargarConductores])

  const actualizarEstado = async (conductor: Conductor) => {
    const nuevoEstado =
      conductor.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO'

    setError('')
    setMensajeExito('')

    try {
      const actualizado = await cambiarEstadoConductor(
        conductor.id,
        nuevoEstado,
      )

      setConductores((actuales) =>
        actuales.map((item) =>
          item.id === actualizado.id ? actualizado : item,
        ),
      )

      setMensajeExito(
        `El conductor ahora está ${actualizado.estado.toLowerCase()}.`,
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo cambiar el estado del conductor.',
      )
    }
  }

  const actualizarCampo = (
    campo: keyof ConductorRequest,
    valor: string,
  ) => {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }))
  }

  const abrirModalNuevo = () => {
    setConductorEditando(null)
    setFormulario({ ...formularioInicial })
    setErrorFormulario('')
    setError('')
    setMensajeExito('')
    setModalAbierto(true)
  }

  const editarConductor = (conductor: Conductor) => {
    setConductorEditando(conductor)
    setFormulario({
      nombres: conductor.nombres,
      apellidos: conductor.apellidos,
      numeroDocumento: conductor.numeroDocumento,
      telefono: conductor.telefono ?? '',
      correo: conductor.correo ?? '',
    })
    setErrorFormulario('')
    setError('')
    setMensajeExito('')
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    if (guardando) return

    setModalAbierto(false)
    setConductorEditando(null)
    setFormulario({ ...formularioInicial })
    setErrorFormulario('')
  }

  const guardarConductor = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    setErrorFormulario('')
    setError('')
    setMensajeExito('')

    const datos: ConductorRequest = {
      nombres: formulario.nombres.trim(),
      apellidos: formulario.apellidos.trim(),
      numeroDocumento: formulario.numeroDocumento.trim(),
      telefono: formulario.telefono?.trim() || null,
      correo: formulario.correo?.trim() || null,
    }

    setGuardando(true)

    try {
      if (conductorEditando) {
        const actualizado = await actualizarConductor(
          conductorEditando.id,
          datos,
        )

        setConductores((actuales) =>
          actuales.map((item) =>
            item.id === actualizado.id ? actualizado : item,
          ),
        )

        setMensajeExito('Conductor actualizado correctamente.')
      } else {
        const nuevo = await crearConductor(datos)

        setConductores((actuales) => [...actuales, nuevo])
        setMensajeExito('Conductor registrado correctamente.')
        setBusqueda('')
      }

      setFormulario({ ...formularioInicial })
      setConductorEditando(null)
      setModalAbierto(false)
    } catch (err) {
      setErrorFormulario(
        err instanceof Error
          ? err.message
          : 'No fue posible guardar el conductor.',
      )
    } finally {
      setGuardando(false)
    }
  }

  const filtrados = conductores.filter((conductor) => {
    const texto = busqueda.toLowerCase()

    return [
      conductor.nombres,
      conductor.apellidos,
      conductor.numeroDocumento,
      conductor.correo ?? '',
    ].some((valor) => valor.toLowerCase().includes(texto))
  })

  const activos = conductores.filter(
    (conductor) => conductor.estado === 'ACTIVO',
  ).length

  return (
    <main className="min-w-0 flex-1 p-6 lg:p-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-sm text-slate-500">
            Panel de control / Conductores
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Conductores
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Consulta y administra los conductores de RouteOps.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void cargarConductores()}
            disabled={cargando}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Actualizar
          </button>

          <button
            type="button"
            onClick={abrirModalNuevo}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <Plus size={18} />
            Nuevo conductor
          </button>
        </div>
      </header>

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total de conductores</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {conductores.length}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Conductores activos</p>
          <p className="mt-3 text-3xl font-bold text-emerald-600">
            {activos}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Conductores inactivos</p>
          <p className="mt-3 text-3xl font-bold text-slate-500">
            {conductores.length - activos}
          </p>
        </article>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <h3 className="font-semibold text-slate-900">
              Directorio de conductores
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Información consultada desde la API.
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Buscar por nombre o documento..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="m-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {mensajeExito && (
          <div
            role="status"
            className="m-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700"
          >
            {mensajeExito}
          </div>
        )}

        {cargando ? (
          <p className="p-8 text-center text-sm text-slate-500">
            Cargando conductores...
          </p>
        ) : filtrados.length === 0 ? (
          <div className="p-12 text-center">
            <Users
              className="mx-auto mb-3 text-slate-300"
              size={35}
            />
            <p className="font-medium text-slate-700">
              No se encontraron conductores
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Prueba con otro término de búsqueda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Conductor</th>
                  <th className="px-5 py-4">Documento</th>
                  <th className="px-5 py-4">Contacto</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filtrados.map((conductor) => (
                  <tr
                    key={conductor.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-blue-50 p-2 text-blue-700">
                          <UserRound size={19} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {conductor.nombres} {conductor.apellidos}
                          </p>
                          <p className="text-xs text-slate-400">
                            ID: {conductor.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {conductor.numeroDocumento}
                    </td>

                    <td className="px-5 py-4">
                      <p className="flex items-center gap-2 text-slate-600">
                        <Phone size={14} />
                        {conductor.telefono || 'Sin teléfono'}
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <Mail size={14} />
                        {conductor.correo || 'Sin correo'}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          conductor.estado === 'ACTIVO'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {conductor.estado}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => editarConductor(conductor)}
                          className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-blue-200 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50"
                        >
                          <Pencil size={14} />
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => void actualizarEstado(conductor)}
                          className="whitespace-nowrap rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          {conductor.estado === 'ACTIVO'
                            ? 'Desactivar'
                            : 'Activar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-slate-200 px-5 py-4 text-xs text-slate-500">
          {filtrados.length} de {conductores.length} conductores
        </div>
      </section>

      {modalAbierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !guardando
            ) {
              cerrarModal()
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-modal-conductor"
            className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3
                  id="titulo-modal-conductor"
                  className="text-xl font-bold text-slate-900"
                >
                  {conductorEditando
                    ? 'Editar conductor'
                    : 'Registrar conductor'}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {conductorEditando
                    ? 'Modifica los datos del conductor seleccionado.'
                    : 'Completa los datos para agregarlo a RouteOps.'}
                </p>
              </div>

              <button
                type="button"
                disabled={guardando}
                onClick={cerrarModal}
                aria-label="Cerrar formulario"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={guardarConductor}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  Nombres *
                  <input
                    required
                    maxLength={100}
                    value={formulario.nombres}
                    onChange={(event) =>
                      actualizarCampo('nombres', event.target.value)
                    }
                    placeholder="Ej. María Fernanda"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Apellidos *
                  <input
                    required
                    maxLength={100}
                    value={formulario.apellidos}
                    onChange={(event) =>
                      actualizarCampo('apellidos', event.target.value)
                    }
                    placeholder="Ej. Gómez Pérez"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Número de documento *
                  <input
                    required
                    maxLength={30}
                    value={formulario.numeroDocumento}
                    onChange={(event) =>
                      actualizarCampo(
                        'numeroDocumento',
                        event.target.value,
                      )
                    }
                    placeholder="Número de identificación"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Teléfono
                  <input
                    maxLength={20}
                    type="tel"
                    value={formulario.telefono ?? ''}
                    onChange={(event) =>
                      actualizarCampo('telefono', event.target.value)
                    }
                    placeholder="Ej. 3001234567"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>
              </div>

              <label className="block text-sm font-medium text-slate-700">
                Correo electrónico
                <input
                  type="email"
                  maxLength={150}
                  value={formulario.correo ?? ''}
                  onChange={(event) =>
                    actualizarCampo('correo', event.target.value)
                  }
                  placeholder="conductor@correo.com"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              {errorFormulario && (
                <div
                  role="alert"
                  className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
                >
                  {errorFormulario}
                </div>
              )}

              <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  disabled={guardando}
                  onClick={cerrarModal}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={guardando}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {guardando
                    ? 'Guardando...'
                    : conductorEditando
                      ? 'Guardar cambios'
                      : 'Guardar conductor'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  )
}