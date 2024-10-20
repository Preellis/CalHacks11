import React, { useState, useContext } from 'react';
import styles from "./styles.module.scss";
import { MenuContext } from "@/commons/context/menuContext";
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [menuStatus, setMenuStatus] = useContext(MenuContext);
  const [userToggle, setUserToggle] = useState<boolean>(false);

  const calendarRoute = () => {
    // TODO: Fill in action
    console.log("Route to Google Calendar.")
  }

  const exitRoute = () => {
    router.push("/");
  }

  return (
    <div className={styles.navContainer}>
      <div onClick={() => {
        setMenuStatus(!menuStatus);
        setUserToggle(false);
      }
      } className={menuStatus ? `${styles.menuIcon} ${styles.active}` : `${styles.menuIcon}`}>
      </div>
      <div className={styles.title}>
        <h1>KronAI</h1>
      </div>
      <div onClick={() => {
        setUserToggle(!userToggle);
        setMenuStatus(false);
        }} className={styles.userIcon}>
        <svg className={userToggle ? `` : `${styles.active}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000">
          <path d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
      <div className={styles.utilities}>
        <div className={styles.utilitiesContainer}>
          <button onClick={() => calendarRoute()} className={userToggle ? `${styles.mapBtn} ${styles.active}` : `${styles.mapBtn}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 14h1v4"/><path d="M16 2v4"/><path d="M3 10h18"/><path d="M8 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/></svg>
          </button>
          <button onClick={() => exitRoute()} className={userToggle ? `${styles.exitBtn} ${styles.active}` : `${styles.exitBtn}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
