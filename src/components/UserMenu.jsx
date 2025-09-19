// import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { HiOutlineExternalLink } from "react-icons/hi";
import isAdmin from '../utils/isAdmin'
import axios from 'axios'
import { useGlobalContext } from '../provider/GlobalProvider'

const UserMenu = ({close}) => {
   const user = useSelector((state)=> state.user)
   const dispatch = useDispatch()
   const { fetchOrder, fetchAllOrders } = useGlobalContext()
   const navigate = useNavigate()

   const handleLogout = async()=>{
        try {
          const response = await Axios({
             ...SummaryApi.logout
          })
          console.log("logout",response)
          if(response.data.success){
            if(close){
              close()
            }
            dispatch(logout())
            localStorage.clear()
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
             axios.defaults.headers.common['Authorization'] = '';
            window.location.href = "/login";
          }
        } catch (error) {
          console.log(error)
          AxiosToastError(error)
        }
   }

   const handleClose = ()=>{
      if(close){
        close()
      }
      }
      const handleApiCall = ()=>{
        if(close){
        close()
      }
      fetchOrder()
   }
   const handleAllorders = ()=>{
        if(close){
        close()
      }
       fetchAllOrders()
    }
  return (
    <div>
        <div className='px-3 font-semibold'>My Account</div>
        <div className='text-sm flex items-center gap-2'>
          <span className='max-w-52 text-ellipsis line-clamp-1 px-3'>{user.name || user.mobile} <span className='text-medium text-red-600'>{user.role === "ADMIN" ? "(Admin)" : "" }</span></span>
          <Link onClick={handleClose} to={"/dashboard/profile"} className='hover:text-primary-200'>
            <HiOutlineExternalLink size={15}/>
          </Link>
        </div>

        <Divider/>

        <div className='px-3 hover:bg-blue text-sm grid gap-1'>
            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/category"} className='px-2 hover:bg-orange-200 py-1'>Category</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/subcategory"} className='px-2 hover:bg-orange-200 py-1'>Sub Category</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/upload-product"} className='px-2 hover:bg-orange-200 py-1'>Upload Product</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/product"} className='px-2 hover:bg-orange-200 py-1'>Product</Link>
              )
            }
            {isAdmin(user.role)?(
            <Link onClick={handleAllorders} to={"/dashboard/orders"} className='px-2 hover:bg-orange-200 py-1'>Orders</Link>
            ):(
            <Link onClick={handleApiCall} to={"/dashboard/myorders"} className='px-2 hover:bg-orange-200 py-1'>My Orders</Link>
            )}            
            <Link onClick={handleClose} to={"/dashboard/address"} className='px-2 hover:bg-orange-200 py-1'>Save Address</Link>

            <button onClick={handleLogout} className='text-left px-2 hover:bg-orange-200 py-1'>Log Out</button>
            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/dataImport"} className='px-2 hover:bg-orange-200 py-1'>Data Import</Link>
              )
            }
        </div>
    </div>
  )
}

export default UserMenu
