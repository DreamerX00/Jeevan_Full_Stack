import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Carousel from '../components/Carousel';
import QuickAccess from '../components/QuickAccess';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16">
          <Carousel />
          <QuickAccess />
          
          {/* Additional content can be added here */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Featured Doctors Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Featured Doctors</h2>
                {/* Add featured doctors content */}
              </div>
              
              {/* Latest Health Tips Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Latest Health Tips</h2>
                {/* Add health tips content */}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage; 