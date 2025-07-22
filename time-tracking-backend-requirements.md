# Time Tracking Feature - Backend Implementation Request

I've built a comprehensive time tracking feature in the frontend (Next.js with TypeScript) that needs backend support. The frontend is complete and makes specific API calls that need to be implemented.

## Overview

The feature allows independent contractors to:
- Track working sessions with start/stop functionality
- Manually add/edit/delete time entries
- View statistics (daily, weekly, monthly earnings)
- Manage payment status for each entry
- Configure default settings (hourly rate, currency)

## Frontend API Expectations

The frontend makes requests to these endpoints (all under `/api/v1/time-tracking/`):

### 1. Time Entries CRUD Operations

**GET /api/v1/time-tracking/entries**
- Query params: `start_date`, `end_date`, `payment_status`, `skip`, `limit`
- Expected response: Array of time entry objects

**GET /api/v1/time-tracking/entries/{entry_id}**
- Expected response: Single time entry object

**POST /api/v1/time-tracking/entries**
- Request body example:
```json
{
  "date": "2024-01-22",
  "start_time": "2024-01-22T09:00:00",
  "end_time": "2024-01-22T17:00:00",
  "hourly_rate": 50,
  "payment_status": "not_paid",
  "notes": "Working on time tracking feature"
}
```

**PUT /api/v1/time-tracking/entries/{entry_id}**
- Request body: Same structure as POST (all fields optional)

**DELETE /api/v1/time-tracking/entries/{entry_id}**
- Expected: 204 No Content on success

### 2. Session Management

**POST /api/v1/time-tracking/sessions/start**
- Request body:
```json
{
  "hourly_rate": 50,
  "timezone": "UTC-3"
}
```
- Expected: Returns a time entry with no end_time (active session)
- Note: The timezone parameter helps the backend set the correct date for the entry

**POST /api/v1/time-tracking/sessions/{entry_id}/stop**
- No body required
- Expected: Updates the entry with end_time and calculated totals

**GET /api/v1/time-tracking/sessions/active**
- Expected: Current active time entry or null

### 3. Statistics

**GET /api/v1/time-tracking/stats**
- Optional query param: `period` (day/week/month/year)
- Expected response:
```json
{
  "total_hours_today": 8.5,
  "total_earned_today": 425.0,
  "total_hours_week": 40.0,
  "total_earned_week": 2000.0,
  "total_hours_month": 160.0,
  "total_earned_month": 8000.0,
  "unpaid_amount": 3000.0,
  "invoiced_amount": 2000.0,
  "paid_amount": 3000.0
}
```

### 4. Settings

**GET /api/v1/time-tracking/settings**
- Expected response:
```json
{
  "default_hourly_rate": 50.0,
  "currency": "USD",
  "timezone": "UTC-3"
}
```

**PUT /api/v1/time-tracking/settings**
- Request body: Same structure as GET response

## Data Structure Expected by Frontend

### Time Entry Object
```json
{
  "id": 1,
  "date": "2024-01-22",
  "start_time": "2024-01-22T09:00:00",
  "end_time": "2024-01-22T17:00:00",
  "hourly_rate": 50,
  "total_hours": 8.0,
  "total_earned": 400.0,
  "payment_status": "not_paid",
  "notes": "Optional notes",
  "created_at": "2024-01-22T09:00:00",
  "updated_at": "2024-01-22T17:00:00",
  "user_id": 123
}
```

### Payment Status Values
The frontend expects these exact string values:
- `"not_paid"`
- `"invoiced_not_approved"`
- `"invoiced_approved"`
- `"paid"`

## Business Logic Requirements

1. **Active Sessions**: Only one active session (entry without end_time) per user at a time
2. **Automatic Calculations**: When an entry has both start_time and end_time, calculate:
   - `total_hours`: Decimal hours between start and end
   - `total_earned`: total_hours * hourly_rate
3. **User Isolation**: Users can only see/modify their own entries
4. **Statistics**: Calculate sums based on the user's current day/week/month
5. **Settings**: Create default settings on first access if none exist

## Frontend Implementation Details

The frontend uses:
- React Query for data fetching (expects standard HTTP status codes)
- ISO 8601 format for all dates/times
- Decimal numbers for hours and currency amounts
- Polling every 30 seconds for active session updates

## Authentication

All endpoints require authentication. The frontend sends a Bearer token in the Authorization header.

## Error Handling

The frontend handles standard HTTP status codes:
- 200/201: Success
- 204: Success (no content)
- 400: Validation errors
- 403: Forbidden
- 404: Not found
- 409: Conflict (e.g., active session exists)
- 500: Server error

## Implementation Notes

Please implement this feature following your project's existing patterns for:
- Database models and relationships
- API route structure
- Authentication/authorization
- Request validation
- Error handling
- Database migrations

The key is that the API responses match the JSON structures shown above exactly, as the frontend TypeScript types are already defined and expect these specific field names and formats.

## Timezone Handling

1. **Storage**: All timestamps should be stored in UTC in the database
2. **Date Field**: The `date` field represents the local date in the user's timezone when the work was performed
3. **Creating Sessions**: When starting a session with timezone "UTC-3":
   - If current UTC time is "2024-07-22 03:00:00" 
   - The local time is "2024-07-22 00:00:00" (midnight)
   - The `date` field should be "2024-07-22"
   - The `start_time` should be "2024-07-22T03:00:00Z" (stored as UTC)
4. **Backend Calculation**: Use the timezone parameter to determine the correct local date
5. **Response Format**: Always return timestamps in ISO 8601 format with timezone info (e.g., "2024-07-22T15:30:00Z") 