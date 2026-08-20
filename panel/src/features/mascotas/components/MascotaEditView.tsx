import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { SaveIcon, XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { MASCOTAS_EDICION_MOCK, MASCOTA_EDICION_POR_DEFECTO } from '../data/mockMascotasEdicion'
import { RUTAS } from '@/routes/paths'
import type { MascotaFormValues } from '../types'

/**
 * Formulario de edición del perfil. Mock-only: no hay `service` todavía que
 * haga el `update` real contra Supabase — "Guardar Cambios" solo loguea el
 * payload y vuelve al listado. Cuando el schema esté cerrado, esto pasa a
 * precargar con `obtenerMascota(id)` y guardar con `actualizarMascota(id, valores)`.
 */
export function MascotaEditView() {
  const navigate = useNavigate()
  const { mascotaId } = useParams()

  const [valores, setValores] = useState<MascotaFormValues>(
    () => (mascotaId && MASCOTAS_EDICION_MOCK[mascotaId]) || MASCOTA_EDICION_POR_DEFECTO,
  )

  function actualizarCampo<Campo extends keyof MascotaFormValues>(
    campo: Campo,
    valor: MascotaFormValues[Campo],
  ) {
    setValores((actuales) => ({ ...actuales, [campo]: valor }))
  }

  function handleGuardar() {
    const payload = {
      id: mascotaId,
      ...valores,
      peso: Number(valores.peso),
    }
    console.log('Payload de edición de mascota:', payload)
    navigate(RUTAS.mascotas)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Editar perfil</h1>
        <p className="text-sm text-muted-foreground">
          Mascota #{mascotaId} · los cambios todavía no se guardan en la base de datos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos del paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={valores.nombre}
                onChange={(evento) => actualizarCampo('nombre', evento.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="raza">Raza</Label>
              <Input
                id="raza"
                value={valores.raza}
                onChange={(evento) => actualizarCampo('raza', evento.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="especie">Especie</Label>
              <Select
                value={valores.especie}
                onValueChange={(valor) =>
                  actualizarCampo('especie', (valor ?? 'canino') as MascotaFormValues['especie'])
                }
              >
                <SelectTrigger id="especie" className="w-full">
                  <SelectValue placeholder="Especie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="canino">Canino</SelectItem>
                  <SelectItem value="felino">Felino</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sexo">Sexo</Label>
              <Select
                value={valores.sexo}
                onValueChange={(valor) =>
                  actualizarCampo('sexo', (valor ?? 'macho') as MascotaFormValues['sexo'])
                }
              >
                <SelectTrigger id="sexo" className="w-full">
                  <SelectValue placeholder="Sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="macho">Macho</SelectItem>
                  <SelectItem value="hembra">Hembra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input
                id="peso"
                type="number"
                step="0.1"
                min="0"
                value={valores.peso}
                onChange={(evento) => actualizarCampo('peso', evento.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={valores.estado}
                onValueChange={(valor) =>
                  actualizarCampo('estado', (valor ?? 'activo') as MascotaFormValues['estado'])
                }
              >
                <SelectTrigger id="estado" className="w-full">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="fallecido">Fallecido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2.5 sm:col-span-2">
              <Switch
                id="esterilizado"
                checked={valores.esterilizado}
                onCheckedChange={(marcado) => actualizarCampo('esterilizado', marcado)}
              />
              <Label htmlFor="esterilizado">
                Esterilizado {valores.esterilizado ? '(Sí)' : '(No)'}
              </Label>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="notas_generales">Notas generales</Label>
              <Textarea
                id="notas_generales"
                placeholder="Alergias, condiciones crónicas, indicaciones de manejo..."
                value={valores.notas_generales}
                onChange={(evento) => actualizarCampo('notas_generales', evento.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2 bg-transparent">
          <Button variant="outline" onClick={() => navigate(RUTAS.mascotas)}>
            <XIcon />
            Cancelar
          </Button>
          <Button onClick={handleGuardar}>
            <SaveIcon />
            Guardar Cambios
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
