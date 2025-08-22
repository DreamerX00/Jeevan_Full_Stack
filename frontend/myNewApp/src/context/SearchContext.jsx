import { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';

// Create context
const SearchContext = createContext();

// Custom hook to use the search context
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

// Debounce utility function
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Context provider component
export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoized searchable data
  const searchableData = useMemo(() => {
    const pages = [
      { id: 'home', type: 'page', displayTitle: 'Home Page', path: '/', tags: ['homepage', 'welcome', 'main', 'health'] },
      { id: 'login', type: 'page', displayTitle: 'Login', path: '/login', tags: ['login', 'sign in', 'account', 'access'] },
      { id: 'signup', type: 'page', displayTitle: 'Sign Up', path: '/signup', tags: ['signup', 'register', 'create account', 'join'] },
      { id: 'forgot-password', type: 'page', displayTitle: 'Forgot Password', path: '/forgot-password', tags: ['forgot', 'reset', 'password', 'recover'] },
      { id: 'dashboard', type: 'page', displayTitle: 'Dashboard', path: '/dashboard', tags: ['dashboard', 'overview', 'summary', 'health status'] },
      { id: 'profile', type: 'page', displayTitle: 'Profile', path: '/profile', tags: ['profile', 'personal information', 'settings', 'account'] },
      { id: 'shop', type: 'page', displayTitle: 'Medical Shop', path: '/shop', tags: ['shop', 'store', 'medicines', 'products', 'buy'] },
      { id: 'cart', type: 'page', displayTitle: 'Cart', path: '/cart', tags: ['cart', 'shopping cart', 'checkout', 'purchase'] },
    ];

    const products = [
      {
        id: 1,
        type: 'product',
        displayTitle: 'Paracetamol Tablets',
        subtitle: 'Pain Relief Medicine',
        path: '/shop',
        tags: ['pain reliever', 'fever', 'headache', 'medicine'],
      },
      {
        id: 2,
        type: 'product',
        displayTitle: 'Vitamin C Tablets',
        subtitle: 'Immunity Booster',
        path: '/shop',
        tags: ['immunity', 'vitamin', 'supplement', 'health'],
      },
      {
        id: 3,
        type: 'product',
        displayTitle: 'N95 Face Masks',
        subtitle: 'Protection Equipment',
        path: '/shop',
        tags: ['mask', 'protection', 'covid', 'safety'],
      },
      {
        id: 4,
        type: 'product',
        displayTitle: 'Digital Thermometer',
        subtitle: 'Health Monitoring Device',
        path: '/shop',
        tags: ['temperature', 'fever', 'monitor', 'device'],
      },
      {
        id: 5,
        type: 'product',
        displayTitle: 'First Aid Kit',
        subtitle: 'Emergency Kit',
        path: '/shop',
        tags: ['emergency', 'kit', 'bandage', 'aid'],
      },
      {
        id: 6,
        type: 'product',
        displayTitle: 'Hand Sanitizer',
        subtitle: 'Hygiene Product',
        path: '/shop',
        tags: ['hygiene', 'sanitizer', 'cleaner', 'germs'],
      },
    ];

    const features = [
      { 
        id: 'records',
        type: 'feature',
        displayTitle: 'Medical Records',
        path: '/dashboard',
        tags: ['records', 'history', 'medical history', 'documents'] 
      },
      { 
        id: 'appointments',
        type: 'feature',
        displayTitle: 'Appointment Scheduling',
        path: '/dashboard',
        tags: ['appointment', 'book', 'schedule', 'doctor visit'] 
      },
      { 
        id: 'tracker',
        type: 'feature',
        displayTitle: 'Health Tracker',
        path: '/dashboard',
        tags: ['track', 'monitor', 'vitals', 'statistics'] 
      },
      { 
        id: 'reminders',
        type: 'feature',
        displayTitle: 'Medication Reminders',
        path: '/dashboard',
        tags: ['reminder', 'medication', 'alerts', 'schedule'] 
      },
      { 
        id: 'emergency',
        type: 'feature',
        displayTitle: 'Emergency Contacts',
        path: '/emergency-contacts',
        tags: ['emergency', 'contacts', 'urgent', 'help'] 
      },
    ];

    return [...pages, ...products, ...features];
  }, []);

  // Memoized search function
  const performSearch = useCallback(async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      setShowResults(false);
      setSearchError(null);
      return;
    }

    try {
      setIsSearching(true);
      setSearchError(null);
      setShowResults(true);

      // Simulate API call with setTimeout
      const results = await new Promise((resolve) => {
        setTimeout(() => {
          const searchTermLower = term.toLowerCase();
          
          const filteredResults = searchableData.filter(item => {
            const titleMatch = item.displayTitle.toLowerCase().includes(searchTermLower);
            const subtitleMatch = item.subtitle && item.subtitle.toLowerCase().includes(searchTermLower);
            const tagMatch = item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTermLower));
            
            return titleMatch || subtitleMatch || tagMatch;
          });

          resolve(filteredResults);
        }, 300);
      });

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Search failed. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchableData]);

  // Perform search when debounced search term changes
  useEffect(() => {
    performSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, performSearch]);

  // Memoized context value for better performance
  const contextValue = useMemo(() => ({
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    showResults,
    setShowResults,
    searchError
  }), [searchTerm, searchResults, isSearching, showResults, searchError]);

  return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>;
};

export default SearchContext; 