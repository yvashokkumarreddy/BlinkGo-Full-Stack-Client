// src/pages/Dashboard.jsx
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const user = useSelector((state) => state.user)

  console.log("user dashboard:", user)

  return (
    <section className="bg-blue-200">
      <div className="container mx-auto p-3 grid lg:grid-cols-[250px,1fr] gap-4">
        
        {/* Left Sidebar Menu */}
        <aside className="sticky top-20 h-[calc(100vh-96px)] hidden lg:block border-r bg-blue-100 rounded-lg overflow-y-auto">
          <UserMenu />
        </aside>

        {/* Right Content Area */}
        <main className="bg-blue-100 min-h-[75vh] p-4 rounded-lg shadow-sm">
          <Outlet />
        </main>
      </div>
    </section>
  )
}

export default Dashboard
