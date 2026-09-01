import { Conversation } from '@/types/chat';

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    customerName: 'Ahmed Khan',
    customerPhone: '+92 300 8912345',
    customerEmail: 'ahmed.khan@corp.pk',
    lastMessage: 'Yes, viewing is confirmed for Wednesday at 4 PM.',
    lastMessageTime: '2026-08-29T16:45:00Z',
    unreadCount: 0,
    propertyId: 'prop-1',
    propertyTitle: 'Ultra Luxury 1 Kanal Modern Designer Villa',
    propertyImage:
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=400&q=80',
    status: 'active',
    messages: [
      {
        id: 'msg-1',
        conversationId: 'conv-1',
        sender: 'customer',
        senderName: 'Ahmed Khan',
        text: 'Hello, is the 1 Kanal Villa on Khayaban-e-Seher available for viewing this week?',
        timestamp: '2026-08-28T10:00:00Z',
        propertyContext: {
          id: 'prop-1',
          title: 'Ultra Luxury 1 Kanal Modern Designer Villa',
          price: 185000000,
          location: 'DHA Phase 6, Karachi',
          image:
            'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=400&q=80',
          type: 'villa',
          bedrooms: 5,
        },
      },
      {
        id: 'msg-2',
        conversationId: 'conv-1',
        sender: 'admin',
        senderName: 'Kamran Siddiqui (Office)',
        text: 'Greetings Mr. Ahmed! Yes, the villa is available. We can arrange a private viewing on Wednesday between 3 PM and 6 PM. Does 4 PM work for you?',
        timestamp: '2026-08-28T10:15:00Z',
      },
      {
        id: 'msg-3',
        conversationId: 'conv-1',
        sender: 'customer',
        senderName: 'Ahmed Khan',
        text: 'Wednesday 4 PM is perfect. Please share the exact gate pin.',
        timestamp: '2026-08-28T10:20:00Z',
      },
      {
        id: 'msg-4',
        conversationId: 'conv-1',
        sender: 'admin',
        senderName: 'Kamran Siddiqui (Office)',
        text: 'Yes, viewing is confirmed for Wednesday at 4 PM. Our agent Kamran will meet you at the main gate. Location pin shared.',
        timestamp: '2026-08-29T16:45:00Z',
      },
    ],
  },
  {
    id: 'conv-2',
    customerName: 'Zainab Shah',
    customerPhone: '+92 321 6655443',
    customerEmail: 'zainab@gmail.com',
    lastMessage: 'Is the price negotiable for full upfront cash payment?',
    lastMessageTime: '2026-08-30T11:20:00Z',
    unreadCount: 1,
    propertyId: 'prop-2',
    propertyTitle: 'Arabian Sea-Facing Signature Penthouse',
    propertyImage:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
    status: 'active',
    messages: [
      {
        id: 'msg-5',
        conversationId: 'conv-2',
        sender: 'customer',
        senderName: 'Zainab Shah',
        text: 'Is the price negotiable for full upfront cash payment on the Crescent Bay penthouse?',
        timestamp: '2026-08-30T11:20:00Z',
        propertyContext: {
          id: 'prop-2',
          title: 'Arabian Sea-Facing Signature Penthouse',
          price: 240000000,
          location: 'Clifton, Karachi',
          image:
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
          type: 'penthouse',
          bedrooms: 4,
        },
      },
    ],
  },
];
