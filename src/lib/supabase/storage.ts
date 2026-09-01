import { supabase } from './client';

/**
 * Uploads a base64 data URL or File object to the Supabase 'property-images' storage bucket
 * and returns the public CDN URL.
 */
export async function uploadPropertyImage(
  fileOrDataUrl: File | string,
  folder = 'listings'
): Promise<string> {
  try {
    let fileBody: Blob | File;
    let extension = 'webp';

    if (typeof fileOrDataUrl === 'string') {
      // Base64 data URL
      const match = fileOrDataUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
      if (!match) {
        // If it's already a regular http/https URL, return it as-is
        if (fileOrDataUrl.startsWith('http://') || fileOrDataUrl.startsWith('https://')) {
          return fileOrDataUrl;
        }
        throw new Error('Invalid image format');
      }

      extension = match[1] === 'jpeg' ? 'jpg' : match[1];
      const base64Data = match[2];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      fileBody = new Blob([byteArray], { type: `image/${extension}` });
    } else {
      fileBody = fileOrDataUrl;
      const parts = fileOrDataUrl.name.split('.');
      if (parts.length > 1) {
        extension = parts.pop() || 'webp';
      }
    }

    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${extension}`;

    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(fileName, fileBody, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.warn('Supabase storage upload error:', error.message);
      // If upload failed, fallback to the original string/url
      return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : URL.createObjectURL(fileOrDataUrl);
    }

    const { data: publicUrlData } = supabase.storage
      .from('property-images')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.warn('Storage helper error:', err);
    return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '';
  }
}
