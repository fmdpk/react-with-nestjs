import { useReducer, useState } from 'react'
import type { Item } from '../items-reducer/items-interface'
import { initialState, itemsReducer } from '../items-reducer/items-reducer'

export default function ItemsReducer() {
  const [state, dispatch] = useReducer(itemsReducer, initialState)
  const [nextId, setNextId] = useState(3)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!state.title.trim()) return

    if (state.editingId !== null) {
      // Update existing item
      const itemToUpdate = state.items.find(
        (item) => item.id === state.editingId,
      )
      if (itemToUpdate) {
        dispatch({
          type: 'UPDATE_ITEM',
          payload: {
            ...itemToUpdate,
            title: state.title,
            status: state.status,
            updatedAt: new Date().toISOString(),
          },
        })
      }
    } else {
      // Add new item
      const newItem: Item = {
        id: nextId,
        title: state.title,
        status: state.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdUser: 'You',
      }
      dispatch({ type: 'ADD_ITEM', payload: newItem })
      setNextId(nextId + 1)
    }

    dispatch({ type: 'RESET_FORM' })
  }

  const handleEdit = (item: Item) => {
    dispatch({
      type: 'SET_FORM_DATA',
      payload: {
        title: item.title,
        status: item.status,
        editingId: item.id,
      },
    })
  }

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    dispatch({ type: 'DELETE_ITEM', payload: id })
  }

  const handleCancel = () => {
    dispatch({ type: 'RESET_FORM' })
  }

  return (
    <div className='w-full bg-white rounded-2xl shadow-sm p-10'>
      <div>
        <h1 className='text-3xl font-bold mb-8'>
          Items Management (Local State)
        </h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className='bg-white p-6 rounded-xl shadow mb-8 space-y-4'
      >
        <input
          type='text'
          value={state.title}
          onChange={(e) =>
            dispatch({ type: 'SET_TITLE', payload: e.target.value })
          }
          placeholder='Item Title'
          className='border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          required
        />

        <select
          value={state.status}
          onChange={(e) =>
            dispatch({
              type: 'SET_STATUS',
              payload: e.target.value as
                | 'pending'
                | 'in-progress'
                | 'completed',
            })
          }
          className='border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          <option value='pending'>Pending</option>
          <option value='in-progress'>In Progress</option>
          <option value='completed'>Completed</option>
        </select>

        <div className='flex gap-3'>
          <button
            type='submit'
            className='bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition'
          >
            {state.editingId ? 'Update Item' : 'Create Item'}
          </button>

          {state.editingId && (
            <button
              type='button'
              onClick={handleCancel}
              className='bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition'
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Items List */}
      <div className='bg-white rounded-xl shadow'>
        {state.items.length === 0 ? (
          <p className='p-12 text-center text-gray-500'>
            No items found. Create your first item above.
          </p>
        ) : (
          state.items.map((item) => (
            <div
              key={item.id}
              className='border-b last:border-b-0 p-6 flex justify-between items-start hover:bg-gray-50'
            >
              <div>
                <h3 className='font-semibold text-lg'>{item.title}</h3>
                <div className='text-sm text-gray-500 mt-1 flex flex-col'>
                  <span className='font-medium'>
                    Created by {item.createdUser}
                  </span>
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                </div>
                <span
                  className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full
                  ${
                    item.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : item.status === 'in-progress'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className='flex gap-4 text-sm'>
                <button
                  onClick={() => handleEdit(item)}
                  className='text-blue-600 hover:text-blue-700 font-medium cursor-pointer'
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className='text-red-600 hover:text-red-700 font-medium cursor-pointer'
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
