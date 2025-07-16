import React, { useState, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, Users, MessageSquare, Hand, Settings, Monitor } from 'lucide-react';

interface LiveClassRoomProps {
  classId: string;
  className: string;
}

const LiveClassRoom: React.FC<LiveClassRoomProps> = ({ classId, className }) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [participants, setParticipants] = useState([
    { id: '1', name: 'Maria Schmidt', role: 'teacher', isVideoOn: true, isAudioOn: true },
    { id: '2', name: 'John Doe', role: 'student', isVideoOn: true, isAudioOn: false },
    { id: '3', name: 'Anna Mueller', role: 'student', isVideoOn: false, isAudioOn: true },
    { id: '4', name: 'Michael Weber', role: 'student', isVideoOn: true, isAudioOn: true }
  ]);
  const [messages, setMessages] = useState([
    { id: '1', sender: 'Maria Schmidt', message: 'Welcome to today\'s lesson!', timestamp: '14:30' },
    { id: '2', sender: 'John Doe', message: 'Thank you!', timestamp: '14:31' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(true);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        sender: 'You',
        message: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-white text-xl font-semibold">{className}</h1>
          <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs">LIVE</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-300 text-sm">{participants.length} participants</span>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Teacher Video */}
          <div className="flex-1 bg-gray-800 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-4xl font-bold text-gray-800">MS</span>
                </div>
                <p className="text-white text-xl font-semibold">Maria Schmidt</p>
                <p className="text-gray-200">Teacher</p>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg">
              <span className="text-sm">Maria Schmidt</span>
            </div>
          </div>

          {/* Student Videos */}
          <div className="h-32 bg-gray-800 flex space-x-2 p-2">
            {participants.filter(p => p.role === 'student').map((participant) => (
              <div key={participant.id} className="flex-1 bg-gray-700 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-1">
                      <span className="text-sm font-bold text-gray-800">
                        {participant.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <p className="text-white text-xs">{participant.name}</p>
                  </div>
                </div>
                <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  {participant.name}
                </div>
                <div className="absolute top-1 right-1 flex space-x-1">
                  {!participant.isVideoOn && (
                    <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                      <VideoOff className="h-2 w-2 text-white" />
                    </div>
                  )}
                  {!participant.isAudioOn && (
                    <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                      <MicOff className="h-2 w-2 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="bg-gray-800 px-6 py-4 flex items-center justify-center space-x-4">
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3 rounded-full transition-colors ${
                isVideoOn ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </button>
            
            <button
              onClick={() => setIsAudioOn(!isAudioOn)}
              className={`p-3 rounded-full transition-colors ${
                isAudioOn ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </button>
            
            <button
              onClick={() => setIsHandRaised(!isHandRaised)}
              className={`p-3 rounded-full transition-colors ${
                isHandRaised ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              <Hand className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => setShowChat(!showChat)}
              className="p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
            
            <button className="p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors">
              <Monitor className="h-5 w-5" />
            </button>
            
            <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Leave Class
            </button>
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Chat</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div key={message.id} className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{message.sender}</span>
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700">{message.message}</p>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveClassRoom;