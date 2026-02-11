# Settings System Implementation Guide

## Overview

This guide explains how the Settings system is implemented in the Kids E-Commerce UI application. The system manages site configuration, contact information, and social media links through a centralized backend API.

## Architecture

The Settings system uses a layered architecture:

```
┌─────────────────────────────────┐
│   Components (Footer, etc.)     │
│   useSettingsContext()          │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   Settings Context Provider     │
│   lib/settings-context.tsx      │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   Custom Hook (useSettings)     │
│   hooks/use-settings.ts         │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   API Client (settingsApi)      │
│   lib/api-client.ts             │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   Backend API                   │
│   /api/settings/*               │
└─────────────────────────────────┘
```

## Components

### 1. API Client (`lib/api-client.ts`)

The API client provides methods for interacting with the backend Settings API:

```typescript
export const settingsApi = {
  // Get current site settings
  getCurrentSettings: async (): Promise<Settings> => {
    return apiCall<Settings>('/settings')
  },

  // Update site settings
  updateCurrentSettings: async (settings: Settings): Promise<Settings> => {
    return apiCall<Settings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }, true) // true = requires authentication
  },

  // Get social media links
  getSocialMediaLinks: async (): Promise<{
    facebook: string
    instagram: string
    twitter: string
  }> => {
    return apiCall('/settings/social-links')
  },

  // Update social media links
  updateSocialMediaLinks: async (links: {
    facebook?: string
    instagram?: string
    twitter?: string
  }): Promise<void> => {
    return apiCall('/settings/social-links', {
      method: 'PUT',
      body: JSON.stringify(links),
    }, true)
  },
}
```

### 2. Custom Hook (`hooks/use-settings.ts`)

The `useSettings()` hook manages the state and lifecycle of settings data:

**Features:**
- Automatically fetches settings on component mount
- Provides loading and error states
- Handles updates to settings and social links
- Includes refresh mechanism for manual updates

**Usage:**
```typescript
const {
  settings,        // Current settings object
  socialLinks,     // Social media URLs
  isLoading,       // Loading state
  error,          // Error message if any
  updateSettings,  // Function to update site settings
  updateSocialLinks, // Function to update social media
  refreshSettings  // Manual refresh function
} = useSettings()
```

### 3. Settings Context (`lib/settings-context.tsx`)

The Context Provider makes settings globally accessible throughout the application:

**Components:**
- `SettingsProvider` - Wrapper component that provides settings context
- `useSettingsContext()` - Hook to access settings in any component

**Setup:**
The context is already configured in `app/layout.tsx`:
```typescript
<html lang="en">
  <body className="font-sans antialiased">
    <AuthProvider>
      <CartProvider>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </CartProvider>
    </AuthProvider>
  </body>
</html>
```

## Usage Examples

### Example 1: Using Settings in a Component

```typescript
'use client'

import { useSettingsContext } from '@/lib/settings-context'

export function MyComponent() {
  const { settings, isLoading, error } = useSettingsContext()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>{settings?.name}</h1>
      <p>{settings?.email}</p>
      <p>{settings?.phoneNumber}</p>
    </div>
  )
}
```

### Example 2: Updating Settings from Admin Panel

```typescript
'use client'

import { useSettingsContext } from '@/lib/settings-context'

export function SettingsForm() {
  const { updateSettings } = useSettingsContext()
  const [name, setName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateSettings({
        name: name,
        phoneNumber: '+90...',
        email: 'info@example.com',
        address: '...'
      })
      alert('Settings updated successfully!')
    } catch (err) {
      alert('Failed to update settings')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form inputs */}
    </form>
  )
}
```

### Example 3: Social Media Links in Footer

```typescript
export function Footer() {
  const { socialLinks } = useSettingsContext()

  return (
    <footer>
      {socialLinks?.facebook && (
        <a href={socialLinks.facebook} target="_blank">
          <Facebook />
        </a>
      )}
      {socialLinks?.instagram && (
        <a href={socialLinks.instagram} target="_blank">
          <Instagram />
        </a>
      )}
      {socialLinks?.twitter && (
        <a href={socialLinks.twitter} target="_blank">
          <Twitter />
        </a>
      )}
    </footer>
  )
}
```

