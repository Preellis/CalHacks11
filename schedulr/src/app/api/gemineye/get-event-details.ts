// Importing necessary modules
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Defining the POST handler
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse the JSON request body
    const { jsonEvent } = await request.json();

    // Fetch event details using your existing endpoint
    const eventDetailsResponse = await axios.post('/api/gemineye/get-event-details', {
      jsonEvent,
    });

    // Extract event details from the response
    const eventDetails = eventDetailsResponse.data;

    // Create the final JSON for Google Calendar
    const gcalEvent = {
      title: eventDetails.data.title,
      location: eventDetails.data.location,
      dateTime: eventDetails.data.dateTime,
      endDateTime: eventDetails.data.endDateTime,
    };

    // Return the Google Calendar event as JSON response
    return NextResponse.json({ gcalEvent });
  } catch (error) {
    console.error("Error processing event:", error);
    return NextResponse.json({ error: "An error occurred while processing the event" }, { status: 500 });
  }
}
