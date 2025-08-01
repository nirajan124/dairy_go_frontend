const axios = require('axios');

const testBackend = async () => {
  try {
    console.log('🔍 Testing backend server...');
    
    // Test if server is running
    const response = await axios.get('http://localhost:3001/api/v1/admin-auth/login');
    console.log('✅ Backend server is running!');
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Backend server is not running on port 3001');
      console.log('Please start the backend server with: npm start');
    } else {
      console.log('✅ Backend server is running (got expected error for GET on login endpoint)');
    }
  }
};

testBackend(); 