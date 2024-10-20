'use client';


import React, { useEffect, useState } from "react";
import axios from "axios";
import { imageAtom } from "@/atoms/";
import { useAtomValue } from "jotai";


const ScannedEventsScreen: React.FC = () => {
    const [result, setResult] = useState<string | null>(null);
    const image = useAtomValue(imageAtom);

    const promptGemini = async () => {
        try {
            const res = await axios.post("/api/gemini/image-to-calendar", {
                base64Image: image
            })
            console.log(JSON.parse(res.data.response.replace(/```json/g, '').replace(/```/g, '')))
            setResult(res.data.response.replace(/```json/g, '').replace(/```/g, ''));
        }
        catch (error) {
            console.error("Error fetching Gemini API result:", error);
            setResult(null);
        }
    };

    useEffect(() => {
        promptGemini();
    }, []);

        
    return (
    <div>
        BKALSEJFLKSJ
    </div>
    );
};
export default ScannedEventsScreen;
