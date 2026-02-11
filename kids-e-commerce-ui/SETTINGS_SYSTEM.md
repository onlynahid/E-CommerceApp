# Settings Management System

## Overview

This document describes the complete Settings Management System for the kids e-commerce UI. The system allows administrators to manage site configuration, contact information, and social media links through a centralized dashboard.

## Architecture

### Backend API (C# .NET)

**Endpoint:** `https://localhost:7038/api/Settings`

The backend provides a `SettingsService` with the following key features:

- **CRUD Operations**: Create, Read, Update, Delete settings
- **Current Settings Management**: Manage the active site configuration
- **Social Media Links**: Dedicated endpoints for social media management
- **Validation**: Email format and URL validation
- **Backup Support**: Settings backup functionality

### Key Backend Methods

```csharp
// Get all settings
GET /api/Settings

// Get specific settings by ID
GET /api/Settings/{id}

// Create new settings
POST /api/Settings

// Update settings
PUT /api/Settings/{id}

// Delete settings
DELETE /api/Settings/{id}

// Get current active settings
GET /api/Settings/current

// Update current settings
PUT /api/Settings/current

// Get social media links
GET /api/Settings/social-media

// Update social media links
PUT /api/Settings/social-media

// Validate settings
POST /api/Settings/validate
```

## Frontend Implementation

### 1. API Client (`lib/api-client.ts`)

The Settings API is exposed through the `settingsApi` object:

```typescript
import { settingsApi } from '@/lib/api-client'

// Get all settings
const allSettings = await settingsApi.getAll()

// Get current settings
const currentSettings = await settingsApi.getCurrentSettings()

// Update current settings
await settingsApi.updateCurrentSettings(settings)

// Get social media links
const socialLinks = await settingsApi.getSocialMediaLinks()

// Update social media links
await settingsApi.updateSocialMediaLinks({
  facebook: 'https://facebook.com/playkids',
  instagram: 'https://instagram.com/playkids',
  twitter: 'https://twitter.com/playkids'
})

// Validate settings
await settingsApi.validate(settings)
```

### 2. Settings Hook (`hooks/use-settings.ts`)

Custom React hook for managing settings state and operations:

```typescript
import { useSettings } from '@/hooks/use-settings'

export function MyComponent() {
  const {
    settings,           // Current settings object
    socialLinks,        // Social media links
    isLoading,         // Loading state
    error,             // Error message if any
    updateSettings,    // Function to update settings
    updateSocialLinks, // Function to update social links
    refreshSettings    // Function to refresh data
  } = useSettings()

  // Use settings data...
}
```

**Features:**
- Automatic data fetching on component mount
- Error handling and state management
- Real-time updates with UI feedback
- Async/await support for operations

### 3. Settings Context (`lib/settings-context.tsx`)

Global context provider for application-wide access to settings:

```typescript
import { SettingsProvider, useSettingsContext } from '@/lib/settings-context'

// In app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <SettingsProvider>
      {children}
    </SettingsProvider>
  )
}

// In any component
import { useSettingsContext } from '@/lib/settings-context'

export function MyComponent() {
  const { settings, socialLinks } = useSettingsContext()
  // Use settings throughout the app
}
```

### 4. Settings Management Page (`app/admin/settings/page.tsx`)

Comprehensive admin dashboard for managing settings:

**Features:**
- Site information management (name, phone, email, address)
- Social media links configuration
- Real-time form validation
- Success/error notifications
- Live preview of social media links
- Responsive design with Tailwind CSS

**Access:** `/admin/settings`

### 5. Updated Footer Component (`components/footer.tsx`)

The Footer component now dynamically pulls settings from the backend:

```typescript
import { useSettingsContext } from '@/lib/settings-context'

export function Footer() {
  const { settings, socialLinks } = useSettingsContext()
  
  // Display site name, contact info, and social media links
  // from backend settings
}
```

## Settings Data Structure

```typescript
interface Settings {
  id?: number
  name: string              // Site name (e.g., "PlayKids")
  phoneNumber: string       // Contact phone number
  address: string          // Physical address
  email: string            // Contact email
  facebookUrl?: string     // Facebook profile URL
  instagramUrl?: string    // Instagram profile URL
  twitterUrl?: string      // Twitter profile URL
}
```

## Usage Examples

### Example 1: Display Site Settings in Header

```typescript
'use client'

import { useSettingsContext } from '@/lib/settings-context'

export function Header() {
  const { settings } = useSettingsContext()

  return (
    <header>
      <h1>{settings?.name || 'PlayKids'}</h1>
      <p>{settings?.email}</p>
    </header>
  )
}
```

### Example 2: Contact Form with Dynamic Email

```typescript
'use client'

import { useSettingsContext } from '@/lib/settings-context'

export function ContactForm() {
  const { settings } = useSettingsContext()

  const handleSubmit = async (data: any) => {
    // Send email to settings.email
    await fetch(`/api/contact`, {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        recipientEmail: settings?.email
      })
    })
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

### Example 3: Social Media Links in Custom Component

```typescript
'use client'

import { useSettingsContext } from '@/lib/settings-context'
import { Facebook, Instagram, Twitter } from 'lucide-react'

export function SocialLinks() {
  const { socialLinks } = useSettingsContext()

  return (
    <div className="flex gap-4">
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
    </div>
  )
}
```

## Error Handling

The system includes comprehensive error handling:

```typescript
const { settings, error, isLoading } = useSettingsContext()

if (isLoading) {
  return <div>Loading settings...</div>
}

if (error) {
  return <div>Error: {error}</div>
}

return <div>{settings?.name}</div>
```

## Validation

Settings are validated on the backend:

1. **Email Validation**: Standard email format validation
2. **URL Validation**: HTTP/HTTPS URLs only
3. **Required Fields**: Site name is mandatory
4. **Phone Number**: Supports international formats

## Best Practices

1. **Wrap with SettingsProvider**: Always ensure SettingsProvider is at the root of your application
2. **Handle Loading States**: Display loaders while fetching settings
3. **Error Boundaries**: Implement error boundaries around settings-dependent components
4. **Cache Settings**: Consider caching settings on the client for better performance
5. **Lazy Load**: Use React.lazy() for the admin settings page

## Performance Considerations

- Settings are fetched once on app initialization
- Context prevents unnecessary re-renders
- Social links are cached in the hook state
- Implement revalidation strategy for real-time updates

## Security Notes

- Settings updates require authentication (token-based)
- Admin access control should be implemented at the route level
- Sensitive information (email, phone) should be handled carefully
- URL validation prevents injection attacks
- All inputs are sanitized before storage

## Future Enhancements

- [ ] Settings versioning and rollback
- [ ] Scheduled settings changes
- [ ] Multi-language support
- [ ] Settings audit log
- [ ] API key management
- [ ] Email template management
- [ ] Custom domain settings
- [ ] SSL certificate management
