import { useAtom } from 'jotai';
import { imageAtom } from '@/atoms';


export default function ScannedEventsScreen() {
    const [image, setImage] = useAtom(imageAtom);

    // Function that returns the photo taken in a specified file format
    const TakenPhoto2ImageFile = () => {

        if (image) {
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
    console.log(TakenPhoto2ImageFile());
        
    return (
    <div>
        BKALSEJFLKSJ
    </div>
    );
};