import { useEffect, useState } from 'react'
import { protectedApi } from '../utils/api'
import { useAuth } from '../hooks/useAuth'

interface Profile {
  UserId: number
  email: string
}

export default function Dashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const data = await protectedApi.getProfile()
        setProfile(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])
  return (
    <div className='min-h-screen bg-gray-50 w-full'>
      <div className='w-full bg-white rounded-2xl shadow-sm p-10'>
        <div>
          <h1 className='text-4xl font-bold mb-6'>Dashboard</h1>
        </div>

        {loading ? (
          <div className='flex justify-center py-8'>
            <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
          </div>
        ) : (
          <div>
            {profile && (
              <>
                <p className='text-xl'>
                  Welcome, <span className='font-semibold'>{user?.email}</span>
                </p>
                <pre className='mt-4 bg-gray-100 p-4 rounded'>
                  {JSON.stringify(profile, null, 2)}
                </pre>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
