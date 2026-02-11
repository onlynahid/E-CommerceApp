# AYYUAZ E-Commerce Frontend Integration Guide

## 🎯 Overview

This Next.js frontend is fully integrated with the AYYUAZ E-Commerce API backend. The integration includes:

- **Authentication System**: User login, registration, and session management
- **Product Management**: Fetch, filter, search, and display products
- **Shopping Cart**: Client-side cart with persistent storage
- **Categories**: Dynamic category navigation
- **Orders**: Create and manage orders
- **Admin Features**: Admin dashboard access (when authenticated as admin)

## 🚀 Quick Start

### 1. Environment Setup

The API configuration is already set in `lib/utils.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://localhost:7038/api',
  FRONTEND_URL: 'http://localhost:3000',
  JWT_EXPIRY: 1440 * 60 * 60 * 1000, // 1440 hours
}
```

### 2. Start the Application

```bash
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
lib/
├── api-client.ts       # All API endpoints and types
├── auth-context.tsx    # Authentication state management
├── cart-context.tsx    # Shopping cart state management
└── utils.ts           # API config and helper functions

hooks/
├── use-products.ts    # Product fetching hooks
├── use-categories.ts  # Category fetching hooks
└── use-orders.ts      # Order management hooks

components/
├── header.tsx         # Navigation with auth & cart
├── products-section.tsx # Product listing
├── product-card.tsx   # Individual product card
└── ...other components
```

## 🔐 Authentication

### Login Example

```typescript
import { useAuth } from '@/lib/auth-context'

export function LoginForm() {
  const { login, isLoading, error } = useAuth()
  
  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password)
      // User is now authenticated
    } catch (err) {
      console.error('Login failed:', err)
    }
  }
  
  return (
    // Your login form UI
  )
}
```

### Check Authentication State

```typescript
const { user, isAuthenticated, isAdmin, logout } = useAuth()

if (isAuthenticated) {
  console.log(`Welcome ${user?.fullName}`)
}

if (isAdmin) {
  // Show admin panel access
}
```

## 🛍️ Products

### Fetch All Products

```typescript
import { useProducts } from '@/hooks/use-products'

export function ProductList() {
  const { products, isLoading, error, searchProducts } = useProducts()
  
  const handleSearch = async (query: string) => {
    await searchProducts(query)
  }
  
  return (
    // Display products
  )
}
```

### Filter Products

```typescript
const { filterProducts } = useProducts()

const filters = {
  ageGroups: ['Adult', 'Teen'],
  materials: ['Cotton'],
  minPrice: 50,
  maxPrice: 200,
}

await filterProducts(filters)
```

### Get Product Details

```typescript
import { useProduct } from '@/hooks/use-products'

export function ProductDetail({ productId }: { productId: number }) {
  const { product, isLoading, error } = useProduct(productId)
  
  return (
    // Display product details
  )
}
```

## 🛒 Shopping Cart

### Add to Cart

```typescript
import { useCart } from '@/lib/cart-context'

const { addItem, removeItem, updateQuantity, totalPrice } = useCart()

// Add product to cart
addItem(product, quantity)

// Update quantity
updateQuantity(productId, newQuantity)

// Remove from cart
removeItem(productId)
```

### Cart State

```typescript
const { items, totalItems, totalPrice, clearCart } = useCart()

// items: CartItem[] - Array of {product, quantity}
// totalItems: number - Total quantity of items
// totalPrice: number - Total price in AZN
```

## 📦 Categories

### Fetch Categories

```typescript
import { useCategories } from '@/hooks/use-categories'

export function CategoryList() {
  const { categories, isLoading, error } = useCategories()
  
  return (
    // Display categories
  )
}
```

### Get Category with Products

```typescript
const { getCategoryWithProducts } = useCategories()

const categoryWithProducts = await getCategoryWithProducts(categoryId)
```

## 📋 Orders

### Create Order

```typescript
import { useOrders } from '@/hooks/use-orders'

const { createOrder, isLoading, error } = useOrders()

const orderData = {
  fullName: 'John Doe',
  phoneNumber: '+994501234567',
  email: 'john@example.com',
  address: 'Baku, Azerbaijan',
  notes: 'Delivery notes',
  orderItems: [
    { productId: 1, quantity: 2 }
  ]
}

try {
  const order = await createOrder(orderData)
  console.log('Order created:', order)
} catch (err) {
  console.error('Failed to create order:', err)
}
```

