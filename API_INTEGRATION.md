# API Integration Guide

## Overview
The frontend now integrates with the Django REST API to fetch dynamic content from the backend.

## Setup

### Backend Setup
1. Make sure Django server is running:
```bash
cd backend
python manage.py runserver
```

2. The Content API endpoint is available at: `http://localhost:8000/contents/`
   - Changed permission to `AllowAny` for public access

### Frontend Setup
1. Install dependencies (already done):
```bash
cd frontend
npm install axios
```

2. Environment variables in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## API Utilities

Created `/lib/api.ts` with reusable API functions:

### Content API
```typescript
import { contentApi } from '@/lib/api';

// Get all contents
const response = await contentApi.getAll();

// Get single content by ID
const response = await contentApi.getById('1');

// Create new content
const response = await contentApi.create({ title: 'Title', description: 'Desc' });

// Update content
const response = await contentApi.update('1', { title: 'New Title', description: 'New Desc' });

// Delete content
const response = await contentApi.delete('1');
```

### Other Available APIs
- `sponsorApi` - Sponsor management
- `organizationApi` - Organization management  
- `scholarshipApi` - Scholarship management

## Component Implementation

The `Content.tsx` component now:
1. Fetches data from the backend on mount
2. Shows loading state while fetching
3. Displays error message if fetch fails
4. Renders both static dictionary content and dynamic API content
5. Shows "Latest Updates" section with content cards from the backend

## Adding Content via Django Admin

1. Access admin panel: http://localhost:8000/admin/
2. Login with superuser credentials
3. Navigate to "Contents" section
4. Add new content items with:
   - Title
   - Description

The frontend will automatically display these items in the "Latest Updates" section.

## CORS Configuration

CORS is already configured in `backend/core/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
CORS_ALLOW_CREDENTIALS = True
```

## Testing

1. Start backend: `python manage.py runserver` (in backend folder)
2. Start frontend: `npm run dev` (in frontend folder)
3. Add some content items in Django admin
4. Navigate to homepage to see the content displayed
