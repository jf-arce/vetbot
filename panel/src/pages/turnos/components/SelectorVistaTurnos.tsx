import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export type VistaTurnos = 'lista' | 'calendario' | 'timeline'

export function SelectorVistaTurnos({
  vista,
  onVistaChange,
}: {
  vista: VistaTurnos
  onVistaChange: (vista: VistaTurnos) => void
}) {
  return (
    <Tabs value={vista} onValueChange={(valor) => onVistaChange(valor as VistaTurnos)}>
      <TabsList>
        <TabsTrigger value="lista">Lista</TabsTrigger>
        <TabsTrigger value="calendario">Calendario</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
