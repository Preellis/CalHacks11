'use client';

import { useAtom } from 'jotai';
import { imageAtom } from '@/atoms';
import React, { useState } from "react";
import axios from "axios";


const ScannedEventsScreen: React.FC = () => {
    const [image, setImage] = useAtom(imageAtom);
    const [result, setResult] = useState<string | null>(null);

    const promptGemini = async () => {
        try {
        const res = await axios.get("/api/gemini")
            setResult(res.data.response);
        }
        catch (error) {
            console.error("Error fetching Gemini API result:", error);
            setResult(null);
        }
    };

    promptGemini();

        
    return (
    <div>
        BKALSEJFLKSJ
    </div>
    );
};
export default ScannedEventsScreen;
