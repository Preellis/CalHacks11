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
            const res = await axios.post("/api/gemini", {
                base64Image: image
            })
            setResult(res.data.response);
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
