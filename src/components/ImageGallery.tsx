'use client';

import { FC, useState, useEffect } from 'react';
import { Trash2, Star, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { ListingImage } from '@/lib/imageUpload';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ImageGalleryProps {
  listingId: string;
  editable?: boolean;
  onImageDeleted?: (imageId: string) => void;
  onError?: (error: string) => void;
}

const ImageGallery: FC<ImageGalleryProps> = ({
  listingId,
  editable = false,
  onImageDeleted,
  onError,
}) => {
  const [images, setImages] = useState<ListingImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, [listingId]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('listing_images')
        .select('*')
        .eq('listing_id', listingId)
        .order('display_order', { ascending: true });

      if (error) throw error;

      setImages((data as ListingImage[]) || []);
      setCurrentImageIndex(0);
    } catch (err: any) {
      onError?.(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      setDeleting(imageId);

      const response = await fetch(
        `/api/images/delete?imageId=${imageId}&listingId=${listingId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Delete failed');
      }

      setImages(images.filter((img) => img.id !== imageId));
      onImageDeleted?.(imageId);

      if (currentImageIndex >= images.length - 1) {
        setCurrentImageIndex(Math.max(0, images.length - 2));
      }
    } catch (err: any) {
      onError?.(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    try {
      const response = await fetch(`/api/images/primary`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId, listingId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to set primary');
      }

      // Update local state
      setImages(
        images.map((img) => ({
          ...img,
          is_primary: img.id === imageId,
        }))
      );
    } catch (err: any) {
      onError?.(err.message);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
        <p className="text-gray-600 text-lg">No images yet</p>
        {editable && (
          <p className="text-gray-500 text-sm mt-2">Upload your first image to get started</p>
        )}
      </div>
    );
  }

  const currentImage = images[currentImageIndex];

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square max-h-96">
        <img
          src={currentImage.image_url}
          alt="Listing"
          className="w-full h-full object-cover"
        />

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentImageIndex((i) => (i === 0 ? images.length - 1 : i - 1))
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() =>
                setCurrentImageIndex((i) => (i === images.length - 1 ? 0 : i + 1))
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}

        {/* Edit Actions */}
        {editable && (
          <div className="absolute top-3 right-3 flex gap-2">
            {!currentImage.is_primary && (
              <button
                onClick={() => handleSetPrimary(currentImage.id)}
                title="Set as primary"
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition"
              >
                <Star size={18} />
              </button>
            )}
            <button
              onClick={() => handleDeleteImage(currentImage.id)}
              disabled={deleting === currentImage.id}
              title="Delete image"
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition disabled:opacity-50"
            >
              {deleting === currentImage.id ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Trash2 size={18} />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setCurrentImageIndex(idx)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                currentImageIndex === idx
                  ? 'border-blue-600'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <img
                src={img.image_url}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {img.is_primary && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
