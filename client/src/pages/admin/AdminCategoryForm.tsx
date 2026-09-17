import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useAdminCategory, useCategoryMutations } from '../../hooks/useCategories';
import { Button } from '../../components/ui/Button';
import { Loader2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { ApiCategory } from '../../types';

export default function AdminCategoryForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const { data: categoryToEdit, isLoading: isLoadingCategory } = useAdminCategory(id || '');
  const { createCategory, updateCategory, isCreating, isUpdating } = useCategoryMutations();

  const [formData, setFormData] = useState<Partial<ApiCategory>>({
    name: '',
    slug: '',
    description: '',
    image: '',
    sortOrder: 0,
    isActive: true,
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && categoryToEdit) {
      setFormData({
        name: categoryToEdit.name,
        slug: categoryToEdit.slug,
        description: categoryToEdit.description || '',
        image: categoryToEdit.image || '',
        sortOrder: categoryToEdit.sortOrder,
        isActive: categoryToEdit.isActive,
      });
    }
  }, [isEditing, categoryToEdit]);

  // Auto-generate slug from name if empty
  const handleNameChange = (val: string) => {
    setFormData(prev => ({
      ...prev,
      name: val,
      slug: prev.slug || val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!formData.name || !formData.slug || formData.sortOrder === undefined) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (isEditing && id) {
        await updateCategory({ id, data: formData });
      } else {
        await createCategory(formData);
      }
      navigate('/admin/categories');
    } catch (err) {
      if (isAxiosError(err)) {
        setErrorMsg(err.response?.data?.message || 'Failed to save category. Check slug uniqueness and inputs.');
      } else {
        setErrorMsg('An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormLoading = isEditing && isLoadingCategory;
  const isSaving = isCreating || isUpdating || isSubmitting;

  if (isFormLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-dark-teal" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          type="button"
          onClick={() => navigate('/admin/categories')}
          className="w-10 h-10 rounded-full bg-white border border-light-neutral flex items-center justify-center text-primary-dark hover:bg-light-neutral/30 transition-colors"
          aria-label="Back to categories"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-primary-dark mb-1">
            {isEditing ? 'Edit Category' : 'Add New Category'}
          </h2>
          <p className="text-primary-dark/60 text-sm">
            {isEditing ? 'Update the category details below.' : 'Create a new category collection.'}
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
              <label className="block text-sm font-medium text-primary-dark">Category Name *</label>
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
            <label className="block text-sm font-medium text-primary-dark">Description</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-light-neutral focus:border-primary-dark-teal focus:ring-1 focus:ring-primary-dark-teal outline-none transition-all text-sm resize-y"
              placeholder="Optional brief description of the category..."
            />
          </div>
        </div>

        {/* Display & Sorting */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-light-neutral shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-primary-dark border-b border-light-neutral/50 pb-4">Display & Sorting</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-primary-dark">Image URL</label>
                <input
                  type="url"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2.5 rounded-lg border border-light-neutral focus:border-primary-dark-teal focus:ring-1 focus:ring-primary-dark-teal outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-primary-dark">Sort Order *</label>
                <input
                  type="number"
                  required
                  value={formData.sortOrder ?? 0}
                  onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                  className="w-full md:w-1/2 px-4 py-2.5 rounded-lg border border-light-neutral focus:border-primary-dark-teal focus:ring-1 focus:ring-primary-dark-teal outline-none transition-all text-sm"
                />
                <p className="text-xs text-primary-dark/40 mt-1">Lower numbers appear first.</p>
              </div>

              <label className="flex items-center gap-3 cursor-pointer group mt-4">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-light-neutral text-primary-dark-teal focus:ring-primary-dark-teal w-4 h-4 cursor-pointer"
                />
                <span className="text-sm font-medium text-primary-dark group-hover:text-primary-dark-teal transition-colors">Active (Visible in Store)</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark mb-2">Image Preview</label>
              <div className="aspect-square w-full max-w-[200px] border border-light-neutral rounded-xl bg-soft-ivory overflow-hidden flex flex-col items-center justify-center text-primary-dark/40 shadow-sm mx-auto md:mx-0">
                {formData.image ? (
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="w-full h-full object-contain mix-blend-multiply p-2" 
                    onError={(e) => { e.currentTarget.src = '/images/admin/category-placeholder.svg'; }}
                  />
                ) : (
                  <>
                    <ImageIcon size={32} className="mb-2 opacity-50" />
                    <span className="text-sm font-medium">No image</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 sticky bottom-4 bg-soft-ivory/80 backdrop-blur-md p-4 rounded-xl border border-light-neutral/50">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/admin/categories')}
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
              'Save Category'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