### Get Order Details

```typescript
const { getOrder } = useOrders()

const order = await getOrder(orderId)
```

## 📡 Direct API Access

You can also use the API client directly:

```typescript
import { 
  productsApi, 
  categoriesApi, 
  ordersApi, 
  authApi 
} from '@/lib/api-client'

// Search products
const results = await productsApi.search('toy')

// Get latest products
const latest = await productsApi.getLatest(10)

// Get categories with products
const categories = await categoriesApi.getWithProducts()

// Check if user is authenticated
const isAuth = authApi.isAuthenticated()
const user = authApi.getCurrentUser()
```

## 🔑 Available API Methods

### Authentication (`authApi`)
- `login(credentials)` - Login user
- `register(credentials)` - Register new user
- `logout()` - Logout user
- `getCurrentUser()` - Get current user from localStorage
- `isAuthenticated()` - Check if user is logged in
- `isAdmin()` - Check if user is admin

### Products (`productsApi`)
- `getAll()` - Get all products
- `getById(id)` - Get single product
- `getByCategory(categoryId)` - Get products by category
- `search(term)` - Search products
- `filter(filters)` - Filter products by criteria
- `getPriceRange(min, max)` - Get products in price range
- `getLatest(count)` - Get latest products
- `getSortedByPrice(ascending)` - Get products sorted by price
- `getWithDiscounts()` - Get products with discounts

### Categories (`categoriesApi`)
- `getAll()` - Get all categories
- `getById(id)` - Get single category
- `getWithProducts()` - Get categories with their products
- `search(term)` - Search categories

### Orders (`ordersApi`)
- `create(orderData)` - Create new order
- `getById(id)` - Get order details
- `update(id, data)` - Update order
- `delete(id)` - Delete order

## 🎨 UI Components

### Header Component
Located in `components/header.tsx`
- Shows current user info
- Displays cart item count
- Navigation links
- User logout button
- Responsive mobile menu

### Product Card Component
Located in `components/product-card.tsx`
- Displays product with Image, price, rating
- Add to cart button
- Favorite button
- Discount badge
- Stock status indicator

### Products Section Component
Located in `components/products-section.tsx`
- Product grid display
- Filtering and sorting
- Loading states
- Error handling
- Responsive layout

## ⚠️ Error Handling

All API calls include error handling:

```typescript
import { ApiError } from '@/lib/utils'

try {
  const products = await productsApi.getAll()
} catch (err) {
  if (err instanceof ApiError) {
    console.error(`API Error ${err.status}: ${err.message}`)
  } else {
    console.error('Unknown error:', err)
  }
}
```

## 💾 Local Storage

The app uses localStorage for persistence:

- `ayyuaz_token` - JWT authentication token
- `ayyuaz_user` - Current user information
- `ayyuaz_cart_items` - Shopping cart items

## 🔄 State Management

### Auth Context
- Manages user authentication state
- Handles login/register/logout
- Provides user info and admin status

### Cart Context
- Manages shopping cart items
- Persists cart to localStorage
- Calculates totals

## 📝 Common Tasks

### Display User Name in Header
```typescript
import { useAuth } from '@/lib/auth-context'

const { user } = useAuth()
if (user) {
  console.log(`Hello ${user.fullName}`)
}
```

### Show Admin Panel Link
```typescript
const { user, isAdmin } = useAuth()

if (isAdmin) {
  <a href="/admin">Admin Dashboard</a>
}
```

### Calculate Discount
```typescript
import { calculateDiscount } from '@/lib/utils'

const discountedPrice = calculateDiscount(100, 20) // 80
```

### Format Price
```typescript
import { formatPrice } from '@/lib/utils'

const formatted = formatPrice(99.99) // "99,99 ₼"
```

## 🚨 Troubleshooting

### "useAuth must be used within an AuthProvider"
- Make sure your components are wrapped with `AuthProvider`
- This is already done in `app/layout.tsx`

### "useCart must be used within a CartProvider"
- Same issue as above, should already be wrapped in `app/layout.tsx`

### API Connection Fails
- Check if backend is running at `https://localhost:7038`
- Verify CORS settings in backend
- Check browser console for HTTPS certificate warnings

