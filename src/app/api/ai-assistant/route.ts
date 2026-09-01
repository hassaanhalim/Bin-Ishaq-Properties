import { NextResponse } from 'next/server';
import { getProperties } from '@/lib/db';
import { PropertySnippet } from '@/types/chat';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const lower = prompt.toLowerCase();
    const allProperties = getProperties({ isFeatured: false });

    // Parse Intent
    let purpose: 'buy' | 'rent' | undefined;
    if (lower.includes('rent') || lower.includes('lease') || lower.includes('month') || lower.includes('کرایہ')) {
      purpose = 'rent';
    } else if (lower.includes('buy') || lower.includes('sale') || lower.includes('purchase') || lower.includes('خرید')) {
      purpose = 'buy';
    }

    // Parse Property Type
    let type: string | undefined;
    if (lower.includes('villa') || lower.includes('ولا')) type = 'villa';
    else if (lower.includes('apartment') || lower.includes('flat') || lower.includes('اپارٹمنٹ')) type = 'apartment';
    else if (lower.includes('penthouse') || lower.includes('پینٹ ہاؤس')) type = 'penthouse';
    else if (lower.includes('plot') || lower.includes('پلاٹ')) type = 'plot';
    else if (lower.includes('office') || lower.includes('commercial') || lower.includes('دفتر')) type = 'office';
    else if (lower.includes('farmhouse') || lower.includes('فارم ہاؤس')) type = 'farmhouse';

    // Parse Bedrooms
    let bedrooms: number | undefined;
    const bedMatch = lower.match(/(\d+)\s*(?:bed|bedroom|bhk|بیڈ)/);
    if (bedMatch) {
      bedrooms = parseInt(bedMatch[1], 10);
    }

    // Parse Price Limits (Crore & Lakh)
    let maxPrice: number | undefined;
    const croreMatch = lower.match(/(?:under|below|max|upto|less than)\s*(\d+(?:\.\d+)?)\s*(?:cr|crore|کرور|کروڑ)/);
    if (croreMatch) {
      maxPrice = parseFloat(croreMatch[1]) * 10000000;
    } else {
      const lakhMatch = lower.match(/(?:under|below|max|upto|less than)\s*(\d+(?:\.\d+)?)\s*(?:lac|lakh|لاکھ)/);
      if (lakhMatch) {
        maxPrice = parseFloat(lakhMatch[1]) * 100000;
      }
    }

    // Parse Location keywords
    let matchedLocation: string | undefined;
    const locations = ['dha', 'clifton', 'bahria', 'gulshan', 'emaar', 'crescent bay', 'islamabad', 'lahore', 'karachi'];
    for (const loc of locations) {
      if (lower.includes(loc)) {
        matchedLocation = loc;
        break;
      }
    }

    // Filter properties
    let matches = allProperties.filter((p) => p.status === 'published');

    if (purpose) {
      matches = matches.filter((p) => p.purpose === purpose);
    }
    if (type) {
      const q = type.toLowerCase();
      matches = matches.filter(
        (p) =>
          p.category === q ||
          p.propertyType.toLowerCase().includes(q) ||
          (p as any).type === q
      );
    }
    if (bedrooms) {
      matches = matches.filter((p) => (p.specs?.bedrooms || 0) >= bedrooms);
    }
    if (maxPrice) {
      matches = matches.filter((p) => (p.price || 0) <= maxPrice);
    }
    if (matchedLocation) {
      matches = matches.filter(
        (p) =>
          p.location.area.toLowerCase().includes(matchedLocation!) ||
          p.location.city.toLowerCase().includes(matchedLocation!) ||
          p.society.toLowerCase().includes(matchedLocation!) ||
          p.location.society?.toLowerCase().includes(matchedLocation!)
      );
    }

    // Fallback if strict filter yields 0
    if (matches.length === 0) {
      matches = allProperties
        .filter((p) => p.status === 'published')
        .slice(0, 3);
    } else {
      matches = matches.slice(0, 4);
    }

    const snippets: PropertySnippet[] = matches.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      priceDisplay: p.priceDisplay,
      location: `${p.society || p.location.area}, ${p.city || p.location.city}`,
      image: p.featuredImage || p.images[0],
      type: p.propertyType || p.category || 'Property',
      bedrooms: p.specs?.bedrooms,
    }));

    // Craft conversational response
    let replyText = `I found ${matches.length} premier property option${matches.length === 1 ? '' : 's'} matching your criteria.`;
    if (matchedLocation) {
      replyText += ` in ${matchedLocation.toUpperCase()}`;
    }
    if (bedrooms) {
      replyText += ` with ${bedrooms}+ bedrooms`;
    }
    replyText += '. You can view their full brochures, book a private VIP visit, or reach out to our desk on WhatsApp for instant assistance:';

    return NextResponse.json({
      success: true,
      reply: replyText,
      recommendations: snippets,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'AI processing failed' },
      { status: 500 }
    );
  }
}
