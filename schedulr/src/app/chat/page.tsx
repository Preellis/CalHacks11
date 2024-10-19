"use client";
import { useState } from 'react';
import { userAtom, userIdAtom } from '@/atoms'; 
import { useAtom } from 'jotai';
import Deepgram from 'deepgram'; // Import Deepgram
import axios from 'axios';

const ChatPage = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [user] = useAtom(userAtom);
  const [userId] = useAtom(userIdAtom);
  const deepgramApiKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY; // Ensure you have this in your .env

  const handleSendMessage = async (input: string) => {
    if (!input.trim()) return;

    setLoading(true);
    setMessages((prevMessages) => [...prevMessages, `You: ${input}`]);

    try {
      // Send input to your API for processing
      const response = await fetch('/api/chroma/add-memory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          documentText: input,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Fetching the context to append
        const contextResponse = await fetch('/api/chroma/get-context');
        const contextResult = await contextResponse.json();

        // Append the 3 closest matches or missing info to the messages
        setMessages((prevMessages) => [
          ...prevMessages,
          contextResult,
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          `System: There was an error processing your request.`,
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        'System: Something went wrong, please try again.',
      ]);
    } finally {
      setLoading(false);
      setUserInput('');
    }
  };

  // Handle voice input using Deepgram
  const startRecording = () => {
    setIsRecording(true);
    const deepgram = new Deepgram(deepgramApiKey);

    deepgram.transcription.live({ punctuate: true }).stream().on('data', (data) => {
      if (data.channel && data.channel.alternatives[0]) {
        const transcript = data.channel.alternatives[0].transcript;
        setUserInput(transcript); // Set the input to the transcribed text
      }
    }).on('error', (error) => {
      console.error('Transcription Error:', error);
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Logic to stop recording
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.startsWith('You:') ? 'user' : 'system'}`}>
            {message}
          </div>
        ))}
      </div>

      <div className="input-container">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message here..."
          disabled={loading || isRecording}
        />
        <button onClick={handleSendMessage.bind(null, userInput)} disabled={loading || !userInput.trim()}>
          {loading ? 'Sending...' : 'Send'}
        </button>
        <button onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 86vh;
          padding: 20px;
          background-color: #f0f0f0;
        }
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
          background-color: white;
          border: 1px solid #ccc;
          margin-bottom: 10px;
        }
        .message {
          margin-bottom: 10px;
          padding: 10px;
          border-radius: 5px;
          max-width: 80%;
        }
        .user {
          background-color: #007bff;
          color: white;
          align-self: flex-end;
        }
        .system {
          background-color: #ccc;
          color: black;
          align-self: flex-start;
        }
        .input-container {
          display: flex
        }
        input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        button {
          padding: 10px;
          border: none;
          background-color: #007bff;
          color: white;
          border-radius: 5px;
          margin-left: 10px;
          cursor: pointer;
        }
        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
