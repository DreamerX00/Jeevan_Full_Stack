import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';

// This component is a wrapper around search results that handles navigation properly
const SearchResultItem = ({ result }) => {
  const navigate = useNavigate();
  const { setSearchTerm, setShowResults } = useSearch();

  const handleClick = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    
    // Close the search dropdown
    setSearchTerm('');
    setShowResults(false);
    
    // Construct the URL based on result type
    let url = result.path;
    
    if (result.type === 'product') {
      url = `${result.path}?product=${result.id}`;
    } else if (result.type === 'feature') {
      if (result.title === 'Medical Records') {
        url = `${result.path}?tab=records`;
      } else if (result.title === 'Appointment Scheduling') {
        url = `${result.path}?tab=appointments`;
      } else if (result.title === 'Health Tracker') {
        url = `${result.path}?tab=tracker`;
      } else if (result.title === 'Medication Reminders') {
        url = `${result.path}?tab=medications`;
      }
    }
    
    // Use React Router's navigate
    navigate(url);
  };

  // Render different content based on result type
  return (
    <button
      onClick={handleClick}
      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded"
    >
      {result.type === 'product' ? (
        <>
          <div>{result.displayTitle}</div>
          <div className="text-xs text-gray-500">{result.subtitle}</div>
        </>
      ) : (
        <span>{result.displayTitle}</span>
      )}
    </button>
  );
};

export default SearchResultItem; 