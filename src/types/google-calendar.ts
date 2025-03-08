// src/types/google-calendar.ts

export interface GoogleCalendar {
  id: string;
  name: string;
  accessRole: string;
}

export interface ListGoogleCalendarsResponse {
  calendars: GoogleCalendar[];
  selected_calendar_id: string;
}

export interface SelectGoogleCalendarRequest {
  calendar_id: string;
}

export interface SelectGoogleCalendarResponse {
  success: boolean;
  message: string;
}

export interface GoogleCalendarStatusResponse {
  connected: boolean;
  email?: string;
}

export interface GoogleAuthUrlResponse {
  authorization_url: string;
}

export interface DisconnectResponse {
  success: boolean;
  message: string;
}
