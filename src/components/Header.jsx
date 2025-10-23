import { useEffect, useRef, useState } from 'react'
import logo from '../assets/logo.png'
import Search from './Search'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from '../hooks/useMobile';
import { BsCart4 } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from './UserMenu';
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import DisplayCartItem from './DisplayCartItem';
import isAdmin from '../utils/isAdmin';
import { RiLogoutCircleRFill } from "react-icons/ri";
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import { logout } from '../store/userSlice';
import axios from 'axios';
import AxiosToastError from '../utils/AxiosToastError';

const Header = () => {
  const [isMobile] = useMobile()
  const location = useLocation()
  const isSearchPage = location.pathname === "/search"
  const navigate = useNavigate()
   const dispatch = useDispatch()
  const user = useSelector((state) => state?.user)
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const cartItem = useSelector(state => state.cartItem.cart)
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalQty, setTotalQty] = useState(0)
  const [openCartSection, setOpenCartSection] = useState(false)

  const userMenuRef = useRef(null)

  const redirectToLoginPage = () => {
    navigate("/login")
  }

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false)
  }

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
  const handleMobileUser = () => {
    if (!user._id) {
      navigate("/login")
      return
    }
    navigate("/user")
  }

  // ✅ Close dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setOpenUserMenu(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  // ✅ total item and total price
  useEffect(() => {
    const qty = cartItem.reduce((preve, curr) => preve + curr.quantity, 0)
    setTotalQty(qty)

    const tPrice = cartItem.reduce((preve, curr) => {
      const priceAfterDiscount = pricewithDiscount(
        curr?.product?.price,
        curr?.product?.discount
      )
      return preve + priceAfterDiscount * curr.quantity
    }, 0)
    setTotalPrice(tPrice)
  }, [cartItem])

  return (
    <header className='h-16 lg:h-17 lg:shadow-md bg-blue-400 sticky top-0 z-40 flex flex-col p-2 justify-center gap-1 '>
      {
        !(isSearchPage && isMobile) && (
          <div className='container mx-auto flex items-center px-2 justify-between'>
            {/* Logo */}
            <div className='h-full'>
              <Link to={"/"} className='h-full flex justify-center items-center'>
                <img
                  src={logo}
                  width={130}
                  height={50}
                  alt='logo'
                  className='hidden lg:block p-2 pt-3'
                />
                <img
                  src={logo}
                  width={110}
                  height={50}
                  alt='logo'
                  className='lg:hidden'
                />
              </Link>
            </div>

            {/* Search */}
            <div className='hidden lg:block'>
              <Search />
            </div>

            {/* Login / Cart */}
            <div>
              {/* Mobile user icon */}
              <button className='text-neutral-600 lg:hidden' onClick={handleMobileUser}>
                <FaRegCircleUser size={26} />
              </button>

              {/* Desktop */}
              <div className='hidden lg:flex items-center gap-10'>
                {
                  user?.user_id ? (
                    <div className='relative' ref={userMenuRef}>
                      <div
                        onClick={() => setOpenUserMenu(prev => !prev)}
                        className='flex select-none items-center gap-1 cursor-pointer'
                      >
                        <p>Account</p>
                        {
                          openUserMenu
                            ? <GoTriangleUp size={25} />
                            : <GoTriangleDown size={25} />
                        }
                      </div>
                      {
                        openUserMenu && (
                          <div className='absolute right-0 top-12'>
                            <div className='bg-blue-100 rounded p-4 min-w-52 lg:shadow-lg'>
                              <UserMenu close={handleCloseUserMenu} />
                            </div>
                          </div>
                        )
                      }
                    </div>
                  ) : (
                    <button onClick={redirectToLoginPage} className='text-lg px-2'>Login</button>
                  )
                }

                {/* Cart */}
               {!isAdmin(user.role) ? (
                <button
                  onClick={() => setOpenCartSection(true)}
                  className='flex items-center gap-2 bg-green-800 hover:bg-green-700 px-3 py-2 rounded text-white'
                >
                  <div className='animate-bounce'>
                    <BsCart4 size={26} />
                  </div>
                  <div className='font-semibold text-sm'>
                    {
                      cartItem[0] ? (
                        <div>
                          <p>{totalQty} Items</p>
                          <p>{DisplayPriceInRupees(totalPrice)}</p>
                        </div>
                      ) : (
                        <p>My Cart</p>
                      )
                    }
                  </div>
                </button>
               ):(<button
                  onClick={handleLogout}
                  className='flex items-center gap-2 bg-green-800 hover:bg-green-700 px-3 py-2 rounded text-white'
                >
                  <div className='font-semibold text-sm'>
                    {
                     <p>LogOut</p> 
                    }
                  </div>
                  <div className='animate-bounce'>
                    <RiLogoutCircleRFill  size={26} />
                  </div>
                </button>)
               }
              </div>
            </div>
          </div>
        )
      }

      <div className='container mx-auto px-2 lg:hidden'>
        <Search />
      </div>

      {openCartSection &&  (
        <DisplayCartItem close={() => setOpenCartSection(false)} />
      )}
    </header>
  )
}

export default Header
