import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaHistory } from "react-icons/fa";

const OtpVerification = () => {
    const [data, setData] = useState(["","","","","",""])
    const navigate = useNavigate()
    const inputRef = useRef([])
    const location = useLocation()

    useEffect(() => {
        if(!location?.state?.email){
            navigate("/forgot-password")
        }
    }, [])

    const validValue = data.every(el => el)

    const handleSubmit = async(e) => {
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password_otp_verification,
                data: {
                    otp: data.join(""),
                    email: location?.state?.email
                }
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                setData(["","","","","",""])
                navigate("/reset-password", {
                    state: {
                        data: response.data,
                        email: location?.state?.email
                    }
                })
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const handleKeyDown = (e, index) => {
        // If backspace is pressed and current field is empty, focus previous field
        if (e.key === 'Backspace' && !data[index] && index > 0) {
            inputRef.current[index-1].focus()
        }
    }

    return (
        <section className='min-h-screen bg-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            <div className='bg-white rounded-lg shadow-lg w-full max-w-md p-8 border-t-4 border-green-600'>
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-3">
                        <div className="bg-green-100 p-3 rounded-full">
                            <FaShieldAlt className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Verification Code</h2>
                    <p className="text-gray-600 mt-2">
                        We sent a code to <span className="font-medium">{location?.state?.email}</span>
                    </p>
                </div>

                <form className='space-y-6' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='otp' className="block text-sm font-medium text-gray-700 mb-3 text-center">
                            Enter the 6-digit verification code
                        </label>
                        <div className='flex items-center justify-between gap-2 mt-2'>
                            {data.map((element, index) => (
                                <input
                                    key={"otp"+index}
                                    type='text'
                                    inputMode='numeric'
                                    pattern="\d*"
                                    maxLength={1}
                                    autoFocus={index === 0}
                                    ref={(ref) => {
                                        inputRef.current[index] = ref
                                        return ref 
                                    }}
                                    value={data[index]}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        // Only allow numbers
                                        if (!/^\d*$/.test(value)) return
                                        
                                        const newData = [...data]
                                        newData[index] = value
                                        setData(newData)

                                        // Move to next input if value exists
                                        if (value && index < 5) {
                                            inputRef.current[index+1].focus()
                                        }
                                    }}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className='bg-gray-50 w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all'
                                />
                            ))}
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
                        Verify Code
                    </button>
                </form>

                <div className="text-center mt-8 space-y-4">
                    <p className="text-gray-600 flex items-center justify-center gap-2">
                        <FaHistory className="text-gray-400" />
                        Didn't receive code? <button className="font-medium text-green-600 hover:text-green-800 transition-colors">Resend</button>
                    </p>
                    <p className="text-gray-600">
                        Back to <Link to="/login" className='font-medium text-green-600 hover:text-green-800 transition-colors'>Sign In</Link>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default OtpVerification