import type { MascotaFormValues } from '../types'

/**
 * Mock temporal para precargar el formulario de edición — el mock de
 * `MascotasListView` solo trae las columnas que muestra la tabla, no el
 * perfil completo. Reemplazar por `obtenerMascota(id)` de
 * `services/mascotas.ts` cuando el schema esté cerrado.
 *
 * Las claves usan los mismos `id` que `MOCK_MASCOTAS` en `MascotasListView`
 * para que navegar lista → editar muestre datos coherentes.
 */
export const MASCOTAS_EDICION_MOCK: Record<string, MascotaFormValues> = {
  '1': {
    nombre: 'Firulais',
    especie: 'canino',
    raza: 'Labrador',
    peso: '28.4',
    sexo: 'macho',
    esterilizado: true,
    estado: 'activo',
    notas_generales: '',
  },
  '2': {
    nombre: 'Michi',
    especie: 'felino',
    raza: 'Siamés',
    peso: '4.1',
    sexo: 'hembra',
    esterilizado: true,
    estado: 'activo',
    notas_generales: 'Alérgica a la penicilina.',
  },
  '3': {
    nombre: 'Rocky',
    especie: 'canino',
    raza: 'Bulldog Francés',
    peso: '12.5',
    sexo: 'macho',
    esterilizado: true,
    estado: 'activo',
    notas_generales:
      'Raza braquicéfala — propenso a dificultad respiratoria con calor o esfuerzo. Alérgico a la amoxicilina.',
  },
  '4': {
    nombre: 'Luna',
    especie: 'felino',
    raza: 'Común Europeo',
    peso: '3.8',
    sexo: 'hembra',
    esterilizado: false,
    estado: 'activo',
    notas_generales: '',
  },
  '5': {
    nombre: 'Toby',
    especie: 'canino',
    raza: 'Caniche',
    peso: '7.2',
    sexo: 'macho',
    esterilizado: true,
    estado: 'fallecido',
    notas_generales: '',
  },
  '6': {
    nombre: 'Coco',
    especie: 'otro',
    raza: 'Cacatúa',
    peso: '0.4',
    sexo: 'macho',
    esterilizado: false,
    estado: 'activo',
    notas_generales: '',
  },
  '7': {
    nombre: 'Max',
    especie: 'canino',
    raza: 'Labrador',
    peso: '30.1',
    sexo: 'macho',
    esterilizado: false,
    estado: 'activo',
    notas_generales: 'Displasia de cadera leve — evitar ejercicio de alto impacto.',
  },
  '8': {
    nombre: 'Nube',
    especie: 'felino',
    raza: 'Persa',
    peso: '4.6',
    sexo: 'hembra',
    esterilizado: true,
    estado: 'fallecido',
    notas_generales: '',
  },
}

export const MASCOTA_EDICION_POR_DEFECTO: MascotaFormValues = {
  nombre: '',
  especie: 'canino',
  raza: '',
  peso: '',
  sexo: 'macho',
  esterilizado: false,
  estado: 'activo',
  notas_generales: '',
}
