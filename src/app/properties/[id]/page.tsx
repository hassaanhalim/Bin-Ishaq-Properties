import React from 'react';
import { notFound } from 'next/navigation';
import { getPropertyById, getProperties } from '@/lib/db';
import PropertyDetailView from '@/components/properties/PropertyDetailView';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = getPropertyById(id);

  if (!property) {
    return {
      title: 'Property Not Found | Elysian Luxury Estates',
    };
  }

  return {
    title: `${property.title} | Elysian Luxury Real Estate`,
    description: property.description.slice(0, 160),
    openGraph: {
      images: [property.featuredImage],
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = getPropertyById(id);

  if (!property) {
    notFound();
  }

  const allProperties = getProperties();
  const relatedProperties = allProperties
    .filter((p) => p.id !== property.id && (p.status === 'published' || p.status === 'sold'))
    .slice(0, 3);

  return (
    <PropertyDetailView
      property={property}
      relatedProperties={relatedProperties}
    />
  );
}
