import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';
import Avatar from '../components/Avatar';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../redux/userSlice';
import { Eye, EyeOff, Lock } from 'lucide-react';
import AuthImagePattern from '../layout/AuthImagePattern';
import loginimg from "../assets/login.png";

const CheckPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    password: "",
    userId: ""
  })
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!location?.state?.name) {
      navigate('/email')
    }
  }, [])

  const handleOnChange = (e) => {
    const { name, value } = e.target

    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/password`

    try {
      const response = await axios({
        method: 'post',
        url: URL,
        data: {
          userId: location?.state?._id,
          password: data.password
        },
        withCredentials: true
      })

      toast.success(response.data.message)

      if (response.data.success) {
        dispatch(setToken(response?.data?.token))
        localStorage.setItem('token', response?.data?.token)

        setData({
          password: "",
        })
        navigate('/')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }


  return (
    <>
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-800 ">
        {/* LEFT SIDE FORM  */}
        <div className="flex flex-col mt-20 items-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* LOGO & HEADING */}
            <div className="flex flex-col items-center mb-10">

              <h1 className="text-transparent text-4xl font-bold mt-4 bg-clip-text bg-linear-to-r from-red-300 to-gray-300">Welcome Back</h1>
              <p className="text-slate-200 text-sm mt-2">Sign in to your account</p>
            </div>

            <div className='w-fit mx-auto mb-2 flex justify-center items-center flex-col'>
              {/* <PiUserCircle
                  size={80}
                /> */}
              <Avatar
                width={70}
                height={70}
                name={location?.state?.name}
                imageUrl={location?.state?.profile_pic}
              />
              <h2 className='font-semibold text-lg mt-1 font-serif text-transparent bg-clip-text text-[25px] bg-linear-to-r from-yellow-300 to-cyan-300'>{location?.state?.name}</h2>
            </div>

            <form className='grid gap-4 mt-3' onSubmit={handleSubmit}>


              <div className='flex flex-col gap-1'>
                <label htmlFor='password' className="block text-sm font-medium text-slate-50 mb-1">Password :</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id='password'
                    name='password'
                    placeholder='enter your password'
                    className='w-full border bg-gray-200 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-red-300 text-slate-900'
                    value={data.password}
                    onChange={handleOnChange}
                    required
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {
                      showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )
                    }

                  </button>
                </div>

              </div>


              <button
                className="w-full bg-linear-to-r from-cyan-300 to-cyan-950 hover:bg-slate-900 active:scale-95 active:bg-gray-950 text-gray-50 font-serif text-[20px] py-2 rounded-md transition duration-200 flex justify-center items-center gap-2"
              >
                Let's go...
              </button>


            </form>


            <div className="mt-6 text-center">
              <p className="text-sm text-slate-300">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="text-cyan-400 hover:underline">
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>


        {/* RIGHT SIDE - PATTERN */}
        <AuthImagePattern title={"Connect Anytime! Anywhere!"} subtitle={"Sign into continue your conversation and catch up with your messages."} img={loginimg} />

      </div>
    </>

  )
}

export default CheckPasswordPage
