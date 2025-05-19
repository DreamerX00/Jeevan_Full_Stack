import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FaShoppingCart, FaSearch, FaFilter, FaStar, FaHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const MedicalShop = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { darkMode } = useTheme();
  
  // Get cart functions from context
  const { cartItems, addToCart, itemsCount } = useCart();

  // IMPORTANT: Define products BEFORE using it in useEffect
  // Mock product data
  const products = [
    {
      id: 1,
      name: 'Paracetamol Tablets',
      category: 'medicines',
      price: 99,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Relieves pain and reduces fever'
    },
    {
      id: 2,
      name: 'Vitamin C Tablets',
      category: 'vitamins',
      price: 299,
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Boosts immunity and overall health'
    },
    {
      id: 3,
      name: 'N95 Face Masks',
      category: 'essentials',
      price: 399,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1605845328942-24f13e4aac39?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'High quality protection against airborne particles'
    },
    {
      id: 4,
      name: 'Digital Thermometer',
      category: 'devices',
      price: 599,
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1588776814546-daab30f310ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Accurate temperature measurement in seconds'
    },
    {
      id: 5,
      name: 'First Aid Kit',
      category: 'essentials',
      price: 799,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Complete emergency kit for home use'
    },
    {
      id: 6,
      name: 'Hand Sanitizer',
      category: 'essentials',
      price: 149,
      rating: 4.1,
      image: 'https://images.unsplash.com/photo-1584483720412-ce931f4aefa8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Kills 99.9% of germs without water'
    }
  ];

  // Check for product ID in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const productId = params.get('product');
    
    if (productId) {
      // Find the product by ID
      const product = products.find(p => p.id === parseInt(productId));
      
      // If found, scroll to it and optionally highlight it
      if (product) {
        // Set category filter if needed
        if (product.category !== selectedCategory && selectedCategory !== 'all') {
          setSelectedCategory(product.category);
        }
        
        // Add a small delay to ensure rendering completes
        setTimeout(() => {
          const element = document.getElementById(`product-${productId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Add highlighting effect
            element.classList.add('ring-2', 'ring-blue-500', 'shadow-lg');
            
            // Remove highlight after a delay
            setTimeout(() => {
              element.classList.remove('ring-2', 'ring-blue-500', 'shadow-lg');
            }, 2000);
          }
        }, 300);
      }
    }
  }, [location.search, products, selectedCategory]);

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const goToCart = () => {
    navigate('/cart');
  };

  // Add debug information
  const handleAddToCart = (product) => {
    console.log("Adding product to cart:", product);
    addToCart(product);
    // Show a confirmation message
    alert(`${product.name} has been added to your cart!`);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark-bg' : 'bg-gray-50'} transition-colors duration-200`}>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16 pb-12">
          {/* Shop Header */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap items-center justify-between">
              <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>Medical Shop</h1>
                <p className={`mt-1 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-200`}>Find medicines, health essentials, and more at your convenience.</p>
              </div>
              <div className="mt-4 lg:mt-0 flex items-center">
                <button 
                  onClick={goToCart}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} transition-colors duration-200`}
                >
                  <FaShoppingCart className="mr-2" />
                  Cart ({itemsCount})
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className={`${darkMode ? 'bg-dark-card shadow-md' : 'bg-white shadow-sm'} transition-colors duration-200`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-wrap items-center justify-between">
                <div className="w-full lg:w-1/2 flex">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500' 
                          : 'bg-white border-gray-300 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
                      } rounded-md leading-5 focus:outline-none sm:text-sm transition-colors duration-200`}
                      placeholder="Search for medicines, essentials..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full lg:w-auto mt-4 lg:mt-0 flex items-center">
                  <div className="flex items-center">
                    <FaFilter className={`mr-2 h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <span className={`mr-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>Category:</span>
                  </div>
                  <select
                    className={`block w-full py-2 px-3 border ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-gray-200' 
                        : 'bg-white border-gray-300 text-gray-700'
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200`}
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="medicines">Medicines</option>
                    <option value="vitamins">Vitamins & Supplements</option>
                    <option value="essentials">Health Essentials</option>
                    <option value="devices">Medical Devices</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Product Listings */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div 
                    key={product.id} 
                    id={`product-${product.id}`} 
                    className={`${darkMode ? 'bg-dark-card' : 'bg-white'} rounded-lg shadow overflow-hidden hover:shadow-md transition-all duration-300`}
                  >
                    <div className="relative">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-48 object-cover"
                      />
                      <button className={`absolute top-2 right-2 p-1.5 rounded-full ${darkMode ? 'bg-gray-800 bg-opacity-75 hover:bg-opacity-100' : 'bg-white bg-opacity-75 hover:bg-opacity-100'} text-red-500 transition-colors duration-200`}>
                        <FaHeart className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <span className={`inline-block px-2 py-1 text-xs font-semibold ${
                          darkMode ? 'text-blue-300 bg-blue-900' : 'text-blue-800 bg-blue-100'
                        } rounded-full transition-colors duration-200`}>
                          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                        </span>
                        <div className="flex items-center">
                          <FaStar className="text-yellow-400 h-4 w-4" />
                          <span className={`ml-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-200`}>{product.rating}</span>
                        </div>
                      </div>
                      <h3 className={`mt-2 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>{product.name}</h3>
                      <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>{product.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>₹{product.price}</span>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`col-span-full flex flex-col items-center justify-center py-12 transition-colors duration-200`}>
                  <svg className={`h-16 w-16 ${darkMode ? 'text-gray-600' : 'text-gray-400'} transition-colors duration-200`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 13a3 3 0 100-6 3 3 0 000 6z" />
                  </svg>
                  <h3 className={`mt-2 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>No products found</h3>
                  <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>Try adjusting your search or filter to find what you're looking for.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MedicalShop; 