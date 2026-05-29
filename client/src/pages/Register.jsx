import React, { useState } from 'react'
import { FaRegEyeSlash, FaRegEye, FaEnvelope, FaLock, FaUser, FaUserTie, FaUserShield } from "react-icons/fa";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "USER"
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const validateForm = () => {
        if (!data.name || !data.email || !data.password || !data.confirmPassword) {
            toast.error("All fields are required")
            return false
        }

        if (data.password !== data.confirmPassword) {
            toast.error("Password and confirm password must match")
            return false
        }

        if (data.password.length < 6) {
            toast.error("Password must be at least 6 characters")
            return false
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            toast.error("Please enter a valid email address")
            return false
        }

        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)

        try {
            const response = await Axios({
                ...SummaryApi.register,
                data: {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    role: data.role
                }
            })
            
            if (response.data.error) {
                toast.error(response.data.message)
                return
            }

            if (response.data.success) {
                toast.success(response.data.message)
                setData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    role: "USER"
                })
                navigate("/login")
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setIsLoading(false)
        }
    }

    const validValue = Object.values(data).every(el => el) && data.password === data.confirmPassword

    return (
        <section className='min-h-screen bg-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            <div className='bg-white rounded-lg shadow-lg w-full max-w-md p-8 border-t-4 border-green-600'>
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
                    <p className="text-gray-600 mt-2">Join FarmCart and start shopping</p>
                </div>

                <form className='space-y-5' onSubmit={handleSubmit}>
                    {/* Account Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setData(prev => ({...prev, role: "USER"}))}
                                className={`flex items-center justify-center p-3 rounded-md border transition-colors ${
                                    data.role === "USER" 
                                        ? "border-green-500 bg-green-50 text-green-700" 
                                        : "border-gray-300 hover:border-gray-400"
                                }`}
                            >
                                <FaUserTie className="mr-2" />
                                User Account
                            </button>
                            <button
                                type="button"
                                onClick={() => setData(prev => ({...prev, role: "ADMIN"}))}
                                className={`flex items-center justify-center p-3 rounded-md border transition-colors ${
                                    data.role === "ADMIN" 
                                        ? "border-green-500 bg-green-50 text-green-700" 
                                        : "border-gray-300 hover:border-gray-400"
                                }`}
                            >
                                <FaUserShield className="mr-2" />
                                Admin Account
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor='name' className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaUser className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type='text'
                                id='name'
                                autoFocus
                                className='bg-gray-50 pl-10 p-3 border border-gray-300 rounded-md w-full outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all'
                                name='name'
                                value={data.name}
                                onChange={handleChange}
                                placeholder='Enter your name'
                                required
                            />
                        </div>
                    </div>

                    <div>
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
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor='password' className="block text-sm font-medium text-gray-700 mb-1">Password (min 6 characters)</label>
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
                                placeholder='Create a password'
                                minLength="6"
                                required
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
                    </div>

                    <div>
                        <label htmlFor='confirmPassword' className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id='confirmPassword'
                                className='bg-gray-50 pl-10 p-3 border border-gray-300 rounded-md w-full outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all'
                                name='confirmPassword'
                                value={data.confirmPassword}
                                onChange={handleChange}
                                placeholder='Confirm your password'
                                minLength="6"
                                required
                            />
                            <div 
                                onClick={() => setShowConfirmPassword(prev => !prev)} 
                                className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                            >
                                {showConfirmPassword ? (
                                    <FaRegEye className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <FaRegEyeSlash className="h-5 w-5 text-gray-400" />
                                )}
                            </div>
                        </div>
                    </div>

                    <button 
                        disabled={!validValue || isLoading} 
                        className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors mt-6 ${
                            validValue && !isLoading
                                ? "bg-green-600 hover:bg-green-700 shadow-md" 
                                : "bg-gray-400 cursor-not-allowed"
                        }`}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="text-center mt-8">
                    <p className="text-gray-600">
                        Already have an account? {" "}
                        <Link to="/login" className='font-medium text-green-600 hover:text-green-800 transition-colors'>
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Register