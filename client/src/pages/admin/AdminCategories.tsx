import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAdminCategories, useCategoryMutations } from '../../hooks/useCategories';
import { Button } from '../../components/ui/Button';
import { IconButton } from '../../components/ui/IconButton';
import { 
  Plus, Search, Edit2, Trash2, Power, PowerOff, 
  Loader2, Filter, X, ArrowUp, ArrowDown 
} from 'lucide-react';
import { ApiCategory } from '../../types';
import { isAxiosError } from 'axios';

export default function AdminCategories() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const { data: categories = [], isLoading, isError } = useAdminCategories(status);
  const { updateCategory, deleteCategory, isUpdating, isDeleting } = useCategoryMutations();
  
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);

  // Client-side search filtering
  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const lowerSearch = search.toLowerCase();
    return categories.filter(c => 
      c.name.toLowerCase().includes(lowerSearch) || 
      c.slug.toLowerCase().includes(lowerSearch) || 
      (c.description && c.description.toLowerCase().includes(lowerSearch))
    );
  }, [categories, search]);

  const hasActiveFilters = search.trim() !== '' || status !== 'all';

  const handleClearFilters = () => {
    setSearch('');
    setStatus('all');
  };

  const toggleActiveStatus = async (category: ApiCategory) => {
    try {
      await updateCategory({ id: category._id, data: { isActive: !category.isActive } });
    } catch (err) {
      const msg = isAxiosError(err) ? (err.response?.data?.message || err.message) : (err as Error).message;
      alert(`Failed to update category status: ${msg}`);
    }
  };

  const confirmDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteCategory(id);
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response?.status === 409) {
          alert(err.response.data.message || 'Cannot delete category because it is in use.');
        } else {
          alert(`Failed to delete category: ${err.response?.data?.message || err.message}`);
        }
      } else {
        alert(`Failed to delete category: ${(err as Error).message}`);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const moveCategory = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredCategories.length) return;

    const currentCat = filteredCategories[index];
    const targetCat = filteredCategories[targetIndex];

    setMovingId(currentCat._id);
    try {
      // Swap their sortOrder values. 
      // If they somehow have the same sortOrder, just force a clean offset.
      let newCurrentSort = targetCat.sortOrder;
      const newTargetSort = currentCat.sortOrder;
      if (newCurrentSort === newTargetSort) {
        newCurrentSort = direction === 'up' ? newTargetSort - 1 : newTargetSort + 1;
      }

      await Promise.all([
        updateCategory({ id: currentCat._id, data: { sortOrder: newCurrentSort } }),
        updateCategory({ id: targetCat._id, data: { sortOrder: newTargetSort } })
      ]);
    } catch (err) {
      const msg = isAxiosError(err) ? (err.response?.data?.message || err.message) : (err as Error).message;
      alert(`Failed to reorder categories: ${msg}`);
    } finally {
      setMovingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary-dark mb-1">Categories</h2>
          <p className="text-primary-dark/60 text-sm">Manage the collections used across the Mobitech store.</p>
        </div>
        <Link to="/admin/categories/new">
          <Button variant="primary" className="flex items-center gap-2 w-full sm:w-auto">
            <Plus size={18} />
            Add Category
          </Button>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-light-neutral shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-dark/40" size={18} />
            <input 
              type="text" 
              placeholder="Search categories by name or description..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-light-neutral focus:border-primary-dark-teal focus:ring-1 focus:ring-primary-dark-teal outline-none transition-all text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-primary-dark/40" />
              <span className="text-sm font-medium text-primary-dark/60">Status:</span>
            </div>
            
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="text-sm border border-light-neutral rounded-md px-3 py-2 outline-none focus:border-primary-dark-teal"
            >
              <option value="all">All</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>

            {hasActiveFilters && (
              <button 
                onClick={handleClearFilters}
                className="text-sm text-primary-dark-teal hover:underline flex items-center gap-1"
              >
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category List */}
      <div className="bg-white rounded-xl border border-light-neutral shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-dark-teal" />
          </div>
        ) : isError ? (
          <div className="py-12 text-center text-red-600 font-medium">
            Failed to load categories. Please try again.
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <p className="text-primary-dark/60 font-medium mb-4">No categories found.</p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-soft-ivory/50 border-b border-light-neutral text-xs uppercase tracking-wider text-primary-dark/60">
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Sort Order</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-neutral text-sm">
                  {filteredCategories.map((category, index) => {
                    const imageSrc = category.image || '/images/admin/category-placeholder.svg';
                    const isMoving = movingId === category._id;

                    return (
                      <tr key={category._id} className={`hover:bg-soft-ivory/20 transition-colors group ${isMoving ? 'opacity-50' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-soft-ivory border border-light-neutral flex items-center justify-center overflow-hidden flex-shrink-0">
                              <img src={imageSrc} alt={category.name} className="w-full h-full object-contain mix-blend-multiply" onError={(e) => { e.currentTarget.src = '/images/admin/category-placeholder.svg'; }} />
                            </div>
                            <div>
                              <div className="font-bold text-primary-dark flex items-center gap-2">
                                {category.name}
                                <span className="text-xs text-primary-dark/50 font-mono font-normal">{category.slug}</span>
                              </div>
                              {category.description && (
                                <div className="text-xs text-primary-dark/60 mt-0.5 line-clamp-1 max-w-md">{category.description}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                            category.isActive 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-light-neutral text-primary-dark/60'
                          }`}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 font-mono text-primary-dark/60">
                          {category.sortOrder}
                        </td>
                        
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            {/* Reorder actions */}
                            <IconButton 
                              icon={ArrowUp} 
                              variant="outline" 
                              aria-label="Move up"
                              disabled={index === 0 || isMoving}
                              onClick={() => moveCategory(index, 'up')}
                              className="w-8 h-8 bg-white border-transparent hover:border-light-neutral text-primary-dark/40 hover:text-primary-dark"
                            />
                            <IconButton 
                              icon={ArrowDown} 
                              variant="outline" 
                              aria-label="Move down"
                              disabled={index === filteredCategories.length - 1 || isMoving}
                              onClick={() => moveCategory(index, 'down')}
                              className="w-8 h-8 bg-white border-transparent hover:border-light-neutral text-primary-dark/40 hover:text-primary-dark mr-2"
                            />

                            {/* Standard actions */}
                            <Link to={`/admin/categories/${category._id}/edit`}>
                              <IconButton 
                                icon={Edit2} 
                                variant="outline" 
                                aria-label="Edit category"
                                className="w-8 h-8 bg-white"
                              />
                            </Link>
                            <IconButton 
                              icon={category.isActive ? PowerOff : Power} 
                              variant="outline" 
                              aria-label={category.isActive ? "Deactivate category" : "Activate category"}
                              onClick={() => toggleActiveStatus(category)}
                              disabled={isUpdating}
                              className={`w-8 h-8 bg-white ${category.isActive ? 'hover:text-amber-600' : 'hover:text-green-600'}`}
                            />
                            <IconButton 
                              icon={Trash2} 
                              variant="outline" 
                              aria-label="Delete category"
                              onClick={() => confirmDelete(category._id)}
                              disabled={deletingId === category._id || isDeleting}
                              className="w-8 h-8 bg-white hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="lg:hidden divide-y divide-light-neutral">
              {filteredCategories.map((category, index) => {
                const imageSrc = category.image || '/images/admin/category-placeholder.svg';
                const isMoving = movingId === category._id;

                return (
                  <div key={category._id} className={`p-4 bg-white flex flex-col gap-4 ${isMoving ? 'opacity-50' : ''}`}>
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg bg-soft-ivory border border-light-neutral flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img src={imageSrc} alt={category.name} className="w-full h-full object-contain mix-blend-multiply" onError={(e) => { e.currentTarget.src = '/images/admin/category-placeholder.svg'; }} />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-primary-dark">{category.name}</div>
                        <div className="text-xs text-primary-dark/60 font-mono mt-0.5">{category.slug}</div>
                        {category.description && (
                          <div className="text-xs text-primary-dark/50 mt-1 line-clamp-2">{category.description}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-soft-ivory/30 rounded-lg p-3 border border-light-neutral/50">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                          category.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-light-neutral text-primary-dark/60'
                        }`}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-xs font-mono text-primary-dark/50">Ord: {category.sortOrder}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <IconButton 
                          icon={ArrowUp} 
                          variant="outline" 
                          aria-label="Move up"
                          disabled={index === 0 || isMoving}
                          onClick={() => moveCategory(index, 'up')}
                          className="w-8 h-8 bg-white border-transparent text-primary-dark/40"
                        />
                        <IconButton 
                          icon={ArrowDown} 
                          variant="outline" 
                          aria-label="Move down"
                          disabled={index === filteredCategories.length - 1 || isMoving}
                          onClick={() => moveCategory(index, 'down')}
                          className="w-8 h-8 bg-white border-transparent text-primary-dark/40 mr-2"
                        />
                        <Link to={`/admin/categories/${category._id}/edit`}>
                          <IconButton 
                            icon={Edit2} 
                            variant="outline" 
                            aria-label="Edit category"
                            className="w-8 h-8 bg-white"
                          />
                        </Link>
                        <IconButton 
                          icon={Trash2} 
                          variant="outline" 
                          aria-label="Delete category"
                          onClick={() => confirmDelete(category._id)}
                          disabled={deletingId === category._id || isDeleting}
                          className="w-8 h-8 bg-white hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
