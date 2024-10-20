"use client";
import { useState } from 'react';
import { userIdAtom } from '@/atoms'; 
import { useAtom } from 'jotai';
import Deepgram from 'deepgram'; // Import Deepgram
import axios from 'axios';


const ChatPage = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);

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

      // Step 3: Check with Gemini if it's an event and gather details
      const geminiResponse = await axios.post('/api/gemini', {
        context: contextResult,
      });
      const { isPublicEvent, jsonEventTitle } = geminiResponse.data;

      // Step 4: Handle event processing
      if (isPublicEvent) {
        const eventDetails = await axios.post('/api/gemini/get-event-details', {
          eventTitle: jsonEventTitle,
        });

        // Create the final JSON for Google Calendar
        const gcalEvent = {
          summary: eventDetails.data.summary,
          location: eventDetails.data.location,
          start: {
            dateTime: eventDetails.data.dateTime,
          },
          end: {
            dateTime: eventDetails.data.endDateTime,
          },
        };

        // Step 5: Add the event to Google Calendar
        await axios.post('/api/gcal/add-event', gcalEvent);
        setMessages((prevMessages) => [
          ...prevMessages,
          'System: The event has been added to your Google Calendar.',
        ]);
      } else {
        // If it's not a public event, add directly to Google Calendar
        const gcalEvent = {
          summary: userInput,
          start: {
            dateTime: new Date().toISOString(), // Placeholder: use actual date/time if provided
          },
          end: {
            dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // Default to 1 hour later
          },
        };

        await axios.post('/api/gcal/add-event', gcalEvent);
        setMessages((prevMessages) => [
          ...prevMessages,
          'System: The event has been added to your Google Calendar.',
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

  // Function to start voice recording
  const startRecording = () => {
    setIsRecording(true);
    const deepgram = new Deepgram(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY);

    const stream = deepgram.transcription.live({ punctuate: true }).stream();

    stream.on('data', (data) => {
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


  // const chromaContext = messages;
  // const prompt = "Is {chromaContext} a public event? If yes, then, summarize "who" "what" "when" "Where" of this event, and convert to json. If it is not public event, but still an event, summarize the who where when and what of the event and if you are missing anything carry out a normal conversation to figure it out. Then, assemble the idea into a json to make into a google calendar event. Store this final "one line" as the jsonEventTitle of the gcal event. if the query is completely unrelated to an event, like a normal random conversation, then come up with a response for them and set it to chatResponse.""
  // serve this prompt to gemini. if no prompt, then call gemini on altrpompt. if no altprompt set as '' and return "hi how can i help". Otherwise, we serve altprompt = "Come up with a response for this query: {chromaContext} and set it to chatResponse.""
  // call altprompt to gemini. 
  // call addToGcal(jsonEventTitle);
  // func makes new event w title of jsonEventTitle.

  // if success, set chatResponse to "added to Gcal". 
  // else, set chatResponse to "unable to add to Gcal at the moment."



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
        <button onClick={handleSendMessage} disabled={loading || !userInput.trim()}>
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
