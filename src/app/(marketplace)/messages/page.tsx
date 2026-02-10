'use client';

import { FC, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Send, Search, Plus, MoreVertical, Loader2 } from 'lucide-react';
import { messagingService } from '@/lib/messaging';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name?: string;
  sender_avatar?: string;
  content: string;
  created_at: string;
  is_read?: boolean;
}

interface Conversation {
  id: string;
  participant_ids: string[];
  participant_name?: string;
  participant_avatar?: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  listing_id?: string;
  listing_title?: string;
  other_user_id?: string;
}

// Mock data
const mockConversations: Conversation[] = [];

const MessagesPage: FC = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const conversationsUnsubscribeRef = useRef<(() => void) | null>(null);

  if (!isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/messages/conversations');
        const data = await response.json();

        if (response.ok) {
          setConversations(data.conversations || []);
        } else {
          setError(data.error || 'Failed to load conversations');
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Error loading conversations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, []);

  // Load messages when conversation is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation) return;

      try {
        const response = await fetch(
          `/api/messages/get?conversationId=${selectedConversation.id}`
        );
        const data = await response.json();

        if (response.ok) {
          setMessages(data.messages || []);
        } else {
          setError(data.error || 'Failed to load messages');
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Error loading messages:', err);
      }
    };

    loadMessages();
  }, [selectedConversation]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!selectedConversation) return;

    // Unsubscribe from previous conversation
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    // Subscribe to new messages
    unsubscribeRef.current = messagingService.subscribeToMessages(
      selectedConversation.id,
      (newMsg: any) => {
        setMessages((prev) => [...prev, newMsg]);
      }
    );

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [selectedConversation]);

  // Subscribe to real-time conversation updates
  useEffect(() => {
    if (!user?.id) return;

    conversationsUnsubscribeRef.current = messagingService.subscribeToConversations(
      user.id,
      (updatedConv: any) => {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === updatedConv.id ? { ...conv, ...updatedConv } : conv
          )
        );
      }
    );

    return () => {
      if (conversationsUnsubscribeRef.current) {
        conversationsUnsubscribeRef.current();
      }
    };
  }, [user?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user?.id) return;

    setIsSending(true);
    setError(null);

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          content: newMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setNewMessage('');
    } catch (err: any) {
      setError(err.message);
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participant_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.listing_title?.toLowerCase().includes(searchQuery.toLowerCase())
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
            {isLoading ? (
              <div className="p-8 text-center">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No conversations yet</p>
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
                      src={conversation.participant_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
                      alt={conversation.participant_name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conversation.participant_name}
                        </h3>
                        {conversation.unread_count > 0 && (
                          <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {conversation.unread_count}
                          </span>
                        )}
                      </div>
                      {conversation.listing_title && (
                        <p className="text-xs text-gray-500 truncate">
                          {conversation.listing_title}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.last_message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(conversation.last_message_time).toLocaleDateString()}
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
                  src={selectedConversation.participant_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
                  alt={selectedConversation.participant_name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h2 className="font-bold text-gray-900">
                    {selectedConversation.participant_name}
                  </h2>
                  {selectedConversation.listing_title && (
                    <p className="text-sm text-gray-600">
                      {selectedConversation.listing_title}
                    </p>
                  )}
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender_id === user?.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="break-words">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender_id === user?.id
                          ? 'text-blue-100'
                          : 'text-gray-500'
                      }`}
                    >
                      {new Date(message.created_at).toLocaleTimeString([], {
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
                  disabled={isSending}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isSending}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  {isSending ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
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
