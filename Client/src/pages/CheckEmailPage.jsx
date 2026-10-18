import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';
import { PiUserCircle } from "react-icons/pi";
import { Mail, MessageSquare } from "lucide-react";
import AuthImagePattern from '../layout/AuthImagePattern';
import loginimg from "../assets/login.png";

const CheckEmailPage = () => {
  const [data, setData] = useState({
    email: "",
  })
  const navigate = useNavigate()

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

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/email`

    try {
      const response = await axios.post(URL, data)

      toast.success(response.data.message)

      if (response.data.success) {
        setData({
          email: "",
        })
        navigate('/password', {
          state: response?.data?.data
        })
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
              <div className="bg-linear-to-r from-red-300 to-gray-300 p-3 rounded-lg">
                <MessageSquare className="text-slate-800 w-6 h-6" />
              </div>
              <h1 className="text-transparent text-4xl font-bold mt-4 bg-clip-text bg-linear-to-r from-red-300 to-gray-300">Welcome Back</h1>
              <p className="text-slate-200 text-sm mt-2">Sign in to your account</p>
            </div>

            <p className='mt-10 flex justify-center items-center'>
              <span className=" bg-white/20 text-white text-center backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border bg-linear-to-r from-gray-500 to-cyan-950 border-white/20">Welcome to Nityansh Chat_World</span>
            </p>

            <form className='grid gap-4 mt-3' onSubmit={handleSubmit}>


              <div className="block text-sm font-medium text-slate-50 mb-1">
                <label htmlFor='email'>Email :</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    placeholder='enter your email'
                    className='w-full border bg-gray-200 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-red-300 text-slate-900'
                    value={data.email}
                    onChange={handleOnChange}
                    required
                  />
                </div>
              </div>

              <button
                className="w-full bg-linear-to-r from-cyan-300 to-cyan-950 hover:bg-slate-900 active:scale-95 active:bg-gray-950 text-gray-50 font-serif text-[20px] py-2 rounded-md transition duration-200 flex justify-center items-center gap-2"
              >
                Verify Email...
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

export default CheckEmailPage
