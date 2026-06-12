import { useCallback, useMemo, useReducer, type ReactNode } from 'react'
import itemsJson from '../data/items.json'
import { ItemsContext } from './ItemsContext'

export type ItemStatus = 'pending' | 'in-progress' | 'completed'

export interface Item {
  id: number
  title: string
  status: ItemStatus
  createdAt: string
  updatedAt: string
  createdUser: string
}

export interface ItemsState {
  items: Item[]
  title: string
  status: ItemStatus
  editingId: number | null
  loading: boolean
  error: string | null
}

type ItemsAction =
  | { type: 'SET_ITEMS'; payload: Item[] }
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'SET_STATUS'; payload: ItemStatus }
  | { type: 'SET_EDITING_ID'; payload: number | null }
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'UPDATE_ITEM'; payload: Item }
  | { type: 'DELETE_ITEM'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_FORM' }

const initialState: ItemsState = {
  items: itemsJson as Item[],
  title: '',
  status: 'pending',
  editingId: null,
  loading: false,
  error: null,
}

function itemsReducer(state: ItemsState, action: ItemsAction): ItemsState {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload }
    case 'SET_TITLE':
      return { ...state, title: action.payload }
    case 'SET_STATUS':
      return { ...state, status: action.payload }
    case 'SET_EDITING_ID':
      return { ...state, editingId: action.payload }
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] }
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        ),
      }
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'RESET_FORM':
      return {
        ...state,
        title: '',
        status: 'pending',
        editingId: null,
      }
    default:
      return state
  }
}

export function ItemsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(itemsReducer, initialState)

  const setTitle = useCallback((value: string) => {
    dispatch({ type: 'SET_TITLE', payload: value })
  }, [])

  const setStatus = useCallback((value: ItemStatus) => {
    dispatch({ type: 'SET_STATUS', payload: value })
  }, [])

  const startEditing = useCallback((item: Item) => {
    dispatch({ type: 'SET_TITLE', payload: item.title })
    dispatch({ type: 'SET_STATUS', payload: item.status })
    dispatch({ type: 'SET_EDITING_ID', payload: item.id })
  }, [])

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' })
    dispatch({ type: 'SET_ERROR', payload: null })
  }, [])

  const setLoading = useCallback((value: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: value })
  }, [])

  const setError = useCallback((value: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: value })
  }, [])

  const submitItem = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const title = state.title.trim()
      if (!title) return

      setError(null)
      setLoading(true)

      try {
        if (state.editingId !== null) {
          const existingItem = state.items.find(
            (item) => item.id === state.editingId,
          )
          if (!existingItem) {
            throw new Error('Item not found')
          }

          const updatedItem: Item = {
            ...existingItem,
            title,
            status: state.status,
            updatedAt: new Date().toISOString(),
          }

          dispatch({ type: 'UPDATE_ITEM', payload: updatedItem })
        } else {
          const newId = state.items.length
            ? Math.max(...state.items.map((item) => item.id)) + 1
            : 1
          const timestamp = new Date().toISOString()
          const newItem: Item = {
            id: newId,
            title,
            status: state.status,
            createdAt: timestamp,
            updatedAt: timestamp,
            createdUser: 'You',
          }

          dispatch({ type: 'ADD_ITEM', payload: newItem })
        }

        dispatch({ type: 'RESET_FORM' })
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unable to save item')
      } finally {
        setLoading(false)
      }
    },
    [state, setError, setLoading],
  )

  const deleteItem = useCallback(
    async (id: number) => {
      setError(null)
      setLoading(true)

      try {
        if (confirm('Are you sure you want to delete this item?'))
          dispatch({ type: 'DELETE_ITEM', payload: id })
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Unable to delete item',
        )
      } finally {
        setLoading(false)
      }
    },
    [setError, setLoading],
  )

  const value = useMemo(
    () => ({
      items: state.items,
      title: state.title,
      status: state.status,
      editingId: state.editingId,
      loading: state.loading,
      error: state.error,
      setTitle,
      setStatus,
      startEditing,
      resetForm,
      submitItem,
      deleteItem,
    }),
    [
      state.items,
      state.title,
      state.status,
      state.editingId,
      state.loading,
      state.error,
      setTitle,
      setStatus,
      startEditing,
      resetForm,
      submitItem,
      deleteItem,
    ],
  )

  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>
}
