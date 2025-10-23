// import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
// import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { HiOutlineExternalLink } from "react-icons/hi";
import { RiLogoutCircleFill } from "react-icons/ri";
import { FaUpload,FaProductHunt, FaCartPlus,FaLocationDot    } from "react-icons/fa6";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdCategory } from "react-icons/md";
import { CgImport, CgProfile } from "react-icons/cg";

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
          // console.log("logout",response)
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
    <div className='bg-blue-100'>
        {/* <div className='px-3 py-2 font-semibold'>My Account</div> */}
        <p className='flex row'>
        <Link onClick={handleClose} to={"/dashboard/profile"} className='hover:text-primay-200'>
          <CgProfile className="h-8 w-8 text-blue-500 border-2 border-blue-300 rounded-full p-1 ml-3" />
          </Link>
        <span className='max-w-52 text-ellipsis line-clamp-1 px-3 mt-2'>{user.name  || user.mobile}  <span className='text-medium text-red-600'>{user.role === "ADMIN" ? "(Admin)" : "" }</span></span>
          
          <Link onClick={handleClose} to={"/dashboard/profile"} className='hover:text-blue-900 mt-2'>
          <HiOutlineExternalLink className='mt-1'/>          </Link>
          </p>
        {/* <div className='text-sm ml-10 flex items-center gap-2'>
          <Link onClick={handleClose} to={"/dashboard/profile"} className='hover:text-primay-200'>
          <CgProfile className="h-10 w-10 text-blue-500 border-2 border-blue-300 rounded-full p-2" />
          </Link>
        </div>
        <p className='flex row'>
        <span className='max-w-52 text-ellipsis line-clamp-1 px-3'>{user.name  || user.mobile}  <span className='text-medium text-red-600'>{user.role === "ADMIN" ? "(Admin)" : "" }</span></span>
          
          <Link onClick={handleClose} to={"/dashboard/profile"} className='hover:text-blue-900'>
          <HiOutlineExternalLink className='mt-1'/>          </Link>
          </p>
        <hr className="border-b b/order-blue-900 mb-3 mt-3 mx-2" /> */}
          <hr className="border-b border-blue-900 mb-3 mt-3 mx-2" />
        <Divider/>

        <div className='px-3  text-sm grid gap-1'>
            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/category"} className='px-2 hover:bg-blue-200 py-1'><div className='flex'><BiSolidCategoryAlt className='mt-1'/> <p className='ml-2'>Category</p></div></Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/subcategory"} className='px-2 hover:bg-blue-200 py-1'><div className='flex'><MdCategory className='mt-1'/> <p className='ml-2'>Sub Category</p></div></Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/upload-product"} className='px-2 hover:bg-blue-200 py-1'><div className='flex'><FaUpload className='mt-1'/> <p className='ml-2'>Upload Product</p></div></Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/product"} className='px-2 hover:bg-blue-200 py-1'><div className='flex'><FaProductHunt className='mt-1'/> <p className='ml-2'>Product</p></div></Link>
              )
            }
            {isAdmin(user.role)?(
            <Link onClick={handleAllorders} to={"/dashboard/orders"} className='px-2 hover:bg-blue-200 py-1 text-align-center'><div className='flex'><FaCartPlus  className='mt-1'/> <p className='ml-2'>Orders</p></div></Link>
            ):(
            <Link onClick={handleApiCall} to={"/dashboard/myorders"} className='px-2 hover:bg-blue-200 py-1'><div className='flex'><FaCartPlus  className='mt-1'/> <p className='ml-2'>My Orders</p></div></Link>
            )}            
            <Link onClick={handleClose} to={"/dashboard/address"} className='px-2 hover:bg-blue-200 py-1'><div className='flex'><FaLocationDot  className='mt-1'/> <p className='ml-2'>Save Address</p></div></Link>
            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/dataImport"} className='px-2 hover:bg-blue-200 py-1'><div className='flex'><CgImport  className='mt-1'/> <p className='ml-2'>Data Import</p></div></Link>
              )
            }
            <button onClick={handleLogout} className='text-left px-2 hover:bg-blue-200 py-1'><div className='flex'><RiLogoutCircleFill  className='mt-1'/> <p className='ml-2'>Log out</p></div></button>
        </div>
    </div>
  )
}

export default UserMenu
