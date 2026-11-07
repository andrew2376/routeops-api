export interface Conductor {
  id: number
  nombres: string
  apellidos: string
  numeroDocumento: string
  telefono: string | null
  correo: string | null
  estado: 'ACTIVO' | 'INACTIVO'
  fechaCreacion: string
}

export interface ConductorRequest {
  nombres: string
  apellidos: string
  numeroDocumento: string
  telefono: string | null
  correo: string | null
}

const API_URL = 'http://localhost:8080/api/conductores'

async function obtenerMensajeError(
  respuesta: Response,
): Promise<string> {
  try {
    const datos = await respuesta.json()
    return datos.mensaje ?? datos.message ?? `Error HTTP ${respuesta.status}`
  } catch {
    return `Error HTTP ${respuesta.status}`
  }
}

export async function obtenerConductores(): Promise<Conductor[]> {
  const respuesta = await fetch(API_URL)

  if (!respuesta.ok) {
    throw new Error(await obtenerMensajeError(respuesta))
  }

  return respuesta.json() as Promise<Conductor[]>
}

export async function crearConductor(
  datos: ConductorRequest,
): Promise<Conductor> {
  const respuesta = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  })

  if (!respuesta.ok) {
    throw new Error(await obtenerMensajeError(respuesta))
  }

  return respuesta.json() as Promise<Conductor>
}

export async function actualizarConductor(
  id: number,
  datos: ConductorRequest,
): Promise<Conductor> {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  })

  if (!respuesta.ok) {
    throw new Error(await obtenerMensajeError(respuesta))
  }

  return respuesta.json() as Promise<Conductor>
}

export async function cambiarEstadoConductor(
  id: number,
  estado: 'ACTIVO' | 'INACTIVO',
): Promise<Conductor> {
  const respuesta = await fetch(`${API_URL}/${id}/estado`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ estado }),
  })

  if (!respuesta.ok) {
    throw new Error(await obtenerMensajeError(respuesta))
  }

  return respuesta.json() as Promise<Conductor>
}