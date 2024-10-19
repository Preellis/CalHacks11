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
  console.log(messages)
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    setLoading(true);
    
    setMessages((prevMessages) => [...prevMessages, `You: ${userInput}`]);

    try {
      await axios.post('/api/chroma/add-memory', {
        userId,
        documentText: userInput,
      });
      // Fetching the context to append
      const contextResponse = await axios.post('/api/chroma/get-context', {
        userId,
        query: userInput
      });
      const contextResult = contextResponse.data;

      // Append the 3 closest matches or missing info to the messages
      setMessages((prevMessages) => [
        ...prevMessages,
        ...contextResult,
      ]);
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
