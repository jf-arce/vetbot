import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  CheckIcon,
  MessageCircleIcon,
  MoreVerticalIcon,
  PencilIcon,
  SearchIcon,
  StethoscopeIcon,
} from 'lucide-react'

import { Avatar, AvatarBadge, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { rutaEditarMascota, rutaMascota } from '@/routes/paths'

type EstadoMascota = 'activo' | 'fallecido'

interface MascotaListado {
  id: string
  mascota_nombre: string
  cliente_nombre: string
  telefono: string
  especie: string
  raza: string
  ultima_consulta: string
  estado: EstadoMascota
}

/** Mock temporal — se reemplaza por la consulta real a Supabase (services/mascotas.ts). */
const MOCK_MASCOTAS: MascotaListado[] = [
  {
    id: '1',
    mascota_nombre: 'Firulais',
    cliente_nombre: 'Marcos Gómez',
    telefono: '+54 9 11 4455-1234',
    especie: 'Perro',
    raza: 'Labrador',
    ultima_consulta: '15 Ago 2026 (Vacuna)',
    estado: 'activo',
  },
  {
    id: '2',
    mascota_nombre: 'Michi',
    cliente_nombre: 'Laura Fernández',
    telefono: '+54 9 11 5566-2345',
    especie: 'Gato',
    raza: 'Siamés',
    ultima_consulta: '2 Ago 2026 (Control)',
    estado: 'activo',
  },
  {
    id: '3',
    mascota_nombre: 'Rocky',
    cliente_nombre: 'Diego Álvarez',
    telefono: '+54 9 11 3344-3456',
    especie: 'Perro',
    raza: 'Bulldog Francés',
    ultima_consulta: '28 Jul 2026 (Consulta)',
    estado: 'activo',
  },
  {
    id: '4',
    mascota_nombre: 'Luna',
    cliente_nombre: 'Marcos Gómez',
    telefono: '+54 9 11 4455-1234',
    especie: 'Gato',
    raza: 'Común Europeo',
    ultima_consulta: '10 Ago 2026 (Desparasitación)',
    estado: 'activo',
  },
  {
    id: '5',
    mascota_nombre: 'Toby',
    cliente_nombre: 'Sofía Ramírez',
    telefono: '+54 9 11 6677-4567',
    especie: 'Perro',
    raza: 'Caniche',
    ultima_consulta: '12 Mar 2026 (Cirugía)',
    estado: 'fallecido',
  },
  {
    id: '6',
    mascota_nombre: 'Coco',
    cliente_nombre: 'Julián Torres',
    telefono: '+54 9 11 7788-5678',
    especie: 'Ave',
    raza: 'Cacatúa',
    ultima_consulta: '5 Ago 2026 (Control)',
    estado: 'activo',
  },
  {
    id: '7',
    mascota_nombre: 'Max',
    cliente_nombre: 'Sofía Ramírez',
    telefono: '+54 9 11 6677-4567',
    especie: 'Perro',
    raza: 'Labrador',
    ultima_consulta: '18 Ago 2026 (Vacuna)',
    estado: 'activo',
  },
  {
    id: '8',
    mascota_nombre: 'Nube',
    cliente_nombre: 'Diego Álvarez',
    telefono: '+54 9 11 3344-3456',
    especie: 'Gato',
    raza: 'Persa',
    ultima_consulta: '20 Ene 2026 (Consulta)',
    estado: 'fallecido',
  },
]

const TODAS = 'todas'

function BadgeEstadoMascota({ estado }: { estado: EstadoMascota }) {
  if (estado === 'activo') {
    return (
      <Badge
        variant="secondary"
        className="bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400"
      >
        Activo
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className="bg-muted text-muted-foreground">
      Fallecido
    </Badge>
  )
}

function iniciales(nombre: string) {
  return nombre.slice(0, 2).toUpperCase()
}

export function MascotasListView() {
  const navigate = useNavigate()
  const [busqueda, setBusqueda] = useState('')
  const [especieFiltro, setEspecieFiltro] = useState(TODAS)
  const [razaFiltro, setRazaFiltro] = useState(TODAS)

  const especies = useMemo(
    () => Array.from(new Set(MOCK_MASCOTAS.map((m) => m.especie))).sort(),
    [],
  )

  const razas = useMemo(
    () => Array.from(new Set(MOCK_MASCOTAS.map((m) => m.raza))).sort(),
    [],
  )

  const mascotasFiltradas = useMemo(() => {
    const busquedaNormalizada = busqueda.trim().toLowerCase()

    return MOCK_MASCOTAS.filter((mascota) => {
      const coincideBusqueda =
        busquedaNormalizada.length === 0 ||
        mascota.mascota_nombre.toLowerCase().includes(busquedaNormalizada) ||
        mascota.cliente_nombre.toLowerCase().includes(busquedaNormalizada)

      const coincideEspecie = especieFiltro === TODAS || mascota.especie === especieFiltro
      const coincideRaza = razaFiltro === TODAS || mascota.raza === razaFiltro

      return coincideBusqueda && coincideEspecie && coincideRaza
    })
  }, [busqueda, especieFiltro, razaFiltro])

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Mascotas</h1>
        <p className="text-sm text-muted-foreground">
          Pacientes registrados y su historia clínica
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-72">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
            placeholder="Buscar por mascota o dueño..."
            className="pl-8"
          />
        </div>

        <Select
          value={especieFiltro}
          onValueChange={(valor) => setEspecieFiltro(valor ?? TODAS)}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Especie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODAS}>Todas las especies</SelectItem>
            {especies.map((especie) => (
              <SelectItem key={especie} value={especie}>
                {especie}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={razaFiltro}
          onValueChange={(valor) => setRazaFiltro(valor ?? TODAS)}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Raza" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODAS}>Todas las razas</SelectItem>
            {razas.map((raza) => (
              <SelectItem key={raza} value={raza}>
                {raza}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Mascota / Dueño</TableHead>
            <TableHead>Especie</TableHead>
            <TableHead>Raza</TableHead>
            <TableHead>Última Consulta</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-12 text-right">
              <span className="sr-only">Acciones</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mascotasFiltradas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                No se encontraron mascotas.
              </TableCell>
            </TableRow>
          ) : (
            mascotasFiltradas.map((mascota) => (
              <TableRow key={mascota.id}>
                <TableCell>
                  <Avatar size="sm">
                    <AvatarFallback>{iniciales(mascota.mascota_nombre)}</AvatarFallback>
                    {mascota.estado === 'activo' ? (
                      <AvatarBadge className="bg-green-500 text-white">
                        <CheckIcon />
                      </AvatarBadge>
                    ) : null}
                  </Avatar>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{mascota.mascota_nombre}</div>
                  <div className="text-xs text-muted-foreground">
                    {mascota.cliente_nombre} · {mascota.telefono}
                  </div>
                </TableCell>
                <TableCell>{mascota.especie}</TableCell>
                <TableCell>{mascota.raza}</TableCell>
                <TableCell className="text-muted-foreground">
                  {mascota.ultima_consulta}
                </TableCell>
                <TableCell>
                  <BadgeEstadoMascota estado={mascota.estado} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      className="bg-green-500 text-white hover:bg-green-600"
                    >
                      <MessageCircleIcon />
                      Wsp
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon-sm" aria-label="Acciones de la mascota">
                            <MoreVerticalIcon />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(rutaMascota(mascota.id))}>
                          <StethoscopeIcon />
                          Ver Historia Clínica
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(rutaEditarMascota(mascota.id))}>
                          <PencilIcon />
                          Editar Perfil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
