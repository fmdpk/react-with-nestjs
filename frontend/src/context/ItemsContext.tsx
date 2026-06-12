import { createContext } from 'react'
import type { Item, ItemStatus } from './ItemsProvider'

interface ItemsContextType {
  items: Item[]
  title: string
  status: ItemStatus
  editingId: number | null
  loading: boolean
  error: string | null
  setTitle: (value: string) => void
  setStatus: (value: ItemStatus) => void
  startEditing: (item: Item) => void
  resetForm: () => void
  submitItem: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
  deleteItem: (id: number) => Promise<void>
}

export const ItemsContext = createContext<ItemsContextType | undefined>(
  undefined,
)
