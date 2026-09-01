import { NextResponse } from 'next/server';
import { getConversations, getConversationById, sendChatMessage } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const conv = getConversationById(id);
    return NextResponse.json({ success: true, data: conv });
  }

  const conversations = getConversations();
  return NextResponse.json({ success: true, count: conversations.length, data: conversations });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversationId, sender, senderName, text, propertyContext } = body;

    const message = sendChatMessage(conversationId, {
      sender,
      senderName,
      text,
      propertyContext,
    });

    // Auto-respond simulation if customer sends a message after hours
    if (sender === 'customer') {
      setTimeout(() => {
        sendChatMessage(conversationId, {
          sender: 'admin',
          senderName: 'Elysian VIP Concierge',
          text: `Thank you for contacting Elysian Estates, ${senderName}! One of our senior property specialists has received your inquiry and is reviewing the latest availability. Would you like to schedule a private viewing?`,
        });
      }, 1500);
    }

    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid chat message payload' }, { status: 400 });
  }
}