### Cart Data Lost on Refresh
- Cart is saved to localStorage automatically
- Check browser's localStorage is not cleared
- Check privacy/incognito mode settings

## 📚 Next Steps

1. **Create Login Page**: `app/auth/login/page.tsx`
2. **Create Register Page**: `app/auth/register/page.tsx`
3. **Create Product Detail Page**: `app/products/[id]/page.tsx`
4. **Create Cart Page**: `app/cart/page.tsx`
5. **Create Checkout Page**: `app/checkout/page.tsx`
6. **Create Admin Dashboard**: `app/admin/page.tsx`

## 📞 API Configuration

If you need to change API settings, edit `lib/utils.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://your-backend-url/api',  // Change backend URL
  FRONTEND_URL: 'http://localhost:3000',
  JWT_EXPIRY: 1440 * 60 * 60 * 1000,
}
```

## ✅ Integration Checklist

- ✅ API client configured
- ✅ Authentication system set up
- ✅ Cart system implemented
- ✅ Product fetching integrated
- ✅ Category fetching integrated
- ✅ Order creation ready
- ✅ Header updated with auth & cart
- ✅ Product cards with add-to-cart
- ✅ Loading and error states
- ✅ LocalStorage persistence
- ⏳ Login page (to create)
- ⏳ Product detail page (to create)
- ⏳ Cart/Checkout pages (to create)
- ⏳ Admin dashboard (to create)
- ⏳ Order history page (to create)

---

## 🔧 Backend Integration: FormData Array Deserialization

### Overview

The admin product creation/update feature sends FormData containing JSON-serialized arrays for product attributes (ageGroups, materials, size, colors). The backend needs to be configured to properly deserialize these JSON strings back into arrays.

### Problem

When sending FormData with JSON-stringified arrays:
```javascript
formData.append('AgeGroups', JSON.stringify(['Adult', 'Teen']))
formData.append('Materials', JSON.stringify(['Cotton', 'Polyester']))
```

The default .NET model binder receives the string `'["Adult", "Teen"]'` instead of an array. Without custom deserialization, the arrays remain null or empty.

### Solution: Custom JSON Converter

Add this custom JSON converter class to your backend project (e.g., in `Infrastructure/Converters/JsonStringArrayConverter.cs`):

```csharp
using System.Text.Json;
using System.Text.Json.Serialization;

namespace YourNamespace.Infrastructure.Converters
{
    /// <summary>
    /// Custom JSON converter that handles both JSON strings and arrays for string[] properties.
    /// This allows FormData fields containing JSON-stringified arrays to be properly deserialized.
    /// </summary>
    public class JsonStringArrayConverter : JsonConverter<string[]>
    {
        public override string[]? Read(
            ref Utf8JsonReader reader,
            Type typeToConvert,
            JsonSerializerOptions options)
        {
            switch (reader.TokenType)
            {
                case JsonTokenType.String:
                    // Handle case where array is sent as a JSON string: '["item1", "item2"]'
                    string? json = reader.GetString();
                    if (string.IsNullOrEmpty(json))
                    {
                        return Array.Empty<string>();
                    }

                    try
                    {
                        // Deserialize the JSON string into an array
                        return JsonSerializer.Deserialize<string[]>(json, options) 
                            ?? Array.Empty<string>();
                    }
                    catch
                    {
                        // If deserialization fails, return the string as a single-element array
                        return new[] { json };
                    }

                case JsonTokenType.StartArray:
                    // Handle normal array: ["item1", "item2"]
                    return JsonSerializer.Deserialize<string[]>(ref reader, options) 
                        ?? Array.Empty<string>();

                case JsonTokenType.Null:
                    return null;

                default:
                    throw new JsonException($"Unexpected token {reader.TokenType} when parsing array.");
            }
        }

        public override void Write(
            Utf8JsonWriter writer,
            string[]? value,
            JsonSerializerOptions options)
        {
            // Use default serialization for writing
            JsonSerializer.Serialize(writer, value, options);
        }
    }
}
```

### Configuration: Update Startup/Program.cs

**For .NET 6+** (using `Program.cs`):

