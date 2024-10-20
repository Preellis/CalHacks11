import React, { useState, useRef } from 'react';
import { Camera, CameraType } from 'react-camera-pro';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { imageAtom } from '@/atoms';

const Component: React.FC = () => {
    const camera = useRef<CameraType>(null);
    const [image, setImage] = useAtom(imageAtom);
    const [confirm, setConfirm] = useState(false);
    const router = useRouter();

    const errorMessages = {
        noCamera: "No camera detected. Please check your device.",
        permissionDenied: "Camera permission denied. Please enable it.",
    };

    //Saves photo to image state
    const SaveTakenPhoto = () => {
        if (camera.current) {
            const photo = camera.current.takePhoto();
            setImage(photo.toString());
            console.log(photo)
        }
    };

    const ConfirmationPopup = () => {
        setConfirm(true);
    }

    //Function that handles entire functionality of camera button
    const HandleCamBtn = () => {
        SaveTakenPhoto();
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

            {/* Display taken photo
            {image && <img src={image} alt="Taken photo" />} */}
        </div>
    );
};

export default Component;
