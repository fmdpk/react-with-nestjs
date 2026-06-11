import { useCallback, useReducer, useState } from 'react'
import itemsJson from '../data/items.json'

export type ItemStatus = 'pending' | 'in-progress' | 'completed'

export interface Item {
  id: number
  title: string
  status: ItemStatus
  createdAt: string
  updatedAt: string
  createdUser: string
}

interface ItemsState {
  items: Item[]
  title: string
  status: ItemStatus
  editingId: number | null
}

type ItemsAction =
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'UPDATE_ITEM'; payload: Item }
  | { type: 'DELETE_ITEM'; payload: number }
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'SET_STATUS'; payload: ItemStatus }
  | {
      type: 'SET_FORM_DATA'
      payload: {
        title: string
        status: ItemStatus
        editingId: number | null
      }
    }
  | { type: 'RESET_FORM' }

const initialState: ItemsState = {
  items: itemsJson as Item[],
  title: '',
  status: 'pending',
  editingId: null,
}

function itemsReducer(state: ItemsState, action: ItemsAction): ItemsState {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload],
      }
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
    case 'SET_TITLE':
      return {
        ...state,
        title: action.payload,
      }
    case 'SET_STATUS':
      return {
        ...state,
        status: action.payload,
      }
    case 'SET_FORM_DATA':
      return {
        ...state,
        title: action.payload.title,
        status: action.payload.status,
        editingId: action.payload.editingId,
      }
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

function createNewItem(id: number, title: string, status: ItemStatus): Item {
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

export function useItemsReducer() {
  const [state, dispatch] = useReducer(itemsReducer, initialState)
  const [nextId, setNextId] = useState(3)

  const setTitle = useCallback((title: string) => {
    dispatch({ type: 'SET_TITLE', payload: title })
  }, [])

  const setStatus = useCallback((status: ItemStatus) => {
    dispatch({ type: 'SET_STATUS', payload: status })
  }, [])

  const startEditing = useCallback((item: Item) => {
    dispatch({
      type: 'SET_FORM_DATA',
      payload: {
        title: item.title,
        status: item.status,
        editingId: item.id,
      },
    })
  }, [])

  const deleteItem = useCallback((id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    dispatch({ type: 'DELETE_ITEM', payload: id })
  }, [])

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' })
  }, [])

  const submitItem = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const title = state.title.trim()
      if (!title) return

      if (state.editingId !== null) {
        const existingItem = state.items.find(
          (item) => item.id === state.editingId,
        )

        if (existingItem) {
          dispatch({
            type: 'UPDATE_ITEM',
            payload: {
              ...existingItem,
              title,
              status: state.status,
              updatedAt: new Date().toISOString(),
            },
          })
        }
      } else {
        dispatch({
          type: 'ADD_ITEM',
          payload: createNewItem(nextId, title, state.status),
        })
        setNextId((current) => current + 1)
      }

      dispatch({ type: 'RESET_FORM' })
    },
    [nextId, state],
  )

  return {
    state,
    setTitle,
    setStatus,
    submitItem,
    startEditing,
    deleteItem,
    resetForm,
  }
}
