"use client"
import React, { useState, useRef, createContext } from 'react';
import { userAtom } from '@/atoms';
import { useAtom } from 'jotai';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import styles from './styles.module.scss';
import { Camera, CameraType } from 'react-camera-pro';
import { useRouter } from 'next/navigation';
import { imageAtom } from '@/atoms';
import { MenuContext } from '@/commons/context/menuContext';

export default function MainFunctionScreen() {
  const router = useRouter();
  const camera = useRef<CameraType>(null);
  const [user, setUser] = useAtom(userAtom);
  const [image, setImage] = useAtom(imageAtom);
  const [menuStatus, setMenuStatus] = useState(false);
  console.log(user);

  const errorMessages = {
    noCamera: "No camera detected. Please check your device.",
    permissionDenied: "Camera permission denied. Please enable it.",
  };

  if (navigator.mediaDevices) {
      console.log("Browser supports camera access");
  } else {
    console.log("Browser does not support camera access");
  }

  //Saves photo to image state
  const SaveTakenPhoto = () => {
    if (camera.current) {
        const photo = camera.current.takePhoto();
        setImage(photo.toString());
        console.log(photo)
    }
  };
  //Function that handles entire functionality of camera button
  const HandleCamBtn = () => {
    SaveTakenPhoto();
    router.push('/scannedEventsScreen')
  };

      
  return (
    <MenuContext.Provider value={[menuStatus, setMenuStatus]}>
      <div className={styles.container}>
        <Navbar />
        <div className={menuStatus ? `${styles.navbarDropdown} ${styles.active}` : `${styles.navbarDropdown}`}>
          <div className={styles.eventContainer}>
            <div className={styles.events}>
              <span>Tropical Purple Party</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </div>
            <div className={styles.events}>
              <span>Tropical Purple Party</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </div>
            <div className={styles.events}>
              <span>Tropical Purple Party</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </div>
            <div className={styles.events}>
              <span>Tropical Purple Party</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </div>
          </div>
        </div>
        <div onClick={() => setMenuStatus(false)} className={menuStatus ? `${styles.darkBackground} ${styles.active}` : `${styles.darkBackground}`}/>
        <div className={styles.cameraContainer}>
          <div className={styles.cameraLens}>
            <Camera 
                ref={camera}
                errorMessages={errorMessages}
            />
          </div>
          <div className={styles.snap}>
            <button className={styles.btnContainer} onClick={() => HandleCamBtn()}>
              <div></div>
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </MenuContext.Provider>
  );
};