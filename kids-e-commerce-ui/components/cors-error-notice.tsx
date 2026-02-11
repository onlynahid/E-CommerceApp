'use client'

import { useState, useEffect } from 'react'
import { useProducts } from '@/hooks/use-products'
import { Product } from '@/lib/api-client'

interface FetchErrorState {
  show: boolean
  message: string
}

/**
 * CORS Error Helper Component
 * Shows setup instructions if CORS error occurs
 */
export function CorsErrorNotice({ error }: { error: string | null }) {
  if (!error || !error.includes('CORS')) {
    return null
  }

  return (
    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-bold text-yellow-900 mb-3">🔧 CORS Configuration Needed</h3>
      <p className="text-yellow-800 mb-4">
        Your backend needs CORS configuration to allow requests from the frontend.
      </p>
      
      <div className="bg-white p-4 rounded border border-yellow-200 mb-4">
        <p className="text-sm font-semibold text-gray-900 mb-2">Add this to your C# backend Program.cs:</p>
        <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto text-gray-800">
{`// Add after services.AddControllers();
services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:3000", "https://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// Add before app.UseRouting();
app.UseCors("AllowFrontend");`}
        </pre>
      </div>

      <div className="space-y-2 text-sm text-yellow-800">
        <p><strong>Steps:</strong></p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Open your C# backend <code className="bg-yellow-100 px-2 py-1 rounded">Program.cs</code></li>
          <li>Find <code className="bg-yellow-100 px-2 py-1 rounded">services.AddControllers()</code></li>
          <li>Add the CORS configuration code above it</li>
          <li>Save and restart your backend server</li>
          <li>Refresh the frontend page</li>
        </ol>
      </div>
    </div>
  )
}

/**
 * Products Loading State with CORS Diagnostic
 */
export function ProductsLoadingDiagnostic() {
  const { products, isLoading, error } = useProducts()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {error && (
        <>
          <CorsErrorNotice error={error} />
          
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-red-900 mb-2">⚠️ Error Loading Products</h3>
            <p className="text-red-800 mb-4">{error}</p>
            
            <div className="bg-white p-4 rounded border border-red-200 space-y-2 text-sm">
              <p className="font-semibold text-gray-900">Troubleshooting Steps:</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-700">
                <li>Check that backend is running at <code className="bg-gray-100 px-2 py-1 rounded">https://localhost:7038</code></li>
                <li>Verify CORS is configured in backend Program.cs</li>
                <li>Check browser console for detailed error messages</li>
                <li>Try clearing browser cache and refreshing</li>
                <li>Ensure both frontend and backend are on localhost</li>
              </ol>
            </div>
          </div>
        </>
      )}

      {isLoading && !error && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading products from backend...</p>
          <p className="text-xs text-muted-foreground mt-2">
            Connecting to: https://localhost:7038/api/product
          </p>
        </div>
      )}

      {!isLoading && !error && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No products available</p>
        </div>
      )}
    </div>
  )
}
