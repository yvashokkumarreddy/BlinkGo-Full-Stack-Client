// src/pages/Dashboard.jsx
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const user = useSelector((state) => state.user)

  console.log("user dashboard:", user)

  return (
    <section className="bg-white">
      <div className="container mx-auto p-3 grid lg:grid-cols-[250px,1fr] gap-4">
        
        {/* Left Sidebar Menu */}
        <aside className="py-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto hidden lg:block border-r bg-gray-50 rounded-lg">
          <UserMenu />
        </aside>

        {/* Right Content Area */}
        <main className="bg-white min-h-[75vh] p-4 rounded-lg shadow-sm">
          <Outlet />
        </main>
      </div>
    </section>
  )
}

export default Dashboard
