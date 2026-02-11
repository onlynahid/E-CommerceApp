'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react'
import { API_CONFIG } from '@/lib/utils'

interface TestResult {
  name: string
  status: 'success' | 'error' | 'loading' | 'warning'
  message: string
  details?: string
}

export function ApiDiagnostics() {
  const [results, setResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runDiagnostics = async () => {
    setIsRunning(true)
    setResults([])
    const newResults: TestResult[] = []

    // Test 1: Check backend connectivity
    newResults.push({
      name: 'Backend Connectivity',
      status: 'loading',
      message: 'Testing connection to backend...',
    })
    setResults([...newResults])

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/validate-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: 'test' }),
      })
      
      newResults[0] = {
        name: 'Backend Connectivity',
        status: response.status === 401 ? 'warning' : response.ok ? 'success' : 'error',
        message: response.ok 
          ? '✓ Backend is running and responding' 
          : `Response status: ${response.status}`,
        details: `Endpoint: ${API_CONFIG.BASE_URL}/auth/validate-token`,
      }
    } catch (err) {
      newResults[0] = {
        name: 'Backend Connectivity',
        status: 'error',
        message: '✗ Cannot connect to backend',
        details: err instanceof Error ? err.message : 'Unknown error',
      }
    }
    setResults([...newResults])

    // Test 2: Check products endpoint
    newResults.push({
      name: 'Products Endpoint',
      status: 'loading',
      message: 'Testing /product endpoint...',
    })
    setResults([...newResults])

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/product`, {
        headers: { 'Accept': 'application/json' },
      })
      
      newResults[1] = {
        name: 'Products Endpoint',
        status: response.ok ? 'success' : response.status === 404 ? 'error' : 'warning',
        message: response.ok 
          ? '✓ Products endpoint is working' 
          : `Response status: ${response.status}`,
        details: `Endpoint: ${API_CONFIG.BASE_URL}/product`,
      }
    } catch (err) {
      newResults[1] = {
        name: 'Products Endpoint',
        status: 'error',
        message: '✗ Cannot reach products endpoint',
        details: err instanceof Error ? err.message : 'Unknown error',
      }
    }
    setResults([...newResults])

    // Test 3: Check admin login endpoint
    newResults.push({
      name: 'Admin Auth Endpoint',
      status: 'loading',
      message: 'Testing /AdminAuth/login endpoint...',
    })
    setResults([...newResults])

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/AdminAuth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'test' }),
      })
      
      newResults[2] = {
        name: 'Admin Auth Endpoint',
        status: response.status === 401 ? 'warning' : response.ok ? 'success' : response.status === 404 ? 'error' : 'warning',
        message: response.ok 
          ? '✓ Admin auth endpoint exists' 
          : response.status === 401
          ? '⚠ Endpoint exists but invalid credentials'
          : `Response status: ${response.status}`,
        details: `Endpoint: ${API_CONFIG.BASE_URL}/AdminAuth/login`,
      }
    } catch (err) {
      newResults[2] = {
        name: 'Admin Auth Endpoint',
        status: 'error',
        message: '✗ Cannot reach admin auth endpoint',
        details: err instanceof Error ? err.message : 'Unknown error',
      }
    }
    setResults([...newResults])

    // Test 4: Check localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('ayyuaz_token') : null
    newResults.push({
      name: 'Local Storage',
      status: token ? 'success' : 'warning',
      message: token ? '✓ Token is stored' : '⚠ No token in storage',
      details: token ? `Token length: ${token.length} characters` : 'You may need to login first',
    })
    setResults([...newResults])

    setIsRunning(false)
  }

  const getIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'loading':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
      default:
        return null
    }
  }

  const getBackgroundColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'loading':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">🔧 API Diagnostics</h2>
        <p className="text-muted-foreground mb-4">
          Test your backend connection and API endpoints
        </p>
        <p className="text-sm text-gray-600 mb-4">
          <strong>Backend URL:</strong> {API_CONFIG.BASE_URL}
        </p>
        <Button onClick={runDiagnostics} disabled={isRunning}>
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Running Tests...
            </>
          ) : (
            '▶ Run Diagnostics'
          )}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${getBackgroundColor(result.status)}`}
            >
              <div className="flex items-start gap-3">
                {getIcon(result.status)}
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{result.name}</p>
                  <p className="text-sm text-gray-700">{result.message}</p>
                  {result.details && (
                    <p className="text-xs text-gray-600 mt-2 font-mono">
                      {result.details}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <h3 className="font-bold text-blue-900 mb-2">💡 Troubleshooting Tips:</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Ensure your .NET backend is running on https://localhost:7038</li>
            <li>Check backend CORS settings allow requests from http://localhost:3000</li>
            <li>Verify all API endpoints are correctly implemented on the backend</li>
            <li>Check browser DevTools Network tab for detailed error responses</li>
            <li>Clear browser cache and refresh if you recently changed backend URLs</li>
          </ul>
        </div>
      )}
    </Card>
  )
}

export default ApiDiagnostics
