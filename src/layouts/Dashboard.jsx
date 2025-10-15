// src/pages/Dashboard.jsx
import UserMenu from '../components/UserMenu'
import { Link, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CgProfile } from 'react-icons/cg'
import { HiOutlineExternalLink } from 'react-icons/hi'

const Dashboard = () => {
  const user = useSelector((state) => state.user)

  console.log("user dashboard:", user)
  const handleClose = ()=>{
      if(close){
        close()
      }
      }
  return (
    <section className="bg-blue-200">
      <div className="container mx-3  p-2 grid lg:grid-cols-[250px,1fr] gap-4">
        
        {/* Left Sidebar Menu */}
        <aside className="sticky mx-4 top-10 h-[calc(100vh-96px)] hidden lg:block border-r bg-blue-100 rounded-lg overflow-y-auto">
          <div className='px-3 py-2 font-semibold'>My Account</div>
          <div className='text-sm ml-10 flex items-center gap-2'>
          {/* <Link onClick={handleClose} to={"/dashboard/profile"} className='hover:text-primay-200'>
          <CgProfile className="h-10 w-10 text-blue-500 border-2 border-blue-300 rounded-full p-2" />
          </Link> */}
        </div>
        {/* <p className='flex row'>
        <span className='max-w-52 text-ellipsis line-clamp-1 px-3'>{user.name  || user.mobile}  <span className='text-medium text-red-600'>{user.role === "ADMIN" ? "(Admin)" : "" }</span></span>
          
          <Link onClick={handleClose} to={"/dashboard/profile"} className='hover:text-blue-900'>
          <HiOutlineExternalLink className='mt-1'/>          </Link>
          </p> */}
        
          <UserMenu />
          
        </aside>

        {/* Right Content Area */}
        <main className="bg-blue-100 w-100 min-h-[75vh] p-4 rounded-lg shadow-sm">
          <Outlet />
        </main>
      </div>
    </section>
  )
}

export default Dashboard
