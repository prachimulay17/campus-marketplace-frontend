import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, X, Plus, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Layout from '@/components/Layout';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api, { endpoints } from '@/lib/api';
import { CreateItemFormData, Category, Condition, ItemResponse, Item } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const PostItem = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreateItemFormData>({
    title: '',
    description: '',
    price: 0,
    category: 'Books',
    condition: 'New',
    images: [],
    location: '',
    tags: [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateItemFormData | 'images', string>>>({});

  const {
    uploadedImages,
    isUploading,
    uploadImages,
    removeImage: removeUploadedImage,
    clearImages,
  } = useImageUpload();

  // Categories matching backend enum
  const categories = [
    { id: 'Books', label: 'Books' },
    { id: 'Electronics', label: 'Electronics' },
    { id: 'Furniture', label: 'Furniture' },
    { id: 'Clothing', label: 'Clothing' },
    { id: 'Others', label: 'Others' },
  ] as const;

  // Conditions matching backend enum
  const conditions = [
    { id: 'New', label: 'New' },
    { id: 'Like New', label: 'Like New' },
    { id: 'Used', label: 'Used' },
    { id: 'Poor', label: 'Poor' },
  ] as const;

  // Create item mutation
  const createItemMutation = useMutation({
    mutationFn: async (data: CreateItemFormData) => {
      const itemData = {
        ...data,
        images: uploadedImages,
        price: Number(data.price),
      };
      const response = await api.post<{ data: { item: Item } }>(endpoints.items.create, itemData);
      return response.data.data.item;
    },
    onSuccess: () => {
      toast.success('Item posted successfully!');
      queryClient.invalidateQueries({ queryKey: ['items'] });
      navigate('/browse');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to post item');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'price' ? (value === '' ? 0 : Number(value)) : value,
    }));
    clearFieldError(id as keyof CreateItemFormData);
  };

  const handleSelectChange = (field: keyof CreateItemFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    clearFieldError(field);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      uploadImages(Array.from(files));
    }
    clearFieldError('images');
    e.target.value = '';
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateItemFormData | 'images', string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (uploadedImages.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearFieldError = (field: keyof CreateItemFormData | 'images') => {
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isUploading) {
      toast.error('Please wait for images to finish uploading');
      return;
    }

    if (!validate()) return;

    createItemMutation.mutate(formData);
  };


  return (
    <Layout>
      <div className="editorial-bg">
        <div className="container py-6 md:py-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <Link
                to="/browse"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Browse
              </Link>
              <h1 className="editorial-serif text-3xl md:text-4xl font-bold text-gray-900 mb-2">Post an Item</h1>
              <p className="text-gray-600 text-sm">Fill in the details to list your item for sale</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-3">
                <Label className="text-gray-800 font-medium">Photos (1-5 required)</Label>
                <div className="story-note p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                        <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        <button
                          type="button"
                          onClick={() => { removeUploadedImage(index); clearFieldError('images'); }}
                          className="absolute top-2 right-2 p-1 bg-gray-900/70 text-white rounded-full hover:bg-gray-900/90 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        {/* Polaroid-style bottom border */}
                        <div className="absolute bottom-0 left-0 right-0 h-3 bg-white opacity-90"></div>
                      </div>
                    ))}
                    {uploadedImages.length < 5 && (
                      <label className={cn(
                        "aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors",
                        isUploading && "opacity-50 cursor-not-allowed"
                      )}>
                        {isUploading ? (
                          <Loader2 className="h-6 w-6 text-gray-400 mb-1 animate-spin" />
                        ) : (
                          <Plus className="h-6 w-6 text-gray-400 mb-1" />
                        )}
                        <span className="text-xs text-gray-500">
                          {isUploading ? 'Uploading...' : 'Add Photo'}
                        </span>
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          multiple
                          onChange={handleImageUpload}
                          disabled={isUploading}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  {errors.images && (
                    <p className="text-sm text-red-600 mt-2">{errors.images}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Upload up to 5 images. Each image must be less than 5MB and in JPEG, PNG, or WebP format.
                  </p>
                </div>
              </div>

              {/* Form Fields in Story Note Cards */}
              <div className="story-note p-5 space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-800 font-medium">Item Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Calculus Textbook - 8th Edition"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    minLength={3}
                    maxLength={100}
                    className={cn(
                      "border-gray-200 focus:border-orange-300 focus:ring-orange-100 bg-white",
                      errors.title && "border-red-300 focus:border-red-400 focus:ring-red-100"
                    )}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-800 font-medium">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your item, including any wear, included accessories, etc."
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                    minLength={10}
                    maxLength={1000}
                    className={cn(
                      "border-gray-200 focus:border-orange-300 focus:ring-orange-100 bg-white resize-none",
                      errors.description && "border-red-300 focus:border-red-400 focus:ring-red-100"
                    )}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description}</p>
                  )}
                </div>
              </div>

              <div className="story-note p-5 space-y-4">
                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-gray-800 font-medium">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price || ''}
                    onChange={handleChange}
                    required
                    className={cn(
                      "border-gray-200 focus:border-orange-300 focus:ring-orange-100 bg-white",
                      errors.price && "border-red-300 focus:border-red-400 focus:ring-red-100"
                    )}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-600">{errors.price}</p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-800 font-medium">Location (Optional)</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Campus Library, Room 123"
                    value={formData.location}
                    onChange={handleChange}
                    maxLength={100}
                    className="border-gray-200 focus:border-orange-300 focus:ring-orange-100 bg-white"
                  />
                </div>

                {/* Category & Condition */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-800 font-medium">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleSelectChange('category', value)}
                    >
                      <SelectTrigger className="border-gray-200 focus:border-orange-300 focus:ring-orange-100 bg-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-800 font-medium">Condition</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) => handleSelectChange('condition', value)}
                    >
                      <SelectTrigger className="border-gray-200 focus:border-orange-300 focus:ring-orange-100 bg-white">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        {conditions.map((condition) => (
                          <SelectItem key={condition.id} value={condition.id}>
                            {condition.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="story-note p-5">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg"
                  disabled={createItemMutation.isPending || isUploading || uploadedImages.length === 0}
                >
                  {createItemMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting Item...
                    </>
                  ) : (
                    'Post Item'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PostItem;