## Settings Management Page

**Location:** `/admin/settings`

The admin settings page provides a user-friendly interface to manage:

### Site Information
- **Site Name** - The name displayed throughout the application
- **Phone Number** - Customer contact phone number
- **Email Address** - Customer contact email
- **Address** - Physical business location

### Social Media Links
- **Facebook** - Full URL to Facebook page
- **Instagram** - Full URL to Instagram profile
- **Twitter** - Full URL to Twitter profile

**Features:**
- Real-time preview of social media links
- Success/error notifications
- Form validation
- Loading indicators
- Separate save buttons for each section

## Settings Interface

```typescript
export interface Settings {
  id?: number
  name: string              // Site name
  phoneNumber: string       // Contact phone
  address: string           // Physical address
  email: string             // Contact email
  facebookUrl?: string      // Facebook profile URL
  instagramUrl?: string     // Instagram profile URL
  twitterUrl?: string       // Twitter profile URL
}
```

## API Endpoints

The backend should provide these endpoints:

### Get Current Settings
```
GET /api/settings
Response: Settings object
```

### Update Settings
```
PUT /api/settings
Auth: Required (Admin)
Body: Settings object
Response: Updated Settings object
```

### Get Social Media Links
```
GET /api/settings/social-links
Response: { facebook, instagram, twitter }
```

### Update Social Media Links
```
PUT /api/settings/social-links
Auth: Required (Admin)
Body: { facebook?, instagram?, twitter? }
```

## Error Handling

The system includes comprehensive error handling:

1. **Loading State** - Shows loading indicators while fetching
2. **Error Messages** - Displays user-friendly error messages
3. **Failed Updates** - Catches and reports update failures
4. **Network Issues** - Handles API connection problems

Example:
```typescript
const { error, isLoading } = useSettingsContext()

if (isLoading) return <Skeleton />
if (error) return <ErrorAlert message={error} />
```

## Security Considerations

1. **Authentication Required** - Settings updates require admin authentication
2. **Token Management** - Handled automatically by the API client
3. **URL Validation** - Social media links are validated as URLs
4. **Access Control** - Backend should verify admin status before allowing updates

## Best Practices

1. **Always use `useSettingsContext()`** instead of direct API calls in components
2. **Handle loading states** in UI components
3. **Validate data** before sending updates
4. **Show success/error feedback** to users
5. **Use settings for dynamic content** (like Footer social links)
6. **Cache settings** at the context level to reduce API calls

## Troubleshooting

### Settings not loading
- Check if SettingsProvider is in layout.tsx
- Verify backend API is running and accessible
- Check browser console for network errors

### Updates not saving
- Ensure user is authenticated as admin
- Verify backend has proper authorization checks
- Check network requests in browser DevTools

### Social links not displaying
- Verify links are valid URLs
- Check if links are empty strings (component skips display)
- Verify social media icons are imported from lucide-react

## Integration Checklist

- [x] API client configured with `settingsApi`
- [x] Custom hook `useSettings()` implemented
- [x] Settings Context created and configured
- [x] SettingsProvider added to root layout
- [x] Footer updated to use settings context
- [x] Admin settings page created at `/admin/settings`
- [x] Error handling implemented
- [x] Loading states handled
- [x] Social media links functional
- [x] Backend endpoints documented

## Next Steps

1. **Implement backend endpoints** in your C# API
2. **Test settings operations** through the admin panel
3. **Configure social media links** for your business
4. **Add more settings** as needed (e.g., business hours, tax info)
5. **Customize admin page** with additional fields if required

## Support

For issues or questions:
1. Check the API Integration Guide
2. Review component implementations
3. Check browser console for errors
4. Verify backend API responses match expected format
