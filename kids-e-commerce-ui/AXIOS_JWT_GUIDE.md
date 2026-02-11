# Axios JWT Authentication Implementation

## Overview

A production-ready Axios instance configured for ASP.NET Core backend with automatic JWT authentication, error handling, and interceptors.

## Files Created

### 1. `lib/axios-instance.ts`
The core Axios instance with JWT authentication interceptors.

**Features:**
- ✅ Automatic Bearer token injection from localStorage
- ✅ Request/response interceptors for error handling
- ✅ 401 Unauthorized error handling (clears token)
- ✅ 403 Forbidden error handling
- ✅ Network error detection
- ✅ CORS configuration with credentials
- ✅ 10-second timeout

**Configuration:**
```typescript
baseURL: 'https://localhost:7038/api'
timeout: 10000
withCredentials: true
headers: {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

### 2. `lib/api-service.ts`
High-level API service layer with type-safe methods.

**Exports:**
- `productApiService` - All admin product operations
- `authApiService` - Admin authentication operations
- `APIError` - Custom error class with status codes

## How It Works

### Request Interceptor Flow

```
1. Request starts
   ↓
2. Check if token exists in localStorage (key: "ayyuaz_token")
   ↓
3. If token exists → Add "Authorization: Bearer <token>" header
   ↓
4. Send request to backend
```

### Response Interceptor Flow

```
1. Response received
   ↓
2. Check status code
   ├─ 401 Unauthorized → Clear token & redirect to login
   ├─ 403 Forbidden → Log warning
   ├─ Network Error → Log detailed error info
   └─ Success → Return response
   ↓
3. Handle error or return data
```

## Usage Examples

### Basic Usage

```typescript
import { productApiService, APIError } from '@/lib/api-service'

// Get all products
try {
  const products = await productApiService.getAllProducts()
  console.log(products)
} catch (error) {
  if (error instanceof APIError) {
    console.error(`Error [${error.status}]: ${error.message}`)
  }
}
```

### In React Component

```typescript
'use client'

import { useState, useEffect } from 'react'
import { productApiService, APIError } from '@/lib/api-service'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const data = await productApiService.getAllProducts()
        setProducts(data)
      } catch (err) {
        setError(err instanceof APIError ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Products ({products.length})</h1>
      {/* Render products */}
    </div>
  )
}
```

### Admin Login

```typescript
import { authApiService } from '@/lib/api-service'

async function handleLogin(email: string, password: string) {
  try {
    const response = await authApiService.adminLogin(email, password)
    // Token is automatically saved to localStorage
    console.log('Login successful', response.user)
    // Redirect to admin dashboard
  } catch (error) {
    console.error('Login failed:', error.message)
  }
}
```

### Create Product with Form Data

```typescript
async function handleCreateProduct(formData: FormData) {
  try {
    const newProduct = await productApiService.createProduct(formData)
    console.log('Product created:', newProduct)
  } catch (error) {
    console.error('Creation failed:', error.message)
  }
}

// Complete usage example matching backend API requirements:
const formData = new FormData()

// Required fields
formData.append('Name', 'Toy Car')
formData.append('Description', 'A toy car for kids')
formData.append('Price', '25.99')
formData.append('Stock', '100')
formData.append('CategoryId', '1')

// Optional: Array fields (append multiple times for array items)
formData.append('AgeGroups', '3-5')
formData.append('AgeGroups', '5-7')

formData.append('Materials', 'Plastic')
formData.append('Materials', 'Metal')

formData.append('Size', 'Small')
formData.append('Size', 'Medium')

formData.append('Colors', 'Red')
formData.append('Colors', 'Blue')

// Optional: Add discount percentage
formData.append('DiscountPercentage', '10')

// Optional: Add image file (required for product)
const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
if (fileInput?.files?.[0]) {
  formData.append('Image', fileInput.files[0])
}

await handleCreateProduct(formData)
```

**Backend Request Body Schema:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Name | string | ✅ Yes | Product name |
| Description | string | ❌ No | Product description |
| Price | number | ✅ Yes | Price as decimal (e.g., "25.99") |
| Stock | integer | ❌ No | Stock quantity |
| CategoryId | integer | ✅ Yes | Category ID (must exist) |
| Image | file/binary | ✅ Yes | Product image file |
| AgeGroups | string[] | ❌ No | Age group array (append multiple times) |
| Materials | string[] | ❌ No | Materials array (append multiple times) |
| Size | string[] | ❌ No | Size array (append multiple times) |
| Colors | string[] | ❌ No | Colors array (append multiple times) |
| DiscountPercentage | number | ❌ No | Discount percentage (0-100) |
```

### Discount Management

```typescript
import { productApiService } from '@/lib/api-service'

// Add discount
await productApiService.addDiscount(productId, 15) // 15% discount

// Update discount
await productApiService.updateDiscount(productId, 20) // Change to 20%

// Remove discount
await productApiService.removeDiscount(productId)

// Get discount info
const discount = await productApiService.getDiscount(productId)
```

### Bulk Operations

```typescript
// Apply multiple discounts at once
const discounts = [
  { productId: 1, discountPercentage: 10 },
  { productId: 2, discountPercentage: 15 },
  { productId: 3, discountPercentage: 20 },
]

await productApiService.bulkManageDiscounts(discounts)
```

## API Endpoints Reference

### Products (All require JWT authentication)

