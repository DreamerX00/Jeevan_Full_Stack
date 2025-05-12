import { useState } from 'react';
import axios from 'axios';

const ApiTest = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [baseUrl, setBaseUrl] = useState('http://localhost:8080');
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [loginResult, setLoginResult] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  
  const testEndpoints = async () => {
    setLoading(true);
    setError('');
    const testResults = {};
    
    try {
      // Test home endpoint
      try {
        const homeResponse = await axios.get(`${baseUrl}/`);
        testResults.home = {
          status: homeResponse.status,
          data: homeResponse.data,
          success: true
        };
      } catch (err) {
        testResults.home = {
          status: err.response?.status || 'Network Error',
          error: err.message,
          success: false
        };
      }
      
      // Test API info endpoint
      try {
        const apiResponse = await axios.get(`${baseUrl}/api`);
        testResults.api = {
          status: apiResponse.status,
          data: apiResponse.data,
          success: true
        };
      } catch (err) {
        testResults.api = {
          status: err.response?.status || 'Network Error',
          error: err.message,
          success: false
        };
      }
      
      // Test public endpoint
      try {
        const publicResponse = await axios.get(`${baseUrl}/api/public/test/health`);
        testResults.public = {
          status: publicResponse.status,
          data: publicResponse.data,
          success: true
        };
      } catch (err) {
        testResults.public = {
          status: err.response?.status || 'Network Error',
          error: err.message,
          success: false
        };
      }
      
      // Test direct auth endpoint
      try {
        const options = { 
          method: 'OPTIONS',
          url: `${baseUrl}/auth/login`,
          headers: {'Content-Type': 'application/json'}
        };
        
        const authOptionsResponse = await axios(options);
        testResults.authOptions = {
          status: authOptionsResponse.status,
          headers: authOptionsResponse.headers,
          success: true
        };
      } catch (err) {
        testResults.authOptions = {
          status: err.response?.status || 'Network Error',
          error: err.message,
          success: false
        };
      }
      
      // Test with api/auth endpoint
      try {
        const options = { 
          method: 'OPTIONS',
          url: `${baseUrl}/api/auth/login`,
          headers: {'Content-Type': 'application/json'}
        };
        
        const apiAuthOptionsResponse = await axios(options);
        testResults.apiAuthOptions = {
          status: apiAuthOptionsResponse.status,
          headers: apiAuthOptionsResponse.headers,
          success: true
        };
      } catch (err) {
        testResults.apiAuthOptions = {
          status: err.response?.status || 'Network Error',
          error: err.message,
          success: false
        };
      }
      
      setResults(testResults);
    } catch (err) {
      setError(`General error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const testLogin = async () => {
    setLoginLoading(true);
    setLoginResult(null);
    
    try {
      // Try with API prefix first
      try {
        console.log('Trying login with /api/auth/login path');
        const response = await axios.post(`${baseUrl}/api/auth/login`, {
          email,
          password
        }, {
          headers: {'Content-Type': 'application/json'}
        });
        
        setLoginResult({
          path: '/api/auth/login',
          status: response.status,
          data: response.data,
          success: true
        });
      } catch (prefixError) {
        console.log('Login failed with /api/auth/login path, trying /auth/login');
        console.error(prefixError);
        
        try {
          // If API prefix fails, try without it
          const response = await axios.post(`${baseUrl}/auth/login`, {
            email,
            password
          }, {
            headers: {'Content-Type': 'application/json'}
          });
          
          setLoginResult({
            path: '/auth/login',
            status: response.status,
            data: response.data,
            success: true
          });
        } catch (noPrefix) {
          console.log('Login failed with /auth/login path, trying test user endpoint');
          console.error(noPrefix);
          
          // Try the test endpoint
          try {
            const testEndpoint = await axios.get(`${baseUrl}/api/public/test/login-test-user`);
            setLoginResult({
              path: '/api/public/test/login-test-user',
              status: testEndpoint.status,
              data: testEndpoint.data,
              success: true
            });
          } catch (testErr) {
            console.error('All login attempts failed');
            throw testErr;
          }
        }
      }
    } catch (err) {
      setLoginResult({
        status: err.response?.status || 'Network Error',
        error: err.message,
        response: err.response?.data,
        success: false
      });
    } finally {
      setLoginLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Connectivity Test</h1>
      
      <div className="mb-4">
        <label className="block mb-2">Base URL:</label>
        <input
          type="text"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <button
        onClick={testEndpoints}
        disabled={loading}
        className={`px-4 py-2 rounded ${loading ? 'bg-gray-400' : 'bg-blue-600 text-white'}`}
      >
        {loading ? 'Testing...' : 'Test Endpoints'}
      </button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {Object.keys(results).length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Results:</h2>
          
          {Object.entries(results).map(([endpoint, result]) => (
            <div key={endpoint} className={`mb-4 p-4 rounded border ${result.success ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'}`}>
              <h3 className="font-bold">{endpoint}</h3>
              <div className="mt-2">
                <p><strong>Status:</strong> {result.status}</p>
                
                {result.error && (
                  <p><strong>Error:</strong> {result.error}</p>
                )}
                
                {result.data && (
                  <div>
                    <p className="mt-2"><strong>Data:</strong></p>
                    <pre className="mt-1 p-2 bg-gray-100 rounded overflow-auto max-h-40">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}
                
                {result.headers && (
                  <div>
                    <p className="mt-2"><strong>Headers:</strong></p>
                    <pre className="mt-1 p-2 bg-gray-100 rounded overflow-auto max-h-40">
                      {JSON.stringify(result.headers, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8 p-4 border rounded">
        <h2 className="text-xl font-bold mb-4">Test Direct Login</h2>
        
        <div className="mb-4">
          <label className="block mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <button
          onClick={testLogin}
          disabled={loginLoading}
          className={`px-4 py-2 rounded ${loginLoading ? 'bg-gray-400' : 'bg-blue-600 text-white'}`}
        >
          {loginLoading ? 'Testing Login...' : 'Test Login'}
        </button>
        
        {loginResult && (
          <div className={`mt-4 p-4 rounded border ${loginResult.success ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'}`}>
            <h3 className="font-bold">Login Test Result</h3>
            
            {loginResult.path && (
              <p><strong>Path:</strong> {loginResult.path}</p>
            )}
            
            <p><strong>Status:</strong> {loginResult.status}</p>
            
            {loginResult.error && (
              <p><strong>Error:</strong> {loginResult.error}</p>
            )}
            
            {loginResult.data && (
              <div>
                <p className="mt-2"><strong>Data:</strong></p>
                <pre className="mt-1 p-2 bg-gray-100 rounded overflow-auto max-h-40">
                  {JSON.stringify(loginResult.data, null, 2)}
                </pre>
              </div>
            )}
            
            {loginResult.response && (
              <div>
                <p className="mt-2"><strong>Response:</strong></p>
                <pre className="mt-1 p-2 bg-gray-100 rounded overflow-auto max-h-40">
                  {JSON.stringify(loginResult.response, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTest; 