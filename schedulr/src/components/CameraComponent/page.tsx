import React, { useState, useRef } from 'react';
import { Camera } from 'react-camera-pro';

const Component: React.FC = () => {
    const camera = useRef<Camera | null>(null);
    const [image, setImage] = useState<string | null>(null);

    const errorMessages = {
        noCamera: "No camera detected. Please check your device.",
        permissionDenied: "Camera permission denied. Please enable it.",
    };

    //Saves photo to image state
    const SaveTakenPhoto = () => {
    if (camera.current) {
        const photo = camera.current.takePhoto();
        setImage(photo);
    }
    };

    // Function that returns the photo taken in a specified file format
    const TakenPhoto2ImageFile = () => {

        if (camera.current) {
            const base64Image = image;
            const byteString = atob(base64Image.split(',')[1]);
            const arrayBuffer = new ArrayBuffer(byteString.length);
            const uintArray = new Uint8Array(arrayBuffer);
            
            for (let i = 0; i < byteString.length; i++) {
            uintArray[i] = byteString.charCodeAt(i);
            }

            const blob = new Blob([uintArray], { type: 'image/jpeg' }); // Change MIME type to 'image/png' for PNG
            const newFile = new File([blob], 'photo.jpg', { type: 'image/jpeg' });

            return newFile;
        }
    };

    //Function that handles entire functionality of camera button
    const HandleCamBtn = () => {
        SaveTakenPhoto();
        TakenPhoto2ImageFile();
    };

    return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        {/* Camera video */}
        <div
            style={{
                position: 'relative',  // Makes the video element take the entire space without overlapping the button
                top: 0,
                left: 0,
                width: '50%',
                height: '50%',
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
                position: 'absolute',   // Positioning the button on top of the video
                bottom: '20px',         // Adjust this value to position the button as you want
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10,             // Ensures the button stays above the video
                padding: '10px 20px',
                backgroundColor: '#ff6347', // Optional styling for the button
                color: 'white',
                border: 'none',
                borderRadius: '5px',
            }}
        >
        Take photo
        </button>

        {/* Display taken photo */}
        {image && <img src={image} alt="Taken photo" />}
    </div>
    );
};

export default Component;
