'use client';

import { FC, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Send, Search, Plus, MoreVertical } from 'lucide-react';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  listingId?: string;
  listingTitle?: string;
}

// Mock data
const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    participantId: 'user2',
    participantName: 'James Mwangi',
    participantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
    lastMessage: 'When can you confirm the booking?',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 2,
    listingId: 'listing1',
    listingTitle: 'Cozy Studio in Westlands',
  },
  {
    id: 'conv2',
    participantId: 'user3',
    participantName: 'Sarah Kipchoge',
    participantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    lastMessage: "The equipment worked perfectly! Thanks again.",
    lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    unreadCount: 0,
    listingId: 'listing3',
    listingTitle: 'Professional Video Camera 4K',
  },
  {
    id: 'conv3',
    participantId: 'user4',
    participantName: 'Peter Omondi',
    participantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=peter',
    lastMessage: 'Is the conference room available next week?',
    lastMessageTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    unreadCount: 1,
    listingId: 'listing2',
    listingTitle: 'Modern Conference Room - CBD',
  },
];

const mockMessages: Record<string, Message[]> = {
  conv1: [
    {
      id: 'msg1',
      conversationId: 'conv1',
      senderId: 'user2',
      senderName: 'James Mwangi',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
      content: 'Hi! I just booked your studio. Is it available next week?',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isRead: true,
    },
    {
      id: 'msg2',
      conversationId: 'conv1',
      senderId: 'currentUser',
      senderName: 'You',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
      content: 'Yes, it is! I can confirm your booking right away.',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      isRead: true,
    },
    {
      id: 'msg3',
      conversationId: 'conv1',
      senderId: 'user2',
      senderName: 'James Mwangi',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
      content: 'When can you confirm the booking?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
    },
  ],
  conv2: [
    {
      id: 'msg4',
      conversationId: 'conv2',
      senderId: 'user3',
      senderName: 'Sarah Kipchoge',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      content: "The equipment worked perfectly! Thanks again.",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isRead: true,
    },
  ],
};

const MessagesPage: FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    mockConversations[0]
  );
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [messages, setMessages] = useState<Message[]>(mockMessages['conv1'] || []);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setMessages(mockMessages[conversation.id] || []);
    
    // Mark as read
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setIsLoading(true);

    // Add message optimistically
    const message: Message = {
      id: `msg${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: 'currentUser',
      senderName: 'You',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
      content: newMessage,
      timestamp: new Date(),
      isRead: true,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage('');

    // TODO: When Supabase is configured, send to API
    // const response = await fetch('/api/messages/send', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     conversationId: selectedConversation.id,
    //     content: newMessage,
    //   }),
    // });

    console.log('Message sent:', message);
    setIsLoading(false);
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.listingTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Plus size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors text-left ${
                    selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={conversation.participantAvatar}
                      alt={conversation.participantName}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conversation.participantName}
                        </h3>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      {conversation.listingTitle && (
                        <p className="text-xs text-gray-500 truncate">
                          {conversation.listingTitle}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {conversation.lastMessageTime.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="hidden md:flex flex-1 flex-col bg-white">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedConversation.participantAvatar}
                  alt={selectedConversation.participantName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h2 className="font-bold text-gray-900">
                    {selectedConversation.participantName}
                  </h2>
                  {selectedConversation.listingTitle && (
                    <p className="text-sm text-gray-600">
                      {selectedConversation.listingTitle}
                    </p>
                  )}
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 'currentUser' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === 'currentUser'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="break-words">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.senderId === 'currentUser'
                          ? 'text-blue-100'
                          : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isLoading}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <p className="text-lg">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
