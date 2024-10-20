"use client";
import { useState } from 'react';
import { useAtom } from 'jotai';
import axios from 'axios';
import { userIdAtom } from '@/atoms';

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
        const contextResult = contextResponse.data;

        // Step 3: Ask Gemini if it's an event or not
        const geminiResponse = await axios.post('/api/gemini', {
            prompt: `Is "${userInput}" a public event? If yes, extract the details (title, location, startDateTime, endDateTime) as JSON. If not, set jsonEvent to "" and return.`, // Using userInput directly
        });

        const { jsonEvent, chatResponse } = geminiResponse.data;

        // Step 4: Check if an event is detected
        if (!jsonEvent || jsonEvent.trim() === "") {
            // If no event detected, use the userInput as a normal conversation prompt
            const followUpResponse = await axios.post('/api/gemini', {
              prompt: `Based on the message: "${userInput}", how would you respond in a conversational way? Do not give multiple possible responses, only 1. Always try to help the users schedule something. If they give you an event, possibly search it up and suggest adding it to gcal.`,
          });

          const followUpChatResponse = followUpResponse.data.response; 

          setMessages((prevMessages) => [
              ...prevMessages,
              `KronAI: ${followUpChatResponse || "I'm not sure about that."}`,
          ]);
      } else {
            // Event detected, proceed to add to Google Calendar
            const eventDetails = JSON.parse(jsonEvent);
            console.log("eventDetails:", eventDetails);

            const gcalEvent = {
                title: eventDetails.title,
                location: eventDetails.location,
                dateTime: eventDetails.startDateTime,
                endDateTime: eventDetails.endDateTime,
            };

            await axios.post('/api/gcal/add-event', gcalEvent);

            setMessages((prevMessages) => [
                ...prevMessages,
                'KronAI: The event has been added to your Google Calendar.',
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

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.startsWith('You:') ? 'You' : 'KronAI'}`}>
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
        .You {
          background-color: #007bff;
          color: white;
          align-self: flex-end;
        }
        .KronAI {
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
