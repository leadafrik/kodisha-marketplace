'use client';

import { FC, useRef, useState } from 'react';
import { Upload, X, Loader2, AlertCircle } from 'lucide-react';
import { ListingImage } from '@/lib/imageUpload';

interface ImageUploadProps {
  listingId: string;
  onImageUploaded?: (image: ListingImage) => void;
  onError?: (error: string) => void;
  maxImages?: number;
}

const ImageUpload: FC<ImageUploadProps> = ({
  listingId,
  onImageUploaded,
  onError,
  maxImages = 10,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files?.[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    try {
      setLoading(true);
      setError('');

      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image must be less than 5MB');
      }

      // Upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('listingId', listingId);
      formData.append('isPrimary', 'false');

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onImageUploaded?.(data.image);
    } catch (err: any) {
      const errorMsg = err.message;
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
          className="hidden"
        />

        {loading ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <p className="text-sm font-medium text-gray-900">
              Drag and drop your image here
            </p>
            <p className="text-xs text-gray-500">
              or click to select (JPEG, PNG, WebP • Max 5MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-center space-x-2 text-red-700 bg-red-50 border border-red-200 rounded p-3">
          <AlertCircle size={18} />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
