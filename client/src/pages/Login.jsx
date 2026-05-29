import React, { useState } from 'react'
import { FaRegEyeSlash, FaRegEye, FaEnvelope, FaLock } from "react-icons/fa";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target
        setData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const validValue = Object.values(data).every(el => el)

    const handleSubmit = async(e) => {
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.login,
                data: data
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                localStorage.setItem('accesstoken', response.data.data.accesstoken)
                localStorage.setItem('refreshToken', response.data.data.refreshToken)

                const userDetails = await fetchUserDetails()
                dispatch(setUserDetails(userDetails.data))

                setData({
                    email: "",
                    password: "",
                })
                navigate("/")
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='min-h-screen bg-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            <div className='bg-white rounded-lg shadow-lg w-full max-w-md p-8 border-t-4 border-green-600'>
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Welcome back</h2>
                    <p className="text-gray-600 mt-2">Sign in to your account</p>
                </div>

                <form className='space-y-6' onSubmit={handleSubmit}>
                    <div className=''>
                        <label htmlFor='email' className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaEnvelope className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type='email'
                                id='email'
                                className='bg-gray-50 pl-10 p-3 border border-gray-300 rounded-md w-full outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all'
                                name='email'
                                value={data.email}
                                onChange={handleChange}
                                placeholder='Enter your email'
                            />
                        </div>
                    </div>
                    
                    <div className=''>
                        <label htmlFor='password' className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                className='bg-gray-50 pl-10 p-3 border border-gray-300 rounded-md w-full outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all'
                                name='password'
                                value={data.password}
                                onChange={handleChange}
                                placeholder='Enter your password'
                            />
                            <div 
                                onClick={() => setShowPassword(prev => !prev)} 
                                className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                            >
                                {showPassword ? (
                                    <FaRegEye className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <FaRegEyeSlash className="h-5 w-5 text-gray-400" />
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end mt-2">
                            <Link to="/forgot-password" className='text-sm text-green-600 hover:text-green-800 font-medium transition-colors'>
                                Forgot password?
                            </Link>
                        </div>
                    </div>
    
                    <button 
                        disabled={!validValue} 
                        className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
                            validValue 
                                ? "bg-green-600 hover:bg-green-700 shadow-md" 
                                : "bg-gray-400 cursor-not-allowed"
                        }`}
                    >
                        Sign In
                    </button>
                </form>

                <div className="text-center mt-8">
                    <p className="text-gray-600">
                        Don't have an account? {" "}
                        <Link to="/register" className='font-medium text-green-600 hover:text-green-800 transition-colors'>
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Login