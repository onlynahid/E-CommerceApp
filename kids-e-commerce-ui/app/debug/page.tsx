'use client'

import { ApiDiagnostics } from '@/components/api-diagnostics'

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">🐛 Debug Console</h1>
          <p className="text-muted-foreground">
            Use this page to diagnose API and connectivity issues
          </p>
        </div>

        {/* Environment Info */}
        <div className="bg-white p-6 rounded-lg border-2 border-gray-200 mb-6">
          <h2 className="text-xl font-bold mb-4">📊 Environment Information</h2>
          <div className="space-y-2 font-mono text-sm">
            <p>
              <strong>Frontend URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}
            </p>
            <p>
              <strong>Node Env:</strong> {process.env.NODE_ENV}
            </p>
            <p>
              <strong>Build Time:</strong> {new Date().toLocaleString()}
            </p>
          </div>
        </div>

        {/* Diagnostics Component */}
        <ApiDiagnostics />

        {/* Common Issues */}
        <div className="mt-8 bg-yellow-50 p-6 rounded-lg border-2 border-yellow-200">
          <h2 className="text-xl font-bold text-yellow-900 mb-4">⚠️ Common 404 Issues</h2>
          <div className="space-y-3 text-yellow-800 text-sm">
            <div>
              <strong>1. Backend Not Running</strong>
              <p className="text-xs mt-1">Make sure your .NET backend is running on https://localhost:7038</p>
            </div>
            <div>
              <strong>2. CORS Configuration</strong>
              <p className="text-xs mt-1">Backend must have CORS enabled for http://localhost:3000</p>
            </div>
            <div>
              <strong>3. Wrong Endpoint Path</strong>
              <p className="text-xs mt-1">Check that your backend controller routes match the API calls in api-client.ts</p>
            </div>
            <div>
              <strong>4. SSL Certificate Issues</strong>
              <p className="text-xs mt-1">HTTPS on localhost may require accepting self-signed certificates</p>
            </div>
            <div>
              <strong>5. API Response Format</strong>
              <p className="text-xs mt-1">Ensure backend returns JSON with correct response structure</p>
            </div>
          </div>
        </div>

        {/* Backend Checklist */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
          <h2 className="text-xl font-bold text-blue-900 mb-4">✅ Backend Setup Checklist</h2>
          <ul className="space-y-2 text-blue-800 text-sm list-disc list-inside">
            <li>✓ .NET backend project is running</li>
            <li>✓ Backend listening on https://localhost:7038</li>
            <li>✓ CORS middleware configured in Startup.cs</li>
            <li>✓ All required controllers exist (Product, Category, Order, AdminAuth, etc.)</li>
            <li>✓ Database is accessible and populated</li>
            <li>✓ JWT authentication is configured</li>
            <li>✓ Admin user exists with role "Admin"</li>
            <li>✓ SSL certificate is valid (or self-signed is accepted)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
