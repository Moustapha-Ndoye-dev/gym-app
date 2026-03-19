const fetch = require('node-fetch');

async function testReg() {
  const data = {
    username: 'testuser_' + Date.now(),
    email: 'test' + Date.now() + '@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    gymId: 1
  };

  try {
    const res = await fetch('http://localhost:5000/api/auth/register-member', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    console.log('Status:', res.status);
    const body = await res.json();
    console.log('Body:', JSON.stringify(body, null, 2));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testReg();
