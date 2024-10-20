import { TokenResponse } from "@react-oauth/google";
import axios from "axios";

interface CalendarEvent {
  eventname?: string;
  start?: string;
  end?: string;
  location?: string;
  description?: string;
  context?: string;
}
export const eventEnhancer = async (event: CalendarEvent, user?: TokenResponse, userId?: string) => {
  if (!user || !userId) return false;
  if (event.context) {
    const chromaContext = axios.post(
      '/api/chroma/get-context', 
      {
        userId: userId,
        query: event.context
      }
    )
    const perplexityContext = ''

    const contextPrompt = 
`\
Please fill in any missing info in my event details from the JSON below.
${JSON.stringify(event)}
Here is the context that may help you figure out more about the event in searches:
From memory: ${chromaContext}
From the internet: ${perplexityContext}
I expect you to respond with only the .json and nothing else. The .json should
be in the format of 'eventname', 'description', 'start', 'end', 'location'.
The 'start' and 'end' should be in ISO string timestamp format. If any values are
not found, return null for that category in .json.
`
    const res = await axios.post('/api/gemini', {prompt: contextPrompt,})
    event = JSON.parse(res.data.response)
  }
  const googleCalendarEvent = {
    summary: event.eventname ?? 'Untitled Event',
    location: event.location ?? 'No location provided',
    description: event.description ?? 'No description provided',
    start: {
      dateTime: new Date(event.start ?? Date.now()).toISOString(),
      timeZone: 'America/Los_Angeles',
    },
    end: {
      dateTime: new Date(event.start ?? (Date.now() + 3600000)).toISOString(), // + 1 hour
      timeZone: 'America/Los_Angeles',
    },
  };

  try {
    const response = await axios.post(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      googleCalendarEvent,
      {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Event created: ', response.data.htmlLink);
    localStorage.setItem('events', JSON.stringify([...JSON.parse(localStorage.getItem('events') ?? '[]'), googleCalendarEvent]));
    return true;
  } catch (error) {
    console.error('Error creating event: ', error);
    return false;
  }
}