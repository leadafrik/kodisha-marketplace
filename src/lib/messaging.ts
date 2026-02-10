import { createClient } from '@supabase/supabase-js';
import { RealtimeChannel } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  participant_ids: string[];
  listing_id?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Real-time Messaging Service
 * Handles message creation, retrieval, and Realtime subscriptions
 */
export class MessagingService {
  private channels: Map<string, RealtimeChannel> = new Map();

  /**
   * Get or create a conversation between two users
   */
  async getOrCreateConversation(
    userId: string,
    otherUserId: string,
    listingId?: string
  ): Promise<Conversation> {
    try {
      // Try to find existing conversation
      const { data: existingConv, error: searchError } = await supabase
        .from('conversations')
        .select('*')
        .contains('participant_ids', [userId, otherUserId])
        .single();

      if (existingConv && !searchError) {
        return existingConv as Conversation;
      }

      // Create new conversation if not found
      const { data: newConv, error: createError } = await supabase
        .from('conversations')
        .insert([
          {
            participant_ids: [userId, otherUserId],
            listing_id: listingId,
          },
        ])
        .select()
        .single();

      if (createError) throw createError;

      return newConv as Conversation;
    } catch (error) {
      console.error('Error getting/creating conversation:', error);
      throw error;
    }
  }

  /**
   * Get conversations for a user
   */
  async getConversations(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(
          `
          id,
          participant_ids,
          listing_id,
          created_at,
          messages (
            id,
            content,
            created_at,
            sender_id
          )
        `
        )
        .contains('participant_ids', [userId])
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Transform data to include participant and message info
      return (data || []).map((conv: any) => {
        const otherUserId = conv.participant_ids.find((id: string) => id !== userId);
        const lastMessage = conv.messages?.[0] || null;

        return {
          id: conv.id,
          participant_ids: conv.participant_ids,
          listing_id: conv.listing_id,
          other_user_id: otherUserId,
          last_message: lastMessage?.content || '',
          last_message_time: lastMessage?.created_at || conv.created_at,
          unread_count: lastMessage && lastMessage.sender_id !== userId ? 1 : 0,
        };
      });
    } catch (error) {
      console.error('Error getting conversations:', error);
      throw error;
    }
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationId: string, limit = 50): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) throw error;

      return (data || []) as Message[];
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  }

  /**
   * Send a message
   */
  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string
  ): Promise<Message> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            sender_id: senderId,
            content,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return data as Message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Subscribe to messages in a conversation (Realtime)
   */
  subscribeToMessages(
    conversationId: string,
    callback: (message: Message) => void
  ): () => void {
    try {
      const channel = supabase
        .channel(`messages:${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`,
          },
          (payload: any) => {
            const newMessage = payload.new as Message;
            callback(newMessage);
          }
        )
        .subscribe();

      this.channels.set(conversationId, channel);

      // Return unsubscribe function
      return () => {
        if (this.channels.has(conversationId)) {
          supabase.removeChannel(channel);
          this.channels.delete(conversationId);
        }
      };
    } catch (error) {
      console.error('Error subscribing to messages:', error);
      throw error;
    }
  }

  /**
   * Subscribe to conversation list updates (Realtime)
   */
  subscribeToConversations(
    userId: string,
    callback: (conversation: any) => void
  ): () => void {
    try {
      const channel = supabase
        .channel(`conversations:${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'conversations',
          },
          (payload: any) => {
            // Only notify if user is in the conversation
            const participantIds = payload.new?.participant_ids || [];
            if (participantIds.includes(userId)) {
              callback(payload.new);
            }
          }
        )
        .subscribe();

      this.channels.set(`conversations:${userId}`, channel);

      // Return unsubscribe function
      return () => {
        if (this.channels.has(`conversations:${userId}`)) {
          supabase.removeChannel(channel);
          this.channels.delete(`conversations:${userId}`);
        }
      };
    } catch (error) {
      console.error('Error subscribing to conversations:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe from all channels
   */
  unsubscribeAll(): void {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
  }
}

export const messagingService = new MessagingService();
