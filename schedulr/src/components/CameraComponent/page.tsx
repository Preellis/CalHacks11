import React, { useState, useRef } from 'react';
import { Camera } from 'react-camera-pro';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { imageAtom } from '@/atoms';

const Component: React.FC = () => {
    const camera = useRef<Camera | null>(null);
    const [image, setImage] = useAtom(imageAtom);
    const router = useRouter();

    const errorMessages = {
        noCamera: "No camera detected. Please check your device.",
        permissionDenied: "Camera permission denied. Please enable it.",
    };

    //Saves photo to image state
    const SaveTakenPhoto = () => {
        if (camera.current) {
            const photo = camera.current.takePhoto();
            setImage(photo);
            console.log(photo)
        }
    };

    //Function that handles entire functionality of camera button
    const HandleCamBtn = () => {
        SaveTakenPhoto();
        router.push('../scannedEventsScreen')
    };

    return (
    <div style={{ position: 'relative', width: '100%', height: '93vh' }}>
        {/* Camera video */}
        <div
            style={{
                position: 'relative', 
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                }}
        >
        <Camera 
            ref={camera}
            errorMessages={errorMessages}
        />
        </div>
        

        {/* Button */}
        <button
            onClick={HandleCamBtn}
            style={{
                width: '100px',
                height: '100px',
                position: 'absolute',   // Positioning the button on top of the video
                bottom: '50px',         
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10,             
                padding: '10px 20px',
                backgroundColor: '#ff6347', 
                color: 'white',
                border: 'none',
                borderRadius: '50%',
            }}
        >
        </button>

        {/* Display taken photo
        {image && <img src={image} alt="Taken photo" />} */}
    </div>
    );
};

export default Component;