| Method | Endpoint | Function |
|--------|----------|----------|
| GET | `/adminproduct` | Get all products |
| GET | `/adminproduct/{id}` | Get product by ID |
| POST | `/adminproduct` | Create product |
| PUT | `/adminproduct/{id}` | Update product |
| DELETE | `/adminproduct/{id}` | Delete product |
| GET | `/adminproduct/paged` | Get paginated products |
| GET | `/adminproduct/search` | Search products |
| GET | `/adminproduct/category/{id}` | Get by category |
| GET | `/adminproduct/available` | Get available products |
| GET | `/adminproduct/latest` | Get latest products |
| GET | `/adminproduct/sorted/price` | Sort by price |
| GET | `/adminproduct/sorted/date` | Sort by date |
| POST | `/adminproduct/filter` | Filter products |
| GET | `/adminproduct/price-range` | Get by price range |
| GET | `/adminproduct/statistics` | Get statistics |
| GET | `/adminproduct/{id}/availability` | Check availability |
| POST | `/adminproduct/{id}/discount` | Add discount |
| PUT | `/adminproduct/{id}/discount` | Update discount |
| DELETE | `/adminproduct/{id}/discount` | Remove discount |
| GET | `/adminproduct/{id}/discount` | Get discount info |
| POST | `/adminproduct/bulk-discount` | Bulk discount management |

### Authentication

| Method | Endpoint | Function |
|--------|----------|----------|
| POST | `/AdminAuth/login` | Admin login |
| POST | `/AdminAuth/validate-token` | Validate JWT token |
| GET | `/AdminAuth/me` | Get current user info |
| POST | `/AdminAuth/change-password` | Change password |

## Error Handling

### APIError Structure

```typescript
class APIError extends Error {
  status: number      // HTTP status code (401, 403, 500, etc.)
  message: string     // Error message
  data: unknown       // Full error response from server
}
```

### Common Error Scenarios

```typescript
import { APIError } from '@/lib/api-service'

try {
  await productApiService.getAllProducts()
} catch (error) {
  if (error instanceof APIError) {
    switch (error.status) {
      case 401:
        // Token expired or invalid
        // Clear localStorage and redirect to login
        break
      case 403:
        // Access denied
        // Show permission error
        break
      case 404:
        // Not found
        break
      case 500:
        // Server error
        break
      case 0:
        // Network error
        console.log('Backend unreachable at https://localhost:7038')
        break
    }
  }
}
```

## localStorage Keys

The implementation uses the following localStorage keys:

```typescript
STORAGE_KEYS = {
  TOKEN: 'ayyuaz_token',        // JWT token
  USER: 'ayyuaz_user',          // User info
  CART: 'ayyuaz_cart',          // Shopping cart
}
```

**Token Storage Example:**
```typescript
// Automatically stored after successful login
localStorage.setItem('ayyuaz_token', 'eyJhbGciOiJIUzI1NiIs...')

// Automatically retrieved in request interceptor
const token = localStorage.getItem('ayyuaz_token')
// Added to header: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## Testing the Implementation

### 1. Test Login
```bash
# Open browser console and run:
curl -X POST https://localhost:7038/api/AdminAuth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

### 2. Test Protected Endpoint
```typescript
// In browser console:
import { productApiService } from '@/lib/api-service'

// This will fail if not logged in (401 error)
const products = await productApiService.getAllProducts()
```

### 3. Debug Token
```typescript
// Check if token exists
const token = localStorage.getItem('ayyuaz_token')
console.log('Token:', token)

// Check token payload (JWT decode)
const payload = JSON.parse(atob(token.split('.')[1]))
console.log('Token payload:', payload)
```

## Troubleshooting

### Issue: 401 Unauthorized on every request

**Cause:** Token not stored in localStorage

**Solution:**
1. Login first: `await authApiService.adminLogin(email, password)`
2. Verify token stored: `console.log(localStorage.getItem('ayyuaz_token'))`

### Issue: CORS errors

**Cause:** Backend CORS not configured

**Solution:** Ensure backend has this in `Program.cs`:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

app.UseCors("AllowAll");
```

### Issue: Token sent but still 401

**Cause:** Token expired or invalid format

**Solution:**
1. Clear localStorage: `localStorage.clear()`
2. Login again to get fresh token

### Issue: Network error connecting to backend

**Cause:** Backend not running or wrong URL

**Solution:**
1. Verify backend running at `https://localhost:7038`
2. Check HTTPS certificate is valid
3. Check firewall settings

## Configuration

To change settings, edit `lib/axios-instance.ts`:

```typescript
// Change base URL
baseURL: 'https://your-domain.com/api'

// Change timeout
timeout: 15000 // 15 seconds

// Change storage key
const token = localStorage.getItem('your_custom_key')
```

## Security Considerations

✅ **What's Secure:**
- Token stored in localStorage (accessible to JavaScript)
- JWT validation on backend
- HTTPS required for production
- CORS properly configured
- Token cleared on 401 error

⚠️ **Recommendations:**
- Use httpOnly cookies for token (if possible with backend)
- Implement token refresh mechanism
- Add request signing for extra security
- Validate token expiration on frontend
- Use environment variables for API URL

## Performance Tips

1. **Reuse Axios Instance**
   ```typescript
   // ✅ Good - single instance shared across app
   import { axiosInstance } from '@/lib/axios-instance'
   ```

2. **Cache GET Requests**
   ```typescript
   // Consider caching product lists
   const [cachedProducts, setCachedProducts] = useState(null)
   ```

3. **Cancel Pending Requests**
   ```typescript
   const controller = new AbortController()
   
   axiosInstance.get('/endpoint', {
     signal: controller.signal
   })
   
   // Cancel if component unmounts
   return () => controller.abort()
   ```

## Next Steps

1. ✅ Axios instance created with JWT support
2. ✅ API service layer with type safety
3. ✅ Error handling implemented
4. 📝 Integrate with your React components
5. 📝 Test all endpoints with real backend
6. 📝 Implement token refresh (optional)
7. 📝 Add request caching (optional)

