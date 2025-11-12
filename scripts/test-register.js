// Simple test script to call server-side registration endpoint
// Run: node scripts/test-register.js

const url = process.env.API_BASE || 'http://localhost:5000'
const email = process.env.TEST_EMAIL || `testuser+${Date.now()}@example.com`

;(async () => {
  try {
    const res = await fetch(`${url}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'TestPass123!', username: 'testauto' }),
    })

    const data = await res.json()
    console.log('status:', res.status)
    console.log('response:', JSON.stringify(data, null, 2))
  } catch (err) {
    console.error('Request failed:', err)
  }
})()
