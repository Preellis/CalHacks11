"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TestGemini from "@/components/test-gemini/page";
import TestDeepgram from "@/components/test-deepgram/page";
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export default function Home() {
  const [user, setUser] = useState<TokenResponse | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      setUser(tokenResponse);
      setLoggedIn(true)
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
    } catch (error) {
      console.error('Error creating event: ', error);
    }
  };

  // Redirect to another page when eventAdded becomes true
  useEffect(() => {
    if (loggedIn) {
      router.push('/mainFunction'); // Redirect to the desired page
    }
  }, [loggedIn, router]);

  return (
    <div>
      <p>Hello World</p>
      <TestGemini />
      <TestDeepgram />
      {user ? (
        <div>Logged in!</div>
      ) : (
        <button onClick={() => login()}>Sign in with Google</button>
      )}
    </div>
  );
}
