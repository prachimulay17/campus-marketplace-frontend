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
import { CreateItemFormData, Category, Condition, ItemResponse } from '@/types';
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
      const response = await api.post<ItemResponse>(endpoints.items.create, itemData);
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
  };

  const handleSelectChange = (field: keyof CreateItemFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      uploadImages(Array.from(files));
    }
    // Clear the input
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (formData.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }
    if (uploadedImages.length === 0) {
      toast.error('At least one image is required');
      return;
    }

    createItemMutation.mutate(formData);
  };

  return (
    <Layout>
      <div className="container py-6 md:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Browse
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Post an Item</h1>
            <p className="text-muted-foreground">Fill in the details to list your item for sale</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-3">
              <Label>Photos (1-5 required)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                    <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeUploadedImage(index)}
                      className="absolute top-2 right-2 p-1 bg-foreground/80 text-background rounded-full hover:bg-foreground transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {uploadedImages.length < 5 && (
                  <label className={cn(
                    "aspect-square rounded-xl border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors",
                    isUploading && "opacity-50 cursor-not-allowed"
                  )}>
                    {isUploading ? (
                      <Loader2 className="h-6 w-6 text-muted-foreground mb-1 animate-spin" />
                    ) : (
                      <Plus className="h-6 w-6 text-muted-foreground mb-1" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {isUploading ? 'Uploading...' : 'Add Photo'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Upload up to 5 images. Each image must be less than 5MB and in JPEG, PNG, or WebP format.
              </p>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Item Title</Label>
              <Input
                id="title"
                placeholder="e.g., Calculus Textbook - 8th Edition"
                value={formData.title}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={100}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your item, including any wear, included accessories, etc."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
                minLength={10}
                maxLength={1000}
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.price || ''}
                onChange={handleChange}
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                placeholder="e.g., Campus Library, Room 123"
                value={formData.location}
                onChange={handleChange}
                maxLength={100}
              />
            </div>

            {/* Category & Condition */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Condition</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => handleSelectChange('condition', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition.id} value={condition.id}>
                        {condition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
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
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default PostItem;
