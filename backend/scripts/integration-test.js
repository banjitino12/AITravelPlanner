// backend/scripts/integration-test.js
// Simple integration test for POST /api/auth/register
// Usage: node backend/scripts/integration-test.js

const http = require('http')

const API_BASE = process.env.API_BASE || 'http://localhost:5000'
const email = process.env.TEST_EMAIL || `itest+${Date.now()}@example.com`
const password = process.env.TEST_PASSWORD || 'TestPass123!'
const username = process.env.TEST_USERNAME || 'itestuser'

console.log('Running integration test against', API_BASE)
console.log('Test user:', email)

async function run() {
  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    })

    const status = res.status
    const body = await res.json().catch(() => null)

    console.log('Status:', status)
    console.log('Response:', JSON.stringify(body, null, 2))

    if (status !== 201) {
      console.error('Expected status 201, got', status)
      process.exit(2)
    }

    if (!body || !body.user) {
      console.error('Expected response.user to be present')
      process.exit(3)
    }

    if (!body.profile) {
      console.warn('Warning: profile is null. Ensure supabase_schema.sql has been applied to create profiles table.')
    } else {
      console.log('Profile created with id:', body.profile.id)
    }

    console.log('Integration test passed')
    process.exit(0)
  } catch (err) {
    console.error('Integration test failed:', err)
    process.exit(1)
  }
}

// Node 18+ has global fetch; ensure it's available
if (typeof fetch === 'undefined') {
  global.fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
}

run()
