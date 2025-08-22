import { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';

// Safe storage utilities to handle localStorage errors
const safeStorage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
      return false;
    }
  }
};

// Create context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Context provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  
  // Load cart from localStorage on initial mount
  useEffect(() => {
    const savedCart = safeStorage.get('cartItems', []);
    if (Array.isArray(savedCart)) {
      setCartItems(savedCart);
    } else {
      console.warn('Invalid cart data in localStorage, resetting to empty cart');
      setCartItems([]);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    safeStorage.set('cartItems', cartItems);
  }, [cartItems]);

  // Memoized calculations for better performance
  const cartCalculations = useMemo(() => {
    const calculatedSubtotal = cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1), 
      0
    );
    
    // Set shipping based on subtotal
    const calculatedShipping = calculatedSubtotal > 499 ? 0 : 50;
    
    // Calculate final total
    const calculatedTotal = calculatedSubtotal + calculatedShipping;
    
    // Calculate total items count
    const itemsCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    
    return {
      subtotal: calculatedSubtotal,
      shipping: calculatedShipping,
      total: calculatedTotal,
      itemsCount
    };
  }, [cartItems]);

  // Memoized cart operations for better performance
  const addToCart = useCallback((product) => {
    if (!product || !product.id) {
      console.error('Invalid product provided to addToCart:', product);
      return;
    }
    
    console.log("Adding to cart:", product);
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: (item.quantity || 1) + 1 } 
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    if (!id) {
      console.error('Invalid id provided to removeFromCart:', id);
      return;
    }
    
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  }, []);

  const incrementQuantity = useCallback((id) => {
    if (!id) {
      console.error('Invalid id provided to incrementQuantity:', id);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id 
          ? { ...item, quantity: (item.quantity || 1) + 1 } 
          : item
      )
    );
  }, []);

  const decrementQuantity = useCallback((id) => {
    if (!id) {
      console.error('Invalid id provided to decrementQuantity:', id);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id && (item.quantity || 1) > 1 
          ? { ...item, quantity: (item.quantity || 1) - 1 } 
          : item
      ).filter(item => item.quantity > 0) // Remove items with 0 quantity
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const updateItemQuantity = useCallback((id, quantity) => {
    if (!id || quantity === undefined || quantity < 0) {
      console.error('Invalid parameters provided to updateItemQuantity:', { id, quantity });
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id 
          ? { ...item, quantity: Math.max(0, quantity) } 
          : item
      ).filter(item => item.quantity > 0) // Remove items with 0 quantity
    );
  }, []);

  const value = useMemo(() => ({
    cartItems,
    subtotal: cartCalculations.subtotal, 
    shipping: cartCalculations.shipping,
    total: cartCalculations.total,
    itemsCount: cartCalculations.itemsCount,
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    updateItemQuantity,
    clearCart
  }), [cartItems, cartCalculations, addToCart, removeFromCart, incrementQuantity, decrementQuantity, updateItemQuantity, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext; 