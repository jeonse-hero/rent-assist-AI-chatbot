'use client';
import React from 'react';
import useChat from '@/hooks/useChat';
import useFileInput from '@/hooks/useFileInput';

const ChatBox: React.FC = () => {
  const { input, setInput, messages, sendMessage } = useChat();
  const { file, handleFileChange } = useFileInput();

  const handleSendMessage = () => {
    sendMessage(file);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <div className="mb-4 h-96 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.type === 'user' ? 'text-right' : 'text-left'} my-2`}
            >
              <div
                className={`inline-block px-4 py-2 rounded ${
                  msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <form className="mb-2">
          <label htmlFor="file-upload" className="block mb-2 text-sm font-medium text-gray-900">
            Upload Image
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
            aria-describedby="file-upload-help"
          />
          <small id="file-upload-help" className="block text-sm text-gray-600">
            Choose an image file to upload
          </small>
        </form>
        <form className="flex items-center">
          <label htmlFor="message-input" className="sr-only">
            Your message
          </label>
          <input
            id="message-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-grow border rounded-l px-4 py-2 border-gray-300"
            placeholder="Type your message here..."
          />
          <button
            type="button"
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
