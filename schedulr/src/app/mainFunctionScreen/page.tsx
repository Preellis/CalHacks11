"use client"
import { userAtom } from '@/atoms';
import Camera from '@/components/CameraComponent/page';
import { useAtom } from 'jotai';

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
        <Camera/>
      </div>
    );
  };