"use client";
import { useState } from 'react';
import { userIdAtom } from '@/atoms'; 
import { useAtom } from 'jotai';
import axios from 'axios';

const ChatPage = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [userId] = useAtom(userIdAtom);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    setLoading(true);
    setMessages((prevMessages) => [...prevMessages, `You: ${userInput}`]);

    try {
      // Step 1: Save user input to Chroma DB
      await axios.post('/api/chroma/add-memory', {
        userId,
        documentText: userInput,
      });

      // Step 2: Fetch context from Chroma DB
      const contextResponse = await axios.post('/api/chroma/get-context', {
        userId,
        query: userInput,
      });
      console.log("Full contextResponse:", contextResponse.data);
      const contextResult = contextResponse.data; 
      

      // Step 3: Ask Gemini if it's an event or not
      const geminiResponse = await axios.post('/api/gemini', {
        prompt: `Is "${contextResult.query}" a public event? If the query is unrelated to an event, set the prompt to: ${contextResult.query}". Otherwise, extract event details like who and what to make up the title, find location, find (start) dateTime, and endDateTime as JSON attributes to jsonEvent object. If no event is detected, leave jsonEvent as "".`,
      });
      

      const { jsonEvent, chatResponse } = geminiResponse.data;
      console.log("chatResponse:", chatResponse); // Fix typo: "chatReponse"
      console.log("jsonEvent:", jsonEvent);


      // Step 4: Check if we have an event or just a conversation
      if (!jsonEvent || jsonEvent.trim() === "") {
        // Normal conversation
        setMessages((prevMessages) => [
          ...prevMessages,
          `KronAI: ${contextResult[2]}`,
        ]);
      } else {
        // Event detected, proceed to add to Google Calendar
        const eventDetails = JSON.parse(jsonEvent);
        console.log("eventDetails:", eventDetails);

        const gcalEvent = {
          title: eventDetails.title,
          location: eventDetails.location,
          dateTime: eventDetails.dateTime,
          endDateTime: eventDetails.endDateTime,
        };

        await axios.post('/api/gcal/add-event', gcalEvent);

        setMessages((prevMessages) => [
          ...prevMessages,
          'KronAI: The event has been added to your Google Calendar.',
        ]);
        console.log("messages:", messages);
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

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message?.startsWith('You:') ? 'user' : 'system'}`}>
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
          disabled={loading}
        />
        <button onClick={handleSendMessage} disabled={loading || !userInput.trim()}>
          {loading ? 'Sending...' : 'Send'}
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
          display: flex;
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
