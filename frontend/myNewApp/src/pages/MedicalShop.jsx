import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FaShoppingCart, FaSearch, FaFilter, FaStar, FaHeart } from 'react-icons/fa';

const MedicalShop = () => {
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Add product to cart
  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16 pb-12">
          {/* Shop Header */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Medical Shop</h1>
                <p className="mt-1 text-lg text-gray-600">Find medicines, health essentials, and more at your convenience.</p>
              </div>
              <div className="mt-4 lg:mt-0 flex items-center">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaShoppingCart className="h-5 w-5 text-gray-400" />
                  </div>
                  <button className="inline-flex items-center pl-10 pr-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    Cart ({cartItems.reduce((total, item) => total + item.quantity, 0)})
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-wrap items-center justify-between">
                <div className="w-full lg:w-1/2 flex">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search for medicines, essentials..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full lg:w-auto mt-4 lg:mt-0 flex items-center">
                  <div className="flex items-center">
                    <FaFilter className="mr-2 h-5 w-5 text-gray-400" />
                    <span className="mr-2 text-sm text-gray-500">Category:</span>
                  </div>
                  <select
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                  <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <div className="relative">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-48 object-cover"
                      />
                      <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 text-red-500">
                        <FaHeart className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                        </span>
                        <div className="flex items-center">
                          <FaStar className="text-yellow-400 h-4 w-4" />
                          <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                        </div>
                      </div>
                      <h3 className="mt-2 text-lg font-medium text-gray-900">{product.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                        <button
                          onClick={() => addToCart(product)}
                          className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 13a3 3 0 100-6 3 3 0 000 6z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
                  <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                </div>
              )}
            </div>
          </div>

          {/* Shop information */}
          <div className="bg-blue-50 border-t border-blue-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Free Delivery</h3>
                  <p className="mt-1 text-gray-600">On orders above ₹499</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Secure Payments</h3>
                  <p className="mt-1 text-gray-600">100% secure payment methods</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">24/7 Support</h3>
                  <p className="mt-1 text-gray-600">Call us anytime at our helpline</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MedicalShop; 