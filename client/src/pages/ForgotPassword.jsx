import React, { useState } from 'react'
import { FaEnvelope, FaPaperPlane } from "react-icons/fa";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async(e) => {
        e.preventDefault()
        
        if (!email) {
            toast.error("Please enter your email address")
            return
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Please enter a valid email address")
            return
        }

        setIsLoading(true)

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password,
                data: { email }
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                navigate("/verification-otp", {
                    state: { email }
                })
                setEmail("")
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className='min-h-screen bg-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            <div className='bg-white rounded-lg shadow-lg w-full max-w-md p-8 border-t-4 border-green-600'>
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-3">
                        <div className="bg-green-100 p-3 rounded-full">
                            <FaPaperPlane className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Forgot Password</h2>
                    <p className="text-gray-600 mt-2">
                        Enter your email to receive a verification code
                    </p>
                </div>

                <form className='space-y-6' onSubmit={handleSubmit}>
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='Enter your email'
                                required
                            />
                        </div>
                    </div>

                    <button 
                        disabled={!email || isLoading} 
                        className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
                            email && !isLoading 
                                ? "bg-green-600 hover:bg-green-700 shadow-md" 
                                : "bg-gray-400 cursor-not-allowed"
                        }`}
                    >
                        {isLoading ? 'Sending...' : 'Send Verification Code'}
                    </button>
                </form>

                <div className="text-center mt-8">
                    <p className="text-gray-600">
                        Remember your password? {" "}
                        <Link to="/login" className='font-medium text-green-600 hover:text-green-800 transition-colors'>
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default ForgotPassword