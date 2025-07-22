# Backend Timezone Update

The frontend now includes timezone support. Please update the backend to handle this:

## Required Changes

### 1. Update Time Tracking Settings Model
Add a `timezone` field to store the user's preferred timezone (default: "UTC-3")

### 2. Update Start Session Endpoint
**POST /api/v1/time-tracking/sessions/start**
- Now receives: `{ "hourly_rate": 50, "timezone": "UTC-3" }`
- Use the timezone to calculate the correct local date for the `date` field
- Example: If UTC time is "2024-07-22 14:00:00" and timezone is "UTC-3", local time is "2024-07-22 11:00:00", so `date` should be "2024-07-22"

### 3. Fix Date Calculation Bug
Currently, when creating time entries, the date appears to be off (showing July 11 instead of July 22). This is likely because:
1. The backend isn't considering timezone when setting the `date` field
2. Or timestamps aren't being returned with proper timezone information

### 4. Ensure Proper Timestamp Format
All timestamps in responses should include timezone information:
- Good: `"2024-07-22T14:00:00Z"` or `"2024-07-22T14:00:00+00:00"`
- Bad: `"2024-07-22T14:00:00"` (no timezone info)

### 5. Settings Endpoint
Update the settings endpoints to include timezone:
```json
{
  "default_hourly_rate": 50.0,
  "currency": "USD",
  "timezone": "UTC-3"
}
```

## Testing
After updating, test that:
1. Starting a session creates an entry with the correct date in the user's timezone
2. All timestamps in responses include timezone information (Z suffix or offset)
3. The settings can be updated and persisted with the timezone field 