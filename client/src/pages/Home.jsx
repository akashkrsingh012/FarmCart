import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import axios from 'axios';
import { valideURLConvert } from '../utils/valideURLConvert';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import useMobile from '../hooks/useMobile';

const Home = () => {
  const [isMobile] = useMobile();
  const loadingCategory = useSelector(state => state.product.loadingCategory);
  const categoryData = useSelector(state => state.product.allCategory);
  const subCategoryData = useSelector(state => state.product.allSubCategory);
  const navigate = useNavigate();
  const [dealProducts, setDealProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products for Today's Deals section
  useEffect(() => {
    const fetchDealProducts = async () => {
      try {
        setIsLoading(true);
        // Using your API endpoint to get products
        const response = await axios.post('/api/product/get', {
          // You can add filters here if needed
          limit: 6,
          // Sort by discount to get the best deals
          sort: { discount: -1 }
        });
        
        if (response.data && response.data.products) {
          setDealProducts(response.data.products);
        } else {
          console.error('No products found in response');
        }
      } catch (error) {
        console.error('Error fetching deal products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDealProducts();
  }, []);

  // Calculate discounted price
  const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    if (!originalPrice || !discountPercentage) return originalPrice;
    return Math.round(originalPrice - (originalPrice * discountPercentage / 100));
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;

    const normalizedPath = imagePath.replace(/\\/g, '/');
    const cleanPath = normalizedPath.startsWith('/') 
      ? normalizedPath.substring(1) 
      : normalizedPath;
    return `http://localhost:8080/${cleanPath}`;
  };

  const handleRedirectProductListpage = (id, cat) => {
    const subcategory = subCategoryData.find(sub => 
      sub.category.some(c => c._id === id)
    );

    if (subcategory) {
      const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`;
      navigate(url);
    }
  };

  const handleRedirectToProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <section className="min-h-screen bg-gray-50">
      {/* Categories Strip - Small like Amazon/Flipkart */}
      <div className="bg-white shadow-sm mb-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6 overflow-x-auto py-3 scrollbar-hide">
            {loadingCategory ? (
              Array(8).fill(null).map((_, index) => (
                <div key={index} className="animate-pulse flex flex-col items-center min-w-[80px]">
                  <div className="h-12 w-12 bg-gray-200 rounded-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              ))
            ) : (
              categoryData.slice(0, 10).map((cat) => {
                const imageUrl = getImageUrl(cat.image);
                return (
                  <div
                    key={cat._id}
                    className="flex flex-col items-center cursor-pointer min-w-[80px]"
                    onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                  >
                    <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center p-2 hover:shadow-md transition-all">
                      <img
                        src={imageUrl || 'https://via.placeholder.com/50?text=No+Image'}
                        className="w-full h-full object-contain"
                        alt={cat.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/50?text=No+Image';
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-700 text-center mt-1 line-clamp-1">
                      {cat.name}
                    </p>
                  </div>
                );
              })
            )}
            <Link to="/categories" className="text-green-600 font-medium text-sm whitespace-nowrap flex items-center">
              View All <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Banner - Sea Food */}
      <div className="mb-6 px-4">
        <div className="rounded-lg overflow-hidden shadow-md relative">
          <div className="bg-gradient-to-r from-green-500 to-green-700 w-full h-full flex items-center p-8">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Sea Food</h1>
              <p className="text-xl text-white opacity-90 mb-8">Your favourite sea food is now live</p>
              <Link to="/category/seafood" className="bg-white text-green-700 px-6 py-3 rounded-md font-medium text-lg inline-block hover:bg-gray-100 transition-colors">
                Shop Now
              </Link>
            </div>
            <div className="hidden md:block">
              <img 
                src="/api/placeholder/300/300"
                className="rounded-full border-4 border-white shadow-lg"
                alt="Sea Food"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Banner Row */}
      <div className="container mx-auto px-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg overflow-hidden shadow-sm h-40 flex items-center">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Fresh Seafood</h3>
              <p className="text-white text-sm mb-3 opacity-90">Straight from the ocean to your plate</p>
              <button className="bg-white text-blue-700 px-4 py-2 rounded text-sm font-medium">Shop Now</button>
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-700 rounded-lg overflow-hidden shadow-sm h-40 flex items-center">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Organic Fruits</h3>
              <p className="text-white text-sm mb-3 opacity-90">100% pesticide-free produce</p>
              <button className="bg-white text-orange-700 px-4 py-2 rounded text-sm font-medium">Shop Now</button>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg overflow-hidden shadow-sm h-40 md:col-span-2 lg:col-span-1 flex items-center">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Daily Essentials</h3>
              <p className="text-white text-sm mb-3 opacity-90">Get your everyday needs</p>
              <button className="bg-white text-purple-700 px-4 py-2 rounded text-sm font-medium">Shop Now</button>
            </div>
          </div>
        </div>
      </div>

      {/* Deals Section */}
      <div className="container mx-auto px-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-medium">Today's Deals</h3>
            <Link 
              to="/deals"
              className="text-green-600 hover:underline flex items-center"
            >
              View all <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {isLoading ? (
              // Loading skeleton for deals
              Array(6).fill(null).map((_, index) => (
                <div key={`loading-deal-${index}`} className="animate-pulse flex flex-col items-center">
                  <div className="w-full aspect-square rounded-lg bg-gray-200 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))
            ) : dealProducts && dealProducts.length > 0 ? (
              // Actual products
              dealProducts.map((product) => {
                const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
                return (
                  <div 
                    key={product._id} 
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => handleRedirectToProduct(product._id)}
                  >
                    <div className="w-full aspect-square rounded-lg bg-gray-100 mb-2 relative overflow-hidden">
                      {product.discount > 0 && (
                        <div className="absolute top-0 left-0 bg-red-500 text-white text-xs px-2 py-1">
                          -{product.discount}%
                        </div>
                      )}
                      <img 
                        src={getImageUrl(product.image) || `https://via.placeholder.com/150?text=${encodeURIComponent(product.name)}`}
                        className="w-full h-full object-contain p-2"
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/150?text=${encodeURIComponent(product.name)}`;
                        }}
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-800 line-clamp-1">{product.name}</div>
                      <div className="flex items-center justify-center gap-2">
                        {product.discount > 0 ? (
                          <>
                            <span className="text-sm font-medium text-red-600">₹{discountedPrice}</span>
                            <span className="text-xs text-gray-500 line-through">₹{product.price}</span>
                          </>
                        ) : (
                          <span className="text-sm font-medium text-gray-800">₹{product.price}</span>
                        )}
                      </div>
                      {product.discount > 0 && (
                        <div className="text-xs text-green-600 font-medium">Save ₹{product.price - discountedPrice}</div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              // Fallback - If API call is successful but no products found
              <div className="col-span-full text-center py-8 text-gray-500">
                No deals available right now. Check back soon!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category-wise Product Sections */}
      <div className="space-y-8 pb-8">
        {categoryData?.map((category) => (
          <div key={category._id} className="bg-white shadow-sm mx-4">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">{category.name}</h3>
              <Link
                to={`/${valideURLConvert(category.name)}-${category._id}`}
                className="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm"
              >
                View All
                <ChevronRight size={16} />
              </Link>
            </div>
            <CategoryWiseProductDisplay 
              id={category._id}
              name={category.name}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Home;