```csharp
using YourNamespace.Infrastructure.Converters;

// ... other usings ...

var builder = WebApplicationBuilder.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        
        // Register the custom converter for string arrays
        options.JsonSerializerOptions.Converters.Add(new JsonStringArrayConverter());
    });

// ... rest of configuration ...

var app = builder.Build();

// ... middleware ...

app.Run();
```

**For .NET Framework** (using `Startup.cs`):

```csharp
using YourNamespace.Infrastructure.Converters;

public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers()
            .AddJsonOptions(options =>
            {
                var jsonSerializerOptions = options.JsonSerializerOptions;
                jsonSerializerOptions.PropertyNameCaseInsensitive = true;
                jsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
                
                // Register the custom converter
                jsonSerializerOptions.Converters.Add(new JsonStringArrayConverter());
            });
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        // ... middleware configuration ...
    }
}
```

### DTO Configuration

Ensure your DTOs are properly configured:

```csharp
using System.Text.Json.Serialization;
using YourNamespace.Infrastructure.Converters;

public class CreateProductDto
{
    [Required(ErrorMessage = "Product name is required")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Description is required")]
    public string Description { get; set; } = string.Empty;

    [Range(0, double.MaxValue, ErrorMessage = "Price must be positive")]
    public decimal Price { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Stock cannot be negative")]
    public int Stock { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Category ID is required")]
    public int CategoryId { get; set; }

    [Range(0, 100, ErrorMessage = "Discount percentage must be 0-100")]
    public decimal DiscountPercentage { get; set; } = 0;

    // Apply the custom converter to array properties
    [JsonConverter(typeof(JsonStringArrayConverter))]
    public string[]? AgeGroups { get; set; } = Array.Empty<string>();

    [JsonConverter(typeof(JsonStringArrayConverter))]
    public string[]? Materials { get; set; } = Array.Empty<string>();

    [JsonConverter(typeof(JsonStringArrayConverter))]
    public string[]? Size { get; set; } = Array.Empty<string>();

    [JsonConverter(typeof(JsonStringArrayConverter))]
    public string[]? Colors { get; set; } = Array.Empty<string>();

    // Image file is handled separately via FormData
    [JsonIgnore]
    public IFormFile? Image { get; set; }
}

public class UpdateProductDto : CreateProductDto
{
    [Range(1, int.MaxValue, ErrorMessage = "Product ID is required")]
    public int ProductId { get; set; }
}
```

### Controller Implementation

```csharp
using Microsoft.AspNetCore.Mvc;
using YourNamespace.Application.DTOs;
using YourNamespace.Application.Services;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> CreateProduct([FromForm] CreateProductDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var product = await _productService.CreateProductAsync(dto);
            return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateProduct(int id, [FromForm] UpdateProductDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        dto.ProductId = id;

        try
        {
            var product = await _productService.UpdateProductAsync(dto);
            return Ok(product);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductById(int id)
    {
        var product = await _productService.GetProductByIdAsync(id);
        if (product == null)
            return NotFound();

        return Ok(product);
    }
}
```

### Service Implementation Example

