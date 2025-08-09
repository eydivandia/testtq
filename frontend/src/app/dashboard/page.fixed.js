'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import io from 'socket.io-client'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [projects, setProjects] = useState([])
  const [notifications, setNotifications] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [socket, setSocket] = useState(null)
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null

    if (!token) {
      router.push('/login')
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Connect to Socket.io
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://65.109.198.202:5000')
    setSocket(newSocket)

    // Listen for real-time updates
    newSocket.on('notification', (notification) => {
      setNotifications(prev => [notification, ...prev])
      showNotificationAlert(notification)
    })

    newSocket.on('project-created', (project) => {
      setProjects(prev => [project, ...prev])
    })

    newSocket.on('project-updated', (project) => {
      setProjects(prev => prev.map(p => p._id === project._id ? project : p))
    })

    fetchData()

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
      newSocket.close()
    }
  }, [router])

  const fetchData = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      if (!token) return

      // Fetch dashboard stats
      const statsRes = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://65.109.198.202:5000') + '/api/reports/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      // Fetch projects
      const projectsRes = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://65.109.198.202:5000') + '/api/projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (projectsRes.ok) {
        const projectsData = await projectsRes.json()
        setProjects(projectsData)
      }

      // Fetch notifications
      const notifRes = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://65.109.198.202:5000') + '/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (notifRes.ok) {
        const notifData = await notifRes.json()
        setNotifications(notifData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const showNotificationAlert = (notification) => {
    if (typeof window === 'undefined') return
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/icon.png'
      })
    }
  }

  const handleLogout = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) {
      await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://65.109.198.202:5000') + '/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
    }
    if (typeof window !== 'undefined') localStorage.clear()
    router.push('/login')
  }

  // --- UI below is kept minimal; you can overwrite with your styles ---
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>داشبورد</h1>
        <button onClick={handleLogout}>خروج</button>
      </div>

      <div style={{ marginTop: 16 }}>
        <div>تاریخ: {currentTime.toLocaleDateString('fa-IR')} - زمان: {currentTime.toLocaleTimeString('fa-IR')}</div>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>پروژه‌ها</h2>
        {projects.length === 0 ? (
          <div>هنوز پروژه‌ای ثبت نشده است</div>
        ) : (
          <ul>
            {projects.map(p => (
              <li key={p._id}>{p.projectName || p.projectCode}</li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>اعلان‌ها</h2>
        <ul>
          {notifications.map((n, i) => (
            <li key={n._id || i}>{n.title}: {n.message}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
