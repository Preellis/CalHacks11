import React, { useState, useEffect, useRef } from 'react';
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";

export default function page() {
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const transcript = useRef<String | null>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const deepgram = createClient("feef613dbd6892b396528defda69055aa4faa420");

  const dgConnection = deepgram.listen.live({ model: "nova" });

  const startStreaming = async () => {
    try {
      console.log("Streaming Started")
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.start(250);
      setIsStreaming(true);

      console.log("Before DG")

      dgConnection.on(LiveTranscriptionEvents.Open, () => {
        dgConnection.on(LiveTranscriptionEvents.Transcript, (data) => {
          const transcriptText = data.channel.alternatives[0].transcript;
          console.log("DP ON")
          if (data.is_final) {
            transcript.current += transcriptText;
          }
        });
      
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.ondataavailable = async (event: BlobEvent) => {
            dgConnection.send(event.data);
          };
        }
      });
    } catch (error) {
      console.error('Error starting stream:', error);
    }
  };

  const stopStreaming = () => {
    console.log("Streaming Ended")
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    console.log(transcript)
  }, [transcript])

  return (
    <div>
      <h1>Real-time Audio Streaming</h1>
      <button onClick={startStreaming} disabled={isStreaming} style={{backgroundColor: "red"}}>
        Start Streaming
      </button>
      <button onClick={stopStreaming} disabled={!isStreaming} style={{backgroundColor: "red"}}>
        Stop Streaming
      </button>
      <div>
        <h2>Transcription:</h2>
        <p>{transcript.current}</p>
      </div>
    </div>
  );
}
