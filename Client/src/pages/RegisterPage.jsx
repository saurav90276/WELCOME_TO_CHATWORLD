import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios'
import toast from 'react-hot-toast';
import { Eye, EyeOff, Lock, Mail, MessageSquare, User } from "lucide-react";
import AuthImagePattern from '../layout/AuthImagePattern';
import signupimg from "../assets/signup.png";


const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: ""
  })
  const [uploadPhoto, setUploadPhoto] = useState("")
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

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0]

    const uploadPhoto = await uploadFile(file)

    setUploadPhoto(file)

    setData((preve) => {
      return {
        ...preve,
        profile_pic: uploadPhoto?.url
      }
    })
  }
  const handleClearUploadPhoto = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setUploadPhoto(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/register`

    try {
      const response = await axios.post(URL, data)
      console.log("response", response)

      toast.success(response.data.message)

      if (response.data.success) {
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: ""
        })

        navigate('/email')

      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
      console.log(error)
    }
    console.log('data', data)
  }


  return (
    <>
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-800">
        <div className="flex flex-col justify-center items-center mt-12 px-6 py-12">
          <div className="w-full max-w-md">
            {/* LOGO & HEADING */}
            <div className="flex flex-col items-center mb-10">
              <div className=" bg-linear-to-r from-red-300 to-gray-300 p-3 rounded-lg">
                <MessageSquare className="text-slate-900 w-6 h-6" />
              </div>
              <h1 className="text-transparent text-4xl font-bold mt-4 bg-clip-text bg-linear-to-r from-red-300 to-gray-300">Create Account</h1>
              <p className="text-slate-200 text-sm mt-2">Get started with your free account</p>
            </div>


            {/* REGISTER FORM */}
            <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
              <div className='flex flex-col gap-1'>
                <label htmlFor='name' className="block text-sm font-medium text-slate-50 mb-1">Name :</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    placeholder='enter your name'
                    className='w-full border bg-gray-200 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-red-300 text-slate-900'
                    value={data.name}
                    onChange={handleOnChange}
                    required
                  />
                </div>

              </div>

              <div className='flex flex-col gap-1'>
                <label htmlFor='email' className="block text-sm font-medium text-slate-50 mb-1">Email :</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700">
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

              <div className='flex flex-col gap-1'>
                <label htmlFor='profile_pic' className="block text-sm font-medium text-slate-50 mb-1">Photo :

                  <div className='h-14 bg-slate-200 hover:bg-slate-900 hover:text-cyan-100 text-red-900 active:scale-95 active:bg-gray-950 flex justify-center items-center border rounded hover:border-primary cursor-pointer transition duration-200'>
                    <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'>
                      {
                        uploadPhoto?.name ? uploadPhoto?.name : "Upload profile photo"
                      }
                    </p>
                    {
                      uploadPhoto?.name && (
                        <button className='text-lg ml-2 hover:text-red-600' onClick={handleClearUploadPhoto}>
                          <IoClose />
                        </button>
                      )
                    }

                  </div>

                </label>

                <input
                  type='file'
                  id='profile_pic'
                  name='profile_pic'
                  className='bg-slate-100 px-2 py-1 focus:outline-primary hidden'
                  onChange={handleUploadPhoto}
                />
              </div>


              <button
                className="w-full bg-linear-to-r from-yellow-200 to-red-950 hover:bg-slate-900 active:scale-95 active:bg-gray-950 text-slate-50 font-serif text-[20px] font-medium py-2 rounded-md transition duration-200 flex justify-center items-center gap-2"
              >
                Register
              </button>

            </form>


            {/* FOOTER LINK */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-200">
                Already have an account?{" "}
                <Link to="/email" className="text-cyan-300 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

          </div>
        </div>

        <AuthImagePattern title={"Join our community!"}
          subtitle={"Connect with friends, share your thoughts, and stay in touch with your loved ones."} img={signupimg} />
      </div>
    </>
  )
}

export default RegisterPage


// function Register() {
//   return (
//     <div>
//       <h1>Register Page</h1>
//       <p>This page is working!</p>
//     </div>
//   );
// }

// export default Register;