'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token) {
      router.push('/login')
      return
    }
    
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.clear()
    router.push('/login')
  }

  if (loading) {
    return <div>در حال بارگذاری...</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1>داشبورد</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            background: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          خروج
        </button>
      </div>
      
      {user && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px'
        }}>
          <h2>خوش آمدید {user.fullName}</h2>
          <p>نقش: {user.role}</p>
        </div>
      )}
    </div>
  )
}
