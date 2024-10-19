"use client"
import Camera from '@/components/CameraComponent/page';

export default function Home() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log("Browser supports camera access");
      } else {
        console.log("Browser does not support camera access");
      }
      
    return (
      <div>
        <Camera/>
      </div>
    );
  }