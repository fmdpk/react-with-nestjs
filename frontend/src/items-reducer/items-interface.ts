export type Action =
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'UPDATE_ITEM'; payload: Item }
  | { type: 'DELETE_ITEM'; payload: number }
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'SET_STATUS'; payload: 'pending' | 'in-progress' | 'completed' }
  | { type: 'SET_EDITING_ID'; payload: number | null }
  | {
      type: 'SET_FORM_DATA'
      payload: {
        title: string
        status: 'pending' | 'in-progress' | 'completed'
        editingId: number | null
      }
    }
  | { type: 'RESET_FORM' }

export interface Item {
  id: number
  title: string
  status: 'pending' | 'in-progress' | 'completed'
  createdAt: string
  updatedAt: string
  createdUser: string
}

export interface State {
  items: Item[]
  title: string
  status: 'pending' | 'in-progress' | 'completed'
  editingId: number | null
}
