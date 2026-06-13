import type { Item, ItemStatus } from '../hooks/useItemsReducer'

export function createNewItem(
  id: number,
  title: string,
  status: ItemStatus,
): Item {
  const timestamp = new Date().toISOString()

  return {
    id,
    title,
    status,
    createdAt: timestamp,
    updatedAt: timestamp,
    createdUser: 'You',
  }
}
