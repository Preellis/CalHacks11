"use client"
import { userAtom } from '@/atoms';
import Camera from '@/components/CameraComponent/page';
import { useAtom } from 'jotai';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import styles from './styles.module.scss';

export default function MainFunctionScreen() {
  const [user, setUser] = useAtom(userAtom);
  console.log(user);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log("Browser supports camera access");
      } else {
        console.log("Browser does not support camera access");
      }
      
    return (
      <div>
        <Navbar />
        <div className={styles.cameraContainer}>
          {/* <Camera/> */}
        </div>
        <Footer />
      </div>
    );
  };