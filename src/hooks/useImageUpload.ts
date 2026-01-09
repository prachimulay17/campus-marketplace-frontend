import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import api, { endpoints, createFormData } from '@/lib/api';
import { toast } from 'sonner';

interface ImageUploadResponse {
  images: string[];
}

export const useImageUpload = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]): Promise<string[]> => {
      if (files.length === 0) return [];

      const formData = createFormData(files);
      const response = await api.post<{ success: boolean; data: ImageUploadResponse; message: string }>(
        endpoints.upload.images,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Upload failed');
      }

      return response.data.data.images;
    },
    onSuccess: (uploadedUrls) => {
      setUploadedImages(prev => [...prev, ...uploadedUrls]);
      toast.success(`Successfully uploaded ${uploadedUrls.length} image(s)`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to upload images');
    },
  });

  const uploadImages = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      toast.error('Only JPEG, PNG, and WebP images are allowed');
      return;
    }

    // Validate file sizes (max 5MB per file)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      toast.error('Each image must be smaller than 5MB');
      return;
    }

    // Limit to 5 images total
    const totalImages = uploadedImages.length + files.length;
    if (totalImages > 5) {
      toast.error('Maximum 5 images allowed per item');
      return;
    }

    setIsUploading(true);
    try {
      await uploadMutation.mutateAsync(files);
    } finally {
      setIsUploading(false);
    }
  }, [uploadedImages.length, uploadMutation]);

  const removeImage = useCallback((index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearImages = useCallback(() => {
    setUploadedImages([]);
  }, []);

  return {
    uploadedImages,
    isUploading: isUploading || uploadMutation.isPending,
    uploadImages,
    removeImage,
    clearImages,
    uploadError: uploadMutation.error,
  };
};
