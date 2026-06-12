import type { Item } from '../context/ItemsProvider'
import { useItemsContext } from '../hooks/useItems'
import {
  getBadgeClasses,
  statusOptions,
  type StatusOption,
} from '../utils/getBadgeClass'

export default function ItemsContextPage() {
  const {
    items,
    title,
    status,
    editingId,
    loading,
    error,
    setTitle,
    setStatus,
    startEditing,
    resetForm,
    submitItem,
    deleteItem,
  } = useItemsContext()

  return (
    <div className='w-full bg-white rounded-2xl shadow-sm p-10'>
      <h1 className='text-3xl font-bold mb-8'>
        Items Management (Context Local)
      </h1>

      <form
        onSubmit={submitItem}
        className='bg-white p-6 rounded-xl shadow mb-8 space-y-4'
      >
        {error && <div className='text-red-600 font-medium'>{error}</div>}

        <input
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Item Title'
          className='border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          required
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusOption)}
          className='border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className='flex gap-3'>
          <button
            type='submit'
            className='bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition'
          >
            {editingId ? 'Update Item' : 'Create Item'}
          </button>
          {editingId && (
            <button
              type='button'
              onClick={resetForm}
              className='bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition'
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className='bg-white rounded-xl shadow'>
        {loading ? (
          <p className='p-12 text-center text-gray-500'>Saving changes...</p>
        ) : items.length === 0 ? (
          <p className='p-12 text-center text-gray-500'>
            No items found. Create your first item above.
          </p>
        ) : (
          items.map((item: Item) => (
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
                  className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${getBadgeClasses(
                    item.status,
                  )}`}
                >
                  {item.status}
                </span>
              </div>
              <div className='flex gap-4 text-sm'>
                <button
                  type='button'
                  onClick={() => startEditing(item)}
                  className='text-blue-600 hover:text-blue-700 font-medium cursor-pointer'
                >
                  Edit
                </button>
                <button
                  type='button'
                  onClick={() => deleteItem(item.id)}
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
