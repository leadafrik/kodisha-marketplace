import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface ImageUploadOptions {
  listingId: string;
  file: File;
  userId: string;
  onProgress?: (progress: number) => void;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  image_url: string;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

/**
 * Image Upload Service
 * Handles all image operations for listings
 */
export class ImageUploadService {
  private bucket = 'listing-images';
  private maxFileSize = 5 * 1024 * 1024; // 5MB
  private allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  /**
   * Validates image file before upload
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (!this.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Only JPEG, PNG, and WebP images are allowed',
      };
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      return {
        valid: false,
        error: 'File size must be less than 5MB',
      };
    }

    return { valid: true };
  }

  /**
   * Uploads image to Supabase Storage
   */
  async uploadImage(options: ImageUploadOptions): Promise<string> {
    const { listingId, file, userId, onProgress } = options;

    // Validate file
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Generate unique file path
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${listingId}/${timestamp}-${random}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(this.bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from(this.bucket)
      .getPublicUrl(data.path);

    return publicData.publicUrl;
  }

  /**
   * Saves image metadata to database
   */
  async saveImageMetadata(
    listingId: string,
    imageUrl: string,
    displayOrder: number,
    isPrimary: boolean = false
  ): Promise<ListingImage> {
    const { data, error } = await supabase
      .from('listing_images')
      .insert([
        {
          listing_id: listingId,
          image_url: imageUrl,
          display_order: displayOrder,
          is_primary: isPrimary,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save image metadata: ${error.message}`);
    }

    return data as ListingImage;
  }

  /**
   * Gets all images for a listing
   */
  async getListingImages(listingId: string): Promise<ListingImage[]> {
    const { data, error } = await supabase
      .from('listing_images')
      .select('*')
      .eq('listing_id', listingId)
      .order('display_order', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch images: ${error.message}`);
    }

    return (data || []) as ListingImage[];
  }

  /**
   * Gets primary image for a listing
   */
  async getPrimaryImage(listingId: string): Promise<ListingImage | null> {
    const { data, error } = await supabase
      .from('listing_images')
      .select('*')
      .eq('listing_id', listingId)
      .eq('is_primary', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch primary image: ${error.message}`);
    }

    return (data as ListingImage) || null;
  }

  /**
   * Sets primary image for listing
   */
  async setPrimaryImage(listingId: string, imageId: string): Promise<void> {
    // Clear previous primary
    await supabase
      .from('listing_images')
      .update({ is_primary: false })
      .eq('listing_id', listingId);

    // Set new primary
    const { error } = await supabase
      .from('listing_images')
      .update({ is_primary: true })
      .eq('id', imageId);

    if (error) {
      throw new Error(`Failed to set primary image: ${error.message}`);
    }
  }

  /**
   * Reorders images in listing
   */
  async reorderImages(
    listingId: string,
    imageIds: string[]
  ): Promise<void> {
    const updates = imageIds.map((id, index) => ({
      id,
      display_order: index,
    }));

    const { error } = await supabase
      .from('listing_images')
      .upsert(updates);

    if (error) {
      throw new Error(`Failed to reorder images: ${error.message}`);
    }
  }

  /**
   * Deletes image from storage and database
   */
  async deleteImage(imageId: string, imageUrl: string): Promise<void> {
    // Extract file path from URL
    const urlParts = imageUrl.split('/');
    const filePath = urlParts.slice(-3).join('/');

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(this.bucket)
      .remove([filePath]);

    if (storageError) {
      console.warn('Storage deletion warning:', storageError);
      // Continue even if storage deletion fails
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('listing_images')
      .delete()
      .eq('id', imageId);

    if (dbError) {
      throw new Error(`Failed to delete image: ${dbError.message}`);
    }
  }

  /**
   * Deletes all images for a listing
   */
  async deleteListingImages(listingId: string): Promise<void> {
    // Get all images
    const images = await this.getListingImages(listingId);

    // Delete from storage
    const filePaths = images.map((img) => {
      const urlParts = img.image_url.split('/');
      return urlParts.slice(-3).join('/');
    });

    if (filePaths.length > 0) {
      await supabase.storage
        .from(this.bucket)
        .remove(filePaths)
        .catch((err) => console.warn('Storage deletion warning:', err));
    }

    // Delete from database
    const { error } = await supabase
      .from('listing_images')
      .delete()
      .eq('listing_id', listingId);

    if (error) {
      throw new Error(`Failed to delete listing images: ${error.message}`);
    }
  }
}

export const imageUploadService = new ImageUploadService();
