"use client";
import { useState } from 'react';
import TestGemini from "@/components/test-gemini/page";
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export default function Home() {
  const [user, setUser] = useState<TokenResponse | null>(null);
  const [eventAdded, setEventAdded] = useState(false);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      setUser(tokenResponse);
    },
    scope: 'https://www.googleapis.com/auth/calendar.events',
    onError: () => console.log('Login Failed'),
  });

  const addRandomEvent = async () => {
    if (!user) return;

    const event = {
      summary: 'Random Event',
      location: 'Somewhere',
      description: 'This is a randomly generated event',
      start: {
        dateTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: new Date(Date.now() + 90000000).toISOString(), // Tomorrow + 1 hour
        timeZone: 'America/Los_Angeles',
      },
    };

    try {
      const response = await axios.post(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        event,
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Event created: ', response.data.htmlLink);
      setEventAdded(true);
    } catch (error) {
      console.error('Error creating event: ', error);
    }
  };

  return (
    <div>
      {/* <p>Hello World</p> */}
      <TestGemini />
      {user ? (
        <div>
          <div>Logged in!</div>
          {eventAdded ? (
            <div>Random event added to your calendar.</div>
          ) : (
            <button onClick={addRandomEvent}>Add Random Event to Calendar</button>
          )}
        </div>
      ) : (
        <button onClick={() => login()}>Sign in with Google</button>
      )}
    </div>
  );
}
