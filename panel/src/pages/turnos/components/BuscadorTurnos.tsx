import { SearchIcon } from 'lucide-react'

import { Input } from '@/components/ui/input'

export function BuscadorTurnos({
  valor,
  onValorChange,
}: {
  valor: string
  onValorChange: (valor: string) => void
}) {
  return (
    <div className="relative w-full sm:w-72">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={valor}
        onChange={(evento) => onValorChange(evento.target.value)}
        placeholder="Buscar paciente, dueño, veterinario..."
        className="pl-8"
      />
    </div>
  )
}
