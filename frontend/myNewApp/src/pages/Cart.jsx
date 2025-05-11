import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FaArrowLeft, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

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

  const handleCheckout = () => {
    alert("Checkout functionality is not implemented yet!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-6">
              <button 
                onClick={() => navigate('/shop')} 
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaArrowLeft className="mr-2" />
                Back to Shop
              </button>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
            
            {cartItems.length === 0 ? (
              <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h2 className="mt-4 text-lg font-medium text-gray-700">Your cart is empty</h2>
                <p className="mt-2 text-gray-500">Looks like you haven't added any items to your cart yet.</p>
                <button 
                  onClick={() => navigate('/shop')} 
                  className="mt-6 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <div className="flex-grow">
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">Cart Items ({cartItems.length})</h2>
                        <button 
                          onClick={clearCart}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                    
                    <div className="divide-y divide-gray-200">
                      {cartItems.map((item) => (
                        <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center">
                          <div className="w-full sm:w-20 h-20 bg-gray-100 rounded-lg overflow-hidden mb-4 sm:mb-0">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-grow sm:ml-6">
                            <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.category}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-4">
                              <div className="flex items-center border border-gray-300 rounded-md">
                                <button 
                                  onClick={() => decrementQuantity(item.id)}
                                  className="px-2 py-1 text-gray-600 hover:text-gray-800"
                                  disabled={item.quantity <= 1}
                                >
                                  <FaMinus className="h-3 w-3" />
                                </button>
                                <span className="px-4 py-1 text-sm">{item.quantity}</span>
                                <button 
                                  onClick={() => incrementQuantity(item.id)}
                                  className="px-2 py-1 text-gray-600 hover:text-gray-800"
                                >
                                  <FaPlus className="h-3 w-3" />
                                </button>
                              </div>
                              <span className="font-medium text-gray-900">₹{item.price * item.quantity}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-500 hover:text-red-600 mt-4 sm:mt-0"
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
                  <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-900">₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        {shipping === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          <span className="text-gray-900">₹{shipping}</span>
                        )}
                      </div>
                      <div className="border-t border-gray-200 pt-4 flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-xl">₹{total}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleCheckout}
                      className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700"
                    >
                      Proceed to Checkout
                    </button>
                    
                    <p className="mt-4 text-xs text-gray-500 text-center">
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