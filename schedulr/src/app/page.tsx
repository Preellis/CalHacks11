"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import styles from "./styles.module.scss";
import { useAtom, useSetAtom } from 'jotai';
import { userAtom, userIdAtom } from '@/atoms';

export default function Home() {
  const [user, setUser] = useAtom(userAtom);
  const setUserId = useSetAtom(userIdAtom);
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
        <button className={styles.loginBtn} style={{justifyContent: "center", gap: "10px"}} onClick={() => router.push('/mainFunctionScreen')}>
          <span>You are logged in!</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      ) : (
        <>
          <button className={styles.loginBtn} onClick={() => login()}>
            <img src="/googleicon.webp" alt="GOOGLE"/>
            <span>Sign in with Google</span>
          </button>
          <button className={styles.loginBtn} onClick={() => null}>
            <img src="/appleicon.png" alt="APPLE" style={{padding: "5px"}}/>
            <span>Sign in with Apple</span>
          </button>
        </>
      )}
    </div>
  );
}
