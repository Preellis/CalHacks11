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
      const contextResult = contextResponse.data;

      // Step 3: Check with Gemini if it's an event and gather details
      const geminiResponse = await axios.post('/api/gemini', {
        prompt: "Is"+ `${contextResult}` +"a public event?  If the query is not an event, like a greeting or a normal random conversation or topic, then, set jsonEvent to an empty string and then come up with a reasonable response for the non-event query and set the string you respond with as the chatResponse. If yes, then, identify the who, what, dateTime (start) and endDateTime, and location of this event, and convert to json in the following format. Store the who and what as one string, the title of the data. Location is location, and dateTime and endDateTime are also their own features of the data json. If it is not public event, but still an event, identify the location, dateTime, and endDateTime, and the rest of the information summarized set to the title and also in json format. This final json will be set as the jsonEvent of the gcal event query."      });
      const { jsonEvent, chatResponse } = geminiResponse.data;

      // Step 4: Handle event processing
      if (!jsonEvent) {
        setMessages((prevMessages) => [
          ...prevMessages,
          'KronAI:', chatResponse,
        ]);
      } else if (jsonEvent!=='') {
        const eventDetails = await axios.post('/api/gemineye/get-event-details', {
          jsonEvent,
        });

        // Create the final JSON for Google Calendar
        const gcalEvent = {
          title: eventDetails.data.title,
          location: eventDetails.data.location,
          dateTime: eventDetails.data.dateTime,
          endDateTime: eventDetails.data.endDateTime,
        };

        // Step 5: Add the event to Google Calendar
        // @FIX
        await axios.post('/api/gcal/add-event', gcalEvent);
        setMessages((prevMessages) => [
          ...prevMessages,
          'KronAI: The event has been added to your Google Calendar.',
        ]);
      } else {
        // If it's not an event, continue normal convo?
        await axios.post('/api/gemini', {prompt: contextResult.query});
        // const { jsonEvent } = geminiResponse.data;
        setMessages((prevMessages) => [
          ...prevMessages,
          'KronAI: Hi, how can I help you with your next event?.',
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


  // const chromaContext = messages;
  // const prompt = "Is {chromaContext} a public event? If yes, then, summarize "who" "what" "when" "Where" of this event, and convert to json. If it is not public event, but still an event, summarize the who where when and what of the event and if you are missing anything carry out a normal conversation to figure it out. Then, assemble the idea into a json to make into a google calendar event. Store this final "one line" as the jsonEventTitle of the gcal event. if the query is completely unrelated to an event, like a normal random conversation, then come up with a response for them and set it to chatResponse.""
  // serve this prompt to gemini. Otherwise, prompt is = "Come up with a response for this query: {chromaContext} and set it to chatResponse."
  // call addToGcal(jsonEventTitle);
  // func makes new event w title of jsonEventTitle.

  // if success, set chatResponse to "added to Gcal". 
  // else, set chatResponse to "unable to add to Gcal at the moment."



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
