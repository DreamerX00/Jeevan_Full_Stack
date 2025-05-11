import { createContext, useState, useContext, useEffect } from 'react';

// Create context
const SearchContext = createContext();

// Custom hook to use the search context
export const useSearch = () => {
  return useContext(SearchContext);
};

// Context provider component
export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Define the pages and items to search through
  const searchablePages = [
    { title: 'Home', path: '/', tags: ['homepage', 'welcome', 'main', 'health'] },
    { title: 'Login', path: '/login', tags: ['login', 'sign in', 'account', 'access'] },
    { title: 'Sign Up', path: '/signup', tags: ['signup', 'register', 'create account', 'join'] },
    { title: 'Forgot Password', path: '/forgot-password', tags: ['forgot', 'reset', 'password', 'recover'] },
    { title: 'Dashboard', path: '/dashboard', tags: ['dashboard', 'overview', 'summary', 'health status'] },
    { title: 'Profile', path: '/profile', tags: ['profile', 'personal information', 'settings', 'account'] },
    { title: 'Medical Shop', path: '/shop', tags: ['shop', 'store', 'medicines', 'products', 'buy'] },
    { title: 'Cart', path: '/cart', tags: ['cart', 'shopping cart', 'checkout', 'purchase'] },
  ];

  // Medical products for search
  const products = [
    {
      id: 1,
      name: 'Paracetamol Tablets',
      category: 'medicines',
      path: '/shop',
      tags: ['pain reliever', 'fever', 'headache', 'medicine'],
    },
    {
      id: 2,
      name: 'Vitamin C Tablets',
      category: 'vitamins',
      path: '/shop',
      tags: ['immunity', 'vitamin', 'supplement', 'health'],
    },
    {
      id: 3,
      name: 'N95 Face Masks',
      category: 'essentials',
      path: '/shop',
      tags: ['mask', 'protection', 'covid', 'safety'],
    },
    {
      id: 4,
      name: 'Digital Thermometer',
      category: 'devices',
      path: '/shop',
      tags: ['temperature', 'fever', 'monitor', 'device'],
    },
    {
      id: 5,
      name: 'First Aid Kit',
      category: 'essentials',
      path: '/shop',
      tags: ['emergency', 'kit', 'bandage', 'aid'],
    },
    {
      id: 6,
      name: 'Hand Sanitizer',
      category: 'essentials',
      path: '/shop',
      tags: ['hygiene', 'sanitizer', 'cleaner', 'germs'],
    },
  ];

  // Features to search
  const features = [
    { 
      title: 'Medical Records', 
      path: '/dashboard', 
      tags: ['records', 'history', 'medical history', 'documents'] 
    },
    { 
      title: 'Appointment Scheduling', 
      path: '/dashboard', 
      tags: ['appointment', 'book', 'schedule', 'doctor visit'] 
    },
    { 
      title: 'Health Tracker', 
      path: '/dashboard', 
      tags: ['track', 'monitor', 'vitals', 'statistics'] 
    },
    { 
      title: 'Medication Reminders', 
      path: '/dashboard', 
      tags: ['reminder', 'medication', 'alerts', 'schedule'] 
    },
    { 
      title: 'Emergency Contacts', 
      path: '/emergency-contacts', 
      tags: ['emergency', 'contacts', 'urgent', 'help'] 
    },
  ];

  // Perform search when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    const search = async () => {
      setIsSearching(true);
      setShowResults(true);
      
      // Simulate API call with setTimeout
      setTimeout(() => {
        // Mock search results
        const results = [
          // Pages
          {
            id: 'home',
            type: 'page',
            displayTitle: 'Home Page',
            path: '/'
          },
          {
            id: 'medical-shop',
            type: 'page',
            displayTitle: 'Medical Shop',
            path: '/shop'
          },
          {
            id: 'appointments',
            type: 'page',
            displayTitle: 'Book Appointments',
            path: '/appointments'
          },
          
          // Products - only if search matches
          ...(searchTerm.toLowerCase().includes('med') ? [
            {
              id: 1,
              type: 'product',
              displayTitle: 'Paracetamol Tablets',
              subtitle: 'Pain Relief Medicine',
              path: '/shop'
            }
          ] : []),
          
          ...(searchTerm.toLowerCase().includes('vit') ? [
            {
              id: 2,
              type: 'product',
              displayTitle: 'Vitamin C Tablets',
              subtitle: 'Immunity Booster',
              path: '/shop'
            }
          ] : []),
          
          // Features
          {
            id: 'records',
            type: 'feature',
            displayTitle: 'Medical Records',
            title: 'Medical Records',
            path: '/dashboard'
          }
        ].filter(item => 
          item.displayTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        
        setSearchResults(results);
        setIsSearching(false);
      }, 500);
    };
    
    search();
  }, [searchTerm]);
  
  const value = {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    showResults,
    setShowResults
  };
  
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export default SearchContext; 