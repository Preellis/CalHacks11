import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const params = await request.json();
    const { userId, eventDetails } = params;

    // Initialize Google Calendar API
    const calendar = google.calendar('v3');
    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: process.env.GOOGLE_CLIENT_EMAIL, private_key: process.env.GOOGLE_PRIVATE_KEY },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    // Create the event
    const event = {
        title: eventDetails.title, // Event title
        location: eventDetails.location, // Event location

          dateTime: eventDetails.dateTime, // Start time in ISO format

          endDateTime: eventDetails.endDateTime, // End time in ISO format
      
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // Reminder 24 hours before the event
            { method: 'popup', minutes: 10 }, // Popup reminder 10 minutes before
          ],
        },
      };
  
      // Authorize client and insert event into calendar
      const authClient = await auth.getClient();
      const calendarId = 'primary'; // Use 'primary' calendar for user or specify a different calendar ID
      const response = await calendar.events.insert({
        auth: authClient,
        calendarId,
        requestBody: event,
      });
  
      // Return the response to the client
      return NextResponse.json({
        success: true,
        eventId: response.data.id,
        message: 'Event successfully created!',
      });
    } catch (error) {
      console.error('Error creating event: ', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to create event.',
      });
    }
  }
  