const axios = require('axios');

const testAdminAuth = async () => {
  try {
    console.log('🔍 Testing admin authentication...');
    
    // Test login
    const loginResponse = await axios.post('http://localhost:3001/api/v1/admin-auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('✅ Login successful!');
    console.log('Token:', loginResponse.data.token);
    
    // Test profile endpoint with token
    const token = loginResponse.data.token;
    const profileResponse = await axios.get('http://localhost:3001/api/v1/admin-auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Profile fetch successful!');
    console.log('Profile data:', profileResponse.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

testAdminAuth(); 