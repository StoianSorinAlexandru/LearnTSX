export type Declaration = {
  id: string
  clientId: string
  clientName: string
  type: "D300" | "D390" | "SAF-T"
  deadline: string
  submitted: boolean
}

export type Client = {
  id: string
  name: string
  cui: string
  email: string
  isActive: boolean
}

export const mockClients: Client[] = [
  { id: "1", name: "Contabilitate SRL", cui: "RO12345678", email: "contact@contabilitate.ro", isActive: true },
  { id: "2", name: "Audit Expert SRL", cui: "RO87654321", email: "office@auditexpert.ro", isActive: true },
  { id: "3", name: "Taxe & Co SRL", cui: "RO11111111", email: "taxe@taxeco.ro", isActive: false },
  { id: "4", name: "Expert Cont SRL", cui: "RO22222222", email: "info@expertcont.ro", isActive: true },
  { id: "5", name: "Fiscalitate SRL", cui: "RO33333333", email: "contact@fiscalitate.ro", isActive: true },
]

export const mockDeclarations: Declaration[] = [
  { id: "1", clientId: "1", clientName: "Contabilitate SRL", type: "D300", deadline: "2026-01-25", submitted: true },
  { id: "2", clientId: "2", clientName: "Audit Expert SRL", type: "SAF-T", deadline: "2026-01-31", submitted: false },
  { id: "3", clientId: "3", clientName: "Taxe & Co SRL", type: "D390", deadline: "2026-01-25", submitted: false },
  { id: "4", clientId: "1", clientName: "Contabilitate SRL", type: "SAF-T", deadline: "2026-01-31", submitted: true },
  { id: "5", clientId: "4", clientName: "Expert Cont SRL", type: "D300", deadline: "2025-12-25", submitted: false },
  { id: "6", clientId: "5", clientName: "Fiscalitate SRL", type: "D390", deadline: "2025-11-30", submitted: false },
  { id: "7", clientId: "2", clientName: "Audit Expert SRL", type: "D300", deadline: "2026-02-25", submitted: false },
  { id: "8", clientId: "4", clientName: "Expert Cont SRL", type: "D390", deadline: "2026-02-28", submitted: true },
]