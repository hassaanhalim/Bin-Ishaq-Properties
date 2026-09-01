export type MessageSender = 'customer' | 'admin' | 'ai';

export interface PropertySnippet {
  id: string;
  title: string;
  price?: number;
  priceDisplay?: string;
  location: string;
  image: string;
  type: string;
  bedrooms?: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: MessageSender;
  senderName: string;
  text: string;
  timestamp: string;
  propertyContext?: PropertySnippet;
  recommendations?: PropertySnippet[];
  isRead?: boolean;
}

export interface Conversation {
  id: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  propertyId?: string;
  propertyTitle?: string;
  propertyImage?: string;
  status: 'active' | 'archived';
  messages: ChatMessage[];
}
