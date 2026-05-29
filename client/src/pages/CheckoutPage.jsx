import React, { useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { FaMapMarkerAlt, FaPlus, FaCreditCard, FaMoneyBillWave, FaShoppingBag, FaBoxOpen } from 'react-icons/fa'

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext()
  const [openAddress, setOpenAddress] = useState(false)
  const addressList = useSelector(state => state.addresses.addressList)
  const [selectAddress, setSelectAddress] = useState(0)
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const navigate = useNavigate()

  const handleCashOnDelivery = async() => {
    try {
      toast.loading("Processing your order...")
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        }
      })

      const { data: responseData } = response
      toast.dismiss()

      if(responseData.success){
        toast.success(responseData.message)
        if(fetchCartItem){
          fetchCartItem()
        }
        if(fetchOrder){
          fetchOrder()
        }
        navigate('/success', {
          state: {
            text: "Order"
          }
        })
      }
    } catch (error) {
      toast.dismiss()
      AxiosToastError(error)
    }
  }

  const handleOnlinePayment = async() => {
    try {
      toast.loading("Preparing payment gateway...")
      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
      const stripePromise = await loadStripe(stripePublicKey)
      
      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        }
      })

      const { data: responseData } = response
      toast.dismiss()

      stripePromise.redirectToCheckout({ sessionId: responseData.id })
      
      if(fetchCartItem){
        fetchCartItem()
      }
      if(fetchOrder){
        fetchOrder()
      }
    } catch (error) {
      toast.dismiss()
      AxiosToastError(error)
    }
  }

  return (
    <section className='bg-blue-50 min-h-screen py-8'>
      <div className='container mx-auto'>
        <div className="bg-white shadow-md p-4 mb-6 rounded-lg">
          <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
          <p className="text-sm text-gray-500">Complete your order</p>
        </div>
        
        <div className='flex flex-col lg:flex-row gap-6 px-4'>
          <div className='w-full lg:w-2/3'>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className='text-lg font-semibold flex items-center mb-4'>
                <FaMapMarkerAlt className="mr-2 text-green-600" />
                Shipping Address
              </h3>
              
              <div className='grid gap-4'>
                {addressList.map((address, index) => {
                  if (!address.status) return null;
                  
                  return (
                    <label 
                      key={index}
                      htmlFor={"address" + index} 
                      className="relative border rounded-lg p-4 cursor-pointer transition-all hover:border-green-600"
                    >
                      <div className='flex gap-3'>
                        <div className="flex items-start pt-1">
                          <input 
                            id={"address" + index} 
                            type='radio' 
                            value={index} 
                            checked={parseInt(selectAddress) === index}
                            onChange={(e) => setSelectAddress(e.target.value)} 
                            name='address'
                            className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{address.address_line}</div>
                          <div className="text-gray-600 mt-1">
                            {address.city}, {address.state}
                          </div>
                          <div className="text-gray-600">
                            {address.country} - {address.pincode}
                          </div>
                          <div className="text-gray-600 mt-1">
                            Phone: {address.mobile}
                          </div>
                        </div>
                      </div>
                    </label>
                  )
                })}
                
                <button 
                  onClick={() => setOpenAddress(true)} 
                  className='h-16 border-2 border-dashed border-gray-300 rounded-lg flex justify-center items-center 
                  cursor-pointer text-gray-600 hover:text-green-600 hover:border-green-600 transition-colors'
                >
                  <FaPlus className="mr-2" /> Add New Address
                </button>
              </div>
            </div>
          </div>

          <div className='w-full lg:w-1/3'>
            <div className='bg-white rounded-lg shadow-md overflow-hidden sticky top-24'>
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <h3 className='text-lg font-semibold flex items-center'>
                  <FaShoppingBag className="mr-2 text-green-600" />
                  Order Summary
                </h3>
              </div>
              
              <div className='p-6'>
                <div className="space-y-3 mb-6">
                  <div className='flex justify-between items-center text-gray-700'>
                    <p>Items ({totalQty})</p>
                    <p className='flex items-center gap-2'>
                      {notDiscountTotalPrice !== totalPrice && (
                        <span className='line-through text-gray-400'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                      )}
                      <span className="font-medium">{DisplayPriceInRupees(totalPrice)}</span>
                    </p>
                  </div>
                  
                  <div className='flex justify-between items-center text-gray-700'>
                    <p>Delivery</p>
                    <p className='text-green-600 font-medium'>Free</p>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3 mt-3"></div>
                  
                  <div className='flex justify-between items-center font-semibold text-gray-900'>
                    <p>Total Amount</p>
                    <p className="text-xl">{DisplayPriceInRupees(totalPrice)}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mt-6">
                  <button 
                    onClick={handleOnlinePayment}
                    className='w-full py-3 px-4 bg-green-600 hover:bg-green-700 transition-colors rounded-md text-white font-semibold flex items-center justify-center'
                  >
                    <FaCreditCard className="mr-2" /> Pay Online
                  </button>
                  
                  <button 
                    onClick={handleCashOnDelivery}
                    className='w-full py-3 px-4 border-2 border-green-600 hover:bg-green-50 transition-colors rounded-md font-semibold text-green-600 flex items-center justify-center'
                  >
                    <FaMoneyBillWave className="mr-2" /> Cash on Delivery
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  )
}

export default CheckoutPage