import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.svg'
import Search from './Search'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from '../hooks/useMobile';
import { BsCart4 } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import UserMenu from './UserMenu';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';

const Header = () => {
    const [isMobile] = useMobile()
    const location = useLocation()
    const isSearchPage = location.pathname === "/search"
    const navigate = useNavigate()
    const user = useSelector((state) => state?.user)
    const [openUserMenu, setOpenUserMenu] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const { totalPrice, totalQty } = useGlobalContext()
    const [openCartSection, setOpenCartSection] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)

    // Handle notifications dropdown
    const toggleNotifications = () => {
        setShowNotifications(!showNotifications)
        if (openUserMenu) setOpenUserMenu(false)
    }

    const redirectToLoginPage = () => {
        navigate("/login")
    }

    const handleCloseUserMenu = () => {
        setOpenUserMenu(false)
    }

    const handleMobileUser = () => {
        if (!user._id) {
            navigate("/login")
            return
        }

        navigate("/user")
    }

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setOpenUserMenu(false)
            setShowNotifications(false)
        }

        document.addEventListener('click', handleClickOutside)
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    // Prevent event bubbling for dropdown menus
    const handleMenuClick = (e) => {
        e.stopPropagation()
    }

    return (
        <header className='h-24 lg:h-20 lg:shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white'>
            {
                !(isSearchPage && isMobile) && (
                    <div className='container mx-auto flex items-center px-2 justify-between'>
                        {/**logo */}
                        <div className='h-full'>
                            <Link to={"/"} className='h-full flex justify-center items-center'>
                                <img
                                    src={logo}
                                    width={90}
                                    alt='logo'
                                    className='hidden lg:block'
                                />
                                <img
                                    src={logo}
                                    width={120}
                                    height={30}
                                    alt='logo'
                                    className='lg:hidden'
                                />
                            </Link>
                        </div>

                        {/**Search */}
                        <div className='hidden lg:block flex-grow mx-6'>
                            <Search />
                        </div>

                        {/**login and my cart */}
                        <div className='flex items-center gap-2'>
                            {/**user icons display in only mobile version**/}
                            <button className='text-neutral-600 lg:hidden' onClick={handleMobileUser}>
                                <FaRegCircleUser size={26} />
                            </button>

                            {/**Desktop**/}
                            <div className='hidden lg:flex items-center gap-4'>
                                {/* Wishlist */}
                                <Link to="/wishlist" className='flex flex-col items-center text-neutral-600 hover:text-green-700 transition-colors'>
                                    <MdOutlineFavoriteBorder size={24} />
                                    <span className='text-xs'>Wishlist</span>
                                </Link>

                                {/* Notifications */}
                                <div className='relative'>
                                    <div 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            toggleNotifications()
                                        }} 
                                        className='flex flex-col items-center text-neutral-600 hover:text-green-700 transition-colors cursor-pointer'
                                    >
                                        <div className='relative'>
                                            <IoNotificationsOutline size={24} />
                                            <span className='absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center'>
                                                2
                                            </span>
                                        </div>
                                        <span className='text-xs'>Notifications</span>
                                    </div>
                                    {
                                        showNotifications && (
                                            <div className='absolute right-0 top-12 z-50' onClick={handleMenuClick}>
                                                <div className='bg-white rounded p-4 w-64 lg:shadow-lg'>
                                                    <h3 className='font-medium text-sm mb-2 pb-2 border-b'>Notifications</h3>
                                                    <div className='max-h-64 overflow-y-auto'>
                                                        <div className='py-2 border-b'>
                                                            <p className='text-sm'>Your order #ORD12345 has been shipped!</p>
                                                            <span className='text-xs text-gray-500'>2 hours ago</span>
                                                        </div>
                                                        <div className='py-2'>
                                                            <p className='text-sm'>Special offer: 20% off on seafood today!</p>
                                                            <span className='text-xs text-gray-500'>1 day ago</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>

                                {/* User Account */}
                                {
                                    user?._id ? (
                                        <div className='relative'>
                                            <div 
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setOpenUserMenu(prev => !prev)
                                                    if (showNotifications) setShowNotifications(false)
                                                }} 
                                                className='flex flex-col items-center text-neutral-600 hover:text-green-700 transition-colors cursor-pointer'
                                            >
                                                <FaRegCircleUser size={24} />
                                                <div className='flex items-center gap-1'>
                                                    <span className='text-xs'>Account</span>
                                                    {openUserMenu ? <GoTriangleUp size={12} /> : <GoTriangleDown size={12} />}
                                                </div>
                                            </div>
                                            {
                                                openUserMenu && (
                                                    <div className='absolute right-0 top-12 z-50' onClick={handleMenuClick}>
                                                        <div className='bg-white rounded p-4 min-w-52 lg:shadow-lg'>
                                                            <UserMenu close={handleCloseUserMenu} />
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={redirectToLoginPage} 
                                            className='text-neutral-600 hover:text-green-700 transition-colors flex flex-col items-center'
                                        >
                                            <FaRegCircleUser size={24} />
                                            <span className='text-xs'>Login</span>
                                        </button>
                                    )
                                }

                                {/* Cart Button */}
                                <button 
                                    onClick={() => setOpenCartSection(true)} 
                                    className='flex items-center gap-2 bg-green-800 hover:bg-green-700 px-3 py-2 rounded text-white transition-colors'
                                >
                                    {/**add to card icons */}
                                    <div className={cartItem.length > 0 ? 'animate-bounce' : ''}>
                                        <BsCart4 size={22} />
                                    </div>
                                    <div className='font-semibold text-sm'>
                                        {
                                            cartItem.length > 0 ? (
                                                <div>
                                                    <p>{totalQty} {totalQty === 1 ? 'Item' : 'Items'}</p>
                                                    <p>{DisplayPriceInRupees(totalPrice)}</p>
                                                </div>
                                            ) : (
                                                <p>My Cart</p>
                                            )
                                        }
                                    </div>
                                </button>
                            </div>

                            {/* Mobile Cart Button */}
                            <button 
                                onClick={() => setOpenCartSection(true)}
                                className='lg:hidden flex items-center justify-center relative'
                            >
                                <BsCart4 size={26} />
                                {cartItem.length > 0 && (
                                    <span className='absolute -top-1 -right-1 bg-green-600 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center'>
                                        {totalQty}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                )
            }

            <div className='container mx-auto px-2 lg:hidden'>
                <Search />
            </div>

            {
                openCartSection && (
                    <DisplayCartItem close={() => setOpenCartSection(false)} />
                )
            }
        </header>
    )
}

export default Header