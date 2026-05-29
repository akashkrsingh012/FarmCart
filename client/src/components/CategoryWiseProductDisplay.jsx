import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { valideURLConvert } from '../utils/valideURLConvert';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import CardProduct from './CardProduct'; // Import the CardProduct component from the old version

const CategoryWiseProductDisplay = ({ id, name }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef();
    const subCategoryData = useSelector(state => state.product.allSubCategory);
    
    const fetchCategoryWiseProduct = async () => {
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.getProductByCategory,
                data: { id }
            });

            const { data: responseData } = response;

            if (responseData.success) {
                setData(responseData.data);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoryWiseProduct();
    }, [id]);

    const handleScrollRight = () => {
        containerRef.current.scrollLeft += 300;
    };

    const handleScrollLeft = () => {
        containerRef.current.scrollLeft -= 300;
    };

    const handleRedirectProductListpage = () => {
        const subcategory = subCategoryData.find(sub => {
            const filterData = sub.category.some(c => c._id === id);
            return filterData ? true : null;
        });
        
        if (subcategory) {
            return `/${valideURLConvert(name)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`;
        }
        return `/${valideURLConvert(name)}-${id}`;
    };

    const redirectURL = handleRedirectProductListpage();

    // Product card loading skeleton
    const CardLoading = () => (
        <div className="min-w-[180px] flex-shrink-0">
            <div className="animate-pulse">
                <div className="h-36 bg-gray-200 rounded-md mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-1 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            </div>
        </div>
    );

    // Product card component - Keeping this for compatibility
    const ProductCard = ({ product }) => {
        const {
            _id,
            name,
            image,
            price,
            discount,
            unit
        } = product;

        const getImageUrl = (path) => {
            if (!path) return 'https://via.placeholder.com/180x180?text=No+Image';
            if (path.startsWith('http')) return path;
            
            const normalizedPath = path.replace(/\\/g, '/');
            const cleanPath = normalizedPath.startsWith('/') 
                ? normalizedPath.substring(1) 
                : normalizedPath;
            return `http://localhost:8080/${cleanPath}`;
        };

        const discountedPrice = discount ? price - (price * discount / 100) : price;

        return (
            <Link to={`${redirectURL}/product/${_id}`} className="min-w-[180px] flex-shrink-0 px-2">
                <div className="bg-white rounded-md hover:shadow-sm transition-all h-full">
                    <div className="h-36 p-2 flex items-center justify-center relative">
                        {discount > 0 && (
                            <div className="absolute top-1 left-1 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded">
                                -{discount}%
                            </div>
                        )}
                        <img
                            src={getImageUrl(image)}
                            alt={name}
                            className="h-full object-contain"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/180x180?text=No+Image';
                            }}
                        />
                    </div>
                    <div className="p-2">
                        <h4 className="text-sm text-gray-700 line-clamp-2 mb-1 hover:text-green-600">{name}</h4>
                        <div className="flex items-baseline gap-2">
                            <span className="font-medium">₹{discountedPrice.toFixed(2)}</span>
                            {discount > 0 && (
                                <span className="text-xs text-gray-500 line-through">₹{price.toFixed(2)}</span>
                            )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">per {unit || 'item'}</div>
                    </div>
                </div>
            </Link>
        );
    };

    return (
        <div>
            {/* Header with title and "See All" link from old component */}
            <div className="container mx-auto p-4 flex items-center justify-between gap-4">
                <h3 className="font-semibold text-lg md:text-xl">{name}</h3>
                <Link to={redirectURL} className="text-green-600 hover:text-green-400">See All</Link>
            </div>
            
            {/* Main container */}
            <div className="relative py-3">
                <div 
                    ref={containerRef}
                    className="flex gap-2 overflow-x-auto pl-4 pr-12 pb-2 scrollbar-hide scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {loading ? (
                        Array(6).fill(null).map((_, index) => (
                            <CardLoading key={`loading-card-${index}`} />
                        ))
                    ) : data.length === 0 ? (
                        <div className="w-full py-8 text-center text-gray-500">
                            No products available in this category
                        </div>
                    ) : (
                        data.map((product, index) => (
                            <CardProduct 
                                data={product}
                                key={`product-${product._id}-${index}`}
                            />
                        ))
                    )}
                </div>

                {/* Navigation arrows */}
                {data.length > 3 && (
                    <>
                        <button 
                            onClick={handleScrollLeft}
                            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-1 rounded-full text-gray-700 hover:bg-gray-50 hidden md:flex items-center justify-center z-10"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button 
                            onClick={handleScrollRight}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-md p-1 rounded-full text-gray-700 hover:bg-gray-50 hidden md:flex items-center justify-center z-10"
                            aria-label="Scroll right"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CategoryWiseProductDisplay;