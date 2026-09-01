import { NextResponse } from 'next/server';
import { getProperties, createProperty } from '@/lib/db';
import { PropertyFilterParams, Property } from '@/types/property';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const params: PropertyFilterParams = {
    purpose: (searchParams.get('purpose') as any) || undefined,
    category: (searchParams.get('category') as any) || undefined,
    society: searchParams.get('society') || undefined,
    developer: searchParams.get('developer') || undefined,
    type: (searchParams.get('type') as any) || undefined,
    city: searchParams.get('city') || undefined,
    area: searchParams.get('area') || undefined,
    sizeRange: searchParams.get('sizeRange') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    minBedrooms: searchParams.get('minBedrooms') ? Number(searchParams.get('minBedrooms')) : undefined,
    minBathrooms: searchParams.get('minBathrooms') ? Number(searchParams.get('minBathrooms')) : undefined,
    isFeatured: searchParams.get('isFeatured') === 'true' ? true : undefined,
    sortBy: (searchParams.get('sortBy') as any) || 'newest',
  };

  try {
    let query = supabaseAdmin.from('properties').select('*');

    if (params.purpose) query = query.eq('purpose', params.purpose);
    if (params.category) query = query.eq('category', params.category);
    if (params.type) query = query.eq('property_type', params.type);
    if (params.minPrice) query = query.gte('price', params.minPrice);
    if (params.maxPrice) query = query.lte('price', params.maxPrice);
    if (params.isFeatured !== undefined) query = query.eq('is_featured', params.isFeatured);

    const { data: dbData, error } = await query;

    if (!error && dbData && dbData.length > 0) {
      let mapped: Property[] = dbData.map((row) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        description: row.description,
        price: Number(row.price),
        purpose: row.purpose,
        propertyType: row.property_type || 'Residential Plot',
        type: row.property_type,
        category: row.category,
        society: row.society,
        developer: row.developer,
        city: row.city,
        location: row.location || { city: row.city, area: row.society, society: row.society, address: '' },
        specs: row.specs || { bedrooms: 0, bathrooms: 0, areaSize: 0, areaUnit: 'marla' },
        attributes: row.attributes || {},
        images: row.images || [],
        featuredImage: row.featured_image || row.images?.[0] || '',
        features: row.features || [],
        status: row.status,
        isFeatured: row.is_featured,
        isVerified: row.is_verified,
        viewsCount: row.views_count || 0,
        inquiriesCount: row.inquiries_count || 0,
        submittedBy: row.submitted_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));

      if (params.society && params.society !== 'all') {
        const q = params.society.toLowerCase();
        if (q === 'other') {
          const primes = ['mpchs', 'faisal', 'bahria'];
          mapped = mapped.filter(
            (p) =>
              p.society.toLowerCase().includes('other') ||
              !primes.some((pr) => p.society.toLowerCase().includes(pr))
          );
        } else {
          mapped = mapped.filter(
            (p) =>
              p.society.toLowerCase().includes(q) ||
              p.developer.toLowerCase().includes(q)
          );
        }
      }

      return NextResponse.json({ success: true, count: mapped.length, data: mapped });
    }
  } catch (err) {
    console.warn('Supabase query fallback:', err);
  }

  const properties = getProperties(params);
  return NextResponse.json({ success: true, count: properties.length, data: properties });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProperty = createProperty(body);

    try {
      await supabaseAdmin.from('properties').insert({
        id: newProperty.id,
        slug: newProperty.slug,
        title: newProperty.title,
        description: newProperty.description,
        price: newProperty.price,
        purpose: newProperty.purpose,
        property_type: newProperty.propertyType || newProperty.type,
        category: newProperty.category,
        society: newProperty.society,
        developer: newProperty.developer,
        city: newProperty.city,
        location: newProperty.location,
        specs: { ...newProperty.specs, ...newProperty.attributes },
        images: newProperty.images,
        featured_image: newProperty.featuredImage,
        features: newProperty.features,
        status: newProperty.status,
        is_featured: newProperty.isFeatured,
        is_verified: newProperty.isVerified,
        views_count: 0,
        inquiries_count: 0,
        submitted_by: newProperty.submittedBy,
        created_at: newProperty.createdAt,
        updated_at: newProperty.updatedAt,
      });
    } catch (err) {
      console.warn('Supabase insert warning:', err);
    }

    return NextResponse.json({ success: true, data: newProperty }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid property payload' }, { status: 400 });
  }
}