```csharp
public class ProductService : IProductService
{
    private readonly IProductRepository _repository;
    private readonly IImageService _imageService;

    public ProductService(IProductRepository repository, IImageService imageService)
    {
        _repository = repository;
        _imageService = imageService;
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductDto dto)
    {
        // Handle image upload
        string? ImageUrl = null;
        if (dto.Image?.Length > 0)
        {
            imageUrl = await _imageService.UploadImageAsync(dto.Image);
        }

        // Create product entity
        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            Stock = dto.Stock,
            CategoryId = dto.CategoryId,
            DiscountPercentage = dto.DiscountPercentage,
            ImageUrl = imageUrl,
            
            // Arrays are now properly deserialized
            AgeGroups = dto.AgeGroups ?? Array.Empty<string>(),
            Materials = dto.Materials ?? Array.Empty<string>(),
            Size = dto.Size ?? Array.Empty<string>(),
            Colors = dto.Colors ?? Array.Empty<string>(),
            
            CreatedAt = DateTime.UtcNow,
        };

        var created = await _repository.AddAsync(product);
        return MapToDto(created);
    }

    public async Task<ProductDto> UpdateProductAsync(UpdateProductDto dto)
    {
        var product = await _repository.GetByIdAsync(dto.ProductId);
        if (product == null)
            throw new KeyNotFoundException($"Product with ID {dto.ProductId} not found");

        // Update basic properties
        product.Name = dto.Name;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.Stock = dto.Stock;
        product.CategoryId = dto.CategoryId;
        product.DiscountPercentage = dto.DiscountPercentage;

        // Update arrays
        product.AgeGroups = dto.AgeGroups ?? Array.Empty<string>();
        product.Materials = dto.Materials ?? Array.Empty<string>();
        product.Size = dto.Size ?? Array.Empty<string>();
        product.Colors = dto.Colors ?? Array.Empty<string>();

        // Handle new image if provided
        if (dto.Image?.Length > 0)
        {
            // Delete old image if exists
            if (!string.IsNullOrEmpty(product.ImageUrl))
            {
                await _imageService.DeleteImageAsync(product.ImageUrl);
            }

            product.ImageUrl = await _imageService.UploadImageAsync(dto.Image);
        }

        var updated = await _repository.UpdateAsync(product);
        return MapToDto(updated);
    }

    private ProductDto MapToDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            FinalPrice = product.Price - (product.Price * product.DiscountPercentage / 100),
            Stock = product.Stock,
            CategoryId = product.CategoryId,
            DiscountPercentage = product.DiscountPercentage,
            ImageUrl = product.ImageUrl,
            AgeGroups = product.AgeGroups,
            Materials = product.Materials,
            Size = product.Size,
            Colors = product.Colors,
            CreatedAt = product.CreatedAt,
        };
    }
}
```

### Testing the Integration

You can test the FormData submission using curl:

```bash
curl -X POST "https://localhost:7038/api/product" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Test Product" \
  -F "description=Test Description" \
  -F "price=99.99" \
  -F "stock=10" \
  -F "categoryId=1" \
  -F "ageGroups=[\"Adult\",\"Teen\"]" \
  -F "materials=[\"Cotton\",\"Polyester\"]" \
  -F "size=[\"M\",\"L\",\"XL\"]" \
  -F "colors=[\"Red\",\"Blue\"]" \
  -F "Image=@/path/to/image.jpg"
```

### Troubleshooting

**Issue**: Arrays are still null or empty after submission
- **Solution**: Ensure the custom converter is registered in your JsonSerializerOptions
- Check that the converter is applied to all array properties in your DTO

**Issue**: ModelState validation fails
- **Solution**: Check the browser's Network tab to see the actual FormData being sent
- Verify that the DTO properties match the FormData field names (case-insensitive)

**Issue**: Image upload fails while arrays work
- **Solution**: Ensure IFormFile is marked with `[FromForm]` attribute
- Check file size limits in your hosting configuration

**Issue**: "Unexpected token" error during deserialization
- **Solution**: This means the converter received an unexpected JSON format
- Ensure the frontend is properly stringifying arrays: `JSON.stringify(array)`

### Frontend Code Reference

The frontend sends FormData like this:

```typescript
const formDataToSend = new FormData()
formDataToSend.append('Name', formData.Name)
formDataToSend.append('Description', formData.Description)
formDataToSend.append('Price', formData.Price.toString())
formDataToSend.append('Stock', formData.Stock.toString())
formDataToSend.append('CategoryId', formData.CategoryId.toString())

// Arrays are JSON-stringified
formDataToSend.append('AgeGroups', JSON.stringify(formData.AgeGroups))
formDataToSend.append('Materials', JSON.stringify(formData.Materials))
formDataToSend.append('Size', JSON.stringify(formData.Size))
formDataToSend.append('Colors', JSON.stringify(formData.Colors))

// Image file
if (selectedImage) {
  formDataToSend.append('Image', selectedImage)
}

// Send request
await adminProductsApi.create(formDataToSend)
```

### Summary

The key points for backend integration:

1. ✅ Create `JsonStringArrayConverter` class
2. ✅ Register converter in `Program.cs` or `Startup.cs`
3. ✅ Apply `[JsonConverter(typeof(JsonStringArrayConverter))]` to array DTOs
4. ✅ Ensure DTO properties are correctly named and typed
5. ✅ Handle image upload separately from array deserialization
6. ✅ Test FormData submission with curl or Postman

Once these changes are implemented, the frontend FormData submission will work seamlessly with your backend.
