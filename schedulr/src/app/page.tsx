"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import styles from "./styles.module.scss";
import { useAtom } from 'jotai';
import { userAtom, userIdAtom } from '@/atoms';

export default function Home() {
  const [user, setUser] = useAtom(userAtom);
  const [userId, setUserId] = useAtom(userIdAtom);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      setUser(tokenResponse);
      setLoggedIn(true);
      
      // Fetch user info to get the unique ID
      try {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        setUserId(userInfo.data.sub); // 'sub' is the unique Google user ID
        console.log('User ID:', userInfo.data.sub);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    },
    scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.profile',
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
      router.push('/mainFunctionScreen'); // Redirect to the desired page
    }
  }, [loggedIn, router]);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>KronAI</h1>
      <div className={styles.descriptionContainer}>
        <h3>Plan Smarter,</h3>
        <h3>Schedule Faster,</h3>
        <h3>Powered by AI.</h3>
      </div>
      {user ? (
        <div>Logged in!</div>
      ) : (
        <>
          <button className={styles.loginBtn} onClick={() => login()}>
            <img src="/googleicon.webp" alt="GOOGLE"/>
            <span>Sign in with Google</span>
          </button>
          <button className={styles.loginBtn} onClick={() => login()}>
            <img src="/appleicon.png" alt="APPLE" style={{padding: "5px"}}/>
            <span>Sign in with Apple</span>
          </button>
        </>
      )}
      {userId && <p>User ID: {userId}</p>}
    </div>
  );
}
