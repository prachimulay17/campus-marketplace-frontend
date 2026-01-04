import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, X, Plus } from 'lucide-react';
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
import { categories, conditions } from '@/data/mockData';
import { cn } from '@/lib/utils';

const PostItem = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
  });
  const [images, setImages] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newImages].slice(0, 4));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI only - no backend logic
    console.log('Post item:', { ...formData, images });
  };

  return (
    <Layout>
      <div className="container py-6 md:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Post an Item</h1>
            <p className="text-muted-foreground">Fill in the details to list your item for sale</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-3">
              <Label>Photos (up to 4)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                    <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-foreground/80 text-background rounded-full hover:bg-foreground transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {images.length < 4 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors">
                    <Plus className="h-6 w-6 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
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
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            {/* Category & Condition */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map((category) => (
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
                  onValueChange={(value) => setFormData({ ...formData, condition: value })}
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
            <Button type="submit" variant="hero" size="lg" className="w-full">
              Post Item
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default PostItem;
