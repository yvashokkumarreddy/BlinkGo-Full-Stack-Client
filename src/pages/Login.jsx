import { useState } from 'react'
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6"
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { Link, useNavigate } from 'react-router-dom'
import fetchUserDetails from '../utils/fetchUserDetails'
import { useDispatch } from 'react-redux'
import { setUserDetails } from '../store/userSlice'

const Login = () => {
  const [data, setData] = useState({ email: '', password: '' ,org_id: 4})
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = ({ target: { name, value } }) => {
    setData(prev => ({ ...prev, [name]: value }))
  }

  const isValid = Object.values(data).every(Boolean)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data: res } = await Axios({ ...SummaryApi.login, data })

      if (res.error) return toast.error(res.message)

      toast.success(res.message)
      const { accesstoken, refreshToken } = res.data
      localStorage.setItem('accesstoken', accesstoken)
      localStorage.setItem('refreshToken', refreshToken)

      const userDetails = await fetchUserDetails()
      dispatch(setUserDetails(userDetails.data))
      navigate('/')
    } catch (err) {
      AxiosToastError(err)
    }
  }

  return (
    <section className='w-full container mx-auto px-2'>
      <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
        <form onSubmit={handleSubmit} className='grid gap-4 py-4'>
          <div className='grid gap-1'>
            <label htmlFor='email'>Email:</label>
            <input
              type='email'
              id='email'
              name='email'
              value={data.email}
              onChange={handleChange}
              className='bg-blue-50 p-2 border rounded outline-none focus:border-primary-200'
              placeholder='Enter your email'
              required
            />
          </div>
          <div className='grid gap-1'>
            <label htmlFor='password'>Password:</label>
            <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                name='password'
                value={data.password}
                onChange={handleChange}
                className='w-full outline-none bg-transparent'
                placeholder='Enter your password'
                required
              />
              <div
                onClick={() => setShowPassword(prev => !prev)}
                className='cursor-pointer'
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
            <Link to='/forgot-password' className='block ml-auto text-sm text-blue-700 hover:underline'>
              Forgot password?
            </Link>
          </div>

          <button
            disabled={!isValid}
            className={`${
              isValid ? 'bg-green-800 hover:bg-green-700' : 'bg-gray-500'
            } text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Login
          </button>
        </form>

        <p className='text-center'>
          Don not have an account?
          <Link to='/register' className='font-semibold text-green-700 hover:text-green-800'>
            Register
          </Link>
        </p>
      </div>
    </section>
  )
}

export default Login
