import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from "./styles.module.scss";
import axios from 'axios';
import { eventEnhancer } from '@/utils/eventEnhancer';
import { useAtomValue } from 'jotai';
import { userAtom, userIdAtom } from '@/atoms';

export default function Footer() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const user = useAtomValue(userAtom);
  const userId = useAtomValue(userIdAtom);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const base64Image = await convertToBase64(file);
        const res = await axios.post("/api/gemini/image-to-calendar", {
          base64Image: base64Image
        });
        const initialEvent = JSON.parse(res.data.response.replace(/```json/g, '').replace(/```/g, ''));
        const enhancedEvent = await eventEnhancer(initialEvent, user, userId);
        console.log(enhancedEvent);
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result;
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const formattedBase64 = `data:${mimeType};base64,${base64String.split(',')[1]}`;
        resolve(formattedBase64);
      };
      reader.onerror = (error) => reject(error);
    });
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.gallery}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
          <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="16.5" cy="7.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M16 22C15.3805 19.7749 13.9345 17.7821 11.8765 16.3342C9.65761 14.7729 6.87163 13.9466 4.01569 14.0027C3.67658 14.0019 3.33776 14.0127 3 14.0351" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M13 18C14.7015 16.6733 16.5345 15.9928 18.3862 16.0001C19.4362 15.999 20.4812 16.2216 21.5 16.6617" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className={styles.fileUpload}/>
      </div>
      <button className={styles.voice} onClick={() => router.push("/chat")}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6V2H8"/><path d="m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z"/><path d="M2 12h2"/><path d="M9 11v2"/><path d="M15 11v2"/><path d="M20 12h2"/></svg>
      </button>
    </div>
  );
}
