import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FaArrowLeft, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    subtotal, 
    shipping, 
    total,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart 
  } = useCart();
  const { darkMode } = useTheme();

  const handleCheckout = () => {
    alert("Checkout functionality is not implemented yet!");
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark-bg' : 'bg-gray-50'} transition-colors duration-200`}>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-6">
              <button 
                onClick={() => navigate('/shop')} 
                className={`inline-flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors duration-200`}
              >
                <FaArrowLeft className="mr-2" />
                Back to Shop
              </button>
            </div>
            
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-8 transition-colors duration-200`}>Your Cart</h1>
            
            {cartItems.length === 0 ? (
              <div className={`${darkMode ? 'bg-dark-card' : 'bg-white'} p-8 rounded-xl shadow-sm text-center transition-colors duration-200`}>
                <svg className={`mx-auto h-16 w-16 ${darkMode ? 'text-gray-600' : 'text-gray-400'} transition-colors duration-200`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h2 className={`mt-4 text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-700'} transition-colors duration-200`}>Your cart is empty</h2>
                <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>Looks like you haven't added any items to your cart yet.</p>
                <button 
                  onClick={() => navigate('/shop')} 
                  className={`mt-6 px-4 py-2 ${darkMode ? 'bg-blue-600' : 'bg-blue-600'} text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200`}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <div className="flex-grow">
                  <div className={`${darkMode ? 'bg-dark-card' : 'bg-white'} rounded-xl shadow-sm overflow-hidden transition-colors duration-200`}>
                    <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-200`}>
                      <div className="flex justify-between items-center">
                        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>Cart Items ({cartItems.length})</h2>
                        <button 
                          onClick={clearCart}
                          className={`text-sm ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'} transition-colors duration-200`}
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                    
                    <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'} transition-colors duration-200`}>
                      {cartItems.map((item) => (
                        <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center">
                          <div className={`w-full sm:w-20 h-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg overflow-hidden mb-4 sm:mb-0 transition-colors duration-200`}>
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-grow sm:ml-6">
                            <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>{item.name}</h3>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>{item.category}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-4">
                              <div className={`flex items-center border ${darkMode ? 'border-gray-700' : 'border-gray-300'} rounded-md transition-colors duration-200`}>
                                <button 
                                  onClick={() => decrementQuantity(item.id)}
                                  className={`px-2 py-1 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'} transition-colors duration-200`}
                                  disabled={item.quantity <= 1}
                                >
                                  <FaMinus className="h-3 w-3" />
                                </button>
                                <span className={`px-4 py-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'} transition-colors duration-200`}>{item.quantity}</span>
                                <button 
                                  onClick={() => incrementQuantity(item.id)}
                                  className={`px-2 py-1 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'} transition-colors duration-200`}
                                >
                                  <FaPlus className="h-3 w-3" />
                                </button>
                              </div>
                              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>₹{item.price * item.quantity}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className={`${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600'} mt-4 sm:mt-0 transition-colors duration-200`}
                          >
                            <FaTrash className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Order Summary */}
                <div className="lg:w-80">
                  <div className={`${darkMode ? 'bg-dark-card' : 'bg-white'} rounded-xl shadow-sm p-6 sticky top-20 transition-colors duration-200`}>
                    <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6 transition-colors duration-200`}>Order Summary</h2>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-200`}>Subtotal</span>
                        <span className={`${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-200`}>Shipping</span>
                        {shipping === 0 ? (
                          <span className={`${darkMode ? 'text-green-400' : 'text-green-600'} transition-colors duration-200`}>Free</span>
                        ) : (
                          <span className={`${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>₹{shipping}</span>
                        )}
                      </div>
                      <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-4 flex justify-between font-semibold transition-colors duration-200`}>
                        <span className={`${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>Total</span>
                        <span className={`text-xl ${darkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}>₹{total}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleCheckout}
                      className={`w-full mt-6 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3 px-4 rounded-md font-medium transition-colors duration-200`}
                    >
                      Proceed to Checkout
                    </button>
                    
                    <p className={`mt-4 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center transition-colors duration-200`}>
                      Free shipping on orders over ₹499
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Cart; 