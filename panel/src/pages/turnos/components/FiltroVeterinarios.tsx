import { ChevronDownIcon, StethoscopeIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/** Multi-select por checkboxes — filtra la tabla por veterinario asignado. */
export function FiltroVeterinarios({
  veterinarios,
  seleccionados,
  onSeleccionadosChange,
}: {
  veterinarios: string[]
  seleccionados: string[]
  onSeleccionadosChange: (seleccionados: string[]) => void
}) {
  function alternar(veterinario: string, marcado: boolean) {
    onSeleccionadosChange(
      marcado
        ? [...seleccionados, veterinario]
        : seleccionados.filter((v) => v !== veterinario),
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline">
            <StethoscopeIcon />
            Filtrar por veterinario
            {seleccionados.length > 0 ? (
              <Badge variant="secondary" className="ml-0.5">
                {seleccionados.length}
              </Badge>
            ) : null}
            <ChevronDownIcon className="text-muted-foreground" />
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="min-w-56">
        <DropdownMenuLabel>Veterinarios</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {veterinarios.map((veterinario) => (
          <DropdownMenuCheckboxItem
            key={veterinario}
            checked={seleccionados.includes(veterinario)}
            onCheckedChange={(marcado) => alternar(veterinario, marcado === true)}
            onClick={(evento) => evento.preventDefault()}
          >
            {veterinario}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
