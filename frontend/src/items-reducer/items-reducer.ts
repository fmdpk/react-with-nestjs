import type { Action, State } from './items-interface'

export const initialState: State = {
  items: [
    {
      id: 1,
      title: 'Sample Task 1',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdUser: 'You',
    },
    {
      id: 2,
      title: 'Sample Task 2',
      status: 'in-progress',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      createdUser: 'You',
    },
  ],
  title: '',
  status: 'pending',
  editingId: null,
}

export function itemsReducer(state: State, action: Action): State {
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

    case 'SET_EDITING_ID':
      return {
        ...state,
        editingId: action.payload,
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
