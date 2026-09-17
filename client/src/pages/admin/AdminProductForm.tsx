import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useAdminProduct, useProductMutations } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { Button } from '../../components/ui/Button';
import { Loader2, ArrowLeft, Plus, X, Image as ImageIcon } from 'lucide-react';
import { ApiProduct } from '../../types';

export default function AdminProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const { data: productToEdit, isLoading: isLoadingProduct } = useAdminProduct(id || '');
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  const { createProduct, updateProduct, isCreating, isUpdating } = useProductMutations();

  const [formData, setFormData] = useState<Partial<ApiProduct>>({
    name: '',
    slug: '',
    description: '',
    category: '',
    price: 0,
    compareAtPrice: undefined,
    stockQuantity: 0,
    images: [],
    isNewArrival: false,
    isFeatured: false,
    isTrending: false,
    isBestSeller: false,
    isActive: true,
  });

  const [imageInput, setImageInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && productToEdit) {
      setFormData({
        name: productToEdit.name,
        slug: productToEdit.slug,
        description: productToEdit.description,
        category: typeof productToEdit.category === 'object' ? productToEdit.category._id : productToEdit.category,
        price: productToEdit.price,
        compareAtPrice: productToEdit.compareAtPrice || undefined,
        stockQuantity: productToEdit.stockQuantity,
        images: productToEdit.images || [],
        isNewArrival: productToEdit.isNewArrival,
        isFeatured: productToEdit.isFeatured,
        isTrending: productToEdit.isTrending,
        isBestSeller: productToEdit.isBestSeller,
        isActive: productToEdit.isActive,
      });
    }
  }, [isEditing, productToEdit]);

  // Auto-generate slug from name if empty
  const handleNameChange = (val: string) => {
    setFormData(prev => ({
      ...prev,
      name: val,
      slug: prev.slug || val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }));
  };

  const handleAddImage = () => {
    if (!imageInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), imageInput.trim()]
    }));
    setImageInput('');
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => {
      const newImages = [...(prev.images || [])];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!formData.name || !formData.slug || !formData.description || !formData.category || formData.price === undefined || formData.stockQuantity === undefined) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (formData.price < 0 || formData.stockQuantity < 0) {
      setErrorMsg('Price and Stock Quantity cannot be negative.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (isEditing && id) {
        await updateProduct({ id, data: formData });
      } else {
        await createProduct(formData);
      }
      navigate('/admin/products');
    } catch (err) {
      if (isAxiosError(err)) {
        setErrorMsg(err.response?.data?.message || 'Failed to save product. Check slug uniqueness and inputs.');
      } else {
        setErrorMsg('An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormLoading = isEditing && isLoadingProduct;
  const isSaving = isCreating || isUpdating || isSubmitting;

  if (isFormLoading || isLoadingCategories) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-dark-teal" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/admin/products')}
          className="w-10 h-10 rounded-full bg-white border border-light-neutral flex items-center justify-center text-primary-dark hover:bg-light-neutral/30 transition-colors"
          aria-label="Back to products"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-primary-dark mb-1">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h2>
          <p className="text-primary-dark/60 text-sm">
            {isEditing ? 'Update the product details below.' : 'Create a new product for your catalog.'}
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 mb-6 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-light-neutral shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-primary-dark border-b border-light-neutral/50 pb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-dark">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-light-neutral focus:border-primary-dark-teal focus:ring-1 focus:ring-primary-dark-teal outline-none transition-all text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-dark">Slug (URL snippet) *</label>
              <input
                type="text"
                required
                value={formData.slug || ''}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-light-neutral focus:border-primary-dark-teal focus:ring-1 focus:ring-primary-dark-teal outline-none transition-all text-sm font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-dark">Description *</label>
            <textarea
              required
              rows={4}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-light-neutral focus:border-primary-dark-teal focus:ring-1 focus:ring-primary-dark-teal outline-none transition-all text-sm resize-y"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary-dark">Category *</label>
            <select
              required
              value={formData.category as string || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full md:w-1/2 px-4 py-2.5 rounded-lg border border-light-neutral focus:border-primary-dark-teal focus:ring-1 focus:ring-primary-dark-teal outline-none transition-all text-sm bg-white"
            >
              <option value="" disabled>Select a category</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-light-neutral shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-primary-dark border-b border-light-neutral/50 pb-4">Pricing & Inventory</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-dark">Price (₹) *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.price ?? 0}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-lg border border-light-neutral focus:border-primary-dark-teal focus:ring-1 focus:ring-primary-dark-teal outline-none transition-all text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-dark">Compare At Price (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.compareAtPrice || ''}
                onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-4 py-2.5 rounded-lg border border-light-neutral focus:border-primary-dark-teal focus:ring-1 focus:ring-primary-dark-teal outline-none transition-all text-sm placeholder-primary-dark/30"
                placeholder="Optional"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-dark">Stock Quantity *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stockQuantity ?? 0}
                onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-lg border border-light-neutral focus:border-primary-dark-teal focus:ring-1 focus:ring-primary-dark-teal outline-none transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-light-neutral shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-primary-dark border-b border-light-neutral/50 pb-4">Images</h3>
          <p className="text-sm text-primary-dark/60 -mt-2">Provide absolute image URLs. Image uploading will be supported in a future update.</p>
          
          <div className="flex gap-2">
            <input
              type="url"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImage(); } }}
              placeholder="https://example.com/image.jpg or /images/..."
              className="flex-1 px-4 py-2.5 rounded-lg border border-light-neutral focus:border-primary-dark-teal focus:ring-1 focus:ring-primary-dark-teal outline-none transition-all text-sm"
            />
            <Button type="button" onClick={handleAddImage} variant="outline" className="bg-white flex items-center gap-2">
              <Plus size={16} /> Add
            </Button>
          </div>

          {formData.images && formData.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative group aspect-square rounded-lg border border-light-neutral bg-soft-ivory overflow-hidden flex items-center justify-center">
                  <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-contain mix-blend-multiply" onError={(e) => { e.currentTarget.src = '/images/admin/product-placeholder.svg'; }} />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 w-6 h-6 bg-white/90 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {(!formData.images || formData.images.length === 0) && (
            <div className="aspect-[3/1] border-2 border-dashed border-light-neutral rounded-xl flex flex-col items-center justify-center text-primary-dark/40 bg-soft-ivory/30">
              <ImageIcon size={32} className="mb-2 opacity-50" />
              <span className="text-sm font-medium">No images added</span>
            </div>
          )}
        </div>

        {/* Status & Flags */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-light-neutral shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-primary-dark border-b border-light-neutral/50 pb-4">Status & Flags</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-light-neutral text-primary-dark-teal focus:ring-primary-dark-teal w-4 h-4 cursor-pointer"
              />
              <span className="text-sm font-medium text-primary-dark group-hover:text-primary-dark-teal transition-colors">Active (Visible in Store)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded border-light-neutral text-primary-dark-teal focus:ring-primary-dark-teal w-4 h-4 cursor-pointer"
              />
              <span className="text-sm font-medium text-primary-dark group-hover:text-primary-dark-teal transition-colors">Featured Product</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.isTrending}
                onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                className="rounded border-light-neutral text-primary-dark-teal focus:ring-primary-dark-teal w-4 h-4 cursor-pointer"
              />
              <span className="text-sm font-medium text-primary-dark group-hover:text-primary-dark-teal transition-colors">Trending Product</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.isBestSeller}
                onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                className="rounded border-light-neutral text-primary-dark-teal focus:ring-primary-dark-teal w-4 h-4 cursor-pointer"
              />
              <span className="text-sm font-medium text-primary-dark group-hover:text-primary-dark-teal transition-colors">Best Seller</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.isNewArrival}
                onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                className="rounded border-light-neutral text-primary-dark-teal focus:ring-primary-dark-teal w-4 h-4 cursor-pointer"
              />
              <span className="text-sm font-medium text-primary-dark group-hover:text-primary-dark-teal transition-colors">New Arrival</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 sticky bottom-4 bg-soft-ivory/80 backdrop-blur-md p-4 rounded-xl border border-light-neutral/50">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/admin/products')}
            disabled={isSaving}
            className="bg-white"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={isSaving}
            className="flex items-center gap-2 min-w-[140px] justify-center"
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              'Save Product'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
